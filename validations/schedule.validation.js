const { Joi } = require('celebrate');

module.exports = {
  // POST /api/v1/schedules
  createSchedule: {
    body: {
      day: Joi.string().required(),
      time: Joi.object().keys({
        from: Joi.date().required(),
        to:Joi.date().required()
      }),
      slots: Joi.number().required(),
      isClosed:Joi.boolean().required(),
      mentorId: Joi.string().required(),
      mentees: Joi.array().items(Joi.string())
    }
  }
};
