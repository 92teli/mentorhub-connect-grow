
import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AddTimeSlotSheet from '@/components/sessions/AddTimeSlotSheet';
import MentorAvailabilityCalendar from '@/components/sessions/MentorAvailabilityCalendar';
import { useSessions } from '@/hooks/useSessions';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Plus } from 'lucide-react';

const Availability = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAddingTimeSlot, setIsAddingTimeSlot] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const { 
    timeSlots, 
    isSlotsLoading, 
    deleteTimeSlot 
  } = useSessions();

  const handleTimeSlotSuccess = () => {
    toast({
      title: "Availability updated",
      description: "Your new time slot has been added successfully."
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Manage Availability</h1>
            <p className="text-textSecondary">
              Set your available time slots for mentorship sessions
            </p>
          </div>
          
          <AddTimeSlotSheet 
            isOpen={isAddingTimeSlot}
            setIsOpen={setIsAddingTimeSlot}
            onSuccess={handleTimeSlotSuccess}
          />
        </div>
        
        {/* Calendar and Time Slots */}
        <Card className="bg-darkbg-secondary border-cardborder">
          <CardHeader>
            <CardTitle>Your Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <MentorAvailabilityCalendar
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              timeSlots={timeSlots}
              onDeleteTimeSlot={deleteTimeSlot}
              isLoading={isSlotsLoading}
            />
            
            {!isSlotsLoading && timeSlots.length === 0 && (
              <div className="text-center py-8 mt-4">
                <Calendar className="h-12 w-12 mx-auto mb-3 text-textSecondary opacity-50" />
                <h3 className="text-lg font-medium mb-2">No Time Slots Added</h3>
                <p className="text-textSecondary mb-4 max-w-md mx-auto">
                  You haven't added any available time slots yet. Add your available times 
                  to let mentees request sessions with you.
                </p>
                <Button
                  onClick={() => setIsAddingTimeSlot(true)}
                  className="bg-mentorpurple hover:bg-mentorpurple/90"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Your First Time Slot
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Quick Tips */}
        <Card className="bg-darkbg-secondary border-cardborder">
          <CardHeader>
            <CardTitle>Tips For Setting Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-textSecondary">
              <li>Set consistent time slots each week to build a reliable schedule</li>
              <li>Consider adding time slots during both business and evening hours to accommodate different time zones</li>
              <li>Add availability at least 2 weeks in advance to maximize your mentor visibility</li>
              <li>Each time slot represents a single session opportunity that mentees can request</li>
              <li>You'll have the option to approve or decline each session request</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Availability;
