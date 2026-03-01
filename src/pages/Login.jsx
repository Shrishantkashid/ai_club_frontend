import React, { useState } from 'react'
import API from '../utils/api'

const Login = ({ onLoginSuccess, onBack }) => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Prevent text selection in Login page
  React.useEffect(() => {
    const preventTextSelection = (e) => {
      e.preventDefault();
      return false;
    };
    
    const preventKeyboardShortcuts = (e) => {
      // Prevent Ctrl+A (select all)
      if (e.ctrlKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        return false;
      }
      // Prevent Ctrl+C (copy)
      if (e.ctrlKey && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        return false;
      }
      // Prevent F12 (developer tools)
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
      // Prevent Ctrl+Shift+I (developer tools)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
      }
    };
    
    // Add event listeners
    document.addEventListener('selectstart', preventTextSelection);
    document.addEventListener('keydown', preventKeyboardShortcuts);
    
    // Cleanup
    return () => {
      document.removeEventListener('selectstart', preventTextSelection);
      document.removeEventListener('keydown', preventKeyboardShortcuts);
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Client-side email validation
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }
    
    if (!email.toLowerCase().endsWith('@saividya.ac.in')) {
      setError('Only @saividya.ac.in email addresses are allowed')
      setLoading(false)
      return
    }

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

  const isMobile = window.innerWidth <= 768

  return (
    <div style={{
      padding: isMobile ? '1rem' : '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      textAlign: 'center',
      position: 'relative'
    }}>
      <div style={{
        backgroundColor: 'rgba(30, 58, 95, 0.6)',
        padding: isMobile ? '1rem' : '2rem',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(30, 58, 95, 0.3)',
        border: '1px solid rgba(100, 255, 218, 0.2)',
        backdropFilter: 'blur(4px)',
        maxWidth: isMobile ? '100%' : '500px',
        margin: '0 auto',
        position: 'relative'
      }}>
        <button
          onClick={onBack}
          style={{
            position: 'absolute',
            top: isMobile ? '0.5rem' : '1rem',
            left: isMobile ? '0.5rem' : '1rem',
            backgroundColor: 'transparent',
            color: '#64ffda',
            border: '1px solid rgba(100, 255, 218, 0.3)',
            padding: isMobile ? '0.4rem 0.8rem' : '0.5rem 1rem',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: isMobile ? '0.8rem' : '0.9rem',
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
          marginBottom: isMobile ? '1rem' : '2rem',
          textShadow: '0 0 8px rgba(100, 255, 218, 0.3)',
          marginTop: isMobile ? '2rem' : '2rem',
          fontSize: isMobile ? '1.5rem' : '2rem'
        }}>
          Contest Login
        </h1>
        
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1.5rem' }}>
            <input
              type="email"
              placeholder="Enter your @saividya.ac.in email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: isMobile ? '0.75rem' : '1rem',
                borderRadius: '8px',
                border: '1px solid rgba(100, 255, 218, 0.3)',
                backgroundColor: 'rgba(10, 25, 47, 0.8)',
                color: '#e2e8f0',
                fontSize: isMobile ? '1rem' : '1.1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>
          
          {error && (
            <div style={{
              color: '#f87171',
              marginBottom: '1rem',
              padding: '0.5rem',
              backgroundColor: 'rgba(248, 113, 113, 0.1)',
              borderRadius: '4px',
              fontSize: isMobile ? '0.9rem' : '1rem'
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
              padding: isMobile ? '0.75rem' : '1rem 2rem',
              fontSize: isMobile ? '1rem' : '1.1rem',
              borderRadius: '30px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              width: '100%',
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p style={{ 
          color: '#94a3b8', 
          fontSize: isMobile ? '0.8rem' : '0.9rem', 
          marginTop: '1rem' 
        }}>
          Only @saividya.ac.in email addresses are accepted
        </p>
      </div>
    </div>
  )
}

export default Login