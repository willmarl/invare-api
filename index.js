require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const cors = require("cors");
const helmet = require("helmet");
const errorHandler = require("./middlewares/error-handler");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const apiLimiter = require("./middlewares/rate-limiter");
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
    origin: function (origin, callback) {
      // Allow requests with no origin (like curl or Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(`blocked CORS request from: ${origin}`);
        callback(new Error("not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(requestLogger);
app.use(apiLimiter);
app.use("/", mainRouter);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
