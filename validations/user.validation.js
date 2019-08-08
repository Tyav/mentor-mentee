const { Joi } = require('celebrate');

module.exports = {
  // POST /api/v1/users
  createUser: {
    body: {
      name: Joi.string().required().min(1).max(120),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(20).required(),
      isMentor:Joi.boolean()
    }
  },
  // PUT /api/users/:userId
  updateUser: {
    body: {
      name: Joi.string().required(),
      email: Joi.string()
        .email()
        .required(),
      phone: Joi.string(),
      connection: Joi.object().required(),
      bio: Joi.string()
        .max(250)
        .required(),
      location: Joi.string().required(),
      skills: Joi.array().items(Joi.string())
    },
    params: {
      userId: Joi.string()
        .hex()
        .required()
    }
  },
  //added login validation
  login: {
    body: {
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string().required()
    }
  }
};
