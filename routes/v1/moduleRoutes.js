const router = require("express").Router();
const {
  createModule,
  getModules,
  getModuleById,
  getModulesByOwner,
  updateModule,
  deleteModule,
} = require("../../controllers/v1/moduleController");
const Module = require("../../models/module");
const {
  validateCreateModule,
  validateUpdateModule,
} = require("../../validations/moduleValidation");
const { protect } = require("../../middlewares/auth");
const upload = require("../../middlewares/upload");
const ownershipCheck = require("../../middlewares/ownership");

// current endpoint /v1/modules
router.post(
  "/",
  protect,
  upload.single("file"),
  validateCreateModule,
  createModule,
);
router.get("/", getModules);
router.get("/:moduleId", getModuleById);
router.get("/by/:ownerId", getModulesByOwner);
router.put(
  "/:id",
  protect,
  ownershipCheck(Module, "owner"),
  upload.single("file"),
  validateUpdateModule,
  updateModule,
);
router.delete("/:id", protect, ownershipCheck(Module, "owner"), deleteModule);

module.exports = router;
