import React, { useState } from 'react';

const TestQuizLogin = ({ onLoginSuccess, onBack }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidFormat = re.test(email);
    const isSaividyaDomain = email.toLowerCase().endsWith('@saividya.ac.in');
    return isValidFormat && isSaividyaDomain;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate login process - in a real app, you'd send this to your backend
      // For now, we'll just pass the email to the next step
      onLoginSuccess({
        email: email,
        // Add any other user data you want to track
      });
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const isMobile = window.innerWidth <= 768;

  return (
    <div style={{
      padding: isMobile ? '1rem' : '2rem',
      maxWidth: '500px',
      margin: '0 auto'
    }}>
      <div style={{
        backgroundColor: 'rgba(30, 58, 95, 0.6)',
        padding: isMobile ? '1.5rem' : '2rem',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(30, 58, 95, 0.3)',
        border: '1px solid rgba(100, 255, 218, 0.2)',
        backdropFilter: 'blur(4px)'
      }}>
        <h1 style={{ 
          color: '#64ffda', 
          marginBottom: '1.5rem',
          textAlign: 'center',
          textShadow: '0 0 8px rgba(100, 255, 218, 0.3)',
          fontSize: isMobile ? '1.5rem' : '2rem'
        }}>
          Test Quiz Registration
        </h1>
        
        <p style={{ 
          color: '#e2e8f0', 
          textAlign: 'center',
          marginBottom: '1.5rem',
          lineHeight: '1.5'
        }}>
          Please enter your Saividya Institute of Technology email (@saividya.ac.in) to begin the test quiz
        </p>

        {error && (
          <div style={{
            backgroundColor: '#dc2626',
            color: 'white',
            padding: '0.75rem',
            borderRadius: '6px',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="email" style={{
              display: 'block',
              color: '#64ffda',
              marginBottom: '0.5rem',
              fontWeight: 'bold'
            }}>
              College Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.name@college.edu"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '6px',
                border: '2px solid rgba(100, 255, 218, 0.3)',
                backgroundColor: 'rgba(10, 25, 47, 0.8)',
                color: '#e2e8f0',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <button
              type="button"
              onClick={onBack}
              style={{
                backgroundColor: '#6b7280',
                color: '#0a192f',
                border: 'none',
                padding: isMobile ? '0.5rem 1rem' : '0.75rem 1.5rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.2s ease',
                fontSize: isMobile ? '0.9rem' : '1rem'
              }}
            >
              Back
            </button>
            
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: loading ? '#6b7280' : '#4ade80',
                color: '#0a192f',
                border: 'none',
                padding: isMobile ? '0.5rem 1rem' : '0.75rem 1.5rem',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.2s ease',
                fontSize: isMobile ? '0.9rem' : '1rem'
              }}
            >
              {loading ? 'Processing...' : 'Start Test Quiz'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TestQuizLogin;