import React, { useState, useEffect } from 'react'
import API from '../utils/api'

const Leaderboard = ({ onBackToHome }) => {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({ totalParticipants: 0, avgScore: 0, topScore: 0 })
  const [userRank, setUserRank] = useState(null)

  // Check if we have pre-loaded data from contest completion
  React.useEffect(() => {
    const contestData = localStorage.getItem('contestCompletedData');
    if (contestData) {
      try {
        const data = JSON.parse(contestData);
        console.log('Using pre-loaded contest completed data:', data);
        
        // Set leaderboard data from contest completion
        setLeaderboard(data.leaderboard || []);
        setStats({
          totalParticipants: data.totalParticipants || 0,
          avgScore: Math.round((data.leaderboard || []).reduce((sum, entry) => sum + entry.totalPoints, 0) / (data.leaderboard?.length || 1)),
          topScore: data.leaderboard?.[0]?.totalPoints || 0
        });
        setUserRank(data.userRank || null);
        setLoading(false);
        
        // Clear the temporary data
        localStorage.removeItem('contestCompletedData');
      } catch (err) {
        console.error('Error parsing contest completed data:', err);
        localStorage.removeItem('contestCompletedData');
      }
    }
  }, []);

  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboard = async () => {
      // Don't fetch if we already have pre-loaded data
      if (leaderboard.length > 0 && userRank) {
        return;
      }
      
      try {
        const response = await fetch(API.LEADERBOARD)
        const data = await response.json()
        
        if (response.ok) {
          setLeaderboard(data.leaderboard)
          // Calculate stats
          if (data.leaderboard && data.leaderboard.length > 0) {
            const totalPoints = data.leaderboard.reduce((sum, entry) => sum + entry.totalPoints, 0)
            setStats({
              totalParticipants: data.totalParticipants || data.leaderboard.length,
              avgScore: Math.round(totalPoints / data.leaderboard.length),
              topScore: data.leaderboard[0]?.totalPoints || 0
            })
          }
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
          <div>
            <h1 style={{ 
              color: '#64ffda', 
              margin: 0,
              textShadow: '0 0 8px rgba(100, 255, 218, 0.3)',
              fontSize: isMobile ? '1.3rem' : '1.5rem'
            }}>
              🏆 Mind vs Machines - Leaderboard
            </h1>
            <p style={{ 
              color: '#94a3b8', 
              margin: '0.5rem 0 0 0',
              fontSize: isMobile ? '0.8rem' : '0.9rem'
            }}>
              Track your progress through all rounds of the AI challenge
            </p>
            {userRank && (
              <div style={{ 
                marginTop: '1rem',
                padding: '1rem',
                backgroundColor: 'rgba(74, 222, 128, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(74, 222, 128, 0.3)'
              }}>
                <p style={{ 
                  margin: 0, 
                  color: '#4ade80', 
                  fontWeight: 'bold',
                  fontSize: isMobile ? '0.9rem' : '1rem'
                }}>
                  🎉 Your Rank: #{userRank} | Total Points: {leaderboard[userRank - 1]?.totalPoints || 0}
                </p>
              </div>
            )}
          </div>
          {!isMobile && (
            <div style={{ 
              display: 'flex', 
              gap: '2rem',
              backgroundColor: 'rgba(10, 25, 47, 0.5)',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid rgba(100, 255, 218, 0.1)'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#64ffda', fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalParticipants}</div>
                <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Participants</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#fbbf24', fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.topScore}</div>
                <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Top Score</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#f97316', fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.avgScore}</div>
                <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Avg Score</div>
              </div>
            </div>
          )}
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
                    <div style={{ fontWeight: 'bold', color: '#64ffda' }}>
                      Total: {entry.totalPoints} pts
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      R1: {entry.round1Score} | R2: {entry.round2Score} | R3: {entry.round3Score}
                    </div>
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
                    <div>Time: {Math.floor(entry.timeTaken / 60)}m {Math.round(entry.timeTaken % 60)}s</div>
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
              <thead style={{ position: 'sticky', top: 0, backgroundColor: 'rgba(10, 25, 47, 0.95)', zIndex: 10 }}>
                <tr style={{
                  borderBottom: '2px solid rgba(100, 255, 218, 0.3)'
                }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Rank</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Participant</th>
                  <th style={{ padding: '1rem', textAlign: 'center', backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>Round 1<br/><small style={{color: '#94a3b8'}}>Quiz</small></th>
                  <th style={{ padding: '1rem', textAlign: 'center', backgroundColor: 'rgba(139, 92, 246, 0.1)' }}>Round 2<br/><small style={{color: '#94a3b8'}}>Activities</small></th>
                  <th style={{ padding: '1rem', textAlign: 'center', backgroundColor: 'rgba(236, 72, 153, 0.1)' }}>Round 3<br/><small style={{color: '#94a3b8'}}>Escape Key</small></th>
                  <th style={{ padding: '1rem', textAlign: 'center', backgroundColor: 'rgba(100, 255, 218, 0.1)' }}>Total Points</th>
                  <th style={{ padding: '1rem', textAlign: 'center' }}>Accuracy</th>
                  <th style={{ padding: '1rem', textAlign: 'center' }}>Time Taken</th>
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
                      <span style={{ fontWeight: 'bold', color: '#e2e8f0' }}>
                        {entry.email.split('@')[0]}
                      </span>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8' }}>
                        {entry.email}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span style={{ 
                        display: 'inline-block',
                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                        color: '#60a5fa',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontWeight: 'bold',
                        fontSize: '0.9rem'
                      }}>
                        {entry.round1Score}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span style={{ 
                        display: 'inline-block',
                        backgroundColor: 'rgba(139, 92, 246, 0.2)',
                        color: '#a78bfa',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontWeight: 'bold',
                        fontSize: '0.9rem'
                      }}>
                        {entry.round2Score}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span style={{ 
                        display: 'inline-block',
                        backgroundColor: 'rgba(236, 72, 153, 0.2)',
                        color: '#f472b6',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontWeight: 'bold',
                        fontSize: '0.9rem'
                      }}>
                        {entry.round3Score}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 'bold', color: '#64ffda' }}>
                      {entry.totalPoints}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <div style={{ fontWeight: 'bold', color: '#64ffda' }}>{entry.accuracy}%</div>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.9rem', color: '#e2e8f0' }}>
                        {Math.floor(entry.timeTaken / 60)}m {Math.round(entry.timeTaken % 60)}s
                      </div>
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
          🤖 Mind vs Machines Challenge • Leaderboard updates every 15 seconds • Rankings based on total points (time is tiebreaker)
        </div>
      </div>
    </div>
  )
}

export default Leaderboard