const { celebrate, Joi, Segments } = require("celebrate");
const { objectIdField } = require("./baseSchemas");

exports.validateModule = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(1).max(256).required(),
    description: Joi.max(1024).string(),
    category: Joi.string().max(64),
  }),
});
