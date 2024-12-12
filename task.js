const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    text: { type: String, required: true },
    urgency: { type: String, enum: ['red', 'yellow', 'green', 'meeting'], required: true },
    completed: { type: Boolean, default: false },
    startTime: { type: String }, // Only for meetings
    endTime: { type: String },   // Only for meetings
    emails: { type: [String] },  // Only for meetings
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
