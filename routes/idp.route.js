const express = require('express');
const { celebrate: validate, errors } = require('celebrate')

const idpController = require('../controllers/idp.controller')
const decode = require('../middlewares/decode');
const paramValidation = require('../validations/idp.validation');
const router = express.Router();

router.use(decode)
router.param('id', idpController.load)
router.route('/')
  .post(validate(paramValidation.createIdp, {abortEarly: false}),idpController.create)
  .get(idpController.get);

router.route('/:id')
  .put(validate(paramValidation.updateIdp, {abortEarly: false}), idpController.update)
  .delete(validate(paramValidation.deleteIdp, { abortEarly: false}), idpController.delete)

module.exports = router