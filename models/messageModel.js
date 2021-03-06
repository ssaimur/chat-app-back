const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = Schema(
  {
    text: {
      type: String,
      required: true,
    },
    attachment: {
      type: String,
    },
    sender: {
      id: mongoose.Types.ObjectId,
      name: String,
      avatar: String,
    },
    reciever: {
      id: mongoose.Types.ObjectId,
      name: String,
      avatar: String,
    },
    date_time: {
      type: Date,
      default: Date.now(),
    },
    conversation_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
