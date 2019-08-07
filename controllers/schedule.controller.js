const httpStatus = require('http-status');
const sendResponse = require('../helpers/response');
const ScheduleModel = require('../models/schedule.model');
const { createSchedule } = require('../validations/schedule.validation');
const { Joi } = require('celebrate');



exports.createSchedule = async (req, res) => {
  try {
    const {error} = Joi.validate(req.body, createSchedule.body);

    const { day, time, slot, isClosed, mentorId, mentees } = req.body;

    const schedule = new ScheduleModel({
      day: day,
      time: {
        from: Date(time.from),
        to: Date(time.to)
      },
      slot: slot,
      isClosed: isClosed,
      mentorId: mentorId,
      mentees: mentees
    });

    schedule.save();
    return res.json(sendResponse(200, 'Schedule Created', schedule, null));
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};


exports.getAllSchedules = async(req,res) =>{
  try {
    
  } catch (error) {
    
  }
}