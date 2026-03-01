import React, { useState, useEffect } from 'react'

const OfficeBearers = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const bearers = [
    {
      id: 1,
      name: "John Smith",
      position: "President",
      department: "Computer Science",
      year: "Final Year",
      image: "/placeholder-avatar.jpg",
      bio: "Leading the club with vision and dedication. Specializes in machine learning and neural networks."
    },
    {
      id: 2,
      name: "Sarah Johnson",
      position: "Vice President",
      department: "Electronics & Communication",
      year: "Final Year",
      image: "/placeholder-avatar.jpg",
      bio: "Overseeing technical operations and project coordination. Expertise in computer vision and robotics."
    },
    {
      id: 3,
      name: "Michael Brown",
      position: "Secretary",
      department: "Information Technology",
      year: "Third Year",
      image: "/placeholder-avatar.jpg",
      bio: "Managing administrative tasks and member coordination. Focused on natural language processing."
    },
    {
      id: 4,
      name: "Emily Davis",
      position: "Treasurer",
      department: "Computer Science",
      year: "Third Year",
      image: "/placeholder-avatar.jpg",
      bio: "Handling financial matters and resource management. Interested in AI ethics and policy."
    },
    {
      id: 5,
      name: "David Wilson",
      position: "Technical Head",
      department: "Electronics & Communication",
      year: "Final Year",
      image: "/placeholder-avatar.jpg",
      bio: "Leading technical initiatives and workshop organization. Specializes in deep learning frameworks."
    },
    {
      id: 6,
      name: "Lisa Anderson",
      position: "Event Coordinator",
      department: "Information Technology",
      year: "Second Year",
      image: "/placeholder-avatar.jpg",
      bio: "Organizing events, competitions, and guest lectures. Passionate about AI applications in healthcare."
    }
  ]

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <h1 style={{
        textAlign: 'center',
        color: '#64ffda',
        marginBottom: '2rem',
        textShadow: '0 0 8px rgba(100, 255, 218, 0.3)',
        fontSize: '2.5rem'
      }}>
        Office Bearers
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '2rem'
      }}>
        {bearers.map((bearer, index) => (
          <div key={bearer.id} style={{
            backgroundColor: 'rgba(30, 58, 95, 0.6)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(30, 58, 95, 0.3)',
            overflow: 'hidden',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            border: '1px solid rgba(100, 255, 218, 0.2)',
            backdropFilter: 'blur(4px)',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: `${index * 0.1}s`
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(30, 58, 95, 0.5), 0 0 20px rgba(100, 255, 218, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(30, 58, 95, 0.3)';
          }}
          >
            <div style={{
              height: '200px',
              background: 'linear-gradient(135deg, #1e3a5f 0%, #0f1e37 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64ffda',
              fontSize: '4rem'
            }}>
              <span>🧠</span>
            </div>
            
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{ 
                color: '#64ffda', 
                marginBottom: '0.5rem',
                fontSize: '1.4rem'
              }}>
                {bearer.name}
              </h3>
              <p style={{ 
                color: '#4ade80', 
                fontWeight: 'bold', 
                marginBottom: '0.5rem',
                fontSize: '1.1rem'
              }}>
                {bearer.position}
              </p>
              <p style={{ 
                color: '#cbd5e0', 
                marginBottom: '0.5rem',
                fontStyle: 'italic'
              }}>
                {bearer.department} - {bearer.year}
              </p>
              <p style={{ 
                color: '#e2e8f0', 
                lineHeight: '1.4' 
              }}>
                {bearer.bio}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OfficeBearers