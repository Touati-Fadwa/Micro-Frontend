"use client"

import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import LandingPage from "./pages/LandingPage"
import Login from "./pages/Login"
import AdminDashboard from "./pages/AdminDashboard"
import Catalog from "./pages/Catalog"
import Students from "./pages/Students"
import AddStudent from "./pages/AddStudent"
import Borrowings from "./pages/Borrowings"
import AddBook from "./pages/AddBook"
import StudentDashboard from "./pages/StudentDashboard"
import "./assets/styles.css"
import "./assets/landing-styles.css"
import "./assets/login-styles.css"
import "./assets/dashboard-styles.css"
import "./assets/students-styles.css"

// Composant wrapper pour gérer la navigation
function AppContent() {
  const [user, setUser] = useState(null)
  const [pageParams, setPageParams] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("user")
    navigate("/")
  }

  const handleNavigate = (page, params = {}) => {
    setPageParams(params)

    // Déterminer l'URL en fonction du rôle de l'utilisateur et de la page demandée
    if (user && user.role === "student") {
      if (page === "catalog") {
        navigate("/student/catalog")
      } else if (page === "dashboard") {
        navigate("/student")
      } else {
        navigate(`/student/${page}`)
      }
    } else if (user && user.role === "admin") {
      if (page === "dashboard") {
        navigate("/admin")
      } else {
        navigate(`/admin/${page}`)
      }
    }
  }

  return (
    <Routes>
      {/* Landing Page - accessible à tous */}
      <Route path="/" element={<LandingPage />} />

      {/* Login Page */}
      <Route
        path="/login"
        element={
          !user ? (
            <Login onLogin={handleLogin} />
          ) : user.role === "admin" ? (
            <Navigate to="/admin" />
          ) : (
            <Navigate to="/student" />
          )
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          user && user.role === "admin" ? <AdminDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/" />
        }
      />
      <Route
        path="/admin/catalog"
        element={
          user && user.role === "admin" ? (
            <Catalog user={user} onLogout={handleLogout} params={pageParams} />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/admin/add-book"
        element={user && user.role === "admin" ? <AddBook user={user} onLogout={handleLogout} /> : <Navigate to="/" />}
      />
      <Route
        path="/admin/students"
        element={user && user.role === "admin" ? <Students user={user} onLogout={handleLogout} /> : <Navigate to="/" />}
      />
      <Route
        path="/admin/add-student"
        element={
          user && user.role === "admin" ? <AddStudent user={user} onLogout={handleLogout} /> : <Navigate to="/" />
        }
      />
      <Route
        path="/admin/borrowings"
        element={
          user && user.role === "admin" ? <Borrowings user={user} onLogout={handleLogout} /> : <Navigate to="/" />
        }
      />

      {/* Student Routes */}
      <Route
        path="/student"
        element={
          user && user.role === "student" ? (
            <StudentDashboard user={user} onLogout={handleLogout} onNavigate={handleNavigate} />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/student/catalog"
        element={
          user && user.role === "student" ? (
            <Catalog user={user} onLogout={handleLogout} params={pageParams} onNavigate={handleNavigate} />
          ) : (
            <Navigate to="/" />
          )
        }
      />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
