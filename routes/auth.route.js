const express = require('express');
const User = require('../models/user.model');
const userCtrl = require('../controllers/user.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/forgot').post(userCtrl.forgotPassword);

router.post('/reset/:token', (req, res) => {
  const token = req.params.token;
});

module.exports = router;
