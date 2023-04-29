const express = require("express");
const cloudinary = require("cloudinary").v2;
const mongoose = require("mongoose");
const Product = require("../models/Product");
const User = require("../models/User");
const Order = require("../models/Order");
const auth = require("./middleWares/auth");
require("../config/cloudinary");

const router = express.Router();

// router.post("/upload", auth, async (req, res) => {
//   try {
//     if (typeof req.userId === "undefined") {
//       throw new Error();
//     }

//     const user = await User.findById(req.userId, "type");
//     if (user.type !== "admin") {
//       throw new Error();
//     }

//     const { name, price, catagory, type, stock } = req.body.data;
//     const imagesUrl = Object.values(req.body.images);

//     const cents = Math.round(price * 100);

//     const createdAt = `${new Date().getTime()}`;

//     const product = {
//       name,
//       price: cents,
//       catagory,
//       type,
//       createdAt,
//     };

//     for (var i = 0; i < stock.length; i++) {
//       if (typeof imagesUrl[i] === "undefined") {
//         throw new Error();
//       }

//       const imageLinks = await Promise.all(
//         imagesUrl[i].map(async (url) => {
//           const image = await cloudinary.uploader.upload(url, {
//             upload_preset: "ml_default",
//           });
//           return image.secure_url;
//         })
//       );

//       product.stock.push({
//         images: imagesUrl[i],
//         color: stock[i].color,
//         sizeRemaining: stock[i].sizeRemaining.map((e) => {
//           return { size: e.size, remaining: e.remaining };
//         }),
//       });
//     }
//     await product.save();
//     res.status(201).send(product);
//   } catch (err) {
//     res.sendStatus(400);
//   }
// });

router.get("/best-seller", async (req, res) => {
  const { page, limit, ...query } = req.query;
  try {
    let obj = {};

    let sortObj = {};

    Object.keys(query).forEach((el) => {
      if (query[el] !== "") {
        if (el === "sort") {
          if (query[el] === "new") {
            sortObj.createdAt = -1;
          } else {
            sortObj.price = query[el];
          }
        } else if (el === "color") {
          obj.stock = { $all: [] };

          query[el].split(",").forEach((e) => {
            obj.stock.$all.push({ $elemMatch: { color: "#" + e } });
          });
        } else if (el === "size") {
          let size = query[el].split(",");

          if (typeof obj.stock !== "undefined") {
            obj.stock.$all.forEach((e) => {
              e.$elemMatch["sizeRemaining.size"] = { $all: size };
            });
          } else {
            obj["stock.sizeRemaining.size"] = { $all: size };
          }
        }
      }
    });

    const count = await Product.countDocuments({
      sales: { $gte: 1 },
      ...obj,
    });

    let products;

    if (Object.keys(sortObj).length < 1) {
      products = await Product.aggregate([
        {
          $match: {
            sales: { $gte: 1 },
            ...obj,
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            price: 1,
            stock: 1,
            averageRating: { $avg: "$reviews.rating" },
            totalRatings: { $size: "$reviews" },
            sales: 1,
          },
        },
      ])
        .skip((page - 1) * limit)
        .limit(limit * 1)
        .sort({ sales: -1 });
    } else {
      products = await Product.aggregate([
        {
          $match: {
            sales: { $gte: 1 },
            ...obj,
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            price: 1,
            stock: 1,
            createdAt: 1,
            averageRating: { $avg: "$reviews.rating" },
            totalRatings: { $size: "$reviews" },
            sales: 1,
          },
        },
      ])
        .skip((page - 1) * limit)
        .limit(limit * 1)
        .sort({ ...sortObj, sales: -1 });
    }

    res.send({ products, count });
  } catch (err) {
    res.sendStatus(500);
  }
});

router.get("/filter/best-seller", async (req, res) => {
  try {
    const query = req.query;
    let obj = {};

    Object.keys(query).forEach((el) => {
      if (query[el] !== "") {
        if (el === "color" && query.filter.includes("color")) {
          const color = query[el].split(",");
          obj.stock = { $elemMatch: { color: { $in: [] } } };

          color.forEach((e) => {
            obj.stock.$elemMatch.color.$in.push("#" + e);
          });
        } else if (el === "size" && query.filter.includes("size")) {
          let size = query[el].split(",");
          if (typeof obj.stock === "undefined") {
            obj.stock = { $elemMatch: {} };
          }
          obj.stock.$elemMatch["sizeRemaining.size"] = { $in: size };
        }
      }
    });

    let filter = {
      colors: [],
      sizes: [],
    };

    const productsStock = await Product.find(
      { sales: { $gte: 1 }, ...obj },
      "stock"
    );

    productsStock.forEach(({ stock }) => {
      stock.forEach((item) => {
        if (
          !query.filter.includes("color") ||
          (query.size === "" && query.filter.includes("size"))
        ) {
          if (!filter.colors.includes(item.color)) {
            filter.colors.push(item.color);
          }
        }
        if (
          !query.filter.includes("size") ||
          (query.color === "" && query.filter.includes("color"))
        ) {
          item.sizeRemaining.forEach(({ size }) => {
            if (!filter.sizes.includes(size)) {
              filter.sizes.push(size);
            }
          });
        }
      });
    });

    Object.keys(filter).forEach((el) => {
      if (filter[el].length < 1) {
        delete filter[el];
      }
    });

    res.send(filter);
  } catch (err) {
    res.sendStatus(400);
  }
});

router.get("/trending", async (req, res) => {
  const { page, limit, ...query } = req.query;

  try {
    const date = new Date("2020, 12, 15");
    const month = Number(`${date.getFullYear()}${date.getMonth() + 1}`);

    let obj = {};

    let sortObj = {};

    Object.keys(query).forEach((el) => {
      if (query[el] !== "") {
        if (el === "sort") {
          if (query[el] === "new") {
            sortObj.createdAt = -1;
          } else {
            sortObj.price = query[el];
          }
        } else if (el === "color") {
          obj.stock = { $all: [] };

          query[el].split(",").forEach((e) => {
            obj.stock.$all.push({ $elemMatch: { color: "#" + e } });
          });
        } else if (el === "size") {
          let size = query[el].split(",");

          if (typeof obj.stock !== "undefined") {
            obj.stock.$all.forEach((e) => {
              e.$elemMatch["sizeRemaining.size"] = { $all: size };
            });
          } else {
            obj["stock.sizeRemaining.size"] = { $all: size };
          }
        }
      }
    });

    const count = await Product.countDocuments({
      salesPerMonth: {
        $elemMatch: { month: month, sales: { $gte: 1 } },
      },
      ...obj,
    });

    let products;

    if (Object.keys(sortObj).length < 1) {
      products = await Product.aggregate([
        {
          $match: {
            salesPerMonth: { $elemMatch: { month: month, sales: { $gte: 1 } } },
            ...obj,
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            price: 1,
            stock: 1,
            averageRating: { $avg: "$reviews.rating" },
            totalRatings: { $size: "$reviews" },
            salesPerMonth: {
              $filter: {
                input: "$salesPerMonth",
                as: "preMonth",
                cond: {
                  $eq: ["$$preMonth.month", month],
                },
              },
            },
          },
        },
      ])
        .sort({
          "salesPerMonth.sales": -1,
        })
        .skip((page - 1) * limit)
        .limit(limit * 1);
    } else {
      products = await Product.aggregate([
        {
          $match: {
            salesPerMonth: { $elemMatch: { month: month, sales: { $gte: 1 } } },
            ...obj,
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            price: 1,
            stock: 1,
            createdAt: 1,
            averageRating: { $avg: "$reviews.rating" },
            totalRatings: { $size: "$reviews" },
            salesPerMonth: {
              $filter: {
                input: "$salesPerMonth",
                as: "preMonth",
                cond: {
                  $eq: ["$$preMonth.month", month],
                },
              },
            },
          },
        },
      ])
        .skip((page - 1) * limit)
        .limit(limit * 1)
        .sort({ ...sortObj, "salesPerMonth.sales": -1 });
    }

    res.send({ products, count });
  } catch (err) {
    res.sendStatus(500);
  }
});

router.get("/filter/trending", async (req, res) => {
  try {
    const query = req.query;
    let obj = {};

    Object.keys(query).forEach((el) => {
      if (query[el] !== "") {
        if (el === "color" && query.filter.includes("color")) {
          const color = query[el].split(",");
          obj.stock = { $elemMatch: { color: { $in: [] } } };

          color.forEach((e) => {
            obj.stock.$elemMatch.color.$in.push("#" + e);
          });
        } else if (el === "size" && query.filter.includes("size")) {
          let size = query[el].split(",");
          if (typeof obj.stock === "undefined") {
            obj.stock = { $elemMatch: {} };
          }
          obj.stock.$elemMatch["sizeRemaining.size"] = { $in: size };
        }
      }
    });

    let filter = {
      colors: [],
      sizes: [],
    };

    const date = new Date("2020, 12, 15");

    const month = Number(`${date.getFullYear()}${date.getMonth() + 1}`);

    const productsStock = await Product.aggregate([
      {
        $match: {
          salesPerMonth: { $elemMatch: { month: month, sales: { $gte: 1 } } },
          ...obj,
        },
      },
      {
        $project: {
          stock: 1,
        },
      },
    ]);

    productsStock.forEach(({ stock }) => {
      stock.forEach((item) => {
        if (
          !query.filter.includes("color") ||
          (query.size === "" && query.filter.includes("size"))
        ) {
          if (!filter.colors.includes(item.color)) {
            filter.colors.push(item.color);
          }
        }
        if (
          !query.filter.includes("size") ||
          (query.color === "" && query.filter.includes("color"))
        ) {
          item.sizeRemaining.forEach(({ size }) => {
            if (!filter.sizes.includes(size)) {
              filter.sizes.push(size);
            }
          });
        }
      });
    });

    Object.keys(filter).forEach((el) => {
      if (filter[el].length < 1) {
        delete filter[el];
      }
    });

    res.send(filter);
  } catch (err) {
    res.sendStatus(400);
  }
});

router.get("/reviews", auth, async (req, res) => {
  try {
    const { productId, limit, page } = req.query;

    let reviews;
    let purchased = false;

    let user;

    if (typeof req.userId !== "undefined") {
      user = await User.findById(req.userId, "orders");
    }

    if (Number(page) === 0 && user) {
      for (var i = 0; i < user.orders.length; i++) {
        const items = await Order.find(
          {
            _id: user.orders[i],
            "items._id": productId,
          },
          "date"
        );
        if (items.length >= 1) {
          purchased = true;
          break;
        }
      }

      reviews = await Product.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(productId) } },
        {
          $project: {
            _id: 0,
            reviewed: {
              $filter: {
                input: "$reviews",
                as: "review",
                cond: {
                  $eq: [
                    "$$review.user",
                    new mongoose.Types.ObjectId(req.userId),
                  ],
                },
              },
            },
            reviews: {
              $slice: ["$reviews", Number(page * limit), Number(limit)],
            },
          },
        },
      ]);
      if (reviews[0].reviewed.length >= 1) {
        const { name, email } = await User.findById(
          reviews[0].reviewed[0].user,
          "name email"
        );
        reviews[0].reviewed[0].userName = name;
        reviews[0].reviewed[0].email = email;
        delete reviews[0].reviewed[0].user;
      }

      reviews[0].purchased = purchased;
    } else {
      reviews = await Product.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(productId) } },
        {
          $project: {
            _id: 0,
            reviews: {
              $slice: ["$reviews", Number(page * limit), Number(limit)],
            },
          },
        },
      ]);
    }

    for (var i = 0; i < reviews[0].reviews.length; i++) {
      const user = await User.findById(
        reviews[0].reviews[i].user,
        "name email"
      );
      delete reviews[0].reviews[i].user;
      if (user !== null) {
        reviews[0].reviews[i].userName = user.name;
        reviews[0].reviews[i].email = user.email;
      } else {
        reviews[0].reviews[i].userName = "deleted";
        reviews[0].reviews[i].email = "deleted";
      }
    }

    res.send(reviews[0]);
  } catch (err) {
    res.sendStatus(400);
  }
});

// router.put("/reviews/add", auth, async (req, res) => {
//   try {
//     const { productId, rating, review } = req.body;

//     await Product.updateOne(
//       { _id: productId },
//       {
//         $pull: { reviews: { user: req.userId } },
//       }
//     );
//     const update = await Product.updateOne(
//       { _id: productId },
//       {
//         $push: {
//           reviews: { user: req.userId, rating, review },
//         },
//       }
//     );

//     if (update.n < 1) {
//       throw new Error();
//     }

//     res.sendStatus(200);
//   } catch (err) {
//     res.sendStatus(500);
//   }
// });

// router.put("/review/delete/:productId", auth, async (req, res) => {
//   try {
//     const { productId } = req.params;

//     await Product.updateOne(
//       { _id: productId },
//       { $pull: { reviews: { user: req.userId } } }
//     );
//     res.sendStatus(200);
//   } catch (err) {
//     res.sendStatus(500);
//   }
// });

router.get("/filter/:catagory/:type", async (req, res) => {
  try {
    const { catagory, type } = req.params;
    const query = req.query;

    const catagoryArr = catagory.split(",");
    const typeArr = type.split(",");

    const filterObj = {};

    if (catagoryArr[0] !== ";0.hjgbhj") {
      filterObj.catagory = [...catagoryArr, "both"];
    }
    if (typeArr[0] !== ";0.hjgbhj") {
      filterObj.type = [...typeArr];
    }

    let exceptObj = {};

    if (query.except !== "") {
      exceptObj = { _id: { $nin: query.except.split(",") } };
    }

    let obj = {};

    Object.keys(query).forEach((el) => {
      if (query[el] !== "") {
        if (el === "color" && query.filter.includes("color")) {
          const color = query[el].split(",");
          obj.stock = { $elemMatch: { color: { $in: [] } } };

          color.forEach((e) => {
            obj.stock.$elemMatch.color.$in.push("#" + e);
          });
        } else if (el === "size" && query.filter.includes("size")) {
          let size = query[el].split(",");
          if (typeof obj.stock === "undefined") {
            obj.stock = { $elemMatch: {} };
          }
          obj.stock.$elemMatch["sizeRemaining.size"] = { $in: size };
        }
      }
    });

    let filter = {
      colors: [],
      sizes: [],
    };

    const productsStock = await Product.find(
      { ...exceptObj, ...filterObj, ...obj },
      "stock createdAt"
    ).sort({ createdAt: "desc" });
    productsStock.forEach(({ stock }) => {
      stock.forEach((item) => {
        if (
          !query.filter.includes("color") ||
          (query.size === "" && query.filter.includes("size"))
        ) {
          if (!filter.colors.includes(item.color)) {
            filter.colors.push(item.color);
          }
        }
        if (
          !query.filter.includes("size") ||
          (query.color === "" && query.filter.includes("color"))
        ) {
          item.sizeRemaining.forEach(({ size }) => {
            if (!filter.sizes.includes(size)) {
              filter.sizes.push(size);
            }
          });
        }
      });
    });

    // Object.keys(filter).forEach((el) => {
    //   if (filter[el].length < 1) {
    //     delete filter[el];
    //   }
    // });

    res.send(filter);
  } catch (err) {
    res.sendStatus(400);
  }
});

router.get("/:catagory/:type", async (req, res) => {
  try {
    const { catagory, type } = req.params;
    const { page, limit, ...query } = req.query;

    const catagoryArr = catagory.split(",");
    const typeArr = type.split(",");

    const filterObj = {};

    if (catagoryArr[0] !== ";0.hjgbhj") {
      filterObj.catagory = [...catagoryArr, "both"];
    }
    if (typeArr[0] !== ";0.hjgbhj") {
      filterObj.type = [...typeArr];
    }

    if (Object.keys(filterObj).length < 1) {
      res.send({ products: [], count: 0 });
      return;
    }

    let exceptObj = {};

    if (query.except !== "") {
      exceptObj = { _id: { $nin: query.except.split(",") } };
    }

    let obj = {};
    let sortObj = {};

    Object.keys(query).forEach((el) => {
      if (query[el] !== "") {
        if (el === "sort") {
          sortObj.price = query[el];
        } else if (el === "color") {
          const color = query[el].split(",");
          obj.stock = { $elemMatch: { color: { $in: [] } } };

          color.forEach((e) => {
            obj.stock.$elemMatch.color.$in.push("#" + e);
          });
        } else if (el === "size") {
          let size = query[el].split(",");
          if (typeof obj.stock === "undefined") {
            obj.stock = { $elemMatch: {} };
          }
          obj.stock.$elemMatch["sizeRemaining.size"] = { $in: size };
        }
      }
    });

    const count = await Product.countDocuments({
      ...exceptObj,
      ...filterObj,
      ...obj,
    });

    Object.keys(filterObj).forEach((el) => {
      filterObj[el] = { $in: filterObj[el] };
    });

    let products = await Product.aggregate([
      {
        $match: {
          ...filterObj,
          ...obj,
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          price: 1,
          stock: 1,
          createdAt: 1,
          averageRating: { $avg: "$reviews.rating" },
          totalRatings: { $size: "$reviews" },
        },
      },
    ])
      .sort({ ...sortObj, createdAt: "desc" })
      .skip((page - 1) * limit)
      .limit(limit * 1);
    products = products.filter(
      (e) => !query.except.split(",").includes(`${e._id}`)
    );

    res.send({ products, count });
  } catch (err) {
    res.sendStatus(400);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          price: 1,
          stock: 1,
          catagory: 1,
          type: 1,
          averageRating: { $avg: "$reviews.rating" },
          totalRatings: { $size: "$reviews" },
        },
      },
    ]);

    if (!product) {
      throw new Error();
    }

    res.send(product[0]);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
});

// router.put("/update", auth, async (req, res) => {
//   try {
//     if (typeof req.userId === "undefined") {
//       throw new Error();
//     }

//     const user = await User.findById(req.userId, "type");
//     if (user.type !== "admin") {
//       throw new Error();
//     }

//     const { name, price, catagory, type, stock, _id } = req.body.data;

//     const images = req.body.images;

//     const imageKeys = Object.keys(images);
//     const imageValues = Object.values(images);

//     const cents = Math.round(price * 100);
//     const product = await Product.findById(
//       _id,
//       "name price catagory type stock"
//     );

//     const productStockObj = {};
//     product.stock.forEach((el) => {
//       productStockObj[el._id] = el.images;
//     });

//     for (let i = 0; i < imageValues.length; i++) {
//       for (let k = 0; k < imageValues[i].length; k++) {
//         if (
//           !imageValues[i][k].startsWith(
//             "https://res.cloudinary.com/xander-ecommerce/image/upload/"
//           )
//         ) {
//           const image = await cloudinary.uploader.upload(imageValues[i][k], {
//             upload_preset: "ml_default",
//           });
//           images[imageKeys[i]][k] = image.secure_url;
//         }
//       }
//     }

//     const arr = [...Object.keys(productStockObj)];
//     imageKeys.forEach((el) => {
//       const index = arr.findIndex((e) => e == el);
//       if (index !== -1) {
//         arr.splice(index, 1);
//       }
//     });

//     for (let i = 0; i < arr.length; i++) {
//       for (let k = 0; k < productStockObj[arr[i]].length; k++) {
//         await cloudinary.uploader.destroy(
//           productStockObj[arr[i]][k].split("/")[7].split(".")[0]
//         );
//       }
//       delete productStockObj[arr[i]];
//     }
//     const productStockObjKeys = Object.keys(productStockObj);
//     for (let i = 0; i < productStockObjKeys.length; i++) {
//       const ar = [...productStockObj[productStockObjKeys[i]]];
//       images[productStockObjKeys[i]].forEach((el) => {
//         const index = ar.findIndex((e) => e == el);
//         if (index !== -1) {
//           ar.splice(index, 1);
//         }
//       });
//       for (let k = 0; k < ar.length; k++) {
//         await cloudinary.uploader.destroy(ar[k].split("/")[7].split(".")[0]);
//       }
//     }

//     product.stock = [];

//     product.name = name;
//     product.price = cents;
//     product.catagory = catagory;
//     product.type = type;

//     for (var i = 0; i < stock.length; i++) {
//       product.stock.push({
//         images: imageValues[i],
//         color: stock[i].color,
//         sizeRemaining: stock[i].sizeRemaining.map((e) => {
//           return { size: e.size, remaining: e.remaining };
//         }),
//       });
//     }
//     await product.save();

//     res.sendStatus(200);
//   } catch (err) {
//     console.log(err);
//     res.sendStatus(400);
//   }
// });

// router.delete("/delete/:id", auth, async (req, res) => {
//   try {
//     if (typeof req.userId === "undefined") {
//       throw new Error();
//     }

//     const user = await User.findById(req.userId, "type");
//     if (user.type !== "admin") {
//       throw new Error();
//     }

//     const { id } = req.params;

//     const product = await Product.findById(id, "stock");

//     for (let i = 0; i < product.stock.length; i++) {
//       for (let k = 0; k < product.stock[i].images.length; k++) {
//         const a = await cloudinary.uploader.destroy(
//           product.stock[i].images[k].split(".")[0]
//         );
//       }
//     }

//     await Product.findByIdAndDelete(id);

//     res.sendStatus(200);
//   } catch (err) {
//     console.log(err);
//     res.sendStatus(400);
//   }
// });

// update cloudinary image link to cloudinary image id

router.put("/updateimages", async (req, res) => {
  console.log("update");
  try {
    // const products = await Product.find({}, "stock");

    // products.forEach((el, i) => {
    //   el.stock = el.stock.map((e) => {
    //     e.images = e.images.map((f) => (f.split("/")[7] ? f.split("/")[7] : f));
    //     return e;
    //   });
    //   let save = el.save();
    //   console.log(save, i);
    // });

    // const orders = await Order.find({}, "items");

    // orders.forEach(async (el, i) => {
    //   items = el.items.map((e) => {
    //     e.image = e.image.split("/")[7] ? e.image.split("/")[7] : e.image;
    //     return e;
    //   });
    //   const update = await Order.findByIdAndUpdate(el._id, { items });
    //   console.log(i);
    // });
    res.send("success");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
