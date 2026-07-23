const { spawnSync } = require("node:child_process");
const { readdirSync } = require("node:fs");
const { join } = require("node:path");

const serverRoot = join(__dirname, "..");

function javascriptFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory() && entry.name !== "tests") return javascriptFiles(path);
    return entry.isFile() && entry.name.endsWith(".js") ? [path] : [];
  });
}

for (const file of javascriptFiles(serverRoot)) {
  const result = spawnSync(process.execPath, ["--check", file], { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status || 1);
}

console.info("Server syntax check passed");
