import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import SearchTool from "@/app/layout/header/components/tools/searchTool/SearchTool";

function LocationProbe() {
  const location = useLocation();
  return <output data-testid="location">{location.pathname}{location.search}</output>;
}

describe("SearchTool", () => {
  it("navigates with a trimmed and encoded query when submitted", async () => {
    const user = userEvent.setup();
    const setBlackBox = vi.fn();

    render(
      <MemoryRouter>
        <SearchTool
          setBlackBox={setBlackBox}
          windowWidth={1200}
          clicked="search"
          setClicked={vi.fn()}
        />
        <LocationProbe />
      </MemoryRouter>,
    );

    await user.type(screen.getByPlaceholderText("Search"), " women's tops ");
    await user.keyboard("{Enter}");

    expect(screen.getByTestId("location")).toHaveTextContent(
      "/search?q=women%27s+tops",
    );
    expect(setBlackBox).toHaveBeenCalledWith(false);
  });
});
