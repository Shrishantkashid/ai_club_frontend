import React, { useState, useEffect } from 'react'
import API from '../utils/api'

const Leaderboard = ({ onBackToHome }) => {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(API.LEADERBOARD)
        const data = await response.json()
        
        if (response.ok) {
          setLeaderboard(data.leaderboard)
        } else {
          setError(data.message || 'Failed to fetch leaderboard')
        }
      } catch (err) {
        setError('Network error. Unable to fetch leaderboard.')
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
    
    // Refresh every 15 seconds
    const interval = setInterval(fetchLeaderboard, 15000)
    return () => clearInterval(interval)
  }, [])

  const isMobile = window.innerWidth <= 768

  if (loading) {
    return (
      <div style={{
        padding: isMobile ? '1rem' : '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <div style={{
          backgroundColor: 'rgba(30, 58, 95, 0.6)',
          padding: isMobile ? '1rem' : '2rem',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(30, 58, 95, 0.3)',
          border: '1px solid rgba(100, 255, 218, 0.2)',
          backdropFilter: 'blur(4px)'
        }}>
          <h1 style={{ 
            color: '#64ffda', 
            marginBottom: '2rem',
            textShadow: '0 0 8px rgba(100, 255, 218, 0.3)',
            fontSize: isMobile ? '1.5rem' : '2rem'
          }}>
            Loading Leaderboard...
          </h1>
          <div className="spinner">Loading...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        padding: isMobile ? '1rem' : '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <div style={{
          backgroundColor: 'rgba(30, 58, 95, 0.6)',
          padding: isMobile ? '1rem' : '2rem',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(30, 58, 95, 0.3)',
          border: '1px solid rgba(100, 255, 218, 0.2)',
          backdropFilter: 'blur(4px)'
        }}>
          <h1 style={{ 
            color: '#64ffda', 
            marginBottom: '2rem',
            textShadow: '0 0 8px rgba(100, 255, 218, 0.3)',
            fontSize: isMobile ? '1.5rem' : '2rem'
          }}>
            Leaderboard
          </h1>
          <p style={{ color: '#f87171', fontSize: isMobile ? '1rem' : '1.1rem' }}>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      padding: isMobile ? '0.5rem' : '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        backgroundColor: 'rgba(30, 58, 95, 0.6)',
        padding: isMobile ? '1rem' : '2rem',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(30, 58, 95, 0.3)',
        border: '1px solid rgba(100, 255, 218, 0.2)',
        backdropFilter: 'blur(4px)',
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <h1 style={{ 
            color: '#64ffda', 
            margin: 0,
            textShadow: '0 0 8px rgba(100, 255, 218, 0.3)',
            fontSize: isMobile ? '1.3rem' : '1.5rem'
          }}>
            🏆 Detailed Leaderboard
          </h1>
          <button
            onClick={onBackToHome}
            style={{
              backgroundColor: '#64ffda',
              color: '#0a192f',
              border: 'none',
              padding: isMobile ? '0.5rem 1rem' : '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              fontSize: isMobile ? '0.9rem' : '1rem'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 0 15px rgba(100, 255, 218, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 4px 15px rgba(100, 255, 218, 0.3)';
            }}
          >
            ← Back to Home
          </button>
        </div>
        
        <div style={{ 
          overflowY: 'auto', 
          flex: 1,
          maxHeight: 'calc(100vh - 250px)'
        }}>
          {isMobile ? (
            // Mobile view - simplified table
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '0.5rem' 
            }}>
              {leaderboard.map((entry, index) => (
                <div 
                  key={`${entry.userId}-${index}`}
                  style={{
                    backgroundColor: index < 3 ? 'rgba(74, 222, 128, 0.1)' : 'rgba(10, 25, 47, 0.3)',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(100, 255, 218, 0.2)'
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem' 
                    }}>
                      <span style={{
                        display: 'inline-block',
                        width: '1.5rem',
                        height: '1.5rem',
                        borderRadius: '50%',
                        backgroundColor: 
                          index === 0 ? '#fbbf24' : 
                          index === 1 ? '#e5e7eb' : 
                          index === 2 ? '#f97316' : 
                          'rgba(100, 255, 218, 0.2)',
                        color: 
                          index < 3 ? '#0a192f' : 
                          '#e2e8f0',
                        textAlign: 'center',
                        lineHeight: '1.5rem',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}>
                        {index + 1}
                      </span>
                      <span style={{ 
                        fontWeight: 'bold',
                        color: '#64ffda'
                      }}>
                        {entry.email.split('@')[0]}
                      </span>
                    </div>
                    <span style={{ 
                      fontWeight: 'bold', 
                      color: '#64ffda' 
                    }}>
                      {entry.totalPoints} pts
                    </span>
                  </div>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(3, 1fr)', 
                    gap: '0.5rem',
                    fontSize: '0.8rem'
                  }}>
                    <div>R1: {entry.round1Score}</div>
                    <div>R2: {entry.round2Score}</div>
                    <div>R3: {entry.round3Score}</div>
                    <div>Acc: {entry.accuracy}%</div>
                    <div>Time: {Math.round(entry.timeTaken)}s</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Desktop view - full table
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              color: '#e2e8f0'
            }}>
              <thead style={{ position: 'sticky', top: 0, backgroundColor: 'rgba(10, 25, 47, 0.9)' }}>
                <tr style={{
                  borderBottom: '2px solid rgba(100, 255, 218, 0.3)'
                }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Rank</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Email</th>
                  <th style={{ padding: '1rem', textAlign: 'center' }}>Round 1</th>
                  <th style={{ padding: '1rem', textAlign: 'center' }}>Round 2</th>
                  <th style={{ padding: '1rem', textAlign: 'center' }}>Round 3</th>
                  <th style={{ padding: '1rem', textAlign: 'center' }}>Total Points</th>
                  <th style={{ padding: '1rem', textAlign: 'center' }}>Accuracy</th>
                  <th style={{ padding: '1rem', textAlign: 'center' }}>Time</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => (
                  <tr 
                    key={`${entry.userId}-${index}`}
                    style={{
                      borderBottom: '1px solid rgba(100, 255, 218, 0.1)',
                      backgroundColor: index < 3 ? 'rgba(74, 222, 128, 0.1)' : 'transparent'
                    }}
                  >
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        display: 'inline-block',
                        width: '2rem',
                        height: '2rem',
                        borderRadius: '50%',
                        backgroundColor: 
                          index === 0 ? '#fbbf24' : 
                          index === 1 ? '#e5e7eb' : 
                          index === 2 ? '#f97316' : 
                          'rgba(100, 255, 218, 0.2)',
                        color: 
                          index < 3 ? '#0a192f' : 
                          '#e2e8f0',
                        textAlign: 'center',
                        lineHeight: '2rem',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}>
                        {index + 1}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {entry.email.split('@')[0]}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      {entry.round1Score}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      {entry.round2Score}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      {entry.round3Score}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 'bold', color: '#64ffda' }}>
                      {entry.totalPoints}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      {entry.accuracy}%
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      {Math.round(entry.timeTaken)}s
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        <div style={{ 
          textAlign: 'center', 
          marginTop: '1rem', 
          color: '#94a3b8',
          fontSize: isMobile ? '0.7rem' : '0.9rem',
          padding: '1rem',
          borderTop: '1px solid rgba(100, 255, 218, 0.1)'
        }}>
          Leaderboard updates every 15 seconds • Rankings based on total points and time
        </div>
      </div>
    </div>
  )
}

export default Leaderboard