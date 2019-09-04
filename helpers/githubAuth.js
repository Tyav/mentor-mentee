const axios = require('axios');

exports.accessToken = async (code)=>{
  const { data } = await axios({ //sends a JSON post body
    url: 'https://github.com/login/oauth/access_token',
    method: 'post',
    data:{
      client_id: '59a761c57c054d36a80d',
      client_secret: 'eccc2043a907c091c333652a233575e2a9ca736c',
      code: code
    }, 
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
