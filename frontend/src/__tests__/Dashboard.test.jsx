import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Dashboard from "../pages/Dashboard";
import { MemoryRouter } from "react-router-dom";
import * as sweetService from "../services/sweetService";
// 1. IMPORT THE PROVIDER
import { ToastProvider } from "../context/ToastContext";

vi.mock("../services/sweetService");

const mockSweets = [
  { id: 1, name: "Rasgulla", price: 10, quantity: 50, imageUrl: "img1.jpg" },
  { id: 2, name: "Kaju Katli", price: 20, quantity: 0, imageUrl: "img2.jpg" },
];

describe("Dashboard Component", () => {
  it("renders sweets after loading", async () => {
    sweetService.getSweets.mockResolvedValue(mockSweets);

    render(
      <MemoryRouter>
        {/* 2. WRAP DASHBOARD WITH PROVIDER */}
        <ToastProvider>
          <Dashboard />
        </ToastProvider>
      </MemoryRouter>
    );

    // Check for loading state initially
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText("Rasgulla")).toBeInTheDocument();
      expect(screen.getByText("Kaju Katli")).toBeInTheDocument();
    });
  });

  it('displays "Out of Stock" label for unavailable items', async () => {
    sweetService.getSweets.mockResolvedValue(mockSweets);

    render(
      <MemoryRouter>
        {/* 2. WRAP DASHBOARD WITH PROVIDER */}
        <ToastProvider>
          <Dashboard />
        </ToastProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      const outOfStockBadges = screen.getAllByText(/out of stock/i);
      expect(outOfStockBadges.length).toBeGreaterThan(0);
    });
  });
});
