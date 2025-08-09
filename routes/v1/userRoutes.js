const router = require("express").Router();

const {
  getCurrentUser,
  getUserById,
  updateUser,
} = require("../../controllers/v1/userController");

const { validateUpdateUser } = require("../../validations/userValidation");
const { protect } = require("../../middlewares/auth");

//current endpoint /v1/users
router.get("/me", protect, getCurrentUser);
router.get("/:id", getUserById);
router.put("/:id", protect, validateUpdateUser, updateUser);

module.exports = router;
