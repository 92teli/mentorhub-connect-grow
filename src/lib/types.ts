<<<<<<< HEAD

=======
>>>>>>> 29e8480 (updated code)
export type UserRole = "mentor" | "mentee";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  bio?: string;
  skills?: string[];
  profileImage?: string;
  rating?: number;
  sessionsCompleted?: number;
<<<<<<< HEAD
=======
  google_refresh_token?: string;
>>>>>>> 29e8480 (updated code)
}

export interface TimeSlot {
  id: string;
  mentorId: string;
  day: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface SessionRequest {
  id: string;
  menteeId: string;
  mentorId: string;
  timeSlotId: string;
  status: "pending" | "approved" | "declined";
  notes?: string;
  createdAt: Date;
}

export interface Session {
  id: string;
  menteeId: string;
  mentorId: string;
  timeSlotId: string;
  title: string;
  description?: string;
  meetLink: string;
  status: "scheduled" | "completed" | "cancelled";
  startTime: Date;
  endTime: Date;
  mentorFeedback?: Feedback;
  menteeFeedback?: Feedback;
  // Updated for UI display with partial User objects
  mentor?: Partial<User>;
  mentee?: Partial<User>;
}

export interface Feedback {
  id: string;
  sessionId: string;
  fromUserId: string;
  toUserId: string;
  rating: number;
  comments?: string;
  createdAt: Date;
}

export interface MentorAvailability {
  id: string;
  mentorId: string;
  weeklySlots: TimeSlot[];
}
