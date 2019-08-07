const { Joi } = require('celebrate');

module.exports = {
  // POST /api/v1/schedules
  createSchedule: {
    body: {
      day: Joi.string().required(),
      time: Joi.string().required(),
      slot: Joi.number().required(),
      isClosed:Joi.boolean().required(),
      mentorId: Joi.string().required(),
      mentees: Joi.array().items(Joi.string())
    }
  }
};
