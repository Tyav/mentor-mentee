const httpStatus = require('http-status');
const User = require('../models/user.model');
const sendResponse = require('../helpers/response');
const { profileImage } = require('../helpers/upload');
const { updateUser: updateUserValidation,createUser, login} = require('../validations/user.validation');
const AvatarSchema = require('../models/avatar.model');
const { customErrorMessage } = require('../helpers/joiCustomError');
const EncodeToken = require('../helpers/TokenEncoder');
const Schedule = require('../models/scheduleMock.model');
const Request = require('../models/request.model');
const { Joi } = require('celebrate');

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

exports.updateAvatar = async (req, res) => {
  const { id: userId } = req.params;

  const avatar = await AvatarSchema.getByUserId(userId);
  if (avatar) req.previousAvatar = avatar.key;

  profileImage(req, res, error => {
    if (error) {
      res.json(
        sendResponse(httpStatus.BAD_REQUEST, 'Bad Request', null, { message: error.message }, null)
      );
    } else {
      if (req.file == undefined) {
        res.json(
          sendResponse(
            httpStatus.BAD_REQUEST,
            'Error: No File Selected!',
            null,
            { message: 'Error: No File Selected!' },
            null
          )
        );
      } else {
        if (!avatar) {
          const { key, location } = req.file;
          const newAvatar = new AvatarSchema({ key, location, userId });
          newAvatar.save(error => {
            if (error) throw error;
            // console.log('Avatar saved successfully!');
          });
        }
        res.status(401).json({
          msg: 'File Uploaded!',
          file: `${req.file.location}`
        });
      }
    }
  });
};

exports.updateProfile = async (req, res) => {
  const { error, value } = Joi.validate(req.body, updateUserValidation);
  if (error) {

exports.createScheduleMock = async (req, res) => {
  try {
    const shcedule = new Schedule(req.body);
    const result = await shcedule.save();
    if (!result) {
      return res.json(
        sendResponse(
          httpStatus.INTERNAL_SERVER_ERROR,
          'An error occured submiting schedule'
        )
      );
    }
    return res.json(sendResponse(httpStatus.OK, 'Request submitted'));
  } catch {
    return res.json(sendResponse(httpStatus.NOT_FOUND, 'Something went wrong'));
  }
};

exports.bookSlot = async (req, res) => {
  try {
    const requestMade = await Request.findOne({
      scheduleId: req.params.scheduleID,
      menteeId: req.body.menteeId
    });
    if (requestMade) {
      return res.json(
        sendResponse(httpStatus.NOT_FOUND, 'request already made')
      );
    }
    const schedule = await Schedule.findOne({
      _id: req.params.scheduleID
    });
    if (!schedule) {
      return res.json(sendResponse(httpStatus.NOT_FOUND, 'Schedule not found'));
    }

    const request = new Request({
      scheduleId: req.params.scheduleID,
      menteeId: req.body.menteeId
    });
    const requestResult = await request.save();
    if (!requestResult) {
      return res.json(
        sendResponse(httpStatus.NOT_FOUND, 'the request was not submitted')
      );
    }
    return res.json(sendResponse(httpStatus.OK, 'Request submitted'));
  } catch {
    return res.json(
      sendResponse(
        httpStatus.INTERNAL_SERVER_ERROR,
        'something went wrong while submitting request'
      )
    );
  }
};
exports.signup = async (req, res) => {
  const { error } = Joi.validate(req.body, createUser.body);
  if (error)
    return res.json(
      sendResponse(
        httpStatus.BAD_REQUEST,
        'Bad Request',
        null,
        { error: customErrorMessage(error.details) },
        null
      )
    );
  }

  let user = await User.findByIdAndUpdate(req.params.id, { $set: value }, { new: true });
  if (!user) {
    return res.json(
      sendResponse(httpStatus.BAD_REQUEST, 'Error Occur', null, { error: error.message }, null)
    );
  }

  user.transform().then(data => {
    return res.json(sendResponse(httpStatus.OK, 'User Updated', data, null, null));
  });
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

    //create User instance
    user = new User({
      name,
      email,
      password,
      isMentor,
      isAdmin
    });

    await user.save();
    const payload = user.transform();
    const token = await user.generateToken();

    res.json(
      sendResponse(httpStatus.OK, 'Signup successful', payload, null, token)
    );
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
  const token = EncodeToken(user.id, user.email, user.isAdmin);

  res.header('auth-token', token).send(token);
};
