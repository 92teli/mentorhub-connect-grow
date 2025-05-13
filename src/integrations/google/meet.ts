import { GOOGLE_CONFIG } from './config';

interface GoogleTokens {
  accessToken: string;
  refreshToken: string;
}

// Function to initiate Google OAuth flow
export function initiateGoogleAuth(): void {
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.append('client_id', GOOGLE_CONFIG.clientId);
  authUrl.searchParams.append('redirect_uri', GOOGLE_CONFIG.redirectUri);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('scope', GOOGLE_CONFIG.scopes.join(' '));
  authUrl.searchParams.append('access_type', 'offline');
  authUrl.searchParams.append('prompt', 'consent');

  window.location.href = authUrl.toString();
}

// Function to exchange authorization code for tokens
export async function exchangeCodeForTokens(code: string): Promise<GoogleTokens> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: GOOGLE_CONFIG.clientId,
      redirect_uri: GOOGLE_CONFIG.redirectUri,
      grant_type: 'authorization_code',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to exchange code for tokens');
  }

  const data = await response.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
  };
}

// Function to create a Google Calendar event with Meet link
export async function createGoogleMeetLink(
  title: string,
  startTime: Date,
  endTime: Date,
  attendees: string[],
  accessToken: string
): Promise<string> {
  try {
    console.log('Creating Google Meet link with params:', {
      title,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      attendees,
      accessTokenLength: accessToken?.length
    });

    // Generate a unique meeting ID
    const meetingId = generateMeetingId();
    
    const event = {
      summary: title,
      start: {
        dateTime: startTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      attendees: attendees.map(email => ({ email })),
      conferenceData: {
        createRequest: {
          requestId: meetingId,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
    };

    console.log('Sending request to Google Calendar API with event:', event);

    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Google Calendar API error:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      throw new Error(`Failed to create calendar event: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Google Calendar API response:', data);
    
    // Extract the Meet link from the response
    const meetLink = data.hangoutLink || data.conferenceData?.entryPoints?.[0]?.uri;
    
    if (!meetLink) {
      console.log('No Meet link in response, using fallback');
      // Fallback to generating a direct Meet link if the API doesn't return one
      return `https://meet.google.com/${meetingId}`;
    }

    console.log('Successfully generated Meet link:', meetLink);
    return meetLink;
  } catch (error) {
    console.error('Error creating Google Meet link:', error);
    // Fallback to generating a direct Meet link if the API call fails
    const meetingId = generateMeetingId();
    const fallbackLink = `https://meet.google.com/${meetingId}`;
    console.log('Using fallback Meet link:', fallbackLink);
    return fallbackLink;
  }
}

// Helper function to generate a unique meeting ID
function generateMeetingId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Function to refresh access token
export async function refreshAccessToken(refreshToken: string): Promise<string> {
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: GOOGLE_CONFIG.clientId,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Token refresh error:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      throw new Error('Failed to refresh access token');
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw new Error('Failed to refresh access token');
  }
} 