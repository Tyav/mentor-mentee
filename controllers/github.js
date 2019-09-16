const httpStatus = require('http-status');
const config = require('../config/env');
const User = require('../models/user.model');
const sendResponse = require('../helpers/response');
const sendMail = require('../helpers/SendMail');
const messages = require('../helpers/mailMessage');
const github = require('../helpers/githubAuth')

exports.githubCallback = async (req, res, next) => {
  try {
  const { query } = req;
  const { code } = query;
  if (!code) { //Check if code is sent from github
    return res.json(sendResponse(''));
  }
  // Use code, client_id and client_secret to get access_token from github
  const accessToken = await github.accessToken(code);
  // get git user with accessToken
    const gitUser = await github.getUser(accessToken) 
    
    if (!gitUser){
      return res.redirect('http://localhost:3000/register')
    }
    if (!gitUser.email){
      gitUser.email = await github.getUserEmail(accessToken)
    }
    let token = ''
    // check if user have been created
    const userExist = await User.getByEmail(gitUser.email)
    if (userExist){
      token = userExist.token();
      res.cookie('mentordev_token',token)
      if (userExist.isMentor)res.cookie('validateType', userExist.isMentor)
      return res.redirect(`http://localhost:3000/dashboard`)
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
    })
    await user.save();
    // get token and send redirect
    token = user.token();
    res.cookie('mentordev_token',token)
    res.cookie('s_s', true)
    return res.redirect(`http://localhost:3000/verify?token=${token}`)

  } catch (error) {
    res.send(error);
  }
};
