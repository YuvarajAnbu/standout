const express = require("express");
const User = require("../models/User");
const Order = require("../models/Order");
const auth = require("./middleWares/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const hashedpassword = await bcrypt.hash(password, 8);

    const user = new User({
      name: `${firstName} ${lastName}`,
      email,
      password: hashedpassword,
    });

    await user.save();

    const token = await user.generateToken();

    const date = new Date();
    const nextYear = date.getFullYear() + 1;
    date.setFullYear(nextYear);

    res.cookie("__Host-token", token, {
      expires: date,
      secure: true,
      sameSite: "lax",
      path: "/",
      secure: true,
      httpOnly: true,
    });

    res.status(201).send({
      user: {
        name: user.name,
        email: user.email,
        addresses: user.addresses,
        type: user.type,
      },
    });
  } catch (err) {
    if (typeof err.keyPattern !== "undefined") {
      if (err.keyPattern.email === 1) {
        res.sendStatus(203);
      } else {
        res.sendStatus(500);
      }
    } else {
      res.sendStatus(500);
    }
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne(
      { email },
      "_id name email addresses password tokens type"
    );
    if (!user) {
      throw new Error();
    }
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      throw new Error();
    }
    const token = await user.generateToken();

    const date = new Date();
    const nextYear = date.getFullYear() + 1;
    date.setFullYear(nextYear);

    res.cookie("__Host-token", token, {
      expires: date,
      secure: true,
      sameSite: "lax",
      path: "/",
      secure: true,
      httpOnly: true,
    });
    res.status(200).send({
      user: {
        name: user.name,
        email: user.email,
        addresses: user.addresses,
        type: user.type,
      },
    });
  } catch (err) {
    res.sendStatus(400);
  }
});

router.get("/authenticate", auth, async (req, res) => {
  try {
    // if (typeof req.userId === "undefined") {
    //   throw new Error();
    // }
    let user;
    if (typeof req.userId === "undefined") {
      const date = new Date();
      const nextYear = date.getFullYear() + 1;
      date.setFullYear(nextYear);

      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmM1NTBmMGIzZDcyNTQ3ODBlNWVmYmYiLCJpYXQiOjE2MDkyNzgzNTV9.pIsMy7ZTEzrbdVjANaGS8MnimL9w6unPGGXm2-jm_Oo";
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);
      user = await User.findOne(
        { _id: decoded._id, tokens: { $in: [token] } },
        "_id name email addresses type"
      );

      res.cookie("__Host-token", token, {
        expires: date,
        secure: true,
        sameSite: "lax",
        path: "/",
        secure: true,
        httpOnly: true,
      });
    } else {
      user = await User.findOne(
        { _id: req.userId, tokens: { $in: [req.token] } },
        "_id name email addresses type"
      );
    }

    if (!user) {
      throw new Error();
    }
    res.status(200).send({
      user: {
        name: user.name,
        email: user.email,
        addresses: user.addresses,
        type: user.type,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(200).send({ user: {} });
  }
});

router.put("/logout", auth, async (req, res) => {
  try {
    if (typeof req.userId === "undefined") {
      throw new Error();
    }

    // await User.updateOne({ _id: req.userId }, { $pull: { tokens: req.token } });

    res.clearCookie("__Host-token", {
      secure: true,
      sameSite: "lax",
      path: "/",
      secure: true,
      httpOnly: true,
    });

    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(400);
  }
});

router.put("/logout-all", auth, async (req, res) => {
  try {
    if (typeof req.userId === "undefined") {
      throw new Error();
    }

    // await User.updateOne({ _id: req.userId }, { tokens: [] });

    res.clearCookie("__Host-token", {
      secure: true,
      sameSite: "lax",
      path: "/",
      secure: true,
      httpOnly: true,
    });

    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(400);
  }
});

router.get("/is-admin", auth, async (req, res) => {
  try {
    if (typeof req.userId === "undefined") {
      throw new Error();
    }
    const user = await User.findById(req.userId, "type");

    if (typeof user.type === "undefined") {
      throw new Error();
    }

    res.send(user.type);
  } catch (err) {
    res.sendStatus(400);
  }
});

router.put("/update", auth, async (req, res) => {
  try {
    const data = req.body.data;

    if (typeof req.userId === "undefined") {
      throw new Error();
    }

    if (req.userId === "5fc550f0b3d7254780e5efbf") {
      throw new Error();
    }

    if (typeof data.password !== "undefined") {
      data.password = await bcrypt.hash(data.password, 8);
    }

    await User.updateOne({ _id: req.userId }, data);

    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(400);
  }
});

router.get("/check-user", auth, async (req, res) => {
  try {
    const password = req.query.password;

    if (typeof req.userId === "undefined") {
      throw new Error();
    }
    const user = await User.findById(req.userId, "password");

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      throw new Error();
    }

    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(400);
  }
});

router.get("/orders", auth, async (req, res) => {
  try {
    if (typeof req.userId === "undefined") {
      throw new Error();
    }
    const user = await User.findById(req.userId, "orders");

    const orders = await Order.find(
      { _id: user.orders },
      "items delivered amount shippingAddress date",
      { sort: "-date" }
    );

    res.send(orders);
  } catch (err) {
    res.sendStatus(400);
  }
});

router.get("/guest-order", async (req, res) => {
  const { orderId } = req.query;

  try {
    const order = await Order.findById(
      orderId,
      "items delivered amount shippingAddress date"
    );

    res.send(order);
  } catch (err) {
    res.sendStatus(400);
  }
});

router.get("/delivered/:id", async (req, res) => {
  try {
    const orders = await Order.findById(req.params.id, "delivered");
    res.send(orders);
  } catch (err) {
    res.sendStatus(400);
  }
});

router.put("/order", auth, async (req, res) => {
  try {
    if (typeof req.userId === "undefined") {
      throw new Error();
    }

    const user = await User.findById(req.userId, "type");
    if (user.type !== "admin") {
      throw new Error();
    }

    await Order.updateOne(
      { _id: req.body.order._id },
      { delivered: req.body.order.delivered }
    );
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(400);
  }
});

module.exports = router;
