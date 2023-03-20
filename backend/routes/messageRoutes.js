const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.js");
const {
  allMessages,
  sendMessage,
  updateReadBy,
} = require("../controllers/messageController");

router.route("/:chatId").get(auth, allMessages);
router.route("/").post(auth, sendMessage);
router.route("/readBy").post(auth, updateReadBy);
module.exports = router;
