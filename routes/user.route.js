const express = require('express');
const { celebrate: validate, errors } = require('celebrate');
const paramValidation = require('../validations/user.validation');
const userCtrl = require('../controllers/user.controller');

const router = express.Router(); // eslint-disable-line new-cap 

/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load);


router
  .route('/')
  /** GET /api/v1/users - get all users */
  .get(userCtrl.getUsers) 


  module.exports = router; 