const router = require("express").Router();
const {
  createModule,
  getModules,
  getModuleById,
  getModulesByOwner,
  getModulesByUsername,
  updateModule,
  deleteModule,
  getModuleBySlug,
  getModuleByUserAndSlug,
  updateModuleByUserAndSlug,
  deleteModuleByUserAndSlug,
} = require("../../controllers/v1/moduleController");
const Module = require("../../models/module");
const {
  validateCreateModule,
  validateUpdateModule,
} = require("../../validations/moduleValidation");
const { protect } = require("../../middlewares/auth");
const upload = require("../../middlewares/upload");
const ownershipCheck = require("../../middlewares/ownership");
const formDataParser = require("../../middlewares/formDataParser");
const loadUserByUsername = require("../../middlewares/loadUserByUsername");

// current endpoint /v1/modules
router.post(
  "/",
  protect,
  upload.single("file"),
  formDataParser,
  validateCreateModule,
  createModule,
  getModuleByUserAndSlug,
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

//slug testing
router.get("/slug/:slug", getModuleBySlug);

// wiki slug section
router.param("username", loadUserByUsername("wikiUser"));
router.get("/wiki/:username", getModulesByUsername);
router.get("/wiki/:username/:slug", getModuleByUserAndSlug);
router.put(
  "/wiki/:username/:slug",
  protect,
  ownershipCheck(Module, "owner", "slug", "slug"),
  upload.single("file"),
  formDataParser,
  updateModuleByUserAndSlug,
);
router.delete(
  "/wiki/:username/:slug",
  protect,
  ownershipCheck(Module, "owner", "slug", "slug"),
  deleteModuleByUserAndSlug,
);
module.exports = router;
