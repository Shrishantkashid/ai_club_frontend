import React, { useState, useEffect } from 'react';

const TestQuizLeaderboard = ({ onBackToActivities }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLeaderboard();
    
    // Set up periodic updates to refresh the leaderboard every 30 seconds
    const interval = setInterval(fetchLeaderboard, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/test-quiz/leaderboard');
      
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setLeaderboard(data.leaderboard);
      } else {
        throw new Error(data.message || 'Failed to fetch leaderboard');
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isMobile = window.innerWidth <= 768;

  if (loading) {
    return (
      <div style={{
        padding: isMobile ? '1rem' : '2rem',
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <div style={{
          backgroundColor: 'rgba(30, 58, 95, 0.6)',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(30, 58, 95, 0.3)',
          border: '1px solid rgba(100, 255, 218, 0.2)',
          backdropFilter: 'blur(4px)'
        }}>
          <h1 style={{ 
            color: '#64ffda', 
            marginBottom: '1rem',
            textShadow: '0 0 8px rgba(100, 255, 218, 0.3)'
          }}>
            Test Quiz Leaderboard
          </h1>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#64ffda'
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              border: '2px solid #64ffda',
              borderRightColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <span>Loading leaderboard...</span>
          </div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: isMobile ? '1rem' : '2rem',
        maxWidth: '800px',
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
          <h1 style={{ 
            color: '#64ffda', 
            marginBottom: '1rem',
            textShadow: '0 0 8px rgba(100, 255, 218, 0.3)'
          }}>
            Test Quiz Leaderboard
          </h1>
          <div style={{
            backgroundColor: '#dc2626',
            color: 'white',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            Error loading leaderboard: {error}
          </div>
          <button
            onClick={fetchLeaderboard}
            style={{
              backgroundColor: '#64ffda',
              color: '#0a192f',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.2s ease'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: isMobile ? '1rem' : '2rem',
      maxWidth: '1000px',
      margin: '0 auto'
    }}>
      <div style={{
        backgroundColor: 'rgba(30, 58, 95, 0.6)',
        padding: isMobile ? '1rem' : '2rem',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(30, 58, 95, 0.3)',
        border: '1px solid rgba(100, 255, 218, 0.2)',
        backdropFilter: 'blur(4px)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <h1 style={{ 
            color: '#64ffda', 
            margin: 0,
            textShadow: '0 0 8px rgba(100, 255, 218, 0.3)',
            fontSize: isMobile ? '1.5rem' : '2rem'
          }}>
            Test Quiz Leaderboard
          </h1>
          <div style={{
            display: 'flex',
            gap: '0.5rem'
          }}>
            <button
              onClick={fetchLeaderboard}
              style={{
                backgroundColor: '#64ffda',
                color: '#0a192f',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.2s ease',
                fontSize: isMobile ? '0.8rem' : '1rem'
              }}
            >
              Refresh
            </button>
            <button
              onClick={onBackToActivities}
              style={{
                backgroundColor: '#4ade80',
                color: '#0a192f',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.2s ease',
                fontSize: isMobile ? '0.8rem' : '1rem'
              }}
            >
              Back to Activities
            </button>
          </div>
        </div>

        <p style={{ 
          color: '#e2e8f0', 
          textAlign: 'center',
          marginBottom: '1.5rem',
          fontStyle: 'italic'
        }}>
          Updated in real-time as users complete the test quiz
        </p>

        {leaderboard.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: '#64ffda'
          }}>
            <p>No test quiz attempts yet. Be the first to take the test!</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              minWidth: '600px'
            }}>
              <thead>
                <tr style={{
                  backgroundColor: 'rgba(100, 255, 218, 0.1)',
                  borderBottom: '2px solid #64ffda'
                }}>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'left',
                    color: '#64ffda',
                    fontWeight: 'bold'
                  }}>
                    Rank
                  </th>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'left',
                    color: '#64ffda',
                    fontWeight: 'bold'
                  }}>
                    Participant
                  </th>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'center',
                    color: '#64ffda',
                    fontWeight: 'bold'
                  }}>
                    Score
                  </th>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'center',
                    color: '#64ffda',
                    fontWeight: 'bold'
                  }}>
                    Percentage
                  </th>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'center',
                    color: '#64ffda',
                    fontWeight: 'bold'
                  }}>
                    Warnings
                  </th>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'right',
                    color: '#64ffda',
                    fontWeight: 'bold'
                  }}>
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => (
                  <tr 
                    key={entry.email + entry.timestamp}
                    style={{
                      backgroundColor: index < 3 ? 'rgba(100, 255, 218, 0.05)' : 'transparent',
                      borderBottom: '1px solid rgba(100, 255, 218, 0.1)'
                    }}
                  >
                    <td style={{
                      padding: '1rem',
                      fontWeight: 'bold',
                      color: index < 3 ? '#64ffda' : '#e2e8f0'
                    }}>
                      {entry.rank}. {index < 3 && (
                        <span>
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                        </span>
                      )}
                    </td>
                    <td style={{
                      padding: '1rem',
                      color: '#e2e8f0'
                    }}>
                      {entry.email}
                    </td>
                    <td style={{
                      padding: '1rem',
                      textAlign: 'center',
                      color: '#4ade80',
                      fontWeight: 'bold'
                    }}>
                      {entry.score}/{entry.totalQuestions}
                    </td>
                    <td style={{
                      padding: '1rem',
                      textAlign: 'center',
                      color: entry.percentage >= 80 ? '#4ade80' : entry.percentage >= 60 ? '#fbbf24' : '#f87171',
                      fontWeight: 'bold'
                    }}>
                      {entry.percentage}%
                    </td>
                    <td style={{
                      padding: '1rem',
                      textAlign: 'center',
                      color: entry.warningCount > 0 ? '#f87171' : '#4ade80',
                      fontWeight: 'bold'
                    }}>
                      {entry.warningCount}
                    </td>
                    <td style={{
                      padding: '1rem',
                      textAlign: 'right',
                      color: '#64ffda',
                      fontSize: '0.9rem'
                    }}>
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestQuizLeaderboard;