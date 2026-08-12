const test = require("node:test");
const assert = require("node:assert/strict");
const Product = require("#modules/catalog/product.model");
const { helpers } = require("#modules/catalog/catalog.routes");

test("product filter parsing ignores empty entries", () => {
  assert.deepEqual(helpers.commaList("men,, jackets "), ["men", "jackets"]);
});

test("catalog category filters retain the shared category", () => {
  assert.deepEqual(helpers.categoryMatch("men", "jackets"), {
    catagory: { $in: ["men", "both"] },
    type: { $in: ["jackets"] },
  });
});

test("catalog search ignores unmatched dimensions from the frontend", () => {
  assert.deepEqual(
    helpers.categoryMatch("__no_catalog_match__", "tops"),
    { type: { $in: ["tops"] } },
  );
  assert.deepEqual(
    helpers.categoryMatch("women", "__no_catalog_match__"),
    { catagory: { $in: ["women", "both"] } },
  );
  assert.deepEqual(
    helpers.categoryMatch("__no_catalog_match__", "__no_catalog_match__"),
    {},
  );
});

test("catalog search matches taxonomy or a safely escaped product name", () => {
  const match = helpers.searchMatch("women", "tops", "Floral (Pink)");

  assert.deepEqual(match.$or[0], {
    catagory: { $in: ["women", "both"] },
    type: { $in: ["tops"] },
  });
  assert.deepEqual(match.$or[1], {
    name: { $regex: "Floral \\(Pink\\)", $options: "i" },
  });
  assert.deepEqual(
    helpers.searchMatch("__no_catalog_match__", "__no_catalog_match__", "Wallet"),
    { name: { $regex: "Wallet", $options: "i" } },
  );
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

test("trending ranks current-month sales before historical sales", () => {
  const selection = helpers.trendingSelection({ color: "ffffff" });

  assert.deepEqual(selection.match, {
    sales: { $gte: 1 },
    stock: { $elemMatch: { color: { $in: ["#ffffff"] } } },
  });
  assert.deepEqual(selection.sort, {
    currentPeriodSales: -1,
    sales: -1,
    _id: 1,
  });
  assert.equal(selection.stages[0].$set.currentPeriodSales.$sum.$map.input.$filter.cond.$eq[1], helpers.currentMonth());
  assert.equal(selection.projection.sales, 1);
});

test("catalog products, count, and filters come from one aggregation", async () => {
  const originalAggregate = Product.aggregate;
  let aggregation;
  Product.aggregate = async (pipeline) => {
    aggregation = pipeline;
    return [{
      products: [{ _id: "product-one" }],
      metadata: [{ count: 1 }],
      filterValues: [{ colors: ["#ffffff"], sizes: ["M"] }],
    }];
  };

  try {
    const response = await helpers.catalogResponse({
      match: { catagory: "women" },
      query: { page: "1", limit: "12" },
      sort: { createdAt: -1 },
    });

    assert.deepEqual(response, {
      products: [{ _id: "product-one" }],
      count: 1,
      filters: { colors: ["#ffffff"], sizes: ["M"] },
    });
    assert.deepEqual(Object.keys(aggregation[1].$facet), [
      "products",
      "metadata",
      "filterValues",
    ]);
  } finally {
    Product.aggregate = originalAggregate;
  }
});

test("catalog aggregation omits filter work when facets are not requested", async () => {
  const originalAggregate = Product.aggregate;
  let aggregation;
  Product.aggregate = async (pipeline) => {
    aggregation = pipeline;
    return [{ products: [], metadata: [] }];
  };

  try {
    const response = await helpers.catalogResponse({
      match: {},
      query: { includeFilters: "false" },
      sort: { createdAt: -1 },
    });

    assert.deepEqual(response, { products: [], count: 0 });
    assert.deepEqual(Object.keys(aggregation[1].$facet), [
      "products",
      "metadata",
    ]);
  } finally {
    Product.aggregate = originalAggregate;
  }
});
