const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Module",
    required: true,
    unique: true,
  },
  quantity: {
    type: Number,
    minLength: 0,
    maxLength: 9999,
    default: 0,
  },
});

module.exports = mongoose.model("Inventory", inventorySchema);
