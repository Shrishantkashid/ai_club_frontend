import React, { useState } from 'react'

const Navigation = ({ activeSection, setActiveSection, isMobile = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'office-bearers', label: 'Office Bearers' },
    { id: 'faculty', label: 'Faculty' },
    { id: 'activities', label: 'Activities' }
  ]

  if (isMobile) {
    return (
      <nav style={{
        backgroundColor: 'rgba(10, 25, 47, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '0.5rem 1rem',
        position: 'relative'
      }}>
        {/* Mobile menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid rgba(100, 255, 218, 0.3)',
            color: '#64ffda',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            cursor: 'pointer',
            width: '100%',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '1rem'
          }}
        >
          {isMenuOpen ? 'Close Menu' : 'Menu'}
        </button>

        {/* Mobile menu dropdown */}
        {isMenuOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'rgba(10, 25, 47, 0.98)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(100, 255, 218, 0.2)',
            borderRadius: '0 0 8px 8px',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
          }}>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id)
                  setIsMenuOpen(false)
                }}
                style={{
                  display: 'block',
                  width: '100%',
                  backgroundColor: activeSection === item.id 
                    ? 'rgba(100, 255, 218, 0.2)' 
                    : 'transparent',
                  color: activeSection === item.id ? '#64ffda' : '#e2e8f0',
                  border: 'none',
                  padding: '1rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: activeSection === item.id ? 'bold' : 'normal',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== item.id) {
                    e.target.style.backgroundColor = 'rgba(100, 255, 218, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== item.id) {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>
    )
  }

  // Desktop navigation (unchanged)
  return (
    <nav style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 1rem'
    }}>
      <ul style={{
        listStyle: 'none',
        display: 'flex',
        justifyContent: 'center',
        margin: '0',
        padding: '0.5rem 0',
        gap: '2rem'
      }}>
        {navItems.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => setActiveSection(item.id)}
              style={{
                backgroundColor: activeSection === item.id 
                  ? 'rgba(100, 255, 218, 0.2)' 
                  : 'transparent',
                color: activeSection === item.id ? '#64ffda' : '#e2e8f0',
                border: '1px solid rgba(100, 255, 218, 0.3)',
                padding: '0.5rem 1.5rem',
                borderRadius: '20px',
                cursor: 'pointer',
                fontWeight: activeSection === item.id ? 'bold' : 'normal',
                fontSize: '1rem',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (activeSection !== item.id) {
                  e.target.style.backgroundColor = 'rgba(100, 255, 218, 0.1)';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(100, 255, 218, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeSection !== item.id) {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }
              }}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navigation