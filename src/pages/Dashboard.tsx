<<<<<<< HEAD

=======
>>>>>>> 29e8480 (updated code)
import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, Clock, User } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useSessions } from '@/hooks/useSessions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
<<<<<<< HEAD
=======
import { initiateGoogleAuth } from '@/integrations/google/meet';
import { motion } from 'framer-motion';
>>>>>>> 29e8480 (updated code)

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { upcomingSessions, pastSessions } = useSessions();
  const [stats, setStats] = useState({
    rating: 0,
    sessionsCompleted: 0,
    pendingRequests: 0,
    upcomingSessionsCount: 0
  });

  useEffect(() => {
    if (user) {
      // Update stats based on session data
      setStats({
        rating: user.rating || 0,
        sessionsCompleted: pastSessions.length || 0,
        pendingRequests: 3, // Mock data for now
        upcomingSessionsCount: upcomingSessions.length || 0
      });
    }
  }, [user, upcomingSessions, pastSessions]);

  // Format date for display
  const formatSessionDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(new Date(date));
  };

<<<<<<< HEAD
  return (
    <DashboardLayout>
=======
  // Use a random avatar based on the user's name
  const avatarUrl = `https://i.pravatar.cc/300?u=${encodeURIComponent(user?.name || user?.email || "user")}`;

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {user?.role === 'mentor' && !user?.google_refresh_token && (
          <Button onClick={initiateGoogleAuth} className="bg-[#4285F4] hover:bg-[#357ae8] text-white">
            Connect Google Calendar
          </Button>
        )}
      </div>
>>>>>>> 29e8480 (updated code)
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}</h1>
          <p className="text-textSecondary">
            {user?.role === 'mentor'
              ? 'Your mentorship dashboard overview'
              : 'Track your learning progress and upcoming sessions'}
          </p>
        </div>
        
        {/* Profile Section */}
<<<<<<< HEAD
        <Card className="bg-darkbg-secondary border-cardborder overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3 bg-gradient-to-br from-mentorpurple/20 to-mentorblue/20 p-6 flex flex-col items-center justify-center">
              <div className="h-32 w-32 rounded-full bg-darkbg overflow-hidden border-4 border-cardborder mb-4">
                <img 
                  src={user?.profileImage || "https://i.pravatar.cc/300"} 
                  alt={user?.name || "User"} 
                  className="h-full w-full object-cover"
                />
              </div>
=======
        <motion.div
          className="rounded-2xl bg-darkbgSecondary/70 backdrop-blur-xl shadow-2xl border border-white/10 overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="md:flex">
            <div className="md:w-1/3 bg-gradient-to-br from-mentorpurple/20 to-mentorblue/20 p-6 flex flex-col items-center justify-center">
              <motion.div
                className="h-32 w-32 rounded-full bg-darkbg overflow-hidden border-4 border-cardborder mb-4 shadow-lg"
                whileHover={{ scale: 1.05, boxShadow: '0 0 32px #9F40FF55' }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <img
                  src={avatarUrl}
                  alt={user?.name || "User"}
                  className="h-full w-full object-cover"
                />
              </motion.div>
>>>>>>> 29e8480 (updated code)
              <h2 className="text-xl font-semibold">{user?.name}</h2>
              <p className="text-textSecondary capitalize">{user?.role}</p>
              
              <div className="mt-4 w-full">
<<<<<<< HEAD
                <Button 
                  variant="outline"
                  className="w-full bg-darkbg border-cardborder hover:bg-darkbg/90"
                  onClick={() => navigate('/profile')}
                >
                  <User className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
=======
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button 
                    variant="outline"
                    className="w-full bg-darkbg border-cardborder hover:bg-darkbg/90"
                    onClick={() => navigate('/profile')}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </motion.div>
>>>>>>> 29e8480 (updated code)
              </div>
            </div>
            
            <div className="md:w-2/3 p-6">
              <h3 className="text-lg font-medium mb-4">Dashboard Overview</h3>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
<<<<<<< HEAD
                <div className="bg-darkbg rounded-lg p-4 border border-cardborder">
                  <div className="flex flex-col">
                    <span className="text-textSecondary text-sm mb-1">
                      {user?.role === 'mentor' ? 'Rating' : 'Sessions'}
                    </span>
                    {user?.role === 'mentor' ? (
                      <div className="flex items-center">
                        <span className="text-2xl font-bold mr-2">{stats.rating.toFixed(1)}</span>
                        <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    ) : (
                      <span className="text-2xl font-bold">{stats.sessionsCompleted}</span>
                    )}
                  </div>
                </div>
                
                <div className="bg-darkbg rounded-lg p-4 border border-cardborder">
                  <div className="flex flex-col">
                    <span className="text-textSecondary text-sm mb-1">
                      {user?.role === 'mentor' ? 'Completed' : 'Upcoming'}
                    </span>
                    <div className="flex items-center">
                      <CheckCircle className={`h-5 w-5 mr-2 ${user?.role === 'mentor' ? 'text-mentorpurple' : 'text-mentorblue'}`} />
                      <span className="text-2xl font-bold">
                        {user?.role === 'mentor' ? stats.sessionsCompleted : stats.upcomingSessionsCount}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-darkbg rounded-lg p-4 border border-cardborder">
                  <div className="flex flex-col">
                    <span className="text-textSecondary text-sm mb-1">Pending</span>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-yellow-500" />
                      <span className="text-2xl font-bold">{stats.pendingRequests}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-darkbg rounded-lg p-4 border border-cardborder">
                  <div className="flex flex-col">
                    <span className="text-textSecondary text-sm mb-1">
                      {user?.role === 'mentor' ? 'Time Slots' : 'Mentors'}
                    </span>
                    <div className="flex items-center">
                      <Calendar className={`h-5 w-5 mr-2 ${user?.role === 'mentor' ? 'text-mentorpurple' : 'text-mentorblue'}`} />
                      <span className="text-2xl font-bold">
                        {user?.role === 'mentor' ? 5 : 3}  {/* Hardcoded for demo */}
                      </span>
                    </div>
                  </div>
                </div>
=======
                {[ // Card data for mapping
                  {
                    label: user?.role === 'mentor' ? 'Rating' : 'Sessions',
                    value: user?.role === 'mentor' ? stats.rating.toFixed(1) : stats.sessionsCompleted,
                    icon: user?.role === 'mentor' ? (
                      <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ) : null,
                  },
                  {
                    label: user?.role === 'mentor' ? 'Completed' : 'Upcoming',
                    value: user?.role === 'mentor' ? stats.sessionsCompleted : stats.upcomingSessionsCount,
                    icon: <CheckCircle className={`h-5 w-5 mr-2 ${user?.role === 'mentor' ? 'text-mentorpurple' : 'text-mentorblue'}`} />,
                  },
                  {
                    label: 'Pending',
                    value: stats.pendingRequests,
                    icon: <Clock className="h-5 w-5 mr-2 text-yellow-500" />,
                  },
                  {
                    label: user?.role === 'mentor' ? 'Time Slots' : 'Mentors',
                    value: user?.role === 'mentor' ? 5 : 3,
                    icon: <Calendar className={`h-5 w-5 mr-2 ${user?.role === 'mentor' ? 'text-mentorpurple' : 'text-mentorblue'}`} />,
                  },
                ].map((card, i) => (
                  <motion.div
                    key={i}
                    className="bg-darkbg rounded-lg p-4 border border-cardborder shadow-md backdrop-blur-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i, duration: 0.5, type: 'spring' }}
                    whileHover={{ scale: 1.04, boxShadow: '0 0 24px #38BDF855' }}
                  >
                    <div className="flex flex-col">
                      <span className="text-textSecondary text-sm mb-1">{card.label}</span>
                      <div className="flex items-center">
                        {card.icon}
                        <span className="text-2xl font-bold">{card.value}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
>>>>>>> 29e8480 (updated code)
              </div>
              
              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {user?.role === 'mentor' ? (
                  <>
<<<<<<< HEAD
                    <Button 
                      variant="outline" 
                      className="border-mentorpurple text-mentorpurple hover:bg-mentorpurple/10"
                      onClick={() => navigate('/availability')}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Manage Availability
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-mentorpurple text-mentorpurple hover:bg-mentorpurple/10"
                      onClick={() => navigate('/requests')}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      Pending Requests
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-mentorpurple text-mentorpurple hover:bg-mentorpurple/10"
                      onClick={() => navigate('/sessions')}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      My Sessions
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="outline" 
                      className="border-mentorblue text-mentorblue hover:bg-mentorblue/10"
                      onClick={() => navigate('/find-mentors')}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Find Mentors
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-mentorblue text-mentorblue hover:bg-mentorblue/10"
                      onClick={() => navigate('/requests')}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      My Requests
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-mentorblue text-mentorblue hover:bg-mentorblue/10"
                      onClick={() => navigate('/sessions')}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      My Sessions
                    </Button>
=======
                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                      <Button
                        variant="outline"
                        className="border-mentorpurple text-mentorpurple hover:bg-mentorpurple/10"
                        onClick={() => navigate('/availability')}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        Manage Availability
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                      <Button
                        variant="outline"
                        className="border-mentorpurple text-mentorpurple hover:bg-mentorpurple/10"
                        onClick={() => navigate('/requests')}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        Pending Requests
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                      <Button
                        variant="outline"
                        className="border-mentorpurple text-mentorpurple hover:bg-mentorpurple/10"
                        onClick={() => navigate('/sessions')}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        My Sessions
                      </Button>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                      <Button
                        variant="outline"
                        className="border-mentorblue text-mentorblue hover:bg-mentorblue/10"
                        onClick={() => navigate('/find-mentors')}
                      >
                        <User className="mr-2 h-4 w-4" />
                        Find Mentors
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                      <Button
                        variant="outline"
                        className="border-mentorblue text-mentorblue hover:bg-mentorblue/10"
                        onClick={() => navigate('/requests')}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        My Requests
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                      <Button
                        variant="outline"
                        className="border-mentorblue text-mentorblue hover:bg-mentorblue/10"
                        onClick={() => navigate('/sessions')}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        My Sessions
                      </Button>
                    </motion.div>
>>>>>>> 29e8480 (updated code)
                  </>
                )}
              </div>
            </div>
          </div>
<<<<<<< HEAD
        </Card>
=======
        </motion.div>
>>>>>>> 29e8480 (updated code)
        
        {/* Upcoming Sessions */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Upcoming Sessions</h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/sessions')}
              className={`border-${user?.role === 'mentor' ? 'mentorpurple' : 'mentorblue'} text-${user?.role === 'mentor' ? 'mentorpurple' : 'mentorblue'}`}
            >
              View All
            </Button>
          </div>
          
          {upcomingSessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingSessions.slice(0, 2).map((session) => (
                <Card key={session.id} className="bg-darkbg-secondary border-cardborder hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{session.title}</CardTitle>
                        <p className="text-textSecondary text-sm mt-1">
                          {formatSessionDate(session.startTime)}
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-green-500 text-green-500 hover:bg-green-500/10"
                        onClick={() => navigate(`/session/${session.id}`)}
                      >
                        View
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-textSecondary mb-3">
                      {session.description || "No description provided."}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-darkbg border border-cardborder overflow-hidden">
                        <img 
                          src={user?.role === 'mentor' 
                            ? session.mentee?.profileImage || "https://i.pravatar.cc/300" 
                            : session.mentor?.profileImage || "https://i.pravatar.cc/300"} 
                          alt={user?.role === 'mentor' ? 'Mentee' : 'Mentor'} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {user?.role === 'mentor' 
                            ? `${session.mentee?.name || 'Unknown'} (Mentee)` 
                            : `${session.mentor?.name || 'Unknown'} (Mentor)`}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-darkbg-secondary border-cardborder">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Calendar className="h-12 w-12 text-textSecondary mb-2" />
                <p className="text-center text-textSecondary">No upcoming sessions.</p>
                <Button 
                  variant="outline" 
                  className={`mt-4 border-${user?.role === 'mentor' ? 'mentorpurple' : 'mentorblue'} text-${user?.role === 'mentor' ? 'mentorpurple' : 'mentorblue'} hover:bg-${user?.role === 'mentor' ? 'mentorpurple' : 'mentorblue'}/10`}
                  onClick={() => navigate(user?.role === 'mentor' ? '/availability' : '/find-mentors')}
                >
                  {user?.role === 'mentor' ? 'Set Your Availability' : 'Find Mentors'}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
