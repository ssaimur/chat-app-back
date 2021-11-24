// external imports

// internal imports
const Conversation = require('../models/conversationModel');
const asyncWrapper = require('../middlewares/asyncWrapper');
const { escape } = require('../lib/utils');
const User = require('../models/userModel');
const Message = require('../models/messageModel');

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

inboxController.getAConversation = async (req, res, next) => {
  try {
    const messages = await Message.find({
      conversation_id: req.params.conversation_id,
    }).sort('-createdAt');

    const { participant } = await Conversation.findById(
      req.params.conversation_id
    );

    res.status(200).json({
      data: {
        messages: messages,
        participant,
      },
      user: req.user.userid,
      conversation_id: req.params.conversation_id,
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: 'Unknows error occured!',
        },
      },
    });
  }
};

// send message
inboxController.sendMessage = asyncWrapper(async (req, res, next) => {
  console.log({ body: req.body });
  const newMessage = await Message.create({
    text: req.body.message,
    sender: {
      id: req.user.userid,
      name: req.user.username,
      avatar: req.user.avatar || null,
    },
    receiver: {
      id: req.body.receiverId,
      name: req.body.receiverName,
      avatar: req.body.avatar || null,
    },
    conversation_id: req.body.conversationId,
  });

  console.log({ body: req.body, newMessage });

  global.io.emit('new_message', {
    message: {
      conversation_id: req.body.conversationId,
      sender: {
        id: req.user.userid,
        name: req.user.username,
        avatar: req.user.avatar || null,
      },
      message: req.body.message,
      date_time: newMessage.date_time,
    },
  });

  res.status(200).json({
    message: 'Successful!',
    data: newMessage,
  });
});

module.exports = inboxController;
