const httpStatus = require('http-status');
const config = require('../config/env');
const User = require('../models/user.model');
const sendResponse = require('../helpers/response');
const sendMail = require('../helpers/SendMail');
const messages = require('../helpers/mailMessage');
const github = require('../helpers/githubAuth')

exports.mentorCallbackSupport = async (req, res, next) => {
  try {
    req.isMentor = true;
    next()
  } catch (error) {
    next(error)
  }
}

exports.githubCallback = async (req, res, next) => {
  try {
  const { query } = req;
  const { code } = query;
  if (!code) { //Check if code is sent from github
    return res.json(sendResponse(''));
  }
  // set secrets and client_id
  let data = req.isMentor? {
    code, 
    client_id: config.gitAuth.mentor_id,
    client_secret: config.gitAuth.mentor_secret
  }: {
    code, 
    client_id: config.gitAuth.mentee_id,
    client_secret: config.gitAuth.mentee_secret
  }

  // Use code, client_id and client_secret to get access_token from github
  const accessToken = await github.accessToken(data);
  // get git user with accessToken
    const gitUser = await github.getUser(accessToken) 
    
    if (!gitUser){
      return res.redirect(`${config.clientSideUrl}/register`)
    }
    if (!gitUser.email){
      gitUser.email = await github.getUserEmail(accessToken)
    }
    let token = ''
    // check if user have been created
    const userExist = await User.getByEmail(gitUser.email)
    if (userExist){
      token = userExist.token();
      // res.cookie('mentordev_token',token, {domain : `herokuapp.com`, path: '/'})
      // if (userExist.isMentor)res.cookie('validateType', userExist.isMentor, {domain : `herokuapp.com`, path: '/'})
      return res.redirect(`${config.clientSideUrl}/dashboard?token=${token}&${userExist.isMentor? 'auth=true':''}`)
    }
    
    // extract git data and save as the user
    const {email, name, login, avatar_url, bio, location} = gitUser
    let user = new User({
      email,
      name,
      bio,
      location,
      connection: {github: login},
      avatar: avatar_url,
      isMentor: req.isMentor? true: false
    })
    await user.save();
    // get token and send redirect
    token = user.token();
    // res.cookie('mentordev_token',token, {domain : `herokuapp.com`, path: '/dashboard'})
    // res.cookie('s_s', true, {domain : `herokuapp.com`, path: '/dashboard'})
    return res.redirect(`${config.clientSideUrl}/verify?token=${token}&s_s=true&${req.isMentor? 'auth=true':''}`)

  } catch (error) {
    res.send(error);
  }
};
