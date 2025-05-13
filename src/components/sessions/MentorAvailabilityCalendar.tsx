
import React from 'react';
import { format, startOfWeek } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { TimeSlot } from '@/lib/types';
import WeeklyCalendar from './WeeklyCalendar';

interface MentorAvailabilityCalendarProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  timeSlots: TimeSlot[];
  onDeleteTimeSlot: (id: string) => void;
  isLoading: boolean;
}

const MentorAvailabilityCalendar: React.FC<MentorAvailabilityCalendarProps> = ({
  selectedDate,
  setSelectedDate,
  timeSlots,
  onDeleteTimeSlot,
  isLoading,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-4">
      <div className="md:w-64">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
          className="bg-darkbg border border-cardborder rounded-md p-3"
        />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">
            Week of {format(startOfWeek(selectedDate), 'MMM d, yyyy')}
          </h3>
        </div>
        <WeeklyCalendar 
          date={selectedDate} 
          timeSlots={timeSlots}
          onDelete={onDeleteTimeSlot}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default MentorAvailabilityCalendar;
