import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import API from '../utils/api'

const Leaderboard = ({ onBackToHome }) => {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({ totalParticipants: 0, avgScore: 0, topScore: 0 })
  const [userRank, setUserRank] = useState(null)

  // Check if we have pre-loaded data from contest completion
  useEffect(() => {
    const contestData = localStorage.getItem('contestCompletedData');
    if (contestData) {
      try {
        const data = JSON.parse(contestData);
        console.log('Using pre-loaded contest completed data:', data);
        
        // Set leaderboard data from contest completion
        setLeaderboard(data.leaderboard || []);
        setStats({
          totalParticipants: data.totalParticipants || 0,
          avgScore: Math.round((data.leaderboard || []).reduce((sum, entry) => sum + (entry.totalPoints || 0), 0) / (data.leaderboard?.length || 1)),
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
            const totalPoints = data.leaderboard.reduce((sum, entry) => sum + (entry.totalPoints || 0), 0)
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
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
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
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            style={{
              width: '40px',
              height: '40px',
              border: '4px solid rgba(100, 255, 218, 0.1)',
              borderTop: '4px solid #64ffda',
              borderRadius: '50%',
              margin: '0 auto'
            }}
          />
        </motion.div>
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
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
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
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        padding: isMobile ? '0.5rem' : '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
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
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                style={{ 
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
              </motion.div>
            )}
          </div>
          {!isMobile && (
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{ 
                display: 'flex', 
                gap: '2rem',
                backgroundColor: 'rgba(10, 25, 47, 0.5)',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid rgba(100, 255, 218, 0.1)'
              }}>
              <div style={{ textAlign: 'center' }}>
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  style={{ color: '#64ffda', fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalParticipants}</motion.div>
                <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Participants</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: "spring" }}
                  style={{ color: '#fbbf24', fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.topScore}</motion.div>
                <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Top Score</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, type: "spring" }}
                  style={{ color: '#f97316', fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.avgScore}</motion.div>
                <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Avg Score</div>
              </div>
            </motion.div>
          )}
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(100, 255, 218, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            onClick={onBackToHome}
            style={{
              backgroundColor: '#64ffda',
              color: '#0a192f',
              border: 'none',
              padding: isMobile ? '0.5rem 1rem' : '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: isMobile ? '0.9rem' : '1rem'
            }}
          >
            ← Back to Home
          </motion.button>
        </div>
        
        <div style={{ 
          overflowY: 'auto', 
          flex: 1,
          maxHeight: 'calc(100vh - 250px)'
        }}>
          {isMobile ? (
            // Mobile view - simplified table
            <motion.div 
              layout
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '0.5rem' 
              }}>
              <AnimatePresence>
                {leaderboard.map((entry, index) => (
                  <motion.div 
                    layout
                    key={`${entry.fullName}-${index}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
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
                      alignItems: 'center'
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
                          {entry.fullName}
                        </span>
                      </div>
                      <span style={{ 
                        fontWeight: 'bold', 
                        color: '#64ffda' 
                      }}>
                        {entry.totalPoints} pts
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            // Desktop view - simple table with only name and score
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
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Total Score</th>
                </tr>
              </thead>
              <motion.tbody layout>
                <AnimatePresence>
                  {leaderboard.map((entry, index) => (
                    <motion.tr 
                      layout
                      key={`${entry.fullName}-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ backgroundColor: 'rgba(100, 255, 218, 0.05)' }}
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
                          {entry.fullName}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold', color: '#64ffda' }}>
                        {entry.totalPoints}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </motion.tbody>
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
      </motion.div>
    </motion.div>
  )
}

export default Leaderboard