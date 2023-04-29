const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log(err);
    console.log("failed to connect db");
  });
