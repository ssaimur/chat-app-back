// external imports

// internal imports
const asyncWrapper = require('../middlewares/asyncWrapper');
const User = require('../models/userModel');

// module scaffolding
const userController = {};

//////////////////////////////
// Get all the users
///////////////////////////////////////
userController.getUsers = asyncWrapper(async (req, res) => {
  const users = await User.find({});
  res.status(200).json({ success: true, data: users });
});

module.exports = userController;
