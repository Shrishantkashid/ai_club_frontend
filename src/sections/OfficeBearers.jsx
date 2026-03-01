import React, { useState, useEffect } from 'react'

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
      department: "Computer Engineering & Engineering",
      year: "Third Year",
      image: "D:\Downloads\WhatsApp Image 2026-03-01 at 3.30.46 PM.jpeg",
      bio: "The President defines the vision and strategic direction of Aritificial Intelligence Club .They coordinate with faculty and External Partners to organize events and initiatives. They oversee operations and motivate members to actively participate and innovate. "
    },
    {
      id: 2,
      name: "Nishanth R",
      position: "Vice President",
      department: "Computer Science & Engieering",
      year: "Third Year",
      image: "D:\Downloads\WhatsApp Image 2026-02-24 at 10.16.53 PM.jpeg",
      bio: "THE VICE PRESIDENT SUPPORTS THE PRESIDENT IN LEADING THE CLUB AND OVERSEEING MAJOR DECISIONS AND ACTIVITIES. THEY STEP IN DURING THE PRESIDENT'S ABSENCE AND HELP ENSURE SMOOTII PLANNING, COORDINATION. AND EXECUTION OF EVENTS"
    },
    {
      id: 3,
      name: "Sanjana R",
      position: "Secretary",
      department: "Computer Science & Engineering",
      year: "Third Year",
      image: "D:\Downloads\WhatsApp Image 2026-03-01 at 3.30.49 PM.jpeg",
      bio: "Managing administrative tasks and member coordination. Focused on natural language processing and chatbot development. Organizes technical events."
    },
    {
      id: 4,
      name: "Shrishant Shridhar Kashid",
      position: "Joint-Secretary",
      department: "Computer Science & Engineering",
      year: "Third Year",
      image: "D:\Downloads\WhatsApp Image 2026-02-23 at 7.34.24 PM.jpeg",
      bio: "THE JOINT SECRETARY ASSISTS THE SECRETARY IN ORGANIZING MEETINGS, MANAGING RECORDS. AND COORDINATING CLUB ACTIVITIES. THEY TAKE CHARGE IN THE SECRETARY'S ABSENCE AND ENSURE SMOOTH COMMUNICATION AND TEAMWORK WITHIN THE CLUB"
    },
    {
      id: 5,
      name: "Akshay A Agile",
      position: "Treasurer",
      department: "Computer Science & Engineering",
      year: "Third Year",
      image: "D:\Downloads\WhatsApp Image 2026-03-01 at 3.30.51 PM.jpeg",
      bio: "THE TREASURER MANAGES THE CLUB'S FINANCES. INCLUDING BUDGETING EXPENSE TRACKING. AND THEY HANDLE FUND COLLECTION, APPROVALS, MAINTAIN TRANSPARENT FINANCIAL AND RECORDS. THEY ENSURE EFFECTIVE UTILIZATION OF FUNDS FOR EVENTS, PROJECTS. AND ACTIVITIES.   "
    },
    {
      id: 6,
      name: "Yashwanth Gowda H",
      position: "Social Media Lead",
      department: "Computer Science & Engineering",
      year: "Second Year",
      image: "D:\Downloads\WhatsApp Image 2026-03-01 at 3.30.53 PM.jpeg",
      bio: "THE SOCIAL MEDIA LEAD MANAGES THE CLUB'S ONLINE PRESENCE ACROSS ALL PLATFORMS. THEY CREATE AND PROMOTE EVENTS. ACTIVITIES. PUBLISH CONTENT TO ACHIEVEMENTS. AND THEY ENGAGE WITH THE AUDIENCE AND MAINTAIN A BRAND IMAGE. CONSISTENT, PROFESSIONAL"
    },
    {
      id: 7,
      name: "Rakshitha J K ",
      position: "Documentation Lead",
      department: "Computer Engineering & Engineering",
      year: "Second Year",
      image: "D:\Downloads\WhatsApp Image 2026-03-01 at 3.30.57 PM.jpeg",
      bio: "THE DOCUMENTATION LEAD PREPARES AND MAINTAINS RECORDS OF ALL CLUB ACTIVITIES AND EVENTS. THEY COMPILE REPORTS, PRESENTATIONS, AND ARCHIVES FOR INTERNAL AND OFFICIAL USE. THEY ENSURE ACCURACY, CONSISTENCY, AND TIMELY SUBMISSION OF ALL DOCUMENTATION."
    }
    {
      id: 8,
      name: "Shreekara Bhat A P",
      position: "Membership Coordinator ",
      department: "Computer Engineering & Engineering",
      year: "Second Year",
      image: "D:\Downloads\WhatsApp Image 2026-03-01 at 3.30.55 PM.jpeg",
      bio: "THE MEMBERSHIP COORDINATOR IS RESPONSIBLE FOR RECRUITING NEW MEMBERS AND MAINTAINING MEMBER RECORDS. THEY ENGAGE MEMBERS, ENCOURAGE PARTICIPATION, AND ENSURE EFFECTIVE COMMUNICATION WITHIN THE CLUB"
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
              backgroundPosition: 'center',
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