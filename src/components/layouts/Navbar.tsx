<<<<<<< HEAD

=======
>>>>>>> 29e8480 (updated code)
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
<<<<<<< HEAD
=======
import { motion, AnimatePresence } from 'framer-motion';
>>>>>>> 29e8480 (updated code)

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

<<<<<<< HEAD
  return (
    <div className="border-b border-cardborder bg-darkbg-secondary">
      <div className="flex h-16 items-center px-4">
        <div className="flex-1">
          <Link to="/dashboard" className="flex items-center">
            <span className="text-xl font-bold bg-gradient-to-r from-mentorblue to-mentorpurple text-transparent bg-clip-text">MentorMatch</span>
          </Link>
=======
  // Use a random avatar based on the user's name
  const avatarUrl = `https://i.pravatar.cc/300?u=${encodeURIComponent(user?.name || user?.email || "user")}`;

  return (
    <motion.div
      className="border-b border-cardborder bg-darkbg-secondary/80 backdrop-blur-xl shadow-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex h-16 items-center px-4">
        <div className="flex-1">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Link to="/dashboard" className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-mentorblue to-mentorpurple text-transparent bg-clip-text drop-shadow-lg">
                MentorHub
              </span>
            </Link>
          </motion.div>
>>>>>>> 29e8480 (updated code)
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
<<<<<<< HEAD
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar>
                  <AvatarImage src={user?.profileImage || "https://i.pravatar.cc/300"} alt={user?.name || "User"} />
                  <AvatarFallback>{user ? getInitials(user.name) : "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
=======
              <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full shadow-md hover:shadow-xl transition-shadow">
                  <Avatar>
                    <AvatarImage src={avatarUrl} alt={user?.name || "User"} />
                    <AvatarFallback>{user ? getInitials(user.name) : "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <AnimatePresence>
              <DropdownMenuContent
                className="w-56"
                align="end"
                asChild
                forceMount
              >
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </motion.div>
              </DropdownMenuContent>
            </AnimatePresence>
          </DropdownMenu>
        </div>
      </div>
    </motion.div>
>>>>>>> 29e8480 (updated code)
  );
};

export default Navbar;
