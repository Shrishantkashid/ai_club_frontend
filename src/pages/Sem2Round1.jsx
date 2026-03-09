import React, { useState, useEffect, useRef } from 'react'
import API from '../utils/api'

// Fallback API URL if environment variable is not loaded
const FALLBACK_API_URL = 'http://localhost:5000';

const Sem2Round1 = ({ onCompleteRound1 }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [cheatDetected, setCheatDetected] = useState(false)
  const [fullscreenActive, setFullscreenActive] = useState(false)
  const [warningCount, setWarningCount] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  // Track initial fullscreen status
  const initialFullscreenRef = useRef(false);

  // Clear selected answers on component mount to ensure clean state
  useEffect(() => {
    setSelectedAnswers({});
  }, []);

  // 25 C Programming MCQ Questions
  const cProgrammingQuestions = [
    {
      id: 1,
      question: "What is the output of:\nint x = 5;\nprintf(\"%d\", x++);",
      options: ["5", "6", "Error", "Undefined"],
      correct: 0
    },
    {
      id: 2,
      question: "Which keyword is used to declare a constant in C?",
      options: ["final", "const", "define", "constant"],
      correct: 1
    },
    {
      id: 3,
      question: "What is the size of int in C (typically)?",
      options: ["2 bytes", "4 bytes", "8 bytes", "Depends on compiler"],
      correct: 1
    },
    {
      id: 4,
      question: "Which operator is used to access the value at an address?",
      options: ["&", "*", "->", "."],
      correct: 1
    },
    {
      id: 5,
      question: "What does NULL represent?",
      options: ["0", "1", "-1", "None of these"],
      correct: 0
    },
    {
      id: 6,
      question: "Which function is used to allocate memory dynamically?",
      options: ["alloc()", "malloc()", "new()", "calloc()"],
      correct: 1
    },
    {
      id: 7,
      question: "What is the correct syntax to print in C?",
      options: ["print()", "echo()", "printf()", "cout"],
      correct: 2
    },
    {
      id: 8,
      question: "Which loop is guaranteed to execute at least once?",
      options: ["for", "while", "do-while", "None"],
      correct: 2
    },
    {
      id: 9,
      question: "What is the output of:\nint a = 10;\nprintf(\"%d\", ++a);",
      options: ["10", "11", "Error", "Undefined"],
      correct: 1
    },
    {
      id: 10,
      question: "Which header file is needed for mathematical functions?",
      options: ["stdio.h", "stdlib.h", "math.h", "string.h"],
      correct: 2
    },
    {
      id: 11,
      question: "What is the purpose of break statement?",
      options: ["Exit loop", "Continue loop", "Skip iteration", "None"],
      correct: 0
    },
    {
      id: 12,
      question: "Which is the correct format specifier for float?",
      options: ["%d", "%f", "%lf", "%ld"],
      correct: 1
    },
    {
      id: 13,
      question: "What does getchar() do?",
      options: ["Print character", "Read character", "Delete character", "None"],
      correct: 1
    },
    {
      id: 14,
      question: "Which symbol is used for single line comment?",
      options: ["/* */", "//", "#", "--"],
      correct: 1
    },
    {
      id: 15,
      question: "What is the output of:\nint x = 2;\nprintf(\"%d\", x << 1);",
      options: ["2", "4", "1", "0"],
      correct: 1
    },
    {
      id: 16,
      question: "Which function is used to free allocated memory?",
      options: ["delete", "remove()", "free()", "dealloc()"],
      correct: 2
    },
    {
      id: 17,
      question: "What is strlen(\"Hello\")?",
      options: ["4", "5", "6", "7"],
      correct: 1
    },
    {
      id: 18,
      question: "Which operator has highest precedence?",
      options: ["+", "*", "==", "&&"],
      correct: 1
    },
    {
      id: 19,
      question: "What is the return type of main() by default?",
      options: ["void", "int", "float", "char"],
      correct: 1
    },
    {
      id: 20,
      question: "How many bytes does a char occupy?",
      options: ["1", "2", "4", "8"],
      correct: 0
    },
    {
      id: 21,
      question: "What does sizeof() return?",
      options: ["Value", "Address", "Size in bytes", "None"],
      correct: 2
    },
    {
      id: 22,
      question: "Which is a valid variable name?",
      options: ["2var", "_var", "var-name", "int"],
      correct: 1
    },
    {
      id: 23,
      question: "What is the output of 5 % 2?",
      options: ["2", "1", "0", "2.5"],
      correct: 1
    },
    {
      id: 24,
      question: "Which statement is used to come out of a loop?",
      options: ["continue", "break", "return", "exit"],
      correct: 1
    },
    {
      id: 25,
      question: "What is the ASCII value of 'A'?",
      options: ["64", "65", "66", "97"],
      correct: 1
    }
  ]
  
  // Combine all questions
  const allQuestions = cProgrammingQuestions;
  
  // Shuffle array using Fisher-Yates algorithm
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  
  // Shuffle questions and options on component mount
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Shuffle question order
    const shuffled = shuffleArray(allQuestions);
    
    // Also shuffle options within each question
    const shuffledWithOptions = shuffled.map(question => {
      // Create array of option indices and shuffle them
      const optionIndices = [0, 1, 2, 3];
      const shuffledIndices = shuffleArray(optionIndices);
      
      // Reorder options based on shuffled indices
      const newOptions = shuffledIndices.map(index => question.options[index]);
      
      // Find where the correct answer moved to
      const originalCorrectIndex = question.correct;
      const newCorrectIndex = shuffledIndices.indexOf(originalCorrectIndex);
      
      // Create a unique ID for this question instance to prevent answer conflicts
      const uniqueId = `${question.id}-${Date.now()}-${Math.random()}`;
      
      return {
        ...question,
        id: uniqueId, // Use unique ID to prevent answer conflicts
        options: newOptions,
        correct: newCorrectIndex,
        originalId: question.id // Keep reference to original ID for tracking
      };
    });
    
    setShuffledQuestions(shuffledWithOptions);
    setIsLoading(false);
  }, []);
  
  // Monitor state consistency and fix issues
  useEffect(() => {
    // Validate current question index
    if (shuffledQuestions.length > 0 && (currentQuestion < 0 || currentQuestion >= shuffledQuestions.length)) {
      setCurrentQuestion(Math.max(0, Math.min(shuffledQuestions.length - 1, currentQuestion)));
    }
    
    // Validate selected answers match current questions
    const validQuestionIds = new Set(shuffledQuestions.map(q => q.id));
    const invalidAnswers = Object.keys(selectedAnswers).filter(id => !validQuestionIds.has(id));
    
    if (invalidAnswers.length > 0) {
      // Clean up invalid answers
      setSelectedAnswers(prev => {
        const cleaned = { ...prev };
        invalidAnswers.forEach(id => delete cleaned[id]);
        return cleaned;
      });
    }
  }, [currentQuestion, shuffledQuestions, selectedAnswers]);

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
        // Fullscreen API not supported - silently fail
        return false;
      }
      
      setFullscreenActive(true);
      initialFullscreenRef.current = true;
      return true;
    } catch (err) {
      initialFullscreenRef.current = true;
      return false;
    }
  };

  // Simple re-entry function that triggers on any mouse click
  const handleMouseClick = async () => {
    if (!document.fullscreenElement) {
      const success = await requestFullscreen();
      return success;
    }
  };

  // Enhanced fullscreen monitoring with simple re-entry on click
  useEffect(() => {
    let lastFullscreenState = null;
    let warningCooldown = false;
    const WARNING_COOLDOWN_TIME = 3000;
    
    // Enhanced fullscreen change listener
    const handleFullscreenChange = () => {
      // Update fullscreen status
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setFullscreenActive(isCurrentlyFullscreen);
      
      // Prevent rapid state changes
      if (lastFullscreenState === isCurrentlyFullscreen) {
        return;
      }
      
      lastFullscreenState = isCurrentlyFullscreen;
      
      // Handle fullscreen exit - cheating detection
      if (!isCurrentlyFullscreen && initialFullscreenRef.current) {
        // Check cooldown
        if (warningCooldown) {
          return;
        }
        
        // Set cooldown
        warningCooldown = true;
        setTimeout(() => {
          warningCooldown = false;
        }, WARNING_COOLDOWN_TIME);
        
        // Increment warning counter
        setWarningCount(prevCount => {
          const newCount = prevCount + 1;
          
          if (newCount <= 3) {
            // Show website notification instead of alert
            showWebsiteNotification(newCount);
            
            return newCount;
          } else {
            // 4th violation - auto-submit
            setCheatDetected(true);
            handleSubmit(true);
            return newCount;
          }
        });
      } else if (isCurrentlyFullscreen) {
        // User is in fullscreen mode
      }
    };
    
    // Website notification system
    const showWebsiteNotification = (warningNumber) => {
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
      const warningText = document.createTextNode(`⚠ CHEATING WARNING ${warningNumber}/3\n`);
      const br = document.createElement('br');
      const span = document.createElement('span');
      span.style.fontSize = '0.9em';
      span.style.fontWeight = 'normal';
      span.textContent = 'Fullscreen exit detected. Click anywhere to re-enter fullscreen mode.';
      
      notification.appendChild(warningText);
      notification.appendChild(br);
      notification.appendChild(span);
      
      // Add animation style
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

    // Visibility change listener (tab switching)
    const handleVisibilityChange = () => {
      if (document.hidden && !isTransitioning) {
        // Increment warning counter when switching tabs
        setWarningCount(prevCount => {
          const newCount = prevCount + 1;
          
          // Show warning to user about tab switching
          if (newCount < 3) {
            alert(`Warning: Tab switching detected. You have ${3 - newCount} warnings remaining before disqualification.`);
            // Return to the tab if possible
            window.focus();
            document.body.focus();
            return newCount;
          } else {
            // On 3rd warning, terminate the round
            setCheatDetected(true);
            handleSubmit(true); // Auto-submit on tab switch
            return newCount;
          }
        });
      }
    };

    // Prevent right-click and copy
    const preventCopy = (e) => {
      e.preventDefault();
      return false;
    };

    // Enhanced initial fullscreen entry with multiple strategies
    const enterFullscreen = async (attempt = 1) => {
      try {
        // Strategy 1: Direct request
        let success = await requestFullscreen();
        
        if (!success && attempt < 4) {
          // Strategy 2: After delay
          await new Promise(resolve => setTimeout(resolve, 300));
          success = await requestFullscreen();
        }
        
        if (!success && attempt < 4) {
          // Strategy 3: Focus + request
          window.focus();
          document.body.focus();
          await new Promise(resolve => setTimeout(resolve, 200));
          success = await requestFullscreen();
        }
        
        if (!success && attempt < 4) {
          // Strategy 4: Scroll reset + request
          window.scrollTo(0, 0);
          await new Promise(resolve => setTimeout(resolve, 150));
          success = await requestFullscreen();
        }
        
        if (!success && attempt < 4) {
          // Retry with longer delay
          setTimeout(() => enterFullscreen(attempt + 1), attempt * 1000);
        } else if (!success) {
          // Silently fail - no alert to avoid breaking fullscreen
        }
      } catch (err) {
        if (attempt < 4) {
          setTimeout(() => enterFullscreen(attempt + 1), attempt * 1000);
        }
      }
    };

    // Initialize fullscreen on component mount
    setTimeout(() => {
      enterFullscreen();
    }, 500);

    // Add event listeners
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('contextmenu', preventCopy);
    document.addEventListener('copy', preventCopy);
    document.addEventListener('cut', preventCopy);
    document.addEventListener('paste', preventCopy);
    
    // Add click listener for fullscreen re-entry
    document.addEventListener('click', handleMouseClick);

    // Cleanup
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('contextmenu', preventCopy);
      document.removeEventListener('copy', preventCopy);
      document.removeEventListener('cut', preventCopy);
      document.removeEventListener('paste', preventCopy);
      document.removeEventListener('click', handleMouseClick);
    };
  }, [isTransitioning]);

  // Handle answer selection
  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [shuffledQuestions[currentQuestion].id]: answerIndex
    }));
  };

  // Navigate to next question
  const handleNext = () => {
    if (currentQuestion < shuffledQuestions.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
        setIsTransitioning(false);
      }, 100);
    }
  };

  // Navigate to previous question
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuestion(prev => prev - 1);
        setIsTransitioning(false);
      }, 100);
    }
  };

  // Submit all answers
  const handleSubmit = async (isCheat = false) => {
    if (isCheat) {
      // Auto-submit due to cheating
      try {
        const token = localStorage.getItem('token');
        
        // Format answers to match backend expectations
        const formattedAnswers = {};
        Object.entries(selectedAnswers).forEach(([questionId, answerIndex]) => {
          const question = shuffledQuestions.find(q => q.id === questionId);
          const isCorrect = question && question.correct === answerIndex;
          
          formattedAnswers[questionId] = {
            selectedAnswer: answerIndex,
            isCorrect: isCorrect,
            timestamp: new Date().toISOString()
          };
        });
        
        // Use fallback URL for cheat submission too
        const submitUrl = API.SEM2_SUBMIT_ROUND1 || `${FALLBACK_API_URL}/api/contest/sem2/round1/submit`;
        
        await fetch(submitUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ 
            answers: formattedAnswers,
            isCheat: true
          })
        });
        
        // Mark as completed and move to next round
        onCompleteRound1();
      } catch (error) {
        // Silent error - no console log to avoid fullscreen exit
      }
      return;
    }

    // Normal submission
    try {
      const token = localStorage.getItem('token');
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      
      // Verify API endpoint is available
      const submitUrl = API.SEM2_SUBMIT_ROUND1 || `${FALLBACK_API_URL}/api/contest/sem2/round1/submit`;
      
      console.log('Submitting to:', submitUrl); // Debug log (temporary)
      
      // Format answers to match backend expectations
      const formattedAnswers = {};
      Object.entries(selectedAnswers).forEach(([questionId, answerIndex]) => {
        // Find the actual question to get correct answer
        const question = shuffledQuestions.find(q => q.id === questionId);
        const isCorrect = question && question.correct === answerIndex;
        
        formattedAnswers[questionId] = {
          selectedAnswer: answerIndex,
          isCorrect: isCorrect,
          timestamp: new Date().toISOString()
        };
      });
      
      const response = await fetch(submitUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          answers: formattedAnswers
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        onCompleteRound1();
      } else {
        alert(`Submission failed: ${data.message}`);
      }
    } catch (error) {
      // Silent error - no console log to avoid fullscreen exit
      alert('Network error. Please try again.');
    }
  };

  // Progress percentage
  const progress = ((currentQuestion + 1) / shuffledQuestions.length) * 100;
  const answeredCount = Object.keys(selectedAnswers).length;
  const isMobile = window.innerWidth <= 768;

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a192f'
      }}>
        <div style={{
          textAlign: 'center',
          color: '#64ffda'
        }}>
          <h2>Loading Round 1...</h2>
          <p>Please wait while we prepare your questions</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={handleMouseClick}
      style={{
        minHeight: '100vh',
        backgroundColor: '#0a192f',
        padding: isMobile ? '1rem' : '2rem',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'rgba(30, 58, 95, 0.6)',
        padding: isMobile ? '1.5rem' : '2rem',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(30, 58, 95, 0.3)',
        border: '1px solid rgba(100, 255, 218, 0.2)',
        backdropFilter: 'blur(4px)'
      }}>
        {/* Header */}
        <div style={{
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <h1 style={{
            color: '#64ffda',
            fontSize: isMobile ? '1.5rem' : '2rem',
            marginBottom: '0.5rem',
            textShadow: '0 0 8px rgba(100, 255, 218, 0.3)'
          }}>
            Round 1 - C Programming Quiz
          </h1>
          <p style={{
            color: '#94a3b8',
            fontSize: isMobile ? '0.9rem' : '1rem'
          }}>
            Question {currentQuestion + 1} of {shuffledQuestions.length}
          </p>
        </div>

        {/* Progress Bar */}
        <div style={{
          backgroundColor: 'rgba(10, 25, 47, 0.5)',
          borderRadius: '10px',
          height: '8px',
          marginBottom: '2rem',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            backgroundColor: '#4ade80',
            transition: 'width 0.3s ease'
          }} />
        </div>

        {/* Question Card */}
        <div style={{
          opacity: isTransitioning ? 0 : 1,
          transition: 'opacity 0.2s ease'
        }}>
          <div style={{
            backgroundColor: 'rgba(10, 25, 47, 0.6)',
            padding: isMobile ? '1rem' : '1.5rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            border: '1px solid rgba(100, 255, 218, 0.2)'
          }}>
            <h2 style={{
              color: '#e2e8f0',
              fontSize: isMobile ? '1.1rem' : '1.3rem',
              marginBottom: '1rem',
              lineHeight: '1.5'
            }}>
              {shuffledQuestions[currentQuestion]?.question}
            </h2>

            {/* Answer Options */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              {shuffledQuestions[currentQuestion]?.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={cheatDetected}
                  style={{
                    padding: isMobile ? '0.75rem' : '1rem',
                    backgroundColor: selectedAnswers[shuffledQuestions[currentQuestion]?.id] === index
                      ? '#4ade80'
                      : 'rgba(10, 25, 47, 0.5)',
                    color: selectedAnswers[shuffledQuestions[currentQuestion]?.id] === index
                      ? '#0a192f'
                      : '#e2e8f0',
                    border: selectedAnswers[shuffledQuestions[currentQuestion]?.id] === index
                      ? '2px solid #4ade80'
                      : '1px solid rgba(100, 255, 218, 0.2)',
                    borderRadius: '8px',
                    cursor: cheatDetected ? 'not-allowed' : 'pointer',
                    textAlign: 'left',
                    fontSize: isMobile ? '0.95rem' : '1.05rem',
                    transition: 'all 0.3s ease',
                    fontWeight: selectedAnswers[shuffledQuestions[currentQuestion]?.id] === index ? 'bold' : 'normal'
                  }}
                  onMouseEnter={(e) => {
                    if (!cheatDetected && selectedAnswers[shuffledQuestions[currentQuestion]?.id] !== index) {
                      e.target.style.backgroundColor = 'rgba(100, 255, 218, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!cheatDetected && selectedAnswers[shuffledQuestions[currentQuestion]?.id] !== index) {
                      e.target.style.backgroundColor = 'rgba(10, 25, 47, 0.5)';
                    }
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '1rem',
          marginTop: '2rem'
        }}>
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0 || cheatDetected}
            style={{
              padding: isMobile ? '0.75rem 1.5rem' : '1rem 2rem',
              backgroundColor: currentQuestion === 0 || cheatDetected ? '#374151' : '#4ade80',
              color: currentQuestion === 0 || cheatDetected ? '#9ca3af' : '#0a192f',
              border: 'none',
              borderRadius: '8px',
              cursor: currentQuestion === 0 || cheatDetected ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontSize: isMobile ? '0.9rem' : '1rem',
              transition: 'all 0.3s ease'
            }}
          >
            Previous
          </button>

          {currentQuestion === shuffledQuestions.length - 1 ? (
            <button
              onClick={() => handleSubmit(false)}
              disabled={cheatDetected}
              style={{
                padding: isMobile ? '0.75rem 1.5rem' : '1rem 2rem',
                backgroundColor: cheatDetected ? '#374151' : '#fbbf24',
                color: cheatDetected ? '#9ca3af' : '#0a192f',
                border: 'none',
                borderRadius: '8px',
                cursor: cheatDetected ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                fontSize: isMobile ? '0.9rem' : '1rem',
                transition: 'all 0.3s ease'
              }}
            >
              {answeredCount < shuffledQuestions.length 
                ? `Answer ${shuffledQuestions.length - answeredCount} More First`
                : 'Submit All'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={cheatDetected}
              style={{
                padding: isMobile ? '0.75rem 1.5rem' : '1rem 2rem',
                backgroundColor: cheatDetected ? '#374151' : '#4ade80',
                color: cheatDetected ? '#9ca3af' : '#0a192f',
                border: 'none',
                borderRadius: '8px',
                cursor: cheatDetected ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                fontSize: isMobile ? '0.9rem' : '1rem',
                transition: 'all 0.3s ease'
              }}
            >
              Next
            </button>
          )}
        </div>

        {/* Info Footer */}
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderRadius: '8px',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          textAlign: 'center'
        }}>
          <p style={{
            color: '#60a5fa',
            fontSize: isMobile ? '0.85rem' : '0.9rem',
            margin: 0
          }}>
            📝 Answered: {answeredCount} / {shuffledQuestions.length} questions
          </p>
          <p style={{
            color: '#94a3b8',
            fontSize: isMobile ? '0.8rem' : '0.85rem',
            margin: '0.5rem 0 0 0'
          }}>
            ⚠️ Do not switch tabs or exit fullscreen. You have {3 - warningCount} warnings remaining.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Sem2Round1
