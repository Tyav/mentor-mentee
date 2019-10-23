const { Joi } = require('celebrate');

module.exports = {
  createReport: {
    body: {
      mentor: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required(),
      goal: Joi.string().max(500),
      takeaway: Joi.string().max(500),
      comment: Joi.string().max(500),
    },
  },
  updateReport: {
    body: {
      goal: Joi.string().max(500),
      takeaway: Joi.string().max(500),
      comment: Joi.string().max(500),
    },
    params: {
      id: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required(),
    },
  },
  deleteReport: {
    params: {
      id: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required(),
    },
  },
};
