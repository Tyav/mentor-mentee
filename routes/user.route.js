const express = require('express');
const { celebrate: validate, errors } = require('celebrate');
const paramValidation = require('../validations/user.validation');
const userCtrl = require('../controllers/user.controller');
const { profileImage } = require('../helpers/upload');
const User = require('../models/user.model');
const router = express.Router(); // eslint-disable-line new-cap

/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load);

router
  .route('/')
  /** GET /api/v1/users - get all users */
  .get(userCtrl.getUsers);

router.post('/:id/images', userCtrl.updateAvatar);

router.put('/:id', userCtrl.updateProfile)
  .get(userCtrl.getUsers)
  // @route   POST api/v1/users
  // @desc    Add experience to profile
  // @access  Private
  .post(userCtrl.signup)

router.route('/schedule').post(userCtrl.createScheduleMock);

router.route('/request/:scheduleID').post(userCtrl.bookSlot);

module.exports = router;
