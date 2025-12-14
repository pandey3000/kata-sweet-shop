import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Register from "../pages/Register";
import { AuthProvider } from "../context/AuthContext";
import { MemoryRouter } from "react-router-dom";
import api from "../services/api";

vi.mock("../services/api");

const renderWithProviders = (component) => {
  return render(
    <MemoryRouter>
      <AuthProvider>{component}</AuthProvider>
    </MemoryRouter>
  );
};

describe("Register Component", () => {
  it("submits registration form correctly", async () => {
    // Mock successful response
    api.post.mockResolvedValueOnce({
      data: { token: "new-token", user: { id: 2, name: "New User" } },
    });

    renderWithProviders(<Register />);

    // 1. Check inputs exist using the ACTUAL placeholders from your component
    expect(screen.getByPlaceholderText(/Your Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/\*\*\*\*\*\*/)).toBeInTheDocument(); // Escaped asterisks

    // 2. Fill form using those same placeholders
    fireEvent.change(screen.getByPlaceholderText(/Your Name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/\*\*\*\*\*\*/), {
      target: { value: "secret123" },
    });

    // Submit
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    // Assert API call
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/auth/register", {
        name: "John Doe",
        email: "john@example.com",
        password: "secret123",
      });
    });
  });
});
