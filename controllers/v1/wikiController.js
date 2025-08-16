const Wiki = require("../../models/wiki");
const NotFoundError = require("../../errors/NotFoundError");
const BadRequestError = require("../../errors/BadRequestError");
const ConflictError = require("../../errors/ConflictError");
const {
  BAD_REQUEST_MESSAGE,
  NOT_FOUND_MESSAGE,
  CONFLICT_MESSAGE,
} = require("../../utils/errors");

// Create a new Wiki entry
exports.createWiki = async (req, res, next) => {
  try {
    const newWiki = await Wiki.create({
      ...req.body,
      owner: req.user?._id,
    });
    res.status(201).json(newWiki);
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError")
      throw new BadRequestError(BAD_REQUEST_MESSAGE);
    if (err.code === 11000) throw new ConflictError(CONFLICT_MESSAGE);
    next(err);
  }
};

// Get all Wiki entries (optionally filter by query)
exports.getAllWikis = async (req, res, next) => {
  try {
    const wikis = await Wiki.find({});
    res.json(wikis);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// Get a Wiki entry by ID
exports.getWikiById = async (req, res, next) => {
  try {
    const wiki = await Wiki.findById(req.params.id);
    if (!wiki) throw new NotFoundError(NOT_FOUND_MESSAGE);
    res.json(wiki);
  } catch (err) {
    console.error(err);
    if (err.message.includes("Cast to ObjectId failed"))
      throw new BadRequestError(BAD_REQUEST_MESSAGE);
    next(err);
  }
};

// Update a Wiki entry by ID
exports.updateWiki = async (req, res, next) => {
  try {
    const updatedWiki = await Wiki.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedWiki) throw new NotFoundError(NOT_FOUND_MESSAGE);
    res.json(updatedWiki);
  } catch (err) {
    console.error(err);
    if (err.message.includes("Cast to ObjectId failed"))
      throw new BadRequestError(BAD_REQUEST_MESSAGE);
    if (err.name === "ValidationError")
      throw new BadRequestError(BAD_REQUEST_MESSAGE);
    if (err.code === 11000) throw new ConflictError(CONFLICT_MESSAGE);
    next(err);
  }
};

// Delete a Wiki entry by ID
exports.deleteWiki = async (req, res, next) => {
  try {
    const deletedWiki = await Wiki.findByIdAndDelete(req.params.id);
    if (!deletedWiki) throw new NotFoundError(NOT_FOUND_MESSAGE);
    res.json({ message: "Wiki deleted" });
  } catch (err) {
    console.error(err);
    if (err.message.includes("Cast to ObjectId failed"))
      throw new BadRequestError(BAD_REQUEST_MESSAGE);
    next(err);
  }
};
