import { describe, expect, it } from "vitest";
import {
  formatCents,
  getCartItemCount,
  getCartSubtotal,
  getCartTax,
} from "./cart";
import { getColorName } from "./colors";

describe("cart utilities", () => {
  const cart = [
    { price: 1299, quantity: 2 },
    { price: "500", quantity: "3" },
  ];

  it("calculates totals consistently from numeric and string input", () => {
    expect(getCartSubtotal(cart)).toBe(4098);
    expect(getCartItemCount(cart)).toBe(5);
    expect(getCartTax(4098)).toBeCloseTo(81.96);
    expect(formatCents(4098)).toBe("$40.98");
  });

  it("returns a safe color label when a color is unknown", () => {
    const colors = [["Black", "#000000"]];

    expect(getColorName(colors, "#000000")).toBe("Black");
    expect(getColorName(colors, "#123456")).toBe("#123456");
    expect(getColorName(colors)).toBe("Unknown");
  });
});
