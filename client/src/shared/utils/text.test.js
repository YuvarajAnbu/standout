import { describe, expect, it } from "vitest";
import { truncate } from "@/shared/utils/text";

describe("truncate", () => {
  it("leaves text within the limit unchanged", () => {
    expect(truncate("Cotton shirt", 15)).toBe("Cotton shirt");
  });

  it("keeps truncated text within the requested length", () => {
    expect(truncate("Long cotton shirt", 15)).toBe("Long cotton...");
  });
});
