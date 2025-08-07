const Joi = require("joi");

exports.objectIdField = Joi.string().hex().length(24); // for MongoDB IDs
