const express = require('express');
const userCtrl = require('../controllers/user.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/forgot').post(userCtrl.forgotPassword);

router.route('/reset/:token').post(userCtrl.resetPassword);

module.exports = router;
