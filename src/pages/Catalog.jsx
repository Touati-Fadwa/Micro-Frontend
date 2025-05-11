"use client"

import { useState, useEffect } from "react"
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import { API_URL } from "../config"
import "../assets/catalog-styles.css"

const Catalog = ({ user, onLogout }) => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [categories, setCategories] = useState([])
  const [viewMode, setViewMode] = useState("grid") // grid or list
  const [sortBy, setSortBy] = useState("title")
  const [sortOrder, setSortOrder] = useState("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)
  const [selectedBook, setSelectedBook] = useState(null)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [yearFilter, setYearFilter] = useState("")
  const [availabilityFilter, setAvailabilityFilter] = useState("all")

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_URL}/api/books`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Erreur lors du chargement des livres")
        }

        const data = await response.json()
        setBooks(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/api/books/categories`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Erreur lors du chargement des catégories")
        }

        const data = await response.json()
        setCategories(data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchBooks()
    fetchCategories()
  }, [user.token])

  // Filtrer les livres
  const filteredBooks = books.filter((book) => {
    // Filtre de recherche
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtre de catégorie
    const matchesCategory = selectedCategory ? book.category === selectedCategory : true

    // Filtre d'année
    const matchesYear = yearFilter ? book.publicationYear === Number.parseInt(yearFilter) : true

    // Filtre de disponibilité
    const matchesAvailability =
      availabilityFilter === "all" ? true : availabilityFilter === "available" ? book.available : !book.available

    return matchesSearch && matchesCategory && matchesYear && matchesAvailability
  })

  // Trier les livres
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    let comparison = 0

    if (sortBy === "title") {
      comparison = a.title.localeCompare(b.title)
    } else if (sortBy === "author") {
      comparison = a.author.localeCompare(b.author)
    } else if (sortBy === "year") {
      comparison = (a.publicationYear || 0) - (b.publicationYear || 0)
    } else if (sortBy === "popularity") {
      comparison = (b.borrowCount || 0) - (a.borrowCount || 0)
    }

    return sortOrder === "asc" ? comparison : -comparison
  })

  // Pagination
  const indexOfLastBook = currentPage * itemsPerPage
  const indexOfFirstBook = indexOfLastBook - itemsPerPage
  const currentBooks = sortedBooks.slice(indexOfFirstBook, indexOfLastBook)
  const totalPages = Math.ceil(sortedBooks.length / itemsPerPage)

  // Statistiques
  const totalBooks = books.length
  const availableBooks = books.filter((book) => book.available).length
  const borrowedBooks = totalBooks - availableBooks
  const popularBooks = [...books].sort((a, b) => (b.borrowCount || 0) - (a.borrowCount || 0)).slice(0, 5)

  // Gestionnaires d'événements
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }

  const handleBookClick = (book) => {
    setSelectedBook(book)
  }

  const closeBookDetails = () => {
    setSelectedBook(null)
  }

  const resetFilters = () => {
    setSearchTerm("")
    setSelectedCategory("")
    setYearFilter("")
    setAvailabilityFilter("all")
    setShowAdvancedFilters(false)
  }

  return (
    <div className="dashboard-container">
      <Sidebar role={user.role} />

      <div className="main-content">
        <Header user={user} onLogout={onLogout} title="Catalogue des Livres" />

        {/* En-tête du catalogue */}
        <div className="catalog-header">
          <div className="catalog-header-content">
            <h1>Bibliothèque Numérique</h1>
            <p>Explorez notre collection de livres et trouvez votre prochaine lecture</p>
          </div>
        </div>

        {/* Statistiques */}
        <div className="catalog-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-book"></i>
            </div>
            <div className="stat-info">
              <h3>Total</h3>
              <div className="stat-value">{totalBooks}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon available">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-info">
              <h3>Disponibles</h3>
              <div className="stat-value">{availableBooks}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon borrowed">
              <i className="fas fa-user-clock"></i>
            </div>
            <div className="stat-info">
              <h3>Empruntés</h3>
              <div className="stat-value">{borrowedBooks}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon categories">
              <i className="fas fa-tags"></i>
            </div>
            <div className="stat-info">
              <h3>Catégories</h3>
              <div className="stat-value">{categories.length}</div>
            </div>
          </div>
        </div>

        {/* Contrôles de recherche et filtres */}
        <div className="catalog-controls">
          <div className="search-container">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              placeholder="Rechercher par titre ou auteur..."
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

          <div className="filter-container">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-filter"
            >
              <option value="">Toutes les catégories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <button
              className={`advanced-filter-toggle ${showAdvancedFilters ? "active" : ""}`}
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <i className="fas fa-sliders-h"></i>
              Filtres avancés
            </button>

            <div className="view-options">
              <button
                className={`view-option ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
              >
                <i className="fas fa-th"></i>
              </button>
              <button
                className={`view-option ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
              >
                <i className="fas fa-list"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Filtres avancés */}
        {showAdvancedFilters && (
          <div className="advanced-filters">
            <div className="filter-group">
              <label>Année de publication</label>
              <input
                type="number"
                placeholder="Année"
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="year-filter"
              />
            </div>

            <div className="filter-group">
              <label>Disponibilité</label>
              <div className="availability-options">
                <label className={`availability-option ${availabilityFilter === "all" ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="availability"
                    checked={availabilityFilter === "all"}
                    onChange={() => setAvailabilityFilter("all")}
                  />
                  <span>Tous</span>
                </label>
                <label className={`availability-option ${availabilityFilter === "available" ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="availability"
                    checked={availabilityFilter === "available"}
                    onChange={() => setAvailabilityFilter("available")}
                  />
                  <span>Disponibles</span>
                </label>
                <label className={`availability-option ${availabilityFilter === "borrowed" ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="availability"
                    checked={availabilityFilter === "borrowed"}
                    onChange={() => setAvailabilityFilter("borrowed")}
                  />
                  <span>Empruntés</span>
                </label>
              </div>
            </div>

            <div className="filter-group">
              <label>Trier par</label>
              <div className="sort-options">
                <select value={sortBy} onChange={(e) => handleSort(e.target.value)} className="sort-select">
                  <option value="title">Titre</option>
                  <option value="author">Auteur</option>
                  <option value="year">Année</option>
                  <option value="popularity">Popularité</option>
                </select>
                <button className="sort-direction" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                  <i className={`fas fa-sort-${sortOrder === "asc" ? "up" : "down"}`}></i>
                </button>
              </div>
            </div>

            <button className="reset-filters" onClick={resetFilters}>
              <i className="fas fa-undo"></i>
              Réinitialiser
            </button>
          </div>
        )}

        {/* Résultats */}
        <div className="catalog-results">
          <div className="results-header">
            <div className="results-count">
              {filteredBooks.length} livre{filteredBooks.length !== 1 ? "s" : ""} trouvé
              {filteredBooks.length !== 1 ? "s" : ""}
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Chargement des livres...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              <p>{error}</p>
            </div>
          ) : currentBooks.length > 0 ? (
            <div className={`books-${viewMode}`}>
              {currentBooks.map((book) => (
                <div key={book.id} className={`book-card ${viewMode}`} onClick={() => handleBookClick(book)}>
                  <div className="book-cover">
                    <img src={book.coverImage || "/placeholder.svg?height=200&width=130"} alt={book.title} />
                    <div className={`book-status-badge ${book.available ? "available" : "borrowed"}`}>
                      {book.available ? "Disponible" : "Emprunté"}
                    </div>
                  </div>
                  <div className="book-details">
                    <h3 className="book-title">{book.title}</h3>
                    <p className="book-author">Par {book.author}</p>
                    <p className="book-category">
                      <span className="category-badge">{book.categoryName}</span>
                    </p>
                    {viewMode === "list" && (
                      <>
                        <p className="book-description">{book.description?.substring(0, 150)}...</p>
                        <div className="book-meta">
                          {book.publicationYear && (
                            <span>
                              <i className="fas fa-calendar-alt"></i> {book.publicationYear}
                            </span>
                          )}
                          {book.publisher && (
                            <span>
                              <i className="fas fa-building"></i> {book.publisher}
                            </span>
                          )}
                          {book.borrowCount > 0 && (
                            <span>
                              <i className="fas fa-users"></i> {book.borrowCount} emprunt(s)
                            </span>
                          )}
                        </div>
                      </>
                    )}
                    <div className="book-actions">
                      {user.role === "admin" && (
                        <>
                          <button className="edit-button">
                            <i className="fas fa-edit"></i>
                            {viewMode === "list" && <span>Modifier</span>}
                          </button>
                          <button className="delete-button">
                            <i className="fas fa-trash-alt"></i>
                            {viewMode === "list" && <span>Supprimer</span>}
                          </button>
                        </>
                      )}
                      {user.role === "student" && book.available && (
                        <button className="borrow-button">
                          <i className="fas fa-hand-holding"></i>
                          {viewMode === "list" && <span>Emprunter</span>}
                        </button>
                      )}
                      <button className="details-button">
                        <i className="fas fa-info-circle"></i>
                        {viewMode === "list" && <span>Détails</span>}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <div className="no-results-icon">
                <i className="fas fa-search"></i>
              </div>
              <h3>Aucun livre trouvé</h3>
              <p>Essayez de modifier vos critères de recherche ou de réinitialiser les filtres.</p>
              <button className="reset-search-button" onClick={resetFilters}>
                Réinitialiser la recherche
              </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && !error && filteredBooks.length > 0 && (
          <div className="pagination-container">
            <div className="items-per-page">
              <span>Afficher</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value))
                  setCurrentPage(1)
                }}
              >
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={48}>48</option>
              </select>
              <span>par page</span>
            </div>

            <div className="pagination">
              <button className="pagination-button" disabled={currentPage === 1} onClick={() => handlePageChange(1)}>
                <i className="fas fa-angle-double-left"></i>
              </button>
              <button
                className="pagination-button"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <i className="fas fa-angle-left"></i>
              </button>

              <div className="pagination-info">
                Page <span className="current-page">{currentPage}</span> sur{" "}
                <span className="total-pages">{totalPages}</span>
              </div>

              <button
                className="pagination-button"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                <i className="fas fa-angle-right"></i>
              </button>
              <button
                className="pagination-button"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(totalPages)}
              >
                <i className="fas fa-angle-double-right"></i>
              </button>
            </div>
          </div>
        )}

        {/* Modal de détails du livre */}
        {selectedBook && (
          <div className="book-modal-overlay" onClick={closeBookDetails}>
            <div className="book-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-modal" onClick={closeBookDetails}>
                <i className="fas fa-times"></i>
              </button>

              <div className="book-modal-header">
                <div className="book-modal-cover">
                  <img
                    src={selectedBook.coverImage || "/placeholder.svg?height=300&width=200"}
                    alt={selectedBook.title}
                  />
                </div>
                <div className="book-modal-info">
                  <h2>{selectedBook.title}</h2>
                  <p className="book-modal-author">Par {selectedBook.author}</p>
                  <div className="book-modal-meta">
                    <span className="category-badge">{selectedBook.categoryName}</span>
                    {selectedBook.publicationYear && <span className="year-badge">{selectedBook.publicationYear}</span>}
                    <span className={`availability-badge ${selectedBook.available ? "available" : "borrowed"}`}>
                      {selectedBook.available ? "Disponible" : "Emprunté"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="book-modal-body">
                <div className="book-modal-section">
                  <h3>Description</h3>
                  <p>{selectedBook.description || "Aucune description disponible."}</p>
                </div>

                <div className="book-modal-section">
                  <h3>Détails</h3>
                  <div className="book-details-grid">
                    <div className="detail-item">
                      <span className="detail-label">ISBN</span>
                      <span className="detail-value">{selectedBook.isbn || "Non spécifié"}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Éditeur</span>
                      <span className="detail-value">{selectedBook.publisher || "Non spécifié"}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Langue</span>
                      <span className="detail-value">{selectedBook.language || "Non spécifié"}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Pages</span>
                      <span className="detail-value">{selectedBook.pages || "Non spécifié"}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Emprunts</span>
                      <span className="detail-value">{selectedBook.borrowCount || 0}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Ajouté le</span>
                      <span className="detail-value">
                        {selectedBook.createdAt
                          ? new Date(selectedBook.createdAt).toLocaleDateString()
                          : "Non spécifié"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="book-modal-actions">
                {user.role === "admin" ? (
                  <>
                    <button className="edit-button">
                      <i className="fas fa-edit"></i>
                      Modifier
                    </button>
                    <button className="delete-button">
                      <i className="fas fa-trash-alt"></i>
                      Supprimer
                    </button>
                  </>
                ) : (
                  selectedBook.available && (
                    <button className="borrow-button">
                      <i className="fas fa-hand-holding"></i>
                      Emprunter ce livre
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Catalog
