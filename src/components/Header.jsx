"use client"

const Header = ({ user, onLogout, title }) => {
  return (
    <header className="dashboard-header">
      <h1>{title}</h1>

      <div className="user-menu">
        <div className="user-info">
          <span className="user-name">{user.name}</span>
          <span className="user-role">{user.role === "admin" ? "Administrateur" : "Étudiant"}</span>
        </div>

        <button className="logout-button" onClick={onLogout}>
          <i className="fas fa-sign-out-alt"></i>
          Déconnexion
        </button>
      </div>
    </header>
  )
}

export default Header
