const router = require("express").Router();
const { protect } = require("../../middlewares/auth");

const userRoutes = require("./userRoutes");
const { createUser, login } = require("../../controllers/v1/userController");

// Mount the routes
router.use("/users", userRoutes);
router.post("/register", createUser);
router.post("/login", login);
router.get("/me", protect, (req, res) => {
  res.send("auth test protect");
  res.send(req.body);
});

module.exports = router;
