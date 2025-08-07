const NotFoundError = require("../../errors/NotFoundError");
const InternalServerError = require("../../errors/InternalServerError");
const BadRequestError = require("../../errors/BadRequestError");
const UnauthorizedError = require("../../errors/UnauthorizedError");
const {
  BAD_REQUEST_MESSAGE,
  INTERNAL_SERVER_ERROR_MESSAGE,
  NOT_FOUND_MESSAGE,
  UNAUTHORIZED_MESSAGE,
} = require("../../utils/errors");
const bcrypt = require("bcrypt");
const User = require("../../models/user");
const { generateToken } = require("../../utils/auth");

exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    console.log(err);
    throw new BadRequestError(BAD_REQUEST_MESSAGE);
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new NotFoundError(NOT_FOUND_MESSAGE);
    res.json(user);
  } catch (err) {
    console.log(err);
    throw new InternalServerError(INTERNAL_SERVER_ERROR_MESSAGE);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) throw new NotFoundError(NOT_FOUND_MESSAGE);

    res.json(updatedUser);
  } catch (err) {
    console.log(err);
    throw new BadRequestError(BAD_REQUEST_MESSAGE);
  }
};

exports.login = async (req, res) => {
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
    throw new InternalServerError(INTERNAL_SERVER_ERROR_MESSAGE);
  }
};
