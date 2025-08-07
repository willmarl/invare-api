const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 256,
    unique: true,
  },
  description: {
    type: String,
    maxLength: 1024,
  },
  category: {
    type: String,
    maxLength: 64,
  },
  image: {
    url: String,
    key: String,
    mimeType: String,
    size: Number,
  },
});

module.exports = mongoose.model("Module", moduleSchema);
