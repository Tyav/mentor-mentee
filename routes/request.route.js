const express = require('express');
const { celebrate: validate, errors } = require('celebrate');
const requestValidate = require('../validations/request.validation');
const requestCtrl = require('../controllers/request.controller');
const authCtrl = require('../controllers/auth.controller');
const router = express.Router(); // eslint-disable-line new-cap

router.param('id', requestCtrl.load);

router
  .route('/')
  /** Create  */
  .post(validate(requestValidate.create, { abortEarly: false }), requestCtrl.create)
  /** Get all */
  .get(requestCtrl.getAll)

module.exports = router;
