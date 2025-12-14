import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

// FIXED IMPORTS HERE:
import Login from "../pages/Login"; // One level up to 'src', then 'pages'
import { AuthProvider } from "../context/AuthContext"; // One level up to 'src', then 'context'
import api from "../services/api"; // One level up to 'src', then 'services'

// Mock the API module
vi.mock("../services/api"); // Make sure this matches the import above

// Helper to render with providers
const renderWithProviders = (component) => {
  return render(
    <MemoryRouter>
      <AuthProvider>{component}</AuthProvider>
    </MemoryRouter>
  );
};

describe("Login Component", () => {
  it("renders login form correctly", () => {
    renderWithProviders(<Login />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it("calls login API and redirects on success", async () => {
    // Setup Mock
    api.post.mockResolvedValueOnce({
      data: { token: "fake-jwt-token", user: { id: 1, name: "Admin" } },
    });

    renderWithProviders(<Login />);

    // Fill inputs
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    // Click Submit
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    // Assert
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/auth/login", {
        email: "test@example.com",
        password: "password123",
      });
    });
  });
});
