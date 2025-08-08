const { celebrate, Joi, Segments } = require("celebrate");
const { objectIdField } = require("./baseSchemas");

exports.validateCreateModule = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(1).max(256).required(),
    description: Joi.string().max(1024),
    category: Joi.string().max(64),
    owner: objectIdField.required(),
  }),
});

exports.validateUpdateModule = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(1).max(256),
    description: Joi.string().max(1024),
    category: Joi.string().max(64),
    owner: objectIdField,
  }),
});
