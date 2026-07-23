const path = require("node:path");

require("dotenv").config({ path: path.join(__dirname, "../../.env"), quiet: true });

const isProduction = process.env.NODE_ENV === "production";

function requireEnvironment(names) {
  const missing = names.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}

module.exports = {
  isProduction,
  port: Number(process.env.PORT) || 3001,
  requireEnvironment,
};
