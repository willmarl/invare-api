const {
  TOO_MANY_REQUESTS,
  TOO_MANY_REQUESTS_MESSAGE,
} = require("../utils/errors");
const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: Number(process.env.API_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.API_MAX_REQUESTS) || 500,
  message: {
    status: TOO_MANY_REQUESTS,
    message: TOO_MANY_REQUESTS_MESSAGE,
  },
  standardHeaders: true,
  legacyHeaders: false,
});
const assistantLimiter = rateLimit({
  windowMs: Number(process.env.ASSISTANT_WINDOW_MS) || 60 * 1000,
  max: Number(process.env.ASSISTANT_MAX_REQUESTS) || 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: TOO_MANY_REQUESTS,
    message: TOO_MANY_REQUESTS_MESSAGE,
  },
});

module.exports = { apiLimiter, assistantLimiter };
