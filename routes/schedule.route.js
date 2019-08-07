const express = require('express');
// const httpStatus = require('http-status');
// const userRoutes = require('./user.route');
// const authRoutes = require('./auth.route');
// const sendResponse = require('../helpers/response');
// const scheduleModel = require('../models/schedule.model');
const modelCtrl = require('../controllers/schedule.controller');

const router = express.Router();

router.post('/', modelCtrl.createSchedule);

module.exports = router;
