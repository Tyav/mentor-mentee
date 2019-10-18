const Idp = require('../models/idp.model');
const httpStatus = require('http-status');
const sendResponse = require('../helpers/response');
const APIError = require('../helpers/APIError')


exports.create = async (req, res) => {
  if (req.user.isMentor) {
    return res.json(sendResponse(httpStatus.UNAUTHORIZED, "Only a mentee can create IDP"))
  }
  const idp = new Idp({
    ...req.body, mentee: req.sub
  });
  await idp.save();
  res.json(sendResponse(httpStatus.CREATED, "Created", idp,))    
}