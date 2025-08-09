const router = require("express").Router();

const {
  createUser,
  getUserById,
  updateUser,
} = require("../../controllers/v1/userController");

const {
  validateCreateUser,
  validateUpdateUser,
} = require("../../validations/userValidation");
const { protect } = require("../../middlewares/auth");

//current endpoint /v1/users
router.post("/", validateCreateUser, createUser);
router.get("/:id", getUserById);
router.put("/:id", protect, validateUpdateUser, updateUser);

module.exports = router;
