import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from './types';
import { supabase } from '@/integrations/supabase/client';
import { AuthError, Session } from '@supabase/supabase-js';
import { exchangeCodeForTokens } from "@/integrations/google/meet";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for development/testing fallback
const MOCK_USERS = [
  {
    id: "1",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "mentor" as UserRole,
    bio: "Senior Software Engineer with 10+ years of experience. Specializing in React, Node.js and cloud architecture.",
    skills: ["React", "Node.js", "AWS", "System Design"],
    profileImage: "/placeholder.svg",
    rating: 4.8,
    sessionsCompleted: 24
  },
  {
    id: "2",
    name: "John Doe",
    email: "john@example.com",
    role: "mentee" as UserRole,
    bio: "Junior developer looking to improve my React and backend skills.",
    skills: ["HTML", "CSS", "JavaScript", "React basics"],
    profileImage: "/placeholder.svg",
    rating: 4.5,
    sessionsCompleted: 8
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession);
        if (currentSession?.user) {
          fetchUserProfile(currentSession);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      if (currentSession?.user) {
        fetchUserProfile(currentSession);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile data from profiles table
  const fetchUserProfile = async (session: Session) => {
    try {
      // Check for pending role from Google auth
      const pendingRole = localStorage.getItem('pendingRole');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        // If no profile exists, create one with the pending role
        if (pendingRole) {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: session.user.id,
              name: session.user.user_metadata?.name || 'User',
              email: session.user.email,
              role: pendingRole,
              profile_image: session.user.user_metadata?.avatar_url || '/placeholder.svg'
            });
          
          if (insertError) {
            console.error('Error creating profile:', insertError);
            setUser(mapUserData(session));
          } else {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || 'User',
              role: pendingRole as UserRole,
              profileImage: session.user.user_metadata?.avatar_url || '/placeholder.svg',
              rating: 0,
              sessionsCompleted: 0
            });
          }
        } else {
          setUser(mapUserData(session));
        }
      } else if (data) {
        // If profile exists but we have a pending role, update it
        if (pendingRole) {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ role: pendingRole })
            .eq('id', session.user.id);
          
          if (updateError) {
            console.error('Error updating role:', updateError);
          }
        }
        
        // Map profile data to our User type
        setUser({
          id: data.id,
          email: session.user.email || '',
          name: data.name || session.user.user_metadata?.name || 'User',
          role: pendingRole as UserRole || data.role as UserRole,
          profileImage: data.profile_image || '/placeholder.svg',
          bio: data.bio,
          skills: data.skills,
          rating: data.rating || 0,
          sessionsCompleted: data.sessions_completed || 0
        });
      } else {
        // No profile found, use auth data
        setUser(mapUserData(session));
      }
    } catch (error) {
      console.error('Error in profile fetch:', error);
      setUser(mapUserData(session));
    } finally {
      setLoading(false);
      // Clear the pending role after processing
      localStorage.removeItem('pendingRole');
    }
  };

  // Helper function to map Supabase user to our User interface
  const mapUserData = (session: Session): User => {
    const { user: supabaseUser } = session;
    const role = supabaseUser.user_metadata?.role as UserRole || 'mentee';
    
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: supabaseUser.user_metadata?.name || 'User',
      role: role,
      profileImage: supabaseUser.user_metadata?.avatar_url || '/placeholder.svg',
      // These values will be updated when we fetch the full user profile
      rating: 0,
      sessionsCompleted: 0
    };
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      // Try to sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      // Success - the onAuthStateChange listener will update our state
    } catch (error) {
      if (import.meta.env.DEV) {
        console.log('Using mock users for development');
        // In development, allow mock users to be used
        const mockUser = MOCK_USERS.find(u => u.email === email);
        if (mockUser && password === 'password123') {
          setUser(mockUser);
          localStorage.setItem('mentorhub-user', JSON.stringify(mockUser));
          setLoading(false);
          return;
        }
      }
      
      console.error('Login failed:', error);
      setLoading(false);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string, role: UserRole) => {
    setLoading(true);
    
    try {
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          }
        }
      });

      if (error) {
        throw error;
      }

      // For development, allow immediate access with mock users
      if (import.meta.env.DEV) {
        const mockUser = {
          id: data?.user?.id || `mock-${Date.now()}`,
          name,
          email,
          role,
          profileImage: '/placeholder.svg',
          rating: 0,
          sessionsCompleted: 0
        };
        setUser(mockUser);
        localStorage.setItem('mentorhub-user', JSON.stringify(mockUser));
      }
      
      // The onAuthStateChange listener will update our state
      setLoading(false);
    } catch (error) {
      console.error('Signup failed:', error);
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      localStorage.removeItem('mentorhub-user');
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
