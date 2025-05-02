"use client"

import { useState, useEffect } from "react"
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import { API_URL } from "../config"

const StudentDashboard = ({ user, onLogout }) => {
  const [borrowings, setBorrowings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchStudentBorrowings = async () => {
      try {
        const response = await fetch(`${API_URL}/api/books/borrowings/student`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Erreur lors du chargement des emprunts")
        }

        const data = await response.json()
        setBorrowings(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchStudentBorrowings()
  }, [user.token])

  // Calculer les statistiques
  const activeBorrowings = borrowings.filter((b) => !b.returnDate)
  const returnedBorrowings = borrowings.filter((b) => b.returnDate)
  const overdueBorrowings = activeBorrowings.filter((b) => new Date(b.dueDate) < new Date())

  return (
    <div className="dashboard-container">
      <Sidebar role="student" />

      <div className="main-content">
        <Header user={user} onLogout={onLogout} title="Tableau de Bord Étudiant" />

        <div className="welcome-section">
          <h2>Bienvenue, {user.name}!</h2>
          <p>Voici un aperçu de vos activités de bibliothèque</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Emprunts Actifs</h3>
            <div className="stat-value">{activeBorrowings.length}</div>
          </div>

          <div className="stat-card">
            <h3>Livres Retournés</h3>
            <div className="stat-value">{returnedBorrowings.length}</div>
          </div>

          <div className="stat-card">
            <h3>En Retard</h3>
            <div className="stat-value">{overdueBorrowings.length}</div>
          </div>

          <div className="stat-card">
            <h3>Total</h3>
            <div className="stat-value">{borrowings.length}</div>
          </div>
        </div>

        <div className="recent-borrowings">
          <h2>Emprunts Récents</h2>

          {loading ? (
            <div className="loading">Chargement des emprunts...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : borrowings.length === 0 ? (
            <div className="no-borrowings">
              <p>Vous n'avez pas encore emprunté de livres.</p>
            </div>
          ) : (
            <div className="borrowings-list">
              {borrowings.slice(0, 5).map((borrowing) => (
                <div key={borrowing.id} className="borrowing-card">
                  <div className="book-cover">
                    <img
                      src={borrowing.book.coverImage || "/placeholder.svg?height=120&width=80"}
                      alt={borrowing.book.title}
                    />
                  </div>
                  <div className="borrowing-details">
                    <h3>{borrowing.book.title}</h3>
                    <p className="book-author">Par {borrowing.book.author}</p>
                    <p className="borrow-date">Emprunté le: {new Date(borrowing.borrowDate).toLocaleDateString()}</p>
                    <p className="due-date">À retourner le: {new Date(borrowing.dueDate).toLocaleDateString()}</p>
                    <div className="borrowing-status">
                      <span
                        className={`status-badge ${borrowing.returnDate ? "returned" : new Date(borrowing.dueDate) < new Date() ? "overdue" : "active"}`}
                      >
                        {borrowing.returnDate
                          ? "Retourné"
                          : new Date(borrowing.dueDate) < new Date()
                            ? "En retard"
                            : "Emprunté"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
