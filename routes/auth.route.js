const express = require('express');
const { login } = require('../controllers/user.controller');
const router = express.Router(); // eslint-disable-line new-cap

router.route('/');
/** GET /api/v1/users - get all users */

router.post('/login', (req, res) => {
  return login(req, res);
});

module.exports = router;
