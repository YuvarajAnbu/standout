import { render, screen } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { queryClient } from "./api/queryClient";
import { useAppStore } from "./store/useAppStore";

describe("App", () => {
  beforeEach(() => {
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

  it("renders the storefront home route after authentication is checked", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );

    expect(
      await screen.findByRole("heading", { name: "Trending this week" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Best sellers" }),
    ).toBeInTheDocument();
  });
});
