const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.SANDBOX_MERCHANT_ID,
  publicKey: process.env.SANDBOX_PUBLIC_KEY,
  privateKey: process.env.SANDBOX_PRIVATE_KEY,
});

module.exports = gateway;
