const router = require("express").Router();
const { protect } = require("../../middlewares/auth");

const userRoutes = require("./userRoutes");
const moduleRoutes = require("./moduleRoutes");
const inventoryRoutes = require("./inventoryRoutes");
const { createUser, login } = require("../../controllers/v1/userController");
const { validateCreateUser } = require("../../validations/userValidation");

router.use("/users", userRoutes);
router.use("/modules", moduleRoutes);
router.use("/inventories", inventoryRoutes);
router.post("/register", validateCreateUser, createUser);
router.post("/login", login);
router.get("/me", protect, (req, res) => {
  res.send("auth test protect");
  res.send(req.body);
});

module.exports = router;
