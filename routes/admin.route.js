const express = require('express');
const { celebrate: validate, errors } = require('celebrate');
const paramValidation = require('../validations/user.validation');
const decode = require('../middlewares/decode');
const adminAuth = require('../middlewares/adminAuth.middleware');
const userCtrl = require('../controllers/user.controller');
const router = express.Router(); // eslint-disable-line new-cap
router.use(decode);
/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load);

router.use(adminAuth);

router
  .route('/')

  /** GET /api/v1/users - get all users */
  .get(userCtrl.getUsers)
  /** POST /api/v1/user - creae a user */
  .post(
    validate(paramValidation.createUser, { abortEarly: false }),
    userCtrl.signup
  );

module.exports = router;

// body = {
//     name: 'new Admin',
//     isSuper: true
// }

// isSuper = user.isSuper ? isSuper : false
