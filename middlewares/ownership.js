const NotFoundError = require("../errors/NotFoundError");
const UnauthorizedError = require("../errors/UnauthorizedError");
const { NOT_FOUND_MESSAGE, UNAUTHORIZED_MESSAGE } = require("../utils/errors");

const ownershipCheck = (model, ownerField) => {
  return async (req, res, next) => {
    try {
      const resource = await model.findById(req.params.id);

      if (!resource) throw new NotFoundError(NOT_FOUND_MESSAGE);

      const ownerId = resource[ownerField]?.toString();
      if (ownerId !== req.user._id)
        throw new UnauthorizedError(UNAUTHORIZED_MESSAGE);

      req.resource = resource;
      next();
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
};

module.exports = ownershipCheck;
