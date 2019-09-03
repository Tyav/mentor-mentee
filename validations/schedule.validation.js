const { Joi } = require('celebrate');

module.exports = {
  // POST /api/v1/schedules
  create: {
    body: {
      day: Joi.string().required(),
      time: Joi.object().keys({
        from: Joi.string().required(),
        to: Joi.string().required()
      }),
      slots: Joi.number().required(),
      isClosed: Joi.boolean(),
      poolSize: Joi.number()
    }
  },
  update: {
    body: {
      day: Joi.string(),
      time: Joi.object().keys({
        from: Joi.string().required(),
        to: Joi.string().required()
      }),
      slots: Joi.number(),
      isClosed: Joi.boolean(),
      poolSize: Joi.number()
    }
  }
};
