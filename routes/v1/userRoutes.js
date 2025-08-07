const router = require("express").Router();

const {
  createUser,
  getUserById,
  updateUser,
} = require("../../controllers/v1/userController");

const { validateCreateUser } = require("../../validations/userValidation");

//current endpoint /api/v1/users
router.get("/", (req, res) => {
  res.send("Hello World!");
  console.log("Hello World! console");
});
router.post("/", validateCreateUser, createUser);
router.get("/:id", getUserById);
router.put("/:id", updateUser);

module.exports = router;
