import React, { useState, useEffect, useRef } from 'react';

const TestQuiz = ({ onBackToActivities }) => {
  const [currentRound, setCurrentRound] = useState(1);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes for personal details test
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  // Personal details questions for testing
  const personalQuestions = {
    round1: [
      {
        id: 1,
        question: "What is your full name?",
        type: "text",
        placeholder: "Enter your full name",
        field: "name"  // Map to userData field
      },
      {
        id: 2,
        question: "What is your email address?",
        type: "email",
        placeholder: "Enter your email address",
        field: "email"
      }
    ],
    round2: [
      {
        id: 3,
        question: "What is your phone number?",
        type: "tel",
        placeholder: "Enter your phone number",
        field: "phone"
      },
      {
        id: 4,
        question: "Which college are you studying in?",
        type: "text",
        placeholder: "Enter your college name",
        field: "college"
      }
    ],
    round3: [
      {
        id: 5,
        question: "What is your current degree program?",
        type: "text",
        placeholder: "Enter your degree program",
        field: "degree"
      },
      {
        id: 6,
        question: "What is your expected graduation year?",
        type: "number",
        placeholder: "Enter graduation year",
        field: "graduationYear"
      }
    ]
  };

  // Fraud detection and fullscreen functionality
  useEffect(() => {
    // Request fullscreen when component mounts
    const requestFullscreen = async () => {
      try {
        if (containerRef.current) {
          await containerRef.current.requestFullscreen().catch(err => {
            console.log("Fullscreen not allowed:", err.message);
            // On mobile or browsers that don't support fullscreen, we'll just continue
          });
        }
      } catch (err) {
        console.log("Fullscreen API not supported:", err);
      }
    };

    // Delay fullscreen request to allow user interaction
    const timeoutId = setTimeout(requestFullscreen, 500);
    
    return () => clearTimeout(timeoutId);
  }, []);

  // Monitor fullscreen and fraud attempts
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') {
        alert('⚠️ Warning: Tab switching detected! This activity is monitored for security purposes.');
        // Optionally, you could end the test or record the incident
      }
    };

    const handleBlur = () => {
      setTimeout(() => {
        if (document.hidden || document.activeElement?.tagName === 'BODY') {
          alert('⚠️ Warning: Focus lost! Please stay focused on the test.');
        }
      }, 100);
    };

    const handleFullscreenChange = () => {
      const fullscreenElement = document.fullscreenElement;
      setIsFullscreen(!!fullscreenElement);
      
      if (!fullscreenElement) {
        // If user exits fullscreen, request it again
        setTimeout(async () => {
          try {
            if (containerRef.current && !showResults) {
              await containerRef.current.requestFullscreen();
              setIsFullscreen(true);
            }
          } catch (err) {
            console.log("Could not re-enter fullscreen:", err);
            alert('⚠️ Please return to fullscreen mode to continue the test.');
          }
        }, 500);
      }
    };

    // Check for right-click prevention
    const handleContextMenu = (e) => {
      e.preventDefault();
      alert('⚠️ Right-click is disabled during this test for security purposes.');
    };

    // Check for copy/paste shortcuts
    const handleKeyDown = (e) => {
      // Disable common shortcuts like Ctrl+A, Ctrl+C, Ctrl+V, etc.
      if ((e.ctrlKey || e.metaKey) && 
          (e.key === 'a' || e.key === 'c' || e.key === 'v' || e.key === 'u' || e.key === 's')) {
        e.preventDefault();
        alert(`⚠️ Shortcut ${e.key.toUpperCase()} is disabled during this test for security purposes.`);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    // Timer countdown
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      clearInterval(timer);
    };
  }, [showResults]);

  const handleInputChange = (questionId, value) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNextRound = () => {
    if (currentRound < 3) {
      setCurrentRound(prev => prev + 1);
    } else {
      handleSubmitTest();
    }
  };

  const handleSubmitTest = () => {
    // Calculate score based on completeness
    const answeredCount = Object.keys(selectedAnswers).filter(key => selectedAnswers[key]).length;
    const totalQuestions = Object.values(personalQuestions).flat().length;
    const calculatedScore = Math.round((answeredCount / totalQuestions) * 100);

    setScore(calculatedScore);
    setShowResults(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentQuestions = personalQuestions[`round${currentRound}`];

  if (showResults) {
    // Create a user data object from the selected answers mapped to their fields
    const userData = {};
    Object.values(personalQuestions).flat().forEach(question => {
      if (selectedAnswers[question.id]) {
        userData[question.field] = selectedAnswers[question.id];
      }
    });

    return (
      <div ref={containerRef} style={{
        padding: '2rem',
        maxWidth: '600px',
        margin: '0 auto',
        textAlign: 'center',
        color: '#e2e8f0',
        height: '100vh',
        backgroundColor: 'rgba(10, 25, 47, 0.9)'
      }}>
        <h2 style={{ color: '#64ffda', marginBottom: '1rem' }}>Personal Details Test Completed</h2>
        <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Completion Score: {score}%</p>
        <p style={{ marginBottom: '2rem' }}>Thank you for completing the personal details verification!</p>
        <div style={{ textAlign: 'left', marginBottom: '2rem', padding: '1rem', backgroundColor: 'rgba(30, 58, 95, 0.5)', borderRadius: '8px' }}>
          <h3 style={{ color: '#64ffda', marginBottom: '1rem' }}>Submitted Information:</h3>
          {userData.name && <p><strong>Name:</strong> {userData.name}</p>}
          {userData.email && <p><strong>Email:</strong> {userData.email}</p>}
          {userData.phone && <p><strong>Phone:</strong> {userData.phone}</p>}
          {userData.college && <p><strong>College:</strong> {userData.college}</p>}
          {userData.degree && <p><strong>Degree Program:</strong> {userData.degree}</p>}
          {userData.graduationYear && <p><strong>Graduation Year:</strong> {userData.graduationYear}</p>}
          {Object.keys(userData).length === 0 && <p><em>No information was entered.</em></p>}
        </div>
        <button
          onClick={onBackToActivities}
          style={{
            backgroundColor: '#64ffda',
            color: '#0a192f',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '30px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 0 20px rgba(100, 255, 218, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = 'none';
          }}
        >
          Back to Activities
        </button>
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{
      padding: '2rem',
      maxWidth: '800px',
      margin: '0 auto',
      color: '#e2e8f0',
      height: '100vh',
      backgroundColor: 'rgba(10, 25, 47, 0.9)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        padding: '1rem',
        backgroundColor: 'rgba(30, 58, 95, 0.6)',
        borderRadius: '8px'
      }}>
        <h2 style={{ color: '#64ffda', margin: 0 }}>Personal Details Verification - Round {currentRound}/3</h2>
        <div style={{ fontSize: '1.2rem', color: '#fbbf24' }}>Time: {formatTime(timeLeft)}</div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        {currentQuestions.map((q, index) => (
          <div key={q.id} style={{
            backgroundColor: 'rgba(30, 58, 95, 0.6)',
            padding: '1.5rem',
            marginBottom: '1rem',
            borderRadius: '8px'
          }}>
            <h3 style={{ color: '#e2e8f0', marginBottom: '1rem' }}>{index + 1}. {q.question}</h3>
            <input
              type={q.type}
              placeholder={q.placeholder}
              value={selectedAnswers[q.id] || ''}
              onChange={(e) => handleInputChange(q.id, e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '6px',
                border: '1px solid #4ade80',
                backgroundColor: 'rgba(10, 25, 47, 0.8)',
                color: '#e2e8f0',
                fontSize: '1rem'
              }}
            />
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center' }}>
        <button
          onClick={handleNextRound}
          style={{
            backgroundColor: '#64ffda',
            color: '#0a192f',
            border: 'none',
            padding: '0.75rem 2rem',
            borderRadius: '30px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 0 20px rgba(100, 255, 218, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = 'none';
          }}
        >
          {currentRound < 3 ? 'Next Section' : 'Submit Details'}
        </button>
      </div>
      
      <div style={{
        marginTop: '1rem',
        padding: '0.5rem',
        backgroundColor: isFullscreen ? 'rgba(74, 222, 128, 0.2)' : 'rgba(239, 68, 68, 0.2)',
        borderRadius: '6px',
        textAlign: 'center',
        fontSize: '0.9rem'
      }}>
        Status: {isFullscreen ? '🔒 Secure Mode Active' : '⚠️ Fullscreen Required'}
      </div>
    </div>
  );
};

export default TestQuiz;