import React from 'react'

const Navigation = ({ activeSection, setActiveSection }) => {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'office-bearers', label: 'Office Bearers' },
    { id: 'faculty', label: 'Faculty' },
    { id: 'activities', label: 'Activities' }
  ]

  return (
    <nav style={{
      backgroundColor: 'rgba(15, 30, 55, 0.8)', // Dark blue transparent
      backdropFilter: 'blur(10px)',
      padding: '1rem 0',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderBottom: '1px solid #1e3a5f'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'center',
        gap: '2rem'
      }}>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            style={{
              backgroundColor: activeSection === item.id ? '#1e3a5f' : 'transparent',
              color: activeSection === item.id ? '#64ffda' : '#e2e8f0',
              border: '1px solid #1e3a5f',
              padding: '0.75rem 1.5rem',
              borderRadius: '30px',
              cursor: 'pointer',
              fontWeight: activeSection === item.id ? 'bold' : 'normal',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontSize: '0.9rem'
            }}
            onMouseOver={(e) => {
              if (activeSection !== item.id) {
                e.target.style.backgroundColor = 'rgba(30, 58, 95, 0.5)'
                e.target.style.color = '#64ffda'
                e.target.style.boxShadow = '0 0 15px rgba(100, 255, 218, 0.3)'
                e.target.style.transform = 'scale(1.05)'
              }
            }}
            onMouseOut={(e) => {
              if (activeSection !== item.id) {
                e.target.style.backgroundColor = 'transparent'
                e.target.style.color = '#cbd5e0'
                e.target.style.boxShadow = 'none'
                e.target.style.transform = 'scale(1)'
              }
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  )
}

export default Navigation