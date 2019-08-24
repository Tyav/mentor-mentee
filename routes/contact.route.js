const express = require('express');
const { celebrate: validate, errors } = require('celebrate');
const authValidation = require('../validations/auth.validation');
const contactCtrl = require('../controllers/contact.controller');
const decode = require('../middlewares/decode');
const router = express.Router(); // eslint-disable-line new-cap


router.param('id', contactCtrl.load);

router.use(decode);


router.route('/')
  // route to get contact for users
  .get(contactCtrl.getUserContacts);

router.route('/:id')
  // route to delete contact
  .delete(contactCtrl.deleteContact);

module.exports = router;

