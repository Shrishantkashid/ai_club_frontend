import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Activities = ({ navigateToContest, setShowContest, setContestState, isMobile = false }) => {
  const [isLocked, setIsLocked] = useState(true); // Set to false to unlock the main contest
  const [showArchive, setShowArchive] = useState(false);
  const [password, setPassword] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    // Check if password is correct
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
      padding: isMobile ? '1rem' : '2rem',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <h1 style={{
        textAlign: 'center',
        color: '#64ffda',
        marginBottom: '1rem',
        textShadow: '0 0 12px rgba(100, 255, 218, 0.4)',
        fontSize: isMobile ? '2rem' : '3rem',
        fontWeight: 'bold'
      }}>
        Club Activities
      </h1>
      <p style={{
        textAlign: 'center',
        color: '#94a3b8',
        marginBottom: '3rem',
        fontSize: isMobile ? '0.9rem' : '1.1rem'
      }}>
        Explore our latest challenges and historical contests
      </p>

      {/* Active Activities Section */}
      <div style={{ marginBottom: '4rem' }}>
        <h2 style={{ 
          color: '#e2e8f0', 
          fontSize: '1.5rem', 
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <span style={{ color: '#4ade80' }}>●</span> Active Challenges
        </h2>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem'
          }}
        >
          {/* Open Day Activity Card */}
          <motion.div 
            whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(100, 255, 218, 0.2)' }}
            style={{
              background: 'linear-gradient(135deg, rgba(30, 58, 95, 0.8) 0%, rgba(10, 25, 47, 0.9) 100%)',
              padding: '2.5rem',
              borderRadius: '16px',
              border: '1px solid rgba(100, 255, 218, 0.3)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '350px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{
              position: 'absolute',
              top: '1rem',
              left: '1rem',
              backgroundColor: 'rgba(74, 222, 128, 0.2)',
              color: '#4ade80',
              padding: '0.25rem 0.75rem',
              borderRadius: '4px',
              fontSize: '0.7rem',
              fontWeight: 'bold',
              letterSpacing: '1px'
            }}>NEW EVENT</div>

            <div style={{ 
              fontSize: '3.5rem', 
              marginBottom: '1.5rem',
              filter: 'drop-shadow(0 0 15px rgba(100, 255, 218, 0.4))'
            }}>✨</div>
            <h3 style={{ color: '#64ffda', marginBottom: '1rem', fontSize: '1.8rem', fontWeight: 'bold' }}>
              Open Day Activity
            </h3>
            <p style={{ color: '#e2e8f0', marginBottom: '2rem', lineHeight: '1.6' }}>
              Join us for an immersive experience showcasing the power of AI. 
              Interactive demos, expert talks, and hands-on workshops await!
            </p>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(100, 255, 218, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                window.location.hash = '#/open-day';
              }}
              style={{
                backgroundColor: '#64ffda',
                color: '#0a192f',
                border: 'none',
                padding: '0.8rem 2.5rem',
                borderRadius: '30px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem',
                boxShadow: '0 4px 15px rgba(100, 255, 218, 0.3)'
              }}
            >
              Join Experience →
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Archived Activities Section */}
      <div style={{ marginTop: '2rem' }}>
        <button 
          onClick={() => setShowArchive(!showArchive)}
          style={{
            background: 'none',
            border: 'none',
            color: '#64ffda',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            padding: '1rem 0',
            width: '100%',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(100, 255, 218, 0.1)'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            📂 Archive: Past Contests & Events
          </span>
          <motion.span
            animate={{ rotate: showArchive ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            ▼
          </motion.span>
        </button>

        <AnimatePresence>
          {showArchive && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ 
                padding: '2rem 0',
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem'
              }}>
                {/* Archived Activity 1: AI Escape Arena */}
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ y: -5, boxShadow: '0 12px 40px rgba(30, 58, 95, 0.5)' }}
                  style={{
                    backgroundColor: 'rgba(30, 58, 95, 0.4)',
                    padding: '2rem',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                    border: '1px solid rgba(100, 255, 218, 0.1)',
                    backdropFilter: 'blur(4px)',
                    textAlign: 'center',
                    position: 'relative'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    backgroundColor: 'rgba(148, 163, 184, 0.2)',
                    color: '#94a3b8',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: 'bold'
                  }}>ARCHIVED</div>

                  <h3 style={{ color: '#64ffda', marginBottom: '1rem' }}>
                    {isLocked ? '🔒 ' : ''}Mind vs Machine: AI Escape Arena
                  </h3>
                  <p style={{ color: '#94a3b8', marginBottom: '1.5rem', lineHeight: '1.5', fontSize: '0.9rem' }}>
                    The original AI challenge. Solve riddles and navigate through the digital maze.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (!isLocked) {
                        window.location.hash = '#/contest';
                      } else {
                        setShowPasswordModal(true);
                      }
                    }}
                    style={{
                      backgroundColor: isLocked ? 'rgba(139, 92, 246, 0.3)' : 'rgba(74, 222, 128, 0.3)',
                      color: 'white',
                      border: `1px solid ${isLocked ? '#8b5cf6' : '#4ade80'}`,
                      padding: '0.6rem 1.2rem',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {isLocked ? 'Unlock to View' : 'Revisit Arena'}
                  </motion.button>
                </motion.div>

                {/* Archived Activity 2: 2nd Sem Contest */}
                <motion.div 
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ y: -5, boxShadow: '0 12px 40px rgba(251, 191, 36, 0.1)' }}
                  style={{
                    backgroundColor: 'rgba(30, 58, 95, 0.4)',
                    padding: '2rem',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                    border: '1px solid rgba(251, 191, 36, 0.1)',
                    backdropFilter: 'blur(4px)',
                    textAlign: 'center',
                    position: 'relative'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    backgroundColor: 'rgba(148, 163, 184, 0.2)',
                    color: '#94a3b8',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: 'bold'
                  }}>ARCHIVED</div>

                  <h3 style={{ color: '#fbbf24', marginBottom: '1rem' }}>
                    🎯 2nd Sem C Programming Challenge
                  </h3>
                  <p style={{ color: '#94a3b8', marginBottom: '1.5rem', lineHeight: '1.5', fontSize: '0.9rem' }}>
                    A multi-round logic and programming competition for first-year students.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      window.location.hash = '#/contest/sem2-login';
                    }}
                    style={{
                      backgroundColor: 'rgba(251, 191, 36, 0.2)',
                      color: '#fbbf24',
                      border: '1px solid #fbbf24',
                      padding: '0.6rem 1.2rem',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: 'bold'
                    }}
                  >
                    View Contest →
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
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
            }}
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              style={{
                backgroundColor: 'rgba(30, 58, 95, 0.9)',
                padding: '2rem',
                borderRadius: '12px',
                border: '1px solid rgba(100, 255, 218, 0.3)',
                maxWidth: '400px',
                width: '90%',
                textAlign: 'center',
                boxShadow: '0 0 30px rgba(100, 255, 218, 0.2)'
              }}
            >
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
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
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
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(74, 222, 128, 0.5)' }}
                    whileTap={{ scale: 0.95 }}
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
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Activities