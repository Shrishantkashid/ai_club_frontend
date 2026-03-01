import React, { useState, useEffect } from 'react'

const ActivityCard = ({ onStartContest }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div style={{
      padding: '1rem',
      maxWidth: '1000px',
      margin: '0 auto',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: 'rgba(30, 58, 95, 0.6)',
        padding: '1.5rem',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(30, 58, 95, 0.3)',
        border: '1px solid rgba(100, 255, 218, 0.2)',
        backdropFilter: 'blur(4px)',
        textAlign: 'center',
        maxWidth: '600px',
        width: '100%'
      }}>
        <h1 style={{
          color: '#64ffda',
          marginBottom: '1rem',
          textShadow: '0 0 8px rgba(100, 255, 218, 0.3)',
          fontSize: '2rem'
        }}>
          🧠 Mind vs Machine: AI Escape Arena
        </h1>
        
        <div style={{
          backgroundColor: 'rgba(10, 25, 47, 0.5)',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          border: '1px solid rgba(100, 255, 218, 0.1)'
        }}>
          <h2 style={{ 
            color: '#64ffda', 
            marginBottom: '0.75rem',
            fontSize: '1.2rem'
          }}>
            Contest Overview
          </h2>
          <ul style={{ 
            textAlign: 'left', 
            color: '#e2e8f0',
            paddingLeft: '1.5rem',
            margin: '0.5rem 0',
            fontSize: '0.9rem'
          }}>
            <li>3 challenging rounds testing your AI knowledge</li>
            <li>Real-time leaderboard competition</li>
            <li>Cheat detection system enabled</li>
            <li>Complete in one sitting - no multiple attempts</li>
          </ul>
        </div>

        <div style={{
          backgroundColor: 'rgba(10, 25, 47, 0.5)',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          border: '1px solid rgba(100, 255, 218, 0.1)'
        }}>
          <h2 style={{ 
            color: '#64ffda', 
            marginBottom: '0.75rem',
            fontSize: '1.2rem'
          }}>
            Rules & Guidelines
          </h2>
          <ul style={{ 
            textAlign: 'left', 
            color: '#e2e8f0',
            paddingLeft: '1.5rem',
            margin: '0.5rem 0',
            fontSize: '0.9rem'
          }}>
            <li>Maintain fullscreen mode throughout the contest</li>
            <li>Do not switch tabs or open new windows</li>
            <li>Complete all rounds in one session</li>
            <li>One attempt per user - subsequent attempts go to leaderboard</li>
          </ul>
        </div>

        <button
          onClick={onStartContest}
          style={{
            backgroundColor: '#64ffda',
            color: '#0a192f',
            border: 'none',
            padding: '0.75rem 2rem',
            borderRadius: '30px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(100, 255, 218, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 0 25px rgba(100, 255, 218, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 15px rgba(100, 255, 218, 0.3)';
          }}
        >
          Start Contest →
        </button>
      </div>
    </div>
  )
}

export default ActivityCard