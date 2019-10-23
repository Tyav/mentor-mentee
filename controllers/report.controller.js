const Report = require('../models/report.model');
const httpStatus = require('http-status');
const sendResponse = require('../helpers/response');
const APIError = require('../helpers/APIError')

// load report from report id
exports.load = async (req, res, next, id) => {
  try {
    let report = await Report.get(id);
    if (report) {
      req.report = report;
      return next();
    }
    return res.json(sendResponse(httpStatus.NOT_FOUND, 'No such report exists!', null, null));
  } catch (error) {
    next(error);
  }
}

// create an Report for a mentee
exports.create = async (req, res) => {
  if (req.user.isMentor) {
    return res.json(sendResponse(httpStatus.UNAUTHORIZED, "Only a mentee can create Report"))
  }
  let menteeReport = {
    ...req.body, mentee: req.sub
  }
  delete menteeReport.comment
  const report = new Report(menteeReport);
  await report.save();
  res.json(sendResponse(httpStatus.CREATED, "Created", report,))    
}

// gets all Reports related to a user
exports.get = async (req, res) => {
  // create base query
  const query = {deleted: false}
  // set query based on user type
  req.user.isMentor ? query.mentor = req.sub : query.mentee = req.sub;
  // get all users idp
  const reports = await Report.getMany(query);
  res.json(sendResponse(httpStatus.OK, "Success", reports))
}

// update an Report.
exports.update = async (req, res) => {
  // report instance is available on req.report by router.params
  const report = req.report;
  const user = req.user;

  const { comment, goal, takeaway } = req.body
  // update fields conditionally to avoid a user type updating the wrong field
  // set fields according to user type
  if (user.isMentor && report.mentor.toHexString() === user._id.toHexString()) { 
    // set for mentor as mentor can only comment on Report
    report.comment = comment;
  }
  if (!user.isMentor && report.mentee.toHexString() === user._id.toHexString()) { 
    // set for mentee
    report.goal = goal
    report.takeaway = takeaway
  }
  await report.save()
  res.json(sendResponse(httpStatus.OK, "Update successful", report))
}

//delete report by mentee

exports.delete = async (req, res) => {
  const report = req.report; // get idp instance from response object
  const userId = req.sub; // get user
  if (report.mentee.toHexString() === userId){
    report.deleted = true;
    await report.save();
    return res.json(sendResponse(httpStatus.OK, "Report deleted successfully", report));
  }
  res.json(sendResponse(httpStatus.UNAUTHORIZED, 'Unauthorized', null));
}
