const NotFoundError = require("../errors/NotFoundError");
const { NOT_FOUND_MESSAGE } = require("../utils/errors");
const router = require("express").Router();

const v1Router = require("./v1/index");

router.use("/v1", v1Router);

// 404 fallback
router.use((req, res) => {
  throw new NotFoundError(NOT_FOUND_MESSAGE);
});

module.exports = router;
