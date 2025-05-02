"use client"

import { useState, useEffect } from "react"
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import { API_URL } from "../config"

const Catalog = ({ user, onLogout }) => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchBooks = async () => {
      try {
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

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory ? book.category === selectedCategory : true
    return matchesSearch && matchesCategory
  })

  return (
    <div className="dashboard-container">
      <Sidebar role="admin" />

      <div className="main-content">
        <Header user={user} onLogout={onLogout} title="Catalogue des Livres" />

        <div className="catalog-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Rechercher par titre ou auteur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
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
          </div>
        </div>

        {loading ? (
          <div className="loading">Chargement des livres...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="books-grid">
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
                <div key={book.id} className="book-card">
                  <div className="book-cover">
                    <img src={book.coverImage || "/placeholder.svg?height=150&width=100"} alt={book.title} />
                  </div>
                  <div className="book-details">
                    <h3>{book.title}</h3>
                    <p className="book-author">Par {book.author}</p>
                    <p className="book-category">{book.categoryName}</p>
                    <p className="book-status">
                      <span className={`status-indicator ${book.available ? "available" : "borrowed"}`}></span>
                      {book.available ? "Disponible" : "Emprunté"}
                    </p>
                    <div className="book-actions">
                      <button className="edit-button">Modifier</button>
                      <button className="delete-button">Supprimer</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">Aucun livre trouvé</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Catalog
