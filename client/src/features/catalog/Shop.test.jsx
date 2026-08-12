import { render, screen } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { queryClient } from "@/shared/api/queryClient";
import Shop from "@/features/catalog/Shop";

const product = {
  _id: "507f1f77bcf86cd799439011",
  name: "Server shirt",
  price: 2500,
  catagory: "women",
  type: "tops",
  createdAt: "2",
  totalRatings: 0,
  stock: [
    {
      _id: "stock-one",
      color: "#000000",
      images: ["data:image/png;base64,abc"],
      sizeRemaining: [{ size: "M", remaining: 5 }],
    },
  ],
};

describe("Shop", () => {
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
              filters: { colors: ["#000000"], sizes: ["M"] },
            }),
          text: () => Promise.resolve(""),
        }),
      ),
    );
  });

  it("renders products and filters from one catalog response", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Shop title="Women's Tops" link="women/tops" />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(await screen.findByText("Server shirt")).toBeInTheDocument();
    expect(screen.getByText("1/1 products")).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
