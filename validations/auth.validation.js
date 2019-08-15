const { Joi } = require('celebrate');

module.exports = {
  // POST /api/v1/schedules
  verficationLink: {
    body: {
      email: Joi.string()
        .email()
        .required(),
    },
  },
  resetPassword: {
    body: {
      password: Joi.string()
        .min(6)
        .max(20)
        .required(),
    },
  },
  forgotPassword: {
    body: {
      email: Joi.string()
        .email()
        .required(),
    },
  },
  login: {
    body: {
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .min(6)
        .max(20)
        .required(),
    },
  },
};
