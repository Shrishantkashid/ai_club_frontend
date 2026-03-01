import React, { useState } from 'react'
import API from '../utils/api'

const Login = ({ onLoginSuccess, onBack }) => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Simulate API call to login endpoint
      const response = await fetch(API.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (response.ok) {
        // Save token to localStorage
        localStorage.setItem('token', data.token)
        onLoginSuccess(data.user)
      } else {
        setError(data.message || 'Login failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      textAlign: 'center',
      position: 'relative'
    }}>
      <div style={{
        backgroundColor: 'rgba(30, 58, 95, 0.6)',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(30, 58, 95, 0.3)',
        border: '1px solid rgba(100, 255, 218, 0.2)',
        backdropFilter: 'blur(4px)',
        maxWidth: '500px',
        margin: '0 auto',
        position: 'relative'
      }}>
        <button
          onClick={onBack}
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            backgroundColor: 'transparent',
            color: '#64ffda',
            border: '1px solid rgba(100, 255, 218, 0.3)',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(100, 255, 218, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
          }}
        >
          ← Back
        </button>

        <h1 style={{ 
          color: '#64ffda', 
          marginBottom: '2rem',
          textShadow: '0 0 8px rgba(100, 255, 218, 0.3)',
          marginTop: '2rem'
        }}>
          Contest Login
        </h1>
        
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1.5rem' }}>
            <input
              type="email"
              placeholder="Enter your college email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(100, 255, 218, 0.3)',
                backgroundColor: 'rgba(10, 25, 47, 0.8)',
                color: '#e2e8f0',
                fontSize: '1rem'
              }}
            />
          </div>
          
          {error && (
            <div style={{
              color: '#f87171',
              marginBottom: '1rem',
              padding: '0.5rem',
              backgroundColor: 'rgba(248, 113, 113, 0.1)',
              borderRadius: '4px'
            }}>
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: loading ? '#9ca3af' : '#4ade80',
              color: '#0a192f',
              border: 'none',
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              borderRadius: '30px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              width: '100%'
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p style={{ 
          color: '#94a3b8', 
          fontSize: '0.9rem', 
          marginTop: '1rem' 
        }}>
          Use your official college email to participate
        </p>
      </div>
    </div>
  )
}

export default Login