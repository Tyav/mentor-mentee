const express = require('express');
const { celebrate: validate, errors } = require('celebrate');
const scheduleCtrl = require('../controllers/schedule.controller');
const requestCtrl = require('../controllers/request.controller');
const paramValidation = require('../validations/schedule.validation');
const decode = require('../middlewares/decode');

const router = express.Router();

router.use(decode);

router.param('scheduleId', scheduleCtrl.load);

router
  .route('/')
  // route for mentor to create schedule
  .post(validate(paramValidation.create, { abortEarly: false }), scheduleCtrl.createSchedule)
  /** GET api/v1/schedules  get all schedule */
  // route for mentor to get user schedule
  .get(scheduleCtrl.getUserSchedules);
  
// route for mentor to get all requests for his schedules
router.route('/requests').get(scheduleCtrl.getAllSchedulesRequests);

// route for mentor to modify an individual schedule
router
  .route('/:scheduleId')
  /** PUT api/v1/schedule/id edit schedule */
  .put(scheduleCtrl.update);

// route for mentor to get all request for a single schedule
router
  .route('/:scheduleId/requests')
  /** GET api/v1/schedule/id/requests get all requests for a schedule */
  .get(requestCtrl.getScheduleResquests);

module.exports = router;
