const router = require("express").Router();
const NotFoundError = require("../errors/NotFoundError");
const { NOT_FOUND_MESSAGE } = require("../utils/errors");

const v1Router = require("./v1/index");

router.use("/v1", v1Router);

// 404 fallback
router.use(() => {
  throw new NotFoundError(NOT_FOUND_MESSAGE);
});

module.exports = router;
