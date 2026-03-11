import React, { useState, useEffect } from 'react'
import API from '../utils/api'

const Sem2Round3 = ({ onProceedToLeaderboard, onRestartContest }) => {
  const [currentTask, setCurrentTask] = useState(0)
  const [taskAnswers, setTaskAnswers] = useState([])
  const [riddleAnswers, setRiddleAnswers] = useState([])
  const [escapeKey, setEscapeKey] = useState(['_', '_', '_', '_'])
  const [startTime, setStartTime] = useState(null)
  const [userInput, setUserInput] = useState('')
  const [showRiddle, setShowRiddle] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [contestCompleted, setContestCompleted] = useState(false)

  // Fixed tasks (no randomization as per requirements)
  const tasks = [
    {
      type: 'debug',
      title: 'C Debug Challenge',
      description: 'Find the missing character:',
      content: 'int main( {\n  return 0;\n}',
      solution: ')',
      riddle: {
        question: "I speak without a mouth. What am I?",
        answer: 'ECHO',
        keyLetter: 'E'
      }
    },
    {
      type: 'decode',
      title: 'Decryption Challenge',
      description: 'Decode this (Caesar shift +3):',
      content: 'KHOOR',
      solution: 'HELLO',
      riddle: {
        question: "What has keys but no locks?",
        answer: 'PIANO',
        keyLetter: 'S'
      }
    },
    {
      type: 'logic',
      title: 'Number Sequence',
      description: 'Complete the sequence:',
      content: '2, 4, 6, 8, ?',
      solution: '10',
      riddle: {
        question: "The more you take, the more you leave behind. What am I?",
        answer: 'FOOTSTEPS',
        keyLetter: 'C'
      }
    },
    {
      type: 'pattern',
      title: 'Letter Pattern',
      description: 'What comes next?',
      content: 'A, C, E, G, ?',
      solution: 'I',
      riddle: {
        question: "What has hands but cannot clap?",
        answer: 'CLOCK',
        keyLetter: 'A'
      }
    }
  ]

  useEffect(() => {
    setStartTime(new Date())
  }, [])

  const handleTaskSubmit = async () => {
    const currentTaskData = tasks[currentTask]
    
    if (userInput.trim().toUpperCase() === currentTaskData.solution.toUpperCase()) {
      // Submit task answer to backend
      try {
        const token = localStorage.getItem('token')
        await fetch(API.SEM2_ROUND3_TASK_SUBMIT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            taskType: currentTaskData.type,
            taskNumber: currentTask,
            userAnswer: userInput,
            isCorrect: true
          })
        })
      } catch (error) {
        console.error('Task submit error:', error)
      }
      
      // Correct - show riddle
      setShowRiddle(true)
      setFeedback('Correct! Now solve the riddle.')
    } else {
      setFeedback('Incorrect. Try again.')
    }
  }

  const handleRiddleSubmit = async () => {
    const currentTaskData = tasks[currentTask]
    
    if (userInput.trim().toUpperCase() === currentTaskData.riddle.answer.toUpperCase()) {
      // Correct - collect key letter
      const newKey = [...escapeKey]
      newKey[currentTask] = currentTaskData.riddle.keyLetter
      setEscapeKey(newKey)
      
      setFeedback(`Correct! Key letter: ${currentTaskData.riddle.keyLetter}`)
      
      // Save to backend
      try {
        const token = localStorage.getItem('token')
        await fetch(API.SEM2_ROUND3_RIDDLE_SUBMIT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            riddleQuestion: currentTaskData.riddle.question,
            userAnswer: userInput,
            isCorrect: true,
            keyLetter: currentTaskData.riddle.keyLetter
          })
        })
      } catch (error) {
        console.error('Riddle submit error:', error)
      }
      
      // Move to next task
      setTimeout(() => {
        if (currentTask < tasks.length - 1) {
          setCurrentTask(prev => prev + 1)
          setShowRiddle(false)
          setUserInput('')
          setFeedback('')
        } else {
          // All tasks complete
          handleSubmitRound()
        }
      }, 2000)
    } else {
      setFeedback('Incorrect riddle answer. Try again.')
    }
  }

  const handleSubmitRound = async () => {
    try {
      const token = localStorage.getItem('token')
      const endTime = new Date()
      const timeTaken = Math.floor((endTime - startTime) / 1000)
      
      await fetch(API.SEM2_ROUND3_SUBMIT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          endTime,
          escapeKey: escapeKey.join(''),
          totalTime: timeTaken,
          isFinalSubmission: true
        })
      })
      
      // Mark contest as completed and show options
      setContestCompleted(true)
    } catch (error) {
      // Silent error - no console log to avoid fullscreen exit
      setContestCompleted(true)
    }
  }

  // Handle viewing leaderboard
  const handleViewLeaderboard = () => {
    onProceedToLeaderboard()
  }

  // Handle restarting contest
  const handleRestartContest = () => {
    // Clear contest state from localStorage
    localStorage.removeItem('sem2_contest_started')
    localStorage.removeItem('sem2_contest_start_time')
    localStorage.removeItem('sem2_round1_completed')
    localStorage.removeItem('sem2_round2_completed')
    localStorage.removeItem('sem2_round3_completed')
    
    // Call parent handler to restart
    onRestartContest()
  }

  const currentTaskData = tasks[currentTask]
  const isMobile = window.innerWidth <= 768

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      textAlign: 'center'
    }}>
      {contestCompleted ? (
        <div style={{
          marginTop: '3rem',
          padding: '3rem',
          background: 'linear-gradient(135deg, rgba(10, 25, 47, 0.9), rgba(30, 40, 60, 0.9))',
          borderRadius: '20px',
          border: '2px solid #64ffda',
          boxShadow: '0 20px 60px rgba(100, 255, 218, 0.3)'
        }}>
          <h1 style={{
            fontSize: '3rem',
            color: '#64ffda',
            marginBottom: '1rem',
            textShadow: '0 0 20px rgba(100, 255, 218, 0.5)'
          }}>
            🎉 Contest Completed! 🎉
          </h1>
          
          <p style={{
            fontSize: '1.2rem',
            color: '#e2e8f0',
            marginBottom: '2rem',
            lineHeight: 1.6
          }}>
            Congratulations! You have successfully completed the Mind vs Machine Semester 2 contest.
          </p>
          
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '1.5rem',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '2rem'
          }}>
            <button
              onClick={handleViewLeaderboard}
              style={{
                padding: '1rem 2.5rem',
                fontSize: '1.1rem',
                backgroundColor: '#64ffda',
                color: '#0a192f',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(100, 255, 218, 0.4)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px)'
                e.target.style.boxShadow = '0 6px 20px rgba(100, 255, 218, 0.6)'
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = '0 4px 15px rgba(100, 255, 218, 0.4)'
              }}
            >
              🏆 View Leaderboard
            </button>
            
            <button
              onClick={handleRestartContest}
              style={{
                padding: '1rem 2.5rem',
                fontSize: '1.1rem',
                backgroundColor: 'transparent',
                color: '#64ffda',
                border: '2px solid #64ffda',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(100, 255, 218, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(100, 255, 218, 0.1)'
                e.target.style.transform = 'translateY(-3px)'
                e.target.style.boxShadow = '0 6px 20px rgba(100, 255, 218, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent'
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = '0 4px 15px rgba(100, 255, 218, 0.2)'
              }}
            >
              🔄 Attempt Again
            </button>
          </div>
          
          <p style={{
            marginTop: '2rem',
            fontSize: '0.9rem',
            color: '#94a3b8',
            fontStyle: 'italic'
          }}>
            Note: If you attempt again, your previous scores will be replaced.
          </p>
        </div>
      ) : (
        <div style={{
        backgroundColor: 'rgba(30, 58, 95, 0.6)',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(30, 58, 95, 0.3)',
        border: '1px solid rgba(100, 255, 218, 0.2)',
        backdropFilter: 'blur(4px)'
      }}>
        <h1 style={{ color: '#64ffda', marginBottom: '1rem' }}>
          Round 3 - Final Challenge
        </h1>
        
        <p style={{ color: '#e2e8f0', marginBottom: '2rem' }}>
          Complete all 4 tasks to escape! Each task gives you a letter for the escape key.
        </p>

        {/* Task Progress */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {tasks.map((task, index) => (
            <div
              key={index}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: index < currentTask ? '#4ade80' : index === currentTask ? '#64ffda' : 'rgba(100, 255, 218, 0.2)',
                border: '2px solid #64ffda',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: index <= currentTask ? '#0a192f' : '#64ffda',
                fontWeight: 'bold'
              }}
            >
              {index < currentTask ? '✓' : index + 1}
            </div>
          ))}
        </div>

        {/* Escape Key Display */}
        <div style={{
          backgroundColor: 'rgba(10, 25, 47, 0.5)',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem'
        }}>
          <span style={{ color: '#fbbf24', fontSize: '1.2rem', fontWeight: 'bold' }}>
            Escape Key: 
          </span>
          <span style={{ color: '#fbbf24', fontSize: '1.5rem', marginLeft: '1rem', fontFamily: 'monospace' }}>
            {escapeKey.join(' - ')}
          </span>
        </div>

        {/* Task Content */}
        <div style={{
          backgroundColor: 'rgba(10, 25, 47, 0.5)',
          padding: '2rem',
          borderRadius: '8px',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: '#fbbf24', marginBottom: '0.5rem' }}>
            {currentTaskData.title}
          </h2>
          <p style={{ color: '#e2e8f0', marginBottom: '1rem' }}>
            {currentTaskData.description}
          </p>
          
          <div style={{
            backgroundColor: '#1f2937',
            padding: '1.5rem',
            borderRadius: '8px',
            fontFamily: 'monospace',
            color: '#d1d5db',
            marginBottom: '1.5rem',
            textAlign: 'left'
          }}>
            <pre style={{ margin: 0 }}>{currentTaskData.content}</pre>
          </div>

          {!showRiddle ? (
            <>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Enter your answer..."
                style={{
                  padding: '0.75rem 1rem',
                  fontSize: '1rem',
                  borderRadius: '8px',
                  border: '2px solid #64ffda',
                  backgroundColor: 'rgba(10, 25, 47, 0.8)',
                  color: '#e2e8f0',
                  width: '300px',
                  outline: 'none',
                  marginBottom: '1rem'
                }}
              />
              <br/>
              <button
                onClick={handleTaskSubmit}
                style={{
                  backgroundColor: '#64ffda',
                  color: '#0a192f',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Submit Answer
              </button>
            </>
          ) : (
            <>
              <div style={{
                backgroundColor: 'rgba(251, 191, 36, 0.1)',
                padding: '1.5rem',
                borderRadius: '8px',
                border: '2px solid #fbbf24',
                marginBottom: '1rem'
              }}>
                <h3 style={{ color: '#fbbf24', marginBottom: '1rem' }}>RIDDLE CHALLENGE</h3>
                <p style={{ color: '#e2e8f0', fontSize: '1.1rem' }}>
                  {currentTaskData.riddle.question}
                </p>
              </div>
              
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Enter riddle answer..."
                style={{
                  padding: '0.75rem 1rem',
                  fontSize: '1rem',
                  borderRadius: '8px',
                  border: '2px solid #fbbf24',
                  backgroundColor: 'rgba(10, 25, 47, 0.8)',
                  color: '#e2e8f0',
                  width: '300px',
                  outline: 'none',
                  marginBottom: '1rem'
                }}
              />
              <br/>
              <button
                onClick={handleRiddleSubmit}
                style={{
                  backgroundColor: '#fbbf24',
                  color: '#0a192f',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Solve Riddle
              </button>
            </>
          )}

          {feedback && (
            <p style={{
              color: feedback.includes('Correct') ? '#4ade80' : '#f87171',
              fontWeight: 'bold',
              marginTop: '1rem'
            }}>
              {feedback}
            </p>
          )}
        </div>

        <div style={{
          color: '#94a3b8',
          fontSize: '0.9rem',
          marginTop: '2rem'
        }}>
          <p>Solve each task, then answer the riddle to collect a key letter.</p>
          <p>Collect all 4 letters to form the escape key!</p>
        </div>
      </div>
      )}
    </div>
  )
}

export default Sem2Round3