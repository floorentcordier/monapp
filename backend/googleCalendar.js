const { google } = require('googleapis');
const path = require('path');

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, 'google-credentials.json'), // Ton fichier de clés
  scopes: ['https://www.googleapis.com/auth/calendar'],
});

async function createEvent({ summary, description, startDateTime, endDateTime }) {
  const calendar = google.calendar({ version: 'v3', auth: await auth.getClient() });
  const calendarId = 'primary'; // ou remplace par ton ID d’agenda

  const event = {
    summary,
    description,
    start: { dateTime: startDateTime, timeZone: 'Europe/Brussels' },
    end: { dateTime: endDateTime, timeZone: 'Europe/Brussels' },
  };

  const response = await calendar.events.insert({
    calendarId,
    resource: event,
  });

  return response.data;
}

module.exports = { createEvent };
