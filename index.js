const express = require("express");
const mongoose = require("mongoose");

const app = express();
const { PORT = 3000 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/invare-db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
