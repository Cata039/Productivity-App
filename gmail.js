const { google } = require('googleapis');
const { oAuth2Client } = require('../config/googleAuth');

async function verifyEmail(email) {
    try {
        const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

        const profile = await gmail.users.getProfile({ userId: email });
        return profile.data.emailAddress === email; // Returns true if email exists
    } catch (error) {
        return false; // Email does not exist or is invalid
    }
}

module.exports = { verifyEmail };
