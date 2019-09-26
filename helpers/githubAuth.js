const axios = require('axios');

exports.accessToken = async (datas)=>{
  const { data } = await axios({ //sends a JSON post body
    url: 'https://github.com/login/oauth/access_token',
    method: 'post',
    data: datas, 
    headers:  {'Accept': 'application/json'}
  })
  return data.access_token;
}

exports.getUser = async (accessToken)=> {
  const { data } = await axios({ // get user from github
    url: 'https://api.github.com/user',
    method: 'get',
    headers: {
      'Authorization': `token ${accessToken}`
    }
  })
  return data;
}

exports.getUserEmail = async (accessToken)=>{
  const { data: userEmail } = await axios({ //get userEmail from github if userEmail do not exist 
    url: 'https://api.github.com/user/emails',
    method: 'get',
    headers: {
      'Authorization': `token ${accessToken}`
    }
  })
  return userEmail.filter((gitEmail)=> gitEmail.primary).map(result=> result.email)[0];
}
