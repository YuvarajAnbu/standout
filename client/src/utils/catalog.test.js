import { describe, expect, it } from "vitest";
import {
  collectStockOptions,
  filterLocalProducts,
  sortCatalogProducts,
} from "./catalog";

const products = [
  {
    _id: "one",
    catagory: "women",
    type: "tops",
    price: 300,
    createdAt: 1,
    stock: [{ color: "#fff", sizeRemaining: [{ size: "M" }] }],
  },
  {
    _id: "two",
    catagory: "both",
    type: "tops",
    price: 100,
    createdAt: 2,
    stock: [{ color: "#000", sizeRemaining: [{ size: "L" }] }],
  },
];

describe("catalog utilities", () => {
  it("filters local products by route and stock selections", () => {
    expect(
      filterLocalProducts(products, {
        categories: "women",
        types: "tops",
        filter: { color: ["000"], size: ["L"] },
      }).map(({ _id }) => _id),
    ).toEqual(["two"]);
  });

  it("sorts without mutating and collects unique stock options", () => {
    expect(sortCatalogProducts(products, "asc").map(({ _id }) => _id)).toEqual([
      "two",
      "one",
    ]);
    expect(products[0]._id).toBe("one");
    expect(collectStockOptions(products)).toEqual({
      colors: ["#fff", "#000"],
      sizes: ["M", "L"],
    });
  });
});
