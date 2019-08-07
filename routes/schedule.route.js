const express = require('express');
const modelCtrl = require('../controllers/schedule.controller');

const router = express.Router();

router.post('/', modelCtrl.createSchedule);

module.exports = router;
