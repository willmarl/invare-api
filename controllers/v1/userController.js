const NotFoundError = require("../../errors/NotFoundError");
const BadRequestError = require("../../errors/BadRequestError");
const ForbiddenError = require("../../errors/ForbiddenError");
const UnauthorizedError = require("../../errors/UnauthorizedError");
const ConflictError = require("../../errors/ConflictError");
const {
  BAD_REQUEST_MESSAGE,
  NOT_FOUND_MESSAGE,
  UNAUTHORIZED_MESSAGE,
  CONFLICT_MESSAGE,
  FORBIDDEN_MESSAGE,
} = require("../../utils/errors");
const bcrypt = require("bcrypt");
const User = require("../../models/user");
const { generateToken } = require("../../utils/auth");

exports.createUser = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError")
      throw new BadRequestError(BAD_REQUEST_MESSAGE);
    if (err.code === 11000) throw new ConflictError(CONFLICT_MESSAGE);
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new NotFoundError(NOT_FOUND_MESSAGE);
    res.json(user);
  } catch (err) {
    console.error(err);
    if (err.message.includes("Cast to ObjectId failed"))
      throw new BadRequestError(BAD_REQUEST_MESSAGE);
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  if (req.user._id !== req.params.id)
    throw new ForbiddenError(FORBIDDEN_MESSAGE);
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) throw new NotFoundError(NOT_FOUND_MESSAGE);

    res.json(updatedUser);
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

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username }).select("+password");
    if (!user) throw new UnauthorizedError(UNAUTHORIZED_MESSAGE);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedError(UNAUTHORIZED_MESSAGE);

    const token = generateToken(user._id);

    const userSafe = user.toObject();
    delete userSafe.password;

    res.json({
      message: "Login successful",
      token,
      user: userSafe,
    });
  } catch (err) {
    console.error("debug", err);
    console.error("debug", err.name);
    console.error("debug", err.message);
    next(err);
  }
};
