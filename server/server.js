if (!process.env.PORT) {
  require("dotenv").config();
}
require("./config/mongoose");
const express = require("express");
const userRouter = require("./routes/user");
const productRouter = require("./routes/product");
const paymentRouter = require("./routes/payment");
const path = require("path");
const auth = require("./routes/middleWares/auth");

const app = express();

const port = process.env.PORT || 3001;

//convert incoming objects to json and changing default limit for incoming json
app.use(express.json({ limit: "500mb" }));

// body-parser and changing default limit for incoming json
app.use(express.urlencoded({ extended: true, limit: "500mb" }));

app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/payment", paymentRouter);

//use this only in production and disable it in client side

// if (process.env.NODE_ENV === "production") {
// Set static folder
app.use(express.static(path.join(__dirname, "/../client/build")));

app.get("*", auth, (req, res) => {
  res.sendFile(path.join(__dirname, "/../client/build/index.html"));
});
// }

app.listen(port, () => console.log(`server running on ${port}`));
