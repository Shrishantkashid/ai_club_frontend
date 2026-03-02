import React, { useState } from 'react'

const Navigation = ({ activeSection, setActiveSection, isMobile = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'office-bearers', label: 'Office Bearers' },
    { id: 'faculty', label: 'Faculty' },
    { id: 'activities', label: 'Activities' },
    { id: 'photo-gallery', label: 'Gallery' }
  ]

  if (isMobile) {
    return (
      <nav style={{
        backgroundColor: 'rgba(10, 25, 47, 0.98)',
        backdropFilter: 'blur(15px)',
        padding: '0.75rem 1rem',
        position: 'relative',
        borderTop: '1px solid rgba(100, 255, 218, 0.15)'
      }}>
        {/* Mobile menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            backgroundColor: 'rgba(100, 255, 218, 0.15)',
            border: '1px solid rgba(100, 255, 218, 0.4)',
            color: '#64ffda',
            padding: '0.6rem 1.2rem',
            borderRadius: '8px',
            cursor: 'pointer',
            width: '100%',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '1rem',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(100, 255, 218, 0.2)'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(100, 255, 218, 0.25)';
            e.target.style.boxShadow = '0 4px 12px rgba(100, 255, 218, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'rgba(100, 255, 218, 0.15)';
            e.target.style.boxShadow = '0 2px 8px rgba(100, 255, 218, 0.2)';
          }}
        >
          {isMenuOpen ? '✕ Close Menu' : '☰ Menu'}
        </button>

        {/* Mobile menu dropdown */}
        {isMenuOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'rgba(10, 25, 47, 0.98)',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(100, 255, 218, 0.3)',
            borderRadius: '0 0 12px 12px',
            zIndex: 1000,
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
            marginTop: '0.5rem',
            overflow: 'hidden'
          }}>
            {navItems.map((item, index) => (
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
                  borderBottom: '1px solid rgba(100, 255, 218, 0.1)',
                  padding: '1.2rem 1rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '1.05rem',
                  fontWeight: activeSection === item.id ? 'bold' : 'normal',
                  transition: 'all 0.3s ease',
                  paddingLeft: '1.5rem'
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== item.id) {
                    e.target.style.backgroundColor = 'rgba(100, 255, 218, 0.1)';
                    e.target.style.paddingLeft = '1.8rem';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== item.id) {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.paddingLeft = '1.5rem';
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

  // Desktop navigation
  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center'
    }}>
      <ul style={{
        listStyle: 'none',
        display: 'flex',
        justifyContent: 'flex-end',
        margin: '0',
        padding: '0.5rem 0',
        gap: '1rem'
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
                padding: '0.7rem 1.8rem',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: activeSection === item.id ? 'bold' : 'normal',
                fontSize: '1.05rem',
                transition: 'all 0.3s ease',
                boxShadow: activeSection === item.id ? '0 2px 12px rgba(100, 255, 218, 0.2)' : 'none',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                if (activeSection !== item.id) {
                  e.target.style.backgroundColor = 'rgba(100, 255, 218, 0.15)';
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 6px 16px rgba(100, 255, 218, 0.3)';
                  e.target.style.borderColor = 'rgba(100, 255, 218, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeSection !== item.id) {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.borderColor = 'rgba(100, 255, 218, 0.3)';
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