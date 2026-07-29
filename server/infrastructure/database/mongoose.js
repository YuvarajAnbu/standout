const mongoose = require("mongoose");
const dns = require("node:dns/promises");

function configureDns() {
  const configured = process.env.MONGODB_DNS_SERVERS;
  if (configured === "system") return;
  const servers = (configured || "1.1.1.1,8.8.8.8")
    .split(",")
    .map((server) => server.trim())
    .filter(Boolean);
  if (servers.length) dns.setServers(servers);
}

async function connectDatabase() {
  if (!process.env.MONGODB_URI) {
    throw new Error("Missing required environment variable: MONGODB_URI");
  }

  configureDns();
  mongoose.set("strictQuery", true);
  await mongoose.connect(process.env.MONGODB_URI, {
    family: 4,
    maxPoolSize: Number(process.env.MONGODB_POOL_SIZE) || 10,
    serverSelectionTimeoutMS: 10_000,
  });
  console.info("Connected to database");
  return mongoose.connection;
}

async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}

module.exports = { configureDns, connectDatabase, disconnectDatabase };
