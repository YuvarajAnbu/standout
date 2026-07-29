import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { useAppStore } from "@/app/store/useAppStore";
import AdminRoute from "@/app/routing/AdminRoute";

const renderAdminRoute = () =>
  render(
    <MemoryRouter initialEntries={["/admin"]}>
      <Routes>
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <h1>Admin content</h1>
            </AdminRoute>
          }
        />
        <Route path="/404" element={<h1>Not found</h1>} />
      </Routes>
    </MemoryRouter>,
  );

describe("AdminRoute", () => {
  beforeEach(() => useAppStore.setState({ user: {} }));

  it("redirects non-admin users", () => {
    renderAdminRoute();
    expect(screen.getByRole("heading", { name: "Not found" })).toBeInTheDocument();
  });

  it("renders protected content for admins", () => {
    useAppStore.setState({ user: { type: "admin" } });
    renderAdminRoute();
    expect(screen.getByRole("heading", { name: "Admin content" })).toBeInTheDocument();
  });
});
