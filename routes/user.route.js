const express = require('express');
const { celebrate: validate, errors } = require('celebrate');
const paramValidation = require('../validations/user.validation');
const userCtrl = require('../controllers/user.controller');
const { profileImage } = require('../helpers/upload');

const router = express.Router(); // eslint-disable-line new-cap

/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load);

router
  .route('/')
  /** GET /api/v1/users - get all users */
  .get(userCtrl.getUsers);

router.post('/images', (req, res) => {
  req.userID = '123456789'; // To be swap for the real userID

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
        console.log('file', req.file); //save to profile DB now
        res.status(401).json({
          msg: 'File Uploaded!',
          file: `${req.file.location}`
        });
      }
    }
  });
});

module.exports = router;
