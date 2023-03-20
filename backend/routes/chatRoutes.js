const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.js");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
} = require("../controllers/chatController");
router.route("/").post(auth, accessChat);
router.route("/").get(auth, fetchChats);
router.route("/group").post(auth, createGroupChat);
router.route("/group").put(auth, renameGroup);
router.route("/groupadd").put(auth, addToGroup);
router.route("/groupremove").put(auth, removeFromGroup);

module.exports = router;
