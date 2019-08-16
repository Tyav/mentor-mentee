const { Joi } = require('celebrate');

module.exports = {
  // POST /api/v1/schedules
  create: {
    body: {
      schedule: Joi.string()
        .hex()
        .required(),
      message: Joi.string()
    }
  },
  update: {
    body: {
      response: Joi.string().max(250)
    },
    params: {
      id: Joi.string().hex()
    }
  }
};
