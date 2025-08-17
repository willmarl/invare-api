const bcrypt = require("bcrypt");
const NotFoundError = require("../../errors/NotFoundError");
const BadRequestError = require("../../errors/BadRequestError");
const UnauthorizedError = require("../../errors/UnauthorizedError");
const ConflictError = require("../../errors/ConflictError");
const ForbiddenError = require("../../errors/ForbiddenError");
const {
  BAD_REQUEST_MESSAGE,
  NOT_FOUND_MESSAGE,
  UNAUTHORIZED_MESSAGE,
  CONFLICT_MESSAGE,
  FORBIDDEN_MESSAGE,
} = require("../../utils/errors");
const User = require("../../models/user");
const { COOKIE_REFRESH_MAXAGE } = require("../../utils/config");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../../utils/auth");

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
    const user = await User.findById(req.user._id).select("+password");
    if (!user) throw new NotFoundError(NOT_FOUND_MESSAGE);

    // Update fields
    Object.entries(req.body).forEach(([key, value]) => {
      user[key] = value;
    });

    await user.save();
    const userObj = user.toObject();
    delete userObj.password;
    res.json(userObj);
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

exports.login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).select("+password");
  if (!user) throw new NotFoundError(NOT_FOUND_MESSAGE);

  if (user.role === "system") {
    throw new ForbiddenError(FORBIDDEN_MESSAGE);
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new UnauthorizedError(`${UNAUTHORIZED_MESSAGE}: Bad login`);

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // ✅ Set refresh token in HttpOnly cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: COOKIE_REFRESH_MAXAGE,
  });

  res.json({
    user: { id: user._id, username: user.username },
    accessToken,
  });
};

exports.refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) throw new UnauthorizedError(UNAUTHORIZED_MESSAGE);

  try {
    const payload = verifyRefreshToken(token);
    const user = await User.findById(payload.id);
    if (!user) throw new UnauthorizedError(UNAUTHORIZED_MESSAGE);

    // tokenVersion check
    if (payload.tokenVersion !== user.tokenVersion) {
      throw new ForbiddenError(FORBIDDEN_MESSAGE);
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Overwrite cookie with new refresh token
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: COOKIE_REFRESH_MAXAGE,
    });

    res.json({
      user: { id: user._id, username: user.username },
      accessToken: newAccessToken,
    });
  } catch (err) {
    console.error("Refresh failed:", err);
    throw new ForbiddenError(FORBIDDEN_MESSAGE);
  }
};

// auto login afer register. (optional)
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new BadRequestError(BAD_REQUEST_MESSAGE);
    }

    const existing = await User.findOne({ username });
    if (existing) {
      throw new ConflictError(CONFLICT_MESSAGE);
    }

    const newUser = await User.create({ username, password });

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: COOKIE_REFRESH_MAXAGE,
    });

    res.status(201).json({
      user: {
        id: newUser._id,
        username: newUser.username,
      },
      accessToken,
    });
  } catch (err) {
    console.error("Register error:", err);
    if (err.code === 11000) {
      throw new ConflictError(CONFLICT_MESSAGE);
    }
    throw new BadRequestError(BAD_REQUEST_MESSAGE);
  }
};

exports.logout = async (req, res) => {
  const userId = req.user._id; // must be authenticated
  await User.findByIdAndUpdate(userId, {
    $inc: { tokenVersion: 1 }, // invalidate all existing refresh tokens
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  res.json({ message: "Logged out" });
};
