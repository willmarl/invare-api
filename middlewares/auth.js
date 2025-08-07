const UnauthorizedError = require("../errors/UnauthorizedError");
const { UNAUTHORIZED_MESSAGE } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new UnauthorizedError(UNAUTHORIZED_MESSAGE);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    throw new UnauthorizedError(UNAUTHORIZED_MESSAGE);
  }
};
