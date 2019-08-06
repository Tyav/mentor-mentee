const express = require('express');
const httpStatus = require('http-status');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const sendResponse = require('../helpers/response');
const scheduleModel = require('../models/schedule.model');

const router = express.Router();
console.log(router);

console.log(scheduleModel, 'hello');

router.post('/', (req, res) => {
  const schedule = new scheduleModel({
    day: req.body.day
  });
  console.log(schedule, 'this');

  res.send(schedule);
});

module.exports = router;
