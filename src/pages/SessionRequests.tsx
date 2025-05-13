<<<<<<< HEAD

=======
>>>>>>> 29e8480 (updated code)
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, CheckCircle, XCircle, MessageCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateMeetLink } from '@/lib/utils';
import { UserRole } from '@/lib/types';

interface SessionRequest {
  id: string;
  menteeId: string;
  mentorId: string;
  timeSlotId: string;
  status: 'pending' | 'approved' | 'declined';
  notes?: string;
  createdAt: string;
  mentee?: {
    id: string;
    name: string;
    email: string;
    profileImage?: string;
  };
  timeSlot?: {
    day: string;
    startTime: string;
    endTime: string;
  };
}

const SessionRequests = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('pending');
  
  // Fetch session requests
  const { data: sessionRequests, isLoading } = useQuery({
    queryKey: ['sessionRequests', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // Different query based on user role
      const query = user.role === 'mentor' 
        ? supabase
            .from('session_requests')
            .select(`
              *,
              mentee:profiles!mentee_id (id, name, email, profile_image),
              time_slot:time_slots!time_slot_id (day, start_time, end_time)
            `)
            .eq('mentor_id', user.id)
        : supabase
            .from('session_requests')
            .select(`
              *,
              mentor:profiles!mentor_id (id, name, email, profile_image),
              time_slot:time_slots!time_slot_id (day, start_time, end_time)
            `)
            .eq('mentee_id', user.id);
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Transform snake_case to camelCase
      return (data || []).map(request => ({
        id: request.id,
        menteeId: request.mentee_id,
        mentorId: request.mentor_id,
        timeSlotId: request.time_slot_id,
        status: request.status,
        notes: request.notes,
        createdAt: request.created_at,
        mentee: request.mentee ? {
          id: request.mentee.id,
          name: request.mentee.name,
          email: request.mentee.email,
          profileImage: request.mentee.profile_image
        } : undefined,
        mentor: request.mentor ? {
          id: request.mentor.id,
          name: request.mentor.name,
          email: request.mentor.email,
          profileImage: request.mentor.profile_image
        } : undefined,
        timeSlot: request.time_slot ? {
          day: request.time_slot.day,
          startTime: request.time_slot.start_time,
          endTime: request.time_slot.end_time
        } : undefined
      })) as SessionRequest[];
    },
    enabled: !!user,
  });
  
  // Handle request action (approve/decline)
  const requestActionMutation = useMutation({
    mutationFn: async ({ 
      requestId, 
      action 
    }: { 
      requestId: string;
      action: 'approve' | 'decline';
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      // Update request status
      const { error: requestUpdateError } = await supabase
        .from('session_requests')
        .update({ status: action === 'approve' ? 'approved' : 'declined' })
        .eq('id', requestId);
      
      if (requestUpdateError) throw requestUpdateError;
      
      if (action === 'approve') {
<<<<<<< HEAD
        // Get request details
=======
        // Get request details with user emails
>>>>>>> 29e8480 (updated code)
        const { data: request, error: requestError } = await supabase
          .from('session_requests')
          .select(`
            time_slot_id,
            mentee_id,
            mentor_id,
<<<<<<< HEAD
            time_slots!inner (day, start_time, end_time)
=======
            time_slots!inner (day, start_time, end_time),
            mentee:profiles!mentee_id (email, name),
            mentor:profiles!mentor_id (email, name)
>>>>>>> 29e8480 (updated code)
          `)
          .eq('id', requestId)
          .single();
        
        if (requestError) throw requestError;
        
        // Mark time slot as booked
        const { error: timeSlotError } = await supabase
          .from('time_slots')
          .update({ is_booked: true })
          .eq('id', request.time_slot_id);
        
        if (timeSlotError) throw timeSlotError;
<<<<<<< HEAD
        
        // Generate meeting link (in a real app, integrate with Google Meet/Zoom)
        const meetLink = generateMeetLink();
=======

        // Create session start and end times
        const sessionDate = new Date();
        const [startHours, startMinutes] = request.time_slots.start_time.split(':').map(Number);
        const [endHours, endMinutes] = request.time_slots.end_time.split(':').map(Number);
        
        const startTime = new Date(sessionDate);
        startTime.setHours(startHours, startMinutes, 0, 0);
        
        const endTime = new Date(sessionDate);
        endTime.setHours(endHours, endMinutes, 0, 0);
        
        // Generate meeting link with attendees
        const meetLink = await generateMeetLink({
          title: `Mentoring Session: ${request.mentee.name} with ${request.mentor.name}`,
          startTime,
          endTime,
          attendees: [request.mentee.email, request.mentor.email]
        });
>>>>>>> 29e8480 (updated code)
        
        // Create a new session
        const { error: sessionError } = await supabase
          .from('sessions')
          .insert({
            mentee_id: request.mentee_id,
            mentor_id: request.mentor_id,
            time_slot_id: request.time_slot_id,
<<<<<<< HEAD
            title: 'Mentoring Session',
            description: 'Scheduled mentoring session',
            meet_link: meetLink,
            status: 'scheduled',
            start_time: `2025-05-15T${request.time_slots.start_time}:00`,
            end_time: `2025-05-15T${request.time_slots.end_time}:00`
=======
            title: `Mentoring Session: ${request.mentee.name} with ${request.mentor.name}`,
            description: 'Scheduled mentoring session',
            meet_link: meetLink,
            status: 'scheduled',
            start_time: startTime.toISOString(),
            end_time: endTime.toISOString()
>>>>>>> 29e8480 (updated code)
          });
        
        if (sessionError) throw sessionError;
      }
      
      return { requestId, action };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sessionRequests', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['sessions', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['timeSlots', user?.id] });
      
      toast({
        title: data.action === 'approve' ? 'Session request approved' : 'Session request declined',
        description: data.action === 'approve' 
          ? 'A new session has been added to your calendar' 
          : 'The session request has been declined',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error processing request',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  // Filter requests by status
  const pendingRequests = sessionRequests?.filter(req => req.status === 'pending') || [];
  const approvedRequests = sessionRequests?.filter(req => req.status === 'approved') || [];
  const declinedRequests = sessionRequests?.filter(req => req.status === 'declined') || [];
  
  // Get requests for current tab
  const getRequestsForTab = () => {
    switch (activeTab) {
      case 'pending': return pendingRequests;
      case 'approved': return approvedRequests;
      case 'declined': return declinedRequests;
      default: return pendingRequests;
    }
  };
  
  const displayRequests = getRequestsForTab();
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Session Requests</h1>
            <p className="text-textSecondary">
              {user?.role === 'mentor' 
                ? 'Manage incoming session requests from mentees' 
                : 'Track your session requests with mentors'}
            </p>
          </div>
        </div>
        
        <Tabs 
          defaultValue="pending" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="pending">
                Pending
                {pendingRequests.length > 0 && (
                  <Badge className="ml-2 bg-yellow-600">{pendingRequests.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved
                {approvedRequests.length > 0 && (
                  <Badge className="ml-2 bg-green-600">{approvedRequests.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="declined">
                Declined
                {declinedRequests.length > 0 && (
                  <Badge className="ml-2 bg-red-600">{declinedRequests.length}</Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="pending">
            {isLoading ? (
              <Card className="bg-darkbg-secondary border-cardborder p-8">
                <div className="flex justify-center">
                  <div className="h-12 w-12 rounded-full border-4 border-t-mentorpurple border-r-mentorblue border-b-mentorpurple border-l-mentorblue animate-spin"></div>
                </div>
              </Card>
            ) : pendingRequests.length > 0 ? (
              <div className="space-y-4">
                {pendingRequests.map(request => (
                  <RequestCard 
                    key={request.id} 
                    request={request} 
                    userRole={user?.role}
                    onApprove={() => requestActionMutation.mutate({ requestId: request.id, action: 'approve' })}
                    onDecline={() => requestActionMutation.mutate({ requestId: request.id, action: 'decline' })}
                  />
                ))}
              </div>
            ) : (
              <Card className="bg-darkbg-secondary border-cardborder p-8">
                <div className="text-center">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-textSecondary" />
                  <h3 className="text-lg font-medium mb-2">No Pending Requests</h3>
                  <p className="text-textSecondary">
                    {user?.role === 'mentor' 
                      ? 'You have no pending session requests from mentees' 
                      : 'You have no pending session requests with mentors'}
                  </p>
                </div>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="approved">
            {isLoading ? (
              <Card className="bg-darkbg-secondary border-cardborder p-8">
                <div className="flex justify-center">
                  <div className="h-12 w-12 rounded-full border-4 border-t-mentorpurple border-r-mentorblue border-b-mentorpurple border-l-mentorblue animate-spin"></div>
                </div>
              </Card>
            ) : approvedRequests.length > 0 ? (
              <div className="space-y-4">
                {approvedRequests.map(request => (
                  <RequestCard 
                    key={request.id} 
                    request={request} 
                    userRole={user?.role}
                  />
                ))}
              </div>
            ) : (
              <Card className="bg-darkbg-secondary border-cardborder p-8">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-textSecondary" />
                  <h3 className="text-lg font-medium mb-2">No Approved Requests</h3>
                  <p className="text-textSecondary">
                    {user?.role === 'mentor' 
                      ? 'You have not approved any session requests yet' 
                      : 'None of your session requests have been approved yet'}
                  </p>
                </div>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="declined">
            {isLoading ? (
              <Card className="bg-darkbg-secondary border-cardborder p-8">
                <div className="flex justify-center">
                  <div className="h-12 w-12 rounded-full border-4 border-t-mentorpurple border-r-mentorblue border-b-mentorpurple border-l-mentorblue animate-spin"></div>
                </div>
              </Card>
            ) : declinedRequests.length > 0 ? (
              <div className="space-y-4">
                {declinedRequests.map(request => (
                  <RequestCard 
                    key={request.id} 
                    request={request} 
                    userRole={user?.role}
                  />
                ))}
              </div>
            ) : (
              <Card className="bg-darkbg-secondary border-cardborder p-8">
                <div className="text-center">
                  <XCircle className="h-12 w-12 mx-auto mb-4 text-textSecondary" />
                  <h3 className="text-lg font-medium mb-2">No Declined Requests</h3>
                  <p className="text-textSecondary">
                    {user?.role === 'mentor' 
                      ? 'You have not declined any session requests' 
                      : 'None of your session requests have been declined'}
                  </p>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

// Request card component
interface RequestCardProps {
  request: SessionRequest;
  userRole?: UserRole;
  onApprove?: () => void;
  onDecline?: () => void;
}

const RequestCard: React.FC<RequestCardProps> = ({ 
  request, 
  userRole,
  onApprove,
  onDecline 
}) => {
  const isPending = request.status === 'pending';
  const isApproved = request.status === 'approved';
  const isDeclined = request.status === 'declined';
  
  // The other user in this interaction
  const otherUser = userRole === 'mentor' ? request.mentee : undefined;
  
  return (
    <Card className="bg-darkbg-secondary border-cardborder">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-darkbg overflow-hidden border border-cardborder">
              <img 
                src={otherUser?.profileImage || '/placeholder.svg'} 
                alt={otherUser?.name || 'User'} 
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium">
                {userRole === 'mentor' ? (
                  <>Session request from <span className="text-mentorblue">{otherUser?.name}</span></>
                ) : (
                  <>Your request</>
                )}
              </h3>
              {request.timeSlot && (
                <div className="flex items-center gap-1 text-sm text-textSecondary">
                  <Calendar className="h-3 w-3" />
                  <span>{request.timeSlot.day}</span>
                  <Clock className="h-3 w-3 ml-2" />
                  <span>{request.timeSlot.startTime} - {request.timeSlot.endTime}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isPending && userRole === 'mentor' ? (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-red-500 text-red-500 hover:bg-red-500/10"
                  onClick={onDecline}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Decline
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  className="border-green-500 text-green-500 hover:bg-green-500/10"
                  onClick={onApprove}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
              </>
            ) : (
              <Badge 
                variant="outline" 
                className={`${
                  isPending 
                    ? 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30'
                    : isApproved
                    ? 'bg-green-500/20 text-green-500 border-green-500/30'
                    : 'bg-red-500/20 text-red-500 border-red-500/30'
                }`}
              >
                {request.status}
              </Badge>
            )}
          </div>
        </div>
        
        {request.notes && (
          <div className="mt-4 pt-4 border-t border-cardborder">
            <div className="flex items-start gap-2">
              <MessageCircle className="h-4 w-4 mt-0.5 text-mentorblue" />
              <div>
                <h4 className="text-sm font-medium mb-1">Message</h4>
                <p className="text-sm text-textSecondary">{request.notes}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SessionRequests;
