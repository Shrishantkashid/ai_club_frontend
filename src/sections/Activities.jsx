import React, { useState, useEffect } from 'react'

const Activities = ({ navigateToContest, setShowContest, setContestState }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLocked, setIsLocked] = useState(true); // Set to false to unlock the main contest
  const [testQuizLocked, setTestQuizLocked] = useState(false); // Unlock the test quiz by default

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <h1 style={{
        textAlign: 'center',
        color: '#64ffda',
        marginBottom: '2rem',
        textShadow: '0 0 8px rgba(100, 255, 218, 0.3)',
        fontSize: '2.5rem'
      }}>
        Club Activities
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          backgroundColor: 'rgba(30, 58, 95, 0.6)',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(30, 58, 95, 0.3)',
          border: '1px solid rgba(100, 255, 218, 0.2)',
          backdropFilter: 'blur(4px)',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#64ffda', marginBottom: '1rem' }}>
            {isLocked ? '🔒 ' : ''}Mind vs Machine: AI Escape Arena
          </h2>
          <p style={{ color: '#e2e8f0', marginBottom: '1.5rem', lineHeight: '1.5' }}>
            Challenge your AI knowledge and problem-solving skills in our thrilling escape arena.
          </p>
          <button
            onClick={() => {
              if (!isLocked && navigateToContest) {
                navigateToContest();
              } else if (!isLocked) {
                // Fallback to direct navigation
                window.location.hash = '#/contest';
              }
            }}
            disabled={isLocked}
            style={{
              backgroundColor: isLocked ? '#6b7280' : '#4ade80',
              color: isLocked ? '#9ca3af' : '#0a192f',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '30px',
              cursor: isLocked ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              opacity: isLocked ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
              if (!isLocked) {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 0 20px rgba(74, 222, 128, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLocked) {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            {isLocked ? 'Locked' : 'Start Contest'}
          </button>
        </div>
        
        {/* New Test Quiz Activity */}
        <div style={{
          backgroundColor: 'rgba(30, 58, 95, 0.6)',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(30, 58, 95, 0.3)',
          border: '1px solid rgba(100, 255, 218, 0.2)',
          backdropFilter: 'blur(4px)',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#64ffda', marginBottom: '1rem' }}>
            {testQuizLocked ? '🔒 ' : ''}🧩 Test Your Knowledge: Basic AI Concepts
          </h2>
          <p style={{ color: '#e2e8f0', marginBottom: '1.5rem', lineHeight: '1.5' }}>
            A sample quiz to test your understanding of fundamental AI concepts and terminology.
          </p>
          <button
            onClick={() => {
              if (!testQuizLocked) {
                // Lock the button immediately
                setTestQuizLocked(true);
                // Navigate to test quiz login first
                window.location.hash = '#/test-quiz-login';
                setShowContest(true);
                setContestState('test-quiz-login');
              }
            }}
            disabled={testQuizLocked}
            style={{
              backgroundColor: testQuizLocked ? '#6b7280' : '#4ade80',
              color: testQuizLocked ? '#9ca3af' : '#0a192f',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '30px',
              cursor: testQuizLocked ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              opacity: testQuizLocked ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
              if (!testQuizLocked) {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 0 20px rgba(74, 222, 128, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              if (!testQuizLocked) {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            {testQuizLocked ? 'Locked' : 'Start Test Quiz'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Activities