const gravatar = require('gravatar');

/**
 * returns the link to any avatar associated with the supplied email
 * or returns a link to a default avatar if email has no avatar
 */
module.exports = email => {
  const avatarUrl = gravatar.url(email, {
    s: '200',
    r: 'pg',
    d: 'mm'
  });

  return avatarUrl;
};
