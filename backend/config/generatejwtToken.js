const jwt = require("jsonwebtoken");

const generatejwtToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET, { expiresIn: "30d" });
};
module.exports = generatejwtToken;
