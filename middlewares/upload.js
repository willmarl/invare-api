const multer = require("multer");
const path = require("path");
const { BAD_REQUEST } = require("../utils/errors");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads", "temp"));
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    const error = new Error("Only image uploads allowed");
    error.statusCode = BAD_REQUEST;
    cb(error, false);
  }
};

module.exports = multer({ storage, fileFilter });
