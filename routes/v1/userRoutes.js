const router = require("express").Router();

const {
  createUser,
  getUserById,
  updateUser,
} = require("../../controllers/v1/userController");

const { validateCreateUser } = require("../../validations/userValidation");

//current endpoint /v1/users
router.post("/", validateCreateUser, createUser);
router.get("/:id", getUserById);
router.put("/:id", updateUser);

module.exports = router;
