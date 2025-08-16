const { required } = require("joi");
const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 1,
      maxLength: 256,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    slug: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    model: {
      type: String,
      maxLength: 256,
      default: "",
    },
    description: {
      type: String,
      default: "",
      maxLength: 1024,
    },
    category: {
      type: [String],
      maxLength: 64,
      trim: true,
      index: true,
      default: [],
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
      default: [],
    },

    codeSnippets: {
      cpp: {
        type: String,
        maxLength: 4096,
        default: "",
      },
      python: {
        type: String,
        maxLength: 4096,
        default: "",
      },
    },

    isOfficial: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Enforce uniqueness of slug PER USER
moduleSchema.index({ owner: 1, slug: 1 }, { unique: true });

module.exports = mongoose.model("Module", moduleSchema);
