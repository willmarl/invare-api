const ownershipCheck = (model, ownerField) => {
  return async (req, res, next) => {
    try {
      const resource = await model.findById(req.params.id);

      if (!resource)
        return res.status(404).json({ message: "Resource not found" });

      const ownerId = resource[ownerField]?.toString();
      if (ownerId !== req.user._id) {
        return res
          .status(403)
          .json({ message: "Not authorized to modify this resource" });
      }

      req.resource = resource;
      next();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
};

module.exports = ownershipCheck;
