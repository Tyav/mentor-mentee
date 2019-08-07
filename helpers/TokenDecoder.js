const jwt = require('jsonwebtoken');

const DecodeToken = token => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      throw new Error('Token may have expired');
    }
    return decoded;
  });
  return decoded;
};

module.exports = DecodeToken;
