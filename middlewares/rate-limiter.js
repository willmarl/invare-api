const {
  TOO_MANY_REQUESTS,
  TOO_MANY_REQUESTS_MESSAGE,
} = require("../utils/errors");
const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 500, // limit each IP to 500 requests per window
  message: {
    status: TOO_MANY_REQUESTS,
    message: TOO_MANY_REQUESTS_MESSAGE,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = apiLimiter;
