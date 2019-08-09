const express = require('express');
const { celebrate: validate, errors } = require('celebrate');
const scheduleCtrl = require('../controllers/schedule.controller');
const paramValidation = require('../validations/schedule.validation');
const decode = require('../middlewares/decode')

const router = express.Router();

router.use(decode)

router.route('/')
  .post(validate(paramValidation.create,{ abortEarly: false }), scheduleCtrl.createSchedule)
/** GET api/v1/schedules  get all schedule */
  .get(scheduleCtrl.getAllSchedules)

module.exports = router;
