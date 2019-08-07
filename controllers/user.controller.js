const httpStatus = require('http-status');
const User = require('../models/user.model');
const sendResponse = require('../helpers/response');
const { profileImage } = require('../helpers/upload');
const { updateUser: updateUserValidation } = require('../validations/user.validation');
const AvatarSchema = require('../models/avatar.model');
const { customErrorMessage } = require('../helpers/joiCustomError');

/**
 * Load user and append to req.
 */
exports.load = async (req, res, next, id) => {
  try {
    // Load user object from quarystring Id
    return res.json(sendResponse(httpStatus.NOT_FOUND, 'No such user exists!', null, null));
  } catch (error) {
    next(error);
  }
};

exports.getUsers = (req, res) => {
  return res.json(sendResponse(200, 'testing', null, null));
};

exports.updateAvatar = async (req, res) => {
  const userId = req.params.userId;

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

exports.updateProfile = (req, res) => {
  const { error, values } = Joi.validate(req.body, updateUserValidation);

  if (error) {
    res.json(
      sendResponse(
        httpStatus.BAD_REQUEST,
        'Bad Request',
        null,
        { message: customErrorMessage(error) },
        null
      )
    );
  }

  User.findByIdAndUpdate(req.params.userId, { $set: values }, { new: true }, (error, user) => {
    if (error) {
      res.json(
        sendResponse(httpStatus[500], 'Error Occur', null, { message: error.message }, null)
      );
    }

    const data = user.transform().then(data => data);
    res.json(sendResponse(httpStatus.OK, 'User Updated', data, null, null));
  });
};
