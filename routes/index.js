const express = require('express');
const httpStatus = require('http-status');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const sendResponse = require('../helpers/response');
const scheduleRoutes = require('./schedule.route');
const requestRoutes = require('./request.route');
const contactRoutes = require('./contact.route');
const adminRoutes = require('./admin.route');
const idpRoutes = require('./idp.route');
const reportRoutes = require('./report.route');

const router = express.Router(); // eslint-disable-line new-cap

// TODO: use glob to match *.route files

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => res.send('OK'));

// mount user routes at /users
router.use('/user', userRoutes);

//mount admin routes at /admin
router.use('/admin', adminRoutes)

// mount auth routes at /auth
router.use('/auth', authRoutes);

//mount schedule route
router.use('/schedule', scheduleRoutes);

//mount request route
router.use('/request', requestRoutes);

//mount contact route
router.use('/contact', contactRoutes);

//mount idp route
router.use('/idp', idpRoutes);

//mount report route
router.use('/report', reportRoutes);

module.exports = router;
