import React, { useState, useEffect, useRef } from 'react'
import API from '../utils/api'

const Round2 = ({ onCompleteRound2 }) => {
  // State for 8-puzzle
  const [puzzle, setPuzzle] = useState([])
  const [moves, setMoves] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  
  // State for Jealous Husbands Problem
  const [jealousHusbandsState, setJealousHusbandsState] = useState({
    leftSide: ['H1', 'H2', 'H3', 'W1', 'W2', 'W3'], // H=Husband, W=Wife
    rightSide: [],
    boatPosition: 'left',
    boatOccupants: [],
    moves: 0,
    gameWon: false
  });
  
  // State for Tower of Hanoi
  const [towerOfHanoiState, setTowerOfHanoiState] = useState({
    poles: [
      [3, 2, 1], // Pole A - disks in descending order (largest at bottom)
      [],        // Pole B
      []         // Pole C
    ],
    moves: 0,
    gameWon: false,
    selectedDisk: null,
    selectedPole: null
  });  
  
  // State for Water Jug Problem
  const [waterJugState, setWaterJugState] = useState({
    jugs: [0, 0], // Amount of water in each jug [jug3, jug4] - representing 3-gallon and 4-gallon jugs
    capacities: [3, 4], // Capacity of each jug
    moves: 0,
    gameWon: false,
    targetAmount: 2 // Target amount to achieve in either jug
  });  
  
  // State for Monkey and Banana Problem
  const [monkeyBananaState, setMonkeyBananaState] = useState({
    monkeyPosition: 'corner', // 'corner', 'box', 'under-banana', 'on-box'
    boxPosition: 'corner',    // 'corner', 'under-banana'
    bananaPosition: 'ceiling', // 'ceiling' - unreachable, 'reachable' - after climbing
    holdingBox: false,
    onBox: false,             // Whether monkey is on the box
    hasBanana: false,         // Whether monkey has the banana
    moves: 0,
    gameWon: false
  });
  
  const [currentActivity, setCurrentActivity] = useState('eight-puzzle'); // 'eight-puzzle', 'jealous-husbands', 'tower-of-hanoi', 'water-jug', or 'monkey-banana'
  const [gameWon, setGameWon] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [warningCount, setWarningCount] = useState(0)

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
      
      console.log('Successfully entered fullscreen mode in Round 2');
      return true;
    } catch (err) {
      console.warn('Fullscreen request failed in Round 2:', err);
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
        setGameWon(true);
        // Update the overall game won state
        if (currentActivity === 'eight-puzzle') {
          setGameWon(true);
        }
      }
    }
  }

  // Initialize games
  useEffect(() => {
    const initialPuzzle = shufflePuzzle(createInitialPuzzle())
    setPuzzle(initialPuzzle)
  }, [])

  // Jealous Husbands Problem functions
  const isValidState = (leftSide, rightSide) => {
    // Check if any wife is with other husbands without her husband present
    const checkSide = (people) => {
      const wives = people.filter(person => person.startsWith('W'));
      const husbands = people.filter(person => person.startsWith('H'));
      
      for (const wife of wives) {
        const wifeNum = wife[1]; // Get the number from W1, W2, W3
        const husbandOfWife = `H${wifeNum}`;
        
        // If the husband of this wife is not on this side but there are other husbands here
        if (!people.includes(husbandOfWife) && husbands.length > 0) {
          return false; // Invalid state
        }
      }
      return true;
    };
    
    return checkSide(leftSide) && checkSide(rightSide);
  };

  const isWinningState = (rightSide) => {
    return rightSide.length === 6; // All people on the right side
  };

  const handleJealousHusbandsMove = (person) => {
    if (!gameStarted) {
      setGameStarted(true);
      setStartTime(Date.now());
    }
    
    const newState = { ...jealousHusbandsState };
    
    // Add or remove person from boat
    if (newState.boatOccupants.length < 2 && 
        ((newState.boatPosition === 'left' && newState.leftSide.includes(person)) || 
         (newState.boatPosition === 'right' && newState.rightSide.includes(person)))) {
      
      // Add person to boat if not already there
      if (!newState.boatOccupants.includes(person)) {
        newState.boatOccupants = [...newState.boatOccupants, person];
      } else {
        // Remove person from boat
        newState.boatOccupants = newState.boatOccupants.filter(p => p !== person);
      }
    } else if (newState.boatOccupants.includes(person)) {
      // Remove person from boat
      newState.boatOccupants = newState.boatOccupants.filter(p => p !== person);
    }
    
    setJealousHusbandsState(newState);
  };

  const crossRiver = () => {
    if (jealousHusbandsState.boatOccupants.length === 0) return;
    
    const newState = { ...jealousHusbandsState };
    
    if (newState.boatPosition === 'left') {
      // Move people from left to right
      newState.leftSide = newState.leftSide.filter(person => !newState.boatOccupants.includes(person));
      newState.rightSide = [...newState.rightSide, ...newState.boatOccupants];
      newState.boatPosition = 'right';
    } else {
      // Move people from right to left
      newState.rightSide = newState.rightSide.filter(person => !newState.boatOccupants.includes(person));
      newState.leftSide = [...newState.leftSide, ...newState.boatOccupants];
      newState.boatPosition = 'left';
    }
    
    newState.boatOccupants = [];
    newState.moves += 1;
    
    // Check if the new state is valid
    if (isValidState(newState.leftSide, newState.rightSide)) {
      setJealousHusbandsState(newState);
      
      // Check for win condition
      if (isWinningState(newState.rightSide)) {
        newState.gameWon = true;
        setJealousHusbandsState(newState);
        setGameWon(true); // Update overall game state
      }
    } else {
      // Invalid move - highlight the rule violation
      const ruleViolationElement = document.querySelector('.rule-violation-highlight');
      if (ruleViolationElement) {
        ruleViolationElement.style.backgroundColor = '#dc2626';
        ruleViolationElement.style.transition = 'background-color 0.3s ease';
        setTimeout(() => {
          if (ruleViolationElement) {
            ruleViolationElement.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
          }
        }, 1000);
      }
      
      // Show a less intrusive notification instead of an alert
      const notification = document.createElement('div');
      notification.id = 'jealous-husbands-error';
      notification.textContent = 'Rule Violation! A wife cannot be with another husband without her own husband present.';
      notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #dc2626;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(220, 38, 38, 0.5);
        z-index: 10000;
        font-family: Arial, sans-serif;
        font-weight: bold;
        text-align: center;
        animation: fadeInOut 2s ease-in-out;
      `;
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 2000);
    }
  };

  const resetJealousHusbands = () => {
    setJealousHusbandsState({
      leftSide: ['H1', 'H2', 'H3', 'W1', 'W2', 'W3'],
      rightSide: [],
      boatPosition: 'left',
      boatOccupants: [],
      moves: 0,
      gameWon: false
    });
    setGameWon(false);
  };
  
  // Tower of Hanoi functions
  const isValidHanoiMove = (sourcePole, destPole) => {
    const sourceDisks = towerOfHanoiState.poles[sourcePole];
    const destDisks = towerOfHanoiState.poles[destPole];
    
    // Can't move from empty pole
    if (sourceDisks.length === 0) return false;
    
    // Can place on empty pole
    if (destDisks.length === 0) return true;
    
    // Can only place smaller disk on larger disk
    const movingDisk = sourceDisks[sourceDisks.length - 1];
    const topDestDisk = destDisks[destDisks.length - 1];
    
    return movingDisk < topDestDisk;
  };
  
  const isHanoiWinningState = (poles) => {
    // Winning state is when all disks are on the last pole in correct order
    return poles[0].length === 0 && poles[1].length === 0 && poles[2].length === 3;
  };
  
  const handleTowerOfHanoiClick = (poleIndex) => {
    if (!gameStarted) {
      setGameStarted(true);
      setStartTime(Date.now());
    }
    
    const newState = { ...towerOfHanoiState };
    
    if (newState.selectedPole === null) {
      // First click - select a pole to take a disk from
      if (newState.poles[poleIndex].length > 0) {
        newState.selectedPole = poleIndex;
        newState.selectedDisk = newState.poles[poleIndex][newState.poles[poleIndex].length - 1];
      }
    } else if (newState.selectedPole === poleIndex) {
      // Clicked same pole - deselect
      newState.selectedPole = null;
      newState.selectedDisk = null;
    } else {
      // Second click - move disk to this pole
      if (isValidHanoiMove(newState.selectedPole, poleIndex)) {
        // Move the disk
        const diskToMove = newState.poles[newState.selectedPole].pop();
        newState.poles[poleIndex].push(diskToMove);
        newState.moves += 1;
        
        // Check win condition
        if (isHanoiWinningState(newState.poles)) {
          newState.gameWon = true;
          setGameWon(true); // Update overall game state
        }
      } else {
        // Invalid move - highlight the rule violation
        const ruleViolationElement = document.querySelector('.rule-violation-highlight');
        if (ruleViolationElement) {
          ruleViolationElement.style.backgroundColor = '#dc2626';
          ruleViolationElement.style.transition = 'background-color 0.3s ease';
          setTimeout(() => {
            if (ruleViolationElement) {
              ruleViolationElement.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
            }
          }, 1000);
        }
        
        // Show error notification
        const notification = document.createElement('div');
        notification.id = 'hanoi-error';
        notification.textContent = 'Invalid move! Cannot place a larger disk on a smaller disk.';
        notification.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: #dc2626;
          color: white;
          padding: 15px 25px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.5);
          z-index: 10000;
          font-family: Arial, sans-serif;
          font-weight: bold;
          text-align: center;
          animation: fadeInOut 2s ease-in-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 2000);
      }
      
      // Deselect regardless of validity
      newState.selectedPole = null;
      newState.selectedDisk = null;
    }
    
    setTowerOfHanoiState(newState);
  };
  
  const resetTowerOfHanoi = () => {
    setTowerOfHanoiState({
      poles: [
        [3, 2, 1], // Pole A
        [],        // Pole B 
        []         // Pole C
      ],
      moves: 0,
      gameWon: false,
      selectedDisk: null,
      selectedPole: null
    });
    setGameWon(false);
  };
  
  // Water Jug Problem functions
  const isWaterJugWinningState = (jugs, target) => {
    // Win if either jug contains the target amount
    return jugs[0] === target || jugs[1] === target;
  };
  
  const fillJug = (jugIndex) => {
    if (!gameStarted) {
      setGameStarted(true);
      setStartTime(Date.now());
    }
    
    const newState = { ...waterJugState };
    newState.jugs[jugIndex] = newState.capacities[jugIndex];
    newState.moves += 1;
    
    // Check win condition
    if (isWaterJugWinningState(newState.jugs, newState.targetAmount)) {
      newState.gameWon = true;
      setGameWon(true); // Update overall game state
    }
    
    setWaterJugState(newState);
  };
  
  const emptyJug = (jugIndex) => {
    if (!gameStarted) {
      setGameStarted(true);
      setStartTime(Date.now());
    }
    
    const newState = { ...waterJugState };
    newState.jugs[jugIndex] = 0;
    newState.moves += 1;
    
    // Check win condition
    if (isWaterJugWinningState(newState.jugs, newState.targetAmount)) {
      newState.gameWon = true;
      setGameWon(true); // Update overall game state
    }
    
    setWaterJugState(newState);
  };
  
  const pourFromTo = (fromJug, toJug) => {
    if (!gameStarted) {
      setGameStarted(true);
      setStartTime(Date.now());
    }
    
    if (fromJug === toJug || waterJugState.jugs[fromJug] === 0 || waterJugState.jugs[toJug] === waterJugState.capacities[toJug]) {
      return; // Invalid move
    }
    
    const newState = { ...waterJugState };
    
    // Calculate how much can be poured
    const availableSpace = waterJugState.capacities[toJug] - waterJugState.jugs[toJug];
    const amountToPour = Math.min(waterJugState.jugs[fromJug], availableSpace);
    
    newState.jugs[fromJug] -= amountToPour;
    newState.jugs[toJug] += amountToPour;
    newState.moves += 1;
    
    // Check win condition
    if (isWaterJugWinningState(newState.jugs, newState.targetAmount)) {
      newState.gameWon = true;
      setGameWon(true); // Update overall game state
    }
    
    setWaterJugState(newState);
  };
  
  const resetWaterJug = () => {
    setWaterJugState({
      jugs: [0, 0],
      capacities: [3, 4],
      moves: 0,
      gameWon: false,
      targetAmount: 2
    });
    setGameWon(false);
  };
  
  // Monkey and Banana Problem functions
  const isMonkeyBananaWinningState = (state) => {
    // Win when monkey has the banana
    return state.hasBanana;
  };
  
  const moveMonkey = (destination) => {
    if (!gameStarted) {
      setGameStarted(true);
      setStartTime(Date.now());
    }
    
    if (monkeyBananaState.monkeyPosition === destination) return; // Already there
    
    const newState = { ...monkeyBananaState };
    
    // If monkey is holding the box, move it too
    if (newState.holdingBox) {
      newState.boxPosition = destination;
    }
    
    newState.monkeyPosition = destination;
    newState.moves += 1;
    
    // Check win condition
    if (isMonkeyBananaWinningState(newState)) {
      newState.gameWon = true;
      setGameWon(true); // Update overall game state
    }
    
    setMonkeyBananaState(newState);
  };
  
  const grabBox = () => {
    if (!gameStarted) {
      setGameStarted(true);
      setStartTime(Date.now());
    }
    
    // Can only grab box if monkey and box are in the same position and monkey is not already holding it
    if (monkeyBananaState.monkeyPosition === monkeyBananaState.boxPosition && !monkeyBananaState.holdingBox) {
      const newState = { ...monkeyBananaState };
      newState.holdingBox = true;
      newState.moves += 1;
      
      // Check win condition
      if (isMonkeyBananaWinningState(newState)) {
        newState.gameWon = true;
        setGameWon(true); // Update overall game state
      }
      
      setMonkeyBananaState(newState);
    }
  };
  
  const releaseBox = () => {
    if (!gameStarted) {
      setGameStarted(true);
      setStartTime(Date.now());
    }
    
    // Can only release box if monkey is holding it
    if (monkeyBananaState.holdingBox) {
      const newState = { ...monkeyBananaState };
      newState.holdingBox = false;
      newState.moves += 1;
      
      // Check win condition
      if (isMonkeyBananaWinningState(newState)) {
        newState.gameWon = true;
        setGameWon(true); // Update overall game state
      }
      
      setMonkeyBananaState(newState);
    }
  };
  
  const climbOnBox = () => {
    if (!gameStarted) {
      setGameStarted(true);
      setStartTime(Date.now());
    }
    
    // Can only climb if monkey is at the same position as the box and the box is under the banana
    if (monkeyBananaState.monkeyPosition === monkeyBananaState.boxPosition && 
        monkeyBananaState.boxPosition === 'under-banana' && 
        !monkeyBananaState.onBox) {
      
      const newState = { ...monkeyBananaState };
      newState.onBox = true;
      newState.moves += 1;
      
      // Check win condition
      if (isMonkeyBananaWinningState(newState)) {
        newState.gameWon = true;
        setGameWon(true); // Update overall game state
      }
      
      setMonkeyBananaState(newState);
    }
  };
  
  const grabBanana = () => {
    if (!gameStarted) {
      setGameStarted(true);
      setStartTime(Date.now());
    }
    
    // Can only grab banana if monkey is on the box and the box is under the banana
    if (monkeyBananaState.onBox && monkeyBananaState.boxPosition === 'under-banana') {
      const newState = { ...monkeyBananaState };
      newState.hasBanana = true;
      newState.moves += 1;
      
      // Check win condition
      if (isMonkeyBananaWinningState(newState)) {
        newState.gameWon = true;
        setGameWon(true); // Update overall game state
      }
      
      setMonkeyBananaState(newState);
    }
  };
  
  const resetMonkeyBanana = () => {
    setMonkeyBananaState({
      monkeyPosition: 'corner',
      boxPosition: 'corner',
      bananaPosition: 'ceiling',
      holdingBox: false,
      onBox: false,
      hasBanana: false,
      moves: 0,
      gameWon: false
    });
    setGameWon(false);
  };

  const handleSubmit = async () => {
    const endTime = Date.now()
    const timeTaken = startTime ? (endTime - startTime) / 1000 : 0 // in seconds
    
    const score = {
      round: 2,
      moves: currentActivity === 'eight-puzzle' ? moves : currentActivity === 'jealous-husbands' ? jealousHusbandsState.moves : currentActivity === 'tower-of-hanoi' ? towerOfHanoiState.moves : currentActivity === 'water-jug' ? waterJugState.moves : monkeyBananaState.moves,
      timeTaken: timeTaken,
      completed: gameWon,
      activityType: currentActivity
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
            🎉 Activity Completed! 🎉
          </h1>
          <p style={{ color: '#e2e8f0', marginBottom: '1rem' }}>
            {currentActivity === 'eight-puzzle' 
              ? `Congratulations! You solved the 8-puzzle in ${moves} moves.` 
              : currentActivity === 'jealous-husbands' 
                ? `Congratulations! You solved the Jealous Husbands Problem in ${jealousHusbandsState.moves} moves.`
                : currentActivity === 'tower-of-hanoi' 
                  ? `Congratulations! You solved the Tower of Hanoi in ${towerOfHanoiState.moves} moves.`
                  : currentActivity === 'water-jug' 
                    ? `Congratulations! You solved the Water Jug Problem in ${waterJugState.moves} moves.`
                    : `Congratulations! You solved the Monkey and Banana Problem in ${monkeyBananaState.moves} moves.`}
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
          {/* Activity Selector */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start'
          }}>
            <h1 style={{ 
              color: '#64ffda', 
              margin: 0,
              textShadow: '0 0 8px rgba(100, 255, 218, 0.3)'
            }}>
              Round 2: Select Activity
            </h1>
            <div style={{
              display: 'flex',
              gap: '1rem',
              marginTop: '0.5rem'
            }}>
              <button
                onClick={() => setCurrentActivity('eight-puzzle')}
                style={{
                  backgroundColor: currentActivity === 'eight-puzzle' ? '#4ade80' : '#6b7280',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                8-Puzzle
              </button>
              <button
                onClick={() => setCurrentActivity('jealous-husbands')}
                style={{
                  backgroundColor: currentActivity === 'jealous-husbands' ? '#4ade80' : '#6b7280',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Jealous Husbands
              </button>
              <button
                onClick={() => setCurrentActivity('tower-of-hanoi')}
                style={{
                  backgroundColor: currentActivity === 'tower-of-hanoi' ? '#4ade80' : '#6b7280',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Tower of Hanoi
              </button>
              <button
                onClick={() => setCurrentActivity('water-jug')}
                style={{
                  backgroundColor: currentActivity === 'water-jug' ? '#4ade80' : '#6b7280',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Water Jug Problem
              </button>
              <button
                onClick={() => setCurrentActivity('monkey-banana')}
                style={{
                  backgroundColor: currentActivity === 'monkey-banana' ? '#4ade80' : '#6b7280',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Monkey & Banana
              </button>
            </div>
          </div>
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
              {currentActivity === 'eight-puzzle' 
                ? `Moves: ${moves}` 
                : currentActivity === 'jealous-husbands' 
                  ? `Moves: ${jealousHusbandsState.moves}` 
                  : currentActivity === 'tower-of-hanoi' 
                    ? `Moves: ${towerOfHanoiState.moves}` 
                    : currentActivity === 'water-jug' 
                      ? `Moves: ${waterJugState.moves}` 
                      : `Moves: ${monkeyBananaState.moves}`}
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

        {currentActivity === 'eight-puzzle' ? (
          <div>
            <h2 style={{ color: '#64ffda', marginBottom: '1rem' }}>8-Puzzle Challenge</h2>
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
          </div>
        ) : currentActivity === 'jealous-husbands' ? (
          <div>
            <h2 style={{ color: '#64ffda', marginBottom: '1rem' }}>Jealous Husbands Problem</h2>
            
            {/* Detailed Instructions */}
            <div style={{
              backgroundColor: 'rgba(10, 25, 47, 0.5)',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              border: '1px solid rgba(100, 255, 218, 0.2)'
            }}>
              <h3 style={{ color: '#64ffda', marginBottom: '0.5rem' }}>Instructions:</h3>
              <ul style={{ textAlign: 'left', color: '#e2e8f0', paddingLeft: '1.5rem', margin: 0 }}>
                <li>Three couples (H1/W1, H2/W2, H3/W3) need to cross the river</li>
                <li>The boat can carry at most 2 people at a time</li>
                <li>At no point can a wife be with another husband without her own husband present</li>
                <li>Click on people to add/remove them from the boat</li>
                <li>Click "Cross River" to move the boat to the opposite bank</li>
                <li>Goal: Move all 6 people to the right bank safely</li>
              </ul>
            </div>
            
            <div className="rule-violation-highlight" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
              padding: '0.5rem',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '6px',
              transition: 'background-color 0.3s ease'
            }}>
              <div style={{ color: '#fbbf24', fontWeight: 'bold' }}>
                ⚠️ Rule: A wife cannot be with another husband unless her own husband is present
              </div>
              <div style={{ color: '#e2e8f0' }}>
                Current Boat: {jealousHusbandsState.boatOccupants.length > 0 
                  ? jealousHusbandsState.boatOccupants.join(', ') 
                  : 'Empty'}
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'flex-start',
              gap: '2rem',
              flexWrap: 'wrap',
              marginBottom: '2rem'
            }}>
              {/* Left Side */}
              <div style={{
                flex: '1',
                minWidth: '200px',
                backgroundColor: 'rgba(10, 25, 47, 0.5)',
                padding: '1rem',
                borderRadius: '8px',
                border: '2px solid #64ffda'
              }}>
                <h3 style={{ color: '#64ffda', marginBottom: '1rem' }}>Left Bank</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                  {jealousHusbandsState.leftSide.map((person, index) => (
                    <div
                      key={index}
                      onClick={() => handleJealousHusbandsMove(person)}
                      style={{
                        backgroundColor: jealousHusbandsState.boatOccupants.includes(person) ? '#f59e0b' : '#1e40af',
                        color: 'white',
                        padding: '0.5rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        border: '1px solid rgba(100, 255, 218, 0.3)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {person}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* River and Boat */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  height: '100px',
                  width: '200px',
                  backgroundColor: '#3b82f6',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '2px solid #1d4ed8',
                  borderRadius: '4px',
                  marginBottom: '1rem'
                }}>
                  {/* Boat */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '5px',
                      [jealousHusbandsState.boatPosition]: '10px',
                      width: '40px',
                      height: '20px',
                      backgroundColor: '#8b5cf6',
                      border: '1px solid #7c3aed',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      color: 'white'
                    }}
                  >
                    {jealousHusbandsState.boatOccupants.length > 0 && (
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {jealousHusbandsState.boatOccupants.map((person, i) => (
                          <span key={i}>{person[0]}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={crossRiver}
                  style={{
                    backgroundColor: '#64ffda',
                    color: '#0a192f',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Cross River
                </button>
              </div>
              
              {/* Right Side */}
              <div style={{
                flex: '1',
                minWidth: '200px',
                backgroundColor: 'rgba(10, 25, 47, 0.5)',
                padding: '1rem',
                borderRadius: '8px',
                border: '2px solid #64ffda'
              }}>
                <h3 style={{ color: '#64ffda', marginBottom: '1rem' }}>Right Bank</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                  {jealousHusbandsState.rightSide.map((person, index) => (
                    <div
                      key={index}
                      onClick={() => handleJealousHusbandsMove(person)}
                      style={{
                        backgroundColor: jealousHusbandsState.boatOccupants.includes(person) ? '#f59e0b' : '#1e40af',
                        color: 'white',
                        padding: '0.5rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        border: '1px solid rgba(100, 255, 218, 0.3)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {person}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : currentActivity === 'tower-of-hanoi' ? (
          <div>
            <h2 style={{ color: '#64ffda', marginBottom: '1rem' }}>Tower of Hanoi</h2>
            
            {/* Detailed Instructions */}
            <div style={{
              backgroundColor: 'rgba(10, 25, 47, 0.5)',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              border: '1px solid rgba(100, 255, 218, 0.2)'
            }}>
              <h3 style={{ color: '#64ffda', marginBottom: '0.5rem' }}>Instructions:</h3>
              <ul style={{ textAlign: 'left', color: '#e2e8f0', paddingLeft: '1.5rem', margin: 0 }}>
                <li>Move all disks from the leftmost pole to the rightmost pole</li>
                <li>Only one disk can be moved at a time</li>
                <li>Never place a larger disk on top of a smaller disk</li>
                <li>Click on a pole to select it, then click another pole to move the top disk</li>
                <li>Goal: Move all disks to the rightmost pole in the same order</li>
              </ul>
            </div>
            
            <div className="rule-violation-highlight" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
              padding: '0.5rem',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '6px',
              transition: 'background-color 0.3s ease'
            }}>
              <div style={{ color: '#fbbf24', fontWeight: 'bold' }}>
                ⚠️ Rule: Cannot place a larger disk on a smaller disk
              </div>
              <div style={{ color: '#e2e8f0' }}>
                Selected: {towerOfHanoiState.selectedDisk ? `Disk ${towerOfHanoiState.selectedDisk}` : 'None'}
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'flex-start',
              gap: '2rem',
              flexWrap: 'wrap',
              marginBottom: '2rem'
            }}>
              {towerOfHanoiState.poles.map((pole, poleIndex) => (
                <div 
                  key={poleIndex}
                  onClick={() => handleTowerOfHanoiClick(poleIndex)}
                  style={{
                    flex: '1',
                    minWidth: '150px',
                    backgroundColor: 'rgba(10, 25, 47, 0.5)',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: towerOfHanoiState.selectedPole === poleIndex 
                      ? '3px solid #f59e0b' 
                      : '2px solid #64ffda',
                    cursor: 'pointer',
                    transition: 'border 0.2s ease'
                  }}
                >
                  <h3 style={{ color: '#64ffda', marginBottom: '1rem', textAlign: 'center' }}>
                    Pole {String.fromCharCode(65 + poleIndex)}
                  </h3>
                  
                  {/* Visual representation of disks */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column-reverse',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    height: '200px',
                    border: '1px solid #64ffda',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(30, 58, 95, 0.3)'
                  }}>
                    {pole.map((diskSize, diskIndex) => (
                      <div
                        key={diskIndex}
                        style={{
                          width: `${diskSize * 30}px`,
                          height: '20px',
                          backgroundColor: '#1e40af',
                          border: '1px solid #64ffda',
                          borderRadius: '4px',
                          marginBottom: '2px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.8rem',
                          color: 'white'
                        }}
                      >
                        {diskSize}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : currentActivity === 'water-jug' ? (
          <div>
            <h2 style={{ color: '#64ffda', marginBottom: '1rem' }}>Water Jug Problem</h2>
            
            {/* Detailed Instructions */}
            <div style={{
              backgroundColor: 'rgba(10, 25, 47, 0.5)',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              border: '1px solid rgba(100, 255, 218, 0.2)'
            }}>
              <h3 style={{ color: '#64ffda', marginBottom: '0.5rem' }}>Instructions:</h3>
              <ul style={{ textAlign: 'left', color: '#e2e8f0', paddingLeft: '1.5rem', margin: 0 }}>
                <li>You have two jugs: a 3-gallon jug and a 4-gallon jug</li>
                <li>Goal: Achieve exactly 2 gallons in one of the jugs</li>
                <li>Available operations: Fill a jug, Empty a jug, Pour from one jug to another</li>
                <li>Use the buttons to perform different operations</li>
                <li>Try to achieve the goal in the minimum number of moves</li>
              </ul>
            </div>
            
            <div className="rule-violation-highlight" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
              padding: '0.5rem',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '6px',
              transition: 'background-color 0.3s ease'
            }}>
              <div style={{ color: '#fbbf24', fontWeight: 'bold' }}>
                ⚠️ Goal: Get exactly {waterJugState.targetAmount} gallon(s) in either jug
              </div>
              <div style={{ color: '#e2e8f0' }}>
                Current: Jug 1: {waterJugState.jugs[0]}gal | Jug 2: {waterJugState.jugs[1]}gal
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '2rem',
              marginBottom: '2rem'
            }}>
              {/* Jug 1 - 3 gallon */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div style={{
                  width: '80px',
                  height: `${Math.max(100, (waterJugState.jugs[0] / waterJugState.capacities[0]) * 200)}px`,
                  backgroundColor: waterJugState.jugs[0] > 0 ? '#3b82f6' : '#4b5563',
                  border: '2px solid #64ffda',
                  borderBottom: '4px solid #64ffda',
                  borderTop: 'none',
                  position: 'relative',
                  marginBottom: '0.5rem'
                }}>
                  {/* Water level indicator */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    height: `${(waterJugState.jugs[0] / waterJugState.capacities[0]) * 100}%`,
                    backgroundColor: waterJugState.jugs[0] > 0 ? 'rgba(59, 130, 246, 0.8)' : 'transparent',
                    transition: 'height 0.3s ease'
                  }} />
                </div>
                <div style={{ color: '#e2e8f0', fontWeight: 'bold' }}>Jug 1<br/>({waterJugState.jugs[0]}/{waterJugState.capacities[0]} gal)</div>
              </div>
              
              {/* Operations */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                alignItems: 'center'
              }}>
                <button
                  onClick={() => fillJug(0)}
                  style={{
                    backgroundColor: '#64ffda',
                    color: '#0a192f',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}
                >
                  Fill Jug 1
                </button>
                <button
                  onClick={() => emptyJug(0)}
                  style={{
                    backgroundColor: '#f87171',
                    color: '#0a192f',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}
                >
                  Empty Jug 1
                </button>
                <button
                  onClick={() => pourFromTo(0, 1)}
                  style={{
                    backgroundColor: '#a78bfa',
                    color: '#0a192f',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}
                >
                  Pour 1→2
                </button>
              </div>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{ color: '#e2e8f0', fontWeight: 'bold' }}>Operations</div>
                <div style={{ color: '#64ffda' }}>↔</div>
              </div>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                alignItems: 'center'
              }}>
                <button
                  onClick={() => pourFromTo(1, 0)}
                  style={{
                    backgroundColor: '#a78bfa',
                    color: '#0a192f',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}
                >
                  Pour 2→1
                </button>
                <button
                  onClick={() => emptyJug(1)}
                  style={{
                    backgroundColor: '#f87171',
                    color: '#0a192f',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}
                >
                  Empty Jug 2
                </button>
                <button
                  onClick={() => fillJug(1)}
                  style={{
                    backgroundColor: '#64ffda',
                    color: '#0a192f',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}
                >
                  Fill Jug 2
                </button>
              </div>
              
              {/* Jug 2 - 4 gallon */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div style={{
                  width: '100px',
                  height: `${Math.max(100, (waterJugState.jugs[1] / waterJugState.capacities[1]) * 200)}px`,
                  backgroundColor: waterJugState.jugs[1] > 0 ? '#3b82f6' : '#4b5563',
                  border: '2px solid #64ffda',
                  borderBottom: '4px solid #64ffda',
                  borderTop: 'none',
                  position: 'relative',
                  marginBottom: '0.5rem'
                }}>
                  {/* Water level indicator */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    height: `${(waterJugState.jugs[1] / waterJugState.capacities[1]) * 100}%`,
                    backgroundColor: waterJugState.jugs[1] > 0 ? 'rgba(59, 130, 246, 0.8)' : 'transparent',
                    transition: 'height 0.3s ease'
                  }} />
                </div>
                <div style={{ color: '#e2e8f0', fontWeight: 'bold' }}>Jug 2<br/>({waterJugState.jugs[1]}/{waterJugState.capacities[1]} gal)</div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h2 style={{ color: '#64ffda', marginBottom: '1rem' }}>Monkey and Banana Problem</h2>
            
            {/* Detailed Instructions */}
            <div style={{
              backgroundColor: 'rgba(10, 25, 47, 0.5)',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              border: '1px solid rgba(100, 255, 218, 0.2)'
            }}>
              <h3 style={{ color: '#64ffda', marginBottom: '0.5rem' }}>Instructions:</h3>
              <ul style={{ textAlign: 'left', color: '#e2e8f0', paddingLeft: '1.5rem', margin: 0 }}>
                <li>A monkey is in a room with bananas hanging from the ceiling, too high to reach</li>
                <li>There is a box in the corner that the monkey can use</li>
                <li>Goal: Move the box under the bananas and climb it to grab the bananas</li>
                <li>Plan your moves strategically: move monkey, move box, climb box, grab banana</li>
              </ul>
            </div>
            
            <div className="rule-violation-highlight" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
              padding: '0.5rem',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '6px',
              transition: 'background-color 0.3s ease'
            }}>
              <div style={{ color: '#fbbf24', fontWeight: 'bold' }}>
                ⚠️ Goal: Get the banana by moving the box under it and climbing
              </div>
              <div style={{ color: '#e2e8f0' }}>
                Status: {monkeyBananaState.hasBanana ? 'SUCCESS!' : 'In Progress'}
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'flex-start',
              gap: '2rem',
              flexWrap: 'wrap',
              marginBottom: '2rem'
            }}>
              {/* Room Visualization */}
              <div style={{
                flex: '1',
                minWidth: '250px',
                backgroundColor: 'rgba(10, 25, 47, 0.5)',
                padding: '1rem',
                borderRadius: '8px',
                border: '2px solid #64ffda',
                position: 'relative',
                height: '300px'
              }}>
                <h3 style={{ color: '#64ffda', marginBottom: '1rem', textAlign: 'center' }}>Room Layout</h3>
                
                {/* Banana at ceiling - centered in the room */}
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '2rem',
                  zIndex: monkeyBananaState.hasBanana ? -1 : 5,
                  color: '#fbbf24'
                }}>
                  {monkeyBananaState.hasBanana ? '🟢' : '🍌'}
                </div>
                
                {/* Under banana position */}
                <div style={{
                  position: 'absolute',
                  top: '60px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60px',
                  height: '5px',
                  backgroundColor: '#64ffda',
                  borderRadius: '2px',
                  zIndex: 2
                }}>
                  <div style={{ fontSize: '0.7rem', textAlign: 'center', color: '#64ffda' }}>Under Banana</div>
                </div>
                
                {/* Box */}
                <div 
                  style={{
                    position: 'absolute',
                    top: '200px',
                    [monkeyBananaState.boxPosition === 'corner' ? 'left' : 'right']: '40px',
                    width: '50px',
                    height: '50px',
                    backgroundColor: monkeyBananaState.holdingBox ? '#f59e0b' : '#8b5cf6',
                    border: '2px solid #a78bfa',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                >
                  📦
                </div>
                
                {/* Monkey */}
                <div 
                  style={{
                    position: 'absolute',
                    top: monkeyBananaState.onBox ? '140px' : '220px',
                    [monkeyBananaState.monkeyPosition === 'corner' ? 'left' : 
                     monkeyBananaState.monkeyPosition === 'under-banana' ? 'right' : 
                     monkeyBananaState.monkeyPosition === 'box' ? 'left' : 'left']: '80px',
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#fbbf24',
                    border: '2px solid #f59e0b',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0a192f',
                    fontWeight: 'bold',
                    zIndex: 10
                  }}
                >
                  {monkeyBananaState.hasBanana ? '🐵🍌' : '🐵'}
                </div>
                
                {/* Positions labels */}
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '20px',
                  fontSize: '0.8rem',
                  color: '#e2e8f0'
                }}>
                  Corner
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '20px',
                  fontSize: '0.8rem',
                  color: '#e2e8f0'
                }}>
                  Under Banana
                </div>
              </div>
              
              {/* Action Panel */}
              <div style={{
                flex: '0 0',
                width: '250px',
                backgroundColor: 'rgba(10, 25, 47, 0.5)',
                padding: '1rem',
                borderRadius: '8px',
                border: '2px solid #64ffda'
              }}>
                <h3 style={{ color: '#64ffda', marginBottom: '1rem', textAlign: 'center' }}>Actions</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button
                    onClick={() => moveMonkey('corner')}
                    disabled={monkeyBananaState.monkeyPosition === 'corner'}
                    style={{
                      backgroundColor: monkeyBananaState.monkeyPosition === 'corner' ? '#4b5563' : '#64ffda',
                      color: '#0a192f',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      cursor: monkeyBananaState.monkeyPosition === 'corner' ? 'not-allowed' : 'pointer',
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                      opacity: monkeyBananaState.monkeyPosition === 'corner' ? 0.6 : 1
                    }}
                  >
                    Move to Corner
                  </button>
                  
                  <button
                    onClick={() => moveMonkey('under-banana')}
                    disabled={monkeyBananaState.monkeyPosition === 'under-banana'}
                    style={{
                      backgroundColor: monkeyBananaState.monkeyPosition === 'under-banana' ? '#4b5563' : '#64ffda',
                      color: '#0a192f',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      cursor: monkeyBananaState.monkeyPosition === 'under-banana' ? 'not-allowed' : 'pointer',
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                      opacity: monkeyBananaState.monkeyPosition === 'under-banana' ? 0.6 : 1
                    }}
                  >
                    Move Under Banana
                  </button>
                  
                  <button
                    onClick={grabBox}
                    disabled={monkeyBananaState.holdingBox || 
                              monkeyBananaState.monkeyPosition !== monkeyBananaState.boxPosition}
                    style={{
                      backgroundColor: (monkeyBananaState.holdingBox || 
                                monkeyBananaState.monkeyPosition !== monkeyBananaState.boxPosition) ? '#4b5563' : '#a78bfa',
                      color: '#0a192f',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      cursor: (monkeyBananaState.holdingBox || 
                               monkeyBananaState.monkeyPosition !== monkeyBananaState.boxPosition) ? 'not-allowed' : 'pointer',
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                      opacity: (monkeyBananaState.holdingBox || 
                                monkeyBananaState.monkeyPosition !== monkeyBananaState.boxPosition) ? 0.6 : 1
                    }}
                  >
                    Grab Box
                  </button>
                  
                  <button
                    onClick={releaseBox}
                    disabled={!monkeyBananaState.holdingBox}
                    style={{
                      backgroundColor: !monkeyBananaState.holdingBox ? '#4b5563' : '#f87171',
                      color: '#0a192f',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      cursor: !monkeyBananaState.holdingBox ? 'not-allowed' : 'pointer',
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                      opacity: !monkeyBananaState.holdingBox ? 0.6 : 1
                    }}
                  >
                    Release Box
                  </button>
                  
                  <button
                    onClick={climbOnBox}
                    disabled={monkeyBananaState.monkeyPosition !== monkeyBananaState.boxPosition || 
                              monkeyBananaState.boxPosition !== 'under-banana' || 
                              monkeyBananaState.onBox}
                    style={{
                      backgroundColor: (monkeyBananaState.monkeyPosition !== monkeyBananaState.boxPosition || 
                                monkeyBananaState.boxPosition !== 'under-banana' || 
                                monkeyBananaState.onBox) ? '#4b5563' : '#fbbf24',
                      color: '#0a192f',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      cursor: (monkeyBananaState.monkeyPosition !== monkeyBananaState.boxPosition || 
                               monkeyBananaState.boxPosition !== 'under-banana' || 
                               monkeyBananaState.onBox) ? 'not-allowed' : 'pointer',
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                      opacity: (monkeyBananaState.monkeyPosition !== monkeyBananaState.boxPosition || 
                                monkeyBananaState.boxPosition !== 'under-banana' || 
                                monkeyBananaState.onBox) ? 0.6 : 1
                    }}
                  >
                    Climb on Box
                  </button>
                  
                  <button
                    onClick={grabBanana}
                    disabled={!monkeyBananaState.onBox || 
                              monkeyBananaState.boxPosition !== 'under-banana' || 
                              monkeyBananaState.hasBanana}
                    style={{
                      backgroundColor: (!monkeyBananaState.onBox || 
                                monkeyBananaState.boxPosition !== 'under-banana' || 
                                monkeyBananaState.hasBanana) ? '#4b5563' : '#4ade80',
                      color: '#0a192f',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      cursor: (!monkeyBananaState.onBox || 
                               monkeyBananaState.boxPosition !== 'under-banana' || 
                               monkeyBananaState.hasBanana) ? 'not-allowed' : 'pointer',
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                      opacity: (!monkeyBananaState.onBox || 
                                monkeyBananaState.boxPosition !== 'under-banana' || 
                                monkeyBananaState.hasBanana) ? 0.6 : 1
                    }}
                  >
                    Grab Banana!
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginTop: '2rem'
        }}>
          <button
            onClick={() => {
              if (currentActivity === 'eight-puzzle') {
                const initialPuzzle = shufflePuzzle(createInitialPuzzle())
                setPuzzle(initialPuzzle)
                setMoves(0)
                setGameStarted(false)
                setStartTime(null)
                setGameWon(false)
              } else if (currentActivity === 'jealous-husbands') {
                resetJealousHusbands();
                setGameStarted(false);
                setStartTime(null);
                setGameWon(false);
              } else if (currentActivity === 'tower-of-hanoi') {
                resetTowerOfHanoi();
                setGameStarted(false);
                setStartTime(null);
                setGameWon(false);
              } else if (currentActivity === 'water-jug') {
                resetWaterJug();
                setGameStarted(false);
                setStartTime(null);
                setGameWon(false);
              } else {
                resetMonkeyBanana();
                setGameStarted(false);
                setStartTime(null);
                setGameWon(false);
              }
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
            {currentActivity === 'eight-puzzle' ? 'Reset Puzzle' : currentActivity === 'jealous-husbands' ? 'Reset Game' : currentActivity === 'tower-of-hanoi' ? 'Reset Game' : currentActivity === 'water-jug' ? 'Reset Game' : 'Reset Game'}
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
          {currentActivity === 'eight-puzzle' ? (
            <>
              <p>Click on a tile adjacent to the empty space to move it.</p>
              <p>Solve the puzzle by arranging tiles in numerical order.</p>
            </>
          ) : (
            <>
              <p>Click on people to add/remove them from the boat. Click "Cross River" to move the boat.</p>
              <p>Goal: Get all six people across the river safely.</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Round2