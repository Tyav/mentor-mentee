const express = require('express');
const { celebrate: validate, errors } = require('celebrate');
const authValidation = require('../validations/auth.validation');
const userCtrl = require('../controllers/user.controller');
const authCtrl = require('../controllers/auth.controller');
const decode = require('../middlewares/decode')
const router = express.Router(); // eslint-disable-line new-cap


/** GET /api/v1/auth/login - get all users */
router.post('/login', validate(authValidation.login, { abortEarly: false }), userCtrl.login);

router.route('/forgot-password').post(validate(authValidation.forgotPassword, { abortEarly: false }), authCtrl.forgotPassword);

router.post('/verify-link', validate(authValidation.verficationLink, { abortEarly: false }), authCtrl.validationLink);

router.use(decode)
//'i need to pus something in here...that comes from the auth ctrl'
router.route('/verify').put(authCtrl.verify);

router.route('/reset-password').post(validate(authValidation.resetPassword, { abortEarly: false }), authCtrl.resetPassword);


module.exports = router;
