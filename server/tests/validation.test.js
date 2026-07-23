const test = require("node:test");
const assert = require("node:assert/strict");
const { asEmail, asObjectId, pagination } = require("../utils/validation");
const { readCookies } = require("../routes/middleWares/auth");

test("pagination applies defaults and upper bounds", () => {
  assert.deepEqual(pagination({}), { page: 1, limit: 20, skip: 0 });
  assert.deepEqual(pagination({ page: "3", limit: "500" }), { page: 3, limit: 100, skip: 200 });
});

test("email validation normalizes input", () => {
  assert.equal(asEmail("  USER@Example.COM "), "user@example.com");
  assert.throws(() => asEmail("not-an-email"), /Invalid email/);
});

test("object id validation rejects arbitrary values", () => {
  assert.equal(asObjectId("507f1f77bcf86cd799439011"), "507f1f77bcf86cd799439011");
  assert.throws(() => asObjectId("1"), /Invalid id/);
});

test("cookie parser handles spacing and values containing equals signs", () => {
  assert.deepEqual(readCookies("one=1; token=abc=def"), { one: "1", token: "abc=def" });
});
