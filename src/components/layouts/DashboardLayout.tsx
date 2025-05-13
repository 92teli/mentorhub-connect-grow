import React, { ReactNode, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';
import {
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  Home,
  Calendar,
  Users,
  Clock,
  LayoutDashboard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from './Navbar';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-12 w-12 rounded-full border-4 border-t-mentorpurple border-r-mentorblue border-b-mentorpurple border-l-mentorblue animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-darkbg">
      <div
        className={cn(
          "fixed top-0 bottom-0 left-0 z-40 bg-[hsl(var(--sidebar-background))] border-r border-[hsl(var(--sidebar-border))] transition-all backdrop-blur-xl shadow-2xl",
          sidebarOpen ? "w-64" : "w-16"
        )}
      >
        <div className="h-16 flex items-center justify-center border-b border-[hsl(var(--sidebar-border))]">
          {sidebarOpen ? (
            <span className="text-xl font-bold bg-gradient-to-r from-mentorblue to-mentorpurple text-transparent bg-clip-text">
              MentorHub
            </span>
          ) : (
            <span className="text-xl font-bold bg-gradient-to-r from-mentorblue to-mentorpurple text-transparent bg-clip-text">
              MH
            </span>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="mb-4 w-full flex justify-end text-[hsl(var(--sidebar-foreground))]"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
        </Button>

        <nav className="space-y-2 px-4">
          <SidebarItem
            to="/"
            icon={<Home className="text-mentorblue" />}
            text="Home"
            expanded={sidebarOpen}
          />
          <SidebarItem
            to="/dashboard"
            icon={<LayoutDashboard className="text-mentorpurple" />}
            text="Dashboard"
            expanded={sidebarOpen}
          />
          <SidebarItem
            to="/sessions"
            icon={<Calendar className="text-mentorpurple" />}
            text="Sessions"
            expanded={sidebarOpen}
          />
          {user?.role === 'mentor' ? (
            <>
              <SidebarItem
                to="/availability"
                icon={<CalendarRange className="text-mentorpurple" />}
                text="Availability"
                expanded={sidebarOpen}
              />
              <SidebarItem
                to="/requests"
                icon={<Clock className="text-yellow-400" />}
                text="Requests"
                expanded={sidebarOpen}
              />
            </>
          ) : (
            <>
              <SidebarItem
                to="/find-mentors"
                icon={<Users className="text-mentorblue" />}
                text="Find Mentors"
                expanded={sidebarOpen}
              />
              <SidebarItem
                to="/requests"
                icon={<Clock className="text-yellow-400" />}
                text="Requests"
                expanded={sidebarOpen}
              />
            </>
          )}
        </nav>
      </div>

      <div className={cn("flex flex-col flex-1", sidebarOpen ? "ml-64" : "ml-16")}>
        <Navbar />
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

interface SidebarItemProps {
  to: string;
  icon: ReactNode;
  text: string;
  expanded: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, text, expanded }) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center p-2 rounded-md hover:bg-[hsl(var(--sidebar-accent))] transition-colors",
        expanded ? "text-[hsl(var(--sidebar-foreground))] font-semibold" : "text-textSecondary"
      )}
    >
      <span className="mr-2">{icon}</span>
      {expanded && <span>{text}</span>}
    </Link>
  );
};

export default DashboardLayout;
