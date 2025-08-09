const { celebrate, Joi, Segments } = require("celebrate");
const { objectIdField } = require("./baseSchemas");

exports.validateCreateInventory = celebrate({
  [Segments.BODY]: Joi.object({
    moduleId: objectIdField.required(),
    quantity: Joi.number().max(9999).min(0),
  }),
});

exports.validateUpdateInventory = celebrate({
  [Segments.BODY]: Joi.object({
    quantity: Joi.number().max(9999).min(0),
  }),
});
