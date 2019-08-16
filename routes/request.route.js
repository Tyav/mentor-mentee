const express = require('express');
const { celebrate: validate, errors } = require('celebrate');
const decode = require('../middlewares/decode')
const requestValidate = require('../validations/request.validation');
const requestCtrl = require('../controllers/request.controller');
const authCtrl = require('../controllers/auth.controller');
const router = express.Router(); // eslint-disable-line new-cap

router.param('id', requestCtrl.load);

router.use(decode)


router
  .route('/')
  /** Create  */
  .post(validate(requestValidate.create, { abortEarly: false }), requestCtrl.create)
  /** Get all */
  //.get(requestCtrl.getUserRequests)
   

router.route('/:userId').get(requestCtrl.getUserRequests)


module.exports = router;
