const express = require('express');
const authCtrl = require('../controllers/auth.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/forgot').post(authCtrl.forgotPassword);

router.route('/reset').get(authCtrl.reset);

router.route('/reset').post(authCtrl.reset);

router.route('/reset/:token').post(authCtrl.resetPassword);

module.exports = router;
