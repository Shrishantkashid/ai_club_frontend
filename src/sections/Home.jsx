import React from 'react'
import { motion } from 'framer-motion'

const Home = ({ isMobile = false }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  const objectives = [
    { title: "Awareness", desc: "Promote understanding of AI and its real-world applications.", icon: "🌐" },
    { title: "Practicality", desc: "Provide hands-on experience in ML, Deep Learning, and Data Science.", icon: "🛠️" },
    { title: "Innovation", desc: "Encourage problem-solving through AI-based projects.", icon: "💡" },
    { title: "Collaboration", desc: "Create a shared environment for students to exchange ideas.", icon: "🤝" },
    { title: "Preparation", desc: "Prepare members for internships, research, and AI careers.", icon: "🚀" },
    { title: "Events", desc: "Organize workshops, hackathons, and industry seminars.", icon: "🏆" }
  ];

  const outcomes = [
    { text: "Gain practical skills in AI tools and model development.", icon: "⚡" },
    { text: "Improved analytical thinking and problem-solving abilities.", icon: "🧩" },
    { text: "Build a portfolio of real-world AI projects.", icon: "📁" },
    { text: "Enhanced teamwork, communication, and leadership skills.", icon: "👑" },
    { text: "Ready for placements and higher studies in AI/ML.", icon: "🎓" },
    { text: "Active participation in global technical competitions.", icon: "🌍" }
  ];

  const importanceItems = [
    { id: 1, title: "Skill Development", desc: "Learn practical concepts in AI, ML, and Data Science beyond the syllabus.", icon: "🧠" },
    { id: 2, title: "Hands-on Experience", desc: "Work on real projects and hackathons to strengthen practical knowledge.", icon: "💻" },
    { id: 3, title: "Career Opportunities", desc: "Improve your resume and placement prospects with AI experience.", icon: "💼" },
    { id: 4, title: "Industry Exposure", desc: "Stay updated with current trends through expert-led workshops.", icon: "🏙️" },
    { id: 5, title: "Teamwork & Leadership", desc: "Develop soft skills by organizing events and collaborating.", icon: "👥" },
    { id: 6, title: "Innovation & Research", desc: "Explore new ideas and participate in research-based projects.", icon: "🔬" },
    { id: 7, title: "Networking", desc: "Connect with like-minded peers, seniors, alumni, and professionals.", icon: "🔗" },
    { id: 8, title: "Confidence Building", desc: "Boost public speaking and confidence by presenting projects.", icon: "✨" }
  ];

  return (
    <div style={{
      padding: isMobile ? '1rem' : '2rem',
      maxWidth: '1300px',
      margin: '0 auto',
      color: '#e2e8f0'
    }}>
      {/* Hero Section */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        style={{
          textAlign: 'center',
          padding: isMobile ? '2rem 1rem' : '4rem 2rem',
          background: 'radial-gradient(circle at center, rgba(100, 255, 218, 0.05) 0%, transparent 70%)',
          borderRadius: '24px',
          marginBottom: '4rem'
        }}
      >
        <motion.h1 
          variants={itemVariants}
          style={{
            fontSize: isMobile ? '2.5rem' : '4.5rem',
            color: '#64ffda',
            marginBottom: '1.5rem',
            fontWeight: '800',
            letterSpacing: '-1px',
            textShadow: '0 0 20px rgba(100, 255, 218, 0.3)'
          }}
        >
          SVIT AI CLUB
        </motion.h1>
        <motion.p 
          variants={itemVariants}
          style={{
            fontSize: isMobile ? '1.1rem' : '1.5rem',
            color: '#94a3b8',
            maxWidth: '900px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}
        >
          Shaping technical skills, innovation mindset, and career readiness for the next generation of AI pioneers.
        </motion.p>
      </motion.div>

      {/* Mission & Vision Section */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: '2rem',
          marginBottom: '5rem'
        }}
      >
        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          style={{
            backgroundColor: 'rgba(30, 58, 95, 0.6)',
            padding: '2.5rem',
            borderRadius: '20px',
            border: '1px solid rgba(100, 255, 218, 0.2)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <h2 style={{ color: '#64ffda', fontSize: '1.8rem', marginBottom: '1rem' }}>Our Mission</h2>
          <p style={{ color: '#cbd5e0', fontSize: '1.1rem', lineHeight: '1.6' }}>
            To foster innovation in AI technologies and create a community of passionate learners and developers through collaborative learning and hands-on experimentation.
          </p>
        </motion.div>
        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          style={{
            backgroundColor: 'rgba(30, 58, 95, 0.6)',
            padding: '2.5rem',
            borderRadius: '20px',
            border: '1px solid rgba(100, 255, 218, 0.2)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <h2 style={{ color: '#64ffda', fontSize: '1.8rem', marginBottom: '1rem' }}>Our Vision</h2>
          <p style={{ color: '#cbd5e0', fontSize: '1.1rem', lineHeight: '1.6' }}>
            To be a leading student organization in AI research and development, bridging the gap between academic theory and industry implementation.
          </p>
        </motion.div>
      </motion.div>

      {/* Objectives Section */}
      <div style={{ marginBottom: '6rem' }}>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', fontSize: '2.5rem', color: '#64ffda', marginBottom: '3rem' }}
        >
          Club Objectives
        </motion.h2>
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: '1.5rem'
          }}
        >
          {objectives.map((obj, i) => (
            <motion.div 
              key={i}
              variants={itemVariants}
              whileHover={{ y: -10, backgroundColor: 'rgba(100, 255, 218, 0.05)' }}
              style={{
                backgroundColor: 'rgba(30, 58, 95, 0.4)',
                padding: '2rem',
                borderRadius: '16px',
                border: '1px solid rgba(100, 255, 218, 0.1)',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{obj.icon}</div>
              <h3 style={{ color: '#64ffda', fontSize: '1.3rem', marginBottom: '0.75rem' }}>{obj.title}</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>{obj.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Outcomes Section */}
      <div style={{ marginBottom: '6rem' }}>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', fontSize: '2.5rem', color: '#64ffda', marginBottom: '3rem' }}
        >
          Program Outcomes
        </motion.h2>
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: '1.5rem'
          }}
        >
          {outcomes.map((outcome, i) => (
            <motion.div 
              key={i}
              variants={itemVariants}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                backgroundColor: 'rgba(10, 25, 47, 0.6)',
                padding: '1.5rem',
                borderRadius: '12px',
                borderLeft: '4px solid #64ffda'
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>{outcome.icon}</span>
              <p style={{ color: '#e2e8f0', fontSize: '1.05rem', margin: 0 }}>{outcome.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Importance Section */}
      <div style={{ marginBottom: '6rem' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <h2 style={{ fontSize: '2.5rem', color: '#64ffda', marginBottom: '1rem' }}>
            Why Join AI Club?
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
            Shaping technical excellence and professional growth through AI.
          </p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}
        >
          {importanceItems.map((item) => (
            <motion.div 
              key={item.id}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              style={{
                backgroundColor: 'rgba(30, 58, 95, 0.5)',
                padding: '2rem',
                borderRadius: '20px',
                border: '1px solid rgba(100, 255, 218, 0.15)',
                boxShadow: '0 10px 30px -15px rgba(2, 12, 27, 0.7)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                fontSize: '5rem',
                opacity: 0.05,
                pointerEvents: 'none'
              }}>
                {item.id}
              </div>
              <div style={{ 
                width: '50px', 
                height: '50px', 
                backgroundColor: 'rgba(100, 255, 218, 0.1)', 
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                marginBottom: '1.5rem'
              }}>
                {item.icon}
              </div>
              <h3 style={{ color: '#64ffda', fontSize: '1.25rem', marginBottom: '0.75rem' }}>{item.title}</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6' }}>{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Final About Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        style={{
          backgroundColor: 'rgba(100, 255, 218, 0.03)',
          padding: isMobile ? '2rem' : '4rem',
          borderRadius: '30px',
          textAlign: 'center',
          border: '1px solid rgba(100, 255, 218, 0.1)',
          marginBottom: '4rem'
        }}
      >
        <h2 style={{ color: '#64ffda', fontSize: '2rem', marginBottom: '1.5rem' }}>About Our Club</h2>
        <p style={{ 
          fontSize: isMobile ? '1rem' : '1.2rem', 
          lineHeight: '1.8', 
          color: '#cbd5e0',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          The Artificial Intelligence Club of SVIT is dedicated to exploring the vast possibilities of AI. 
          We organize workshops, hackathons, guest lectures, and research projects to help students 
          understand and contribute to this rapidly evolving field. Our members work on diverse 
          projects ranging from machine learning algorithms to computer vision, NLP, and robotics, 
          shaping the innovators of tomorrow.
        </p>
      </motion.div>

      <style>{`
        @keyframes glow {
          from { text-shadow: 0 0 5px rgba(100, 255, 218, 0.3); }
          to { text-shadow: 0 0 20px rgba(100, 255, 218, 0.5); }
        }
      `}</style>
    </div>
  )
}

export default Home