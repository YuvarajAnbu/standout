import { beforeEach, describe, expect, it, vi } from "vitest";
import { queryClient } from "./queryClient";
import { cachedGet } from "./queries";

describe("cachedGet", () => {
  beforeEach(() => {
    queryClient.clear();
  });

  it("deduplicates fresh requests through the query cache", async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        statusText: "OK",
        headers: { get: () => "application/json" },
        json: () => Promise.resolve({ products: ["cached"] }),
        text: () => Promise.resolve(""),
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    const first = await cachedGet("/product/trending", { staleTime: 60_000 });
    const second = await cachedGet("/product/trending", { staleTime: 60_000 });

    expect(first.data).toEqual({ products: ["cached"] });
    expect(second.data).toEqual(first.data);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
