
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Calendar,
  Clock,
  Video,
  Check,
  User,
  Star,
  X
} from 'lucide-react';
import { Session } from '@/lib/types';
import { format } from 'date-fns';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

const SessionDetail = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState('');
  
  // Fetch session details
  const { data: session, isLoading } = useQuery({
    queryKey: ['session', sessionId],
    queryFn: async () => {
      if (!sessionId) throw new Error('No session ID provided');
      
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
        .eq('id', sessionId)
        .single();
        
      if (error) throw error;
      if (!data) throw new Error('Session not found');
      
      return {
        id: data.id,
        menteeId: data.mentee_id,
        mentorId: data.mentor_id,
        timeSlotId: data.time_slot_id,
        title: data.title,
        description: data.description,
        meetLink: data.meet_link,
        status: data.status,
        startTime: new Date(data.start_time),
        endTime: new Date(data.end_time),
        mentee: data.mentees ? {
          id: data.mentees.id,
          name: data.mentees.name,
          email: data.mentees.email,
          role: data.mentees.role,
          profileImage: data.mentees.profile_image
        } : undefined,
        mentor: data.mentors ? {
          id: data.mentors.id,
          name: data.mentors.name,
          email: data.mentors.email, 
          role: data.mentors.role,
          profileImage: data.mentors.profile_image
        } : undefined
      } as Session;
    },
    enabled: !!sessionId,
  });
  
  // Join session mutation
  const joinSessionMutation = useMutation({
    mutationFn: async () => {
      if (!session?.meetLink) throw new Error('No meeting link available');
      window.open(session.meetLink, '_blank');
      return session.id;
    },
    onError: (error) => {
      toast({
        title: 'Failed to join session',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  // Submit feedback mutation
  const submitFeedbackMutation = useMutation({
    mutationFn: async () => {
      if (!session || !user) throw new Error('Missing required information');
      
      const toUserId = user.role === 'mentor' ? session.menteeId : session.mentorId;
      
      const { data, error } = await supabase
        .from('feedback')
        .insert({
          session_id: session.id,
          from_user_id: user.id,
          to_user_id: toUserId,
          rating: rating,
          comments: comments
        })
        .select();
        
      if (error) throw error;
      
      // Update session status if both parties have provided feedback
      const { data: existingFeedback } = await supabase
        .from('feedback')
        .select('id')
        .eq('session_id', session.id)
        .neq('from_user_id', user.id);
        
      if (existingFeedback && existingFeedback.length > 0) {
        // Both users have provided feedback, update session status
        const { error: sessionError } = await supabase
          .from('sessions')
          .update({ status: 'completed' })
          .eq('id', session.id);
          
        if (sessionError) console.error('Error updating session status:', sessionError);
      }
      
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
      setShowFeedbackDialog(false);
      toast({
        title: 'Feedback submitted',
        description: 'Thank you for providing your feedback',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error submitting feedback',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  // Cancel session mutation
  const cancelSessionMutation = useMutation({
    mutationFn: async () => {
      if (!session) throw new Error('Missing required information');
      
      // Update session status
      const { error: sessionError } = await supabase
        .from('sessions')
        .update({ status: 'cancelled' })
        .eq('id', session.id);
        
      if (sessionError) throw sessionError;
      
      // Free up the time slot
      const { error: timeSlotError } = await supabase
        .from('time_slots')
        .update({ is_booked: false })
        .eq('id', session.timeSlotId);
        
      if (timeSlotError) throw timeSlotError;
      
      return session.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
      toast({
        title: 'Session cancelled',
        description: 'The session has been cancelled',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error cancelling session',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="h-12 w-12 rounded-full border-4 border-t-mentorpurple border-r-mentorblue border-b-mentorpurple border-l-mentorblue animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!session) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Session not found</h2>
          <p className="text-textSecondary mb-6">The session you're looking for doesn't exist or you don't have access to it.</p>
          <Button 
            onClick={() => navigate('/sessions')}
            className="bg-mentorblue hover:bg-mentorblue/90"
          >
            Back to Sessions
          </Button>
        </div>
      </DashboardLayout>
    );
  }
  
  // Determine if current user is the mentor or mentee
  const isMentor = user?.id === session.mentorId;
  const isMentee = user?.id === session.menteeId;
  
  if (!isMentor && !isMentee) {
    // User does not have access to this session
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-textSecondary mb-6">You don't have access to view this session.</p>
          <Button 
            onClick={() => navigate('/sessions')}
            className="bg-mentorblue hover:bg-mentorblue/90"
          >
            Back to Sessions
          </Button>
        </div>
      </DashboardLayout>
    );
  }
  
  // Get the other party in the session
  const otherParty = isMentor ? session.mentee : session.mentor;
  
  // Check if session is active (within 15 minutes before start time)
  const isSessionActive = () => {
    const now = new Date();
    const sessionStartTime = session.startTime;
    const fifteenMinutesBefore = new Date(sessionStartTime);
    fifteenMinutesBefore.setMinutes(fifteenMinutesBefore.getMinutes() - 15);
    
    return now >= fifteenMinutesBefore && now <= session.endTime;
  };
  
  // Check if session can be canceled (more than 1 hour before start)
  const canCancel = () => {
    const now = new Date();
    const sessionStartTime = session.startTime;
    const oneHourBefore = new Date(sessionStartTime);
    oneHourBefore.setHours(oneHourBefore.getHours() - 1);
    
    return now < oneHourBefore && session.status === 'scheduled';
  };
  
  // Check if feedback can be provided (session is completed or in the past)
  const canProvideFeedback = () => {
    const now = new Date();
    return (session.status === 'completed' || now > session.endTime) && session.status !== 'cancelled';
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Session Details</h1>
          <Button 
            variant="outline" 
            className="border-mentorblue text-mentorblue hover:bg-mentorblue/10"
            onClick={() => navigate('/sessions')}
          >
            Back to Sessions
          </Button>
        </div>
        
        <Card className="bg-darkbg-secondary border-cardborder">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{session.title}</CardTitle>
              <div className="flex items-center gap-2 mt-1 text-sm text-textSecondary">
                <Badge 
                  variant="outline" 
                  className={`${
                    session.status === 'scheduled' 
                      ? 'bg-mentorblue/20 text-mentorblue border-mentorblue/30'
                      : session.status === 'completed'
                      ? 'bg-green-500/20 text-green-500 border-green-500/30'
                      : 'bg-red-500/20 text-red-500 border-red-500/30'
                  } capitalize`}
                >
                  {session.status}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Date and Time */}
            <div className="bg-darkbg rounded-lg p-4 border border-cardborder">
              <h3 className="text-sm font-medium mb-3">Date & Time</h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-mentorblue" />
                  <span>{format(session.startTime, 'EEEE, MMMM d, yyyy')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-mentorblue" />
                  <span>
                    {format(session.startTime, 'h:mm a')} - {format(session.endTime, 'h:mm a')}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Participants */}
            <div>
              <h3 className="text-sm font-medium mb-3">Participants</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Mentor Card */}
                <div className="bg-darkbg rounded-lg p-4 border border-cardborder">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-darkbg overflow-hidden border border-cardborder">
                      <img 
                        src={session.mentor?.profileImage || "/placeholder.svg"} 
                        alt={session.mentor?.name || "Mentor"} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{session.mentor?.name}</div>
                      <div className="text-sm text-textSecondary">Mentor</div>
                    </div>
                  </div>
                </div>
                
                {/* Mentee Card */}
                <div className="bg-darkbg rounded-lg p-4 border border-cardborder">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-darkbg overflow-hidden border border-cardborder">
                      <img 
                        src={session.mentee?.profileImage || "/placeholder.svg"} 
                        alt={session.mentee?.name || "Mentee"} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{session.mentee?.name}</div>
                      <div className="text-sm text-textSecondary">Mentee</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Description */}
            {session.description && (
              <div>
                <h3 className="text-sm font-medium mb-2">Description</h3>
                <p className="text-textSecondary">{session.description}</p>
              </div>
            )}
            
            {/* Meeting Link */}
            {session.meetLink && session.status === 'scheduled' && (
              <div className="bg-darkbg rounded-lg p-4 border border-cardborder">
                <h3 className="text-sm font-medium mb-3">Meeting Link</h3>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="text-textSecondary overflow-hidden text-ellipsis">
                    <span className="text-sm">{session.meetLink}</span>
                  </div>
                  <Button 
                    variant="outline"
                    size="sm"
                    className={`${
                      isSessionActive()
                        ? 'text-green-500 border-green-500 hover:bg-green-500/10' 
                        : user?.role === 'mentor' 
                          ? 'text-mentorpurple border-mentorpurple hover:bg-mentorpurple/10' 
                          : 'text-mentorblue border-mentorblue hover:bg-mentorblue/10'
                    } sm:ml-auto whitespace-nowrap`}
                    onClick={() => joinSessionMutation.mutate()}
                  >
                    <Video className="mr-1 h-4 w-4" /> 
                    {isSessionActive() ? 'Join Now' : 'Copy Link'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {/* Action buttons based on session status */}
            <div className="flex gap-3">
              {canCancel() && (
                <Button 
                  variant="outline" 
                  className="border-red-500 text-red-500 hover:bg-red-500/10"
                  onClick={() => cancelSessionMutation.mutate()}
                >
                  <X className="mr-1 h-4 w-4" /> Cancel Session
                </Button>
              )}
              {(session.status === 'completed' || new Date() > session.endTime) && session.status !== 'cancelled' && (
                <Button
                  className={user?.role === 'mentor' ? 'bg-mentorpurple hover:bg-mentorpurple/90' : 'bg-mentorblue hover:bg-mentorblue/90'}
                  onClick={() => setShowFeedbackDialog(true)}
                >
                  <Star className="mr-1 h-4 w-4" /> Provide Feedback
                </Button>
              )}
              {session.status === 'scheduled' && isSessionActive() && (
                <Button 
                  className="bg-green-500 hover:bg-green-500/90"
                  onClick={() => joinSessionMutation.mutate()}
                >
                  <Video className="mr-1 h-4 w-4" /> Join Session
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
      
      {/* Feedback Dialog */}
      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Session Feedback</DialogTitle>
            <DialogDescription>
              Share your feedback about your session with {otherParty?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Rating</h4>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`p-1 rounded-full ${
                      rating >= star ? 'text-yellow-400' : 'text-gray-400'
                    }`}
                  >
                    <Star className="h-6 w-6" />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Comments (Optional)</h4>
              <Textarea
                placeholder="Share your experience, suggestions, or feedback..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline"
              onClick={() => setShowFeedbackDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              className={user?.role === 'mentor' ? 'bg-mentorpurple hover:bg-mentorpurple/90' : 'bg-mentorblue hover:bg-mentorblue/90'}
              onClick={() => submitFeedbackMutation.mutate()}
            >
              Submit Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default SessionDetail;
