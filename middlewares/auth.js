const UnauthorizedError = require("../errors/UnauthorizedError");
const { UNAUTHORIZED_MESSAGE } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");
const jwt = require("jsonwebtoken");

exports.protect = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer "))
    throw new UnauthorizedError(UNAUTHORIZED_MESSAGE);

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    throw new UnauthorizedError(UNAUTHORIZED_MESSAGE);
  }
};
