const { celebrate, Joi, Segments } = require("celebrate");

exports.validateCreateModule = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(1).max(256).required(),
    description: Joi.string().max(1024),
    category: Joi.string().max(64),
    tags: Joi.array().items(Joi.string().max(64)),
  }),
});

exports.validateUpdateModule = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(1).max(256),
    description: Joi.string().max(1024),
    category: Joi.string().max(64),
    tags: Joi.array().items(Joi.string().max(64)),
  }),
});
