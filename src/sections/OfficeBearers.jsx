import React, { useState, useEffect } from 'react'
import nithinImage from '../assets/Nithin.jpg'
import image1 from '../assets/WhatsApp Image 2026-02-23 at 7.34.24 PM.jpeg'
import image2 from '../assets/WhatsApp Image 2026-02-24 at 10.16.53 PM.jpeg'
import image3 from '../assets/WhatsApp Image 2026-03-01 at 3.30.49 PM.jpeg'
import image4 from '../assets/WhatsApp Image 2026-03-01 at 3.30.51 PM.jpeg'
import image5 from '../assets/WhatsApp Image 2026-03-01 at 3.30.53 PM.jpeg'
import image6 from '../assets/WhatsApp Image 2026-03-01 at 3.30.55 PM.jpeg'
import image7 from '../assets/WhatsApp Image 2026-03-01 at 3.30.57 PM.jpeg'

const OfficeBearers = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const bearers = [
    {
      id: 1,
      name: "Nithin Raj G",
      position: "President",
      department: "Computer Science & Engineering",
      year: "Third Year",
      image: nithinImage,
      bio: "Leading the club with vision and dedication. Specializes in machine learning and neural networks. Passionate about AI research and innovation."
    },
    {
      id: 2,
      name: "Nishanth R",
      position: "Vice President",
      department: "Computer Science & Engineering",
      year: "Third Year",
      image: image2,
      bio: "Overseeing technical operations and project coordination. Expertise in computer vision and robotics. Leads AI workshops and hackathons."
    },
    {
      id: 3,
      name: "Sanjana R",
      position: "Secretary",
      department: "Computer Science & Engineering",
      year: "Third Year",
      image: image3,
      bio: "Managing administrative tasks and member coordination. Focused on natural language processing and chatbot development. Organizes technical events."
    },
    {
      id: 4,
      name: "Shrishant Shridhar Kashid",
      position: "Joint-Secretary",
      department: "Computer Science & Engineering",
      year: "Third Year",
      image: image1,
      bio: "The joint secretary assists the secretary in organizing meeting managing records and coordinating club activities. They take charge in the secretary's absence and ensure smooth communication and teamwork within the club."
    },
    {
      id: 5,
      name: "Akshay A Agile",
      position: "Treasurer",
      department: "Computer Science & Engineering",
      year: "Third Year",
      image: image4,
      bio: "Handling financial matters and resource management. Interested in AI ethics and policy. Manages club budget and sponsorships."
    },
    {
      id: 6,
      name: "Yashwanth Gowda H",
      position: "Social Media Lead",
      department: "Computer Science & Engineering",
      year: "Second Year",
      image: image5,
      bio: "The social media Lead Mangesh the clubs online presence across all platforms.They create and promote events activites publish content to achievements and they engage with the audience and maintain a brand image."
    },
    {
      id: 7,
      name: "Rakshitha J K",
      position: "Documentation Lead",
      department: "Computer Science & Engineering",
      year: "Second Year",
      image: image7,
      bio: "The documentation lag prepare and maintain record of all club activities and events. They compile reports presentation and archives for internal and offical use. They ensure accuracy consistency and timely submission of all documentation."
    },
    {
      id: 8,
      name: "Shreekara Bhat A P",
      position: "Membership Coordinator",
      department: "Computer Science & Engineering",
      year: "Second Year",
      image: image6,
      bio: "The membership coordinator is responsible for recruiting new members and maintaining members records. They engage memebers encourage effective communication within the club."
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
              backgroundImage: `url(${bearer.image})`,
              backgroundSize: 'cover',
              backgroundPosition: bearer.name === 'Nithin Raj G' ? 'center 20%' : 
                bearer.name === 'Nishanth R' ? 'center 10%' :
                bearer.name === 'Sanjana R' ? 'center 65%' :
                bearer.name === 'Shrishant Shridhar Kashid' ? 'center 48%' :
                bearer.name === 'Akshay A Agile' ? 'center 25%' :
                bearer.name === 'Yashwanth Gowda H' ? 'center 27%' :
                bearer.name === 'Rakshitha J K' ? 'center 53%' :
                bearer.name === 'Shreekara Bhat A P' ? 'center 50%' : 'center',
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
                  {bearer.name}
                </h3>
                <p style={{ 
                  color: '#4ade80', 
                  fontWeight: 'bold', 
                  margin: '0.25rem 0',
                  fontSize: '1.1rem'
                }}>
                  {bearer.position}
                </p>
              </div>
            </div>
            
            <div style={{ padding: '1.5rem' }}>
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