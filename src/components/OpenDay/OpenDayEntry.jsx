import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import Webcam from 'react-webcam';

const OpenDayEntry = ({ onRegister, isMobile }) => {
    const [formData, setFormData] = useState({ name: '', usn: '', email: '', password: '' });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const webcamRef = useRef(null);
    const btnStyle = {
        background: 'rgba(100, 255, 218, 0.1)',
        border: '1px solid #64ffda',
        color: '#64ffda',
        padding: '0.8rem 1.5rem',
        borderRadius: '30px',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'all 0.3s ease'
    };

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImage(imageSrc);
    }, [webcamRef]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) {
            alert('Please capture your photo first!');
            return;
        }
        setLoading(true);
        await onRegister({ ...formData, initialPhoto: image });
        setLoading(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            style={{
                background: 'rgba(30, 58, 95, 0.4)',
                backdropFilter: 'blur(15px)',
                padding: isMobile ? '1.5rem' : '2.5rem',
                borderRadius: '24px',
                border: '1px solid rgba(100, 255, 218, 0.3)',
                boxShadow: '0 0 40px rgba(100, 255, 218, 0.1)',
                maxWidth: '500px',
                width: isMobile ? '95%' : '100%',
                margin: isMobile ? '1rem auto' : '2rem auto',
                boxSizing: 'border-box',
                color: '#e2e8f0',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Holographic scanning effect line */}
            <motion.div
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                style={{
                    position: 'absolute',
                    left: 0,
                    width: '100%',
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, #64ffda, transparent)',
                    zIndex: 1,
                    opacity: 0.5
                }}
            />

            <h2 style={{ 
                textAlign: 'center', 
                color: '#64ffda', 
                marginBottom: isMobile ? '1rem' : '2rem',
                fontSize: isMobile ? '1.4rem' : '1.8rem',
                textShadow: '0 0 10px rgba(100, 255, 218, 0.5)'
            }}>
                ID Verification
            </h2>
            <p style={{ 
                color: '#94a3b8', 
                textAlign: 'center', 
                marginBottom: isMobile ? '1.5rem' : '2.5rem',
                fontSize: isMobile ? '0.85rem' : '1rem' 
            }}>
                Biometric authentication for club access
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '2px solid rgba(100, 255, 218, 0.2)' }}>
                    {!image ? (
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            style={{ width: '100%', display: 'block', maxHeight: isMobile ? '300px' : 'none', objectFit: 'cover' }}
                        />
                    ) : (
                        <img src={image} alt="Captured" style={{ width: '100%', display: 'block' }} />
                    )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                    {!image ? (
                        <button type="button" onClick={capture} style={btnStyle}>Capture Bio-Scan</button>
                    ) : (
                        <button type="button" onClick={() => setImage(null)} style={{ ...btnStyle, background: 'rgba(255, 100, 100, 0.1)', color: '#ff6464', borderColor: '#ff6464' }}>Retake Photo</button>
                    )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <input
                        required
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        style={{
                            background: 'rgba(10, 25, 47, 0.8)',
                            border: '1px solid rgba(100, 255, 218, 0.3)',
                            padding: '1rem',
                            borderRadius: '12px',
                            color: '#e2e8f0',
                            outline: 'none',
                            width: '100%',
                            boxSizing: 'border-box',
                            fontSize: '1rem',
                            transition: 'border-color 0.3s ease'
                        }}
                    />
                    <input
                        required
                        placeholder="USN (e.g. 1SV22CS001)"
                        value={formData.usn}
                        onChange={(e) => setFormData({ ...formData, usn: e.target.value.toUpperCase() })}
                        style={{
                            background: 'rgba(10, 25, 47, 0.8)',
                            border: '1px solid rgba(100, 255, 218, 0.3)',
                            padding: '1rem',
                            borderRadius: '12px',
                            color: '#e2e8f0',
                            outline: 'none',
                            width: '100%',
                            boxSizing: 'border-box',
                            fontSize: '1rem',
                            transition: 'border-color 0.3s ease'
                        }}
                    />
                    <input
                        required
                        type="email"
                        placeholder="College Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        style={{
                            background: 'rgba(10, 25, 47, 0.8)',
                            border: '1px solid rgba(100, 255, 218, 0.3)',
                            padding: '1rem',
                            borderRadius: '12px',
                            color: '#e2e8f0',
                            outline: 'none',
                            width: '100%',
                            boxSizing: 'border-box',
                            fontSize: '1rem',
                            transition: 'border-color 0.3s ease'
                        }}
                    />
                    <input
                        required
                        type="password"
                        placeholder="Create Session Password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        style={{
                            background: 'rgba(10, 25, 47, 0.8)',
                            border: '1px solid rgba(100, 255, 218, 0.3)',
                            padding: '1rem',
                            borderRadius: '12px',
                            color: '#e2e8f0',
                            outline: 'none',
                            width: '100%',
                            boxSizing: 'border-box',
                            fontSize: '1rem',
                            transition: 'border-color 0.3s ease'
                        }}
                    />
                </div>

                <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(100, 255, 218, 0.6)' }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                        background: 'linear-gradient(90deg, #64ffda, #4ade80)',
                        color: '#0a192f',
                        border: 'none',
                        padding: '1rem',
                        borderRadius: '12px',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Initializing Interface...' : 'Authorize Entry'}
                </motion.button>
            </form>
        </motion.div>
    );
};

export default OpenDayEntry;
