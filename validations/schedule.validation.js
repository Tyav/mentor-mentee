const { Joi } = require('celebrate');

module.exports = {
  // POST /api/v1/users
  createSchedule: {
    body: {
      day: Joi.string().required(),
      email: Joi.string()
        .email()
        .required(),
      slot: Joi.number().required(),
      mentorId:Joi.string().required()
    }
  }

};
