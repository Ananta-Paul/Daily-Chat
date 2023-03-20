const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

const allMessages = asyncHandler(async (req, res) => {
  try {
    // await Message.update(
    //   { chat: req.params.chatId },
    //   { $addToSet: { readBy: req.id } }
    // );
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name avatar email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
const sendMessage = asyncHandler(async (req, res) => {
  const { chatId, content } = req.body;
  if (!content || !chatId)
    return res.status(400).json({ message: "Invalid data!" });
  var newMessage = {
    sender: req.id,
    content,
    chat: chatId,
    readBy: [req.id],
  };
  try {
    var message = await Message.create(newMessage);
    message = await message.populate("sender", "name avatar email");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name avatar email",
    });
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });
    res.json(message);
  } catch (error) {
    res.status(400).json(error.message);
  }
});
const updateReadBy = asyncHandler(async (req, res) => {
  const { messageId } = req.body;
  const updatedReadBy = await Message.findByIdAndUpdate(messageId, {
    $addToSet: { readBy: req.id },
  });

  if (!updatedReadBy) {
    res.status(404);
    throw new Error("Chat not found");
  } else {
    res.json(updatedReadBy);
  }
});
module.exports = { allMessages, sendMessage, updateReadBy };
