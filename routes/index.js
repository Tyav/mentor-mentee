const express = require('express');
const httpStatus = require('http-status');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const sendResponse = require('../helpers/response');
const UserSchems = require('../models/user.model');

const router = express.Router(); // eslint-disable-line new-cap

// TODO: use glob to match *.route files

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => res.send('OK'));

router.get('/states', (req, res) =>
  res.json(sendResponse(httpStatus.OK, 'success', states, null))
);

// mount user routes at /users
router.use('/users', userRoutes);

// mount auth routes at /auth
router.use('/auth', authRoutes);

// router.use('/schedule', )

module.exports = router;
