import React from 'react';
import { motion } from 'framer-motion';

const PhotoGallery = ({ isMobile = false }) => {
  return (
    <div style={{
      minHeight: '100%',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center'
    }}>
      {/* Coming Soon Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        whileHover={{ boxShadow: '0 10px 40px rgba(100, 255, 218, 0.2)' }}
        style={{
          backgroundColor: 'rgba(10, 25, 47, 0.7)',
          backdropFilter: 'blur(10px)',
          borderRadius: isMobile ? '15px' : '20px',
          padding: isMobile ? '1.5rem' : '3rem',
          maxWidth: '600px',
          width: '100%',
          border: '1px solid rgba(100, 255, 218, 0.3)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
          position: 'relative',
          zIndex: 1
        }}
      >
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            fontSize: isMobile ? '3.5rem' : '5rem',
            marginBottom: '1.5rem'
          }}
        >
          📸
        </motion.div>
        
        <h1 style={{
          color: '#64ffda',
          fontSize: isMobile ? '2rem' : '2.5rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          textShadow: '0 0 15px rgba(100, 255, 218, 0.5)'
        }}>
          Photo Gallery
        </h1>
        
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            backgroundColor: 'rgba(100, 255, 218, 0.1)',
            borderRadius: '12px',
            padding: isMobile ? '1rem' : '1.5rem',
            marginBottom: '2rem',
            border: '1px solid rgba(100, 255, 218, 0.3)'
          }}
        >
          <h2 style={{
            color: '#64ffda',
            fontSize: isMobile ? '1.5rem' : '1.8rem',
            margin: '0 0 1rem 0'
          }}>
            Coming Soon! 🚀
          </h2>
          <p style={{
            color: '#e2e8f0',
            fontSize: isMobile ? '1rem' : '1.1rem',
            lineHeight: '1.6',
            margin: 0
          }}>
            We're working hard to bring you an amazing collection of photos from our AI Club events, activities, and memorable moments. Stay tuned for an exciting visual journey through our club's journey!
          </p>
        </motion.div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: isMobile ? '0.75rem' : '1rem',
          flexWrap: 'wrap',
          marginBottom: '2rem'
        }}>
          {[
            { emoji: '🎉', label: 'Events' },
            { emoji: '🤖', label: 'Projects' },
            { emoji: '👥', label: 'Team' }
          ].map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(36, 112, 161, 0.3)' }}
              style={{
                backgroundColor: 'rgba(36, 112, 161, 0.2)',
                borderRadius: '10px',
                padding: isMobile ? '0.75rem' : '1rem',
                minWidth: isMobile ? '100px' : '120px',
                flex: '1 1 auto',
                maxWidth: '150px',
                cursor: 'default'
              }}
            >
              <div style={{ fontSize: isMobile ? '1.5rem' : '2rem', marginBottom: '0.5rem' }}>{item.emoji}</div>
              <div style={{ color: '#e2e8f0', fontSize: isMobile ? '0.8rem' : '0.9rem' }}>{item.label}</div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{
            backgroundColor: 'rgba(255, 193, 7, 0.15)',
            border: '1px solid rgba(255, 193, 7, 0.4)',
            borderRadius: '10px',
            padding: isMobile ? '0.75rem' : '1rem',
            color: '#ffd54f'
          }}
        >
          <p style={{ margin: '0', fontSize: isMobile ? '0.85rem' : '1rem' }}>
            <strong>Expected Features:</strong> Event photos, project showcases, team moments, and behind-the-scenes content
          </p>
        </motion.div>
      </motion.div>
      
      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); }
          50% { box-shadow: 0 10px 40px rgba(100, 255, 218, 0.2); }
          100% { box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        /* Comprehensive responsive design */
        @media (max-width: 768px) {
          div[style*="minHeight: '100%'"] {
            padding: '1rem';
          }
        }
        
        /* Tablet responsive */
        @media (min-width: 769px) and (max-width: 1024px) {
          div[style*="borderRadius: isMobile"] {
            padding: '2.5rem';
          }
        }
        
        /* Small mobile screens */
        @media (max-width: 480px) {
          div[style*="padding: isMobile"] {
            padding: '1rem';
          }
        }
      `}</style>
    </div>
  );
};

export default PhotoGallery;