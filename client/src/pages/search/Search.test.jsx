import { render, screen } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Search from "@/pages/search/Search";
import { queryClient } from "@/shared/api/queryClient";

const product = {
  _id: "507f1f77bcf86cd799439011",
  name: "Search result shirt",
  price: 2500,
  totalRatings: 0,
  stock: [
    {
      color: "#000000",
      images: ["shirt.jpg"],
      sizeRemaining: [{ size: "m", remaining: 5 }],
    },
  ],
};

describe("Search", () => {
  beforeEach(() => {
    queryClient.clear();
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          statusText: "OK",
          headers: { get: () => "application/json" },
          json: () =>
            Promise.resolve({
              count: 1,
              products: [product],
              filters: { colors: ["#000000"], sizes: ["m"] },
            }),
          text: () => Promise.resolve(""),
        }),
      ),
    );
  });

  it("maps a search query to the unified catalog endpoint", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/search?q=women%27s+tops"]}>
          <Search />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(await screen.findByText("Search result shirt")).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][0]).toContain("/product/women/tops?");
  });

  it("uses the shared no-match marker when only a product type matches", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/search?q=tops"]}>
          <Search />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(await screen.findByText("Search result shirt")).toBeInTheDocument();
    expect(fetch.mock.calls[0][0]).toContain(
      "/product/__no_catalog_match__/tops?",
    );
  });

  it("labels recommendations as no results when no search terms match", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/search?q=sdasdasd"]}>
          <Search />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(
      await screen.findByRole("heading", {
        name: `We couldn't find anything for "sdasdasd"`,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("recommended for you")).toBeInTheDocument();
    expect(fetch.mock.calls[0][0]).toContain("/product/best-seller?");
  });
});
