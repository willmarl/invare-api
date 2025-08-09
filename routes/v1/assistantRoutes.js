const router = require("express").Router();
const { handleChat } = require("../../controllers/v1/assistantController");
const { protect } = require("../../middlewares/auth");
const { assistantLimiter } = require("../../middlewares/rate-limiter");
const { validateChat } = require("../../validations/assistantValidation");

//current endpoint /v1/chat
router.post("/", protect, assistantLimiter, validateChat, handleChat);

module.exports = router;
