require('dotenv').config(); // Load environment variables first

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');  // Import the cors package
const gmailRoutes = require('./routes/gmail');
const calendarRoutes = require('./routes/calendar');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

// Routes
app.use('/api/gmail', gmailRoutes);
app.use('/api/calendar', calendarRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
