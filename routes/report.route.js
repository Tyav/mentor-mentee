const express = require('express');
const { celebrate: validate, errors } = require('celebrate')

const reportController = require('../controllers/report.controller')
const decode = require('../middlewares/decode');
const paramValidation = require('../validations/report.validation');
const router = express.Router();

router.use(decode)
router.param('id', reportController.load)
router.route('/')
  .post(validate(paramValidation.createReport, {abortEarly: false}),reportController.create)
  .get(reportController.get);

router.route('/:id')
  .put(validate(paramValidation.updateReport, {abortEarly: false}), reportController.update)
  .delete(validate(paramValidation.deleteReport, { abortEarly: false}), reportController.delete)

module.exports = router