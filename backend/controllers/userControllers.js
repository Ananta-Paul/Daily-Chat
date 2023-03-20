const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generatejwtToken = require("../config/generatejwtToken");

const signupUser = asyncHandler(async (req, res) => {
  const { name, email, password, avatar, oauth } = req.body;
  if (!name || !email || (!password && !oauth)) {
    res.status(400);
    throw new Error("Please enter all the fields");
  }
  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(400);
    throw new Error("User already Exists");
  }
  if (!oauth) var user = await User.create({ name, email, password });
  else var user = await User.create({ name, email, avatar });

  if (user) {
    res.status(201).json({ result: user, token: generatejwtToken(user._id) });
  } else {
    res.status(400);
    throw new Error("Failed to signup");
  }
});
const userAuth = asyncHandler(async (req, res) => {
  const { email, password, oauth } = req.body;
  const user = await User.findOne({ email });
  if (user && (oauth || (await user.isPassword(password)))) {
    res.status(201).json({
      result: user,
      token: generatejwtToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
});
const getUsers = asyncHandler(async (req, res) => {
  const keyword = req.query
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { name: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  const users = await User.find(keyword).find({ _id: { $ne: req.id } });
  res.send(users);
  // console.log(keyword);
});
const userUpdate = asyncHandler(async (req, res) => {
  const { avatar, name } = req.body;
  const updatedUser = await User.findByIdAndUpdate(
    req.id,
    { name, avatar },
    { new: true }
  );

  if (!updatedUser) {
    res.status(404);
    throw new Error("Chat not found");
  } else {
    res.json(updatedUser);
  }
});
module.exports = { signupUser, userAuth, getUsers, userUpdate };
