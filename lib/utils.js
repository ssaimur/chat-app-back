// external imports
const jwt = require('jsonwebtoken');

// module scaffolding
const utils = {};

utils.createToken = (sign, maxAge) => {
  return jwt.sign(sign, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};

module.exports = utils;
