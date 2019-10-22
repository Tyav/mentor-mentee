const { Joi } = require('celebrate');

module.exports = {
  createIdp: {
    body: {
      mentor: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required(),
      title: Joi.string().required(),
      goal: Joi.string().max(500),
      plan: Joi.string().max(500),
      outcome: Joi.string().max(500),
      result: Joi.string().max(500),
      comment: Joi.string().max(500),
    },
  },
  updateIdp: {
    body: {
      title: Joi.string().max(50),
      goal: Joi.string().max(500),
      plan: Joi.string().max(500),
      outcome: Joi.string().max(500),
      result: Joi.string().max(500),
      comment: Joi.string().max(500),
    },
    params: {
      id: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required(),
    },
  },
  deleteIdp: {
    params: {
      id: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required(),
    },
  },
};
