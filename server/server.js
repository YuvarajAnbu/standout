const { port, requireEnvironment } = require("./config/env");
const { createApp } = require("./app");
const { connectDatabase, disconnectDatabase } = require("./config/mongoose");

let server;
let shuttingDown = false;

async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.info(`${signal} received; shutting down`);

  const forceExit = setTimeout(() => process.exit(1), 10_000);
  forceExit.unref();

  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  await disconnectDatabase();
  clearTimeout(forceExit);
}

async function start() {
  requireEnvironment(["MONGODB_URI", "JWT_SECRET"]);
  await connectDatabase();
  server = createApp().listen(port, () => console.info(`Server listening on ${port}`));
}

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));

start().catch((error) => {
  console.error("Server failed to start", error);
  process.exitCode = 1;
});

module.exports = { shutdown, start };
