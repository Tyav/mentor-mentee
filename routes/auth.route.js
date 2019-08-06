const express = require('express');
const { celebrate: validate, errors } = require('celebrate');
const User = require('../models/user.model');
const userCtrl = require('../controllers/user.controller');
const paramValidation = require('../validations/user.validation');

const router = express.Router(); // eslint-disable-line new-cap

router.post('/login', async (req, res) => {
  const user = User.findOne({ email: req.body.email });
  

  // const user = await
});

module.exports = router;
