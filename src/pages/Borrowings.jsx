"use client"

import { useState, useEffect } from "react"
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import { API_URL } from "../config"

const Borrowings = ({ user, onLogout }) => {
  const [borrowings, setBorrowings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all") // 'all', 'active', 'returned'

  useEffect(() => {
    const fetchBorrowings = async () => {
      try {
        const response = await fetch(`${API_URL}/api/books/borrowings`, {
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

    fetchBorrowings()
  }, [user.token])

  const handleReturn = async (borrowingId) => {
    try {
      const response = await fetch(`${API_URL}/api/books/borrowings/${borrowingId}/return`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Erreur lors du retour du livre")
      }

      // Mettre à jour l'état local
      setBorrowings(
        borrowings.map((borrowing) =>
          borrowing.id === borrowingId
            ? { ...borrowing, returnDate: new Date().toISOString(), status: "returned" }
            : borrowing,
        ),
      )
    } catch (err) {
      setError(err.message)
    }
  }

  const filteredBorrowings = borrowings.filter((borrowing) => {
    const matchesSearch =
      borrowing.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      borrowing.student.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter =
      filter === "all" ||
      (filter === "active" && !borrowing.returnDate) ||
      (filter === "returned" && borrowing.returnDate)

    return matchesSearch && matchesFilter
  })

  return (
    <div className="dashboard-container">
      <Sidebar role="admin" />

      <div className="main-content">
        <Header user={user} onLogout={onLogout} title="Gestion des Emprunts" />

        <div className="borrowings-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Rechercher par livre ou étudiant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-container">
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="status-filter">
              <option value="all">Tous les emprunts</option>
              <option value="active">Emprunts actifs</option>
              <option value="returned">Livres retournés</option>
            </select>
          </div>

          <button className="add-button">
            <i className="fas fa-plus"></i> Nouvel emprunt
          </button>
        </div>

        {loading ? (
          <div className="loading">Chargement des emprunts...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="borrowings-table-container">
            <table className="borrowings-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Livre</th>
                  <th>Étudiant</th>
                  <th>Date d'emprunt</th>
                  <th>Date de retour prévue</th>
                  <th>Date de retour</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBorrowings.length > 0 ? (
                  filteredBorrowings.map((borrowing) => (
                    <tr key={borrowing.id}>
                      <td>{borrowing.id}</td>
                      <td>{borrowing.book.title}</td>
                      <td>{borrowing.student.name}</td>
                      <td>{new Date(borrowing.borrowDate).toLocaleDateString()}</td>
                      <td>{new Date(borrowing.dueDate).toLocaleDateString()}</td>
                      <td>{borrowing.returnDate ? new Date(borrowing.returnDate).toLocaleDateString() : "-"}</td>
                      <td>
                        <span className={`status-badge ${borrowing.returnDate ? "returned" : "active"}`}>
                          {borrowing.returnDate ? "Retourné" : "Emprunté"}
                        </span>
                      </td>
                      <td className="actions-cell">
                        {!borrowing.returnDate && (
                          <button className="return-button" onClick={() => handleReturn(borrowing.id)}>
                            Retourner
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="no-results">
                      Aucun emprunt trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Borrowings
