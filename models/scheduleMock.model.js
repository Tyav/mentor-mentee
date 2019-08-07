const mongoose = require('mongoose');

//Mock schema to find schedule
const Schedule = new mongoose.Schema({
  mentorID: { type: String, required: true },
  avalableOn: { type: String, required: true, default: new Date() },
  availabelFrom: { type: Date, required: true, default: new Date() },
  availableTo: { type: Date, required: true, default: new Date() },
  slots: { type: Number, required: true },
  createdAt: { type: Date, required: true, default: new Date() }
});

module.exports = mongoose.model('Schedule', Schedule);
