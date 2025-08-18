const { celebrate, Joi, Segments } = require("celebrate");

exports.validateChat = celebrate({
  [Segments.BODY]: Joi.object({
    messages: Joi.array()
      .items(
        Joi.object({
          role: Joi.string().valid("system", "user", "assistant").required(),
          content: Joi.string().min(1).required(),
        }),
      )
      .min(1)
      .required(),
  }),
});
