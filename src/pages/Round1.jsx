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

  // Clear selected answers on component mount to ensure clean state
  useEffect(() => {
    setSelectedAnswers({});
  }, []);

  // 10 AI-based Riddles (MCQ format)
  const aiRiddles = [
    {
      id: 1,
      question: "I learn from data but never go to school. I can recognize faces but have no eyes. What am I?",
      options: ["A Neural Network", "A Database", "A Calculator", "A Web Browser"],
      correct: 0
    },
    {
      id: 2,
      question: "I get smarter the more you train me, but I make mistakes if you feed me garbage. What am I?",
      options: ["A Machine Learning Model", "A Human Student", "A Robot", "A Search Engine"],
      correct: 0
    },
    {
      id: 3,
      question: "I have layers like an onion, but I'm not a vegetable. I process information forward and backward. What am I?",
      options: ["A Deep Neural Network", "A Filing Cabinet", "A Library", "A Spreadsheet"],
      correct: 0
    },
    {
      id: 4,
      question: "I can translate languages but don't speak any. I understand context but have no brain. What am I?",
      options: ["NLP System", "A Dictionary", "A Translator App", "A Voice Recorder"],
      correct: 0
    },
    {
      id: 5,
      question: "I play games millions of times to master one move. I never get tired but can be beaten by strategy. What am I?",
      options: ["Reinforcement Learning Agent", "A Chess Grandmaster", "A Game Console", "A Simulation Program"],
      correct: 0
    },
    {
      id: 6,
      question: "I see patterns in chaos but have no vision. I predict futures but have no crystal ball. What am I?",
      options: ["Predictive Analytics AI", "A Fortune Teller", "A Weather Station", "A Camera"],
      correct: 0
    },
    {
      id: 7,
      question: "I can drive cars but have no license. I navigate roads but have no feet. What am I?",
      options: ["Autonomous Vehicle AI", "A GPS System", "A Remote Control Car", "A Traffic Light"],
      correct: 0
    },
    {
      id: 8,
      question: "I recommend what you'll love but don't have feelings. I know your taste but we've never met. What am I?",
      options: ["Recommendation System", "A Matchmaker", "A Shopping Cart", "A Review Website"],
      correct: 0
    },
    {
      id: 9,
      question: "I detect fraud but carry no badge. I spot anomalies but have no intuition. What am I?",
      options: ["Anomaly Detection AI", "A Security Guard", "A Police Officer", "A Metal Detector"],
      correct: 0
    },
    {
      id: 10,
      question: "I compose music but hear no sound. I paint pictures but see no colors. What am I?",
      options: ["Generative AI", "A Music Player", "An Art Gallery", "A Recording Studio"],
      correct: 0
    }
  ]

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

  // Combine all questions (10 AI Riddles + 15 MCQ = 25 total)
  const allQuestions = [...aiRiddles, ...mcqQuestions]
  
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
    
    console.log('Shuffled questions:', shuffledWithOptions.length, 'Question IDs:', shuffledWithOptions.map(q => q.id));
    
    setShuffledQuestions(shuffledWithOptions);
    setIsLoading(false);
  }, []);
  
  // Monitor state consistency and fix issues
  useEffect(() => {
    // Validate current question index
    if (shuffledQuestions.length > 0 && (currentQuestion < 0 || currentQuestion >= shuffledQuestions.length)) {
      console.warn('Invalid currentQuestion index detected:', currentQuestion, 'Total questions:', shuffledQuestions.length);
      setCurrentQuestion(Math.max(0, Math.min(shuffledQuestions.length - 1, currentQuestion)));
    }
    
    // Validate selected answers match current questions
    const validQuestionIds = new Set(shuffledQuestions.map(q => q.id));
    const invalidAnswers = Object.keys(selectedAnswers).filter(id => !validQuestionIds.has(id));
    
    if (invalidAnswers.length > 0) {
      console.warn('Found answers for non-existent questions:', invalidAnswers);
      // Clean up invalid answers
      setSelectedAnswers(prev => {
        const cleaned = { ...prev };
        invalidAnswers.forEach(id => delete cleaned[id]);
        return cleaned;
      });
    }
    
    // Debug logging - only in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Current state:', {
        currentQuestion,
        totalQuestions: shuffledQuestions.length,
        selectedAnswers: Object.keys(selectedAnswers),
        currentQuestionId: shuffledQuestions[currentQuestion]?.id
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
    // Validate inputs
    if (questionId === undefined || answerIndex === undefined) {
      console.warn('Invalid answer selection parameters:', { questionId, answerIndex });
      return;
    }
    
    // Validate answer index
    if (answerIndex < 0 || answerIndex > 3) {
      console.warn('Invalid answer index:', answerIndex);
      return;
    }
    
    // Validate that this question exists
    const question = shuffledQuestions.find(q => q.id === questionId);
    if (!question) {
      console.warn('Question not found for ID:', questionId);
      return;
    }
    
    setSelectedAnswers(prev => {
      // Create new object to avoid direct mutation
      const newAnswers = { ...prev };
      newAnswers[questionId] = answerIndex;
      return newAnswers;
    });
    
    // Debug logging - only in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Answer selected:', { questionId, answerIndex, questionText: question.question });
    }
  }

  const handleSubmit = (autoSubmit = false) => {
    // Calculate statistics for submitted answers
    const totalAnswered = Object.keys(selectedAnswers).length
    const totalQuestions = shuffledQuestions.length
    
    console.log('Submit check:', { 
      totalAnswered, 
      totalQuestions,
      selectedAnswersKeys: Object.keys(selectedAnswers),
      allQuestionIds: shuffledQuestions.map(q => q.id)
    });
    
    // Handle case where no answers are selected
    if (totalAnswered === 0 && !autoSubmit) {
      const confirmSubmit = window.confirm(
        '⚠️ You haven\'t answered any questions.\n\n' +
        'Are you sure you want to submit with 0 answers?\n' +
        'This will result in a score of 0.'
      );
      
      if (!confirmSubmit) {
        return; // User cancelled submission
      }
    }
    
    // Count correct answers from submitted responses only
    let correctAnswers = 0
    Object.keys(selectedAnswers).forEach(questionId => {
      const question = shuffledQuestions.find(q => q.id === Number(questionId));
      if (question && selectedAnswers[questionId] === question.correct) {
        correctAnswers++;
      }
    });
    
    // Calculate accuracy based on answered questions
    const accuracy = totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0;
    
    setIsSubmitted(true)
    
    // Send results to backend
    const token = localStorage.getItem('token')
    fetch(API.ROUND1_SUBMIT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        answers: selectedAnswers,
        totalQuestions: totalQuestions,
        answeredQuestions: totalAnswered,
        correctAnswers,
        accuracy: accuracy,
        autoSubmit: autoSubmit || cheatDetected,
        warningCount: warningCount
      })
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
        } else {
          console.error('Submission failed:', data.message);
          // Handle submission failure
          alert(`Submission failed: ${data.message || 'Unknown error'}`);
          setIsSubmitted(false); // Allow retry
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
    if (currentQuestion < shuffledQuestions.length - 1) {
      setCurrentQuestion(prev => {
        const nextIndex = prev + 1;
        // Safety check
        if (nextIndex >= shuffledQuestions.length) {
          console.warn('Attempted to navigate beyond question array bounds');
          return prev;
        }
        return nextIndex;
      });
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => {
        const prevIndex = prev - 1;
        // Safety check
        if (prevIndex < 0) {
          console.warn('Attempted to navigate before question array bounds');
          return prev;
        }
        return prevIndex;
      });
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

  // Show loading state while questions are being shuffled
  if (isLoading || shuffledQuestions.length === 0) {
    return (
      <div style={{
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <div style={{
          backgroundColor: 'rgba(30, 58, 95, 0.6)',
          padding: '3rem',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(30, 58, 95, 0.3)',
          border: '1px solid rgba(100, 255, 218, 0.2)',
          backdropFilter: 'blur(4px)'
        }}>
          <h1 style={{ 
            color: '#64ffda', 
            marginBottom: '2rem',
            textShadow: '0 0 8px rgba(100, 255, 218, 0.3)'
          }}>
            Loading Questions...
          </h1>
          <div style={{
            width: '50px',
            height: '50px',
            border: '5px solid rgba(100, 255, 218, 0.3)',
            borderTop: '5px solid #64ffda',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }} />
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    )
  }

  // Safety check for current question index
  if (currentQuestion >= shuffledQuestions.length || currentQuestion < 0) {
    console.error('Invalid question index:', currentQuestion, 'Total questions:', shuffledQuestions.length);
    setCurrentQuestion(Math.max(0, Math.min(shuffledQuestions.length - 1, currentQuestion)));
    return null;
  }

  const currentQ = shuffledQuestions[currentQuestion]

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
            Question {currentQuestion + 1} of {shuffledQuestions.length}
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
            width: `${((currentQuestion + 1) / shuffledQuestions.length) * 100}%`,
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
              key={`question-${currentQ.id}-option-${index}`} // More unique key
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
            {currentQuestion < shuffledQuestions.length - 1 ? (
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
                onMouseEnter={(e) => {
                  console.log('Button hover - Answered:', Object.keys(selectedAnswers).length, 'Total:', shuffledQuestions.length);
                }}
              >
                {Object.keys(selectedAnswers).length === 0 
                  ? 'Select at least one answer' 
                  : `Submit Round 1 (${Object.keys(selectedAnswers).length}/${shuffledQuestions.length} answered)`}
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
          {shuffledQuestions.map((question, index) => (
            <div
              key={`nav-dot-${question.id}-${index}`}
              onClick={() => {
                // Safety check for navigation
                if (index >= 0 && index < shuffledQuestions.length) {
                  setCurrentQuestion(index);
                } else {
                  console.warn('Invalid navigation index:', index);
                }
              }}
              style={{
                width: isMobile ? '12px' : '20px',
                height: isMobile ? '12px' : '20px',
                borderRadius: '50%',
                backgroundColor: index === currentQuestion 
                  ? '#64ffda' 
                  : selectedAnswers[question.id] !== undefined
                  ? 'rgba(100, 255, 218, 0.5)'
                  : 'rgba(100, 255, 218, 0.1)',
                cursor: 'pointer',
                border: '2px solid rgba(100, 255, 218, 0.3)',
                transition: 'all 0.2s ease',
                opacity: (index === currentQuestion || selectedAnswers[question.id] !== undefined) ? 1 : 0.6
              }}
              title={`Question ${index + 1} ${selectedAnswers[question.id] !== undefined ? '(Answered)' : '(Not answered)'}`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Round1