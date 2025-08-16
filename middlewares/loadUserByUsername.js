const NotFoundError = require("../errors/NotFoundError");
const { NOT_FOUND_MESSAGE } = require("../utils/errors");
const User = require("../models/user");

function loadUserByUsername(attachAs = "wikiUser") {
  return async function (req, res, next, username) {
    try {
      const user = await User.findOne({
        username: username.toLowerCase(),
      }).select("_id username");

      if (!user) {
        throw new NotFoundError(NOT_FOUND_MESSAGE);
      }
      req[attachAs] = user;
      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = loadUserByUsername;
