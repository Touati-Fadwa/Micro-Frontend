"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import { API_URL } from "../config"

const Students = ({ user, onLogout }) => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [studentToDelete, setStudentToDelete] = useState(null)

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/students`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Erreur lors du chargement des étudiants")
        }

        const data = await response.json()
        setStudents(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [user.token])

  const handleDeleteClick = (student) => {
    setStudentToDelete(student)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!studentToDelete) return

    try {
      const response = await fetch(`${API_URL}/api/auth/students/${studentToDelete.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de l'étudiant")
      }

      setStudents(students.filter((s) => s.id !== studentToDelete.id))
      setShowDeleteModal(false)
      setStudentToDelete(null)
    } catch (err) {
      setError(err.message)
    }
  }

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="dashboard-container">
      <Sidebar role="admin" />

      <div className="main-content">
        <Header user={user} onLogout={onLogout} title="Gestion des Étudiants" />

        <div className="students-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Rechercher un étudiant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <Link to="/admin/add-student" className="add-button">
            <i className="fas fa-plus"></i> Ajouter un étudiant
          </Link>
        </div>

        {loading ? (
          <div className="loading">Chargement des étudiants...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="students-table-container">
            <table className="students-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Date d'inscription</th>
                  <th>Emprunts</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td>{student.id}</td>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>{new Date(student.createdAt).toLocaleDateString()}</td>
                      <td>{student.borrowingsCount || 0}</td>
                      <td className="actions-cell">
                        <button className="edit-button">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="delete-button" onClick={() => handleDeleteClick(student)}>
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-results">
                      Aucun étudiant trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Confirmer la suppression</h2>
              <p>
                Êtes-vous sûr de vouloir supprimer l'étudiant {studentToDelete?.name} ? Cette action est irréversible.
              </p>
              <div className="modal-actions">
                <button className="cancel-button" onClick={() => setShowDeleteModal(false)}>
                  Annuler
                </button>
                <button className="delete-button" onClick={handleConfirmDelete}>
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Students
