const {
  INTERNAL_SERVER_ERROR_MESSAGE,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

const errorHandler = (err, req, res, next) => {
  console.error(err);
  const { statusCode = INTERNAL_SERVER_ERROR, message } = err;
  res.status(statusCode).send({
    message:
      statusCode === INTERNAL_SERVER_ERROR
        ? INTERNAL_SERVER_ERROR_MESSAGE
        : message,
  });
};

module.exports = errorHandler;
