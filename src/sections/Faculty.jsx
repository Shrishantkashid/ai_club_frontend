import React, { useState, useEffect } from 'react'

const Faculty = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const facultyMembers = [
    {
      id: 1,
      name: "Dr. Robert Chen",
      designation: "Professor & Head of Department",
      department: "Computer Science",
      specialization: "Machine Learning, Data Science",
      experience: "15+ years",
      image: "/placeholder-faculty.jpg",
      bio: "Leading researcher in deep learning applications. Published over 50 research papers in international journals."
    },
    {
      id: 2,
      name: "Dr. Amanda Foster",
      designation: "Associate Professor",
      department: "Electronics & Communication",
      specialization: "Computer Vision, Robotics",
      experience: "12+ years",
      image: "/placeholder-faculty.jpg",
      bio: "Expert in computer vision systems and autonomous robotics. Industry experience with leading tech companies."
    },
    {
      id: 3,
      name: "Dr. James Rodriguez",
      designation: "Assistant Professor",
      department: "Information Technology",
      specialization: "Natural Language Processing, AI Ethics",
      experience: "8+ years",
      image: "/placeholder-faculty.jpg",
      bio: "Research focus on ethical AI implementation and natural language understanding systems."
    },
    {
      id: 4,
      name: "Dr. Maria Thompson",
      designation: "Assistant Professor",
      department: "Computer Science",
      specialization: "Neural Networks, Deep Learning",
      experience: "10+ years",
      image: "/placeholder-faculty.jpg",
      bio: "Specializes in convolutional neural networks and their applications in medical imaging."
    },
    {
      id: 5,
      name: "Dr. Christopher Lee",
      designation: "Associate Professor",
      department: "Electronics & Communication",
      specialization: "Reinforcement Learning, IoT",
      experience: "13+ years",
      image: "/placeholder-faculty.jpg",
      bio: "Focus on reinforcement learning algorithms and Internet of Things integration with AI systems."
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
        Faculty Members
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '2rem'
      }}>
        {facultyMembers.map((faculty, index) => (
          <div key={faculty.id} style={{
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
              <span>👨‍🏫</span>
            </div>
            
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{ 
                color: '#64ffda', 
                marginBottom: '0.5rem',
                fontSize: '1.4rem'
              }}>
                {faculty.name}
              </h3>
              <p style={{ 
                color: '#4ade80', 
                fontWeight: 'bold', 
                marginBottom: '0.5rem',
                fontSize: '1.1rem'
              }}>
                {faculty.designation}
              </p>
              <p style={{ 
                color: '#cbd5e0', 
                marginBottom: '0.5rem' 
              }}>
                {faculty.department}
              </p>
              <p style={{ 
                color: '#93c5fd', 
                fontStyle: 'italic',
                marginBottom: '1rem' 
              }}>
                {faculty.specialization}
              </p>
              <p style={{ 
                color: '#fbbf24', 
                marginBottom: '1rem' 
              }}>
                <strong>Experience:</strong> {faculty.experience}
              </p>
              <p style={{ 
                color: '#e2e8f0', 
                lineHeight: '1.4' 
              }}>
                {faculty.bio}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        backgroundColor: 'rgba(30, 58, 95, 0.6)',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(30, 58, 95, 0.3)',
        marginTop: '3rem',
        border: '1px solid rgba(100, 255, 218, 0.2)',
        backdropFilter: 'blur(4px)',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transitionDelay: '0.6s'
      }}>
        <h2 style={{ 
          color: '#64ffda', 
          marginBottom: '1rem',
          textAlign: 'center',
          textShadow: '0 0 6px rgba(100, 255, 218, 0.3)'
        }}>
          Faculty Support
        </h2>
        <p style={{ 
          textAlign: 'center',
          color: '#e2e8f0',
          lineHeight: '1.6'
        }}>
          Our faculty members provide guidance, mentorship, and technical expertise to help students 
          explore cutting-edge AI research and development. They support various club activities 
          including research projects, competitions, and industry collaborations.
        </p>
      </div>
    </div>
  )
}

export default Faculty