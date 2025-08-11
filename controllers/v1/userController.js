const bcrypt = require("bcrypt");
const NotFoundError = require("../../errors/NotFoundError");
const BadRequestError = require("../../errors/BadRequestError");
const UnauthorizedError = require("../../errors/UnauthorizedError");
const ConflictError = require("../../errors/ConflictError");
const {
  BAD_REQUEST_MESSAGE,
  NOT_FOUND_MESSAGE,
  UNAUTHORIZED_MESSAGE,
  CONFLICT_MESSAGE,
} = require("../../utils/errors");
const User = require("../../models/user");
const { generateToken } = require("../../utils/auth");

exports.createUser = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    const userWithoutPassword = { ...newUser.toObject() };
    delete userWithoutPassword.password;
    res.status(201).json(userWithoutPassword);
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError")
      throw new BadRequestError(BAD_REQUEST_MESSAGE);
    if (err.code === 11000) throw new ConflictError(CONFLICT_MESSAGE);
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  let user;
  try {
    if (req.params.id === "me") {
      user = await User.findById(req.user._id);
    } else {
      user = await User.findById(req.params.id);
    }
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
  try {
    const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");

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
    next(err);
  }
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user._id).select("-password");

    if (!currentUser) throw new NotFoundError(NOT_FOUND_MESSAGE);

    res.json(currentUser);
  } catch (err) {
    console.error(err);
    next(err);
  }
};
