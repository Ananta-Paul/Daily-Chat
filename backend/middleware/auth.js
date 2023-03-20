const jwt = require("jsonwebtoken");
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const isCustomeAuth = token.length < 500;
    let data;
    if (token && isCustomeAuth) {
      //console.log("custome");
      data = jwt.verify(token, process.env.SECRET);
      req.id = data?.id;
    } else {
      console.log("google");
      data = jwt.decode(token);
      req.id = data?.sub;
    }
    // req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    res.status(401).json({ message: "Token Invalid", error });
  }
};
module.exports = auth;
