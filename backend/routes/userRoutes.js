const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.js");
const {
  signupUser,
  userAuth,
  getUsers,
  userUpdate,
} = require("../controllers/userControllers");
router.route("/").post(signupUser).get(auth, getUsers);
router.post("/login", userAuth);
router.route("/update").post(auth, userUpdate);

module.exports = router;
