import React, { useEffect } from 'react'
import { motion } from 'framer-motion'

const Instructions = ({ onProceed }) => {
  useEffect(() => {
    
    // Prevent text selection in Instructions page
    const preventTextSelection = (e) => {
      e.preventDefault();
      return false;
    };
    
    const preventKeyboardShortcuts = (e) => {
      // Prevent Ctrl+A (select all)
      if (e.ctrlKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        return false;
      }
      // Prevent Ctrl+C (copy)
      if (e.ctrlKey && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        return false;
      }
      // Prevent F12 (developer tools)
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
      // Prevent Ctrl+Shift+I (developer tools)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
      }
    };
    
    // Add event listeners
    document.addEventListener('selectstart', preventTextSelection);
    document.addEventListener('keydown', preventKeyboardShortcuts);
    
    // Cleanup
    return () => {
      document.removeEventListener('selectstart', preventTextSelection);
      document.removeEventListener('keydown', preventKeyboardShortcuts);
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        padding: '1rem',
        maxWidth: '1000px',
        margin: '0 auto',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{
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
        
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
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
        </motion.div>

        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{
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
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(74, 222, 128, 0.6)' }}
          whileTap={{ scale: 0.95 }}
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
            boxShadow: '0 4px 15px rgba(74, 222, 128, 0.3)'
          }}
        >
          I Understand - Proceed to Login →
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

export default Instructions