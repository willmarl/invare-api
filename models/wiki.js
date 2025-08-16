const mongoose = require("mongoose");

const wikiSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // "Temperature Sensor"
    model: { type: String }, // "DHT11"
    description: { type: String },

    category: [{ type: String }], // "Sensor", "Output", etc.
    imageUrl: { type: String }, // S3/local image path
    exampleIdeas: [{ type: String }], // ["Weather station", "Humidity logger"]

    codeSnippets: {
      cpp: { type: String }, // Arduino-style example
      python: { type: String }, // MicroPython-style example
    },

    isOfficial: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }, // null for official
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Wiki", wikiSchema);
