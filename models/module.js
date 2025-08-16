const { required } = require("joi");
const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 256,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    model: {
      type: String,
      maxLength: 256,
    },
    description: {
      type: String,
      maxLength: 1024,
    },
    category: {
      type: [String],
      maxLength: 64,
      index: true,
    },
    image: {
      url: String,
      key: String,
      mimeType: String,
      size: Number,
    },
    exampleIdeas: {
      type: [String],
      maxLength: 256,
    },

    codeSnippets: {
      cpp: {
        type: String,
        maxLength: 4096,
      },
      python: {
        type: String,
        maxLength: 4096,
      },
    },

    isOfficial: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Module", moduleSchema);
