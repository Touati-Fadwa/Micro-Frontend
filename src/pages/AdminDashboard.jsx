"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"

const AdminDashboard = ({ user, onLogout }) => {
  const [stats, setStats] = useState({
    books: { total: 0, available: 0, borrowed: 0 },
    students: { total: 0, active: 0, new: 0 },
    borrowings: { total: 0, active: 0, overdue: 0 },
    categories: { total: 0 },
  })

  const [recentActivities, setRecentActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    // Simuler le chargement des données
    const fetchData = async () => {
      setLoading(true)
      try {
        // Dans une application réelle, ces données viendraient de l'API
        // Simulation de données pour la démonstration
        setStats({
          books: { total: 120, available: 87, borrowed: 33 },
          students: { total: 45, active: 38, new: 5 },
          borrowings: { total: 78, active: 33, overdue: 7 },
          categories: { total: 8 },
        })

        setRecentActivities([
          {
            id: 1,
            type: "borrow",
            user: "Sophie Martin",
            item: "Introduction à l'algorithmique",
            date: new Date(2023, 4, 15),
          },
          {
            id: 2,
            type: "return",
            user: "Thomas Dubois",
            item: "Bases de données avancées",
            date: new Date(2023, 4, 14),
          },
          { id: 3, type: "register", user: "Emma Bernard", item: null, date: new Date(2023, 4, 13) },
          { id: 4, type: "borrow", user: "Lucas Petit", item: "Réseaux informatiques", date: new Date(2023, 4, 12) },
          {
            id: 5,
            type: "add_book",
            user: "Admin",
            item: "Intelligence artificielle: fondements",
            date: new Date(2023, 4, 11),
          },
        ])
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getActivityIcon = (type) => {
    switch (type) {
      case "borrow":
        return "fas fa-arrow-circle-down text-blue"
      case "return":
        return "fas fa-arrow-circle-up text-green"
      case "register":
        return "fas fa-user-plus text-purple"
      case "add_book":
        return "fas fa-book-medical text-orange"
      default:
        return "fas fa-info-circle text-gray"
    }
  }

  const getActivityText = (activity) => {
    switch (activity.type) {
      case "borrow":
        return `${activity.user} a emprunté "${activity.item}"`
      case "return":
        return `${activity.user} a retourné "${activity.item}"`
      case "register":
        return `${activity.user} s'est inscrit(e)`
      case "add_book":
        return `Nouveau livre ajouté: "${activity.item}"`
      default:
        return `Activité inconnue`
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    })
  }

  return (
    <div className="dashboard-container">
      <Sidebar role="admin" />

      <div className="main-content">
        <Header user={user} onLogout={onLogout} title="Tableau de Bord" />

        <div className="dashboard-welcome">
          <div className="welcome-text">
            <h2>Bonjour, {user.name}</h2>
            <p>Bienvenue dans votre tableau de bord administrateur. Voici un aperçu de votre bibliothèque.</p>
          </div>
          <div className="date-display">
            <div className="date-icon">
              <i className="far fa-calendar-alt"></i>
            </div>
            <div className="date-text">
              <span className="day">{new Date().toLocaleDateString("fr-FR", { weekday: "long" })}</span>
              <span className="full-date">
                {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>
          </div>
        </div>

        <div className="dashboard-tabs">
          <button
            className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <i className="fas fa-th-large"></i> Vue d'ensemble
          </button>
          <button
            className={`tab-button ${activeTab === "books" ? "active" : ""}`}
            onClick={() => setActiveTab("books")}
          >
            <i className="fas fa-book"></i> Livres
          </button>
          <button
            className={`tab-button ${activeTab === "students" ? "active" : ""}`}
            onClick={() => setActiveTab("students")}
          >
            <i className="fas fa-user-graduate"></i> Étudiants
          </button>
          <button
            className={`tab-button ${activeTab === "borrowings" ? "active" : ""}`}
            onClick={() => setActiveTab("borrowings")}
          >
            <i className="fas fa-exchange-alt"></i> Emprunts
          </button>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Chargement des données...</p>
          </div>
        ) : (
          <>
            <div className="stats-grid">
              <div className="stat-card books">
                <div className="stat-icon">
                  <i className="fas fa-books"></i>
                </div>
                <div className="stat-content">
                  <h3>Livres</h3>
                  <div className="stat-value">{stats.books.total}</div>
                  <div className="stat-details">
                    <div className="stat-detail">
                      <span className="detail-label">Disponibles</span>
                      <span className="detail-value">{stats.books.available}</span>
                    </div>
                    <div className="stat-detail">
                      <span className="detail-label">Empruntés</span>
                      <span className="detail-value">{stats.books.borrowed}</span>
                    </div>
                  </div>
                  <Link to="/admin/catalog" className="stat-link">
                    Voir le catalogue <i className="fas fa-arrow-right"></i>
                  </Link>
                </div>
              </div>

              <div className="stat-card students">
                <div className="stat-icon">
                  <i className="fas fa-user-graduate"></i>
                </div>
                <div className="stat-content">
                  <h3>Étudiants</h3>
                  <div className="stat-value">{stats.students.total}</div>
                  <div className="stat-details">
                    <div className="stat-detail">
                      <span className="detail-label">Actifs</span>
                      <span className="detail-value">{stats.students.active}</span>
                    </div>
                    <div className="stat-detail">
                      <span className="detail-label">Nouveaux</span>
                      <span className="detail-value">{stats.students.new}</span>
                    </div>
                  </div>
                  <Link to="/admin/students" className="stat-link">
                    Gérer les étudiants <i className="fas fa-arrow-right"></i>
                  </Link>
                </div>
              </div>

              <div className="stat-card borrowings">
                <div className="stat-icon">
                  <i className="fas fa-exchange-alt"></i>
                </div>
                <div className="stat-content">
                  <h3>Emprunts</h3>
                  <div className="stat-value">{stats.borrowings.total}</div>
                  <div className="stat-details">
                    <div className="stat-detail">
                      <span className="detail-label">Actifs</span>
                      <span className="detail-value">{stats.borrowings.active}</span>
                    </div>
                    <div className="stat-detail">
                      <span className="detail-label">En retard</span>
                      <span className="detail-value overdue">{stats.borrowings.overdue}</span>
                    </div>
                  </div>
                  <Link to="/admin/borrowings" className="stat-link">
                    Voir les emprunts <i className="fas fa-arrow-right"></i>
                  </Link>
                </div>
              </div>

              <div className="stat-card categories">
                <div className="stat-icon">
                  <i className="fas fa-tags"></i>
                </div>
                <div className="stat-content">
                  <h3>Catégories</h3>
                  <div className="stat-value">{stats.categories.total}</div>
                  <div className="stat-details">
                    <div className="stat-detail full-width">
                      <span className="detail-label">Répartition équilibrée</span>
                      <div className="progress-bar">
                        <div className="progress" style={{ width: "75%" }}></div>
                      </div>
                    </div>
                  </div>
                  <Link to="/admin/catalog" className="stat-link">
                    Gérer les catégories <i className="fas fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>

            

            <div className="dashboard-sections">
              <div className="dashboard-section alerts">
                <div className="section-header">
                  <h2>
                    <i className="fas fa-exclamation-triangle"></i> Alertes
                  </h2>
                </div>
                <div className="alerts-list">
                  <div className="alert-item overdue">
                    <div className="alert-icon">
                      <i className="fas fa-clock"></i>
                    </div>
                    <div className="alert-content">
                      <h4>Emprunts en retard</h4>
                      <p>7 livres sont actuellement en retard</p>
                    </div>
                    <div className="alert-action">
                      <Link to="/admin/borrowings" className="btn-small">
                        Voir
                      </Link>
                    </div>
                  </div>
                  <div className="alert-item low-stock">
                    <div className="alert-icon">
                      <i className="fas fa-exclamation-circle"></i>
                    </div>
                    <div className="alert-content">
                      <h4>Stock faible</h4>
                      <p>3 livres populaires sont presque tous empruntés</p>
                    </div>
                    <div className="alert-action">
                      <Link to="/admin/catalog" className="btn-small">
                        Voir
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="dashboard-section system-info">
                <div className="section-header">
                  <h2>
                    <i className="fas fa-info-circle"></i> Informations Système
                  </h2>
                </div>
                <div className="system-info-content">
                  <div className="info-item">
                    <span className="info-label">Version du système</span>
                    <span className="info-value">v2.5.3</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Dernière mise à jour</span>
                    <span className="info-value">15 mai 2023</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">État du système</span>
                    <span className="info-value status-ok">Opérationnel</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Prochaine maintenance</span>
                    <span className="info-value">30 mai 2023</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
