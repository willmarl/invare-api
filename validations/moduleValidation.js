const { celebrate, Joi, Segments } = require("celebrate");

exports.validateCreateModule = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(1).max(256).required(),
    model: Joi.string().max(256).allow("").optional(),
    description: Joi.string().max(1024).allow("").optional(),
    category: Joi.array().items(Joi.string().max(64)),
    image: Joi.object({
      url: Joi.string().uri(),
      key: Joi.string(),
      mimeType: Joi.string(),
      size: Joi.number(),
    }),
    exampleIdeas: Joi.array().items(Joi.string().max(256)),
    codeSnippets: Joi.object({
      cpp: Joi.string().max(4096).allow(""),
      python: Joi.string().max(4096).allow(""),
    }),
  }),
});

exports.validateUpdateModule = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(1).max(256),
    model: Joi.string().max(256).allow("").optional(),
    description: Joi.string().max(1024).allow("").optional(),
    category: Joi.array().items(Joi.string().max(64)),
    image: Joi.object({
      url: Joi.string().uri(),
      key: Joi.string(),
      mimeType: Joi.string(),
      size: Joi.number(),
    }),
    exampleIdeas: Joi.array().items(Joi.string().max(256)),
    codeSnippets: Joi.object({
      cpp: Joi.string().max(4096).allow(""),
      python: Joi.string().max(4096).allow(""),
    }),
  }),
});
