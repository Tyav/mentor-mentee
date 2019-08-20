const express = require('express');
const { celebrate: validate, errors } = require('celebrate');
const decode = require('../middlewares/decode');
const requestValidate = require('../validations/request.validation');
const requestCtrl = require('../controllers/request.controller');
const authCtrl = require('../controllers/auth.controller');
const router = express.Router(); // eslint-disable-line new-cap

router.param('id', requestCtrl.load);

router.use(decode);


router
  .route('/')
  /** Create  request*/

  .post(
    validate(requestValidate.create, { abortEarly: false }),
    requestCtrl.create
  )
  /** Approve mentees request */
  // .put(validate(requestValidate.update,{abortEarly: false}),requestCtrl.approveRequests)

  /** route for mentee to get all request made*/
  .get(requestCtrl.getUserRequests);

  // route to approve, decline and cancel request
router.route('/:id').put(validate(requestValidate.update,{abortEarly:false}),requestCtrl.approveRequests);
  //.get(requestCtrl.getUserRequests)
   
    // route for mentee to get requests
router.route('/:userId').get(requestCtrl.getUserRequests)
  

module.exports = router;
