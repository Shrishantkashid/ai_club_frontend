import React, { useState, useEffect, useRef } from 'react'
import API from '../utils/api'

const Round2 = ({ onCompleteRound2 }) => {
  const [puzzle, setPuzzle] = useState([])
  const [moves, setMoves] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [warningCount, setWarningCount] = useState(0)

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
      
      console.log('Successfully entered fullscreen mode in Round 2');
      return true;
    } catch (err) {
      console.warn('Fullscreen request failed in Round 2:', err);
      return false;
    }
  };

  // Request fullscreen when component mounts
  useEffect(() => {
    // Enhanced initial fullscreen entry for Round 2
    const enterFullscreen = async (attempt = 1) => {
      try {
        console.log(`Initial fullscreen attempt ${attempt} for Round 2`);
        
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
          // Retry with longer delay
          setTimeout(() => enterFullscreen(attempt + 1), attempt * 1000);
        } else if (!success) {
          console.warn('Failed to enter fullscreen in Round 2 after all attempts');
          alert('⚠️ Warning: Could not enter fullscreen mode in Round 2.\n\nPlease manually press F11 or use browser fullscreen controls.');
        }
      } catch (err) {
        console.warn(`Initial fullscreen attempt ${attempt} failed for Round 2:`, err);
        if (attempt < 4) {
          setTimeout(() => enterFullscreen(attempt + 1), attempt * 1000);
        }
      }
    };
    
    // Start initial fullscreen attempts
    setTimeout(() => {
      enterFullscreen(1);
    }, 300);
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
      console.log(`🔍 Re-entry attempt ${reentryStateRef.current.attempts}/3 in Round 2 for warning #${warningNumber}`);
      
      // Focus and request
      window.focus();
      document.body.focus();
      
      // Small delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Request fullscreen
      const success = await requestFullscreen();
      
      // Verify success
      if (success && document.fullscreenElement) {
        console.log(`✅ Successfully re-entered fullscreen on attempt ${reentryStateRef.current.attempts} in Round 2 for warning #${warningNumber}`);
        // Clear any pending timeouts
        if (reentryStateRef.current.currentTimeoutId) {
          clearTimeout(reentryStateRef.current.currentTimeoutId);
          reentryStateRef.current.currentTimeoutId = null;
        }
        reentryStateRef.current.attempts = 0;
        reentryStateRef.current.isProcessing = false;
      } else {
        console.log(`❌ Re-entry attempt ${reentryStateRef.current.attempts} failed in Round 2 for warning #${warningNumber}`);
        // Store the timeout ID so we can cancel it if needed
        if (reentryStateRef.current.currentTimeoutId) {
          clearTimeout(reentryStateRef.current.currentTimeoutId);
        }
        reentryStateRef.current.currentTimeoutId = setTimeout(() => {
          attemptReentry(warningNumber);
        }, reentryStateRef.current.attempts * 1000);
      }
    } catch (err) {
      console.error(`Attempt ${reentryStateRef.current.attempts} failed in Round 2 for warning #${warningNumber}:`, err);
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
    
    // Website notification system
    const showWebsiteNotification = (warningNumber) => {
      // Remove any existing notifications
      const existingNotification = document.getElementById('cheat-warning-notification-round2');
      if (existingNotification) {
        existingNotification.remove();
      }
      
      const notification = document.createElement('div');
      notification.id = 'cheat-warning-notification-round2';
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
      span.textContent = 'Fullscreen exit detected in Round 2. Click anywhere to re-enter fullscreen mode.';
      
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

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    document.addEventListener('contextmenu', preventRightClick)
    document.addEventListener('keydown', preventF12)
    document.addEventListener('click', handleMouseClick)  // Add click listener for re-entry
    
    // Cleanup function
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      document.removeEventListener('contextmenu', preventRightClick)
      document.removeEventListener('keydown', preventF12)
      document.removeEventListener('click', handleMouseClick)  // Remove click listener
    }
  }, [])

  // Create initial puzzle state (solved)
  const createInitialPuzzle = () => {
    return [1, 2, 3, 4, 5, 6, 7, 8, null]
  }

  // Shuffle the puzzle
  const shufflePuzzle = (puzzle) => {
    const shuffled = [...puzzle]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Check if puzzle is solved
  const isSolved = (puzzle) => {
    const solved = [1, 2, 3, 4, 5, 6, 7, 8, null]
    return puzzle.every((val, idx) => val === solved[idx])
  }

  // Get possible moves (adjacent tiles to empty space)
  const getPossibleMoves = (puzzle) => {
    const emptyIndex = puzzle.indexOf(null)
    const moves = []
    
    // Up
    if (emptyIndex >= 3) moves.push(emptyIndex - 3)
    // Down
    if (emptyIndex <= 5) moves.push(emptyIndex + 3)
    // Left
    if (emptyIndex % 3 !== 0) moves.push(emptyIndex - 1)
    // Right
    if (emptyIndex % 3 !== 2) moves.push(emptyIndex + 1)
    
    return moves
  }

  // Move tile
  const moveTile = (fromIndex) => {
    if (!gameStarted) {
      setGameStarted(true)
      setStartTime(Date.now())
    }

    const possibleMoves = getPossibleMoves(puzzle)
    const emptyIndex = puzzle.indexOf(null)
    
    if (possibleMoves.includes(fromIndex)) {
      const newPuzzle = [...puzzle]
      newPuzzle[emptyIndex] = newPuzzle[fromIndex]
      newPuzzle[fromIndex] = null
      setPuzzle(newPuzzle)
      setMoves(moves + 1)
      
      if (isSolved(newPuzzle)) {
        setGameWon(true)
      }
    }
  }

  // Initialize game
  useEffect(() => {
    const initialPuzzle = shufflePuzzle(createInitialPuzzle())
    setPuzzle(initialPuzzle)
  }, [])

  const handleSubmit = async () => {
    const endTime = Date.now()
    const timeTaken = startTime ? (endTime - startTime) / 1000 : 0 // in seconds
    
    const score = {
      round: 2,
      moves: moves,
      timeTaken: timeTaken,
      completed: gameWon
    }
    
    // Send to backend
    try {
      const token = localStorage.getItem('token')
      await fetch(API.ROUND2_SUBMIT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(score)
      })
    } catch (error) {
      console.error('Error submitting round 2:', error)
    }
    
    onCompleteRound2(score)
  }

  if (gameWon) {
    return (
      <div style={{
        padding: '2rem',
        maxWidth: '1200px',
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
            color: '#4ade80', 
            marginBottom: '1rem',
            textShadow: '0 0 8px rgba(74, 222, 128, 0.5)'
          }}>
            🎉 Puzzle Solved! 🎉
          </h1>
          <p style={{ color: '#e2e8f0', marginBottom: '1rem' }}>
            Congratulations! You solved the 8-puzzle in {moves} moves.
          </p>
          <p style={{ color: '#e2e8f0', marginBottom: '2rem' }}>
            Time taken: {startTime ? Math.round((Date.now() - startTime) / 1000) : 0} seconds
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
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 0 20px rgba(74, 222, 128, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Submit Round 2
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
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          padding: '1rem',
          backgroundColor: 'rgba(10, 25, 47, 0.5)',
          borderRadius: '8px'
        }}>
          <h1 style={{ 
            color: '#64ffda', 
            margin: 0,
            textShadow: '0 0 8px rgba(100, 255, 218, 0.3)'
          }}>
            Round 2: 8-Puzzle Challenge
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
              Moves: {moves}
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
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          maxWidth: '400px',
          margin: '0 auto 2rem'
        }}>
          {puzzle.map((tile, index) => (
            <div
              key={index}
              onClick={() => tile && moveTile(index)}
              style={{
                aspectRatio: '1',
                backgroundColor: tile ? '#1e40af' : '#374151',
                color: '#e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: 'bold',
                borderRadius: '8px',
                cursor: tile ? 'pointer' : 'default',
                border: '2px solid rgba(100, 255, 218, 0.3)',
                transition: 'all 0.2s ease',
                opacity: tile ? 1 : 0.7
              }}
            >
              {tile}
            </div>
          ))}
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginTop: '2rem'
        }}>
          <button
            onClick={() => {
              const initialPuzzle = shufflePuzzle(createInitialPuzzle())
              setPuzzle(initialPuzzle)
              setMoves(0)
              setGameStarted(false)
              setStartTime(null)
              setGameWon(false)
            }}
            style={{
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Reset Puzzle
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
            Submit Round 2
          </button>
        </div>

        <div style={{ marginTop: '2rem', color: '#94a3b8', fontSize: '0.9rem' }}>
          <p>Click on a tile adjacent to the empty space to move it.</p>
          <p>Solve the puzzle by arranging tiles in numerical order.</p>
        </div>
      </div>
    </div>
  )
}

export default Round2