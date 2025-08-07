const { JWT_SECRET } = require("./config");
const jwt = require("jsonwebtoken");

exports.generateToken = (userId) => {
  return jwt.sign({ _id: userId }, JWT_SECRET, { expiresIn: "7d" });
};
