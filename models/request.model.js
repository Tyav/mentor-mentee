const mongoose = require('mongoose');

const Request = new mongoose.Schema({
  menteeId: { type: String, required: true },
  scheduleId: { type: String },
  createdAt: { type: Date, default: new Date() }
});

module.exports = mongoose.model('Request', Request);
