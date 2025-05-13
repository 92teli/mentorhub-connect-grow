<<<<<<< HEAD

=======
>>>>>>> 29e8480 (updated code)
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { TimeSlot, Session } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { generateMeetLink } from '@/lib/utils';

export const useSessions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch time slots for the mentor
  const { 
    data: timeSlots, 
    isLoading: isSlotsLoading 
  } = useQuery({
    queryKey: ['timeSlots', user?.id],
    queryFn: async () => {
      if (user?.role === 'mentor') {
        const { data, error } = await supabase
          .from('time_slots')
          .select('*')
          .eq('mentor_id', user.id);
          
        if (error) throw error;
        
        // Transform snake_case to camelCase
        return data.map(slot => ({
          id: slot.id,
          mentorId: slot.mentor_id,
          day: slot.day,
          startTime: slot.start_time,
          endTime: slot.end_time,
          isBooked: slot.is_booked,
        })) as TimeSlot[];
      } else {
        return [] as TimeSlot[];
      }
    },
    enabled: !!user && user.role === 'mentor',
  });

  // Fetch sessions for the user (both mentor and mentee)
  const { 
    data: sessions, 
    isLoading: isSessionsLoading 
  } = useQuery({
    queryKey: ['sessions', user?.id],
    queryFn: async () => {
      if (!user) return [] as Session[];

      // Query with explicit column names for the relationships
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          id,
          mentee_id,
          mentor_id,
          time_slot_id,
          title,
          description,
          meet_link,
          status,
          start_time,
          end_time,
          mentees:profiles!mentee_id(id, name, email, role, profile_image),
          mentors:profiles!mentor_id(id, name, email, role, profile_image)
        `)
        .or(`mentee_id.eq.${user.id},mentor_id.eq.${user.id}`)
        .order('start_time', { ascending: true });
        
      if (error) throw error;
      
      // Transform snake_case to camelCase and convert string dates to Date objects
<<<<<<< HEAD
      return data.map(session => ({
=======
      return Promise.all(data.map(async session => ({
>>>>>>> 29e8480 (updated code)
        id: session.id,
        menteeId: session.mentee_id,
        mentorId: session.mentor_id,
        timeSlotId: session.time_slot_id,
        title: session.title,
        description: session.description,
<<<<<<< HEAD
        meetLink: session.meet_link || generateMeetLink(), // Generate a link if none exists
=======
        meetLink: session.meet_link || await generateMeetLink(), // Generate a link if none exists
>>>>>>> 29e8480 (updated code)
        status: session.status,
        startTime: new Date(session.start_time), // Convert string to Date
        endTime: new Date(session.end_time),     // Convert string to Date
        mentee: session.mentees ? {
          id: session.mentees.id,
          name: session.mentees.name,
          email: session.mentees.email,
          role: session.mentees.role,
          profileImage: session.mentees.profile_image
        } : undefined,
        mentor: session.mentors ? {
          id: session.mentors.id,
          name: session.mentors.name,
          email: session.mentors.email, 
          role: session.mentors.role,
          profileImage: session.mentors.profile_image
        } : undefined
<<<<<<< HEAD
      })) as Session[];
=======
      }))) as Promise<Session[]>;
>>>>>>> 29e8480 (updated code)
    },
    enabled: !!user,
  });

  // Delete time slot mutation
  const deleteTimeSlotMutation = useMutation({
    mutationFn: async (timeSlotId: string) => {
      const { error } = await supabase
        .from('time_slots')
        .delete()
        .eq('id', timeSlotId);
      
      if (error) throw error;
      return timeSlotId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeSlots', user?.id] });
      toast({
        title: "Time slot deleted",
        description: "The time slot has been removed from your calendar",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting time slot",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Join session mutation
  const joinSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const session = sessions?.find(s => s.id === sessionId);
      if (!session || !session.meetLink) {
        throw new Error("No valid meeting link found for this session");
      }
      
      // Open meeting link in new tab
      window.open(session.meetLink, '_blank');
      
      return sessionId;
    },
    onError: (error) => {
      toast({
        title: "Failed to join session",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Filter upcoming and past sessions
  const upcomingSessions = (sessions || []).filter(
    session => new Date(session.startTime) >= new Date() && session.status === 'scheduled'
  );
  
  const pastSessions = (sessions || []).filter(
    session => new Date(session.startTime) < new Date() || session.status === 'completed'
  );

  return {
    timeSlots: timeSlots || [],
    sessions: sessions || [],
    upcomingSessions,
    pastSessions,
    isSlotsLoading,
    isSessionsLoading,
    deleteTimeSlot: (id: string) => deleteTimeSlotMutation.mutate(id),
    joinSession: (id: string) => joinSessionMutation.mutate(id),
  };
};
