require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const { errors } = require("celebrate");
const fs = require("fs");
const errorHandler = require("./middlewares/error-handler");
const mainRouter = require("./routes/index");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const { apiLimiter } = require("./middlewares/rate-limiter");

// need uploads/temp/ folder to exist for multer to work
const requiredDirs = [
  path.join(__dirname, "uploads"),
  path.join(__dirname, "uploads", "temp"),
];

requiredDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created missing folder: ${dir}`);
  }
});

const allowedOrigins = [
  process.env.LOCAL_ORIGIN,
  ...process.env.PROD_ORIGINS.split(","),
];

const app = express();
const { PORT = 3000, MONGO_URI = "mongodb://localhost:27017/invare-db" } =
  process.env;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(
      `Connected to DB. Running on domains ${allowedOrigins.slice(1)}`,
    );
  })
  .catch(console.error);

app.use(express.json());
app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      // Allow requests with no origin (like curl or Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.log(`blocked CORS request from: ${origin}`);
      return callback(new Error("not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(cookieParser());

app.use(requestLogger);
app.use(apiLimiter);
app.use("/static", express.static(path.join(__dirname, "uploads")));
app.use("/", mainRouter);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
