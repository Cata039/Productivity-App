const { google } = require('googleapis');
const { oAuth2Client } = require('../config/googleAuth');

// Check calendar availability
async function checkAvailability(emails, startTime, endTime) {
    try {
        const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

        const response = await calendar.freebusy.query({
            requestBody: {
                timeMin: startTime,
                timeMax: endTime,
                timeZone: 'UTC',
                items: emails.map(email => ({ id: email })),
            },
        });

        // Parse results
        const availability = {};
        for (const email of emails) {
            const busy = response.data.calendars[email].busy;
            availability[email] = busy.length === 0; // True if free, false if busy
        }
        return availability;
    } catch (error) {
        console.error('Error checking availability:', error);
        throw error;
    }
}

module.exports = { checkAvailability };
