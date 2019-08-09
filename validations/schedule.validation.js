const { Joi } = require('celebrate');

module.exports = {
  // POST /api/v1/schedules
  create: {
    body: {
      day: Joi.string().required(),
      time: Joi.object().keys({
        from: Joi.date().required(),
        to:Joi.date().required()
      }),
      slots: Joi.number().required(),
      isClosed:Joi.boolean(),
    }
  },
  update: {
    body: {
      day: Joi.string(),
      time: Joi.object().keys({
        from: Joi.date(),
        to:Joi.date()
      }),
      slots: Joi.number(),
      isClosed:Joi.boolean(),
    }
  }
};
