import React, { useState, useEffect } from 'react'
import sowmya from "../assets/teachers/sowmya.jpg"
import pavithra from "../assets/teachers/pavithra.jpeg"
import jayaprada from "../assets/teachers/jayaprada.jpeg"
import manjunath from "../assets/teachers/STAFF830.jpg"
import shashikumar from "../assets/teachers/shashikumar.jpg"
import shantakumar from "../assets/teachers/shantakumar.jpg"
const Faculty = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const facultyMembers = [
    {
      id: 1,
      name: "Dr. Manjunath T N",
      designation: "Principal & Professor",
      department: "Sai Vidya Insititue of Technology",
      specialization: "Data Mining and Big Data",
      image: manjunath,
    },
    {
      id: 2,
      name: "Dr. Shashikumar D R",
      designation: "Professor & HOD",
      department: "Computer Science & Engineering",
      specialization: "Expert in Machine learning and Computer Science Theory",
      image: shashikumar,
    },
     {
      id: 3,
      name: "Dr. Shantakumar B Patil",
      designation: "Professor & Associate Dean",
      department: "Computer Science & Engineering",
      specialization: "Data Mining, Artificial Intelligence, and Formal Languages and Automata Theory",
      image: shantakumar,
    },
    {
      id: 4,
      name: "Prof. Sowmya H N",
      designation: "Assistant Professor",
      department: "Computer Science & Engineering",
      specialization: "AI & Machine Learning",
      image: sowmya,
    },
    {
      id: 5,
      name: "Prof. Pavithra B G",
      designation: "Assistant Professor",
      department: "Computer Science & Engineering",
      specialization: "Digital Communication And Networking",
      image: pavithra,
    },
    {
      id: 6,
      name: "Prof. Jayaprada S Hiremath",
      designation: "Assistant Professor",
      department: "Computer Science & Engineering",
      specialization: "AIML ,DL,Computer Vision",
      image: jayaprada,
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
              height: '300px',
              backgroundImage: `url(${faculty.image})`,
              backgroundSize: faculty.name === 'Prof. Sowmya H N' ? '80%' : 'cover',
              backgroundPosition: faculty.name === 'Prof. Jayaprada S Hiremath' ? 'center 2%' : faculty.name === 'Prof. Pavithra B G' ? 'center 30%' : faculty.name === 'Dr. Shantakumar B Patil' ? 'center 30%' : 'center',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                right: '0',
                height: '60%',
                background: 'linear-gradient(to top, rgba(10, 25, 47, 0.9) 0%, transparent 100%)'
              }}></div>
              <div style={{
                position: 'relative',
                zIndex: 2,
                padding: '1rem',
                textAlign: 'center'
              }}>
                <h3 style={{ 
                  color: '#64ffda', 
                  margin: '0',
                  fontSize: '1.4rem'
                }}>
                  {faculty.name}
                </h3>
                <p style={{ 
                  color: '#4ade80', 
                  fontWeight: 'bold', 
                  margin: '0.25rem 0',
                  fontSize: '1.1rem'
                }}>
                  {faculty.designation}
                </p>
              </div>
            </div>
            
            <div style={{ padding: '1.5rem' }}>
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