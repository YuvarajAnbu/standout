const test = require("node:test");
const assert = require("node:assert/strict");
const { createApp } = require("#app/createApp");

async function withServer(run) {
  const server = createApp().listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  try {
    const { port } = server.address();
    await run(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

test("health endpoint and security headers work without a database connection", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/health`);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
    assert.equal((await response.json()).status, "ok");
  });
});

test("unknown API routes return a JSON 404", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/missing`);
    assert.equal(response.status, 404);
    assert.deepEqual(await response.json(), { message: "Route not found" });
  });
});

test("anonymous authentication never creates an account session", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/user/authenticate`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { user: {} });
    assert.equal(response.headers.get("set-cookie"), null);
  });
});

test("administrative order routes reject anonymous requests before database access", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/user/delivered/507f1f77bcf86cd799439011`);
    assert.equal(response.status, 401);
    assert.deepEqual(await response.json(), { message: "Authentication required" });
  });
});

test("product and review mutations reject anonymous requests before external access", async () => {
  await withServer(async (baseUrl) => {
    const requests = [
      ["POST", "/product"],
      ["PUT", "/product/507f1f77bcf86cd799439011"],
      ["DELETE", "/product/507f1f77bcf86cd799439011"],
      ["PUT", "/product/507f1f77bcf86cd799439011/review"],
      ["DELETE", "/product/507f1f77bcf86cd799439011/review"],
    ];
    for (const [method, path] of requests) {
      const response = await fetch(`${baseUrl}${path}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: method === "DELETE" ? undefined : "{}",
      });
      assert.equal(response.status, 401, `${method} ${path}`);
      assert.deepEqual(await response.json(), {
        message: "Authentication required",
      });
    }
  });
});
