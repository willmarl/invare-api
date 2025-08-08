const router = require("express").Router();
const {
  createModule,
  getModules,
  getModuleById,
  getModulesByOwner,
  updateModule,
  deleteModule,
} = require("../../controllers/v1/moduleController");

const {
  validateCreateModule,
  validateUpdateModule,
} = require("../../validations/moduleValidation");
const { protect } = require("../../middlewares/auth");
const upload = require("../../middlewares/upload");

//current endpoint /v1/modules
router.post(
  "/",
  protect,
  validateCreateModule,
  upload.single("file"),
  createModule,
);
router.get("/", getModules);
router.get("/:moduleId", getModuleById);
router.get("/by/:ownerId", getModulesByOwner);
router.put(
  "/:id",
  protect,
  validateUpdateModule,
  upload.single("file"),
  updateModule,
);
router.delete("/:id", protect, deleteModule);

module.exports = router;
