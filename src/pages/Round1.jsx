import React, { useState, useEffect, useRef } from 'react'
import API from '../utils/api'

const Round1 = ({ onCompleteRound1 }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [cheatDetected, setCheatDetected] = useState(false)
  const [fullscreenActive, setFullscreenActive] = useState(false)
  const [warningCount, setWarningCount] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  // Track initial fullscreen status
  const initialFullscreenRef = useRef(false);

  // 15 MCQ questions about AI
  const mcqQuestions = [
    {
      id: 1,
      question: "What does 'AI' stand for?",
      options: ["Artificial Intelligence", "Automated Interface", "Advanced Integration", "Algorithmic Intelligence"],
      correct: 0
    },
    {
      id: 2,
      question: "Which of these is a type of machine learning?",
      options: ["Supervised Learning", "Manual Programming", "Static Analysis", "Rule-based Systems"],
      correct: 0
    },
    {
      id: 3,
      question: "What is the primary goal of neural networks?",
      options: ["To mimic human brain structure", "To process data sequentially", "To store large amounts of data", "To perform mathematical calculations"],
      correct: 0
    },
    {
      id: 4,
      question: "Which algorithm is commonly used for classification tasks?",
      options: ["Linear Regression", "K-Means Clustering", "Decision Trees", "Principal Component Analysis"],
      correct: 2
    },
    {
      id: 5,
      question: "What is 'overfitting' in machine learning?",
      options: ["When model performs well on training data but poorly on new data", "When model is too simple", "When data is insufficient", "When training takes too long"],
      correct: 0
    },
    {
      id: 6,
      question: "Which of these is a deep learning framework?",
      options: ["TensorFlow", "Excel", "MySQL", "Apache Spark"],
      correct: 0
    },
    {
      id: 7,
      question: "What is the purpose of activation functions in neural networks?",
      options: ["To introduce non-linearity", "To store weights", "To process input data", "To calculate accuracy"],
      correct: 0
    },
    {
      id: 8,
      question: "Which technique helps prevent overfitting?",
      options: ["Dropout", "Increasing learning rate", "Adding more layers", "Using larger datasets only"],
      correct: 0
    },
    {
      id: 9,
      question: "What is 'gradient descent' used for?",
      options: ["Optimizing model parameters", "Data preprocessing", "Feature selection", "Model evaluation"],
      correct: 0
    },
    {
      id: 10,
      question: "Which of these is an example of unsupervised learning?",
      options: ["Image classification", "Customer segmentation", "Spam detection", "Medical diagnosis"],
      correct: 1
    },
    {
      id: 11,
      question: "What is the main difference between AI and Machine Learning?",
      options: ["AI is broader concept, ML is subset of AI", "ML is broader than AI", "They are the same thing", "AI doesn't require data"],
      correct: 0
    },
    {
      id: 12,
      question: "Which neural network architecture is best suited for image recognition?",
      options: ["Recurrent Neural Networks", "Convolutional Neural Networks", "Feedforward Networks", "Autoencoders"],
      correct: 1
    },
    {
      id: 13,
      question: "What is 'reinforcement learning' primarily used for?",
      options: ["Pattern recognition", "Decision making in dynamic environments", "Data clustering", "Statistical analysis"],
      correct: 1
    },
    {
      id: 14,
      question: "Which of these is a natural language processing task?",
      options: ["Image filtering", "Sentiment analysis", "Data sorting", "Network optimization"],
      correct: 1
    },
    {
      id: 15,
      question: "What does 'NLP' stand for in AI context?",
      options: ["Neural Learning Process", "Natural Language Processing", "Network Layer Protocol", "Numerical Logic Programming"],
      correct: 1
    }
  ]

  // 5 Code debugging questions
  const debuggingQuestions = [
    {
      id: 16,
      question: "Identify the bug in this Python code:",
      code: `def calculate_average(numbers):
    total = 0
    for num in numbers:
        total += num
    return total / len(numbers)

# Test the function
result = calculate_average([1, 2, 3, 4, 5])
print(f"Average: {result}")`,
      options: [
        "No bug - code works correctly",
        "Division by zero error when list is empty",
        "Incorrect variable name 'num'",
        "Missing import statement"
      ],
      correct: 1,
      explanation: "The code will throw a ZeroDivisionError if an empty list is passed. It should check if the list is empty before division."
    },
    {
      id: 17,
      question: "What's wrong with this JavaScript code?",
      code: `function findMax(arr) {
    let max = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}

console.log(findMax([-5, -2, -10, -1]));`,
      options: [
        "No issues - works perfectly",
        "Returns 0 instead of -1 for negative numbers",
        "Infinite loop possible",
        "Syntax error in the function"
      ],
      correct: 1,
      explanation: "The function initializes max to 0, so it will return 0 for arrays with all negative numbers instead of the actual maximum."
    },
    {
      id: 18,
      question: "Debug this Python list comprehension:",
      code: `# Create a list of squares of even numbers
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
squares = [x**2 for x in numbers if x % 2 = 0]`,
      options: [
        "Correct syntax - no issues",
        "Should use '==' instead of '=' in condition",
        "Missing colon after 'if'",
        "Wrong variable name 'x'"
      ],
      correct: 1,
      explanation: "The condition uses assignment operator '=' instead of comparison operator '=='. It should be 'if x % 2 == 0'."
    },
    {
      id: 19,
      question: "What's the bug in this recursive function?",
      code: `function factorial(n) {
    if (n === 0) {
        return 1;
    }
    return n * factorial(n - 1);
}

console.log(factorial(5));`,
      options: [
        "No bug - handles all cases correctly",
        "Missing base case for negative numbers",
        "Will cause stack overflow for large numbers",
        "Both B and C"
      ],
      correct: 3,
      explanation: "The function doesn't handle negative inputs (will cause infinite recursion) and lacks protection against stack overflow for large numbers."
    },
    {
      id: 20,
      question: "Identify the issue in this API call:",
      code: `fetch('https://api.example.com/data')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log('Error:', error));`,
      options: [
        "No issues - proper error handling",
        "Missing CORS headers check",
        "Should check if response is ok before parsing JSON",
        "Incorrect URL format"
      ],
      correct: 2,
      explanation: "The code should check if response.ok is true before parsing JSON. Network errors or HTTP error statuses won't be caught by the catch block."
    }
  ]

  // Combine all questions
  const allQuestions = [...mcqQuestions, ...debuggingQuestions]
  
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
      initialFullscreenRef.current = true;
      console.log('Successfully entered fullscreen mode');
      return true;
    } catch (err) {
      console.warn('Fullscreen request failed:', err);
      initialFullscreenRef.current = true;
      console.log('Fullscreen not available, proceeding with exam');
      return false;
    }
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
        console.log("🚨 Fullscreen exit detected!");
        
        // Check cooldown
        if (warningCooldown) {
          console.log("⏰ Still in cooldown period");
          return;
        }
        
        // Set cooldown
        warningCooldown = true;
        setTimeout(() => {
          warningCooldown = false;
          console.log("✅ Cooldown period ended");
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
        console.log("✅ User entered fullscreen mode");
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
        console.log(`Initial fullscreen attempt ${attempt}`);
        
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
          console.warn('Failed to enter fullscreen after all attempts');
          alert('⚠️ Warning: Could not enter fullscreen mode.\n\nFor best exam experience, please manually press F11 or use browser fullscreen controls.');
        }
      } catch (err) {
        console.warn(`Initial fullscreen attempt ${attempt} failed:`, err);
        if (attempt < 4) {
          setTimeout(() => enterFullscreen(attempt + 1), attempt * 1000);
        }
      }
    };
    
    // Start initial fullscreen attempts
    const timer = setTimeout(() => {
      enterFullscreen(1);
    }, 300);

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('contextmenu', preventCopy);
    document.addEventListener('copy', preventCopy);
    document.addEventListener('cut', preventCopy);
    document.addEventListener('paste', preventCopy);
    document.addEventListener('click', handleMouseClick);  // Add click listener for re-entry

    // Store event listener functions for proper cleanup
    const handleSelectStart = (e) => {
      e.preventDefault();
      return false;
    };
    
    const handleKeyDown = (e) => {
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
      // Prevent Ctrl+X (cut)
      if (e.ctrlKey && (e.key === 'x' || e.key === 'X')) {
        e.preventDefault();
        return false;
      }
      // Prevent Ctrl+V (paste)
      if (e.ctrlKey && (e.key === 'v' || e.key === 'V')) {
        e.preventDefault();
        return false;
      }
      // Prevent Ctrl+Z (undo)
      if (e.ctrlKey && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        return false;
      }
      // Prevent Ctrl+Shift+Z (redo)
      if (e.ctrlKey && e.shiftKey && (e.key === 'z' || e.key === 'Z')) {
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
      // Prevent Ctrl+U (view source)
      if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        return false;
      }
    };
    
    // Add text selection prevention listeners
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      clearTimeout(timer); // Clear the initial fullscreen request timeout
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('contextmenu', preventCopy);
      document.removeEventListener('copy', preventCopy);
      document.removeEventListener('cut', preventCopy);
      document.removeEventListener('paste', preventCopy);
      document.removeEventListener('click', handleMouseClick);  // Remove click listener
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('keydown', handleKeyDown);
      
      // Don't exit fullscreen when transitioning to next round
      // Only exit if we're not in the process of transitioning
    };
  }, []);

  const handleAnswerSelect = (questionId, answerIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }))
  }

  const handleSubmit = (autoSubmit = false) => {
    let correctAnswers = 0
    allQuestions.forEach(question => {
      if (selectedAnswers[question.id] === question.correct) {
        correctAnswers++
      }
    })
    
    setIsSubmitted(true)
    
    // Send results to backend
    fetch(API.ROUND1_SUBMIT, {
      answers: selectedAnswers,
      totalQuestions: allQuestions.length,
      correctAnswers,
      autoSubmit: autoSubmit || cheatDetected,
      warningCount: warningCount
    }).then(response => response.json())
      .then(data => {
        if (data.success) {
          // Set transitioning flag to prevent fullscreen exit handler from firing during navigation
          setIsTransitioning(true);
          // If not cheated, proceed to next round after a short delay
          if (!cheatDetected) {
            setTimeout(() => {
              onCompleteRound1();
            }, 1500); // 1.5 second delay to show success message
          } else {
            // Go to next screen immediately if cheated
            setTimeout(() => {
              onCompleteRound1();
            }, 500); // Shorter delay when cheated to show warning quickly
          }
        }
      })
      .catch(err => {
        console.error('Submission error:', err);
        // Set transitioning flag to prevent fullscreen exit handler from firing during navigation
        setIsTransitioning(true);
        // Even on error, proceed to next round after delay if not cheated
        if (!cheatDetected) {
          setTimeout(() => {
            onCompleteRound1();
          }, 1500);
        } else {
          // If cheated and there was an error, still proceed
          setTimeout(() => {
            onCompleteRound1();
          }, 500);
        }
      });
  }

  const handleNext = () => {
    if (currentQuestion < allQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  if (isSubmitted) {
    return (
      <div style={{
        padding: '2rem',
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <div style={{
          backgroundColor: 'rgba(30, 58, 95, 0.6)',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(30, 58, 95, 0.3)',
          border: '1px solid rgba(100, 255, 218, 0.2)',
          backdropFilter: 'blur(4px)'
        }}>
          <h1 style={{ 
            color: '#64ffda', 
            marginBottom: '1rem',
            textShadow: '0 0 8px rgba(100, 255, 218, 0.3)'
          }}>
            {cheatDetected ? '⚠️ Contest Terminated' : 'Round 1 Complete!'}
          </h1>
          {cheatDetected ? (
            <div>
              <p style={{ color: '#f87171', fontSize: '1.2rem', marginBottom: '1rem' }}>
                Contest terminated due to suspicious activity.
              </p>
              <p style={{ color: '#e2e8f0', fontSize: '1rem', lineHeight: '1.6' }}>
                Possible reasons:<br />
                • Exited fullscreen mode<br />
                • Switched to another tab/application<br />
                • Used prohibited actions (right-click, copy/paste)<br />
                <br />
                <strong>Please contact the administrator if this was an error.</strong>
              </p>
            </div>
          ) : (
            <div>
              <p style={{ color: '#4ade80', fontSize: '1.2rem', marginBottom: '1rem' }}>
                Proceeding to Round 2...
              </p>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#64ffda'
              }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid #64ffda',
                  borderRightColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                <span>Loading next round...</span>
              </div>
              <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          )}
        </div>
      </div>
    )
  }

  const currentQ = allQuestions[currentQuestion]

  const isMobile = window.innerWidth <= 768

  return (
    <div style={{
      padding: isMobile ? '0.5rem' : '1rem',
      maxWidth: '1000px',
      margin: '0 auto'
    }}>
    {/* Security indicator */}
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: '1rem',
      padding: isMobile ? '0.5rem' : '0.5rem',
      backgroundColor: 'rgba(239, 68, 68, 0.2)',
      borderRadius: '8px',
      border: '1px solid rgba(239, 68, 68, 0.3)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: '#f87171',
        fontWeight: 'bold',
        fontSize: isMobile ? '0.8rem' : '1rem'
      }}>
        <span>🔒</span>
        <span>Secure Exam Mode Active</span>
        {!isMobile && (
          <span style={{ fontSize: '0.8rem', fontWeight: 'normal' }}>(Do not exit fullscreen or switch tabs)</span>
        )}
      </div>
    </div>
      <div style={{
        backgroundColor: 'rgba(30, 58, 95, 0.6)',
        padding: isMobile ? '1rem' : '1.5rem',
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
            Question {currentQuestion + 1} of {allQuestions.length}
          </div>
          {cheatDetected && (
            <div style={{
              backgroundColor: '#f87171',
              color: '#0a192f',
              padding: isMobile ? '0.25rem 0.5rem' : '0.5rem 1rem',
              borderRadius: '20px',
              fontWeight: 'bold',
              fontSize: isMobile ? '0.8rem' : '1rem'
            }}>
              ⚠️ Suspicious Activity Detected
            </div>
          )}
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
            width: `${((currentQuestion + 1) / allQuestions.length) * 100}%`,
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
          
          {/* Code snippet for debugging questions */}
          {currentQ.code && (
            <div style={{
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              padding: isMobile ? '0.5rem' : '1rem',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: isMobile ? '0.7rem' : '0.9rem',
              marginBottom: '1rem',
              border: '1px solid rgba(100, 255, 218, 0.2)',
              overflowX: 'auto'
            }}>
              <pre style={{ margin: 0, color: '#e2e8f0' }}>{currentQ.code}</pre>
            </div>
          )}
        </div>

        {/* Options */}
        <div style={{ marginBottom: '2rem' }}>
          {currentQ.options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleAnswerSelect(currentQ.id, index)}
              style={{
                backgroundColor: selectedAnswers[currentQ.id] === index 
                  ? 'rgba(100, 255, 218, 0.3)' 
                  : 'rgba(10, 25, 47, 0.5)',
                border: `2px solid ${selectedAnswers[currentQ.id] === index ? '#64ffda' : 'rgba(100, 255, 218, 0.2)'}`,
                padding: isMobile ? '0.75rem' : '1rem',
                borderRadius: '8px',
                marginBottom: '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                color: '#e2e8f0',
                fontSize: isMobile ? '0.9rem' : '1rem'
              }}
              onMouseEnter={(e) => {
                if (selectedAnswers[currentQ.id] !== index) {
                  e.target.style.backgroundColor = 'rgba(100, 255, 218, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedAnswers[currentQ.id] !== index) {
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
                  backgroundColor: selectedAnswers[currentQ.id] === index ? '#64ffda' : 'transparent',
                  color: selectedAnswers[currentQ.id] === index ? '#0a192f' : '#64ffda',
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
              onClick={handlePrevious}
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
            {currentQuestion < allQuestions.length - 1 ? (
              <button
                onClick={handleNext}
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
                onClick={() => handleSubmit(false)}
                disabled={Object.keys(selectedAnswers).length === 0}
                style={{
                  backgroundColor: Object.keys(selectedAnswers).length === 0 ? '#374151' : '#4ade80',
                  color: Object.keys(selectedAnswers).length === 0 ? '#9ca3af' : '#0a192f',
                  border: 'none',
                  padding: isMobile ? '0.5rem 1rem' : '0.75rem 2rem',
                  borderRadius: '30px',
                  cursor: Object.keys(selectedAnswers).length === 0 ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease',
                  opacity: Object.keys(selectedAnswers).length === 0 ? 0.5 : 1,
                  fontSize: isMobile ? '0.9rem' : '1rem'
                }}
              >
                Submit Round 1
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
          {allQuestions.map((_, index) => (
            <div
              key={index}
              onClick={() => setCurrentQuestion(index)}
              style={{
                width: isMobile ? '12px' : '20px',
                height: isMobile ? '12px' : '20px',
                borderRadius: '50%',
                backgroundColor: index === currentQuestion 
                  ? '#64ffda' 
                  : selectedAnswers[allQuestions[index].id] !== undefined
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
  )
}

export default Round1