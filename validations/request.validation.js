const { Joi } = require('celebrate');

module.exports = {
  // POST /api/v1/schedules
  create: {
    body: {
      scheduleId: Joi.string().hex().required(),
      message: Joi.string(),
    }
  },
  update: {
    body: {
      response: Joi.string().max(250)
    },
    params: {
      userId: Joi.string()
        .hex()
        .required()
    }
  }
};
