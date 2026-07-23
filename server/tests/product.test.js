const test = require("node:test");
const assert = require("node:assert/strict");
const { helpers } = require("../routes/product");

test("product filter parsing ignores empty entries", () => {
  assert.deepEqual(helpers.commaList("men,, jackets "), ["men", "jackets"]);
});

test("catalog category filters retain the shared category", () => {
  assert.deepEqual(helpers.categoryMatch("men", "jackets"), {
    catagory: { $in: ["men", "both"] },
    type: { $in: ["jackets"] },
  });
});

test("stock filters require an available selected variant", () => {
  assert.deepEqual(helpers.stockMatch({ color: "ffffff", size: "m" }), {
    stock: {
      $elemMatch: {
        color: { $in: ["#ffffff"] },
        sizeRemaining: { $elemMatch: { size: { $in: ["m"] }, remaining: { $gt: 0 } } },
      },
    },
  });
});

test("trending month follows the current UTC year and month", () => {
  const now = new Date();
  assert.equal(helpers.currentMonth(), Number(`${now.getUTCFullYear()}${now.getUTCMonth() + 1}`));
});
