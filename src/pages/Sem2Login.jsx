import React, { useState, useEffect } from 'react'
import API from '../utils/api'

const Sem2Login = ({ onLoginSuccess, onBack, onContestCompleted }) => {
  const [isRegisterMode, setIsRegisterMode] = useState(true)
  const [fullName, setFullName] = useState('')
  const [semester, setSemester] = useState(2) // Default to 2nd sem
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [generatedEmail, setGeneratedEmail] = useState('')
  const [generatedPassword, setGeneratedPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Generate email and password when name or semester changes (for registration)
  useEffect(() => {
    if (fullName.trim()) {
      // Generate email - allow up to 30 characters (matches backend)
      const namePart = fullName.toLowerCase().replace(/\s+/g, '').substring(0, 30)
      let suffix
      
      switch(semester) {
        case 2: suffix = '.25cs@saividya.ac.in'; break
        case 4: suffix = '.24cs@saividya.ac.in'; break
        case 6: suffix = '.23cs@saividya.ac.in'; break
        default: suffix = '.25cs@saividya.ac.in'
      }
      
      setGeneratedEmail(`${namePart}${suffix}`)
      
      // Generate password (first 4 chars + 2026)
      const first4 = fullName.substring(0, 4).toLowerCase()
      setGeneratedPassword(`${first4}2026`)
    } else {
      setGeneratedEmail('')
      setGeneratedPassword('')
    }
  }, [fullName, semester])

  // Clear form fields when switching modes
  useEffect(() => {
    setEmail('')
    setPassword('')
    if (!isRegisterMode) {
      setFullName('')
      setSemester(2)
    }
    setError('')
  }, [isRegisterMode])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (isRegisterMode) {
      // Registration mode - validate name
      if (!fullName.trim()) {
        setError('Please enter your full name as per college record')
        setLoading(false)
        return
      }

      if (fullName.trim().length < 4) {
        setError('Name must be at least 4 characters long')
        setLoading(false)
        return
      }

      try {
        const response = await fetch(API.SEM2_LOGIN, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            fullName: fullName.trim(),
            semester,
            isLoginAttempt: false  // Registration mode
          })
        })

        // Check if response is OK before parsing JSON
        if (!response.ok) {
          // Try to parse error response
          let errorData;
          try {
            errorData = await response.json();
          } catch (parseErr) {
            // If response is not JSON, create a generic error
            errorData = { message: `Server error (${response.status}): Unable to parse response` };
          }
          setError(errorData.message || 'Registration failed')
          setLoading(false)
          return
        }

        // For successful response, check if it's actually JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          setError('Server returned unexpected response format. Please contact administrator.');
          setLoading(false)
          return;
        }

        const data = await response.json()

        console.log('Sem2 Register response:', response.status, data)

        if (response.ok) {
          if (data.contestCompleted) {
            console.log('Contest completed - showing leaderboard')
            onContestCompleted(data)
          } else if (data.contestInProgress) {
            // Continue from where they left off
            console.log('Continuing contest from round:', data.nextRound)
            localStorage.setItem('token', data.token)
            localStorage.setItem('currentUser', JSON.stringify(data.user))
            window.location.hash = `#/contest/${data.nextRound}`;
          } else {
            // Fresh start - go to Round 1
            localStorage.setItem('token', data.token)
            onLoginSuccess(data.user)
          }
        } else {
          // Show error
          setError(data.message || 'Registration failed')
        }
      } catch (err) {
        console.error('Registration error:', err)
        if (err.name === 'SyntaxError' && err.message.includes('Unexpected token')) {
          setError('Server communication error. The backend might not be running or returned an unexpected response. Please ensure the backend server is running correctly.')
        } else {
          setError('Network error. Please ensure the backend server is running.')
        }
      } finally {
        setLoading(false)
      }
    } else {
      // Login mode - use name and semester (simpler for users)
      if (!email.trim()) {  // email field now contains name for login
        setError('Please enter your full name')
        setLoading(false)
        return
      }

      if (!semester) {
        setError('Please select your semester')
        setLoading(false)
        return
      }

      try {
        const response = await fetch(API.SEM2_LOGIN, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            fullName: email.trim(),  // Send name from email field
            semester,
            isLoginAttempt: true  // Login mode
          })
        })

        // Check if response is OK before parsing JSON
        if (!response.ok) {
          // Try to parse error response
          let errorData;
          try {
            errorData = await response.json();
          } catch (parseErr) {
            // If response is not JSON, create a generic error
            errorData = { message: `Server error (${response.status}): Unable to parse response` };
          }
          // Handle different error types
          if (errorData.needsRegistration) {
            // No account found - guide user to register
            setError(`⚠️ No account found! Please register first before attempting the contest.`)
          } else if (errorData.emailExists && !errorData.message.includes('already have an account')) {
            setError(`Account found! But there was an issue. Please contact support if this persists.`)
          } else {
            setError(errorData.message || 'Login failed. Check your name and semester.')
          }
          setLoading(false)
          return
        }

        // For successful response, check if it's actually JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          setError('Server returned unexpected response format. Please contact administrator.')
          setLoading(false)
          return;
        }

        const data = await response.json()

        console.log('Sem2 Login response:', response.status, data)

        if (response.ok) {
          if (data.contestCompleted) {
            console.log('Contest completed - showing leaderboard')
            onContestCompleted(data)
          } else if (data.contestInProgress) {
            // Continue from where they left off
            console.log('Continuing contest from round:', data.nextRound)
            localStorage.setItem('token', data.token)
            localStorage.setItem('currentUser', JSON.stringify(data.user))
            window.location.hash = `#/contest/${data.nextRound}`;
          } else {
            // Fresh start - go to Round 1
            localStorage.setItem('token', data.token)
            onLoginSuccess(data.user)
          }
        } else {
          // Handle different error types
          if (data.needsRegistration) {
            // No account found - guide user to register
            setError(`⚠️ No account found! Please register first before attempting the contest.`)
          } else if (data.emailExists && !data.message.includes('already have an account')) {
            setError(`Account found! But there was an issue. Please contact support if this persists.`)
          } else {
            setError(data.message || 'Login failed. Check your name and semester.')
          }
        }
      } catch (err) {
        console.error('Login error:', err)
        if (err.name === 'SyntaxError' && err.message.includes('Unexpected token')) {
          setError('Server communication error. The backend might not be running or returned an unexpected response. Please ensure the backend server is running correctly.')
        } else {
          setError('Network error. Please ensure the backend server is running.')
        }
      } finally {
        setLoading(false)
      }
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
        padding: isMobile ? '1.5rem' : '2rem',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(30, 58, 95, 0.3)',
        border: '1px solid rgba(100, 255, 218, 0.2)',
        backdropFilter: 'blur(4px)',
        maxWidth: isMobile ? '100%' : '600px',
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
            e.target.style.backgroundColor = 'rgba(100, 255, 218, 0.1)'
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent'
          }}
        >
          ← Back
        </button>

        {/* Toggle between Login and Register */}
        <div style={{
          display: 'flex',
          backgroundColor: 'rgba(10, 25, 47, 0.5)',
          borderRadius: '30px',
          padding: '0.25rem',
          marginBottom: '2rem',
          marginTop: '1rem'
        }}>
          <button
            onClick={() => setIsRegisterMode(true)}
            style={{
              flex: 1,
              padding: '0.75rem',
              borderRadius: '25px',
              border: 'none',
              backgroundColor: isRegisterMode ? '#4ade80' : 'transparent',
              color: isRegisterMode ? '#0a192f' : '#64ffda',
              fontWeight: 'bold',
              fontSize: isMobile ? '0.9rem' : '1rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Register
          </button>
          <button
            onClick={() => setIsRegisterMode(false)}
            style={{
              flex: 1,
              padding: '0.75rem',
              borderRadius: '25px',
              border: 'none',
              backgroundColor: !isRegisterMode ? '#4ade80' : 'transparent',
              color: !isRegisterMode ? '#0a192f' : '#64ffda',
              fontWeight: 'bold',
              fontSize: isMobile ? '0.9rem' : '1rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Login
          </button>
        </div>

        <h1 style={{ 
          color: '#64ffda', 
          marginBottom: isMobile ? '1.5rem' : '2rem',
          textShadow: '0 0 8px rgba(100, 255, 218, 0.3)',
          fontSize: isMobile ? '1.5rem' : '2rem'
        }}>
          {isRegisterMode ? 'Create New Account' : 'Welcome Back!'}
        </h1>
        
        <form onSubmit={handleLogin}>
          {isRegisterMode ? (
            /* Registration Form */
            <>
              {/* Warning for existing users */}
              <div style={{
                marginBottom: '1.5rem',
                padding: '0.75rem',
                backgroundColor: 'rgba(251, 191, 36, 0.1)',
                border: '1px solid rgba(251, 191, 36, 0.3)',
                borderRadius: '6px',
                color: '#fbbf24',
                fontSize: isMobile ? '0.85rem' : '0.9rem',
                lineHeight: '1.5'
              }}>
                ⚠️ <strong>Already registered?</strong> Do NOT create a new account. Switch to the Login tab instead.
              </div>

              {/* Semester Selection */}
              <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                <label style={{
                  display: 'block',
                  color: '#64ffda',
                  marginBottom: '0.5rem',
                  fontSize: isMobile ? '0.9rem' : '1rem',
                  fontWeight: 'bold'
                }}>
                  Select Semester:
                </label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(Number(e.target.value))}
                  required
                  style={{
                    width: '100%',
                    padding: isMobile ? '0.75rem' : '1rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(100, 255, 218, 0.3)',
                    backgroundColor: 'rgba(10, 25, 47, 0.8)',
                    color: '#e2e8f0',
                    fontSize: isMobile ? '1rem' : '1.1rem',
                    boxSizing: 'border-box',
                    cursor: 'pointer'
                  }}
                >
                  <option value={2}>2nd Semester (.25cs)</option>
                  <option value={4}>4th Semester (.24cs)</option>
                  <option value={6}>6th Semester (.23cs)</option>
                </select>
              </div>

              {/* Full Name Input */}
              <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                <label style={{
                  display: 'block',
                  color: '#64ffda',
                  marginBottom: '0.5rem',
                  fontSize: isMobile ? '0.9rem' : '1rem',
                  fontWeight: 'bold'
                }}>
                  Full Name (as per college record):
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
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

              {/* Generated Email Display */}
              {generatedEmail && (
                <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                  <label style={{
                    display: 'block',
                    color: '#64ffda',
                    marginBottom: '0.5rem',
                    fontSize: isMobile ? '0.9rem' : '1rem',
                    fontWeight: 'bold'
                  }}>
                    Your College Email (Auto-generated):
                  </label>
                  <input
                    type="text"
                    value={generatedEmail}
                    readOnly
                    style={{
                      width: '100%',
                      padding: isMobile ? '0.75rem' : '1rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(100, 255, 218, 0.3)',
                      backgroundColor: 'rgba(10, 25, 47, 0.5)',
                      color: '#94a3b8',
                      fontSize: isMobile ? '0.9rem' : '1rem',
                      boxSizing: 'border-box',
                      cursor: 'not-allowed'
                    }}
                  />
                </div>
              )}

              {/* Generated Password Display */}
              {generatedPassword && (
                <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                  <label style={{
                    display: 'block',
                    color: '#64ffda',
                    marginBottom: '0.5rem',
                    fontSize: isMobile ? '0.9rem' : '1rem',
                    fontWeight: 'bold'
                  }}>
                    Your Password (Auto-generated):
                  </label>
                  <input
                    type="text"
                    value={generatedPassword}
                    readOnly
                    style={{
                      width: '100%',
                      padding: isMobile ? '0.75rem' : '1rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(100, 255, 218, 0.3)',
                      backgroundColor: 'rgba(10, 25, 47, 0.5)',
                      color: '#fbbf24',
                      fontSize: isMobile ? '0.9rem' : '1rem',
                      boxSizing: 'border-box',
                      cursor: 'not-allowed',
                      fontFamily: 'monospace'
                    }}
                  />
                  <p style={{
                    color: '#94a3b8',
                    fontSize: isMobile ? '0.8rem' : '0.9rem',
                    marginTop: '0.5rem'
                  }}>
                    💡 Password format: First 4 letters of your name + "2026"
                  </p>
                </div>
              )}
            </>
          ) : (
            /* Login Form - Simple Name + Semester */
            <>
              {/* Full Name Input */}
              <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                <label style={{
                  display: 'block',
                  color: '#64ffda',
                  marginBottom: '0.5rem',
                  fontSize: isMobile ? '0.9rem' : '1rem',
                  fontWeight: 'bold'
                }}>
                  Full Name (as per college record):
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={email}  // Reusing email state for name input
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

              {/* Semester Selection */}
              <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                <label style={{
                  display: 'block',
                  color: '#64ffda',
                  marginBottom: '0.5rem',
                  fontSize: isMobile ? '0.9rem' : '1rem',
                  fontWeight: 'bold'
                }}>
                  Select Semester:
                </label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(Number(e.target.value))}
                  required
                  style={{
                    width: '100%',
                    padding: isMobile ? '0.75rem' : '1rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(100, 255, 218, 0.3)',
                    backgroundColor: 'rgba(10, 25, 47, 0.8)',
                    color: '#e2e8f0',
                    fontSize: isMobile ? '1rem' : '1.1rem',
                    boxSizing: 'border-box',
                    cursor: 'pointer'
                  }}
                >
                  <option value={2}>2nd Semester (.25cs)</option>
                  <option value={4}>4th Semester (.24cs)</option>
                  <option value={6}>6th Semester (.23cs)</option>
                </select>
              </div>

              {/* Info Box */}
              <div style={{
                padding: '0.75rem',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderRadius: '6px',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                marginBottom: '1rem'
              }}>
                <p style={{
                  color: '#60a5fa',
                  fontSize: isMobile ? '0.8rem' : '0.85rem',
                  margin: 0,
                  lineHeight: '1.5'
                }}>
                  💡 Already registered? Enter your name and semester to login!<br/>
                  <strong>New user?</strong> Switch to Register tab first.
                </p>
              </div>
            </>
          )}
          
          {/* Error Message */}
          {error && (
            <div style={{
              color: '#f87171',
              marginBottom: '1rem',
              padding: '1rem',
              backgroundColor: 'rgba(248, 113, 113, 0.1)',
              borderRadius: '6px',
              fontSize: isMobile ? '0.85rem' : '0.95rem',
              lineHeight: '1.6',
              border: '1px solid rgba(248, 113, 113, 0.3)'
            }}>
              {error.includes('Account already exists') || error.includes('switch to Login') ? (
                <div>
                  <strong style={{ display: 'block', marginBottom: '0.5rem', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                    ⚠️ Account Already Exists
                  </strong>
                  <span>{error}</span>
                  <button
                    onClick={() => setIsRegisterMode(false)}
                    style={{
                      marginTop: '0.75rem',
                      backgroundColor: '#4ade80',
                      color: '#0a192f',
                      border: 'none',
                      padding: '0.5rem 1.5rem',
                      borderRadius: '20px',
                      fontWeight: 'bold',
                      fontSize: isMobile ? '0.85rem' : '0.9rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#22c55e'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#4ade80'
                    }}
                  >
                    → Switch to Login
                  </button>
                </div>
              ) : error.includes('No account found') || error.includes('register first') ? (
                <div>
                  <strong style={{ display: 'block', marginBottom: '0.5rem', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                    ⚠️ No Account Found
                  </strong>
                  <span>{error}</span>
                  <button
                    onClick={() => setIsRegisterMode(true)}
                    style={{
                      marginTop: '0.75rem',
                      backgroundColor: '#4ade80',
                      color: '#0a192f',
                      border: 'none',
                      padding: '0.5rem 1.5rem',
                      borderRadius: '20px',
                      fontWeight: 'bold',
                      fontSize: isMobile ? '0.85rem' : '0.9rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#22c55e'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#4ade80'
                    }}
                  >
                    → Switch to Register
                  </button>
                </div>
              ) : (
                error
              )}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading || (isRegisterMode && !generatedEmail)}
            style={{
              backgroundColor: loading || (isRegisterMode && !generatedEmail) ? '#374151' : '#4ade80',
              color: '#0a192f',
              border: 'none',
              padding: isMobile ? '0.75rem' : '1rem 2rem',
              fontSize: isMobile ? '1rem' : '1.1rem',
              borderRadius: '30px',
              cursor: loading || (isRegisterMode && !generatedEmail) ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              width: '100%',
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? 'Processing...' : (isRegisterMode ? 'Register & Start Contest' : 'Login to Contest')}
          </button>
        </form>
        
        {/* Already have an account reminder (shown in Register mode) */}
        {isRegisterMode && (
          <div style={{ 
            marginTop: '1rem',
            padding: '0.75rem',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '6px',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            textAlign: 'center'
          }}>
            <p style={{ 
              color: '#60a5fa', 
              fontSize: isMobile ? '0.8rem' : '0.85rem',
              margin: 0,
              lineHeight: '1.5'
            }}>
              🔑 Already have an account?{' '}
              <button
                onClick={() => setIsRegisterMode(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#4ade80',
                  fontWeight: 'bold',
                  fontSize: isMobile ? '0.8rem' : '0.85rem',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0
                }}
              >
                Click here to Login
              </button>
              <br/>
              <span style={{ fontSize: isMobile ? '0.7rem' : '0.75rem', color: '#fbbf24' }}>
                ⚠️ One account per student - Do NOT register multiple times
              </span>
            </p>
          </div>
        )}

        <div style={{ 
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: 'rgba(100, 255, 218, 0.1)',
          borderRadius: '8px',
          border: '1px solid rgba(100, 255, 218, 0.2)'
        }}>
          <p style={{ 
            color: '#64ffda', 
            fontSize: isMobile ? '0.85rem' : '0.9rem',
            marginBottom: '0.5rem',
            fontWeight: 'bold'
          }}>
            ℹ️ Important Notes:
          </p>
          <ul style={{
            color: '#94a3b8',
            fontSize: isMobile ? '0.8rem' : '0.85rem',
            textAlign: 'left',
            margin: 0,
            paddingLeft: '1.5rem',
            lineHeight: '1.6'
          }}>
            <li>Your email is auto-generated based on your name and semester</li>
            <li>Password is first 4 letters of your name + "2026"</li>
            <li>If you have same name as another student, number will be added (e.g., Ravi12026)</li>
            <li>This email will be used for the leaderboard and certificate</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Sem2Login
