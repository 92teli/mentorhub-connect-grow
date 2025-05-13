
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Star } from 'lucide-react';
import { TimeSlot } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const RequestSession = () => {
  const { mentorId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch mentor profile
  const { data: mentor, isLoading: isMentorLoading } = useQuery({
    queryKey: ['mentor', mentorId],
    queryFn: async () => {
      if (!mentorId) throw new Error('No mentor ID provided');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', mentorId)
        .eq('role', 'mentor')
        .single();
        
      if (error) throw error;
      if (!data) throw new Error('Mentor not found');
      
      return data;
    },
    enabled: !!mentorId,
  });

  // Fetch mentor's available time slots
  const { data: timeSlots, isLoading: isSlotsLoading } = useQuery({
    queryKey: ['mentorTimeSlots', mentorId],
    queryFn: async () => {
      if (!mentorId) throw new Error('No mentor ID provided');
      
      const { data, error } = await supabase
        .from('time_slots')
        .select('*')
        .eq('mentor_id', mentorId)
        .eq('is_booked', false);
        
      if (error) throw error;
      
      // Transform snake_case to camelCase
      return (data || []).map(slot => ({
        id: slot.id,
        mentorId: slot.mentor_id,
        day: slot.day,
        startTime: slot.start_time,
        endTime: slot.end_time,
        isBooked: slot.is_booked,
      })) as TimeSlot[];
    },
    enabled: !!mentorId,
  });

  // Request session mutation
  const requestSessionMutation = useMutation({
    mutationFn: async () => {
      if (!mentorId || !selectedTimeSlot || !user) {
        throw new Error('Missing required information');
      }
      
      // Create a session request
      const { data, error } = await supabase
        .from('session_requests')
        .insert({
          mentee_id: user.id,
          mentor_id: mentorId,
          time_slot_id: selectedTimeSlot,
          notes: notes,
          status: 'pending'
        })
        .select();
        
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessionRequests', user?.id] });
      toast({
        title: 'Session request sent!',
        description: 'You will be notified when the mentor responds to your request.',
      });
      navigate('/dashboard');
    },
    onError: (error) => {
      toast({
        title: 'Failed to send request',
        description: error.message,
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  });

  const handleRequestSession = async () => {
    if (!selectedTimeSlot) {
      toast({
        title: 'Please select a time slot',
        description: 'You need to select an available time slot to request a session',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    requestSessionMutation.mutate();
  };

  // Function to display a time slot with a formatted time
  const formatTimeSlot = (slot: TimeSlot) => {
    return `${slot.day} | ${slot.startTime} - ${slot.endTime}`;
  };

  if (isMentorLoading || isSlotsLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="h-12 w-12 rounded-full border-4 border-t-mentorpurple border-r-mentorblue border-b-mentorpurple border-l-mentorblue animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!mentor) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Mentor not found</h2>
          <p className="text-textSecondary mb-6">The mentor you're looking for doesn't exist or is no longer available.</p>
          <Button 
            onClick={() => navigate('/find-mentors')}
            className="bg-mentorblue hover:bg-mentorblue/90"
          >
            Browse Mentors
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Request Session</h1>
          <Button 
            variant="outline" 
            className="border-mentorblue text-mentorblue hover:bg-mentorblue/10"
            onClick={() => navigate('/find-mentors')}
          >
            Back to Mentors
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Mentor card */}
          <Card className="bg-darkbg-secondary border-cardborder md:col-span-1">
            <CardHeader>
              <CardTitle>Mentor Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-darkbg overflow-hidden border border-cardborder">
                  <img 
                    src={mentor.profile_image || '/placeholder.svg'} 
                    alt={mentor.name} 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{mentor.name}</h3>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-sm">{mentor.rating?.toFixed(1) || 'New'}</span>
                    <span className="text-xs text-textSecondary ml-2">
                      ({mentor.sessions_completed || 0} sessions)
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Skills */}
              <div>
                <h4 className="text-sm font-medium mb-2">Skills & Expertise</h4>
                <div className="flex flex-wrap gap-1">
                  {mentor.skills?.map((skill: string, i: number) => (
                    <Badge key={i} variant="outline" className="bg-mentorblue/10 text-mentorblue border-mentorblue/20">
                      {skill}
                    </Badge>
                  )) || <span className="text-sm text-textSecondary">No skills listed</span>}
                </div>
              </div>
              
              {/* Bio */}
              {mentor.bio && (
                <div>
                  <h4 className="text-sm font-medium mb-1">About</h4>
                  <p className="text-sm text-textSecondary">{mentor.bio}</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Request form */}
          <Card className="bg-darkbg-secondary border-cardborder md:col-span-2">
            <CardHeader>
              <CardTitle>Schedule a Session</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {timeSlots && timeSlots.length > 0 ? (
                <>
                  {/* Time slot selection */}
                  <div className="space-y-2">
                    <label htmlFor="time-slot" className="block font-medium text-sm">
                      Select a Time Slot
                    </label>
                    <Select
                      value={selectedTimeSlot}
                      onValueChange={setSelectedTimeSlot}
                    >
                      <SelectTrigger id="time-slot" className="w-full">
                        <SelectValue placeholder="Choose a time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((slot) => (
                          <SelectItem key={slot.id} value={slot.id}>
                            {formatTimeSlot(slot)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Message to mentor */}
                  <div className="space-y-2">
                    <label htmlFor="notes" className="block font-medium text-sm">
                      Message (Optional)
                    </label>
                    <Textarea
                      id="notes"
                      placeholder="What would you like to discuss in this session?"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="h-32 resize-none"
                    />
                  </div>
                  
                  <Button
                    className="w-full bg-mentorblue hover:bg-mentorblue/90"
                    onClick={handleRequestSession}
                    disabled={isSubmitting || !selectedTimeSlot}
                  >
                    {isSubmitting ? 'Sending Request...' : 'Request Session'}
                  </Button>
                </>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto mb-3 text-textSecondary" />
                  <h3 className="text-lg font-medium mb-2">No Available Time Slots</h3>
                  <p className="text-textSecondary mb-4">
                    This mentor doesn't have any available time slots at the moment.
                  </p>
                  <Button
                    onClick={() => navigate('/find-mentors')}
                    className="bg-mentorblue hover:bg-mentorblue/90"
                  >
                    Find Other Mentors
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RequestSession;
