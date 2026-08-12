import { render, screen } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "@/app/App";
import { queryClient } from "@/shared/api/queryClient";
import { useAppStore } from "@/app/store/useAppStore";

describe("App", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/");
    queryClient.clear();
    useAppStore.setState({ user: {} });
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
              url === "/user/authenticate" ? { user: {} } : { products: [] }
            ),
          text: () => Promise.resolve(""),
        })
      )
    );
  });

  it("keeps an authenticated admin on a protected URL after reload", async () => {
    window.history.replaceState({}, "", "/update-products?q=socks");
    fetch.mockImplementation((url) =>
      Promise.resolve({
        ok: true,
        status: 200,
        statusText: "OK",
        headers: { get: () => "application/json" },
        json: () =>
          Promise.resolve(
            url === "/user/authenticate"
              ? { user: { name: "Admin", type: "admin" } }
              : {
                  products: [],
                  count: 0,
                  filters: { colors: [], sizes: [] },
                },
          ),
        text: () => Promise.resolve(""),
      }),
    );

    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>,
    );

    expect(
      await screen.findByRole("heading", {
        name: `We couldn't find anything for "socks"`,
      }),
    ).toBeInTheDocument();
    expect(window.location.pathname).toBe("/update-products");
    expect(window.location.search).toBe("?q=socks");
  });

  it("renders the storefront home route after authentication is checked", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );

    expect(
      await screen.findByRole("heading", { name: "Trending this month" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Best sellers" }),
    ).toBeInTheDocument();
  });
});
