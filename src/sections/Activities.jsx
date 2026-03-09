import React, { useState, useEffect } from 'react'

const Activities = ({ navigateToContest, setShowContest, setContestState, isMobile = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLocked, setIsLocked] = useState(true); // Set to false to unlock the main contest
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    // Check if password is correct (you can change this to your desired password)
    if (password === 'SVIT@2008') {
      setIsLocked(false);
      setShowPasswordModal(false);
      setPassword('');
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

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
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: isMobile ? '1.5rem' : '2rem',
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
              } else {
                // Show password modal
                setShowPasswordModal(true);
              }
            }}
            style={{
              backgroundColor: isLocked ? '#8b5cf6' : '#4ade80',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '30px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = `0 0 20px ${isLocked ? 'rgba(139, 92, 246, 0.5)' : 'rgba(74, 222, 128, 0.5)'}`;
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = 'none';
            }}
          >
            {isLocked ? 'Unlock with Password' : 'Start Contest'}
          </button>
        </div>
      </div>

      {/* 2nd Semester Contest Card - Always Visible */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: isMobile ? '1.5rem' : '2rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          backgroundColor: 'rgba(30, 58, 95, 0.6)',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(30, 58, 95, 0.3)',
          border: '1px solid rgba(100, 255, 218, 0.2)',
          backdropFilter: 'blur(4px)',
          textAlign: 'center',
          borderColor: '#fbbf24'
        }}>
          <h2 style={{ color: '#fbbf24', marginBottom: '1rem' }}>
            🎯 2nd Semester Contest - C Programming Challenge
          </h2>
          <p style={{ color: '#e2e8f0', marginBottom: '1.5rem', lineHeight: '1.5' }}>
            Exclusive contest for 2nd semester students! Test your C programming skills, 
            solve puzzles, and compete for the top spot!
          </p>
          <ul style={{
            color: '#94a3b8',
            marginBottom: '1.5rem',
            textAlign: 'left',
            paddingLeft: isMobile ? '1rem' : '2rem',
            lineHeight: '1.8',
            fontSize: '0.95rem'
          }}>
            <li>✅ Round 1: C Programming MCQs</li>
            <li>✅ Round 2: Problem Solving Activities (8-Puzzle, Tower of Hanoi & more)</li>
            <li>✅ Round 3: Logic & Reasoning Challenges</li>
            <li>✅ Real-time Leaderboard with Time Tracking</li>
          </ul>
          <button
            onClick={() => {
              window.location.hash = '#/contest/sem2-login';
            }}
            style={{
              backgroundColor: '#fbbf24',
              color: '#0a192f',
              border: 'none',
              padding: '0.75rem 2rem',
              borderRadius: '30px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 16px rgba(251, 191, 36, 0.4)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 6px 24px rgba(251, 191, 36, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 4px 16px rgba(251, 191, 36, 0.4)';
            }}
          >
            Start 2nd Sem Contest →
          </button>
          <p style={{
            color: '#64ffda',
            fontSize: '0.85rem',
            marginTop: '1rem',
            fontStyle: 'italic'
          }}>
            💡 Login with your name and semester - Auto-generates email & password
          </p>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'rgba(30, 58, 95, 0.9)',
            padding: '2rem',
            borderRadius: '12px',
            border: '1px solid rgba(100, 255, 218, 0.3)',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#64ffda', marginBottom: '1rem' }}>
             🔐 Enter Password to Unlock
            </h3>
            <p style={{ color: '#e2e8f0', marginBottom: '1.5rem' }}>
              Please enter the password to access the AI Escape Arena
            </p>
            
            <form onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '2px solid rgba(100, 255, 218, 0.3)',
                  backgroundColor: 'rgba(10, 25, 47, 0.8)',
                  color: '#e2e8f0',
                  marginBottom: '1rem',
                  fontSize: '1rem'
                }}
                autoFocus
              />
              
              {passwordError && (
                <div style={{
                  color: '#ef4444',
                  marginBottom: '1rem',
                  fontSize: '0.9rem'
                }}>
                  {passwordError}
                </div>
              )}
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPassword('');
                    setPasswordError('');
                  }}
                  style={{
                    backgroundColor: '#6b7280',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#4ade80',
                    color: '#0a192f',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Unlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Activities