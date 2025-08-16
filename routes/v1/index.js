const router = require("express").Router();

const userRoutes = require("./userRoutes");
const moduleRoutes = require("./moduleRoutes");
const inventoryRoutes = require("./inventoryRoutes");
const assistantRoutes = require("./assistantRoutes");
const wikiRoutes = require("./wikiRoutes");
const {
  register,
  login,
  logout,
} = require("../../controllers/v1/userController");
const { protect } = require("../../middlewares/auth");
const { validateCreateUser } = require("../../validations/userValidation");

router.use("/users", userRoutes);
router.use("/modules", moduleRoutes);
router.use("/inventories", inventoryRoutes);
router.use("/assistant", assistantRoutes);
router.use("/wikis", wikiRoutes);
router.post("/register", validateCreateUser, register);
router.post("/login", login);
router.post("/logout", protect, logout);

module.exports = router;
