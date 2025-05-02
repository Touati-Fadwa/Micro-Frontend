import { Link, useLocation } from "react-router-dom"

const Sidebar = ({ role }) => {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>Bibliothèque ISET</h1>
      </div>

      <nav className="sidebar-nav">
        {role === "admin" ? (
          <ul>
            <li>
              <Link to="/admin" className={isActive("/admin") ? "active" : ""}>
                <i className="fas fa-tachometer-alt"></i>
                <span>Tableau de bord</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/catalog" className={isActive("/admin/catalog") ? "active" : ""}>
                <i className="fas fa-book"></i>
                <span>Catalogue</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/students" className={isActive("/admin/students") ? "active" : ""}>
                <i className="fas fa-users"></i>
                <span>Étudiants</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/borrowings" className={isActive("/admin/borrowings") ? "active" : ""}>
                <i className="fas fa-exchange-alt"></i>
                <span>Emprunts</span>
              </Link>
            </li>
          </ul>
        ) : (
          <ul>
            <li>
              <Link to="/student" className={isActive("/student") ? "active" : ""}>
                <i className="fas fa-tachometer-alt"></i>
                <span>Tableau de bord</span>
              </Link>
            </li>
            <li>
              <Link to="/student/catalog" className={isActive("/student/catalog") ? "active" : ""}>
                <i className="fas fa-book"></i>
                <span>Catalogue</span>
              </Link>
            </li>
            <li>
              <Link to="/student/borrowings" className={isActive("/student/borrowings") ? "active" : ""}>
                <i className="fas fa-exchange-alt"></i>
                <span>Mes emprunts</span>
              </Link>
            </li>
          </ul>
        )}
      </nav>

      <div className="sidebar-footer">
        <p>© 2025 ISET Bibliothèque</p>
      </div>
    </div>
  )
}

export default Sidebar
