const express = require('express');
const { celebrate: validate, errors } = require('celebrate');
const paramValidation = require('../validations/user.validation');
const userCtrl = require('../controllers/user.controller');
const upload = require('../helpers/file-upload');
//const { profileImage } = require('../helpers/upload');
const router = express.Router(); // eslint-disable-line new-cap

/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load);

router
  .route('/')
  /** GET /api/v1/users - get all users */
  //.get(userCtrl.getUsers)
  /** POST /api/v1/users - creae a user */
  .post(validate(paramValidation.createUser, { abortEarly: false }), userCtrl.signup);

/** PUT /api/v1/users/:userId/avatar */
router.put('/:userId/images', upload('avatar').single('avatar'), userCtrl.updateAvatar);

router
  .route('/:userId')
  .get(userCtrl.getUser)
  .put(userCtrl.updateProfile);

//router.route('/request/:scheduleID').post(userCtrl.bookSlot);

module.exports = router;
