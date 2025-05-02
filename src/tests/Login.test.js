import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "../pages/Login";

describe("Login Component", () => {
  const mockOnLogin = jest.fn();

  beforeEach(() => {
    // Réinitialiser les mocks avant chaque test
    jest.clearAllMocks();

    // Mock de fetch par défaut (cas de succès)
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ 
        id: 1, 
        name: "Test User", 
        role: "admin",  // Changé pour correspondre au rôle sélectionné
        token: "fake-token" 
      }),
    });
  });

  test("renders login form correctly", () => {
    render(<Login onLogin={mockOnLogin} />);

    // Vérifier que les éléments du formulaire sont bien rendus
    expect(screen.getByText("Bibliothèque ISET Tozeur")).toBeInTheDocument(); 
    expect(screen.getByText(/Connexion à votre compte/i)).toBeInTheDocument(); // Utiliser un matcher plus flexible
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Mot de passe")).toBeInTheDocument();
    expect(screen.getByLabelText("Étudiant")).toBeInTheDocument();
    expect(screen.getByLabelText("Administrateur")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Se connecter" })).toBeInTheDocument();
  });

  test("handles form submission correctly", async () => {
    render(<Login onLogin={mockOnLogin} />);

    // Remplir le formulaire
    fireEvent.change(screen.getByLabelText("Email"), { 
      target: { value: "test@example.com" } 
    });
    fireEvent.change(screen.getByLabelText("Mot de passe"), { 
      target: { value: "password123" } 
    });

    // Sélectionner le rôle admin (utilisation de fireEvent.change pour un select)
    fireEvent.change(screen.getByLabelText(/Sélectionnez votre rôle/i), { target: { value: 'admin' } });

    // Soumettre le formulaire
    fireEvent.click(screen.getByRole("button", { name: "Se connecter" }));

    // Vérifier que fetch a été appelé avec les bons paramètres
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.any(String), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123",
          role: "admin",  // Doit correspondre au rôle sélectionné
        }),
      });
    });

    // Vérifier que onLogin a été appelé avec les bonnes données
    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith({
        id: 1,
        name: "Test User",
        role: "admin",  // Doit correspondre à la réponse mockée
        token: "fake-token",
      });
    });
  });

  test("displays error message on failed login", async () => {
    // Simuler une erreur de connexion
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: "Email, mot de passe ou rôle incorrect" }),
    });

    render(<Login onLogin={mockOnLogin} />);

    // Remplir le formulaire
    fireEvent.change(screen.getByLabelText("Email"), { 
      target: { value: "wrong@example.com" } 
    });
    fireEvent.change(screen.getByLabelText("Mot de passe"), { 
      target: { value: "wrongpassword" } 
    });

    // Sélectionner le rôle admin (utilisation de fireEvent.change pour un select)
    fireEvent.change(screen.getByLabelText(/Sélectionnez votre rôle/i), { target: { value: 'admin' } });

    // Soumettre le formulaire
    fireEvent.click(screen.getByRole("button", { name: "Se connecter" }));

    // Attendre que le message d'erreur apparaisse
    const errorMessage = await screen.findByText("Email, mot de passe ou rôle incorrect");
    expect(errorMessage).toBeInTheDocument();

    // Vérifier que onLogin n'a pas été appelé
    expect(mockOnLogin).not.toHaveBeenCalled();
  });
});
