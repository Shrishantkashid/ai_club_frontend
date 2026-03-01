import React, { useState, useEffect } from 'react';

const JealousHusbands = ({ onPuzzleComplete }) => {
  // Initial state: 3 husbands (H1, H2, H3) and 3 wives (W1, W2, W3) on left bank
  const initialState = {
    leftBank: ['H1', 'W1', 'H2', 'W2', 'H3', 'W3'],
    rightBank: [],
    boatPosition: 'left', // 'left' or 'right'
    moves: 0,
    gameOver: false,
    gameWon: false
  };

  const [state, setState] = useState(initialState);
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [message, setMessage] = useState('Help the three couples cross the river. Remember: a wife cannot be with another husband unless her own husband is present.');

  // Check if the game is won (all people on right bank)
  const checkWinCondition = (currentLeftBank, currentRightBank) => {
    return currentLeftBank.length === 0 && currentRightBank.length === 6;
  };

  // Check if the state is valid (no wife left alone with another husband)
  const isValidState = (bank) => {
    // Count husbands and wives on the bank
    const husbands = bank.filter(person => person.startsWith('H')).length;
    const wives = bank.filter(person => person.startsWith('W')).length;
    
    // If no husbands, it's always valid
    if (husbands === 0) return true;
    
    // If number of wives > number of husbands, it's invalid
    if (wives > husbands) return false;
    
    // If number of wives <= number of husbands, check if all wives have their husbands
    for (let i = 1; i <= 3; i++) {
      const wife = `W${i}`;
      const husband = `H${i}`;
      
      // If wife is present but husband is not, it's invalid
      if (bank.includes(wife) && !bank.includes(husband)) {
        return false;
      }
    }
    
    return true;
  };

  // Check if the current state is valid (both banks)
  const isCurrentStateValid = (leftBank, rightBank) => {
    return isValidState(leftBank) && isValidState(rightBank);
  };

  // Move people from one bank to another
  const movePeople = () => {
    if (selectedPeople.length === 0 || selectedPeople.length > 2) {
      setMessage('Please select 1 or 2 people to move.');
      return;
    }

    const newState = { ...state };
    let newLeftBank = [...state.leftBank];
    let newRightBank = [...state.rightBank];
    
    if (state.boatPosition === 'left') {
      // Moving from left to right
      selectedPeople.forEach(person => {
        newLeftBank = newLeftBank.filter(p => p !== person);
        newRightBank.push(person);
      });
    } else {
      // Moving from right to left
      selectedPeople.forEach(person => {
        newRightBank = newRightBank.filter(p => p !== person);
        newLeftBank.push(person);
      });
    }

    // Check validity of the new state
    if (!isCurrentStateValid(newLeftBank, newRightBank)) {
      setMessage('Invalid move! A wife cannot be with another husband without her own husband present.');
      return;
    }

    // Update state
    newState.leftBank = newLeftBank;
    newState.rightBank = newRightBank;
    newState.boatPosition = state.boatPosition === 'left' ? 'right' : 'left';
    newState.moves += 1;
    setSelectedPeople([]);

    // Check win condition
    if (checkWinCondition(newLeftBank, newRightBank)) {
      newState.gameWon = true;
      newState.gameOver = true;
      setMessage('Congratulations! All couples have crossed safely!');
      if (onPuzzleComplete) {
        onPuzzleComplete(newState.moves);
      }
    } else {
      setMessage(`Moved ${selectedPeople.join(', ')} to the ${state.boatPosition === 'left' ? 'right' : 'left'} bank. Moves: ${newState.moves}`);
    }

    setState(newState);
  };

  // Reset the game
  const resetGame = () => {
    setState(initialState);
    setSelectedPeople([]);
    setMessage('Game reset. Help the three couples cross the river. Remember: a wife cannot be with another husband unless her own husband is present.');
  };

  // Toggle person selection
  const togglePersonSelection = (person) => {
    if (state.boatPosition === 'left' && !state.leftBank.includes(person)) return;
    if (state.boatPosition === 'right' && !state.rightBank.includes(person)) return;

    if (selectedPeople.includes(person)) {
      setSelectedPeople(selectedPeople.filter(p => p !== person));
    } else if (selectedPeople.length < 2) {
      setSelectedPeople([...selectedPeople, person]);
    }
  };

  // Render a bank with people
  const renderBank = (people, bankName, isBoatHere) => {
    return (
      <div style={{
        flex: 1,
        padding: '20px',
        border: '2px solid #4ade80',
        borderRadius: '10px',
        backgroundColor: 'rgba(30, 58, 95, 0.6)',
        position: 'relative'
      }}>
        <h3 style={{ color: '#64ffda', textAlign: 'center', marginBottom: '15px' }}>
          {bankName} Bank {isBoatHere && '(Boat Here)'}
        </h3>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '10px',
          minHeight: '60px'
        }}>
          {people.map((person, index) => {
            const isHusband = person.startsWith('H');
            const isSelected = selectedPeople.includes(person);
            
            return (
              <div
                key={index}
                onClick={() => togglePersonSelection(person)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '5px',
                  backgroundColor: isHusband 
                    ? (isSelected ? '#ef4444' : '#dc2626') 
                    : (isSelected ? '#3b82f6' : '#2563eb'),
                  color: 'white',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  border: isSelected ? '2px solid #fbbf24' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                {person}
              </div>
            );
          })}
          {people.length === 0 && (
            <div style={{ color: '#94a3b8', fontStyle: 'italic' }}>
              No one here
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto',
      color: '#e2e8f0',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ 
        color: '#64ffda', 
        textAlign: 'center', 
        marginBottom: '20px',
        textShadow: '0 0 8px rgba(100, 255, 218, 0.3)'
      }}>
        Jealous Husbands Problem
      </h1>
      
      <div style={{ 
        backgroundColor: 'rgba(10, 25, 47, 0.5)', 
        padding: '15px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <p style={{ margin: '10px 0', fontSize: '1.1rem' }}>
          <strong>Moves:</strong> {state.moves} | 
          <strong> Boat Position:</strong> {state.boatPosition}
        </p>
        <p style={{ margin: '10px 0', color: '#fbbf24', fontWeight: 'bold' }}>
          {message}
        </p>
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        gap: '20px',
        marginBottom: '20px'
      }}>
        {renderBank(state.leftBank, 'Left', state.boatPosition === 'left')}
        
        {/* River */}
        <div style={{
          width: '100px',
          textAlign: 'center',
          fontSize: '2rem'
        }}>
          🌊 RIVER 🌊
          <div style={{ marginTop: '20px', fontSize: '1.2rem' }}>
            ⛵
          </div>
        </div>
        
        {renderBank(state.rightBank, 'Right', state.boatPosition === 'right')}
      </div>

      <div style={{ 
        textAlign: 'center', 
        marginBottom: '20px',
        padding: '10px',
        backgroundColor: 'rgba(30, 58, 95, 0.4)',
        borderRadius: '8px'
      }}>
        <p>Select 1 or 2 people to move with the boat:</p>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          flexWrap: 'wrap',
          margin: '10px 0'
        }}>
          {selectedPeople.map((person, index) => (
            <span 
              key={index}
              style={{
                padding: '5px 10px',
                backgroundColor: '#f59e0b',
                color: '#0a192f',
                borderRadius: '5px',
                fontWeight: 'bold'
              }}
            >
              {person}
            </span>
          ))}
          {selectedPeople.length === 0 && (
            <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>None selected</span>
          )}
        </div>
        
        <button
          onClick={movePeople}
          disabled={selectedPeople.length === 0}
          style={{
            backgroundColor: selectedPeople.length > 0 ? '#4ade80' : '#6b7280',
            color: '#0a192f',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: selectedPeople.length > 0 ? 'pointer' : 'not-allowed',
            fontWeight: 'bold',
            fontSize: '1rem',
            margin: '0 10px'
          }}
        >
          Move Selected People
        </button>
        
        <button
          onClick={resetGame}
          style={{
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1rem'
          }}
        >
          Reset Game
        </button>
      </div>

      {state.gameWon && (
        <div style={{
          textAlign: 'center',
          padding: '20px',
          backgroundColor: 'rgba(74, 222, 128, 0.2)',
          borderRadius: '10px',
          border: '2px solid #4ade80'
        }}>
          <h2 style={{ color: '#4ade80' }}>🎉 Puzzle Solved! 🎉</h2>
          <p>You solved the Jealous Husbands problem in {state.moves} moves!</p>
        </div>
      )}

      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: 'rgba(30, 58, 95, 0.4)',
        borderRadius: '8px',
        fontSize: '0.9rem'
      }}>
        <h3 style={{ color: '#64ffda', textAlign: 'center', marginBottom: '10px' }}>Rules:</h3>
        <ul style={{ textAlign: 'left', paddingLeft: '20px' }}>
          <li>The boat can carry at most 2 people</li>
          <li>A wife cannot be left alone with another husband unless her own husband is present</li>
          <li>All six people must cross to the right bank</li>
          <li>Click on people to select them, then click "Move Selected People"</li>
        </ul>
      </div>
    </div>
  );
};

export default JealousHusbands;