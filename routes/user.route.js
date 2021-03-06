const express = require('express');
const { celebrate: validate, errors } = require('celebrate');
const paramValidation = require('../validations/user.validation');
const userCtrl = require('../controllers/user.controller');
const scheduleCtrl = require('../controllers/schedule.controller');
const upload = require('../helpers/file-upload');
const decode = require('../middlewares/decode');
//const { profileImage } = require('../helpers/upload');
const router = express.Router(); // eslint-disable-line new-cap

/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load);

router
  .route('/')

  /** GET /api/v1/users - get all users */
  .get(userCtrl.getUsers)
  /** POST /api/v1/user - creae a user */
  .post(
    validate(paramValidation.createUser, { abortEarly: false }),
    userCtrl.signup,
  );

/**GET api.v1/users/mentors - get all mentors */
router.route('/mentors').get(userCtrl.getMentors);

router.use(decode);
router
  .route('/signupUpdate')
  /** PUT /api/v1/user/signupUpdate update only a user type (isMentor: true || false) and his skills */
  .put(
    validate(paramValidation.signupUpdate, { abortEarly: false }),
    userCtrl.signupUpdate,
  );
router
  .route('/me')
  .get(userCtrl.getCurrentUser)
  /** PUT /api/v1/user/userId update a user information */
  .put(
    validate(paramValidation.updateUser, { abortEarly: false }),
    userCtrl.updateProfile,
  );

//ROUTE for mentor to get his schedule....
router.get('/me/schedules', scheduleCtrl.getUserSchedules);

/** PUT /api/v1/users/:userId/avatar */
router.put(
  '/:userId/images',
  upload('avatar').single('avatar'),
  userCtrl.updateAvatar,
);

router
  .route('/:userId')
  /** GET /api/v1/user/userId gets a user by id */
  .get(userCtrl.getUser);

//Route for mentee to view schedules...
router.get('/:userId/schedules', scheduleCtrl.getAllSchedules);

router.route('/search').post(userCtrl.search);

//router.route('/request/:scheduleID').post(userCtrl.bookSlot);

module.exports = router;
