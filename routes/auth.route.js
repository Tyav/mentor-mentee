const express = require('express');
const { celebrate: validate, errors } = require('celebrate');
const User = require('../models/user.model');
const userCtrl = require('../controllers/user.controller');
const paramValidation = require('../validations/user.validation');

const router = express.Router(); // eslint-disable-line new-cap

router.post('/login', async (req, res, next) => {
  try {
    let { email, password } = req.body;

    let user = await User.login(email, password);
    

    res.send(user);
  } catch (error) {
    res.json({ message: 'Incorrect Username or password' });
  }
});

module.exports = router;
