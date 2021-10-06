// external imports
const express = require('express');

// internal imports
const {
  createConversation,
  getInbox,
  searchUser,
} = require('../controllers/inboxController');

const router = express.Router();

//////////////////////////////
// Create a conversation
////////////////////////////////////////
router.post('/conversation', createConversation);

//////////////////////////////
// Get Inbox Page
////////////////////////////////////////
router.get('/', getInbox);

//////////////////////////////
// Search users
////////////////////////////////////////
router.get('/search', searchUser);

module.exports = router;
