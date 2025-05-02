import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import { API_URL } from "../config"

const AddBook = ({ user, onLogout }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    publicationYear: "",
    publisher: "",
    categoryId: "",
    description: "",
    quantity: 1,
    coverImage: "",
  })
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      if (!user?.token) {
        setError("Token manquant. Veuillez vous reconnecter.")
        return
      }

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
        setError(err.message)
      }
    }

    fetchCategories()
  }, [user?.token])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const isValidURL = (url) => {
    const pattern = /^(https?:\/\/[^\s$.?#].[^\s]*)$/i
    return pattern.test(url)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    if (!user?.token) {
      setError("Token manquant. Veuillez vous reconnecter.")
      setLoading(false)
      return
    }

    // ✅ Validation URL de l'image
    if (formData.coverImage && !isValidURL(formData.coverImage)) {
      setError("L'URL de l'image de couverture n'est pas valide.")
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (response.status === 401) {
          onLogout()
          setError("Votre session a expiré. Veuillez vous reconnecter.")
          return
        }
        throw new Error(errorData.message || "Erreur lors de l'ajout du livre")
      }

      setSuccess(true)
      setFormData({
        title: "",
        author: "",
        isbn: "",
        publicationYear: "",
        publisher: "",
        categoryId: "",
        description: "",
        quantity: 1,
        coverImage: "",
      })

      setTimeout(() => {
        navigate("/admin/catalog")
      }, 2000)
    } catch (err) {
      setError(`Erreur: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (error || success) {
      setTimeout(() => {
        setError("")
        setSuccess(false)
      }, 5000)
    }
  }, [error, success])

  return (
    <div className="dashboard-container">
      <Sidebar role="admin" />

      <div className="main-content">
        <Header user={user} onLogout={onLogout} title="Ajouter un Livre" />

        <div className="form-container">
          {success && (
            <div className="success-message">
              Le livre a été ajouté avec succès! Redirection vers le catalogue...
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="add-book-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">Titre*</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Titre du livre"
                />
              </div>

              <div className="form-group">
                <label htmlFor="author">Auteur*</label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                  placeholder="Nom de l'auteur"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="isbn">ISBN</label>
                <input
                  type="text"
                  id="isbn"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                  placeholder="ISBN du livre"
                />
              </div>

              <div className="form-group">
                <label htmlFor="publicationYear">Année de publication</label>
                <input
                  type="number"
                  id="publicationYear"
                  name="publicationYear"
                  value={formData.publicationYear}
                  onChange={handleChange}
                  placeholder="Année de publication"
                  min="1000"
                  max={new Date().getFullYear()}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="publisher">Éditeur</label>
                <input
                  type="text"
                  id="publisher"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleChange}
                  placeholder="Nom de l'éditeur"
                />
              </div>

              <div className="form-group">
                <label htmlFor="categoryId">Catégorie*</label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="quantity">Quantité*</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="Nombre d'exemplaires"
                />
              </div>

              <div className="form-group">
                <label htmlFor="coverImage">URL de l'image de couverture</label>
                <input
                  type="url"
                  id="coverImage"
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleChange}
                  placeholder="URL de l'image de couverture"
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description du livre"
                rows="4"
              ></textarea>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={() => navigate("/admin/catalog")}
              >
                Annuler
              </button>
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? "Ajout en cours..." : "Ajouter le livre"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddBook
