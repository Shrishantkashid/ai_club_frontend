import React from 'react'

const Round3 = ({ onProceedToLeaderboard }) => {
  return (
    <div style={{
      padding: '2rem',
      maxWidth: '1200px',
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
          marginBottom: '2rem',
          textShadow: '0 0 8px rgba(100, 255, 218, 0.3)'
        }}>
          Round 3: Advanced AI Escape Simulation
        </h1>
        
        <div style={{
          backgroundColor: 'rgba(10, 25, 47, 0.5)',
          padding: '2rem',
          borderRadius: '8px',
          margin: '2rem 0'
        }}>
          <h2 style={{ 
            color: '#e2e8f0', 
            marginBottom: '1rem' 
          }}>
            Coming Soon
          </h2>
          <p style={{ 
            color: '#94a3b8', 
            fontSize: '1.1rem',
            lineHeight: '1.6'
          }}>
            Prepare for the ultimate challenge! This round will feature an advanced AI escape simulation 
            where you'll need to navigate through complex AI scenarios and solve multi-layered problems 
            to escape the digital maze.
          </p>
        </div>
        
        <div style={{ marginTop: '2rem' }}>
          <button
            onClick={onProceedToLeaderboard}
            style={{
              backgroundColor: '#4ade80',
              color: '#0a192f',
              border: 'none',
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              borderRadius: '30px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 0 20px rgba(74, 222, 128, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = 'none';
            }}
          >
            View Leaderboard
          </button>
        </div>
      </div>
    </div>
  )
}

export default Round3