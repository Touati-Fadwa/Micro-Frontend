"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useState, useEffect } from "react"
import Login from "./pages/Login"
import AdminDashboard from "./pages/AdminDashboard"
import Catalog from "./pages/Catalog"
import Students from "./pages/Students"
import AddStudent from "./pages/AddStudent"
import Borrowings from "./pages/Borrowings"
import AddBook from "./pages/AddBook"
import StudentDashboard from "./pages/StudentDashboard"
import "./assets/styles.css"

function App() {
  const [user, setUser] = useState(null)

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
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
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
            user && user.role === "admin" ? <Catalog user={user} onLogout={handleLogout} /> : <Navigate to="/" />
          }
        />
        <Route
          path="/admin/add-book"
          element={
            user && user.role === "admin" ? <AddBook user={user} onLogout={handleLogout} /> : <Navigate to="/" />
          }
        />
        <Route
          path="/admin/students"
          element={
            user && user.role === "admin" ? <Students user={user} onLogout={handleLogout} /> : <Navigate to="/" />
          }
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
              <StudentDashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  )
}

export default App
