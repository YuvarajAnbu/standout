import { describe, expect, it } from "vitest";
import {
  createStockIndex,
  reconcileCatalogFilter,
} from "@/features/catalog/utils/catalog";

describe("catalog utilities", () => {
  it("creates a default stock selection for every product", () => {
    expect(createStockIndex([{ _id: "one" }, { _id: "two" }])).toEqual({
      0: 0,
      1: 0,
    });
  });

  it("removes selections invalidated by another filter dimension", () => {
    expect(
      reconcileCatalogFilter(
        { sort: "", color: ["000000"], size: ["M"] },
        { colors: ["#ffffff"] },
      ),
    ).toEqual({ sort: "", color: [], size: ["M"] });
  });
});
