const { celebrate, Joi, Segments } = require("celebrate");

exports.validateCreateUser = celebrate({
  [Segments.BODY]: Joi.object({
    username: Joi.string()
      .min(1)
      .max(30)
      .pattern(/^[a-z0-9_]+$/i)
      .required(),
    password: Joi.string().min(1).max(256).required(),
  }),
});

exports.validateUpdateUser = celebrate({
  [Segments.BODY]: Joi.object({
    username: Joi.string()
      .min(1)
      .max(30)
      .pattern(/^[a-z0-9_]+$/i),
    password: Joi.string().min(1).max(256),
  }),
});
