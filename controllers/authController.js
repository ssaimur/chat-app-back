// external imports
const bcrypt = require('bcrypt');

// internal imports
const User = require('../models/userModel');
const { createToken } = require('../lib/utils');
const asyncWrapper = require('../middlewares/asyncWrapper');
const BadRequest = require('../errors/BadRequest');

// module scaffolding
const controllers = {};

// commons
const maxAge = 7 * 24 * 60 * 60;

//////////////////////////////
// Register a user
////////////////////////////////////////
controllers.registerUser = asyncWrapper(async (req, res) => {
  // generate salt and the hashed password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = await User.create({
    ...req.body,
    password: hashedPassword,
  });

  // set the object to generate token
  const userObject = {
    userid: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    avatar: user.avatar || null,
  };

  // generate token then send the cookie and the response
  const token = createToken(userObject, maxAge);
  res.cookie('chatUser', token, {
    httpOnly: true,
    maxAge: maxAge * 1000,
    signed: true,
  });
  res.status(201).json({ user: userObject });
});

//////////////////////////////
// Login a user
//////////////////////////////////////////
controllers.loginUser = asyncWrapper(async (req, res, next) => {
  // find the user
  const user = await User.findOne({
    $or: [{ email: req.body.username }, { username: req.body.username }],
  });

  // check if the user exists
  if (user && user._id) {
    // bypassing the password hashing and salting
    const isPasswordValid = req.body.password === user.password;

    // const isPasswordValid = await bcrypt.compare(
    //   req.body.password,
    //   user.password
    // );

    // check if the password is valid
    if (isPasswordValid) {
      // set the object to generate a token
      const userObject = {
        userid: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar || null,
      };

      // set the cookie
      const token = createToken(userObject, maxAge);
      res.cookie('chatUser', token, {
        httpOnly: true,
        maxAge: maxAge * 1000,
        signed: true,
      });

      // send the user
      res.status(200).json({ user: userObject });
    } else {
      next(new BadRequest('Incorrect password', 400));
    }
  } else {
    next(new BadRequest('Cannot find the user!', 400));
  }
});

module.exports = controllers;
