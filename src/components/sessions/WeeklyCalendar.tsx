<<<<<<< HEAD

import React from 'react';
import { addDays, format, startOfWeek } from 'date-fns';
=======
import React from 'react';
import { addDays, format, startOfWeek, isToday } from 'date-fns';
>>>>>>> 29e8480 (updated code)
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TimeSlot, Session } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';
<<<<<<< HEAD
=======
import { motion } from 'framer-motion';
>>>>>>> 29e8480 (updated code)

interface WeeklyCalendarProps {
  date: Date;
  timeSlots?: TimeSlot[];
  sessions?: Session[];
  onDelete?: (id: string) => void;
  isLoading?: boolean;
}

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
  date,
  timeSlots = [],
  sessions = [],
  onDelete,
  isLoading = false,
}) => {
  const { user } = useAuth();
  const startDate = startOfWeek(date);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  
  const getTimeSlotsByDay = (day: string) => {
    return timeSlots.filter(slot => slot.day === day);
  };
  
  const getSessionsByDay = (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    return sessions.filter(session => {
      const sessionDate = new Date(session.startTime);
      return format(sessionDate, 'yyyy-MM-dd') === formattedDate;
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div className="grid grid-cols-7 gap-2 h-[400px] overflow-y-auto">
      {weekDays.map((day, i) => {
        const dayName = format(day, 'EEEE');
        const dayDisplay = format(day, 'MMM d');
        const dayTimeSlots = getTimeSlotsByDay(dayName);
        const daySessions = getSessionsByDay(day);
        
        return (
          <div key={i} className="flex flex-col h-full">
            <div className="text-center py-2 border-b border-cardborder">
              <div className="font-semibold">{format(day, 'EEE')}</div>
              <div className="text-sm">{dayDisplay}</div>
            </div>
            <div className="flex-1 p-1 overflow-y-auto">
              {user?.role === 'mentor' ? (
                dayTimeSlots.length > 0 ? (
                  dayTimeSlots.map(slot => (
                    <div
                      key={slot.id}
                      className="mb-2 p-2 bg-darkbg rounded border border-cardborder text-xs relative group"
                    >
                      <div className="font-medium">
                        {slot.startTime} - {slot.endTime}
                      </div>
                      {slot.isBooked && (
                        <span className="block mt-1 text-mentorblue">Booked</span>
                      )}
                      {!slot.isBooked && onDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => onDelete(slot.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-textSecondary">
                    No slots
                  </div>
                )
              ) : (
                daySessions.length > 0 ? (
                  daySessions.map(session => (
                    <div
                      key={session.id}
                      className={`mb-2 p-2 rounded border text-xs relative ${
                        session.status === 'completed' 
                          ? 'bg-darkbg/50 border-cardborder text-textSecondary' 
                          : 'bg-mentorblue/10 border-mentorblue/30'
                      }`}
                    >
                      <div className="font-medium">
                        {format(new Date(session.startTime), 'HH:mm')} - {format(new Date(session.endTime), 'HH:mm')}
                      </div>
                      <div className="mt-1 truncate">{session.title}</div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-textSecondary">
                    No sessions
                  </div>
                )
              )}
            </div>
          </div>
        );
      })}
=======
    <div className="rounded-2xl bg-darkbgSecondary/70 backdrop-blur-xl shadow-xl border border-white/10 p-4 w-full h-full overflow-x-auto">
      <div className="grid grid-cols-7 gap-2 w-full h-full overflow-y-auto custom-scrollbar">
        {weekDays.map((day, i) => {
          const dayName = format(day, 'EEEE');
          const dayDisplay = format(day, 'MMM d');
          const dayTimeSlots = getTimeSlotsByDay(dayName);
          const daySessions = getSessionsByDay(day);
          const isCurrentDay = isToday(day);
          
          return (
            <div key={i} className={`flex flex-col h-full rounded-xl ${isCurrentDay ? 'bg-gradient-to-b from-mentorblue/10 to-mentorpurple/10 border-mentorblue/40 border-2 shadow-lg' : 'bg-darkbg/60 border border-cardborder'} transition-all`}>
              <div className={`text-center py-2 border-b border-cardborder rounded-t-xl ${isCurrentDay ? 'bg-gradient-to-r from-mentorblue/20 to-mentorpurple/20 text-mentorblue font-bold shadow' : ''}`}>
                <div className="font-semibold">{format(day, 'EEE')}</div>
                <div className="text-sm">{dayDisplay}</div>
              </div>
              <div className="flex-1 p-1 overflow-y-auto custom-scrollbar">
                {user?.role === 'mentor' ? (
                  dayTimeSlots.length > 0 ? (
                    dayTimeSlots.map((slot, idx) => (
                      <motion.div
                        key={slot.id}
                        className="mb-2 p-2 bg-darkbg/80 rounded-lg border border-cardborder text-xs relative group shadow-md hover:shadow-xl transition-all cursor-pointer"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * idx, duration: 0.3 }}
                        whileHover={{ scale: 1.04, boxShadow: '0 0 16px #38BDF855' }}
                      >
                        <div className="font-medium">
                          {slot.startTime} - {slot.endTime}
                        </div>
                        {slot.isBooked && (
                          <span className="block mt-1 text-mentorblue">Booked</span>
                        )}
                        {!slot.isBooked && onDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => onDelete(slot.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </motion.div>
                    ))
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs text-textSecondary">
                      No slots
                    </div>
                  )
                ) : (
                  daySessions.length > 0 ? (
                    daySessions.map((session, idx) => (
                      <motion.div
                        key={session.id}
                        className={`mb-2 p-2 rounded-lg border text-xs relative shadow-md hover:shadow-xl transition-all cursor-pointer ${
                          session.status === 'completed' 
                            ? 'bg-darkbg/60 border-cardborder text-textSecondary' 
                            : 'bg-gradient-to-r from-mentorblue/20 to-mentorpurple/20 border-mentorblue/40'
                        }`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * idx, duration: 0.3 }}
                        whileHover={{ scale: 1.04, boxShadow: '0 0 16px #9F40FF55' }}
                      >
                        <div className="font-medium">
                          {format(new Date(session.startTime), 'HH:mm')} - {format(new Date(session.endTime), 'HH:mm')}
                        </div>
                        <div className="mt-1 truncate">{session.title}</div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs text-textSecondary">
                      No sessions
                    </div>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #23243a;
          border-radius: 8px;
        }
      `}</style>
>>>>>>> 29e8480 (updated code)
    </div>
  );
};

export default WeeklyCalendar;
