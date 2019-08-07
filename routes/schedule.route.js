const express = require('express');
const httpStatus = require('http-status');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const sendResponse = require('../helpers/response');
const scheduleModel = require('../models/schedule.model');
const modelCtrl = require('../controllers/schedule.controller');


const router = express.Router();

router.post('/', (req, res) => {
  console.log('hello friend')
  // const schedule = new scheduleModel({
  //   day: req.body.day
  // });
  // console.log(schedule, 'this');

  // res.send(schedule);
});

module.exports = router;
