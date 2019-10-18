const express = require('express');
const { celebrate: validate, errors } = require('celebrate')

const idpController = require('../controllers/idp.controller')
const decode = require('../middlewares/decode');
const paramValidation = require('../validations/idp.validation');
const router = express.Router();

router.use(decode)

router.route('/')
  .post(validate(paramValidation.createIdp, {abortEarly: false}),idpController.create);

module.exports = router