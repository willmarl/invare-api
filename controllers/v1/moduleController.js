const BadRequestError = require("../../errors/BadRequestError");
const NotFoundError = require("../../errors/NotFoundError");
const InternalServerError = require("../../errors/InternalServerError");
const {
  BAD_REQUEST_MESSAGE,
  NOT_FOUND_MESSAGE,
  INTERNAL_SERVER_ERROR_MESSAGE,
} = require("../../utils/errors");
const Module = require("../../models/module");
const storage = require("../../services/storageService");

exports.createModule = async (req, res, next) => {
  try {
    const { name, description, category, owner } = req.body;

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
    next(err);
  }
};

exports.getModules = async (req, res) => {
  try {
    const modules = await Module.find();
    res.json(modules);
  } catch (err) {
    console.log(err);
    throw new InternalServerError(INTERNAL_SERVER_ERROR_MESSAGE);
  }
};

exports.getModuleById = async (req, res) => {
  try {
    const module = await Module.findById(req.params.moduleId);
    if (!module) throw new NotFoundError(NOT_FOUND_MESSAGE);
    res.json(module);
  } catch (err) {
    console.log(err);
    throw new InternalServerError(INTERNAL_SERVER_ERROR_MESSAGE);
  }
};

exports.getModulesByOwner = async (req, res) => {
  const ownerId = req.params.ownerId;
  try {
    const modules = await Module.find({ owner: ownerId });
    res.send(modules);
  } catch (err) {
    console.log(err);
    throw new InternalServerError(INTERNAL_SERVER_ERROR_MESSAGE);
  }
};

exports.updateModule = async (req, res) => {
  try {
    const updatedModule = await Module.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!updatedModule) throw new NotFoundError(NOT_FOUND_MESSAGE);

    res.json(updatedModule);
  } catch (err) {
    console.log(err);
    throw new BadRequestError(BAD_REQUEST_MESSAGE);
  }
};

exports.deleteModule = async (req, res) => {
  try {
    const deletedModule = await Module.findByIdAndDelete(req.params.id);
    if (!deletedModule)
      throw new InternalServerError(INTERNAL_SERVER_ERROR_MESSAGE);
    res.json({ message: "Module deleted successfully" });
  } catch (err) {
    console.log(err);
    throw new InternalServerError(INTERNAL_SERVER_ERROR_MESSAGE);
  }
};
