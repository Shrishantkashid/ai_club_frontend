import React, { useState, useEffect } from 'react'

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '3rem',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease'
      }}>
        <h1 style={{
          fontSize: '3rem',
          color: '#64ffda',
          marginBottom: '1rem',
          textShadow: '0 0 10px rgba(100, 255, 218, 0.3)',
          animation: 'glow 2s ease-in-out infinite alternate'
        }}>
          Welcome to AI Club
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: '#cbd5e0',
          maxWidth: '800px',
          margin: '0 auto',
          textShadow: '0 0 10px rgba(203, 213, 224, 0.1)'
        }}>
          Exploring the future of Artificial Intelligence through learning, innovation, and collaboration
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        marginBottom: '3rem'
      }}>
        <div style={{
          backgroundColor: 'rgba(30, 58, 95, 0.6)',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 8px 32px rgba(30, 58, 95, 0.3)',
          textAlign: 'center',
          border: '1px solid rgba(100, 255, 218, 0.2)',
          backdropFilter: 'blur(4px)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transitionDelay: '0.1s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-10px)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(30, 58, 95, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(30, 58, 95, 0.3)';
        }}>
          <h2 style={{ color: '#64ffda', marginBottom: '1rem', textShadow: '0 0 6px rgba(100, 255, 218, 0.3)' }}>Mission</h2>
          <p style={{ color: '#e2e8f0' }}>To foster innovation in AI technologies and create a community of passionate learners and developers.</p>
        </div>

        <div style={{
          backgroundColor: 'rgba(30, 58, 95, 0.6)',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 8px 32px rgba(30, 58, 95, 0.3)',
          textAlign: 'center',
          border: '1px solid rgba(100, 255, 218, 0.2)',
          backdropFilter: 'blur(4px)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transitionDelay: '0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-10px)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(30, 58, 95, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(30, 58, 95, 0.3)';
        }}>
          <h2 style={{ color: '#64ffda', marginBottom: '1rem', textShadow: '0 0 6px rgba(100, 255, 218, 0.3)' }}>Vision</h2>
          <p style={{ color: '#e2e8f0' }}>To be a leading student organization in AI research and development, bridging academia and industry.</p>
        </div>

        <div style={{
          backgroundColor: 'rgba(30, 58, 95, 0.6)',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 8px 32px rgba(30, 58, 95, 0.3)',
          textAlign: 'center',
          border: '1px solid rgba(100, 255, 218, 0.2)',
          backdropFilter: 'blur(4px)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transitionDelay: '0.3s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-10px)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(30, 58, 95, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(30, 58, 95, 0.3)';
        }}>
          <h2 style={{ color: '#64ffda', marginBottom: '1rem', textShadow: '0 0 6px rgba(100, 255, 218, 0.3)' }}>Join Us</h2>
          <p style={{ color: '#e2e8f0' }}>Be part of our growing community and contribute to cutting-edge AI projects and research initiatives.</p>
        </div>
      </div>

      <div style={{
        backgroundColor: 'rgba(30, 58, 95, 0.6)',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 8px 32px rgba(30, 58, 95, 0.3)',
        border: '1px solid rgba(100, 255, 218, 0.2)',
        backdropFilter: 'blur(4px)',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transitionDelay: '0.4s'
      }}>
        <h2 style={{ 
          color: '#64ffda', 
          marginBottom: '1rem',
          textAlign: 'center',
          textShadow: '0 0 6px rgba(100, 255, 218, 0.3)',
          fontSize: '1.8rem'
        }}>
          About Our Club
        </h2>
        <p style={{ 
          lineHeight: '1.6',
          color: '#e2e8f0'
        }}>
          The AI Club is dedicated to exploring the vast possibilities of Artificial Intelligence. 
          We organize workshops, hackathons, guest lectures, and research projects to help students 
          understand and contribute to this rapidly evolving field. Our members work on diverse 
          projects ranging from machine learning algorithms to computer vision applications, 
          natural language processing, and robotics.
        </p>
      </div>
      
      <style>{`
        @keyframes glow {
          from {
            text-shadow: 0 0 5px rgba(100, 255, 218, 0.3), 0 0 10px rgba(100, 255, 218, 0.2);
          }
          to {
            text-shadow: 0 0 10px rgba(100, 255, 218, 0.4), 0 0 20px rgba(100, 255, 218, 0.3);
          }
        }
      `}</style>
    </div>
  )
}

export default Home