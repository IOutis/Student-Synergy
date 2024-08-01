import { google } from 'googleapis';
import { getServerSession } from 'next-auth/next';
import NextAuth from 'next-auth';

export default async (req, res) => {
  try {
    // Get session from server-side
    const session = await getServerSession(req, res, NextAuth);
    console.log('Session in API route:', session);

    if (!session || !session.accessToken) {
        console.log(session.accessToken?"Yes":"No");
      return res.status(401).json({ error: 'Unauthorized or No Access Token' });
    }

    const { accessToken } = session;
    const { task, deadline, description, recurring } = req.body;

    console.log('AccessToken in API route:', accessToken);

    // Initialize OAuth2 client with client ID, client secret, and redirect URI
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // Set credentials using access token
    oauth2Client.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Create event object
    const event = {
      summary: task,
      description,
      start: {
        dateTime: new Date(deadline).toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: new Date(new Date(deadline).getTime() + 60 * 60 * 1000).toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      recurrence: recurring && recurring !== 'none' ? [`RRULE:FREQ=${recurring.toUpperCase().replace(' ', '_')}`] : [],
    };

    // Insert event into Google Calendar
    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
};
