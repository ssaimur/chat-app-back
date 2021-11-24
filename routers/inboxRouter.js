// external imports
const express = require('express');

// internal imports
const {
  createConversation,
  getInbox,
  searchUser,
  getAConversation,
  sendMessage,
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

//////////////////////////////
// get a conversation
////////////////////////////////////////
router.get('/messages/:conversation_id', getAConversation);

//////////////////////////////
// send a message
////////////////////////////////////////
router.post('/message', sendMessage);

module.exports = router;
