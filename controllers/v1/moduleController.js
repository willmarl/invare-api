// Get all modules by owner username (slug)
exports.getModulesByUsername = async (req, res, next) => {
  try {
    const owner = req.wikiUser._id;
    const modules = await Module.find({ owner });
    res.json(modules);
  } catch (err) {
    console.error(err);
    next(err);
  }
};
const BadRequestError = require("../../errors/BadRequestError");
const NotFoundError = require("../../errors/NotFoundError");
const ConflictError = require("../../errors/ConflictError");
const {
  BAD_REQUEST_MESSAGE,
  NOT_FOUND_MESSAGE,
  CONFLICT_MESSAGE,
} = require("../../utils/errors");
const Module = require("../../models/module");
const User = require("../../models/user");
const storage = require("../../services/storageService");
const normalizeTags = require("../../utils/normalizeTags");
const createSlug = require("../../utils/slugifyHelper");

exports.createModule = async (req, res, next) => {
  try {
    const owner = req.user._id;

    if (!req.file) {
      throw new BadRequestError(`${BAD_REQUEST_MESSAGE}: No image provided`);
    }

    const image = await storage.save(req.file, `modules/${owner}`);

    const body = req.body;
    body.category = normalizeTags(body.category);
    body.owner = owner;
    body.image = image;

    let base = createSlug(body.name);
    let slug = base;

    // Ensure slug uniqueness within this user's namespace
    let counter = 2;
    while (await Module.exists({ owner, slug })) {
      slug = `${base}-${counter++}`;
    }

    body.slug = slug;

    const newModule = new Module(body);

    await newModule.save();

    res.status(201).json({
      message: "Module created successfully",
      module: newModule,
    });
  } catch (err) {
    console.error(err);
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
    console.error(err);
    next(err);
  }
};

exports.getModuleById = async (req, res, next) => {
  try {
    const module = await Module.findById(req.params.moduleId);
    if (!module) throw new NotFoundError(NOT_FOUND_MESSAGE);
    res.json(module);
  } catch (err) {
    console.error(err);
    if (err.message.includes("Cast to ObjectId failed"))
      throw new BadRequestError(BAD_REQUEST_MESSAGE);
    next(err);
  }
};

exports.getModulesByOwner = async (req, res, next) => {
  const { ownerId } = req.params;
  try {
    // Check if user exists
    const userExist = await User.findById(ownerId);
    if (!userExist) {
      throw new NotFoundError(NOT_FOUND_MESSAGE);
    }
    const modules = await Module.find({ owner: ownerId });
    res.send(modules);
  } catch (err) {
    console.error(err);
    if (err.message.includes("Cast to ObjectId failed"))
      throw new BadRequestError(BAD_REQUEST_MESSAGE);
    next(err);
  }
};

exports.updateModule = async (req, res, next) => {
  const { body } = req;
  delete body?.owner; // prevent changing owner
  try {
    if (req.file) {
      const newImage = await storage.save(req.file, `modules/${req.user._id}`);
      body.image = newImage;
    }

    const updatedModule = await Module.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedModule) throw new NotFoundError(NOT_FOUND_MESSAGE);

    res.json(updatedModule);
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

exports.deleteModule = async (req, res, next) => {
  try {
    const deletedModule = await Module.findByIdAndDelete(req.params.id);
    if (!deletedModule) throw new NotFoundError(NOT_FOUND_MESSAGE);
    res.json({ message: "Module deleted successfully" });
  } catch (err) {
    console.error(err);
    if (err.message.includes("Cast to ObjectId failed"))
      throw new BadRequestError(BAD_REQUEST_MESSAGE);
    next(err);
  }
};

// slug CRUD
exports.getModuleBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const module = await Module.findOne({ slug });

    if (!module) {
      throw new NotFoundError(NOT_FOUND_MESSAGE);
    }

    return res.json(module);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.getModuleByUserAndSlug = async (req, res, next) => {
  try {
    const owner = req.wikiUser._id;
    const { slug } = req.params;
    const doc = await Module.findOne({ owner, slug });
    if (!doc) {
      throw new NotFoundError(NOT_FOUND_MESSAGE);
    }
    return res.json(doc);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.updateModuleByUserAndSlug = async (req, res, next) => {
  try {
    const body = req.body || {};
    const owner = req.wikiUser._id;
    const { slug } = req.params;

    // Set renameSlug to true if name is being updated
    if (typeof body === "object" && body !== null) {
      body.renameSlug = !!body.name;
    }

    const doc = await Module.findOne({ owner, slug });
    if (!doc) {
      throw new NotFoundError(NOT_FOUND_MESSAGE);
    }

    // Update fields from body (except owner, slug)
    Object.keys(body).forEach((key) => {
      if (key !== "owner" && key !== "slug" && key !== "renameSlug") {
        doc[key] = body[key];
      }
    });

    if (body.renameSlug) {
      let base = createSlug(body.name);
      let nextSlug = base;
      let counter = 2;
      while (
        await Module.exists({ owner, slug: nextSlug, _id: { $ne: doc._id } })
      ) {
        nextSlug = `${base}-${counter++}`;
      }
      doc.slug = nextSlug;
    }

    await doc.save();
    return res.json(doc);
  } catch (err) {
    if (err.code === 11000) {
      throw new ConflictError(CONFLICT_MESSAGE);
    }
    console.error(err);
    next(err);
  }
};

exports.deleteModuleByUserAndSlug = async (req, res, next) => {
  try {
    const owner = req.wikiUser._id;
    const { slug } = req.params;

    const doc = await Module.findOneAndDelete({ owner, slug });
    if (!doc) throw new NotFoundError(NOT_FOUND_MESSAGE);

    return res.json({ message: "Module deleted successfully" });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
