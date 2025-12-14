import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

// --- FIXED IMPORT ---
import AdminPanel from "../pages/AdminPanel"; // Point to 'pages' folder
import * as sweetService from "../services/sweetService";

vi.mock("../services/sweetService");

describe("AdminPanel Component", () => {
  it("allows adding a new sweet", async () => {
    sweetService.addSweet.mockResolvedValue({
      id: 1,
      name: "Barfi",
      price: 15,
    });
    sweetService.getSweets.mockResolvedValue([]);

    render(
      <MemoryRouter>
        <AdminPanel />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/name/i), {
      target: { value: "Barfi" },
    });
    fireEvent.change(screen.getByPlaceholderText(/price/i), {
      target: { value: "15" },
    });
    fireEvent.change(screen.getByPlaceholderText(/quantity/i), {
      target: { value: "100" },
    });

    fireEvent.click(screen.getByRole("button", { name: /add sweet/i }));

    await waitFor(() => {
      expect(sweetService.addSweet).toHaveBeenCalledWith({
        name: "Barfi",
        price: "15",
        quantity: "100",
        imageUrl: "",
      });
    });
  });
});
