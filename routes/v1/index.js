const router = require("express").Router();
const { protect } = require("../../middlewares/auth");

const userRoutes = require("./userRoutes");
const moduleRoutes = require("./moduleRoutes");
const { createUser, login } = require("../../controllers/v1/userController");

// Mount the routes
router.use("/users", userRoutes);
router.use("/modules", moduleRoutes);
router.post("/register", createUser);
router.post("/login", login);
router.get("/me", protect, (req, res) => {
  res.send("auth test protect");
  res.send(req.body);
});

module.exports = router;
