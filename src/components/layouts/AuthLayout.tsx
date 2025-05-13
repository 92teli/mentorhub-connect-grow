<<<<<<< HEAD

import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-darkbg to-darkbg-secondary flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-mentorpurple to-mentorblue animate-pulse-slow"></div>
            <span className="text-2xl font-bold">MentorHub</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">{title}</h1>
          {subtitle && <p className="text-textSecondary">{subtitle}</p>}
        </div>
        <div className="bg-darkbg-secondary p-6 rounded-xl border border-cardborder shadow-lg">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
=======
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
}

export default function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-darkbg flex items-center justify-center p-4">
      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-96 h-96 bg-mentorblue/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/2 w-96 h-96 bg-mentorpurple/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Main content */}
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <motion.div
          className="text-center mb-8"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-mentorblue to-mentorpurple bg-clip-text text-transparent">
            MentorHub
          </h1>
        </motion.div>

        {/* Card */}
        <div className="bg-darkbgSecondary/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10">
          <motion.h2
            className="text-2xl font-semibold text-white text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {title}
          </motion.h2>

          {children}
        </div>
      </motion.div>
    </div>
  );
}
>>>>>>> 29e8480 (updated code)
