import { useState, useEffect } from 'react'
import Navigation from './components/Navigation'
import Home from './sections/Home'
import OfficeBearers from './sections/OfficeBearers'
import Faculty from './sections/Faculty'
import Activities from './sections/Activities'
import ActivityCard from './pages/ActivityCard'
import Instructions from './pages/Instructions'
import Login from './pages/Login'
import Round1 from './pages/Round1'
import Round2 from './pages/Round2'
import Round3 from './pages/Round3'
import Leaderboard from './pages/Leaderboard'

function App() {
  const [activeSection, setActiveSection] = useState('home')
  const [contestState, setContestState] = useState('activity-card') // activity-card, instructions, login, round1, round2, round3, leaderboard
  const [currentUser, setCurrentUser] = useState(null)
  const [showContest, setShowContest] = useState(false)

  // Handle hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '')
      if (hash === 'contest') {
        setShowContest(true)
        setContestState('activity-card')
      } else if (hash.startsWith('contest/')) {
        setShowContest(true)
        setContestState(hash.split('/')[1])
      } else {
        setShowContest(false)
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    handleHashChange() // Initial check

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  // Function to navigate to contest
  const navigateToContest = () => {
    // Always go to contest start - backend will validate if user has already attempted
    window.location.hash = '#/contest';
    setShowContest(true);
    setContestState('activity-card');
  }

  // Function to logout
  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    // Note: userAttempts is preserved to maintain contest completion status
    
    // Reset state
    setCurrentUser(null);
    setShowContest(false);
    setContestState('activity-card');
    setActiveSection('home');
    
    // Clear hash
    window.location.hash = '';
  }

  const renderSection = () => {
    if (showContest) {
      switch (contestState) {
        case 'instructions':
          return <Instructions onProceed={() => setContestState('login')} />
        case 'login':
          return <Login 
            onLoginSuccess={(user) => {
              try {
                setCurrentUser(user)
                
                // The server already verified this user hasn't attempted
                // Store user info locally
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                setContestState('round1')
              } catch (error) {
                console.error('Error during login success handling:', error);
                // Optionally show an error message to the user
              }
            }}
            onBack={() => setContestState('instructions')}
          />
        case 'round1':
          return <Round1 onCompleteRound1={() => setContestState('round2')} />
        case 'round2':
          return <Round2 onCompleteRound2={() => setContestState('round3')} />
        case 'round3':
          return <Round3 onProceedToLeaderboard={() => {
            setContestState('leaderboard')
          }} />
        case 'leaderboard':
          return <Leaderboard onBackToHome={() => {
            setShowContest(false);
            setActiveSection('home');
            window.location.hash = '';
          }} />
        default:
          return <ActivityCard onStartContest={() => setContestState('instructions')} />
      }
    }
    
    switch (activeSection) {
      case 'home':
        return <Home />
      case 'office-bearers':
        return <OfficeBearers />
      case 'faculty':
        return <Faculty />
      case 'activities':
        return <Activities navigateToContest={navigateToContest} />
      default:
        return <Home />
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      maxHeight: '100vh',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#0a192f', // Dark blue background
      color: '#e2e8f0', // Light gray for better readability
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        overflow: 'hidden',
        background: 'linear-gradient(to bottom, #0a192f, #0d1b33, #0a192f)'
      }}>
        {/* Grid lines for subtle background pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `
            linear-gradient(rgba(100, 255, 218, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100, 255, 218, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          opacity: 0.7
        }}></div>
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              backgroundColor: `rgba(100, 255, 218, ${Math.random() * 0.4 + 0.1})`,
              borderRadius: '50%',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float${i % 3} ${Math.random() * 10 + 10}s infinite linear`
            }}
          />
        ))}
        
        {/* Floating shapes for AI feel */}
        <div style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '40% 30% 50% 40%',
          background: 'radial-gradient(circle, rgba(36, 112, 161, 0.1) 0%, transparent 70%)',
          top: '10%',
          left: '5%',
          animation: 'float 20s infinite linear',
          filter: 'blur(25px)'
        }}></div>
        <div style={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(74, 132, 198, 0.08) 0%, transparent 70%)',
          bottom: '15%',
          right: '10%',
          animation: 'floatReverse 25s infinite linear',
          filter: 'blur(20px)'
        }}></div>
        <div style={{
          position: 'absolute',
          width: '250px',
          height: '250px',
          borderRadius: '30% 50% 40% 60%',
          background: 'radial-gradient(circle, rgba(100, 255, 218, 0.05) 0%, transparent 70%)',
          top: '40%',
          right: '20%',
          animation: 'floatAlt 18s infinite linear',
          filter: 'blur(20px)'
        }}></div>
        
        <style>{`
          @keyframes float {
            0% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(20px, 30px) rotate(90deg); }
            50% { transform: translate(0, 60px) rotate(180deg); }
            75% { transform: translate(-20px, 30px) rotate(270deg); }
            100% { transform: translate(0, 0) rotate(360deg); }
          }
          @keyframes floatReverse {
            0% { transform: translate(0, 0) rotate(0deg); }
            100% { transform: translate(-20px, -30px) rotate(360deg); }
          }
          @keyframes floatAlt {
            0% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(-10px, 15px) scale(1.1); }
            100% { transform: translate(0, 0) scale(1); }
          }
          @keyframes float0 { 0% { transform: translateY(0px); } 100% { transform: translateY(-100vh); } }
          @keyframes float1 { 0% { transform: translate(0, 0); } 100% { transform: translate(100px, -100vh); } }
          @keyframes float2 { 0% { transform: translate(0, 0); } 100% { transform: translate(-100px, -100vh); } }
        `}</style>
      </div>
      
      <header style={{
        backgroundColor: 'rgba(10, 25, 47, 0.9)', // Semi-transparent dark blue
        backdropFilter: 'blur(10px)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        position: 'relative',
        zIndex: 100,
        borderBottom: '1px solid #1e3a5f', // Subtle border
        display: showContest ? 'none' : 'block' // Hide navigation during contest
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0.5rem 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ 
            color: '#64ffda', // Teal accent color
            margin: 0,
            fontSize: '1.5rem',
            fontWeight: 'bold',
            textShadow: '0 0 8px rgba(100, 255, 218, 0.3)' // Subtle glow effect
          }}>
            AI Club Portal
          </h1>
        </div>
        <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
      </header>
      
      <main style={{
        position: 'relative',
        zIndex: 10,
        flex: 1,
        overflow: 'auto',
        padding: '0',
        maxHeight: showContest ? '100vh' : 'calc(100vh - 120px)' // Adjust height based on navigation visibility
      }}>
        {showContest && contestState === 'leaderboard' && (
          <div style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            zIndex: 1000
          }}>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: '#f87171',
                color: '#0a192f',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(248, 113, 113, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 0 15px rgba(248, 113, 113, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 2px 8px rgba(248, 113, 113, 0.3)';
              }}
            >
              Logout
            </button>
          </div>
        )}
        {renderSection()}
      </main>
      
      <footer style={{
        backgroundColor: 'rgba(10, 25, 47, 0.9)',
        backdropFilter: 'blur(10px)',
        color: '#e2e8f0',
        textAlign: 'center',
        padding: '1rem',
        borderTop: '1px solid #1e3a5f',
        display: showContest ? 'none' : 'block' // Hide footer during contest
      }}>
        <p style={{ margin: '0.25rem 0', fontSize: '0.8rem' }}>© 2024 AI Club. All rights reserved.</p>
        <p style={{ margin: '0.25rem 0', fontSize: '0.7rem', color: '#64ffda' }}>
          Empowering the next generation of AI innovators
        </p>
      </footer>
    </div>
  )
}

export default App