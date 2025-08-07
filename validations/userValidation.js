const { celebrate, Joi, Segments } = require("celebrate");

exports.validateCreateUser = celebrate({
  [Segments.BODY]: Joi.object({
    username: Joi.string().min(1).max(30).required(),
    password: Joi.string().min(1).max(256).required(),
  }),
});
