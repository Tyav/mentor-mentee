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
  .post(validate(paramValidation.create, { abortEarly: false }), scheduleCtrl.createSchedule)
  /** GET api/v1/schedules  get all schedule */
  // .get(scheduleCtrl.getAllSchedules);
  .get(scheduleCtrl.getUserSchedules);
  

router.route('/requests').get(scheduleCtrl.getAllSchedulesRequests);
router
  .route('/:scheduleId')
  /** PUT api/v1/schedule/id edit schedule */
  .put(scheduleCtrl.update);

router
  .route('/:scheduleId/requests')
  /** GET api/v1/schedule/id/requests get all requests for a schedule */
  .get(requestCtrl.getScheduleResquests);

module.exports = router;
