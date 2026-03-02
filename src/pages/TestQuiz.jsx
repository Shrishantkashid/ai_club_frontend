import React, { useState, useEffect } from 'react';

const TestQuiz = ({ onBackToActivities, currentUser, setContestState }) => {
  const [fullscreenActive, setFullscreenActive] = useState(true);
  const [warningCount, setWarningCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Enable fullscreen mode when component mounts
  useEffect(() => {
    // Enhanced requestFullscreen function with better browser compatibility
    const requestFullscreen = async () => {
      try {
        const element = document.documentElement;
        
        // Try multiple fullscreen methods for better browser compatibility
        if (element.requestFullscreen) {
          await element.requestFullscreen();
        } else if (element.mozRequestFullScreen) { // Firefox
          await element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) { // Chrome, Safari
          await element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) { // IE/Edge
          await element.msRequestFullscreen();
        } else {
          console.warn('Fullscreen API not supported');
          return false;
        }
        
        setFullscreenActive(true);
        return true;
      } catch (err) {
        console.warn('Fullscreen request failed:', err);
        return false;
      }
    };
    
    // Enhanced fullscreen change listener
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setFullscreenActive(isCurrentlyFullscreen);
      
      // Handle fullscreen exit - show warning and try to re-enter
      if (!isCurrentlyFullscreen) {
        console.log("🚨 Fullscreen exit detected!");
        
        // Increment warning counter
        setWarningCount(prevCount => {
          const newCount = prevCount + 1;
          
          // Show website notification instead of alert
          showWebsiteNotification(newCount);
          
          return newCount;
        });
      } else {
        console.log("✅ User entered fullscreen mode");
      }
    };
    
    // Website notification system
    const showWebsiteNotification = (warningNumber) => {
      // Remove any existing notifications
      const existingNotification = document.getElementById('cheat-warning-notification');
      if (existingNotification) {
        existingNotification.remove();
      }
      
      const notification = document.createElement('div');
      notification.id = 'cheat-warning-notification';
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ef4444;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        z-index: 10000;
        font-family: Arial, sans-serif;
        font-weight: bold;
        animation: slideIn 0.3s ease-out;
        max-width: 350px;
      `;
      
      // Safely create and append content
      const warningText = document.createTextNode(`⚠ FULLSCREEN EXIT DETECTED - Warning ${warningNumber}`);
      
      notification.appendChild(warningText);
      
      // Add animation style if not present
      if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }
      
      document.body.appendChild(notification);
      
      // Auto-remove after 5 seconds
      setTimeout(() => {
        if (notification.parentNode) {
          notification.style.animation = 'slideOut 0.3s ease-out';
          setTimeout(() => {
            if (notification.parentNode) {
              notification.parentNode.removeChild(notification);
            }
          }, 300);
        }
      }, 5000);
    };
    
    // Simple re-entry function that triggers on any mouse click
    const handleMouseClick = async () => {
      if (!document.fullscreenElement) {
        console.log("🖱️ Mouse click detected, attempting to re-enter fullscreen");
        const success = await requestFullscreen();
        if (success) {
          console.log("✅ Re-entered fullscreen via mouse click");
        } else {
          console.log("❌ Failed to re-enter fullscreen via mouse click");
        }
      }
    };
    
    // Request fullscreen after a brief delay to ensure component is rendered
    const enterFullscreen = async () => {
      let success = await requestFullscreen();
      
      if (!success) {
        // Retry after a short delay
        await new Promise(resolve => setTimeout(resolve, 300));
        success = await requestFullscreen();
      }
    };
    
    const timer = setTimeout(() => {
      enterFullscreen();
    }, 300);
    
    // Add event listeners
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('click', handleMouseClick);
    
    return () => {
      clearTimeout(timer);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('click', handleMouseClick);
    };
  }, []);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // 10 new difficult machine learning MCQ questions
  const mlQuestions = [
    {
      id: 1,
      question: "In gradient descent, what happens if the learning rate is too high?",
      options: [
        "Convergence to global optimum is guaranteed",
        "Oscillation around the minimum or divergence",
        "Training becomes faster with better accuracy",
        "The model will converge to a local minimum"
      ],
      correctAnswer: 1
    },
    {
      id: 2,
      question: "What is the main advantage of using Adam optimizer over traditional SGD?",
      options: [
        "Lower computational complexity",
        "Adaptive learning rates for each parameter",
        "Guaranteed convergence to global minimum",
        "Less memory requirements"
      ],
      correctAnswer: 1
    },
    {
      id: 3,
      question: "Which of the following is true about the bias-variance tradeoff?",
      options: [
        "High bias leads to overfitting",
        "High variance leads to overfitting",
        "High bias leads to underfitting and high variance leads to overfitting",
        "Bias and variance are unrelated to model performance"
      ],
      correctAnswer: 2
    },
    {
      id: 4,
      question: "What is the vanishing gradient problem in neural networks?",
      options: [
        "Gradients become too large causing instability",
        "Gradients become too small preventing learning in early layers",
        "Gradients oscillate between positive and negative values",
        "Gradients cause the loss function to plateau"
      ],
      correctAnswer: 1
    },
    {
      id: 5,
      question: "In a Support Vector Machine (SVM), what are support vectors?",
      options: [
        "All training examples",
        "Parameters that define the kernel function",
        "Training examples closest to the decision boundary",
        "Weights assigned to different features"
      ],
      correctAnswer: 2
    },
    {
      id: 6,
      question: "What is the primary purpose of dropout in neural networks?",
      options: [
        "To speed up training",
        "To reduce overfitting by randomly setting some neurons to zero",
        "To initialize weights more effectively",
        "To normalize the input data"
      ],
      correctAnswer: 1
    },
    {
      id: 7,
      question: "Which kernel in SVM would be most appropriate for a non-linear decision boundary?",
      options: [
        "Linear kernel",
        "Polynomial or RBF kernel",
        "Sigmoid kernel only",
        "None of the above"
      ],
      correctAnswer: 1
    },
    {
      id: 8,
      question: "What is the difference between bagging and boosting?",
      options: [
        "Bagging combines weak learners, boosting combines strong learners",
        "Bagging builds models sequentially, boosting builds models in parallel",
        "Bagging builds models in parallel, boosting builds models sequentially",
        "There is no significant difference between them"
      ],
      correctAnswer: 2
    },
    {
      id: 9,
      question: "In K-means clustering, what does the 'K' represent?",
      options: [
        "Number of iterations",
        "Number of features in the dataset",
        "Number of clusters to form",
        "Maximum distance threshold"
      ],
      correctAnswer: 2
    },
    {
      id: 10,
      question: "Which of the following is NOT an assumption of Naive Bayes classifier?",
      options: [
        "Features are conditionally independent given the class",
        "All features contribute equally to the classification",
        "The distribution of features is Gaussian",
        "The algorithm works well with irrelevant features"
      ],
      correctAnswer: 2
    }
  ];

  const handleAnswerSelect = (optionIndex) => {
    const newAnswers = { ...answers, [currentQuestion]: optionIndex };
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < mlQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let calculatedScore = 0;
    mlQuestions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        calculatedScore++;
      }
    });
    setScore(calculatedScore);
    
    // Submit the results to the backend
    submitTestResults(calculatedScore);
  };
  
  const submitTestResults = async (calculatedScore) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/test-quiz/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: currentUser.email,
          score: calculatedScore,
          totalQuestions: mlQuestions.length,
          answers: answers,
          warningCount: warningCount,
          timestamp: new Date().toISOString()
        }),
      });
      
      if (response.ok) {
        setScore(calculatedScore);
        setShowResults(true);
      } else {
        console.error('Failed to submit test results');
        // Still show results even if submission failed
        setScore(calculatedScore);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Error submitting test results:', error);
      // Still show results even if submission failed
      setScore(calculatedScore);
      setShowResults(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setScore(0);
    setShowResults(false);
  };

  const isMobile = window.innerWidth <= 768;

  if (showResults) {
    return (
      <div style={{
        padding: isMobile ? '1rem' : '2rem',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <div style={{
          backgroundColor: 'rgba(30, 58, 95, 0.6)',
          padding: isMobile ? '1rem' : '2rem',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(30, 58, 95, 0.3)',
          border: '1px solid rgba(100, 255, 218, 0.2)',
          backdropFilter: 'blur(4px)'
        }}>
          <h1 style={{ 
            color: '#64ffda', 
            marginBottom: '1rem',
            textAlign: 'center',
            textShadow: '0 0 8px rgba(100, 255, 218, 0.3)'
          }}>
            Quiz Results
          </h1>
          
          <div style={{
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            <p style={{ 
              color: '#e2e8f0', 
              fontSize: isMobile ? '1.2rem' : '1.5rem',
              marginBottom: '0.5rem'
            }}>
              Your Score: <span style={{ color: '#4ade80', fontWeight: 'bold' }}>{score}</span> / {mlQuestions.length}
            </p>
            <p style={{ 
              color: score >= mlQuestions.length / 2 ? '#4ade80' : '#f87171',
              fontSize: isMobile ? '1rem' : '1.1rem'
            }}>
              {score >= mlQuestions.length / 2 ? 'Excellent! You have a strong understanding of machine learning concepts.' : 'Keep learning! Review machine learning concepts to strengthen your knowledge.'}
            </p>
            <p style={{ 
              color: '#e2e8f0', 
              fontSize: isMobile ? '0.9rem' : '1rem',
              marginTop: '1rem'
            }}>
              Fullscreen exit attempts: <span style={{ color: warningCount > 0 ? '#f87171' : '#4ade80', fontWeight: 'bold' }}>{warningCount}</span>
            </p>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={resetQuiz}
              style={{
                backgroundColor: '#64ffda',
                color: '#0a192f',
                border: 'none',
                padding: isMobile ? '0.75rem 1.5rem' : '0.75rem 1.5rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.2s ease',
                fontSize: isMobile ? '0.9rem' : '1rem'
              }}
            >
              Retake Quiz
            </button>
            
            <button
              onClick={() => {
                // Navigate to test quiz leaderboard
                window.location.hash = '#/test-quiz-leaderboard';
                setContestState('test-quiz-leaderboard');
              }}
              style={{
                backgroundColor: '#64ffda',
                color: '#0a192f',
                border: 'none',
                padding: isMobile ? '0.75rem 1.5rem' : '0.75rem 1.5rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.2s ease',
                fontSize: isMobile ? '0.9rem' : '1rem'
              }}
            >
              View Leaderboard
            </button>
            
            <button
              onClick={onBackToActivities}
              style={{
                backgroundColor: '#4ade80',
                color: '#0a192f',
                border: 'none',
                padding: isMobile ? '0.75rem 1.5rem' : '0.75rem 1.5rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.2s ease',
                fontSize: isMobile ? '0.9rem' : '1rem'
              }}
            >
              Back to Activities
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = mlQuestions[currentQuestion];

  return (
    <div style={{
      padding: isMobile ? '1rem' : '2rem',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      {/* Security indicator */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '1rem',
        padding: isMobile ? '0.5rem' : '0.5rem',
        backgroundColor: fullscreenActive ? 'rgba(74, 222, 128, 0.2)' : 'rgba(239, 68, 68, 0.2)',
        borderRadius: '8px',
        border: '1px solid ' + (fullscreenActive ? 'rgba(74, 222, 128, 0.3)' : 'rgba(239, 68, 68, 0.3)')
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: fullscreenActive ? '#4ade80' : '#f87171',
          fontWeight: 'bold',
          fontSize: isMobile ? '0.8rem' : '1rem'
        }}>
          <span>{fullscreenActive ? '🔒' : '⚠️'}</span>
          <span>{fullscreenActive ? 'Fullscreen Mode Active' : 'Fullscreen Mode Inactive'}</span>
          {!isMobile && (
            <span style={{ fontSize: '0.8rem', fontWeight: 'normal' }}>({warningCount} exit attempts)</span>
          )}
        </div>
      </div>
      
      <div style={{
        backgroundColor: 'rgba(30, 58, 95, 0.6)',
        padding: isMobile ? '1rem' : '2rem',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(30, 58, 95, 0.3)',
        border: '1px solid rgba(100, 255, 218, 0.2)',
        backdropFilter: 'blur(4px)'
      }}>
        {/* Header with progress */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ 
            color: '#64ffda', 
            fontWeight: 'bold',
            fontSize: isMobile ? '0.9rem' : '1rem'
          }}>
            Question {currentQuestion + 1} of {mlQuestions.length}
          </div>
        </div>

        {/* Progress bar */}
        <div style={{
          backgroundColor: 'rgba(100, 255, 218, 0.1)',
          height: isMobile ? '6px' : '8px',
          borderRadius: '4px',
          marginBottom: '1.5rem',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${((currentQuestion + 1) / mlQuestions.length) * 100}%`,
            backgroundColor: '#64ffda',
            height: '100%',
            transition: 'width 0.3s ease'
          }}></div>
        </div>

        {/* Question */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ 
            color: '#64ffda', 
            marginBottom: '1rem',
            fontSize: isMobile ? '1.1rem' : '1.3rem'
          }}>
            {currentQ.question}
          </h2>
        </div>

        {/* Options */}
        <div style={{ marginBottom: '2rem' }}>
          {currentQ.options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleAnswerSelect(index)}
              style={{
                backgroundColor: answers[currentQuestion] === index 
                  ? 'rgba(100, 255, 218, 0.3)' 
                  : 'rgba(10, 25, 47, 0.5)',
                border: `2px solid ${answers[currentQuestion] === index ? '#64ffda' : 'rgba(100, 255, 218, 0.2)'}`,
                padding: isMobile ? '0.75rem' : '1rem',
                borderRadius: '8px',
                marginBottom: '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                color: '#e2e8f0',
                fontSize: isMobile ? '0.9rem' : '1rem'
              }}
              onMouseEnter={(e) => {
                if (answers[currentQuestion] !== index) {
                  e.target.style.backgroundColor = 'rgba(100, 255, 218, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (answers[currentQuestion] !== index) {
                  e.target.style.backgroundColor = 'rgba(10, 25, 47, 0.5)';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: isMobile ? '20px' : '24px',
                  height: isMobile ? '20px' : '24px',
                  borderRadius: '50%',
                  border: '2px solid #64ffda',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '1rem',
                  backgroundColor: answers[currentQuestion] === index ? '#64ffda' : 'transparent',
                  color: answers[currentQuestion] === index ? '#0a192f' : '#64ffda',
                  fontWeight: 'bold',
                  fontSize: isMobile ? '0.7rem' : '0.8rem'
                }}>
                  {String.fromCharCode(65 + index)}
                </div>
                <span>{option}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
              style={{
                backgroundColor: currentQuestion === 0 ? '#374151' : '#64ffda',
                color: currentQuestion === 0 ? '#9ca3af' : '#0a192f',
                border: 'none',
                padding: isMobile ? '0.5rem 1rem' : '0.75rem 1.5rem',
                borderRadius: '6px',
                cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                marginRight: '0.5rem',
                transition: 'all 0.2s ease',
                opacity: currentQuestion === 0 ? 0.5 : 1,
                fontSize: isMobile ? '0.9rem' : '1rem'
              }}
            >
              ← Previous
            </button>
            {currentQuestion < mlQuestions.length - 1 ? (
              <button
                onClick={handleNextQuestion}
                style={{
                  backgroundColor: '#64ffda',
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
                Next →
              </button>
            ) : (
              <button
                onClick={calculateScore}
                disabled={Object.keys(answers).length === 0 || isSubmitting}
                style={{
                  backgroundColor: Object.keys(answers).length === 0 || isSubmitting ? '#374151' : '#4ade80',
                  color: Object.keys(answers).length === 0 || isSubmitting ? '#9ca3af' : '#0a192f',
                  border: 'none',
                  padding: isMobile ? '0.5rem 1rem' : '0.75rem 2rem',
                  borderRadius: '30px',
                  cursor: Object.keys(answers).length === 0 || isSubmitting ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease',
                  opacity: Object.keys(answers).length === 0 || isSubmitting ? 0.5 : 1,
                  fontSize: isMobile ? '0.9rem' : '1rem'
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            )}
          </div>
        </div>

        {/* Question navigation dots */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '1.5rem',
          flexWrap: 'wrap',
          gap: isMobile ? '0.25rem' : '0.5rem'
        }}>
          {mlQuestions.map((_, index) => (
            <div
              key={index}
              onClick={() => setCurrentQuestion(index)}
              style={{
                width: isMobile ? '12px' : '20px',
                height: isMobile ? '12px' : '20px',
                borderRadius: '50%',
                backgroundColor: index === currentQuestion 
                  ? '#64ffda' 
                  : answers[index] !== undefined
                  ? 'rgba(100, 255, 218, 0.5)'
                  : 'rgba(100, 255, 218, 0.1)',
                cursor: 'pointer',
                border: '2px solid rgba(100, 255, 218, 0.3)',
                transition: 'all 0.2s ease'
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestQuiz;