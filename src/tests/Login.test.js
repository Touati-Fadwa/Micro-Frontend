import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "../pages/Login";

describe("Login Component", () => {
  const mockOnLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        id: 1,
        name: "Test User",
        role: "admin",
        token: "fake-token",
      }),
    });
  });

  test("renders login form correctly", () => {
    render(<Login onLogin={mockOnLogin} />);

    // Vérifications corrigées
    expect(screen.getByText("Bibliothèque ISET")).toBeInTheDocument();
    expect(screen.getByText("Connexion")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Mot de passe")).toBeInTheDocument();
    
    // Vérification des boutons radio pour le rôle
    expect(screen.getByLabelText("Étudiant")).toBeInTheDocument();
    expect(screen.getByLabelText("Administrateur")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Se connecter" })).toBeInTheDocument();
  });

  test("handles form submission correctly", async () => {
    render(<Login onLogin={mockOnLogin} />);

    // Remplir le formulaire
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText("Mot de passe"), { target: { value: "password123" } });

    // Sélectionner le rôle admin (corrigé)
    fireEvent.click(screen.getByLabelText("Administrateur"));

    // Soumettre le formulaire
    fireEvent.click(screen.getByRole("button", { name: "Se connecter" }));

    // Vérifications
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.any(String), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123",
          role: "admin",
        }),
      });
    });

    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith({
        id: 1,
        name: "Test User",
        role: "admin",
        token: "fake-token",
      });
    });
  });

  test("displays error message on failed login", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: "Email, mot de passe ou rôle incorrect" }),
    });

    render(<Login onLogin={mockOnLogin} />);

    // Remplir le formulaire
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "wrong@example.com" } });
    fireEvent.change(screen.getByLabelText("Mot de passe"), { target: { value: "wrongpassword" } });

    // Sélection du rôle (corrigé)
    fireEvent.click(screen.getByLabelText("Administrateur"));

    // Soumettre le formulaire
    fireEvent.click(screen.getByRole("button", { name: "Se connecter" }));

    // Vérification
    const errorMessage = await screen.findByText("Email, mot de passe ou rôle incorrect");
    expect(errorMessage).toBeInTheDocument();
    expect(mockOnLogin).not.toHaveBeenCalled();
  });
});