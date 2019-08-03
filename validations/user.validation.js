const { Joi } = require('celebrate');

module.exports = {
  // POST /api/v1/users
  createUser: {
    body: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    }
  },
  // PUT /api/users/:userId
  updateUser: {
    body: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string(),
      connection: Joi.object().required(),
      bio: Joi.string().max(250).required(),
      location: Joi.string().required(),
      skills: Joi.array().items(Joi.string())
    },
    params: {
      userId: Joi.string().hex().required(),
    }
  }
};
