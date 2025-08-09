const NotFoundError = require("../../errors/NotFoundError");
const BadRequestError = require("../../errors/BadRequestError");
const ForbiddenError = require("../../errors/ForbiddenError");
const ConflictError = require("../../errors/ConflictError");
const Inventory = require("../../models/inventory");
const {
  BAD_REQUEST_MESSAGE,
  NOT_FOUND_MESSAGE,
  FORBIDDEN_MESSAGE,
  CONFLICT_MESSAGE,
} = require("../../utils/errors");
const Module = require("../../models/module");

// ex of what inventory should save
// "userId": 1,
// "moduleId": 1,
// "quantity": 2

exports.createInventory = async (req, res, next) => {
  const body = req.body;
  body.userId = req.user._id;
  try {
    const module = await Module.findOne({ _id: body.moduleId });
    if (!module) throw new NotFoundError(NOT_FOUND_MESSAGE);
    const newInventory = await Inventory.create(body);
    res.status(201).json(newInventory);
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError")
      throw new BadRequestError(BAD_REQUEST_MESSAGE);
    if (err.code === 11000) throw new ConflictError(CONFLICT_MESSAGE);
    next(err);
  }
};

exports.getInventoryById = async (req, res, next) => {
  try {
    const inventory = await Inventory.findById(req.params.id);
    if (!inventory) throw new NotFoundError(NOT_FOUND_MESSAGE);
    res.json(inventory);
  } catch (err) {
    console.error(err);
    if (err.message.includes("Cast to ObjectId failed"))
      throw new BadRequestError(BAD_REQUEST_MESSAGE);
    next(err);
  }
};

exports.getInventoryByUser = async (req, res, next) => {
  const user = req.params.userId;
  try {
    const inventories = await Inventory.find({ userId: user });
    if (inventories.length === 0) throw new NotFoundError(NOT_FOUND_MESSAGE);
    res.send(inventories);
  } catch (err) {
    console.error(err);
    if (err.message.includes("Cast to ObjectId failed"))
      throw new BadRequestError(BAD_REQUEST_MESSAGE);
    next(err);
  }
};

exports.updateInventory = async (req, res, next) => {
  // const inventoryId = req.params.id;
  // const inventory
  // only need to change quantity. if need to change module then delete from inventory
  // and user have to add new module to inventory
  // if (req.user._id !== req.body.userId)
  //   //prevent changing other users stuff
  //   throw new ForbiddenError(FORBIDDEN_MESSAGE);
  try {
    const updatedInventory = await Inventory.findByIdAndUpdate(
      req.params.id,
      { quantity: req.body.quantity },
      { new: true, runValidators: true },
    );
    if (!updatedInventory) throw new NotFoundError(NOT_FOUND_MESSAGE);
    res.json(updatedInventory);
  } catch (err) {
    console.error(err);
    if (err.message.includes("Cast to ObjectId failed"))
      throw new BadRequestError(BAD_REQUEST_MESSAGE);
    if (err.name === "ValidationError")
      throw new BadRequestError(BAD_REQUEST_MESSAGE);
    next(err);
  }
};

exports.deleteInventory = async (req, res, next) => {
  try {
    const deletedInventory = await Inventory.findByIdAndDelete(req.params.id);
    if (!deletedInventory) throw new NotFoundError(NOT_FOUND_MESSAGE);
    res.json({ message: "Inventory deleted successfully" });
  } catch (err) {
    console.error(err);
    if (err.message.includes("Cast to ObjectId failed"))
      throw new BadRequestError(BAD_REQUEST_MESSAGE);
    next(err);
  }
};
