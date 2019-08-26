const express = require('express');
const { celebrate: validate, errors } = require('celebrate');
const paramValidation = require('../validations/user.validation');
const authValidation = require('../validations/auth.validation');
const decode = require('../middlewares/decode');
const adminAuth = require('../middlewares/adminAuth.middleware');
const adminCtrl = require('../controllers/admin.controller');
const userCtrl = require('../controllers/user.controller');
const router = express.Router(); // eslint-disable-line new-cap

/** Admin Login /api/v1/login */
router.post(
  '/login',
  validate(authValidation.login, { abortEarly: false }),
  adminCtrl.login
);

router.use(decode);

/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load);

/** Ensures the user is an admin */
router.use(adminAuth);

router
  .route('/')
  /** GET /api/v1/users - get all users */
  .get(userCtrl.getUsers)
  /** POST /api/v1/admin - creae a user */
  .post(
    validate(paramValidation.createUser, { abortEarly: false }),
    adminCtrl.signup
  );

module.exports = router;

// body = {
//     name: 'new Admin',
//     isSuper: true
// }

// isSuper = user.isSuper ? isSuper : false
