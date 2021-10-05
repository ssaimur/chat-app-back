const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const convoSchema = Schema(
  {
    creator: {
      id: mongoose.Types.ObjectId,
      name: { type: String, required: true },
      avatar: String,
    },
    participant: {
      id: mongoose.Types.ObjectId,
      name: { type: String, required: true },
      avatar: String,
    },
    last_updated: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

const Conversation = mongoose.model('Conversation', convoSchema);

module.exports = Conversation;
