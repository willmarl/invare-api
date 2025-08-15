const jwt = require("jsonwebtoken");
const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES,
  REFRESH_TOKEN_EXPIRES,
} = require("./config");

exports.generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES },
  );
};

exports.generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id, tokenVersion: user.tokenVersion },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES },
  );
};

exports.verifyAccessToken = (token) => jwt.verify(token, ACCESS_TOKEN_SECRET);

exports.verifyRefreshToken = (token) => jwt.verify(token, REFRESH_TOKEN_SECRET);
