
import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

const weekdays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

const timeSlots = [
  '09:00', '09:30', 
  '10:00', '10:30', 
  '11:00', '11:30', 
  '12:00', '12:30', 
  '13:00', '13:30', 
  '14:00', '14:30',
  '15:00', '15:30',
  '16:00', '16:30',
  '17:00', '17:30',
  '18:00', '18:30',
  '19:00', '19:30',
  '20:00', '20:30',
  '21:00', '21:30'
];

const TimeSlotForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [day, setDay] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [duration, setDuration] = useState<string>('30');
  const [timezone, setTimezone] = useState<string>(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  // Get available end times based on start time and duration
  const getAvailableEndTimes = () => {
    if (!startTime) return [];
    const startIndex = timeSlots.findIndex(time => time === startTime);
    if (startIndex === -1) return [];
    
    // If 30 min duration, next slot is available. If 60 min, skip one slot.
    const offset = duration === '30' ? 1 : 2;
    return timeSlots.slice(startIndex + offset);
  };

  // Auto-select end time based on duration when start time changes
  React.useEffect(() => {
    if (startTime) {
      const startIndex = timeSlots.findIndex(time => time === startTime);
      if (startIndex !== -1) {
        const endIndex = startIndex + (duration === '30' ? 1 : 2);
        if (endIndex < timeSlots.length) {
          setEndTime(timeSlots[endIndex]);
        } else {
          setEndTime('');
        }
      }
    }
  }, [startTime, duration]);

  // Create time slot mutation
  const createTimeSlotMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id || !day || !startTime || !endTime) {
        throw new Error('Missing required fields');
      }
      
      const { data, error } = await supabase.from('time_slots').insert({
        mentor_id: user.id,
        day: day,
        start_time: startTime,
        end_time: endTime,
        is_booked: false
      }).select();
      
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeSlots', user?.id] });
      toast({
        title: 'Time slot added',
        description: `${day} from ${startTime} to ${endTime} has been added to your available slots.`,
      });
      onSuccess();
      resetForm();
    },
    onError: (error) => {
      toast({
        title: 'Failed to add time slot',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTimeSlotMutation.mutate();
  };

  const resetForm = () => {
    setDay('');
    setStartTime('');
    setEndTime('');
    setDuration('30');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      <div className="space-y-2">
        <Label htmlFor="day">Day of the Week</Label>
        <Select 
          value={day} 
          onValueChange={setDay}
          required
        >
          <SelectTrigger id="day" className="w-full">
            <SelectValue placeholder="Select a day" />
          </SelectTrigger>
          <SelectContent>
            {weekdays.map((weekday) => (
              <SelectItem key={weekday} value={weekday}>
                {weekday}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">Session Duration</Label>
          <Select 
            value={duration} 
            onValueChange={setDuration}
          >
            <SelectTrigger id="duration">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="60">60 minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Input 
            id="timezone" 
            value={timezone} 
            disabled 
            className="bg-muted"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time</Label>
          <Select 
            value={startTime} 
            onValueChange={setStartTime}
            required
          >
            <SelectTrigger id="startTime">
              <SelectValue placeholder="Select start time" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((time) => (
                <SelectItem key={`start-${time}`} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="endTime">End Time</Label>
          <Select 
            value={endTime} 
            onValueChange={setEndTime}
            disabled={!startTime}
            required
          >
            <SelectTrigger id="endTime">
              <SelectValue placeholder="Select end time" />
            </SelectTrigger>
            <SelectContent>
              {getAvailableEndTimes().map((time) => (
                <SelectItem key={`end-${time}`} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="bg-mentorpurple hover:bg-mentorpurple/90 w-full mt-4"
        disabled={createTimeSlotMutation.isPending || !day || !startTime || !endTime}
      >
        {createTimeSlotMutation.isPending ? 'Adding...' : 'Add Time Slot'}
      </Button>
    </form>
  );
};

export default TimeSlotForm;
