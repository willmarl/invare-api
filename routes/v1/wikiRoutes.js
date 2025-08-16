const router = require("express").Router();
const {
  createWiki,
  getAllWikis,
  getWikiById,
  updateWiki,
  deleteWiki,
} = require("../../controllers/v1/wikiController");
const Wiki = require("../../models/wiki");
const { protect } = require("../../middlewares/auth");
const ownershipCheck = require("../../middlewares/ownership");

// current endpoint /v1/wikis
router.post("/", protect, createWiki);
router.get("/", getAllWikis);
router.get("/:id", getWikiById);
router.put("/:id", protect, ownershipCheck(Wiki, "owner"), updateWiki);
router.delete("/:id", protect, ownershipCheck(Wiki, "owner"), deleteWiki);

module.exports = router;
