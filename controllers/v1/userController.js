const NotFoundError = require("../../errors/NotFoundError");
const InternalServerError = require("../../errors/InternalServerError");
const BadRequestError = require("../../errors/BadRequestError");
const {
  BAD_REQUEST_MESSAGE,
  INTERNAL_SERVER_ERROR_MESSAGE,
  NOT_FOUND_MESSAGE,
} = require("../../utils/errors");
const User = require("../../models/user");

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
