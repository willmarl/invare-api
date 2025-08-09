const BadRequestError = require("../../errors/BadRequestError");
const NotFoundError = require("../../errors/NotFoundError");
const ConflictError = require("../../errors/ConflictError");
const {
  BAD_REQUEST_MESSAGE,
  NOT_FOUND_MESSAGE,
  CONFLICT_MESSAGE,
} = require("../../utils/errors");
const Module = require("../../models/module");
const storage = require("../../services/storageService");

exports.createModule = async (req, res, next) => {
  try {
    const { name, description, category } = req.body;
    const owner = req.user._id;

    if (!req.file) {
      throw new BadRequestError(BAD_REQUEST_MESSAGE);
    }

    const image = await storage.save(req.file, `modules/${owner}`);

    const newModule = new Module({
      name,
      description,
      category,
      image,
      owner,
    });

    await newModule.save();

    res.status(201).json({
      message: "Module created successfully",
      module: newModule,
    });
  } catch (err) {
    console.log(err);
    if (err.name === "ValidationError")
      throw new BadRequestError(BAD_REQUEST_MESSAGE);
    if (err.code === 11000) throw new ConflictError(CONFLICT_MESSAGE);
    next(err);
  }
};

exports.getModules = async (req, res, next) => {
  try {
    const modules = await Module.find();
    res.json(modules);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getModuleById = async (req, res, next) => {
  try {
    const module = await Module.findById(req.params.moduleId);
    if (!module) throw new NotFoundError(NOT_FOUND_MESSAGE);
    res.json(module);
  } catch (err) {
    console.log(err);
    if (err.message.includes("Cast to ObjectId failed"))
      throw new BadRequestError(BAD_REQUEST_MESSAGE);
    next(err);
  }
};

exports.getModulesByOwner = async (req, res, next) => {
  const ownerId = req.params.ownerId;
  try {
    const modules = await Module.find({ owner: ownerId });
    if (modules.length === 0) throw new NotFoundError(NOT_FOUND_MESSAGE);
    res.send(modules);
  } catch (err) {
    console.log(err);
    if (err.message.includes("Cast to ObjectId failed"))
      throw new BadRequestError(BAD_REQUEST_MESSAGE);
    next(err);
  }
};

exports.updateModule = async (req, res, next) => {
  const body = req.body;
  delete body?.owner; //prevent changing owner
  try {
    if (req.file) {
      const newImage = await storage.save(req.file, `modules/${req.user._id}`);
      body.image = newImage;
      console.log("DEBUG", body.image);
    }

    const updatedModule = await Module.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedModule) throw new NotFoundError(NOT_FOUND_MESSAGE);

    res.json(updatedModule);
  } catch (err) {
    console.log(err);
    if (err.message.includes("Cast to ObjectId failed"))
      throw new BadRequestError(BAD_REQUEST_MESSAGE);
    if (err.name === "ValidationError")
      throw new BadRequestError(BAD_REQUEST_MESSAGE);
    if (err.code === 11000) throw new ConflictError(CONFLICT_MESSAGE);
    next(err);
  }
};

exports.deleteModule = async (req, res, next) => {
  try {
    const deletedModule = await Module.findByIdAndDelete(req.params.id);
    if (!deletedModule) throw new NotFoundError(NOT_FOUND_MESSAGE);
    res.json({ message: "Module deleted successfully" });
  } catch (err) {
    console.log(err);
    if (err.message.includes("Cast to ObjectId failed"))
      throw new BadRequestError(BAD_REQUEST_MESSAGE);
    next(err);
  }
};
