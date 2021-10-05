// external imports
const express = require('express');
const router = express.Router();

// internal imports
const { registerUser, loginUser } = require('../controllers/authController');

//////////////////////////////
// Register a user
///////////////////////////////////////
router.post('/register', registerUser);

//////////////////////////////
// Login a user
//////////////////////////////////////
router.post('/login', loginUser);

module.exports = router;
