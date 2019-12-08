const { Joi } = require('celebrate');

module.exports = {
  // POST /api/v1/users
  createUser: {
    body: {
      name: Joi.string()
        .min(1)
        .max(120)
        .required(),
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .min(6)
        .max(20)
        .required(),
      skills: Joi.array().items(Joi.string()),
      connection: Joi.object(),
      isAdmin: Joi.boolean(),
      isSuper: Joi.boolean(),
      isMentor: Joi.boolean(),
    },
  },
  createAdmin: {
    body: {
      name: Joi.string()
        .min(1)
        .max(120)
        .required(),
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .min(6)
        .max(20)
        .required(),
      isSuper: Joi.boolean(),
      isMentor: Joi.boolean(),
    },
  },
  // PUT /api/users/:userId
  updateUser: {
    body: {
      name: Joi.string()
        .min(1)
        .max(120)
        .required(),
      email: Joi.string()
        .email()
        .required(),
      phone: Joi.string(),
      connection: Joi.object(),
      bio: Joi.string().max(5000),
      location: Joi.string(),
      skills: Joi.array().items(Joi.string()),
    },
  },
  signupUpdate: {
    body: {
      isMentor: Joi.boolean().required(),
      skills: Joi.array()
        .items(Joi.string())
        .required(),
    },
  },
  //added login validation
};
