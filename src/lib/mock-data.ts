
import { User, UserRole, TimeSlot, SessionRequest, Session, Feedback, MentorAvailability } from './types';

export const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "mentor" as UserRole,
    bio: "Senior Software Engineer with 10+ years of experience. Specializing in React, Node.js and cloud architecture.",
    skills: ["React", "Node.js", "AWS", "System Design"],
    profileImage: "/placeholder.svg",
    rating: 4.8,
    sessionsCompleted: 24
  },
  {
    id: "2",
    name: "John Doe",
    email: "john@example.com",
    role: "mentee" as UserRole,
    bio: "Junior developer looking to improve my React and backend skills.",
    skills: ["HTML", "CSS", "JavaScript", "React basics"],
    profileImage: "/placeholder.svg",
    rating: 4.5,
    sessionsCompleted: 8
  },
  {
    id: "3",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "mentor" as UserRole,
    bio: "UX/UI Designer with a passion for creating user-friendly interfaces. I've worked with startups and large enterprises.",
    skills: ["UI Design", "UX Research", "Figma", "Design Systems"],
    profileImage: "/placeholder.svg",
    rating: 4.9,
    sessionsCompleted: 32
  },
  {
    id: "4",
    name: "Michael Chen",
    email: "michael@example.com",
    role: "mentor" as UserRole,
    bio: "Full Stack Developer specializing in React and Django. I love helping junior devs level up their skills.",
    skills: ["React", "Django", "PostgreSQL", "Docker"],
    profileImage: "/placeholder.svg",
    rating: 4.7,
    sessionsCompleted: 18
  },
  {
    id: "5",
    name: "Priya Patel",
    email: "priya@example.com",
    role: "mentee" as UserRole,
    bio: "Computer Science graduate looking to break into the tech industry. Interested in frontend development.",
    skills: ["JavaScript", "HTML/CSS", "Basic React"],
    profileImage: "/placeholder.svg",
    rating: 4.6,
    sessionsCompleted: 5
  }
];

export const MOCK_AVAILABILITIES: MentorAvailability[] = [
  {
    id: "avail-1",
    mentorId: "1",
    weeklySlots: [
      {
        id: "slot-1",
        mentorId: "1",
        day: "Monday",
        startTime: "10:00",
        endTime: "11:00",
        isBooked: false
      },
      {
        id: "slot-2",
        mentorId: "1",
        day: "Monday",
        startTime: "14:00",
        endTime: "15:00",
        isBooked: true
      },
      {
        id: "slot-3",
        mentorId: "1",
        day: "Wednesday",
        startTime: "11:00",
        endTime: "12:00",
        isBooked: false
      }
    ]
  },
  {
    id: "avail-3",
    mentorId: "3",
    weeklySlots: [
      {
        id: "slot-7",
        mentorId: "3",
        day: "Tuesday",
        startTime: "13:00",
        endTime: "14:00",
        isBooked: false
      },
      {
        id: "slot-8",
        mentorId: "3",
        day: "Thursday",
        startTime: "16:00",
        endTime: "17:00",
        isBooked: false
      }
    ]
  },
  {
    id: "avail-4",
    mentorId: "4",
    weeklySlots: [
      {
        id: "slot-9",
        mentorId: "4",
        day: "Monday",
        startTime: "18:00",
        endTime: "19:00",
        isBooked: true
      },
      {
        id: "slot-10",
        mentorId: "4",
        day: "Friday",
        startTime: "12:00",
        endTime: "13:00",
        isBooked: false
      }
    ]
  }
];

export const MOCK_SESSION_REQUESTS: SessionRequest[] = [
  {
    id: "req-1",
    menteeId: "2",
    mentorId: "1",
    timeSlotId: "slot-1",
    status: "pending",
    notes: "I'd like help with React hooks and context API",
    createdAt: new Date("2023-05-10T14:30:00")
  },
  {
    id: "req-2",
    menteeId: "5",
    mentorId: "3",
    timeSlotId: "slot-7",
    status: "approved",
    notes: "Need advice on UI portfolio projects",
    createdAt: new Date("2023-05-09T09:15:00")
  },
  {
    id: "req-3",
    menteeId: "2",
    mentorId: "4",
    timeSlotId: "slot-10",
    status: "declined",
    notes: "Would like to discuss career transition strategies",
    createdAt: new Date("2023-05-08T16:45:00")
  }
];

export const MOCK_SESSIONS: Session[] = [
  {
    id: "session-1",
    menteeId: "2",
    mentorId: "1",
    timeSlotId: "slot-2",
    title: "React Hooks Deep Dive",
    description: "Session focusing on useEffect, useContext and custom hooks patterns",
    meetLink: "https://meet.google.com/abc-defg-hij",
    status: "scheduled",
    startTime: new Date("2023-05-15T14:00:00"),
    endTime: new Date("2023-05-15T15:00:00")
  },
  {
    id: "session-2",
    menteeId: "5",
    mentorId: "3",
    timeSlotId: "slot-8",
    title: "UX Portfolio Review",
    description: "Review of current projects and feedback for improvement",
    meetLink: "https://meet.google.com/klm-nopq-rst",
    status: "completed",
    startTime: new Date("2023-05-11T16:00:00"),
    endTime: new Date("2023-05-11T17:00:00"),
    mentorFeedback: {
      id: "feedback-1",
      sessionId: "session-2",
      fromUserId: "3",
      toUserId: "5",
      rating: 4,
      comments: "Great preparation and thoughtful questions. Need to work on implementing feedback more quickly.",
      createdAt: new Date("2023-05-11T17:10:00")
    },
    menteeFeedback: {
      id: "feedback-2",
      sessionId: "session-2",
      fromUserId: "5",
      toUserId: "3",
      rating: 5,
      comments: "Sarah provided excellent insights and practical advice for my portfolio. Very helpful!",
      createdAt: new Date("2023-05-11T17:15:00")
    }
  },
  {
    id: "session-3",
    menteeId: "2",
    mentorId: "4",
    timeSlotId: "slot-9",
    title: "Full Stack Project Planning",
    description: "Planning architecture and tech stack for a personal project",
    meetLink: "https://meet.google.com/uvw-xyz-123",
    status: "completed",
    startTime: new Date("2023-05-08T18:00:00"),
    endTime: new Date("2023-05-08T19:00:00"),
    mentorFeedback: {
      id: "feedback-3",
      sessionId: "session-3",
      fromUserId: "4", 
      toUserId: "2",
      rating: 5,
      comments: "John came prepared with a clear idea and specific questions. A pleasure to mentor.",
      createdAt: new Date("2023-05-08T19:10:00")
    },
    menteeFeedback: {
      id: "feedback-4",
      sessionId: "session-3",
      fromUserId: "2",
      toUserId: "4",
      rating: 5,
      comments: "Michael provided incredibly detailed and actionable advice. Exactly what I needed!",
      createdAt: new Date("2023-05-08T19:15:00")
    }
  }
];

export const MOCK_FEEDBACK: Feedback[] = [
  ...(MOCK_SESSIONS.filter(s => s.mentorFeedback).map(s => s.mentorFeedback as Feedback)),
  ...(MOCK_SESSIONS.filter(s => s.menteeFeedback).map(s => s.menteeFeedback as Feedback))
];
