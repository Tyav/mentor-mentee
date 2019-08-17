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
      isMentor: Joi.boolean()
    }
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
      bio: Joi.string().max(250),
      location: Joi.string(),
      skills: Joi.array().items(Joi.string())
    }
  }
  //added login validation
};
