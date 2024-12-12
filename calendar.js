const express = require('express');
const { checkAvailability } = require('../services/calendarService');
const router = express.Router();

router.post('/check-availability', async (req, res) => {
    const { emails, startTime, endTime } = req.body;

    try {
        // Validate request body
        if (!emails || !startTime || !endTime) {
            return res.status(400).json({ message: 'Invalid request parameters' });
        }

        const availability = await checkAvailability(emails, startTime, endTime);

        res.status(200).json({ availability });
    } catch (error) {
        res.status(500).json({ message: 'Error checking availability', error });
    }
});

module.exports = router;
