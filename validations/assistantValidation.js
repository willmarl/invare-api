const { celebrate, Joi, Segments } = require("celebrate");

exports.validateChat = celebrate({
  [Segments.BODY]: Joi.object({
    message: Joi.string().min(1).required(),
  }),
});
