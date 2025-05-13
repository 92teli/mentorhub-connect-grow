
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Star, Filter, UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Define the interface for mentors based on what's available in the types.ts file
interface MentorProfile {
  id: string;
  name: string;
  role: string;
  bio?: string;
  skills?: string[];
  profile_image?: string;
  rating?: number;
  sessions_completed?: number;
  timeSlots?: any[];
}

const FindMentors = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    skills: '',
    dayOfWeek: '',
    minRating: 0,
  });

  // Fetch mentors query
  const { data: mentors, isLoading } = useQuery({
    queryKey: ['mentors'],
    queryFn: async () => {
      // Fetch mentors from profiles table
      const { data: mentorProfiles, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'mentor');

      if (error) throw error;

      // Load time slots for each mentor
      const mentorsWithSlots = await Promise.all(
        mentorProfiles.map(async (profile) => {
          const { data: timeSlots, error: slotsError } = await supabase
            .from('time_slots')
            .select('*')
            .eq('mentor_id', profile.id)
            .eq('is_booked', false);

          if (slotsError) {
            console.error('Error fetching time slots:', slotsError);
            return { ...profile, timeSlots: [] };
          }

          return {
            ...profile,
            timeSlots: timeSlots || [],
          };
        })
      );
      
      return mentorsWithSlots;
    },
  });

  // Apply filters to mentors
  const filteredMentors = mentors?.filter(mentor => {
    // Filter by skills
    if (filters.skills && mentor.skills) {
      const hasSkill = mentor.skills.some(skill => 
        skill.toLowerCase().includes(filters.skills.toLowerCase())
      );
      if (!hasSkill) return false;
    }
    
    // Filter by day of week
    if (filters.dayOfWeek && mentor.timeSlots?.length) {
      const hasDay = mentor.timeSlots.some(slot => 
        slot.day.toLowerCase() === filters.dayOfWeek.toLowerCase()
      );
      if (!hasDay) return false;
    }
    
    // Filter by rating
    if (filters.minRating > 0 && mentor.rating < filters.minRating) {
      return false;
    }
    
    return true;
  });

  const handleRequestSession = (mentorId: string) => {
    navigate(`/request-session/${mentorId}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Find Mentors</h1>
            <p className="text-textSecondary">Connect with experienced mentors in your field</p>
          </div>
        </div>
        
        {/* Filters */}
        <Card className="bg-darkbg-secondary border-cardborder">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Filter className="mr-2 h-5 w-5" /> Filter Mentors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="skills">Skills</Label>
                <Input 
                  id="skills" 
                  placeholder="e.g. React, Node.js"
                  value={filters.skills}
                  onChange={(e) => setFilters({...filters, skills: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dayOfWeek">Available Day</Label>
                <Select 
                  onValueChange={(value) => setFilters({...filters, dayOfWeek: value})}
                  value={filters.dayOfWeek}
                >
                  <SelectTrigger id="dayOfWeek">
                    <SelectValue placeholder="Any day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any day</SelectItem>
                    <SelectItem value="Monday">Monday</SelectItem>
                    <SelectItem value="Tuesday">Tuesday</SelectItem>
                    <SelectItem value="Wednesday">Wednesday</SelectItem>
                    <SelectItem value="Thursday">Thursday</SelectItem>
                    <SelectItem value="Friday">Friday</SelectItem>
                    <SelectItem value="Saturday">Saturday</SelectItem>
                    <SelectItem value="Sunday">Sunday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="minRating">Minimum Rating</Label>
                <Select 
                  onValueChange={(value) => setFilters({...filters, minRating: Number(value)})}
                  value={filters.minRating.toString()}
                >
                  <SelectTrigger id="minRating">
                    <SelectValue placeholder="Any rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any rating</SelectItem>
                    <SelectItem value="3">3+ stars</SelectItem>
                    <SelectItem value="4">4+ stars</SelectItem>
                    <SelectItem value="4.5">4.5+ stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Mentors Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-12 w-12 rounded-full border-4 border-t-mentorpurple border-r-mentorblue border-b-mentorpurple border-l-mentorblue animate-spin"></div>
          </div>
        ) : filteredMentors?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((mentor) => (
              <Card key={mentor.id} className="bg-darkbg-secondary border-cardborder hover:border-mentorblue/40 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-darkbg overflow-hidden border border-cardborder">
                      <img 
                        src={mentor.profile_image || "/placeholder.svg"} 
                        alt={mentor.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{mentor.name}</CardTitle>
                      <div className="flex items-center mt-1">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-sm">{mentor.rating?.toFixed(1) || 'New'}</span>
                        <span className="text-xs text-textSecondary ml-2">
                          ({mentor.sessions_completed || 0} sessions)
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Skills */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Skills & Expertise</h4>
                    <div className="flex flex-wrap gap-1">
                      {mentor.skills?.map((skill, i) => (
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
                      <p className="text-sm text-textSecondary line-clamp-2">{mentor.bio}</p>
                    </div>
                  )}
                  
                  {/* Available Slots */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Available Time Slots</h4>
                    {mentor.timeSlots && mentor.timeSlots.length > 0 ? (
                      <div className="space-y-1 max-h-24 overflow-y-auto pr-2">
                        {mentor.timeSlots.slice(0, 3).map((slot, i) => (
                          <div key={i} className="flex items-center text-sm gap-1">
                            <Calendar className="h-3 w-3 text-mentorblue" />
                            <span>{slot.day} </span>
                            <Clock className="h-3 w-3 ml-1 text-mentorblue" />
                            <span>{slot.start_time} - {slot.end_time}</span>
                          </div>
                        ))}
                        {mentor.timeSlots.length > 3 && (
                          <div className="text-xs text-textSecondary">
                            +{mentor.timeSlots.length - 3} more time slots
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-textSecondary">No available time slots</div>
                    )}
                  </div>
                  
                  <Button 
                    className="w-full bg-mentorblue hover:bg-mentorblue/90"
                    onClick={() => handleRequestSession(mentor.id)}
                    disabled={!mentor.timeSlots || mentor.timeSlots.length === 0}
                  >
                    Request Session
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-darkbg-secondary border-cardborder p-8">
            <div className="text-center">
              <div className="rounded-full bg-darkbg p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <UserIcon className="h-8 w-8 text-textSecondary" />
              </div>
              <h3 className="text-lg font-medium mb-2">No mentors found</h3>
              <p className="text-textSecondary">
                Try adjusting your filters or check back later
              </p>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FindMentors;
