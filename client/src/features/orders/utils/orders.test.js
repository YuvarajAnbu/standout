import { describe, expect, it } from "vitest";
import { mergeOrdersById, upsertOrder } from "./orders";

describe("order collection helpers", () => {
  it("deduplicates local and API orders by id using the latest source", () => {
    const local = { _id: "order-1", delivered: false, date: "2026-08-11" };
    const api = { _id: "order-1", delivered: true, date: "2026-08-11" };

    expect(mergeOrdersById([local], [api])).toEqual([api]);
  });

  it("upserts and sorts orders newest first", () => {
    const older = { _id: "order-1", date: "2026-08-10" };
    const newer = { _id: "order-2", date: "2026-08-12" };

    expect(upsertOrder([older], newer)).toEqual([newer, older]);
  });
});
