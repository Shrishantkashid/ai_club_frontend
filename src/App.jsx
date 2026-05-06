import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navigation from './components/Navigation'
import Home from './sections/Home'
import OfficeBearers from './sections/OfficeBearers'
import Faculty from './sections/Faculty'
import Activities from './sections/Activities'
import PhotoGallery from './sections/PhotoGallery'
import ActivityCard from './pages/ActivityCard'
import Instructions from './pages/Instructions'
import Login from './pages/Login'
import Round1 from './pages/Round1'
import Round2 from './pages/Round2'
import Round3 from './pages/Round3'
import Leaderboard from './pages/Leaderboard'
// 2nd Sem Contest Components
import Sem2Login from './pages/Sem2Login'
import Sem2Round1 from './pages/Sem2Round1'
import Sem2Round2 from './pages/Sem2Round2'
import Sem2Round3 from './pages/Sem2Round3'
import Sem2Leaderboard from './pages/Sem2Leaderboard'
import AdminDashboard from './pages/AdminDashboard'
import SectionWrapper from './components/SectionWrapper'
import clubLogo from './assets/logo/WhatsApp Image 2026-02-07 at 10.10.11 AM.jpeg'
import OpenDayActivity from './pages/OpenDayActivity'
import OpenDayVerify from './pages/OpenDayVerify'

function App() {
  const [activeSection, setActiveSection] = useState('home')
  const [contestState, setContestState] = useState('activity-card') // activity-card, instructions, login, round1, round2, round3, leaderboard
  const [currentUser, setCurrentUser] = useState(null)
  const [showContest, setShowContest] = useState(false)
  const [showOpenDay, setShowOpenDay] = useState(false)
  const [openDayState, setOpenDayState] = useState('main') // main, verify
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  // Handle mobile detection with improved breakpoints
  useEffect(() => {
    const handleResize = () => {
      // Define breakpoints according to industry standards
      const width = window.innerWidth;
      // Mobile: up to 768px, Tablet: 769px to 1024px, Desktop: 1025px and above
      setIsMobile(width <= 768)
    }
    
    window.addEventListener('resize', handleResize)
    // Initialize on mount
    handleResize();
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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
      } else if (hash === 'open-day') {
        setShowOpenDay(true)
        setOpenDayState('main')
        setShowContest(false)
      } else if (hash.startsWith('open-day/verify')) {
        setShowOpenDay(true)
        setOpenDayState('verify')
        setShowContest(false)
      } else {
        setShowContest(false)
        setShowOpenDay(false)
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
                localStorage.setItem('currentUser', JSON.stringify(user));
                setContestState('round1')
              } catch (error) {
                console.error('Error during login success handling:', error);
              }
            }}
            onContestCompleted={(data) => {
              console.log('Contest completed data:', data);
              localStorage.setItem('contestCompletedData', JSON.stringify(data));
              setContestState('leaderboard');
            }}
            onBack={() => setContestState('instructions')}
          />
        
        // 2nd Semester Contest Routes
        case 'sem2-login':
          return <Sem2Login 
            onLoginSuccess={(user) => {
              setCurrentUser(user)
              localStorage.setItem('currentUser', JSON.stringify(user));
              setContestState('sem2-round1')
            }}
            onContestCompleted={(data) => {
              localStorage.setItem('contestCompletedData', JSON.stringify(data));
              setContestState('sem2-leaderboard');
            }}
            onBack={() => setContestState('activity-card')}
          />
        case 'sem2-round1':
          return <Sem2Round1 onCompleteRound1={() => setContestState('sem2-round2')} />
        case 'sem2-round2':
          return <Sem2Round2 onCompleteRound2={() => setContestState('sem2-round3')} />
        case 'sem2-round3':
          return <Sem2Round3 
            onProceedToLeaderboard={() => setContestState('sem2-leaderboard')} 
            onRestartContest={() => {
              // Reset to login page
              setShowContest(false);
              setActiveSection('home');
              window.location.hash = '';
            }} 
          />
        case 'sem2-leaderboard':
          return <Sem2Leaderboard onBackToHome={() => {
            setShowContest(false);
            setActiveSection('home');
            window.location.hash = '';
          }} />
        
        // Admin Routes
        case 'admin-login':
          return <AdminDashboard onBack={() => {
            setShowContest(false);
            setActiveSection('home');
            window.location.hash = '';
          }} />
        
        // Original Contest Routes
        case 'round1':
          return <Round1 onCompleteRound1={() => setContestState('round2')} />
        case 'round2':
          return <Round2 onCompleteRound2={() => setContestState('round3')} />
        case 'round3':
          return <Round3 onProceedToLeaderboard={() => setContestState('leaderboard')} />
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

    if (showOpenDay) {
      if (openDayState === 'verify') {
        return <OpenDayVerify isMobile={isMobile} />
      }
      return <OpenDayActivity isMobile={isMobile} onBackToHome={() => {
        setShowOpenDay(false)
        window.location.hash = ''
      }} />
    }
    
    switch (activeSection) {
      case 'home':
        return <SectionWrapper key="home"><Home isMobile={isMobile} /></SectionWrapper>
      case 'office-bearers':
        return <SectionWrapper key="office-bearers"><OfficeBearers isMobile={isMobile} /></SectionWrapper>
      case 'faculty':
        return <SectionWrapper key="faculty"><Faculty isMobile={isMobile} /></SectionWrapper>
      case 'activities':
        return <SectionWrapper key="activities"><Activities navigateToContest={navigateToContest} setShowContest={setShowContest} setContestState={setContestState} isMobile={isMobile} /></SectionWrapper>
      case 'photo-gallery':
        return <SectionWrapper key="photo-gallery"><PhotoGallery isMobile={isMobile} /></SectionWrapper>
      default:
        return <SectionWrapper key="home-default"><Home /></SectionWrapper>
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
        
        {/* Floating particles with motion */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              top: `${Math.random() * 100}%`, 
              left: `${Math.random() * 100}%`,
              opacity: 0 
            }}
            animate={{ 
              top: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
              left: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
              opacity: [0.1, 0.4, 0.1]
            }}
            transition={{ 
              duration: Math.random() * 20 + 20, 
              repeat: Infinity,
              ease: "linear" 
            }}
            style={{
              position: 'absolute',
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              backgroundColor: `rgba(100, 255, 218, 0.5)`,
              borderRadius: '50%',
            }}
          />
        ))}
        
        {/* Floating shapes for AI feel */}
        <motion.div 
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1],
            x: [0, 20, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          style={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            borderRadius: '40% 30% 50% 40%',
            background: 'radial-gradient(circle, rgba(36, 112, 161, 0.15) 0%, transparent 70%)',
            top: '5%',
            left: '2%',
            filter: 'blur(40px)'
          }}
        ></motion.div>
        <motion.div 
          animate={{ 
            rotate: -360,
            scale: [1, 1.2, 1],
            x: [0, -30, 0],
            y: [0, -20, 0]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          style={{
            position: 'absolute',
            width: '350px',
            height: '350px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(100, 255, 218, 0.1) 0%, transparent 70%)',
            bottom: '10%',
            right: '5%',
            filter: 'blur(50px)'
          }}
        ></motion.div>
      </div>
      
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          backgroundColor: 'rgba(10, 25, 47, 0.95)', // Semi-transparent dark blue
          backdropFilter: 'blur(15px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          position: 'relative',
          zIndex: 100,
          borderBottom: '1px solid rgba(100, 255, 218, 0.2)',
          display: (showContest || showOpenDay) ? 'none' : 'block', // Hide navigation during contest or open day
          padding: isMobile ? '0.5rem 0' : '0.75rem 0',
          width: '100%', // Changed from 100vw to 100% to prevent horizontal scroll
          marginLeft: '0'
        }}
      >
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          padding: isMobile ? '0 1rem' : '0 3rem'  // Consolidated padding to avoid conflict with paddingLeft
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem', // Increased gap between logo and text
            flexShrink: 0
          }}>
            <img 
              src={clubLogo} 
              alt="AI Club Logo"
              style={{ 
                height: isMobile ? '40px' : '70px',
                width: 'auto',
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 8px rgba(100, 255, 218, 0.3))',
                transition: 'transform 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
              onClick={() => {
                setActiveSection('home');
                setShowContest(false);
                window.location.hash = '';
              }}
            />
            <h1 style={{ 
              color: '#64ffda',
              margin: 0,
              fontSize: isMobile ? '1rem' : '1.8rem',
              fontWeight: '700',
              textShadow: '0 0 10px rgba(100, 255, 218, 0.4)',
              letterSpacing: isMobile ? '0.2px' : '0.5px',
              whiteSpace: isMobile ? 'normal' : 'nowrap',
              lineHeight: '1.2'
            }}>
              Artificial Intelligence Club
            </h1>
          </div>
          <div style={{ 
            flexGrow: isMobile ? 0 : 1, 
            margin: isMobile ? '0 0.5rem' : '0 2rem' 
          }}></div>
          <div>
            {!showContest && <Navigation activeSection={activeSection} setActiveSection={setActiveSection} isMobile={isMobile} />}
          </div>
        </div>
      </motion.header>
      
      <main style={{
        position: 'relative',
        zIndex: 10,
        flex: 1,
        overflow: 'auto',
        padding: '0',
        maxHeight: (showContest || showOpenDay) ? '100vh' : (isMobile ? 'calc(100vh - 70px)' : 'calc(100vh - 120px)'), // Adjust height based on navigation visibility
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
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
                padding: isMobile ? '0.4rem 0.8rem' : '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: isMobile ? '0.8rem' : '0.9rem',
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
        <AnimatePresence mode="wait">
          {renderSection()}
        </AnimatePresence>
      </main>
      
      <footer style={{
        backgroundColor: 'rgba(10, 25, 47, 0.9)',
        backdropFilter: 'blur(10px)',
        color: '#e2e8f0',
        textAlign: 'center',
        padding: isMobile ? '0.75rem 0.5rem' : '1rem',
        borderTop: '1px solid #1e3a5f',
        display: (showContest || showOpenDay) ? 'none' : 'block', // Hide footer during contest or open day
        fontSize: isMobile ? '0.65rem' : '0.8rem',
        width: '100%'
      }}>
        <p style={{ margin: '0.25rem 0' }}>© 2026 Artificial Intelligence Club. All rights reserved.</p>
        <p style={{ margin: '0.25rem 0', color: '#64ffda' }}>
          Empowering the next generation of AI innovators
        </p>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: isMobile ? '1rem' : '1.5rem',
          marginTop: '0.5rem',
          flexWrap: 'wrap'
        }}>
          <a href="https://www.instagram.com/aiclub_svit?igsh=c2pvbnE5amtkMDk5" target="_blank" rel="noopener noreferrer" style={{
            color: '#64ffda',
            textDecoration: 'none',
            fontSize: isMobile ? '1.2rem' : '1.5rem',
            transition: 'transform 0.3s ease, color 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.2)';
            e.target.style.color = '#e1306c'; // Instagram color
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.color = '#64ffda';
          }}>
            {/* Instagram SVG Icon with Gradient */}
            <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "20" : "24"} height={isMobile ? "20" : "24"} viewBox="0 0 24 24" style={{ verticalAlign: 'middle' }}>
              <defs>
                <linearGradient id="instaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#f09433', stopOpacity: 1 }} />
                  <stop offset="25%" style={{ stopColor: '#e6683c', stopOpacity: 1 }} />
                  <stop offset="50%" style={{ stopColor: '#dc2743', stopOpacity: 1 }} />
                  <stop offset="75%" style={{ stopColor: '#cc2366', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#bc1888', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="url(#instaGradient)"/>
              <circle cx="12" cy="12" r="4.5" fill="none" stroke="white" strokeWidth="1.5"/>
              <circle cx="18" cy="6" r="1" fill="white"/>
            </svg>
          </a>
          <a href="https://www.linkedin.com/in/artificial-intelligence-club-a5b6563ab" target="_blank" rel="noopener noreferrer" style={{
            color: '#64ffda',
            textDecoration: 'none',
            fontSize: isMobile ? '1.2rem' : '1.5rem',
            transition: 'transform 0.3s ease, color 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.2)';
            e.target.style.color = '#0077b5'; // LinkedIn color
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.color = '#64ffda';
          }}>
            {/* LinkedIn SVG Icon with Official Brand Color */}
            <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "20" : "24"} height={isMobile ? "20" : "24"} viewBox="0 0 24 24" style={{ verticalAlign: 'middle' }}>
              <defs>
                <linearGradient id="linkedinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#0077B5', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#00A0DC', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="url(#linkedinGradient)"/>
            </svg>
          </a>
        </div>
      </footer>
    </div>
  )
}

export default App