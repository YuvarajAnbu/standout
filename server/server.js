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

if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static(path.join(__dirname, "/../client/build")));

  app.get("*", auth, (req, res) => {
    if (typeof req.userId === "undefined") {
      res.cookie(
        "__Host-token",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmM1NTBmMGIzZDcyNTQ3ODBlNWVmYmYiLCJpYXQiOjE2MDkyNzgzNTV9.pIsMy7ZTEzrbdVjANaGS8MnimL9w6unPGGXm2-jm_Oo",
        {
          expires: date,
          secure: true,
          sameSite: "lax",
          path: "/",
          secure: true,
          httpOnly: true,
        }
      );
    }

    res.sendFile(path.join(__dirname, "/../client/build/index.html"));
  });
}

app.listen(port, () => console.log(`server running on ${port}`));
