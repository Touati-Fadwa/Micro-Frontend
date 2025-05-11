"use client";

import { useState } from "react";
import { API_URL } from "../config";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur de connexion");
      }

      onLogin(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

   return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="login-header">
            <h1>Bibliothèque ISET</h1>
            <p>Système de Gestion de Bibliothèque</p>
          </div>
          <div className="login-info">
            <h2>Bienvenue</h2>
            <p>
              Accédez à notre plateforme de gestion de bibliothèque pour gérer vos emprunts, découvrir notre catalogue
              et bien plus encore.
            </p>
            <div className="login-features">
              <div className="feature">
                <div className="feature-icon">
                  <i className="fas fa-book"></i>
                </div>
                <div className="feature-text">
                  <h3>Vaste Catalogue</h3>
                  <p>Accédez à des milliers de livres et ressources académiques</p>
                </div>
              </div>
              <div className="feature">
                <div className="feature-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <div className="feature-text">
                  <h3>Gestion Simplifiée</h3>
                  <p>Suivez vos emprunts et retours en temps réel</p>
                </div>
              </div>
              <div className="feature">
                <div className="feature-icon">
                  <i className="fas fa-user-shield"></i>
                </div>
                <div className="feature-text">
                  <h3>Accès Sécurisé</h3>
                  <p>Vos données sont protégées par un système sécurisé</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="login-right">
          <div className="login-form-container">
            <div className="login-form-header">
              <h2>Connexion</h2>
              <p>Entrez vos identifiants pour accéder à votre compte</p>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">
                  <i className="fas fa-envelope"></i>
                  <span>Email</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Entrez votre email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  <i className="fas fa-lock"></i>
                  <span>Mot de passe</span>
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Entrez votre mot de passe"
                />
              </div>

              <div className="form-group role-selector">
                <label>
                  <i className="fas fa-user-tag"></i>
                  <span>Rôle</span>
                </label>
                <div className="role-options">
                  <div className={`role-option ${role === "student" ? "active" : ""}`}>
                    <input
                      type="radio"
                      id="student"
                      name="role"
                      value="student"
                      checked={role === "student"}
                      onChange={(e) => setRole(e.target.value)}
                    />
                    <label htmlFor="student">
                      <i className="fas fa-user-graduate"></i>
                      Étudiant
                    </label>
                  </div>
                  <div className={`role-option ${role === "admin" ? "active" : ""}`}>
                    <input
                      type="radio"
                      id="admin"
                      name="role"
                      value="admin"
                      checked={role === "admin"}
                      onChange={(e) => setRole(e.target.value)}
                    />
                    <label htmlFor="admin">
                      <i className="fas fa-user-cog"></i>
                      Administrateur
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-options">
                <div className="remember-me">
                  <input type="checkbox" id="remember" />
                  <label htmlFor="remember">Se souvenir de moi</label>
                </div>
                <a href="#" className="forgot-password">
                  Mot de passe oublié?
                </a>
              </div>

              <button type="submit" className="login-button" disabled={loading}>
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Connexion en cours...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt"></i> Se connecter
                  </>
                )}
              </button>
            </form>

            <div className="login-footer">
              <p>
                Vous n'avez pas de compte? <a href="#">Contactez l'administrateur</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
