const test = require("node:test");
const assert = require("node:assert/strict");
const {
  parseProductInput,
  parseReviewInput,
} = require("#modules/catalog/product.input");

const product = {
  name: "Button-down shirt",
  price: 2599,
  catagory: "women",
  type: "shirts",
  stock: [
    {
      color: "#aabbcc",
      images: ["data:image/png;base64,YQ=="],
      sizeRemaining: [{ size: "M", remaining: 4 }],
    },
  ],
};

test("product input normalizes trusted fields", () => {
  assert.deepEqual(parseProductInput(product), {
    ...product,
    stock: [
      {
        ...product.stock[0],
        sizeRemaining: [{ size: "m", remaining: 4 }],
      },
    ],
  });
});

test("product input rejects unsafe image references", () => {
  assert.throws(
    () =>
      parseProductInput({
        ...product,
        stock: [{ ...product.stock[0], images: ["javascript:alert(1)"] }],
      }),
    /Invalid product image/,
  );
});

test("review input accepts half stars and rejects arbitrary ratings", () => {
  assert.deepEqual(parseReviewInput({ rating: "4.5", review: "Great fit" }), {
    rating: 4.5,
    review: "Great fit",
  });
  assert.throws(
    () => parseReviewInput({ rating: 4.2, review: "No" }),
    /half-star steps/,
  );
});
