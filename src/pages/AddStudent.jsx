"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import { API_URL } from "../config"

const AddStudent = ({ user, onLogout }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    // Vérifier que les mots de passe correspondent
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: "student",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erreur lors de l'ajout de l'étudiant")
      }

      setSuccess(true)
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      })

      // Rediriger vers la liste des étudiants après 2 secondes
      setTimeout(() => {
        navigate("/admin/students")
      }, 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard-container">
      <Sidebar role="admin" />

      <div className="main-content">
        <Header user={user} onLogout={onLogout} title="Ajouter un Étudiant" />

        <div className="form-container">
          {success && (
            <div className="success-message">
              L'étudiant a été ajouté avec succès! Redirection vers la liste des étudiants...
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="add-student-form">
            <div className="form-group">
              <label htmlFor="name">Nom complet*</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Nom complet de l'étudiant"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email*</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Adresse email de l'étudiant"
              />
            </div>

            <div className="form-group">
              <label htmlFor="département">Département*</label>
              <input
                type="département"
                id="département"
                name="département"
                value={formData.département}
                onChange={handleChange}
                required
                placeholder="Le Département de l'étudiant"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Mot de passe*</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Mot de passe"
                minLength="6"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmer le mot de passe*</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirmer le mot de passe"
                minLength="6"
              />
            </div>

            <div className="form-actions">
              <button type="button" className="cancel-button" onClick={() => navigate("/admin/students")}>
                Annuler
              </button>
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? "Ajout en cours..." : "Ajouter l'étudiant"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddStudent
