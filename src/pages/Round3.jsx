import React, { useState, useEffect, useRef } from 'react'
import API from '../utils/api'

const Round3 = ({ onProceedToLeaderboard }) => {
  const [gameStarted, setGameStarted] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [warningCount, setWarningCount] = useState(0)
  const [moves, setMoves] = useState(0)
  const [currentTask, setCurrentTask] = useState(0) // 0-3 for the 4 tasks
  const [taskCompleted, setTaskCompleted] = useState([false, false, false, false])
  const [escapeKey, setEscapeKey] = useState(['_', '_', '_', '_'])
  const [showRiddle, setShowRiddle] = useState(false)
  const [riddleAnswer, setRiddleAnswer] = useState('')
  const [userInput, setUserInput] = useState('')
  const [feedback, setFeedback] = useState('')
  const [taskFeedback, setTaskFeedback] = useState('')

  // Define 4 riddle sets with different questions and keys
  const riddleSets = [
    {
      key: 'KEY1',
      riddles: [
        {
          question: "I speak without a mouth and hear without ears. I have no body, but I come alive with the wind. What am I?",
          answer: 'ECHO'
        },
        {
          question: "The more you take, the more you leave behind. What am I?",
          answer: 'FOOTSTEPS'
        },
        {
          question: "I have keys but no locks, space but no room, and you can enter but not go inside. What am I?",
          answer: 'KEYBOARD'
        },
        {
          question: "What has a heart that doesn't beat?",
          answer: 'ARTICHOKE'
        }
      ]
    },
    {
      key: 'DOOR',
      riddles: [
        {
          question: "What has hands but cannot clap?",
          answer: 'CLOCK'
        },
        {
          question: "What gets wetter the more it dries?",
          answer: 'TOWEL'
        },
        {
          question: "I'm tall when I'm young and short when I'm old. What am I?",
          answer: 'CANDLE'
        },
        {
          question: "What has cities, but no houses; forests, but no trees; and rivers, but no water?",
          answer: 'MAP'
        }
      ]
    },
    {
      key: 'ESCAPE',
      riddles: [
        {
          question: "What comes once in a minute, twice in a moment, but never in a thousand years?",
          answer: 'M'
        },
        {
          question: "What has a neck but no head?",
          answer: 'BOTTLE'
        },
        {
          question: "What has roots as nobody sees, is taller than trees, up, up it goes, and yet never grows?",
          answer: 'MOUNTAIN'
        },
        {
          question: "What gets broken without being held?",
          answer: 'PROMISE'
        }
      ]
    },
    {
      key: 'EXIT1',
      riddles: [
        {
          question: "What has one eye but cannot see?",
          answer: 'NEEDLE'
        },
        {
          question: "What has a thumb but no fingers?",
          answer: 'GLOVE'
        },
        {
          question: "What has legs but cannot walk?",
          answer: 'TABLE'
        },
        {
          question: "What has a bed but never sleeps?",
          answer: 'RIVER'
        }
      ]
    }
  ]

  // Randomly select one of the riddle sets
  const [selectedRiddleSet, setSelectedRiddleSet] = useState(null)
  
  useEffect(() => {
    // Randomly select a riddle set when component mounts
    const randomSet = riddleSets[Math.floor(Math.random() * riddleSets.length)]
    setSelectedRiddleSet(randomSet)
  }, [])

  // Enhanced requestFullscreen function with better browser compatibility and user gesture support
  const requestFullscreen = async (event = null) => {
    try {
      const element = document.documentElement;
      
      // Try multiple fullscreen methods for better browser compatibility
      let result;
      if (element.requestFullscreen) {
        result = element.requestFullscreen();
      } else if (element.mozRequestFullScreen) { // Firefox
        result = element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) { // Chrome, Safari
        result = element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) { // IE/Edge
        result = element.msRequestFullscreen();
      } else {
        console.warn('Fullscreen API not supported');
        return false;
      }
      
      // Wait for the promise to resolve
      await result;
      
      console.log('Successfully entered fullscreen mode in Round 3');
      return true;
    } catch (err) {
      console.warn('Fullscreen request failed in Round 3:', err);
      // Show a more helpful message to the user
      if (err.name === 'NotAllowedError') {
        console.warn('Fullscreen request blocked: Requires user gesture. Showing help message.');
      } else if (err.name === 'TypeError') {
        console.warn('Fullscreen permissions check failed. This is expected on initial load - waiting for user interaction.');
      }
      return false;
    }
  };

  // Request fullscreen when component mounts
  useEffect(() => {
    // Show a message to the user that they need to interact to enter fullscreen
    console.log('Round 3 loaded - waiting for user interaction to enter fullscreen');
    
    // Only try to enter fullscreen after user interaction
    const handleUserInteraction = async () => {
      console.log('User interaction detected, attempting to enter fullscreen');
      
      // Try to enter fullscreen after user interaction
      let success = false;
      let attempt = 1;
      
      while (!success && attempt <= 3) {
        try {
          console.log(`Fullscreen attempt ${attempt} for Round 3 after user interaction`);
          success = await requestFullscreen();
          
          if (!success) {
            await new Promise(resolve => setTimeout(resolve, 300));
            attempt++;
          }
        } catch (err) {
          console.warn(`Attempt ${attempt} failed:`, err);
          attempt++;
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
      
      if (!success) {
        console.warn('Failed to enter fullscreen in Round 3 after user interaction');
        alert('⚠️ Warning: Could not enter fullscreen mode in Round 3.\n\nPlease manually press F11 or use browser fullscreen controls.');
      }
    };
    
    // Set up event listener for the first user interaction
    const events = ['click', 'touchstart', 'keydown'];
    events.forEach(event => {
      document.addEventListener(event, handleUserInteraction, { once: true });
    });
    
    // Cleanup function
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserInteraction);
      });
    };
  }, []); // Added missing dependency array
  
  // Re-entry state management
  const reentryStateRef = useRef({
    attempts: 0,           // Attempts for current re-entry cycle
    isProcessing: false,
    currentTimeoutId: null  // Store timeout ID to be able to cancel it
  });
  
  // Track fullscreen state changes
  const lastFullscreenStateRef = useRef(null);

  // Re-entry attempts with verification - properly scoped
  const attemptReentry = async (warningNumber) => {
    // Check if already in fullscreen - if so, stop trying to re-enter
    if (document.fullscreenElement) {
      console.log(`✅ Already in fullscreen, stopping re-entry attempts for warning #${warningNumber}`);
      // Clear any pending timeouts
      if (reentryStateRef.current.currentTimeoutId) {
        clearTimeout(reentryStateRef.current.currentTimeoutId);
        reentryStateRef.current.currentTimeoutId = null;
      }
      reentryStateRef.current.attempts = 0;
      reentryStateRef.current.isProcessing = false;
      return;
    }
    
    reentryStateRef.current.attempts++;
    
    if (reentryStateRef.current.attempts > 3) {
      console.log(`❌ Max re-entry attempts reached for warning #${warningNumber}`);
      reentryStateRef.current.isProcessing = false;
      return;
    }
    
    try {
      console.log(`🔍 Re-entry attempt ${reentryStateRef.current.attempts}/3 in Round 3 for warning #${warningNumber}`);
      
      // Focus and request
      window.focus();
      document.body.focus();
      
      // Small delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Request fullscreen
      const success = await requestFullscreen();
      
      // Verify success
      if (success && document.fullscreenElement) {
        console.log(`✅ Successfully re-entered fullscreen on attempt ${reentryStateRef.current.attempts} in Round 3 for warning #${warningNumber}`);
        // Clear any pending timeouts
        if (reentryStateRef.current.currentTimeoutId) {
          clearTimeout(reentryStateRef.current.currentTimeoutId);
          reentryStateRef.current.currentTimeoutId = null;
        }
        reentryStateRef.current.attempts = 0;
        reentryStateRef.current.isProcessing = false;
      } else {
        console.log(`❌ Re-entry attempt ${reentryStateRef.current.attempts} failed in Round 3 for warning #${warningNumber}`);
        // Store the timeout ID so we can cancel it if needed
        if (reentryStateRef.current.currentTimeoutId) {
          clearTimeout(reentryStateRef.current.currentTimeoutId);
        }
        reentryStateRef.current.currentTimeoutId = setTimeout(() => {
          attemptReentry(warningNumber);
        }, reentryStateRef.current.attempts * 1000);
      }
    } catch (err) {
      console.error(`Attempt ${reentryStateRef.current.attempts} failed in Round 3 for warning #${warningNumber}:`, err);
      // Store the timeout ID so we can cancel it if needed
      if (reentryStateRef.current.currentTimeoutId) {
        clearTimeout(reentryStateRef.current.currentTimeoutId);
      }
      reentryStateRef.current.currentTimeoutId = setTimeout(() => {
        attemptReentry(warningNumber);
      }, reentryStateRef.current.attempts * 1000);
    }
  };

  // Enhanced fullscreen monitoring with simple re-entry on click
  useEffect(() => {
    let warningCooldown = false;
    const WARNING_COOLDOWN_TIME = 3000;
    
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      
      // Handle fullscreen exit - cheating detection
      if (!isCurrentlyFullscreen) {
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
          
          console.log(`⚠️ Warning #${newCount} issued for fullscreen exit`);
          
          if (newCount <= 3) {
            // Show website notification
            showWebsiteNotification(newCount);
            
            return newCount;
          } else {
            console.log("🚨 4th violation - auto-submitting");
            // 4th violation - auto-submit
            handleSubmit();
            return newCount;
          }
        });
      } else {
        console.log("✅ User entered fullscreen mode");
      }
    };
    
    // Simple re-entry function that triggers on any mouse click
    const handleMouseClick = async (event) => {
      if (!document.fullscreenElement) {
        console.log("🖱️ Mouse click detected, attempting to re-enter fullscreen");
        const success = await requestFullscreen(event);
        if (success) {
          console.log("✅ Re-entered fullscreen via mouse click");
        } else {
          console.log("❌ Failed to re-enter fullscreen via mouse click");
        }
      }
    };
    
    // Website notification system
    const showWebsiteNotification = (warningNumber) => {
      // Remove any existing notifications
      const existingNotification = document.getElementById('cheat-warning-notification-round3');
      if (existingNotification) {
        existingNotification.remove();
      }
      
      const notification = document.createElement('div');
      notification.id = 'cheat-warning-notification-round3';
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
      span.textContent = 'Fullscreen exit detected in Round 3. Click anywhere to re-enter fullscreen mode.';
      
      notification.appendChild(warningText);
      notification.appendChild(br);
      notification.appendChild(span);
      
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
    
    const handleVisibilityChange = () => {
      // Only trigger if not in fullscreen and the page is hidden
      if (document.visibilityState !== 'visible' && !document.fullscreenElement) {
        console.log("👁️ Page hidden while not in fullscreen - treating as exit");
        // Add a small delay to allow for normal visibility changes
        setTimeout(() => {
          if (!document.fullscreenElement && document.visibilityState !== 'visible') {
            // Trigger fullscreen exit handling
            if (!warningCooldown) {
              setWarningCount(prevCount => {
                const newCount = prevCount + 1;
                
                console.log(`⚠️ Warning #${newCount} issued for visibility change`);
                
                if (newCount <= 3) {
                  showWebsiteNotification(newCount);
                  
                  return newCount;
                } else {
                  console.log("🚨 4th violation - auto-submitting");
                  handleSubmit();
                  return newCount;
                }
              });
              
              // Set cooldown
              warningCooldown = true;
              setTimeout(() => {
                warningCooldown = false;
                console.log("✅ Cooldown period ended");
              }, WARNING_COOLDOWN_TIME);
            }
          }
        }, 100);
      }
    };

    const preventRightClick = (e) => {
      e.preventDefault()
      return false
    }
    
    const preventF12 = (e) => {
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault()
        return false
      }
    }

    // Prevent text selection with mouse
    const handleSelectStart = (e) => {
      e.preventDefault();
      return false;
    };
    
    // Prevent text selection with keyboard (Ctrl+A)
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
    
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    document.addEventListener('contextmenu', preventRightClick)
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('selectstart', handleSelectStart)
    document.addEventListener('click', handleMouseClick)  // Add click listener for re-entry
    
    // Cleanup function
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      document.removeEventListener('contextmenu', preventRightClick)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('selectstart', handleSelectStart)
      document.removeEventListener('click', handleMouseClick)  // Remove click listener
    }
  }, [])

  // Add the CSS animation for the rotating background effect
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `@keyframes rotate {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }`;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Task definitions
  const tasks = [
    {
      type: 'debug',
      title: 'Debug the Syntax',
      description: 'Find and fix the syntax error in the code below:',
      content: `function calculateSum(a, b {
  return a + b;
}`,
      solution: ')'
    },
    {
      type: 'decode',
      title: 'Decode Encrypted Message',
      description: 'Decode the following Caesar cipher (shift by 3):',
      content: 'Khoor Zruog',
      solution: 'Hello World'
    },
    {
      type: 'logic',
      title: 'Logic Puzzle',
      description: 'Complete the sequence: 2, 6, 12, 20, 30, ?',
      content: 'What is the next number in the sequence?',
      solution: '42'
    },
    {
      type: 'pattern',
      title: 'Pattern Recognition',
      description: 'Identify the next item in this pattern:',
      content: 'O, T, T, F, F, S, S, ?, ?',
      solution: 'E,N'
    }
  ];

  // Submit the current task
  const submitTask = () => {
    if (currentTask >= 4) return;
    
    // Validate the user's answer
    const correct = userInput.trim().toLowerCase() === tasks[currentTask].solution.toLowerCase();
    
    if (correct) {
      setTaskFeedback('Correct! Moving to the next challenge...');
      setTaskCompleted(prev => {
        const newCompleted = [...prev];
        newCompleted[currentTask] = true;
        return newCompleted;
      });
      
      // Move to riddle after a short delay
      setTimeout(() => {
        setShowRiddle(true);
      }, 1500);
    } else {
      setTaskFeedback('Incorrect. Please try again.');
    }
  };

  // Submit riddle answer
  const submitRiddle = () => {
    if (!selectedRiddleSet) return;
    
    const currentRiddle = selectedRiddleSet.riddles[currentTask];
    const correct = riddleAnswer.trim().toUpperCase() === currentRiddle.answer.toUpperCase();
    
    if (correct) {
      // Add the first letter of the riddle answer to the escape key
      const letterToAdd = currentRiddle.answer.charAt(0).toUpperCase();
      setEscapeKey(prev => {
        const newKey = [...prev];
        newKey[currentTask] = letterToAdd;
        return newKey;
      });
      
      setFeedback(`Correct! The letter '${letterToAdd}' has been added to your escape key.`);
      
      // Move to next task after a delay
      setTimeout(() => {
        setShowRiddle(false);
        setRiddleAnswer('');
        setFeedback('');
        setTaskFeedback('');
        setUserInput('');
        
        if (currentTask < 3) {
          setCurrentTask(prev => prev + 1);
        } else {
          // All tasks completed
          setGameWon(true);
        }
      }, 2000);
    } else {
      setFeedback('Incorrect. Try again.');
    }
  };

  const handleSubmit = async () => {
    console.log('Submit button clicked!');
    const endTime = Date.now()
    const timeTaken = startTime ? (endTime - startTime) / 1000 : 0 // in seconds
    
    // If using skip button, set game as completed
    const isCompleted = gameWon || taskCompleted.filter(t => t).length === 4;
    
    const score = {
      round: 3,
      moves: moves,
      timeTaken: timeTaken,
      completed: isCompleted,
      escapeKey: escapeKey.join(''),
      tasksCompleted: taskCompleted.filter(t => t).length
    }
    
    console.log('Score data:', score);
    
    // Send to backend
    try {
      const token = localStorage.getItem('token')
      console.log('Token:', token);
      console.log('API URL:', API.ROUND3_SUBMIT);
      
      const response = await fetch(API.ROUND3_SUBMIT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(score)
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Server response:', result);
    } catch (error) {
      console.error('Error submitting round 3:', error)
    }
    
    console.log('Calling onProceedToLeaderboard with:', score);
    try {
      onProceedToLeaderboard(score);
      console.log('onProceedToLeaderboard called successfully');
    } catch (error) {
      console.error('Error calling onProceedToLeaderboard:', error);
    }
  }

  if (gameWon) {
    return (
      <div style={{
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center',
        backgroundImage: 'radial-gradient(circle, rgba(30, 30, 40, 0.9) 0%, rgba(10, 10, 15, 0.95) 100%)',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Ambient lighting effects */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'conic-gradient(transparent, rgba(239, 68, 68, 0.1), transparent 30%)',
          animation: 'rotate 15s linear infinite',
          pointerEvents: 'none'
        }} />
        
        <div style={{
          backgroundColor: 'rgba(20, 10, 20, 0.8)',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(239, 68, 68, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          backdropFilter: 'blur(4px)',
          position: 'relative',
          zIndex: 1,
          margin: '0 auto',
          maxWidth: '800px'
        }}>
          <h1 style={{ 
            color: '#4ade80', 
            marginBottom: '1rem',
            textShadow: '0 0 10px rgba(74, 222, 128, 0.7)',
            fontSize: '2.5rem'
          }}>
            🏰 ESCAPE SUCCESSFUL! 🏰
          </h1>
          <p style={{ color: '#e2e8f0', marginBottom: '1rem', fontSize: '1.2rem' }}>
            🎉 You have successfully escaped the haunted Blackwood Manor! 🎉
          </p>
          <p style={{ color: '#e2e8f0', marginBottom: '1rem' }}>
            Your escape key: <strong style={{ color: '#fbbf24', fontSize: '1.5rem' }}>{escapeKey.join('')}</strong>
          </p>
          <p style={{ color: '#e2e8f0', marginBottom: '2rem' }}>
            Time taken: {startTime ? Math.round((Date.now() - startTime) / 1000) : 0} seconds<br/>
            Tasks completed: {taskCompleted.filter(t => t).length}/4
          </p>
          <button
            onClick={handleSubmit}
            style={{
              backgroundColor: '#4ade80',
              color: '#0a192f',
              border: 'none',
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              borderRadius: '30px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              boxShadow: '0 0 15px rgba(74, 222, 128, 0.4)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 0 25px rgba(74, 222, 128, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 0 15px rgba(74, 222, 128, 0.4)';
            }}
          >
            Submit Round 3
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      textAlign: 'center',
      backgroundImage: 'radial-gradient(circle, rgba(30, 30, 40, 0.9) 0%, rgba(10, 10, 15, 0.95) 100%)',
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Ambient lighting effects */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'conic-gradient(transparent, rgba(239, 68, 68, 0.1), transparent 30%)',
        animation: 'rotate 15s linear infinite',
        pointerEvents: 'none'
      }} />
      
      <div style={{
        backgroundColor: 'rgba(20, 10, 20, 0.8)',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(239, 68, 68, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        backdropFilter: 'blur(4px)',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          padding: '1rem',
          backgroundColor: 'rgba(30, 10, 30, 0.7)',
          borderRadius: '8px',
          border: '1px solid rgba(239, 68, 68, 0.4)'
        }}>
          <h1 style={{ 
            color: '#ef4444', 
            margin: 0,
            textShadow: '0 0 10px rgba(239, 68, 68, 0.7)',
            fontSize: '2.2rem',
            fontFamily: 'monospace',
            letterSpacing: '2px'
          }}>
            THE ESCAPE PROTOCOL
          </h1>
          <div style={{
            display: 'flex',
            gap: '1rem'
          }}>
            <div style={{
              color: '#e2e8f0',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              padding: '0.5rem 1rem',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '8px'
            }}>
              Task: {currentTask + 1}/4
            </div>
            <div style={{
              color: '#e2e8f0',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              padding: '0.5rem 1rem',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '8px'
            }}>
              Time: {startTime ? Math.round((Date.now() - startTime) / 1000) : 0}s
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'rgba(30, 10, 30, 0.7)',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          boxShadow: '0 0 15px rgba(239, 68, 68, 0.2)'
        }}>
          <h2 style={{ color: '#fbbf24', marginBottom: '1rem', textShadow: '0 0 5px rgba(251, 191, 36, 0.5)' }}>
            {tasks[currentTask]?.title}
          </h2>
          <p style={{ color: '#f8fafc', lineHeight: '1.6', marginBottom: '1rem' }}>
            {tasks[currentTask]?.description}
          </p>
          <div style={{ 
            backgroundColor: '#1f2937', 
            padding: '1rem', 
            borderRadius: '8px', 
            fontFamily: 'monospace', 
            textAlign: 'left',
            overflowX: 'auto',
            margin: '1rem 0'
          }}>
            <pre style={{ margin: 0, color: '#d1d5db' }}>{tasks[currentTask]?.content}</pre>
          </div>
        </div>

        {!showRiddle ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Enter your solution..."
              style={{
                padding: '0.75rem 1rem',
                fontSize: '1rem',
                borderRadius: '8px',
                border: '2px solid #64ffda',
                backgroundColor: 'rgba(10, 25, 47, 0.8)',
                color: '#e2e8f0',
                width: '300px',
                outline: 'none'
              }}
            />
            <button
              onClick={submitTask}
              style={{
                backgroundColor: '#64ffda',
                color: '#0a192f',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              Submit Solution
            </button>
            {taskFeedback && (
              <div style={{
                color: taskFeedback.includes('Correct') ? '#4ade80' : '#f87171',
                fontWeight: 'bold',
                marginTop: '1rem'
              }}>
                {taskFeedback}
              </div>
            )}
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{ color: '#fbbf24', marginBottom: '1rem' }}>RIDDLE CHALLENGE</h3>
            <p style={{ color: '#e2e8f0', fontSize: '1.1rem', maxWidth: '600px' }}>
              {selectedRiddleSet?.riddles[currentTask]?.question}
            </p>
            <input
              type="text"
              value={riddleAnswer}
              onChange={(e) => setRiddleAnswer(e.target.value)}
              placeholder="Enter your riddle answer..."
              style={{
                padding: '0.75rem 1rem',
                fontSize: '1rem',
                borderRadius: '8px',
                border: '2px solid #64ffda',
                backgroundColor: 'rgba(10, 25, 47, 0.8)',
                color: '#e2e8f0',
                width: '300px',
                outline: 'none'
              }}
            />
            <button
              onClick={submitRiddle}
              style={{
                backgroundColor: '#fbbf24',
                color: '#0a192f',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              Solve Riddle
            </button>
            {feedback && (
              <div style={{
                color: feedback.includes('Correct') ? '#4ade80' : '#f87171',
                fontWeight: 'bold',
                marginTop: '1rem'
              }}>
                {feedback}
              </div>
            )}
          </div>
        )}

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginTop: '2rem',
          flexWrap: 'wrap'
        }}>
          <div style={{
            color: '#e2e8f0',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            padding: '0.75rem 1.5rem',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '8px'
          }}>
            Escape Key: <span style={{ color: '#fbbf24', fontSize: '1.3rem' }}>{escapeKey.join('-')}</span>
          </div>
          
          <button
            onClick={() => {
              // Skip all tasks and set game as won
              setGameWon(true);
              // Set all tasks as completed
              setTaskCompleted([true, true, true, true]);
              // Generate a random escape key for demo purposes
              const randomKey = ['S', 'K', 'I', 'P'];
              setEscapeKey(randomKey);
            }}
            style={{
              backgroundColor: '#8b5cf6',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            Skip All Tasks
          </button>
          
          <button
            onClick={handleSubmit}
            style={{
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Submit Round 3
          </button>
        </div>

        <div style={{ marginTop: '2rem', color: '#94a3b8', fontSize: '0.9rem' }}>
          <p>Complete all 4 tasks to escape the haunted manor. Each task is followed by a riddle.</p>
          <p>Your answers to the riddles form the 4-letter escape key.</p>
        </div>
      </div>
    </div>
  )
}

export default Round3