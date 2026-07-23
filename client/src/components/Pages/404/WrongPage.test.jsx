import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router-dom";
import { describe, expect, it } from "vitest";
import WrongPage from "./WrongPage";

describe("WrongPage", () => {
  it("shows the not-found message and submits an encoded search", async () => {
    const user = userEvent.setup();

    function LocationDisplay() {
      const location = useLocation();
      return <output data-testid="location">{location.pathname + location.search}</output>;
    }

    render(
      <MemoryRouter>
        <WrongPage />
        <LocationDisplay />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: "404" }),
    ).toBeInTheDocument();
    expect(document.title).toBe("404 - Page Not Found");

    await user.type(screen.getByPlaceholderText("Search"), "summer shirts");
    await user.click(screen.getByRole("button", { name: "Search" }));

    expect(screen.getByTestId("location")).toHaveTextContent(
      "/search?q=summer%20shirts"
    );
  });
});
