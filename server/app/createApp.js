const express = require("express");
const path = require("node:path");
const userRouter = require("#modules/users/user.routes");
const productRouter = require("#modules/catalog/catalog.routes");
const paymentRouter = require("#modules/payments/payment.routes");
const securityHeaders = require("#shared/http/security.middleware");
const createRateLimit = require("#shared/http/rateLimit.middleware");
const {
  errorHandler,
  notFound,
} = require("#shared/http/error.middleware");
const { isProduction } = require("#config/env");

function createApp() {
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", isProduction ? 1 : false);
  app.use(securityHeaders);
  app.use(express.json({ limit: process.env.REQUEST_BODY_LIMIT || "25mb" }));
  app.use(express.urlencoded({ extended: false, limit: "100kb" }));

  app.get("/health", (req, res) => {
    res.json({ status: "ok", uptime: Math.round(process.uptime()) });
  });
  app.use("/user/login", createRateLimit({ windowMs: 15 * 60_000, max: 10 }));
  app.use("/user/signup", createRateLimit({ windowMs: 60 * 60_000, max: 10 }));
  app.use("/user/check-user", createRateLimit({ windowMs: 15 * 60_000, max: 10 }));
  app.use("/user/guest-order", createRateLimit({ windowMs: 60_000, max: 30 }));
  app.use("/payment", createRateLimit({ windowMs: 60_000, max: 30 }));
  app.use("/user", userRouter);
  app.use("/product", productRouter);
  app.use("/payment", paymentRouter);

  if (isProduction) {
    const clientDist = path.join(__dirname, "../../client/dist");
    app.use(express.static(clientDist, { immutable: true, maxAge: "1y", index: false }));
    app.get("/{*splat}", (req, res, next) => {
      if (req.path.startsWith("/user/") || req.path.startsWith("/product/") || req.path.startsWith("/payment/")) {
        return next();
      }
      return res.sendFile(path.join(clientDist, "index.html"));
    });
  }

  app.use(notFound);
  app.use(errorHandler);
  return app;
}

module.exports = { createApp };
