import React, { useState, useEffect } from 'react'

const Instructions = ({ onProceed }) => {
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
          marginBottom: '1.5rem',
          textShadow: '0 0 8px rgba(100, 255, 218, 0.3)',
          fontSize: '1.8rem'
        }}>
          📋 Contest Instructions
        </h1>
        
        <div style={{
          backgroundColor: 'rgba(10, 25, 47, 0.5)',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          textAlign: 'left'
        }}>
          <h2 style={{ 
            color: '#64ffda', 
            marginBottom: '0.75rem',
            fontSize: '1.2rem'
          }}>
            Important Guidelines:
          </h2>
          <ul style={{ 
            color: '#e2e8f0',
            paddingLeft: '1.5rem',
            margin: '0.5rem 0',
            fontSize: '0.9rem',
            lineHeight: '1.4'
          }}>
            <li><strong>Fullscreen Required:</strong> You must maintain fullscreen mode throughout the contest</li>
            <li><strong>No Tab Switching:</strong> Switching tabs or opening new windows will result in disqualification</li>
            <li><strong>Single Attempt:</strong> You can only take this test once. Subsequent attempts will redirect to leaderboard</li>
            <li><strong>Time Management:</strong> Complete all rounds in one continuous session</li>
            <li><strong>Fair Play:</strong> Any suspicious activity will be monitored and may lead to disqualification</li>
          </ul>
        </div>

        <div style={{
          backgroundColor: 'rgba(10, 25, 47, 0.5)',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          textAlign: 'left'
        }}>
          <h2 style={{ 
            color: '#64ffda', 
            marginBottom: '0.75rem',
            fontSize: '1.2rem'
          }}>
            Contest Structure:
          </h2>
          <ol style={{ 
            color: '#e2e8f0',
            paddingLeft: '1.5rem',
            margin: '0.5rem 0',
            fontSize: '0.9rem',
            lineHeight: '1.4'
          }}>
            <li><strong>Round 1:</strong> MCQ questions testing AI fundamentals (10 questions)</li>
            <li><strong>Round 2:</strong> 8-Puzzle challenge testing problem-solving skills</li>
            <li><strong>Round 3:</strong> Advanced AI scenario-based questions</li>
            <li><strong>Leaderboard:</strong> Real-time ranking based on accuracy and completion time</li>
          </ol>
        </div>

        <button
          onClick={onProceed}
          style={{
            backgroundColor: '#4ade80',
            color: '#0a192f',
            border: 'none',
            padding: '0.75rem 2rem',
            borderRadius: '30px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(74, 222, 128, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 0 25px rgba(74, 222, 128, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 15px rgba(74, 222, 128, 0.3)';
          }}
        >
          I Understand - Proceed to Login →
        </button>
      </div>
    </div>
  )
}

export default Instructions