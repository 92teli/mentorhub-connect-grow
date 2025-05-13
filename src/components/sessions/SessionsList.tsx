
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SessionCard from './SessionCard';
import { Session, User } from '@/lib/types';

interface SessionsListProps {
  upcomingSessions: Session[];
  pastSessions: Session[];
  currentUser: User | null;
  onFindMentors?: () => void;
  onJoinSession?: (sessionId: string) => void;
}

const SessionsList: React.FC<SessionsListProps> = ({
  upcomingSessions,
  pastSessions,
  currentUser,
  onFindMentors,
  onJoinSession
}) => {
  const navigate = useNavigate();

  const handleSessionClick = (sessionId: string) => {
    navigate(`/session/${sessionId}`);
  };

  return (
    <Tabs defaultValue="upcoming" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        <TabsTrigger value="past">Past</TabsTrigger>
      </TabsList>
      
      <TabsContent value="upcoming" className="mt-4">
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {upcomingSessions.length > 0 ? (
            upcomingSessions.map(session => (
              <div key={session.id} onClick={() => handleSessionClick(session.id)} className="cursor-pointer">
                <SessionCard 
                  session={session} 
                  currentUser={currentUser}
                  onJoinSession={onJoinSession} 
                />
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-textSecondary">
              <CalendarIcon className="mx-auto h-12 w-12 mb-3 text-muted" />
              <p>No upcoming sessions</p>
              {currentUser?.role === 'mentee' && onFindMentors && (
                <Button 
                  variant="outline" 
                  className="mt-4 border-mentorblue text-mentorblue hover:bg-mentorblue/10"
                  onClick={onFindMentors}
                >
                  Find Mentors
                </Button>
              )}
            </div>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="past" className="mt-4">
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {pastSessions.length > 0 ? (
            pastSessions.map(session => (
              <div key={session.id} onClick={() => handleSessionClick(session.id)} className="cursor-pointer">
                <SessionCard 
                  session={session} 
                  currentUser={currentUser} 
                />
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-textSecondary">
              <CalendarIcon className="mx-auto h-12 w-12 mb-3 text-muted" />
              <p>No past sessions</p>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default SessionsList;
