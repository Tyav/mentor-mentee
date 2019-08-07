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
  req.userID = '123456789'; // To be swap for the real userID
  const avatar = await AvatarSchema.getByUserId(req.userID);
  if (avatar) req.previousAvatar = avatar.key;

  profileImage(req, res, error => {
    if (error) {
      res.status(401).json({
        message: error.message,
        file: false
      });
    } else {
      if (req.file == undefined) {
        res.status(401).json({
          message: 'Error: No File Selected!',
          file: false
        });
      } else {
        if (!avatar) {
          const { key, location } = req.file;
          const newAvatar = new AvatarSchema({ key, location, userId: req.userID });
          newAvatar.save(error => {
            if (error) throw error;
            console.log('Avatar saved successfully!');
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
  const { error, values } = Joi.validate(req.body, updateUserValidation);

  if (error) {
    res.status(401).json({ message: customErrorMessage(error) });
  }

  User.findByIdAndUpdate(req.params.userId, { $set: values }, { new: true }, (error, user) => {
    if (!error) {
      res.status(201).json({
        data: user.transform().then(data => data)
      });
    } else {
      res.status(500).json({
        message: error.message
      });
    }
  });
};
