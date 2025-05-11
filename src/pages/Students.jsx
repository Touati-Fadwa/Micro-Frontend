"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import { API_URL } from "../config"

const Students = ({ user, onLogout }) => {
  const [students, setStudents] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [studentToDelete, setStudentToDelete] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [studentsPerPage] = useState(8)
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "ascending" })
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    withBorrowings: 0,
  })
  const [selectedStudents, setSelectedStudents] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false)
  const [advancedFilters, setAdvancedFilters] = useState({
    dateFrom: "",
    dateTo: "",
    borrowingsMin: "",
    borrowingsMax: "",
  })

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true)
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

        // Ajouter des propriétés supplémentaires pour la démonstration
        const enhancedData = data.map((student) => ({
          ...student,
          status: Math.random() > 0.2 ? "active" : "inactive",
          borrowingsCount: Math.floor(Math.random() * 10),
          lastActivity: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
        }))

        setStudents(enhancedData)
        setFilteredStudents(enhancedData)

        // Calculer les statistiques
        setStats({
          total: enhancedData.length,
          active: enhancedData.filter((s) => s.status === "active").length,
          inactive: enhancedData.filter((s) => s.status === "inactive").length,
          withBorrowings: enhancedData.filter((s) => s.borrowingsCount > 0).length,
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [user.token])

  useEffect(() => {
    // Appliquer les filtres et la recherche
    let result = [...students]

    // Filtre par statut
    if (selectedFilter !== "all") {
      result = result.filter((student) => student.status === selectedFilter)
    }

    // Recherche par nom ou email
    if (searchTerm) {
      result = result.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtres avancés
    if (advancedFilters.dateFrom) {
      const dateFrom = new Date(advancedFilters.dateFrom)
      result = result.filter((student) => new Date(student.createdAt) >= dateFrom)
    }

    if (advancedFilters.dateTo) {
      const dateTo = new Date(advancedFilters.dateTo)
      result = result.filter((student) => new Date(student.createdAt) <= dateTo)
    }

    if (advancedFilters.borrowingsMin) {
      result = result.filter((student) => student.borrowingsCount >= Number.parseInt(advancedFilters.borrowingsMin))
    }

    if (advancedFilters.borrowingsMax) {
      result = result.filter((student) => student.borrowingsCount <= Number.parseInt(advancedFilters.borrowingsMax))
    }

    // Tri
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1
        }
        return 0
      })
    }

    setFilteredStudents(result)
    setCurrentPage(1) // Réinitialiser à la première page après filtrage
  }, [students, searchTerm, sortConfig, selectedFilter, advancedFilters])

  // Pagination
  const indexOfLastStudent = currentPage * studentsPerPage
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent)
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

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

  const handleSort = (key) => {
    let direction = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  const handleSelectStudent = (studentId) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter((id) => id !== studentId))
    } else {
      setSelectedStudents([...selectedStudents, studentId])
    }
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedStudents([])
    } else {
      setSelectedStudents(currentStudents.map((student) => student.id))
    }
    setSelectAll(!selectAll)
  }

  const handleBulkDelete = () => {
    if (selectedStudents.length === 0) return
    // Dans une application réelle, vous implémenteriez la suppression en masse ici
    alert(`${selectedStudents.length} étudiants sélectionnés pour suppression`)
  }

  const handleAdvancedSearchToggle = () => {
    setIsAdvancedSearchOpen(!isAdvancedSearchOpen)
  }

  const handleAdvancedFilterChange = (e) => {
    const { name, value } = e.target
    setAdvancedFilters({
      ...advancedFilters,
      [name]: value,
    })
  }

  const resetAdvancedFilters = () => {
    setAdvancedFilters({
      dateFrom: "",
      dateTo: "",
      borrowingsMin: "",
      borrowingsMax: "",
    })
  }

  const getStatusClass = (status) => {
    return status === "active" ? "status-active" : "status-inactive"
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <div className="dashboard-container">
      <Sidebar role="admin" />

      <div className="main-content">
        <Header user={user} onLogout={onLogout} title="Gestion des Étudiants" />

        <div className="page-header">
          <div className="header-content">
            <h1>
              <i className="fas fa-user-graduate"></i> Étudiants
            </h1>
            <p>Gérez les comptes étudiants, consultez leurs activités et leurs emprunts</p>
          </div>
          <div className="header-actions">
            <Link to="/admin/add-student" className="btn-primary">
              <i className="fas fa-user-plus"></i> Ajouter un étudiant
            </Link>
            <button className="btn-secondary" onClick={() => alert("Export en CSV")}>
              <i className="fas fa-file-export"></i> Exporter
            </button>
          </div>
        </div>

        <div className="stats-summary">
          <div className="stat-card mini">
            <div className="stat-icon blue">
              <i className="fas fa-users"></i>
            </div>
            <div className="stat-content">
              <h3>Total</h3>
              <div className="stat-value">{stats.total}</div>
            </div>
          </div>

          <div className="stat-card mini">
            <div className="stat-icon green">
              <i className="fas fa-user-check"></i>
            </div>
            <div className="stat-content">
              <h3>Actifs</h3>
              <div className="stat-value">{stats.active}</div>
            </div>
          </div>

          <div className="stat-card mini">
            <div className="stat-icon orange">
              <i className="fas fa-user-clock"></i>
            </div>
            <div className="stat-content">
              <h3>Inactifs</h3>
              <div className="stat-value">{stats.inactive}</div>
            </div>
          </div>

          <div className="stat-card mini">
            <div className="stat-icon purple">
              <i className="fas fa-book-reader"></i>
            </div>
            <div className="stat-content">
              <h3>Avec emprunts</h3>
              <div className="stat-value">{stats.withBorrowings}</div>
            </div>
          </div>
        </div>

        <div className="filter-controls">
          <div className="search-container">
            <div className="search-input-wrapper">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                placeholder="Rechercher un étudiant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button className="clear-search" onClick={() => setSearchTerm("")}>
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
            <button className="advanced-search-toggle" onClick={handleAdvancedSearchToggle}>
              <i className={`fas fa-filter ${isAdvancedSearchOpen ? "active" : ""}`}></i>
              Filtres avancés
            </button>
          </div>

          <div className="filter-buttons">
            <button
              className={`filter-button ${selectedFilter === "all" ? "active" : ""}`}
              onClick={() => setSelectedFilter("all")}
            >
              Tous
            </button>
            <button
              className={`filter-button ${selectedFilter === "active" ? "active" : ""}`}
              onClick={() => setSelectedFilter("active")}
            >
              Actifs
            </button>
            <button
              className={`filter-button ${selectedFilter === "inactive" ? "active" : ""}`}
              onClick={() => setSelectedFilter("inactive")}
            >
              Inactifs
            </button>
          </div>
        </div>

        {isAdvancedSearchOpen && (
          <div className="advanced-search-panel">
            <div className="advanced-search-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Date d'inscription (début)</label>
                  <input
                    type="date"
                    name="dateFrom"
                    value={advancedFilters.dateFrom}
                    onChange={handleAdvancedFilterChange}
                  />
                </div>
                <div className="form-group">
                  <label>Date d'inscription (fin)</label>
                  <input
                    type="date"
                    name="dateTo"
                    value={advancedFilters.dateTo}
                    onChange={handleAdvancedFilterChange}
                  />
                </div>
                <div className="form-group">
                  <label>Emprunts (min)</label>
                  <input
                    type="number"
                    name="borrowingsMin"
                    value={advancedFilters.borrowingsMin}
                    onChange={handleAdvancedFilterChange}
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Emprunts (max)</label>
                  <input
                    type="number"
                    name="borrowingsMax"
                    value={advancedFilters.borrowingsMax}
                    onChange={handleAdvancedFilterChange}
                    min="0"
                  />
                </div>
              </div>
              <div className="form-actions">
                <button className="btn-secondary" onClick={resetAdvancedFilters}>
                  <i className="fas fa-undo"></i> Réinitialiser
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Chargement des étudiants...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            <span>{error}</span>
          </div>
        ) : (
          <>
            <div className="bulk-actions">
              <div className="selected-count">
                {selectedStudents.length > 0 ? (
                  <span>{selectedStudents.length} étudiant(s) sélectionné(s)</span>
                ) : (
                  <span>Aucun étudiant sélectionné</span>
                )}
              </div>
              <div className="bulk-buttons">
                <button className="btn-danger" disabled={selectedStudents.length === 0} onClick={handleBulkDelete}>
                  <i className="fas fa-trash"></i> Supprimer
                </button>
                <button
                  className="btn-secondary"
                  disabled={selectedStudents.length === 0}
                  onClick={() => alert("Envoi d'email en masse")}
                >
                  <i className="fas fa-envelope"></i> Envoyer un email
                </button>
              </div>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th className="checkbox-cell">
                      <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                    </th>
                    <th className="sortable" onClick={() => handleSort("id")}>
                      ID
                      {sortConfig.key === "id" && (
                        <i className={`fas fa-sort-${sortConfig.direction === "ascending" ? "up" : "down"}`}></i>
                      )}
                    </th>
                    <th className="sortable" onClick={() => handleSort("name")}>
                      Nom
                      {sortConfig.key === "name" && (
                        <i className={`fas fa-sort-${sortConfig.direction === "ascending" ? "up" : "down"}`}></i>
                      )}
                    </th>
                    <th className="sortable" onClick={() => handleSort("email")}>
                      Email
                      {sortConfig.key === "email" && (
                        <i className={`fas fa-sort-${sortConfig.direction === "ascending" ? "up" : "down"}`}></i>
                      )}
                    </th>
                    <th className="sortable" onClick={() => handleSort("createdAt")}>
                      Date d'inscription
                      {sortConfig.key === "createdAt" && (
                        <i className={`fas fa-sort-${sortConfig.direction === "ascending" ? "up" : "down"}`}></i>
                      )}
                    </th>
                    <th className="sortable" onClick={() => handleSort("status")}>
                      Statut
                      {sortConfig.key === "status" && (
                        <i className={`fas fa-sort-${sortConfig.direction === "ascending" ? "up" : "down"}`}></i>
                      )}
                    </th>
                    <th className="sortable" onClick={() => handleSort("borrowingsCount")}>
                      Emprunts
                      {sortConfig.key === "borrowingsCount" && (
                        <i className={`fas fa-sort-${sortConfig.direction === "ascending" ? "up" : "down"}`}></i>
                      )}
                    </th>
                    <th className="sortable" onClick={() => handleSort("lastActivity")}>
                      Dernière activité
                      {sortConfig.key === "lastActivity" && (
                        <i className={`fas fa-sort-${sortConfig.direction === "ascending" ? "up" : "down"}`}></i>
                      )}
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentStudents.length > 0 ? (
                    currentStudents.map((student) => (
                      <tr key={student.id} className={selectedStudents.includes(student.id) ? "selected-row" : ""}>
                        <td className="checkbox-cell">
                          <input
                            type="checkbox"
                            checked={selectedStudents.includes(student.id)}
                            onChange={() => handleSelectStudent(student.id)}
                          />
                        </td>
                        <td>{student.id}</td>
                        <td className="name-cell">
                          <div className="student-avatar">{student.name.charAt(0).toUpperCase()}</div>
                          <span>{student.name}</span>
                        </td>
                        <td>{student.email}</td>
                        <td>{formatDate(student.createdAt)}</td>
                        <td>
                          <span className={`status-badge ${getStatusClass(student.status)}`}>
                            {student.status === "active" ? "Actif" : "Inactif"}
                          </span>
                        </td>
                        <td>
                          <div className="borrowings-count">
                            <span className="count">{student.borrowingsCount}</span>
                            {student.borrowingsCount > 0 && (
                              <Link to={`/admin/borrowings?student=${student.id}`} className="view-link">
                                <i className="fas fa-eye"></i>
                              </Link>
                            )}
                          </div>
                        </td>
                        <td>{formatDate(student.lastActivity)}</td>
                        <td className="actions-cell">
                          <div className="action-buttons">
                            <button className="action-button edit" title="Modifier">
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              className="action-button delete"
                              onClick={() => handleDeleteClick(student)}
                              title="Supprimer"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                            <div className="action-dropdown">
                              <button className="action-button more">
                                <i className="fas fa-ellipsis-v"></i>
                              </button>
                              <div className="dropdown-menu">
                                <a href="#" className="dropdown-item">
                                  <i className="fas fa-envelope"></i> Envoyer un email
                                </a>
                                <a href="#" className="dropdown-item">
                                  <i className="fas fa-key"></i> Réinitialiser le mot de passe
                                </a>
                                <a href="#" className="dropdown-item">
                                  <i className="fas fa-ban"></i> Désactiver le compte
                                </a>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="no-results">
                        <div className="no-results-content">
                          <i className="fas fa-search"></i>
                          <p>Aucun étudiant trouvé</p>
                          <button
                            className="btn-secondary"
                            onClick={() => {
                              setSearchTerm("")
                              setSelectedFilter("all")
                              resetAdvancedFilters()
                            }}
                          >
                            Réinitialiser les filtres
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {filteredStudents.length > 0 && (
              <div className="pagination-container">
                <div className="pagination-info">
                  Affichage de {indexOfFirstStudent + 1} à {Math.min(indexOfLastStudent, filteredStudents.length)} sur{" "}
                  {filteredStudents.length} étudiants
                </div>
                <div className="pagination">
                  <button className="pagination-button" onClick={() => paginate(1)} disabled={currentPage === 1}>
                    <i className="fas fa-angle-double-left"></i>
                  </button>
                  <button
                    className="pagination-button"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <i className="fas fa-angle-left"></i>
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Logique pour afficher les pages autour de la page courante
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }

                    return (
                      <button
                        key={pageNum}
                        className={`pagination-button ${currentPage === pageNum ? "active" : ""}`}
                        onClick={() => paginate(pageNum)}
                      >
                        {pageNum}
                      </button>
                    )
                  })}

                  <button
                    className="pagination-button"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <i className="fas fa-angle-right"></i>
                  </button>
                  <button
                    className="pagination-button"
                    onClick={() => paginate(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    <i className="fas fa-angle-double-right"></i>
                  </button>
                </div>
                <div className="per-page-selector">
                  <select
                    value={studentsPerPage}
                    onChange={(e) => {
                      // Dans une application réelle, vous implémenteriez le changement du nombre d'éléments par page
                      alert(`Changement à ${e.target.value} éléments par page`)
                    }}
                  >
                    <option value="8">8 par page</option>
                    <option value="16">16 par page</option>
                    <option value="32">32 par page</option>
                    <option value="64">64 par page</option>
                  </select>
                </div>
              </div>
            )}
          </>
        )}

        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>
                  <i className="fas fa-trash"></i> Confirmer la suppression
                </h2>
                <button className="modal-close" onClick={() => setShowDeleteModal(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="modal-body">
                <div className="warning-icon">
                  <i className="fas fa-exclamation-triangle"></i>
                </div>
                <p>
                  Êtes-vous sûr de vouloir supprimer l'étudiant <strong>{studentToDelete?.name}</strong> ?
                </p>
                <p className="warning-text">
                  Cette action est irréversible et supprimera toutes les données associées à cet étudiant.
                </p>

                {studentToDelete?.borrowingsCount > 0 && (
                  <div className="alert-box">
                    <i className="fas fa-exclamation-circle"></i>
                    <p>
                      Cet étudiant a actuellement <strong>{studentToDelete.borrowingsCount} emprunt(s)</strong>{" "}
                      actif(s). Veuillez vous assurer que tous les livres ont été retournés avant de supprimer ce
                      compte.
                    </p>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn-secondary" onClick={() => setShowDeleteModal(false)}>
                  Annuler
                </button>
                <button className="btn-danger" onClick={handleConfirmDelete}>
                  <i className="fas fa-trash"></i> Supprimer
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
