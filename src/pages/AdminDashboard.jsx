import { Link } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"

const AdminDashboard = ({ user, onLogout }) => {
  return (
    <div className="dashboard-container">
      <Sidebar role="admin" />

      <div className="main-content">
        <Header user={user} onLogout={onLogout} title="Tableau de Bord" />

        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Livres</h3>
            <div className="stat-value">120</div>
            <Link to="/admin/catalog" className="stat-link">
              Voir le catalogue
            </Link>
          </div>

          <div className="stat-card">
            <h3>Étudiants</h3>
            <div className="stat-value">45</div>
            <Link to="/admin/students" className="stat-link">
              Gérer les étudiants
            </Link>
          </div>

          <div className="stat-card">
            <h3>Emprunts</h3>
            <div className="stat-value">18</div>
            <Link to="/admin/borrowings" className="stat-link">
              Voir les emprunts
            </Link>
          </div>

          <div className="stat-card">
            <h3>Catégories</h3>
            <div className="stat-value">8</div>
            <Link to="/admin/catalog" className="stat-link">
              Gérer les catégories
            </Link>
          </div>
        </div>

        <div className="quick-actions">
          <h2>Actions Rapides</h2>
          <div className="action-buttons">
            <Link to="/admin/add-book" className="action-button">
              <i className="fas fa-book"></i>
              Ajouter un livre
            </Link>
            <Link to="/admin/add-student" className="action-button">
              <i className="fas fa-user-plus"></i>
              Ajouter un étudiant
            </Link>
            <Link to="/admin/borrowings" className="action-button">
              <i className="fas fa-exchange-alt"></i>
              Gérer les emprunts
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
