const Idp = require('../models/idp.model');
const httpStatus = require('http-status');
const sendResponse = require('../helpers/response');
const APIError = require('../helpers/APIError')

// load idp from idp id
exports.load = async (req, res, next, id) => {
  try {
    let idp = await Idp.get(id);
    if (idp) {
      req.idp = idp;
      return next();
    }
    return res.json(sendResponse(httpStatus.NOT_FOUND, 'No such idp exists!', null, null));
  } catch (error) {
    next(error);
  }
}

// create an IDP for a mentee
exports.create = async (req, res) => {
  if (req.user.isMentor) {
    return res.json(sendResponse(httpStatus.UNAUTHORIZED, "Only a mentee can create IDP"))
  }
  let menteeIdp = {
    ...req.body, mentee: req.sub
  }
  delete menteeIdp.comment
  const idp = new Idp(menteeIdp);
  await idp.save();
  res.json(sendResponse(httpStatus.CREATED, "Created", idp,))    
}

// gets all IDPs related to a user
exports.get = async (req, res) => {
  // create base query
  const query = {deleted: false}
  // set query based on user type
  req.user.isMentor ? query.mentor = req.sub : query.mentee = req.sub;
  // get all users idp
  const idps = await Idp.getMany(query);
  res.json(sendResponse(httpStatus.OK, "Success", idps))
}

// update an IDP.
exports.update = async (req, res) => {
  // idp instance is available on req.idp by router.params
  const idp = req.idp;
  const user = req.user;

  const { comment, goal, deadline, outcome } = req.body
  // update fields conditionally to avoid a user type updating the wrong field
  // set fields according to user type
  if (user.isMentor && idp.mentor.toHexString() === user._id.toHexString()) { 
    // set for mentor as mentor can only comment on IDP
    idp.comment = comment;
  }
  if (!user.isMentor && idp.mentee.toHexString() === user._id.toHexString()) { 
    // set for mentee
    idp.goal = goal
    idp.outcome = outcome
    idp.deadline = deadline
  }
  await idp.save()
  res.json(sendResponse(httpStatus.OK, "Update successful", idp))
}

//delete idp by mentee

exports.delete = async (req, res) => {
  const idp = req.idp; // get idp instance from response object
  const userId = req.sub; // get user
  if (idp.mentee.toHexString() === userId){
    idp.deleted = true;
    await idp.save();
    return res.json(sendResponse(httpStatus.OK, "IDP deleted successfully", idp));
  }
  res.json(sendResponse(httpStatus.UNAUTHORIZED, 'Unauthorized', null));
}
