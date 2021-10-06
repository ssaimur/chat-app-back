// external imports

// internal imports
const Conversation = require('../models/conversationModel');
const asyncWrapper = require('../middlewares/asyncWrapper');
const { escape } = require('../lib/utils');
const User = require('../models/userModel');

// module scaffolding
const inboxController = {};

//////////////////////////////
// Create a conversation
////////////////////////////////////////
inboxController.createConversation = asyncWrapper(async (req, res, next) => {
  const creator = req.user;
  const participant = req.body;

  const convoToCreate = {
    creator: {
      id: creator.userid,
      name: creator.name,
      avatar: creator.avatar,
    },
    participant: {
      id: participant.userid,
      name: participant.name,
      avatar: participant.avatar,
    },
  };

  const conversation = await Conversation.create(convoToCreate);

  res
    .status(200)
    .json({ success: true, message: 'Conversation successfully created' });
});

//////////////////////////////
// Get Inbox Page
////////////////////////////////////////
inboxController.getInbox = asyncWrapper(async (req, res, next) => {
  // get the conversations
  const conversations = await Conversation.find({
    $or: [
      { 'creator.id': req.user.userid },
      { 'participant.id': req.user.userid },
    ],
  });

  // send the response
  res.status(200).json({ success: true, data: conversations });
});

//////////////////////////////
// Search a User
////////////////////////////////////////
inboxController.searchUser = asyncWrapper(async (req, res, next) => {
  // get the user
  const userIdfyr = req.body.user;

  // make the regex pattern ready
  const name_regex = new RegExp(escape(userIdfyr), 'i');
  const email_regex = new RegExp('^' + escape(userIdfyr) + '$', 'i');

  const users = await User.find({
    $or: [
      { name: name_regex },
      { username: name_regex },
      { email: email_regex },
    ],
  });

  // send the response
  res.status(200).json({ success: true, data: users });
});

module.exports = inboxController;
