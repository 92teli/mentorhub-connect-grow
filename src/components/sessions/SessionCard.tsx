
import React from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Session, User } from '@/lib/types';

interface SessionCardProps {
  session: Session;
  currentUser: User | null;
  onJoinSession?: (sessionId: string) => void;
}

const SessionCard: React.FC<SessionCardProps> = ({ 
  session, 
  currentUser,
  onJoinSession
}) => {
  const isUpcoming = new Date(session.startTime) > new Date();
  const otherParty = currentUser?.role === 'mentor' ? session.mentee : session.mentor;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-mentorblue/20 text-mentorblue border-mentorblue/30';
      case 'completed':
        return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-500 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };

  const handleJoinSession = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent parent click from triggering
    
    if (onJoinSession) {
      onJoinSession(session.id);
    } else if (session.meetLink) {
      window.open(session.meetLink, '_blank');
    }
  };

  // Check if session is active (within 15 minutes before start time)
  const isSessionActive = () => {
    const now = new Date();
    const sessionStartTime = new Date(session.startTime);
    const fifteenMinutesBefore = new Date(sessionStartTime);
    fifteenMinutesBefore.setMinutes(fifteenMinutesBefore.getMinutes() - 15);
    
    return now >= fifteenMinutesBefore && now <= new Date(session.endTime);
  };

  return (
    <div 
      className={`p-4 rounded-lg border ${
        isUpcoming 
          ? 'border-cardborder bg-darkbg' 
          : 'border-cardborder/50 bg-darkbg/50'
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className={`font-medium ${!isUpcoming && 'text-textSecondary'}`}>
            {session.title}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-sm text-textSecondary">
            <Calendar className="h-3 w-3" />
            <span>{format(new Date(session.startTime), 'MMMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2 mt-1 text-sm text-textSecondary">
            <Clock className="h-3 w-3" />
            <span>
              {format(new Date(session.startTime), 'h:mm a')} - {format(new Date(session.endTime), 'h:mm a')}
            </span>
          </div>
        </div>
        <Badge 
          variant="outline" 
          className={`${getStatusColor(session.status)} capitalize`}
        >
          {session.status}
        </Badge>
      </div>
      
      <div className="flex items-center gap-2 mt-3">
        <div className="h-6 w-6 rounded-full bg-darkbg overflow-hidden border border-cardborder">
          <img 
            src={otherParty?.profileImage || 'https://i.pravatar.cc/300'} 
            alt={otherParty?.name || 'User'} 
            className="h-full w-full object-cover"
          />
        </div>
        <span className="text-sm">
          {otherParty?.name || 'User'} ({currentUser?.role === 'mentor' ? 'Mentee' : 'Mentor'})
        </span>
      </div>
      
      {isUpcoming && session.status === 'scheduled' && (
        <div className="mt-3 flex justify-end">
          <Button 
            variant="outline"
            size="sm"
            className={`${
              isSessionActive()
                ? 'text-green-500 border-green-500 hover:bg-green-500/10' 
                : currentUser?.role === 'mentor' 
                  ? 'text-mentorpurple border-mentorpurple hover:bg-mentorpurple/10 opacity-70' 
                  : 'text-mentorblue border-mentorblue hover:bg-mentorblue/10 opacity-70'
            }`}
            onClick={handleJoinSession}
            disabled={!isSessionActive()}
          >
            <Video className="mr-1 h-3 w-3" /> 
            {isSessionActive() ? 'Join Now' : 'Join Meeting'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default SessionCard;
