import { Link, useLocation } from "react-router-dom"
import "../assets/sidebar-styles.css"

const Sidebar = ({ role }) => {
  const location = useLocation()

  const isActive = (path) => {
    if (role === "admin") {
      return location.pathname === `/admin${path}` ? "active" : ""
    } else {
      return location.pathname === `/student${path}` ? "active" : ""
    }
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <i className="fas fa-book-reader"></i>
          <span>BiblioTech</span>
        </div>
      </div>

      <div className="sidebar-user">
        <div className="user-avatar">
          <i className="fas fa-user"></i>
        </div>
        <div className="user-info">
          <h4>{role === "admin" ? "Administrateur" : "Étudiant"}</h4>
          <p>En ligne</p>
        </div>
      </div>

      <div className="sidebar-divider">
        <span>Menu principal</span>
      </div>

      <div className="sidebar-menu">
        {role === "admin" ? (
          <>
            <Link to="/admin" className={`sidebar-item ${isActive("")}`}>
              <div className="sidebar-icon">
                <i className="fas fa-tachometer-alt"></i>
              </div>
              <span>Tableau de bord</span>
              {isActive("") && <div className="active-indicator"></div>}
            </Link>

            <div className="sidebar-divider">
              <span>Gestion des livres</span>
            </div>

            <Link to="/admin/catalog" className={`sidebar-item ${isActive("/catalog")}`}>
              <div className="sidebar-icon">
                <i className="fas fa-book"></i>
              </div>
              <span>Catalogue</span>
              {isActive("/catalog") && <div className="active-indicator"></div>}
            </Link>

            <Link to="/admin/add-book" className={`sidebar-item ${isActive("/add-book")}`}>
              <div className="sidebar-icon">
                <i className="fas fa-plus-circle"></i>
              </div>
              <span>Ajouter un livre</span>
              {isActive("/add-book") && <div className="active-indicator"></div>}
            </Link>

            <div className="sidebar-divider">
              <span>Gestion des utilisateurs</span>
            </div>

            <Link to="/admin/students" className={`sidebar-item ${isActive("/students")}`}>
              <div className="sidebar-icon">
                <i className="fas fa-user-graduate"></i>
              </div>
              <span>Étudiants</span>
              {isActive("/students") && <div className="active-indicator"></div>}
            </Link>

            <Link to="/admin/add-student" className={`sidebar-item ${isActive("/add-student")}`}>
              <div className="sidebar-icon">
                <i className="fas fa-user-plus"></i>
              </div>
              <span>Ajouter un étudiant</span>
              {isActive("/add-student") && <div className="active-indicator"></div>}
            </Link>

            <div className="sidebar-divider">
              <span>Transactions</span>
            </div>

            <Link to="/admin/borrowings" className={`sidebar-item ${isActive("/borrowings")}`}>
              <div className="sidebar-icon">
                <i className="fas fa-exchange-alt"></i>
              </div>
              <span>Emprunts</span>
              {isActive("/borrowings") && <div className="active-indicator"></div>}
            </Link>
          </>
        ) : (
          <>
            <Link to="/student" className={`sidebar-item ${isActive("")}`}>
              <div className="sidebar-icon">
                <i className="fas fa-tachometer-alt"></i>
              </div>
              <span>Tableau de bord</span>
              {isActive("") && <div className="active-indicator"></div>}
            </Link>

            <Link to="/student/catalog" className={`sidebar-item ${isActive("/catalog")}`}>
              <div className="sidebar-icon">
                <i className="fas fa-book"></i>
              </div>
              <span>Catalogue</span>
              {isActive("/catalog") && <div className="active-indicator"></div>}
            </Link>

            <Link to="/student/borrowings" className={`sidebar-item ${isActive("/borrowings")}`}>
              <div className="sidebar-icon">
                <i className="fas fa-history"></i>
              </div>
              <span>Mes emprunts</span>
              {isActive("/borrowings") && <div className="active-indicator"></div>}
            </Link>
          </>
        )}
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-item">
          <div className="sidebar-icon">
            <i className="fas fa-cog"></i>
          </div>
          <span>Paramètres</span>
        </div>
       
      </div>
    </div>
  )
}

export default Sidebar

