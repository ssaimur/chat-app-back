// external imports
const jwt = require('jsonwebtoken');

// module scaffolding
const utils = {};

utils.createToken = (sign, maxAge) => {
  return jwt.sign(sign, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};

utils.escape = function (str) {
  return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

module.exports = utils;
