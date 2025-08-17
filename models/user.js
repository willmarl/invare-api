const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 1,
    maxLength: 30,
    match: /^[a-z0-9_]+$/i,
  },
  password: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 256,
    select: false,
  },
  role: {
    type: String,
    enum: ["user", "admin", "system"],
    default: "user",
  },
  tokenVersion: { type: Number, default: 0 },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  return next();
});

module.exports = mongoose.model("User", userSchema);
