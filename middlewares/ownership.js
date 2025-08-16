const NotFoundError = require("../errors/NotFoundError");
const ForbiddenError = require("../errors/UnauthorizedError");
const { NOT_FOUND_MESSAGE, FORBIDDEN_MESSAGE } = require("../utils/errors");

const ownershipCheck = (
  model,
  ownerField,
  paramField = "id",
  modelField = "_id",
) => {
  return async (req, res, next) => {
    try {
      const value = req.params[paramField];
      const query =
        modelField === "_id" ? { _id: value } : { [modelField]: value };
      const resource = await model.findOne(query);

      if (!resource) throw new NotFoundError(NOT_FOUND_MESSAGE);

      const ownerId = resource[ownerField]?.toString();
      if (ownerId !== req.user._id.toString())
        throw new ForbiddenError(FORBIDDEN_MESSAGE);

      req.resource = resource;
      next();
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
};

module.exports = ownershipCheck;
