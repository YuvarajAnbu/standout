import { describe, expect, it } from "vitest";
import { buildProductPayload } from "@/features/admin/productPayload";

describe("buildProductPayload", () => {
  it("converts dollars to cents and retains server stock ids when editing", () => {
    expect(
      buildProductPayload(
        {
          name: "  Shirt  ",
          price: "25.99",
          catagory: "women",
          type: "shirts",
          stock: [
            {
              color: "#ffffff",
              sizeRemaining: [{ size: "m", remaining: "3" }],
            },
          ],
        },
        [{ _id: "507f1f77bcf86cd799439011" }],
        { "507f1f77bcf86cd799439011": ["existing/image"] },
        { includeStockIds: true },
      ),
    ).toEqual({
      name: "Shirt",
      price: 2599,
      catagory: "women",
      type: "shirts",
      stock: [
        {
          _id: "507f1f77bcf86cd799439011",
          color: "#ffffff",
          images: ["existing/image"],
          sizeRemaining: [{ size: "m", remaining: "3" }],
        },
      ],
    });
  });

  it("rejects stock without images", () => {
    expect(() =>
      buildProductPayload(
        {
          name: "Shirt",
          price: "10",
          catagory: "women",
          type: "shirts",
          stock: [{ color: "#ffffff", sizeRemaining: [] }],
        },
        [{ id: "new-stock" }],
        {},
      ),
    ).toThrow("Each stock item needs an image");
  });
});
