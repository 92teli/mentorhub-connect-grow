import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const GoogleCalendarAuth: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const redirectToGoogleOAuth = () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'Please log in to connect your Google Calendar.',
      });
      return;
    }

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
    const scope = 'https://www.googleapis.com/auth/calendar';
    const responseType = 'code';
    const state = user.id; // Pass user ID in state parameter

    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.append('client_id', clientId);
    authUrl.searchParams.append('redirect_uri', redirectUri);
    authUrl.searchParams.append('response_type', responseType);
    authUrl.searchParams.append('scope', scope);
    authUrl.searchParams.append('access_type', 'offline');
    authUrl.searchParams.append('prompt', 'consent');
    authUrl.searchParams.append('state', state);

    window.location.href = authUrl.toString();
  };

  return (
    <Button
      onClick={redirectToGoogleOAuth}
      className="flex items-center gap-2 bg-white text-gray-800 hover:bg-gray-100"
    >
      <svg className="w-5 h-5" viewBox="0 0 48 48">
        <g>
          <path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C36.68 2.36 30.77 0 24 0 14.82 0 6.71 5.13 2.69 12.56l7.98 6.2C12.13 13.13 17.62 9.5 24 9.5z"/>
          <path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.6C43.93 37.36 46.1 31.36 46.1 24.55z"/>
          <path fill="#FBBC05" d="M10.67 28.13c-1.13-3.36-1.13-6.97 0-10.33l-7.98-6.2C.99 15.1 0 19.39 0 24c0 4.61.99 8.9 2.69 12.4l7.98-6.2z"/>
          <path fill="#EA4335" d="M24 48c6.77 0 12.48-2.24 16.64-6.09l-7.19-5.6c-2.01 1.35-4.59 2.15-7.45 2.15-6.38 0-11.87-3.63-14.33-8.86l-7.98 6.2C6.71 42.87 14.82 48 24 48z"/>
          <path fill="none" d="M0 0h48v48H0z"/>
        </g>
      </svg>
      Connect Google Calendar
    </Button>
  );
};

export default GoogleCalendarAuth; 