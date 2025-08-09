const router = require("express").Router();

const {
  createInventory,
  getInventoryById,
  getInventoryByUser,
  updateInventory,
  deleteInventory,
} = require("../../controllers/v1/inventoryController");

const {
  validateUpdateInventory,
  validateCreateInventory,
} = require("../../validations/inventoryValidaiton");
const { protect } = require("../../middlewares/auth");
const ownershipCheck = require("../../middlewares/ownership");
const Inventory = require("../../models/inventory");

// current endpoint /v1/inventories
router.post("/", protect, validateCreateInventory, createInventory);
router.get("/:id", protect, getInventoryById);
router.get("/by/:userId", protect, getInventoryByUser);
router.put(
  "/:id",
  protect,
  validateUpdateInventory,
  ownershipCheck(Inventory, "userId"),
  updateInventory,
);
router.delete(
  "/:id",
  protect,
  ownershipCheck(Inventory, "userId"),
  deleteInventory,
);

module.exports = router;
