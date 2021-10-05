const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userShcema = Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email',
      ],
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^(?=.{5,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
        'Please provide a valid username',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
    },
    avatar: String,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userShcema);

module.exports = User;
