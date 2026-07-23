import { beforeEach, describe, expect, it } from "vitest";
import { createIndexedDbStorage } from "./indexedDbStorage";

describe("indexed database storage", () => {
  beforeEach(() => localStorage.clear());

  it("stores and removes persisted values", async () => {
    const storage = createIndexedDbStorage();
    await storage.setItem("state", "persisted");

    expect(await storage.getItem("state")).toBe("persisted");
    await storage.removeItem("state");
    expect(await storage.getItem("state")).toBeNull();
  });
});
