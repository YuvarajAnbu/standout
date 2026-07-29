import { render, screen } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { queryClient } from "@/shared/api/queryClient";
import { useAppStore } from "@/app/store/useAppStore";
import Shop from "@/features/catalog/Shop";

const localProduct = {
  _id: "local-shirt",
  name: "Local shirt",
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
    useAppStore.setState({ userProducts: [localProduct], hideProducts: [] });
    vi.stubGlobal(
      "fetch",
      vi.fn((url) =>
        Promise.resolve({
          ok: true,
          status: 200,
          statusText: "OK",
          headers: { get: () => "application/json" },
          json: () =>
            Promise.resolve(
              String(url).includes("/product/filter/")
                ? { colors: [], sizes: [] }
                : { count: 0, products: [] },
            ),
          text: () => Promise.resolve(""),
        }),
      ),
    );
  });

  it("combines local products with cached server results", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Shop title="Women's Tops" link="women/tops" />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(await screen.findByText("Local shirt")).toBeInTheDocument();
    expect(screen.getByText("1/1 products")).toBeInTheDocument();
  });
});
