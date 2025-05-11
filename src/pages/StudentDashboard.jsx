"use client"

import { useState, useEffect } from "react"
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import { API_URL } from "../config"
import "../assets/student-dashboard-styles.css"

const StudentDashboard = ({ user, onLogout, onNavigate }) => {
  const [borrowings, setBorrowings] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true)

        // Fetch borrowings
        const borrowingsResponse = await fetch(`${API_URL}/books/borrowings/student`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })

        if (!borrowingsResponse.ok) {
          throw new Error("Erreur lors du chargement des emprunts")
        }

        const borrowingsData = await borrowingsResponse.json()
        setBorrowings(borrowingsData)

        // Fetch recommendations (mock data for now)
        // In a real app, this would be a separate API endpoint
        const mockRecommendations = [
          {
            id: 1,
            title: "Les Misérables",
            author: "Victor Hugo",
            coverImage: "/placeholder.svg?height=150&width=100",
            category: "Classique",
            rating: 4.8,
          },
          {
            id: 2,
            title: "1984",
            author: "George Orwell",
            coverImage: "/placeholder.svg?height=150&width=100",
            category: "Science-Fiction",
            rating: 4.7,
          },
          {
            id: 3,
            title: "Le Petit Prince",
            author: "Antoine de Saint-Exupéry",
            coverImage: "/placeholder.svg?height=150&width=100",
            category: "Conte",
            rating: 4.9,
          },
          {
            id: 4,
            title: "L'Étranger",
            author: "Albert Camus",
            coverImage: "/placeholder.svg?height=150&width=100",
            category: "Philosophie",
            rating: 4.6,
          },
        ]
        setRecommendations(mockRecommendations)

        // Generate notifications based on borrowings
        const today = new Date()
        const notificationsList = borrowingsData
          .filter((b) => !b.returnDate) // Only active borrowings
          .map((b) => {
            const dueDate = new Date(b.dueDate)
            const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24))

            if (daysLeft < 0) {
              return {
                id: `overdue-${b.id}`,
                type: "danger",
                message: `Le livre "${b.book.title}" est en retard de ${Math.abs(daysLeft)} jour(s).`,
                date: today.toISOString(),
                bookId: b.book.id,
              }
            } else if (daysLeft <= 3) {
              return {
                id: `due-soon-${b.id}`,
                type: "warning",
                message: `Le livre "${b.book.title}" doit être retourné dans ${daysLeft} jour(s).`,
                date: today.toISOString(),
                bookId: b.book.id,
              }
            }
            return null
          })
          .filter((n) => n !== null)

        // Add a welcome notification
        notificationsList.unshift({
          id: "welcome",
          type: "info",
          message: `Bienvenue ${user.name}! Découvrez nos nouvelles acquisitions.`,
          date: today.toISOString(),
        })

        setNotifications(notificationsList)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchStudentData()
  }, [user.token, user.name])

  // Calculer les statistiques
  const activeBorrowings = borrowings.filter((b) => !b.returnDate)
  const returnedBorrowings = borrowings.filter((b) => b.returnDate)
  const overdueBorrowings = activeBorrowings.filter((b) => new Date(b.dueDate) < new Date())

  // Trier les emprunts par date (les plus récents d'abord)
  const sortedBorrowings = [...borrowings].sort(
    (a, b) => new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime(),
  )

  // Obtenir les emprunts à venir (date de retour dans les 7 prochains jours)
  const today = new Date()
  const upcomingReturns = activeBorrowings
    .filter((b) => {
      const dueDate = new Date(b.dueDate)
      const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24))
      return daysLeft >= 0 && daysLeft <= 7
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

  // Formater la date pour l'affichage
  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Calculer les jours restants
  const getDaysLeft = (dueDate) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Générer une classe CSS basée sur les jours restants
  const getDueDateClass = (dueDate) => {
    const daysLeft = getDaysLeft(dueDate)
    if (daysLeft < 0) return "overdue"
    if (daysLeft <= 3) return "due-soon"
    return "on-time"
  }

  // Générer un texte basé sur les jours restants
  const getDueDateText = (dueDate) => {
    const daysLeft = getDaysLeft(dueDate)
    if (daysLeft < 0) return `En retard de ${Math.abs(daysLeft)} jour(s)`
    if (daysLeft === 0) return "À rendre aujourd'hui"
    if (daysLeft === 1) return "À rendre demain"
    return `${daysLeft} jours restants`
  }

  // Fermer une notification
  const dismissNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  return (
    <div className="dashboard-container">
      <Sidebar role="student" />

      <div className="main-content">
        <Header user={user} onLogout={onLogout} title="Tableau de Bord Étudiant" />

        {/* Bannière de bienvenue */}
        <div className="student-welcome-banner">
          <div className="welcome-content">
            <h1>Bienvenue, {user.name}!</h1>
            <p>Gérez vos emprunts et découvrez de nouvelles lectures</p>
            <button className="catalog-button" onClick={() => onNavigate("catalog")}>
              <i className="fas fa-book"></i> Accéder au catalogue
            </button>
          </div>
        </div>

        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="notifications-container">
            {notifications.map((notification) => (
              <div key={notification.id} className={`notification ${notification.type}`}>
                <div className="notification-icon">
                  {notification.type === "danger" && <i className="fas fa-exclamation-circle"></i>}
                  {notification.type === "warning" && <i className="fas fa-exclamation-triangle"></i>}
                  {notification.type === "info" && <i className="fas fa-info-circle"></i>}
                  {notification.type === "success" && <i className="fas fa-check-circle"></i>}
                </div>
                <div className="notification-content">
                  <p>{notification.message}</p>
                </div>
                <button className="dismiss-notification" onClick={() => dismissNotification(notification.id)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Statistiques */}
        <div className="student-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-book-reader"></i>
            </div>
            <div className="stat-info">
              <h3>Emprunts Actifs</h3>
              <div className="stat-value">{activeBorrowings.length}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon returned">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-info">
              <h3>Livres Retournés</h3>
              <div className="stat-value">{returnedBorrowings.length}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon overdue">
              <i className="fas fa-exclamation-circle"></i>
            </div>
            <div className="stat-info">
              <h3>En Retard</h3>
              <div className="stat-value">{overdueBorrowings.length}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon total">
              <i className="fas fa-history"></i>
            </div>
            <div className="stat-info">
              <h3>Total</h3>
              <div className="stat-value">{borrowings.length}</div>
            </div>
          </div>
        </div>

        {/* Navigation par onglets */}
        <div className="dashboard-tabs">
          <button
            className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <i className="fas fa-home"></i>
            Aperçu
          </button>
          <button
            className={`tab-button ${activeTab === "borrowings" ? "active" : ""}`}
            onClick={() => setActiveTab("borrowings")}
          >
            <i className="fas fa-book"></i>
            Mes Emprunts
          </button>
          <button
            className={`tab-button ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            <i className="fas fa-history"></i>
            Historique
          </button>
          <button
            className={`tab-button ${activeTab === "recommendations" ? "active" : ""}`}
            onClick={() => setActiveTab("recommendations")}
          >
            <i className="fas fa-star"></i>
            Recommandations
          </button>
        </div>

        {/* Contenu principal */}
        <div className="dashboard-content">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Chargement des données...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              <p>{error}</p>
            </div>
          ) : (
            <>
              {/* Onglet Aperçu */}
              {activeTab === "overview" && (
                <div className="dashboard-overview">
                  {/* Retours à venir */}
                  <div className="dashboard-section upcoming-returns">
                    <div className="section-header">
                      <h2>
                        <i className="fas fa-calendar-alt"></i> Retours à venir
                      </h2>
                    </div>

                    {upcomingReturns.length > 0 ? (
                      <div className="upcoming-returns-list">
                        {upcomingReturns.map((borrowing) => (
                          <div key={borrowing.id} className="upcoming-return-card">
                            <div className="return-book-cover">
                              <img
                                src={borrowing.book.coverImage || "/placeholder.svg?height=80&width=60"}
                                alt={borrowing.book.title}
                              />
                            </div>
                            <div className="return-details">
                              <h3>{borrowing.book.title}</h3>
                              <p className="return-author">Par {borrowing.book.author}</p>
                              <div className={`return-due-date ${getDueDateClass(borrowing.dueDate)}`}>
                                <i className="fas fa-clock"></i>
                                <span>{getDueDateText(borrowing.dueDate)}</span>
                              </div>
                            </div>
                            <div className="return-actions">
                              <button className="extend-button">
                                <i className="fas fa-calendar-plus"></i>
                                Prolonger
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-state">
                        <div className="empty-icon">
                          <i className="fas fa-calendar-check"></i>
                        </div>
                        <p>Vous n'avez pas de retours prévus dans les 7 prochains jours.</p>
                      </div>
                    )}
                  </div>

                  {/* Emprunts récents */}
                  <div className="dashboard-section recent-borrowings">
                    <div className="section-header">
                      <h2>
                        <i className="fas fa-clock"></i> Emprunts Récents
                      </h2>
                      <button className="view-all-button" onClick={() => setActiveTab("borrowings")}>
                        Voir tout <i className="fas fa-arrow-right"></i>
                      </button>
                    </div>

                    {sortedBorrowings.length > 0 ? (
                      <div className="recent-borrowings-grid">
                        {sortedBorrowings.slice(0, 4).map((borrowing) => (
                          <div key={borrowing.id} className="borrowing-card">
                            <div className="book-cover">
                              <img
                                src={borrowing.book.coverImage || "/placeholder.svg?height=150&width=100"}
                                alt={borrowing.book.title}
                              />
                              <div
                                className={`status-indicator ${borrowing.returnDate ? "returned" : new Date(borrowing.dueDate) < new Date() ? "overdue" : "active"}`}
                              >
                                {borrowing.returnDate
                                  ? "Retourné"
                                  : new Date(borrowing.dueDate) < new Date()
                                    ? "En retard"
                                    : "Emprunté"}
                              </div>
                            </div>
                            <div className="borrowing-details">
                              <h3>{borrowing.book.title}</h3>
                              <p className="book-author">Par {borrowing.book.author}</p>
                              <div className="borrowing-dates">
                                <div className="date-item">
                                  <i className="fas fa-arrow-circle-right"></i>
                                  <span>Emprunté le: {formatDate(borrowing.borrowDate)}</span>
                                </div>
                                <div className="date-item">
                                  <i className="fas fa-calendar-day"></i>
                                  <span>À retourner le: {formatDate(borrowing.dueDate)}</span>
                                </div>
                                {borrowing.returnDate && (
                                  <div className="date-item returned">
                                    <i className="fas fa-arrow-circle-left"></i>
                                    <span>Retourné le: {formatDate(borrowing.returnDate)}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-state">
                        <div className="empty-icon">
                          <i className="fas fa-book"></i>
                        </div>
                        <p>Vous n'avez pas encore emprunté de livres.</p>
                        <button className="action-button" onClick={() => onNavigate("catalog")}>
                          Parcourir le catalogue
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Recommandations */}
                  <div className="dashboard-section recommendations">
                    <div className="section-header">
                      <h2>
                        <i className="fas fa-lightbulb"></i> Recommandations pour vous
                      </h2>
                      <button className="view-all-button" onClick={() => setActiveTab("recommendations")}>
                        Voir tout <i className="fas fa-arrow-right"></i>
                      </button>
                    </div>

                    <div className="recommendations-grid">
                      {recommendations.map((book) => (
                        <div key={book.id} className="recommendation-card">
                          <div className="recommendation-cover">
                            <img src={book.coverImage || "/placeholder.svg"} alt={book.title} />
                            <div className="recommendation-rating">
                              <i className="fas fa-star"></i>
                              <span>{book.rating}</span>
                            </div>
                          </div>
                          <div className="recommendation-details">
                            <h3>{book.title}</h3>
                            <p className="recommendation-author">Par {book.author}</p>
                            <span className="recommendation-category">{book.category}</span>
                            <button
                              className="details-button"
                              onClick={() => onNavigate("catalog", { bookId: book.id })}
                            >
                              <i className="fas fa-info-circle"></i>
                              Détails
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Onglet Mes Emprunts */}
              {activeTab === "borrowings" && (
                <div className="dashboard-borrowings">
                  <div className="borrowings-filters">
                    <div className="filter-buttons">
                      <button className="filter-button active">Tous</button>
                      <button className="filter-button">Actifs</button>
                      <button className="filter-button">Retournés</button>
                      <button className="filter-button">En retard</button>
                    </div>
                    <div className="search-container">
                      <i className="fas fa-search"></i>
                      <input type="text" placeholder="Rechercher un livre..." />
                    </div>
                  </div>

                  {activeBorrowings.length > 0 ? (
                    <div className="borrowings-list">
                      {activeBorrowings.map((borrowing) => (
                        <div key={borrowing.id} className="borrowing-list-item">
                          <div className="borrowing-book-cover">
                            <img
                              src={borrowing.book.coverImage || "/placeholder.svg?height=120&width=80"}
                              alt={borrowing.book.title}
                            />
                          </div>
                          <div className="borrowing-info">
                            <h3>{borrowing.book.title}</h3>
                            <p className="borrowing-author">Par {borrowing.book.author}</p>
                            <div className="borrowing-meta">
                              <span className="borrowing-date">
                                <i className="fas fa-calendar-plus"></i> Emprunté le {formatDate(borrowing.borrowDate)}
                              </span>
                              <span className={`due-date ${getDueDateClass(borrowing.dueDate)}`}>
                                <i className="fas fa-calendar-day"></i> À retourner le {formatDate(borrowing.dueDate)}
                              </span>
                            </div>
                          </div>
                          <div className={`borrowing-status ${getDueDateClass(borrowing.dueDate)}`}>
                            <span className="status-text">{getDueDateText(borrowing.dueDate)}</span>
                          </div>
                          <div className="borrowing-actions">
                            <button className="extend-button">
                              <i className="fas fa-calendar-plus"></i>
                              <span>Prolonger</span>
                            </button>
                            <button className="return-button">
                              <i className="fas fa-undo"></i>
                              <span>Retourner</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <div className="empty-icon">
                        <i className="fas fa-book"></i>
                      </div>
                      <p>Vous n'avez pas d'emprunts actifs.</p>
                      <button className="action-button" onClick={() => onNavigate("catalog")}>
                        Parcourir le catalogue
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Onglet Historique */}
              {activeTab === "history" && (
                <div className="dashboard-history">
                  <div className="history-header">
                    <h2>Historique des emprunts</h2>
                    <button className="export-button">
                      <i className="fas fa-file-export"></i>
                      Exporter
                    </button>
                  </div>

                  {returnedBorrowings.length > 0 ? (
                    <div className="history-table-container">
                      <table className="history-table">
                        <thead>
                          <tr>
                            <th>Livre</th>
                            <th>Date d'emprunt</th>
                            <th>Date de retour</th>
                            <th>Durée</th>
                            <th>Statut</th>
                          </tr>
                        </thead>
                        <tbody>
                          {returnedBorrowings.map((borrowing) => {
                            const borrowDate = new Date(borrowing.borrowDate)
                            const returnDate = new Date(borrowing.returnDate)
                            const dueDate = new Date(borrowing.dueDate)
                            const duration = Math.ceil((returnDate - borrowDate) / (1000 * 60 * 60 * 24))
                            const isLate = returnDate > dueDate

                            return (
                              <tr key={borrowing.id}>
                                <td className="book-cell">
                                  <div className="book-info">
                                    <img
                                      src={borrowing.book.coverImage || "/placeholder.svg?height=50&width=35"}
                                      alt={borrowing.book.title}
                                    />
                                    <div>
                                      <div className="book-title">{borrowing.book.title}</div>
                                      <div className="book-author">{borrowing.book.author}</div>
                                    </div>
                                  </div>
                                </td>
                                <td>{formatDate(borrowing.borrowDate)}</td>
                                <td>{formatDate(borrowing.returnDate)}</td>
                                <td>{duration} jour(s)</td>
                                <td>
                                  <span className={`status-badge ${isLate ? "late" : "on-time"}`}>
                                    {isLate ? "Retourné en retard" : "Retourné à temps"}
                                  </span>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="empty-state">
                      <div className="empty-icon">
                        <i className="fas fa-history"></i>
                      </div>
                      <p>Vous n'avez pas encore d'historique d'emprunts.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Onglet Recommandations */}
              {activeTab === "recommendations" && (
                <div className="dashboard-recommendations">
                  <div className="recommendations-header">
                    <h2>Livres recommandés pour vous</h2>
                    <p>Basé sur vos emprunts précédents et vos centres d'intérêt</p>
                  </div>

                  <div className="recommendations-categories">
                    <button className="category-button active">Tous</button>
                    <button className="category-button">Fiction</button>
                    <button className="category-button">Non-fiction</button>
                    <button className="category-button">Science</button>
                    <button className="category-button">Histoire</button>
                  </div>

                  <div className="full-recommendations-grid">
                    {recommendations.concat(recommendations).map((book, index) => (
                      <div key={`${book.id}-${index}`} className="recommendation-card">
                        <div className="recommendation-cover">
                          <img src={book.coverImage || "/placeholder.svg"} alt={book.title} />
                          <div className="recommendation-rating">
                            <i className="fas fa-star"></i>
                            <span>{book.rating}</span>
                          </div>
                        </div>
                        <div className="recommendation-details">
                          <h3>{book.title}</h3>
                          <p className="recommendation-author">Par {book.author}</p>
                          <span className="recommendation-category">{book.category}</span>
                          <div className="recommendation-actions">
                            <button
                              className="details-button"
                              onClick={() => onNavigate("catalog", { bookId: book.id })}
                            >
                              <i className="fas fa-info-circle"></i>
                              Détails
                            </button>
                            <button className="borrow-button" onClick={() => onNavigate("catalog")}>
                              <i className="fas fa-hand-holding"></i>
                              Emprunter
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
