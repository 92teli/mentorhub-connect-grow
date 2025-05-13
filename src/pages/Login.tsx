import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';
import AuthLayout from '@/components/layouts/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
});

const Login = () => {
  const { signIn, user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'mentor' | 'mentee'>('mentee');

  useEffect(() => {
    if (!loading && user) {
      const pendingRole = localStorage.getItem('pendingRole');
      if (pendingRole !== null) {
        supabase
          .from('profiles')
          .update({ role: pendingRole })
          .eq('id', user.id)
          .then(({ error }) => {
            console.log('Role update after Google login:', { role: pendingRole, error });
            localStorage.removeItem('pendingRole');
            navigate('/dashboard');
          });
      } else {
        // Always update the role based on the selected tab, even if user exists
        supabase
          .from('profiles')
          .update({ role: activeTab })
          .eq('id', user.id)
          .then(({ error }) => {
            console.log('Role update fallback after Google login:', { role: activeTab, error });
            navigate('/dashboard');
          });
      }
    }
  }, [user, loading, navigate, activeTab]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      await signIn(values.email, values.password);
      toast({
        title: 'Login Successful',
        description: 'Welcome back to MentorHub!',
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Invalid email or password. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Demo login - hardcoded for demo purposes
  const handleDemoLogin = async (role: 'mentor' | 'mentee') => {
    try {
      setIsLoading(true);
      await signIn(
        role === 'mentor' ? 'jane@example.com' : 'john@example.com', 
        'password123'
      );
      toast({
        title: 'Demo Login Successful',
        description: `You are now logged in as a ${role}.`,
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Demo Login Failed',
        description: 'Something went wrong. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      // Save the selected tab in localStorage before redirect
      localStorage.setItem('pendingRole', activeTab);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });
      
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Google Sign-in Failed',
          description: error.message || 'Failed to sign in with Google. Please try again.',
        });
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast({
        variant: 'destructive',
        title: 'Google Sign-in Failed',
        description: 'An unexpected error occurred. Please try again.',
      });
    }
  };

  return (
    <AuthLayout 
      title="Welcome Back"
    >
      <Tabs 
        defaultValue="mentee" 
        onValueChange={(value) => setActiveTab(value as 'mentor' | 'mentee')}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger 
            value="mentee"
            className="data-[state=active]:bg-mentorblue/10 data-[state=active]:text-mentorblue"
          >
            Login as Mentee
          </TabsTrigger>
          <TabsTrigger 
            value="mentor"
            className="data-[state=active]:bg-mentorpurple/10 data-[state=active]:text-mentorpurple"
          >
            Login as Mentor
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mentee">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="you@example.com" 
                        disabled={isLoading}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        disabled={isLoading}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-mentorblue hover:bg-mentorblue/80"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Log In'}
              </Button>

              <Button 
                type="button"
                variant="outline" 
                onClick={() => handleDemoLogin('mentee')}
                className="w-full mt-2 border-mentorblue text-mentorblue hover:bg-mentorblue/10"
                disabled={isLoading}
              >
                Try Demo Account
              </Button>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="mentor">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="you@example.com" 
                        disabled={isLoading}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        disabled={isLoading}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-mentorpurple hover:bg-mentorpurple/80"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Log In'}
              </Button>

              <Button 
                type="button"
                variant="outline" 
                onClick={() => handleDemoLogin('mentor')}
                className="w-full mt-2 border-mentorpurple text-mentorpurple hover:bg-mentorpurple/10"
                disabled={isLoading}
              >
                Try Demo Account
              </Button>
            </form>
          </Form>
        </TabsContent>
      </Tabs>

      <div className="mt-6 text-center text-sm text-textSecondary">
        Don't have an account?{' '}
        <Link
          to="/signup"
          className="text-mentorpurple hover:text-mentorpurple/80 font-semibold"
        >
          Sign up
        </Link>
      </div>

      <div className="flex flex-col items-center gap-2 mt-4">
        <button
          onClick={signInWithGoogle}
          aria-label="Sign in with Google"
          className="rounded-full bg-white p-2 shadow-md hover:shadow-lg hover:scale-110 transition border border-gray-200"
          style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg className="w-7 h-7" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C36.68 2.36 30.77 0 24 0 14.82 0 6.71 5.13 2.69 12.56l7.98 6.2C12.13 13.13 17.62 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.6C43.93 37.36 46.1 31.36 46.1 24.55z"/><path fill="#FBBC05" d="M10.67 28.13c-1.13-3.36-1.13-6.97 0-10.33l-7.98-6.2C.99 15.1 0 19.39 0 24c0 4.61.99 8.9 2.69 12.4l7.98-6.2z"/><path fill="#EA4335" d="M24 48c6.77 0 12.48-2.24 16.64-6.09l-7.19-5.6c-2.01 1.35-4.59 2.15-7.45 2.15-6.38 0-11.87-3.63-14.33-8.86l-7.98 6.2C6.71 42.87 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
        </button>
        <span className="text-xs text-gray-400 mt-1">Google</span>
      </div>
    </AuthLayout>
  );
};

export default Login;
