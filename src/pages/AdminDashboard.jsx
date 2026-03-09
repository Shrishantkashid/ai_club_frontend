import React, { useState, useEffect } from 'react'
import API from '../utils/api'

const AdminDashboard = ({ onBack }) => {
  const [adminToken, setAdminToken] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [attempts, setAttempts] = useState([])
  const [selectedAttempt, setSelectedAttempt] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [view, setView] = useState('login') // login, dashboard, details

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(API.SEM2_ADMIN_LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('adminToken', data.token)
        setAdminToken(data.token)
        setView('dashboard')
        fetchAttempts(data.token)
      } else {
        setError(data.message || 'Login failed')
      }
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const fetchAttempts = async (token = adminToken) => {
    try {
      const response = await fetch(API.SEM2_ADMIN_ATTEMPTS, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (response.ok) {
        setAttempts(data.attempts)
      }
    } catch (error) {
      console.error('Fetch attempts error:', error)
    }
  }

  const viewAttemptDetails = async (userId) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`${API.SEM2_ADMIN_ATTEMPTS}/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (response.ok) {
        setSelectedAttempt(data.attempt)
        setView('details')
      }
    } catch (error) {
      console.error('Fetch attempt details error:', error)
    }
  }

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) return `${hours}h ${minutes}m ${secs}s`
    if (minutes > 0) return `${minutes}m ${secs}s`
    return `${secs}s`
  }

  const exportToCSV = () => {
    const headers = ['Rank', 'Name', 'Email', 'Semester', 'R1 Score', 'R2 Score', 'R3 Score', 'Total Points', 'Total Time', 'Accuracy']
    const rows = attempts.map((attempt, index) => [
      index + 1,
      attempt.user_id?.full_name || 'N/A',
      attempt.user_id?.email || 'N/A',
      attempt.user_id?.semester || 'N/A',
      attempt.round1_score || 0,
      attempt.round2_score || 0,
      attempt.round3_score || 0,
      attempt.total_points || 0,
      formatTime(attempt.total_time_seconds || 0),
      attempt.accuracy || 0
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `contest_attempts_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const isMobile = window.innerWidth <= 768

  // Login View
  if (view === 'login') {
    return (
      <div style={{
        padding: '2rem',
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        <div style={{
          backgroundColor: 'rgba(30, 58, 95, 0.6)',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(30, 58, 95, 0.3)',
          border: '1px solid rgba(100, 255, 218, 0.2)',
          backdropFilter: 'blur(4px)'
        }}>
          <h1 style={{ color: '#64ffda', marginBottom: '1.5rem', textAlign: 'center' }}>
            Admin Login
          </h1>
          
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', color: '#64ffda', marginBottom: '0.5rem' }}>
                Email:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gmail.com"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(100, 255, 218, 0.3)',
                  backgroundColor: 'rgba(10, 25, 47, 0.8)',
                  color: '#e2e8f0'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', color: '#64ffda', marginBottom: '0.5rem' }}>
                Password:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(100, 255, 218, 0.3)',
                  backgroundColor: 'rgba(10, 25, 47, 0.8)',
                  color: '#e2e8f0'
                }}
              />
            </div>

            {error && (
              <div style={{
                color: '#f87171',
                marginBottom: '1rem',
                padding: '0.75rem',
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
                backgroundColor: loading ? '#374151' : '#4ade80',
                color: '#0a192f',
                border: 'none',
                padding: '0.75rem',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                width: '100%'
              }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <button
            onClick={onBack}
            style={{
              marginTop: '1rem',
              backgroundColor: 'transparent',
              color: '#64ffda',
              border: '1px solid rgba(100, 255, 218, 0.3)',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    )
  }

  // Dashboard View
  if (view === 'dashboard') {
    return (
      <div style={{
        padding: '2rem',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <div style={{
          backgroundColor: 'rgba(30, 58, 95, 0.6)',
          padding: '2rem',
          borderRadius: '12px',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <h1 style={{ color: '#64ffda', margin: 0 }}>
              📊 Admin Dashboard - 2nd Semester Contest
            </h1>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={exportToCSV}
                style={{
                  backgroundColor: '#fbbf24',
                  color: '#0a192f',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                📥 Export CSV
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('adminToken')
                  setAdminToken(null)
                  setView('login')
                }}
                style={{
                  backgroundColor: '#f87171',
                  color: '#0a192f',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Logout
              </button>
            </div>
          </div>

          <p style={{ color: '#e2e8f0', marginBottom: '1rem' }}>
            Total Attempts: {attempts.length}
          </p>

          {/* Attempts Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#e2e8f0' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #64ffda' }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Student</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Email</th>
                  <th style={{ padding: '1rem', textAlign: 'center' }}>Sem</th>
                  <th style={{ padding: '1rem', textAlign: 'center' }}>R1</th>
                  <th style={{ padding: '1rem', textAlign: 'center' }}>R2</th>
                  <th style={{ padding: '1rem', textAlign: 'center' }}>R3</th>
                  <th style={{ padding: '1rem', textAlign: 'center' }}>Total</th>
                  <th style={{ padding: '1rem', textAlign: 'center' }}>Time</th>
                  <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((attempt, index) => (
                  <tr
                    key={attempt._id}
                    style={{ borderBottom: '1px solid rgba(100, 255, 218, 0.1)' }}
                  >
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>
                      {attempt.user_id?.full_name || 'Unknown'}
                    </td>
                    <td style={{ padding: '1rem', color: '#94a3b8' }}>
                      {attempt.user_id?.email || 'Unknown'}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      {attempt.user_id?.semester || 'N/A'}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', color: '#64ffda' }}>
                      {attempt.round1_score || 0}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', color: '#64ffda' }}>
                      {attempt.round2_score || 0}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', color: '#64ffda' }}>
                      {attempt.round3_score || 0}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 'bold', color: '#fbbf24' }}>
                      {attempt.total_points || 0}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', color: '#64ffda' }}>
                      {formatTime(attempt.total_time_seconds || 0)}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <button
                        onClick={() => viewAttemptDetails(attempt.user_id?._id)}
                        style={{
                          backgroundColor: '#64ffda',
                          color: '#0a192f',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: '0.9rem'
                        }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  // Attempt Details View
  if (view === 'details' && selectedAttempt) {
    return (
      <div style={{
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          backgroundColor: 'rgba(30, 58, 95, 0.6)',
          padding: '2rem',
          borderRadius: '12px'
        }}>
          <button
            onClick={() => setView('dashboard')}
            style={{
              backgroundColor: 'transparent',
              color: '#64ffda',
              border: '1px solid rgba(100, 255, 218, 0.3)',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              marginBottom: '1.5rem'
            }}
          >
            ← Back to Dashboard
          </button>

          <h2 style={{ color: '#64ffda', marginBottom: '1.5rem' }}>
            Attempt Details - {selectedAttempt.user_id?.full_name}
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div style={{ backgroundColor: 'rgba(10, 25, 47, 0.5)', padding: '1rem', borderRadius: '8px' }}>
              <p style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>Email:</p>
              <p style={{ color: '#e2e8f0', fontWeight: 'bold' }}>{selectedAttempt.user_id?.email}</p>
            </div>
            <div style={{ backgroundColor: 'rgba(10, 25, 47, 0.5)', padding: '1rem', borderRadius: '8px' }}>
              <p style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>Semester:</p>
              <p style={{ color: '#e2e8f0', fontWeight: 'bold' }}>{selectedAttempt.user_id?.semester || 'N/A'}</p>
            </div>
            <div style={{ backgroundColor: 'rgba(10, 25, 47, 0.5)', padding: '1rem', borderRadius: '8px' }}>
              <p style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>Total Points:</p>
              <p style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '1.5rem' }}>{selectedAttempt.total_points || 0}</p>
            </div>
            <div style={{ backgroundColor: 'rgba(10, 25, 47, 0.5)', padding: '1rem', borderRadius: '8px' }}>
              <p style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>Total Time:</p>
              <p style={{ color: '#64ffda', fontWeight: 'bold', fontSize: '1.5rem' }}>{formatTime(selectedAttempt.total_time_seconds || 0)}</p>
            </div>
          </div>

          {/* Round Details */}
          <h3 style={{ color: '#64ffda', marginBottom: '1rem' }}>Round 1 Answers</h3>
          <div style={{
            backgroundColor: 'rgba(10, 25, 47, 0.5)',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            maxHeight: '300px',
            overflowY: 'auto'
          }}>
            {selectedAttempt.round1_answers?.map((answer, index) => (
              <div key={index} style={{
                padding: '0.5rem',
                marginBottom: '0.5rem',
                backgroundColor: answer.isCorrect ? 'rgba(74, 222, 128, 0.1)' : 'rgba(248, 113, 113, 0.1)',
                borderRadius: '4px',
                border: `1px solid ${answer.isCorrect ? '#4ade80' : '#f87171'}`
              }}>
                <span style={{ color: '#e2e8f0' }}>Q{index + 1}: </span>
                <span style={{ color: answer.isCorrect ? '#4ade80' : '#f87171' }}>
                  {answer.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                </span>
              </div>
            )) || <p style={{ color: '#94a3b8' }}>No answers recorded</p>}
          </div>

          <h3 style={{ color: '#64ffda', marginBottom: '1rem' }}>Round 2 Activities</h3>
          <div style={{
            backgroundColor: 'rgba(10, 25, 47, 0.5)',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem'
          }}>
            {selectedAttempt.round2_activities_completed?.map((activity, index) => (
              <div key={index} style={{
                padding: '0.5rem',
                marginBottom: '0.5rem',
                backgroundColor: 'rgba(100, 255, 218, 0.1)',
                borderRadius: '4px'
              }}>
                <span style={{ color: '#64ffda', fontWeight: 'bold' }}>{activity.activityName}</span>
                <span style={{ color: '#e2e8f0', marginLeft: '1rem' }}>
                  Moves: {activity.moves}, Time: {formatTime(activity.timeTaken)}
                </span>
              </div>
            )) || <p style={{ color: '#94a3b8' }}>No activities recorded</p>}
          </div>

          <h3 style={{ color: '#64ffda', marginBottom: '1rem' }}>Round 3 Answers</h3>
          <div style={{
            backgroundColor: 'rgba(10, 25, 47, 0.5)',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem'
          }}>
            <p style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>Task Answers:</p>
            {selectedAttempt.round3_task_answers?.map((answer, index) => (
              <div key={index} style={{
                padding: '0.5rem',
                marginBottom: '0.5rem',
                backgroundColor: answer.isCorrect ? 'rgba(74, 222, 128, 0.1)' : 'rgba(248, 113, 113, 0.1)',
                borderRadius: '4px',
                border: `1px solid ${answer.isCorrect ? '#4ade80' : '#f87171'}`
              }}>
                <span style={{ color: '#e2e8f0' }}>{answer.taskType} #{answer.taskNumber}: </span>
                <span style={{ color: answer.isCorrect ? '#4ade80' : '#f87171' }}>
                  {answer.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                </span>
              </div>
            )) || <p style={{ color: '#94a3b8' }}>No task answers recorded</p>}

            <p style={{ color: '#94a3b8', marginTop: '1rem', marginBottom: '0.5rem' }}>Riddle Answers:</p>
            {selectedAttempt.round3_riddle_answers?.map((answer, index) => (
              <div key={index} style={{
                padding: '0.5rem',
                marginBottom: '0.5rem',
                backgroundColor: answer.isCorrect ? 'rgba(74, 222, 128, 0.1)' : 'rgba(248, 113, 113, 0.1)',
                borderRadius: '4px',
                border: `1px solid ${answer.isCorrect ? '#4ade80' : '#f87171'}`
              }}>
                <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>Key Letter: {answer.keyLetter}</span>
                <span style={{ color: answer.isCorrect ? '#4ade80' : '#f87171', marginLeft: '1rem' }}>
                  {answer.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                </span>
              </div>
            )) || <p style={{ color: '#94a3b8' }}>No riddle answers recorded</p>}
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default AdminDashboard
