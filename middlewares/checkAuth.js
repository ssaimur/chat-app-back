// external imports
const jwt = require('jsonwebtoken');

// internal imports
const Unauthenticated = require('../errors/Unauthenticated');

const checkAuth = (req, res, next) => {
  // get the cookie
  const token =
    Object.keys(req.signedCookies).length > 0
      ? req.signedCookies.chatUser
      : null;

  // check if the token exists
  if (token) {
    // verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      // check if there is an error
      if (err) {
        next(new Unauthenticated('Token expired', 401));
      } else {
        req.user = decodedToken;
        next();
      }
    });
  } else {
    next(new Unauthenticated('User unauthorized', 401));
  }
};

module.exports = checkAuth;
