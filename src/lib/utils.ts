import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { createGoogleMeetLink } from "../integrations/google/meet";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MeetLinkOptions {
  title?: string;
  startTime?: Date;
  endTime?: Date;
  attendees?: string[];
  accessToken?: string;
}

// Generate a Google Meet link
export async function generateMeetLink(options: MeetLinkOptions = {}): Promise<string> {
  try {
    console.log('Generating Meet link with options:', {
      ...options,
      accessToken: options.accessToken ? 'present' : 'missing'
    });

    const {
      title = 'MentorHub Session',
      startTime = new Date(),
      endTime = new Date(startTime.getTime() + 60 * 60 * 1000), // 1 hour duration
      attendees = [],
      accessToken
    } = options;

    // Validate inputs
    if (startTime >= endTime) {
      console.error('Invalid time range:', { startTime, endTime });
      throw new Error('End time must be after start time');
    }

    if (!accessToken) {
      console.error('Missing access token');
      throw new Error('Access token is required to create a Google Meet link');
    }

    // Create the meeting link
    console.log('Calling createGoogleMeetLink with params:', {
      title,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      attendees,
      accessTokenLength: accessToken.length
    });

    const meetLink = await createGoogleMeetLink(
      title,
      startTime,
      endTime,
      attendees,
      accessToken
    );

    if (!meetLink) {
      console.error('No Meet link returned from createGoogleMeetLink');
      throw new Error('Failed to generate meeting link');
    }

    console.log('Successfully generated Meet link:', meetLink);
    return meetLink;
  } catch (error) {
    console.error('Error in generateMeetLink:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
}
