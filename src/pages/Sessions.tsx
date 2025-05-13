
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth-context';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SessionsList from '@/components/sessions/SessionsList';
import WeeklyCalendar from '@/components/sessions/WeeklyCalendar';
import { useSessions } from '@/hooks/useSessions';
import { Button } from '@/components/ui/button';
import { Calendar, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Sessions = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const { 
    sessions, 
    upcomingSessions, 
    pastSessions, 
    isSessionsLoading, 
    joinSession 
  } = useSessions();

  const handleFindMentors = () => {
    navigate('/find-mentors');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Sessions & Calendar</h1>
          
          {user?.role === 'mentor' && (
            <Button 
              variant="outline"
              className="text-mentorpurple border-mentorpurple hover:bg-mentorpurple/10"
              onClick={() => navigate('/availability')}
            >
              <Calendar className="mr-2 h-4 w-4" /> Manage Availability
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-2 bg-darkbg-secondary border-cardborder">
            <CardHeader>
              <CardTitle>Your Sessions Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <WeeklyCalendar 
                date={selectedDate}
                sessions={sessions}
                isLoading={isSessionsLoading}
              />
            </CardContent>
          </Card>

          {/* Sessions List */}
          <Card className="bg-darkbg-secondary border-cardborder">
            <CardHeader>
              <CardTitle>Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <SessionsList 
                upcomingSessions={upcomingSessions}
                pastSessions={pastSessions}
                currentUser={user}
                onFindMentors={handleFindMentors}
                onJoinSession={joinSession}
              />
            </CardContent>
          </Card>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-darkbg-secondary border-cardborder">
            <CardHeader>
              <CardTitle>
                {user?.role === 'mentor' ? 'Your Statistics' : 'Your Mentorship Journey'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user?.role === 'mentor' ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-darkbg rounded-lg">
                    <div>
                      <p className="text-sm text-textSecondary">Average Rating</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xl font-bold mr-2">{user?.rating?.toFixed(1) || '0.0'}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg 
                              key={i} 
                              className={`w-4 h-4 ${i < Math.floor(user?.rating || 0) ? "text-yellow-400" : "text-cardborder"}`}
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-textSecondary">Sessions Completed</p>
                      <p className="text-xl font-bold mt-1">{user?.sessionsCompleted || 0}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Sessions per week</p>
                    <div className="h-40 bg-darkbg rounded-lg flex items-end justify-around p-4">
                      {/* Simple bar chart for sessions per week */}
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                        <div key={day} className="flex flex-col items-center">
                          <div 
                            className="bg-mentorpurple/70 w-8 rounded-t-md" 
                            style={{ 
                              height: `${Math.max(15, Math.random() * 80)}px`
                            }}
                          ></div>
                          <span className="text-xs mt-2">{day}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm font-medium mb-2">Your Mentor History</p>
                  {pastSessions.length > 0 ? (
                    <div className="space-y-3 max-h-[300px] overflow-y-auto">
                      {Array.from(new Set(pastSessions.map(s => s.mentorId))).map((mentorId, idx) => {
                        const mentorSessions = pastSessions.filter(s => s.mentorId === mentorId);
                        const mentor = mentorSessions[0]?.mentor;
                        
                        return (
                          <div key={idx} className="flex items-center justify-between p-3 bg-darkbg rounded-lg">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-darkbg overflow-hidden border border-cardborder mr-3">
                                <img 
                                  src={mentor?.profileImage || '/placeholder.svg'} 
                                  alt={mentor?.name || 'Mentor'} 
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-medium">{mentor?.name}</p>
                                <p className="text-sm text-textSecondary">{mentorSessions.length} sessions</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <span className="text-sm font-medium mr-1">4.8</span>
                              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center p-6 bg-darkbg rounded-lg">
                      <p className="text-textSecondary">You haven't had any sessions yet</p>
                      <Button 
                        onClick={handleFindMentors}
                        className="mt-3 bg-mentorblue hover:bg-mentorblue/90"
                      >
                        Find Mentors
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-darkbg-secondary border-cardborder">
            <CardHeader>
              <CardTitle>
                {user?.role === 'mentor' ? 'Sessions This Month' : 'Learning Progress'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-40 bg-darkbg rounded-lg flex items-end justify-around p-4">
                {/* Weekly progress chart */}
                {["Week 1", "Week 2", "Week 3", "Week 4"].map((week, i) => (
                  <div key={week} className="flex flex-col items-center">
                    <div 
                      className={`${user?.role === 'mentor' ? 'bg-mentorpurple/70' : 'bg-mentorblue/70'} w-12 rounded-t-md`}
                      style={{ height: `${Math.max(15, Math.random() * 100)}px` }}
                    ></div>
                    <span className="text-xs mt-2">{week}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Sessions;
