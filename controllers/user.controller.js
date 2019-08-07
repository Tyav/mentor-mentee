const httpStatus = require('http-status');
const User = require('../models/user.model');
const sendResponse = require('../helpers/response');
const { Joi } = require('celebrate');
const { login } = require('../validations/user.validation');
const EncodeToken = require('../helpers/TokenEncoder');

/**
 * Load user and append to req.
 */
exports.load = async (req, res, next, id) => {
  try {
    // Load user object from quarystring Id
    return res.json(
      sendResponse(httpStatus.NOT_FOUND, 'No such user exists!', null, null)
    );
  } catch (error) {
    next(error);
  }
};

exports.getUsers = (req, res) => {
  return res.json(sendResponse(200, 'testing', null, null));
};

exports.login = async (req, res) => {
  const { error } = Joi.validate(req.body, login.body);

  if (error)
    return res.json(
      sendResponse(
        httpStatus.BAD_REQUEST,
        'Incorrect email or password',
        null,
        null
      )
    );

  const { email, password } = req.body;

  const user = await User.getByEmail(email);

  if (!user)
    return res.json(
      sendResponse(
        httpStatus.BAD_REQUEST,
        'Incorrect email or password',
        null,
        null
      )
    );

  const validPassword = user.passwordMatches(password);

  if (!validPassword)
    return res.json(
      sendResponse(
        httpStatus.BAD_REQUEST,
        'Incorrect email or password',
        null,
        null
      )
    );

  //const payload = await user.transform();

  const token = EncodeToken(user.id, user.email, user.isAdmin);

  res.header('auth-token', token).send(token);
};
