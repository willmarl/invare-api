const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./config");

exports.generateToken = (userId) => {
  return jwt.sign({ _id: userId }, JWT_SECRET, { expiresIn: "7d" });
};
