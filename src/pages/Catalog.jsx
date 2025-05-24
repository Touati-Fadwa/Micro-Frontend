"use client"

import { useState, useEffect } from "react"
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import { API_URL } from "../config"

const Catalog = ({ user, onLogout }) => {
  // États
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [categories, setCategories] = useState([])
  const [viewMode, setViewMode] = useState("grid")
  const [sortBy, setSortBy] = useState("title")
  const [sortOrder, setSortOrder] = useState("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)
  const [selectedBook, setSelectedBook] = useState(null)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [yearFilter, setYearFilter] = useState("")
  const [availabilityFilter, setAvailabilityFilter] = useState("all")
  const [deletingId, setDeletingId] = useState(null)
  const [editingBook, setEditingBook] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)

  // Chargement des données
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [booksRes, categoriesRes] = await Promise.all([
          fetch(`${API_URL}/api/books`, { headers: { Authorization: `Bearer ${user.token}` } }),
          fetch(`${API_URL}/api/books/categories`, { headers: { Authorization: `Bearer ${user.token}` } })
        ])

        if (!booksRes.ok) throw new Error("Erreur lors du chargement des livres")
        if (!categoriesRes.ok) throw new Error("Erreur lors du chargement des catégories")

        const [booksData, categoriesData] = await Promise.all([booksRes.json(), categoriesRes.json()])
        setBooks(booksData)
        setCategories(categoriesData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user.token])

  // Suppression d'un livre
  const handleDelete = async (bookId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce livre ?")) return
    
    setDeletingId(bookId)
    try {
      const response = await fetch(`${API_URL}/api/books/${bookId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` }
      })

      if (!response.ok) throw new Error("Erreur lors de la suppression")

      setBooks(books.filter(book => book.id !== bookId))
      if (selectedBook?.id === bookId) setSelectedBook(null)
    } catch (err) {
      alert(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  // Modification d'un livre
  const handleEdit = (book) => {
    setEditingBook(book)
    setShowEditModal(true)
  }

  const handleSaveEdit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_URL}/api/books/${editingBook.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(editingBook)
      })

      if (!response.ok) throw new Error("Erreur lors de la mise à jour")

      setBooks(books.map(book => book.id === editingBook.id ? editingBook : book))
      setShowEditModal(false)
      if (selectedBook?.id === editingBook.id) setSelectedBook(editingBook)
    } catch (err) {
      alert(err.message)
    }
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditingBook(prev => ({ ...prev, [name]: value }))
  }

  // Filtrage et tri
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         book.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory ? book.categoryId === selectedCategory : true
    const matchesYear = yearFilter ? book.publicationYear === parseInt(yearFilter) : true
    const matchesAvailability = availabilityFilter === "all" ? true : 
                              availabilityFilter === "available" ? book.available : !book.available

    return matchesSearch && matchesCategory && matchesYear && matchesAvailability
  })

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortBy === "title") return a.title.localeCompare(b.title) * (sortOrder === "asc" ? 1 : -1)
    if (sortBy === "author") return a.author.localeCompare(b.author) * (sortOrder === "asc" ? 1 : -1)
    if (sortBy === "year") return (a.publicationYear - b.publicationYear) * (sortOrder === "asc" ? 1 : -1)
    if (sortBy === "popularity") return (b.borrowCount - a.borrowCount) * (sortOrder === "asc" ? 1 : -1)
    return 0
  })

  // Pagination
  const indexOfLastBook = currentPage * itemsPerPage
  const indexOfFirstBook = indexOfLastBook - itemsPerPage
  const currentBooks = sortedBooks.slice(indexOfFirstBook, indexOfLastBook)
  const totalPages = Math.ceil(sortedBooks.length / itemsPerPage)

  // Autres fonctions
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

  // Statistiques
  const totalBooks = books.length
  const availableBooks = books.filter(book => book.available).length
  const borrowedBooks = totalBooks - availableBooks

  return (
    <div className="dashboard-container">
      <Sidebar role={user.role} />

      <div className="main-content">
        <Header user={user} onLogout={onLogout} title="Catalogue des Livres" />

        {/* En-tête et statistiques */}
        <div className="catalog-header">
          <div className="catalog-header-content">
            <h1>Bibliothèque Numérique</h1>
            <p>Explorez notre collection de livres et trouvez votre prochaine lecture</p>
          </div>
        </div>

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

        {/* Contrôles de recherche */}
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
                          <button 
                            className="edit-button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEdit(book)
                            }}
                          >
                            <i className="fas fa-edit"></i>
                            {viewMode === "list" && <span>Modifier</span>}
                          </button>
                          <button 
                            className="delete-button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(book.id)
                            }}
                            disabled={deletingId === book.id}
                          >
                            {deletingId === book.id ? (
                              <i className="fas fa-spinner fa-spin"></i>
                            ) : (
                              <>
                                <i className="fas fa-trash-alt"></i>
                                {viewMode === "list" && <span>Supprimer</span>}
                              </>
                            )}
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

        {/* Modal de détails */}
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
                    <button 
                      className="edit-button"
                      onClick={() => handleEdit(selectedBook)}
                    >
                      <i className="fas fa-edit"></i>
                      Modifier
                    </button>
                    <button 
                      className="delete-button"
                      onClick={() => handleDelete(selectedBook.id)}
                      disabled={deletingId === selectedBook.id}
                    >
                      {deletingId === selectedBook.id ? (
                        <i className="fas fa-spinner fa-spin"></i>
                      ) : (
                        <>
                          <i className="fas fa-trash-alt"></i>
                          Supprimer
                        </>
                      )}
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

        {/* Modal d'édition */}
        {showEditModal && editingBook && (
          <div className="edit-modal-overlay" onClick={() => setShowEditModal(false)}>
            <div className="edit-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-edit-modal" onClick={() => setShowEditModal(false)}>
                <i className="fas fa-times"></i>
              </button>

              <h2>Modifier le livre</h2>
              
              <form onSubmit={handleSaveEdit}>
                <div className="form-group">
                  <label>Titre:</label>
                  <input
                    type="text"
                    name="title"
                    value={editingBook.title}
                    onChange={handleEditChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Auteur:</label>
                  <input
                    type="text"
                    name="author"
                    value={editingBook.author}
                    onChange={handleEditChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Catégorie:</label>
                  <select
                    name="categoryId"
                    value={editingBook.categoryId}
                    onChange={handleEditChange}
                    required
                  >
                    <option value="">Sélectionnez une catégorie</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Année de publication:</label>
                  <input
                    type="number"
                    name="publicationYear"
                    value={editingBook.publicationYear || ""}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="form-group">
                  <label>Éditeur:</label>
                  <input
                    type="text"
                    name="publisher"
                    value={editingBook.publisher || ""}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="form-group">
                  <label>Description:</label>
                  <textarea
                    name="description"
                    value={editingBook.description || ""}
                    onChange={handleEditChange}
                    rows="5"
                  />
                </div>

                <div className="form-group">
                  <label>Disponibilité:</label>
                  <select
                    name="available"
                    value={editingBook.available}
                    onChange={handleEditChange}
                  >
                    <option value={true}>Disponible</option>
                    <option value={false}>Emprunté</option>
                  </select>
                </div>

                <div className="edit-modal-buttons">
                  <button type="button" className="cancel-button" onClick={() => setShowEditModal(false)}>
                    Annuler
                  </button>
                  <button type="submit" className="save-button">
                    Enregistrer les modifications
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Styles */}
      <style jsx>{`
        .dashboard-container {
          display: flex;
          min-height: 100vh;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .main-content {
          flex: 1;
          padding: 20px;
          background-color: #f5f5f5;
        }
        
        .catalog-header {
          background-color: #2c3e50;
          color: white;
          padding: 2rem;
          margin-bottom: 1.5rem;
          border-radius: 8px;
        }
        
        .catalog-header-content h1 {
          margin: 0;
          font-size: 2rem;
        }
        
        .catalog-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .stat-card {
          background: white;
          border-radius: 8px;
          padding: 1rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
        }
        
        .stat-icon {
          margin-right: 1rem;
          font-size: 1.5rem;
          color: #3498db;
        }
        
        .stat-icon.available {
          color: #2ecc71;
        }
        
        .stat-icon.borrowed {
          color: #e74c3c;
        }
        
        .stat-icon.categories {
          color: #9b59b6;
        }
        
        .stat-info h3 {
          margin: 0;
          font-size: 1rem;
          color: #7f8c8d;
        }
        
        .stat-value {
          font-size: 1.5rem;
          font-weight: bold;
          color: #2c3e50;
        }
        
        .catalog-controls {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .search-container {
          flex: 1;
          min-width: 250px;
          position: relative;
        }
        
        .search-input {
          width: 100%;
          padding: 0.5rem 2rem 0.5rem 1rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }
        
        .search-icon {
          position: absolute;
          left: 0.5rem;
          top: 50%;
          transform: translateY(-50%);
          color: #7f8c8d;
        }
        
        .clear-search {
          position: absolute;
          right: 0.5rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #7f8c8d;
          cursor: pointer;
        }
        
        .filter-container {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        
        .category-filter {
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }
        
        .advanced-filter-toggle {
          background: none;
          border: 1px solid #3498db;
          color: #3498db;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .advanced-filter-toggle.active {
          background-color: #3498db;
          color: white;
        }
        
        .view-options {
          display: flex;
          gap: 0.5rem;
        }
        
        .view-option {
          background: none;
          border: 1px solid #ddd;
          padding: 0.5rem;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .view-option.active {
          background-color: #3498db;
          color: white;
          border-color: #3498db;
        }
        
        .advanced-filters {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .filter-group {
          margin-bottom: 1rem;
        }
        
        .filter-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        
        .year-filter {
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          width: 100%;
        }
        
        .availability-options {
          display: flex;
          gap: 1rem;
        }
        
        .availability-option {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .availability-option.active {
          background-color: #f0f0f0;
        }
        
        .sort-options {
          display: flex;
          gap: 0.5rem;
        }
        
        .sort-select {
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        
        .sort-direction {
          background: none;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 0 0.5rem;
          cursor: pointer;
        }
        
        .reset-filters {
          background: none;
          border: none;
          color: #e74c3c;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .catalog-results {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        
        .results-count {
          color: #7f8c8d;
        }
        
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        
        .loading-spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          border-top: 4px solid #3498db;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .error-message {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #e74c3c;
          padding: 1rem;
          background-color: #fdecea;
          border-radius: 4px;
        }
        
        .books-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
        }
        
        .books-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .book-card {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: transform 0.2s;
        }
        
        .book-card:hover {
          transform: translateY(-5px);
        }
        
        .book-card.grid {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        
        .book-card.list {
          display: flex;
          gap: 1.5rem;
        }
        
        .book-cover {
          position: relative;
        }
        
        .book-card.grid .book-cover {
          height: 200px;
        }
        
        .book-card.list .book-cover {
          width: 150px;
          flex-shrink: 0;
        }
        
        .book-cover img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .book-status-badge {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: bold;
        }
        
        .book-status-badge.available {
          background-color: #2ecc71;
          color: white;
        }
        
        .book-status-badge.borrowed {
          background-color: #e74c3c;
          color: white;
        }
        
        .book-details {
          padding: 1rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .book-card.list .book-details {
          padding-right: 1.5rem;
        }
        
        .book-title {
          margin: 0 0 0.5rem 0;
          font-size: 1.1rem;
          color: #2c3e50;
        }
        
        .book-author {
          margin: 0 0 0.5rem 0;
          color: #7f8c8d;
          font-size: 0.9rem;
        }
        
        .book-category {
          margin: 0 0 0.5rem 0;
        }
        
        .category-badge {
          display: inline-block;
          background-color:rgb(135, 35, 35);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          color: #7f8c8d;
        }
        
        .book-description {
          margin: 0.5rem 0;
          color: #555;
          font-size: 0.9rem;
        }
        
        .book-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-top: 0.5rem;
          font-size: 0.8rem;
          color: #7f8c8d;
        }
        
        .book-meta span {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        
        .book-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }
        
        .edit-button, .delete-button, .borrow-button, .details-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.25rem;
          padding: 0.5rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
        }
        
        .edit-button {
          background-color: #3498db;
          color: white;
        }
        
        .delete-button {
          background-color: #e74c3c;
          color: white;
        }
        
        .delete-button:disabled {
          background-color: #95a5a6;
          cursor: not-allowed;
        }
        
        .borrow-button {
          background-color: #2ecc71;
          color: white;
        }
        
        .details-button {
          background-color: #f0f0f0;
          color: #2c3e50;
        }
        
        .no-results {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          text-align: center;
        }
        
        .no-results-icon {
          font-size: 3rem;
          color: #bdc3c7;
          margin-bottom: 1rem;
        }
        
        .no-results h3 {
          margin: 0 0 0.5rem 0;
          color: #2c3e50;
        }
        
        .no-results p {
          margin: 0 0 1.5rem 0;
          color: #7f8c8d;
        }
        
        .reset-search-button {
          background-color: #3498db;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .pagination-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1.5rem;
        }
        
        .items-per-page {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #7f8c8d;
        }
        
        .items-per-page select {
          padding: 0.25rem;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        
        .pagination {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .pagination-button {
          background: none;
          border: 1px solid #ddd;
          padding: 0.5rem;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .pagination-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .pagination-info {
          margin: 0 1rem;
          color: #7f8c8d;
        }
        
        .current-page {
          font-weight: bold;
          color: #2c3e50;
        }
        
        .book-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .book-modal-content {
          background-color: white;
          width: 90%;
          max-width: 800px;
          max-height: 90vh;
          border-radius: 8px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        
        .close-modal {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #7f8c8d;
        }
        
        .book-modal-header {
          display: flex;
          padding: 1.5rem;
          background-color: #f5f5f5;
        }
        
        .book-modal-cover {
          width: 200px;
          height: 300px;
          flex-shrink: 0;
          margin-right: 1.5rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .book-modal-cover img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .book-modal-info {
          flex: 1;
        }
        
        .book-modal-info h2 {
          margin: 0 0 0.5rem 0;
          color: #2c3e50;
        }
        
        .book-modal-author {
          margin: 0 0 1rem 0;
          color: #7f8c8d;
        }
        
        .book-modal-meta {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        
        .category-badge, .year-badge, .availability-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
        }
        
        .category-badge {
          background-color:rgb(239, 218, 239);
          color:rgb(187, 41, 150);
        }
        
        .year-badge {
          background-color: #e0f7fa;
          color: #00838f;
        }
        
        .availability-badge {
          font-weight: bold;
        }
        
        .availability-badge.available {
          background-color: #e8f5e9;
          color: #2e7d32;
        }
        
        .availability-badge.borrowed {
          background-color: #ffebee;
          color: #c62828;
        }
        
        .book-modal-body {
          padding: 1.5rem;
          overflow-y: auto;
        }
        
        .book-modal-section {
          margin-bottom: 1.5rem;
        }
        
        .book-modal-section h3 {
          margin: 0 0 1rem 0;
          color: #2c3e50;
          font-size: 1.2rem;
        }
        
        .book-modal-section p {
          margin: 0 0 1rem 0;
          color: #555;
          line-height: 1.5;
        }
        
        .book-details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }
        
        .detail-item {
          margin-bottom: 0.5rem;
        }
        
        .detail-label {
          display: block;
          font-weight: bold;
          color: #7f8c8d;
          font-size: 0.8rem;
        }
        
        .detail-value {
          color: #2c3e50;
        }
        
        .book-modal-actions {
          padding: 1rem 1.5rem;
          background-color: #f5f5f5;
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
        }
        
        /* Modal d'édition */
        .edit-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2000;
        }
        
        .edit-modal-content {
          background-color: white;
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          border-radius: 8px;
          padding: 2rem;
          position: relative;
          overflow-y: auto;
        }
        
        .close-edit-modal {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #7f8c8d;
        }
        
        .edit-modal-content h2 {
          margin-top: 0;
          margin-bottom: 1.5rem;
          color: #2c3e50;
        }
        
        .form-group {
          margin-bottom: 1.2rem;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #2c3e50;
        }
        
        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.6rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }
        
        .form-group textarea {
          min-height: 100px;
          resize: vertical;
        }
        
        .edit-modal-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
        }
        
        .cancel-button {
          background-color: #f0f0f0;
          color: #2c3e50;
          border: none;
          padding: 0.7rem 1.2rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }
        
        .save-button {
          background-color: #3498db;
          color: white;
          border: none;
          padding: 0.7rem 1.2rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }
        
        .cancel-button:hover {
          background-color: #e0e0e0;
        }
        
        .save-button:hover {
          background-color: #2980b9;
        }
      `}</style>
    </div>
  )
}

export default Catalog
