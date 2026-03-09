import React, { useState, useEffect } from 'react'
import API from '../utils/api'

const Sem2Leaderboard = ({ onBackToHome }) => {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [userRank, setUserRank] = useState(null)
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    fetchLeaderboard()
    const interval = setInterval(fetchLeaderboard, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(API.SEM2_LEADERBOARD)
      const data = await response.json()
      
      if (response.ok) {
        setLeaderboard(data.leaderboard)
        
        // Find current user (from localStorage or session)
        const token = localStorage.getItem('token')
        if (token) {
          try {
            const tokenData = JSON.parse(atob(token.split('.')[1]))
            const userEntry = data.leaderboard.find(entry => entry.userId === tokenData.userId)
            if (userEntry) {
              setUserRank(userEntry.rank)
              setUserData(userEntry)
            }
          } catch (error) {
            console.error('Error parsing token:', error)
          }
        }
      }
    } catch (error) {
      console.error('Leaderboard fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  const isMobile = window.innerWidth <= 768

  if (loading) {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '5px solid rgba(100, 255, 218, 0.3)',
          borderTop: '5px solid #64ffda',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto'
        }} />
      </div>
    )
  }

  return (
    <div style={{
      padding: isMobile ? '1rem' : '2rem',
      maxWidth: '1400px',
      margin: '0 auto'
    }}>
      <div style={{
        backgroundColor: 'rgba(30, 58, 95, 0.6)',
        padding: isMobile ? '1.5rem' : '2rem',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(30, 58, 95, 0.3)',
        border: '1px solid rgba(100, 255, 218, 0.2)',
        backdropFilter: 'blur(4px)'
      }}>
        <h1 style={{ 
          color: '#64ffda', 
          marginBottom: '0.5rem',
          textAlign: 'center',
          textShadow: '0 0 10px rgba(100, 255, 218, 0.5)'
        }}>
          🏆 2nd Semester Contest Leaderboard 🏆
        </h1>
        
        <p style={{
          color: '#94a3b8',
          textAlign: 'center',
          marginBottom: '2rem',
          fontSize: isMobile ? '0.9rem' : '1rem'
        }}>
          Total Participants: {leaderboard.length}
        </p>

        {/* User Rank Highlight */}
        {userData && (
          <div style={{
            backgroundColor: 'rgba(74, 222, 128, 0.2)',
            border: '2px solid #4ade80',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            <p style={{ color: '#4ade80', fontSize: '1.1rem', fontWeight: 'bold' }}>
              Your Rank: #{userRank}
            </p>
            <p style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>
              {userData.fullName} - {userData.totalPoints} points - {formatTime(userData.totalTime)}
            </p>
          </div>
        )}

        {/* Leaderboard Table */}
        {isMobile ? (
          // Mobile Cards View
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            {leaderboard.map((entry, index) => (
              <div
                key={`${entry.userId}-${index}`}
                style={{
                  backgroundColor: 'rgba(10, 25, 47, 0.5)',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: index < 3 ? '2px solid #fbbf24' : '1px solid rgba(100, 255, 218, 0.2)',
                  opacity: userData && entry.userId === userData.userId ? 1 : 0.8
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{
                    color: index === 0 ? '#fbbf24' : index === 1 ? '#9ca3af' : index === 2 ? '#b45309' : '#64ffda',
                    fontWeight: 'bold',
                    fontSize: '1.2rem'
                  }}>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${entry.rank}`}
                  </span>
                  <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>
                    {entry.totalPoints} pts
                  </span>
                </div>
                
                <p style={{ color: '#e2e8f0', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                  {entry.fullName}
                </p>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                  {entry.email}
                </p>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.5rem',
                  marginTop: '0.5rem',
                  fontSize: '0.85rem'
                }}>
                  <span style={{ color: '#64ffda' }}>R1: {entry.round1Score}</span>
                  <span style={{ color: '#64ffda' }}>R2: {entry.round2Score}</span>
                  <span style={{ color: '#64ffda' }}>R3: {entry.round3Score}</span>
                  <span style={{ color: '#64ffda' }}>Time: {formatTime(entry.totalTime)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Desktop Table View
          <div style={{
            overflowX: 'auto'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              color: '#e2e8f0'
            }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #64ffda' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', color: '#64ffda' }}>Rank</th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: '#64ffda' }}>Name</th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: '#64ffda' }}>Email</th>
                  <th style={{ padding: '1rem', textAlign: 'center', color: '#64ffda' }}>Round 1</th>
                  <th style={{ padding: '1rem', textAlign: 'center', color: '#64ffda' }}>Round 2</th>
                  <th style={{ padding: '1rem', textAlign: 'center', color: '#64ffda' }}>Round 3</th>
                  <th style={{ padding: '1rem', textAlign: 'center', color: '#64ffda' }}>Total Points</th>
                  <th style={{ padding: '1rem', textAlign: 'center', color: '#64ffda' }}>Total Time</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => (
                  <tr
                    key={`${entry.userId}-${index}`}
                    style={{
                      borderBottom: '1px solid rgba(100, 255, 218, 0.1)',
                      backgroundColor: userData && entry.userId === userData.userId 
                        ? 'rgba(74, 222, 128, 0.1)' 
                        : 'transparent',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(100, 255, 218, 0.05)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = userData && entry.userId === userData.userId
                        ? 'rgba(74, 222, 128, 0.1)'
                        : 'transparent'
                    }}
                  >
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        color: index === 0 ? '#fbbf24' : index === 1 ? '#9ca3af' : index === 2 ? '#b45309' : '#64ffda',
                        fontWeight: 'bold',
                        fontSize: '1.2rem'
                      }}>
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${entry.rank}`}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 'bold', color: '#e2e8f0' }}>
                      {entry.fullName}
                    </td>
                    <td style={{ padding: '1rem', color: '#94a3b8' }}>
                      {entry.email}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', color: '#64ffda' }}>
                      {entry.round1Score}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', color: '#64ffda' }}>
                      {entry.round2Score}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', color: '#64ffda' }}>
                      {entry.round3Score}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 'bold', color: '#fbbf24' }}>
                      {entry.totalPoints}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', color: '#64ffda' }}>
                      {formatTime(entry.totalTime)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button
          onClick={onBackToHome}
          style={{
            marginTop: '2rem',
            backgroundColor: '#64ffda',
            color: '#0a192f',
            border: 'none',
            padding: '0.75rem 2rem',
            borderRadius: '30px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1rem',
            display: 'block',
            margin: '2rem auto 0'
          }}
        >
          ← Back to Home
        </button>
      </div>
    </div>
  )
}

export default Sem2Leaderboard
