const express = require('express');
const { celebrate: validate, errors } = require('celebrate');
const authValidation = require('../validations/auth.validation');
const userCtrl = require('../controllers/user.controller');
const adminCtrl = require('../controllers/admin.controller')
const authCtrl = require('../controllers/auth.controller');
const decode = require('../middlewares/decode');
const router = express.Router(); // eslint-disable-line new-cap

/** GET /api/v1/auth/login - get all users */
router.post(
  '/login',
  validate(authValidation.login, { abortEarly: false }),
  userCtrl.login
);

/** Admin Login /api/v1/login */
router.post(
  '/admin-login',
  validate(authValidation.login, { abortEarly: false }),
  adminCtrl.login
);
//auth/admin-login

router
  .route('/forgot-password')
  .post(
    validate(authValidation.forgotPassword, { abortEarly: false }),
    authCtrl.forgotPassword
  );

router.post(
  '/verify-link',
  validate(authValidation.verficationLink, { abortEarly: false }),
  authCtrl.validationLink
);
//'i need to pus something in here...that comes from the auth ctrl'
router.use(decode);
router.route('/verify').put(authCtrl.verify);
router
  .route('/reset-password')
  .post(
    validate(authValidation.resetPassword, { abortEarly: false }),
    authCtrl.resetPassword
  );
router
  .route('/change-password')
  .put(
    validate(authValidation.changePassword, { abortEarly: false }),
    authCtrl.changePassword
  );

module.exports = router;
