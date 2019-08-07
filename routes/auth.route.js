const express = require('express');
const { login } = require('../controllers/user.controller');
const authCtrl = require('../controllers/auth.controller');
const router = express.Router(); // eslint-disable-line new-cap

router.route('/');
/** GET /api/v1/users - get all users */

router.post('/login', login);

const router = express.Router(); // eslint-disable-line new-cap

router.route('/forgot').post(authCtrl.forgotPassword);

router.route('/reset').get(authCtrl.reset);

router.route('/reset/:token').post(authCtrl.resetPassword);

module.exports = router;
