const httpStatus = require('http-status');
const User = require('../models/user.model');
const sendResponse = require('../helpers/response');
const { createUser } = require('../validations/user.validation');
const gravatar = require('gravatar');
const { Joi } = require('celebrate');
const pick = require('ramda/src/pick');

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

exports.signup = async (req, res) => {
  const { error } = Joi.validate(req.body, createUser.body);
  if (error)
    return res.json(
      sendResponse(
        httpStatus.BAD_REQUEST,
        'Bad Request',
        null,
        error.details[0].message
      )
    );

  try {
    const { name, email, password, isMentor, isAdmin } = req.body;

    //check if user exists
    let user = await User.getByEmail(email);
    if (user) {
      return res.json(
        sendResponse(httpStatus.BAD_REQUEST, 'Bad Request', null, {
          msg: 'Email already in use!'
        })
      );
    }

    //get user avatar
    const avatar = gravatar.url(email, {
      s: '200',
      r: 'pg',
      d: 'mm'
    });

    //create User instance
    user = new User({
      name,
      email,
      password,
      avatar,
      isMentor,
      isAdmin
    });

    await user.save();
    const fields = ['id', 'email', 'isAdmin', 'isMentor'];
    const payload =  pick(fields, user);
    const token = await user.generateToken(payload);


    res.json(sendResponse(httpStatus.OK, 'Signup successful', token, null));
  } catch (error) {
    console.error('Error: ', error.message);
    res
      .status(500)
      .json(
        sendResponse(
          httpStatus.INTERNAL_SERVER_ERROR,
          'Server Error',
          null,
          error
        )
      );
  }
};
