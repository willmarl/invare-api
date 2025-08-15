// middlewares/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const UnauthorizedError = require("../errors/UnauthorizedError");
const ForbiddenError = require("../errors/ForbiddenError");
const NotFoundError = require("../errors/NotFoundError");
const {
  UNAUTHORIZED_MESSAGE,
  FORBIDDEN_MESSAGE,
  NOT_FOUND_MESSAGE,
} = require("../utils/errors");
const { ACCESS_TOKEN_SECRET } = require("../utils/config");

exports.protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError(UNAUTHORIZED_MESSAGE);
  }
  const token = authHeader.split(" ")[1];

  jwt.verify(token, ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err?.name === "TokenExpiredError") {
      return next(
        new UnauthorizedError(`${UNAUTHORIZED_MESSAGE}: Token expired`),
      );
    }

    if (err) {
      return next(new ForbiddenError(FORBIDDEN_MESSAGE));
    }

    try {
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return next(new NotFoundError(NOT_FOUND_MESSAGE));
      }

      req.user = user;
      next();
    } catch (dbErr) {
      next(dbErr);
    }
  });
};
