"use client"

import { useState } from "react"
import { API_URL } from "../config"

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("student")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Erreur de connexion")
      }

      onLogin(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      maxWidth: '450px',
      margin: '40px auto',
      padding: '30px',
      fontFamily: 'Arial, sans-serif',
      border: '1px solid #e0e0e0',
      borderRadius: '10px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      backgroundColor: '#ffffff'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '25px' }}>
        <h1 style={{
          color: '#2c3e50',
          fontSize: '24px',
          fontWeight: '900',
          marginBottom: '5px'
        }}>Bibliothèque ISET Tozeur</h1>
        
        <h2 style={{
          fontSize: '18px',
          fontWeight: '500',
          color: '#555'
        }}>Connexion à votre compte</h2>
      </div>
      
      <div style={{
        height: '1px',
        background: '#e0e0e0',
        margin: '20px 0'
      }}></div>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '25px' }}>
          <label htmlFor="email" style={{
            display: 'block',
            fontSize: '15px',
            fontWeight: '600',
            marginBottom: '8px',
            color: '#333'
          }}>
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="votreemail@iset.tn"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        </div>
        
        <div style={{
          height: '1px',
          background: '#e0e0e0',
          margin: '20px 0'
        }}></div>
        
        <div style={{ marginBottom: '25px' }}>
          <label htmlFor="password" style={{
            display: 'block',
            fontSize: '15px',
            fontWeight: '600',
            marginBottom: '8px',
            color: '#333'
          }}>
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        </div>
        
        <div style={{
          height: '1px',
          background: '#e0e0e0',
          margin: '20px 0'
        }}></div>
        
        <div style={{ marginBottom: '25px' }}>
          <label htmlFor="role" style={{
            display: 'block',
            fontSize: '15px',
            fontWeight: '600',
            marginBottom: '8px',
            color: '#333'
          }}>
            Sélectionnez votre rôle
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              backgroundColor: 'white',
              cursor: 'pointer'
            }}
          >
            <option value="student">Étudiant</option>
            <option value="admin">Administrateur</option>
          </select>
        </div>
        
        <div style={{
          height: '1px',
          background: '#e0e0e0',
          margin: '20px 0'
        }}></div>
        
        {error && (
          <div style={{
            color: '#e74c3c',
            marginBottom: '15px',
            fontSize: '14px',
            textAlign: 'center',
            padding: '10px',
            backgroundColor: '#fdecea',
            borderRadius: '4px'
          }}>
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            marginTop: '10px',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  )
}

export default Login
