const express = require('express');
const { celebrate: validate, errors } = require('celebrate');
const userValidate = require('../validations/user.validation');
const userCtrl = require('../controllers/user.controller');
const authCtrl = require('../controllers/auth.controller');
const router = express.Router(); // eslint-disable-line new-cap

/** GET /api/v1/auth/login - get all users */
router.post('/login', validate(userValidate.login, { abortEarly: false }), userCtrl.login);

router.route('/forgot-password').post(authCtrl.forgotPassword);

router.route('/reset-password').post(authCtrl.resetPassword);
//'i need to pus something in here...that comes from the auth ctrl'
router.route('/verify').put(authCtrl.verify)

module.exports = router;
