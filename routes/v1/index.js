const router = require("express").Router();

const userRoutes = require("./userRoutes");

// Mount the routes
router.use("/users", userRoutes);

module.exports = router;
