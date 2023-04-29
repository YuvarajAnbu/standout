const express = require("express");
const gateway = require("../config/braintree");
const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
const auth = require("./middleWares/auth");

const router = express.Router();

router.get("/client_token", auth, (req, res) => {
  gateway.clientToken.generate({}, function (err, response) {
    if (err) {
      res.sendStatus(503);
    } else {
      res.send(response.clientToken);
    }
  });
});

router.post("/checkout", auth, async (req, res) => {
  try {
    const { payload, cart, billingDetails } = req.body;

    let subTotal = 0;

    cart.forEach((el) => {
      subTotal = subTotal + Number(el.price * el.quantity);
    });

    const opt = {
      amount: `${subTotal / 100}`,
      paymentMethodNonce: payload.nonce,
      options: {
        submitForSettlement: true,
      },
      customer: billingDetails.user,
      shipping: { ...billingDetails.address.shipping, countryCodeAlpha2: "US" },
    };

    if (typeof billingDetails.address.billing != "undefined") {
      opt.billing = {
        ...billingDetails.address.billing,
        countryCodeAlpha2: "US",
      };
    } else {
      opt.billing = {
        ...billingDetails.address.shipping,
        countryCodeAlpha2: "US",
      };
    }

    const transaction = await gateway.transaction.sale(opt);

    if (!transaction.success) {
      throw new Error();
    }
    // const order = new Order({
    //   items: cart,
    //   transactionId: transaction.transaction.id,
    //   customer: transaction.transaction.customer,
    //   amount: transaction.transaction.amount,
    //   shippingAddress: transaction.transaction.shipping,
    //   billingAddress: transaction.transaction.billing,
    // });

    // await order.save();
    // const date = new Date();

    // const month = Number(`${date.getFullYear()}${date.getMonth() + 1}`);

    // const ids = [];

    // for (var i = 0; i < cart.length; i++) {
    //   if (!ids.includes(cart[i]._id)) {
    //     ids.push(cart[i]._id);
    //   }
    // }

    // for (let i = 0; i < ids.length; i++) {
    //   const product = await Product.findById(ids[i], "salesPerMonth sales");

    //   product.sales = product.sales + 1;

    //   if (product.salesPerMonth.some((el) => el.month === month)) {
    //     product.salesPerMonth.forEach((el) => {
    //       if (el.month === month) {
    //         el.sales = el.sales + 1;
    //       }
    //     });
    //   } else {
    //     product.salesPerMonth.push({ sales: 1, month });
    //   }

    //   await product.save();
    // }

    // if (typeof req.userId !== "undefined") {
    //   await User.updateOne(
    //     { _id: req.userId },
    //     { $push: { orders: order._id } }
    //   );
    // }

    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
  }
});

router.post("/paypal", auth, async (req, res) => {
  const { payload, cart } = req.body;
  try {
    let subTotal = 0;

    cart.forEach((el) => {
      subTotal = subTotal + Number(el.price * el.quantity);
    });

    const address = {
      firstName: payload.details.firstName,
      lastName: payload.details.lastName,
      locality: payload.details.shippingAddress.city,
      postalCode: payload.details.shippingAddress.postalCode,
      region: payload.details.shippingAddress.state,
      streetAddress: payload.details.shippingAddress.line1,
    };

    if (payload.details.shippingAddress.line2) {
      address.extendedAddress = payload.details.shippingAddress.line2;
    }

    const transaction = await gateway.transaction.sale({
      amount: `${Number(subTotal / 100) + Number((subTotal * 2) / 10000)}`,
      paymentMethodNonce: payload.nonce,
      options: {
        submitForSettlement: true,
      },
      shipping: { ...address },
      customer: {
        firstName: payload.details.firstName,
        lastName: payload.details.lastName,
        email: payload.details.email,
      },
    });

    if (!transaction.success) {
      throw new Error();
    }
    const order = {
      customer: transaction.transaction.customer,
      amount: transaction.transaction.amount,
      shippingAddress: transaction.transaction.shipping,
      billingAddress: transaction.transaction.shipping,
    };

    // const order = new Order({
    //   items: cart,
    //   transactionId: transaction.transaction.id,
    //   customer: transaction.transaction.customer,
    //   amount: transaction.transaction.amount,
    //   shippingAddress: transaction.transaction.shipping,
    //   billingAddress: transaction.transaction.billing,
    // });

    // await order.save();
    // const date = new Date();

    // const month = Number(`${date.getFullYear()}${date.getMonth() + 1}`);

    // const ids = [];

    // for (var i = 0; i < cart.length; i++) {
    //   if (!ids.includes(cart[i]._id)) {
    //     ids.push(cart[i]._id);
    //   }
    // }

    // for (let i = 0; i < ids.length; i++) {
    //   const product = await Product.findById(ids[i], "salesPerMonth sales");

    //   product.sales = product.sales + 1;

    //   if (product.salesPerMonth.some((el) => el.month === month)) {
    //     product.salesPerMonth.forEach((el) => {
    //       if (el.month === month) {
    //         el.sales = el.sales + 1;
    //       }
    //     });
    //   } else {
    //     product.salesPerMonth.push({ sales: 1, month });
    //   }

    //   await product.save();
    // }

    // if (typeof req.userId !== "undefined") {
    //   await User.updateOne(
    //     { _id: req.userId },
    //     { $push: { orders: order._id } }
    //   );
    // }

    res.send({ order: order });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// router.delete("/return", auth, async (req, res) => {
//   try {
//     const { orderId } = req.query;

//     const { transactionId } = await Order.findById(orderId, "transactionId");

//     const refund = await gateway.transaction.refund(transactionId);

//     if (!refund.success) {
//       throw new Error();
//     }

//     await Order.findByIdAndDelete(orderId);

//     if (req.userId !== "undefined") {
//       await User.updateOne({ _id: req.userId }, { $pull: { orders: orderId } });
//     }

//     res.send("refunded");
//   } catch (err) {
//     res.sendStatus(400);
//   }
// });

module.exports = router;
