import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import Webcam from 'react-webcam';

const OpenDayEntry = ({ onRegister }) => {
    const [formData, setFormData] = useState({ name: '', usn: '', email: '' });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const webcamRef = useRef(null);

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
                padding: '2.5rem',
                borderRadius: '24px',
                border: '1px solid rgba(100, 255, 218, 0.3)',
                boxShadow: '0 0 40px rgba(100, 255, 218, 0.1)',
                maxWidth: '500px',
                width: '90%',
                margin: '2rem auto',
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
                marginBottom: '2rem',
                fontSize: '1.8rem',
                textShadow: '0 0 10px rgba(100, 255, 218, 0.5)'
            }}>
                ID Verification
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '2px solid rgba(100, 255, 218, 0.2)' }}>
                    {!image ? (
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            style={{ width: '100%', display: 'block' }}
                        />
                    ) : (
                        <img src={image} alt="Captured" style={{ width: '100%', display: 'block' }} />
                    )}
                    <div style={{ 
                        position: 'absolute', 
                        bottom: '10px', 
                        left: '50%', 
                        transform: 'translateX(-50%)',
                        zIndex: 2
                    }}>
                        <motion.button
                            type="button"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={image ? () => setImage(null) : capture}
                            style={{
                                background: '#64ffda',
                                color: '#0a192f',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '20px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                boxShadow: '0 0 15px rgba(100, 255, 218, 0.4)'
                            }}
                        >
                            {image ? 'Retake' : 'Capture Photo'}
                        </motion.button>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <input
                        required
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        style={{
                            background: 'rgba(10, 25, 47, 0.8)',
                            border: '1px solid rgba(100, 255, 218, 0.2)',
                            padding: '0.8rem',
                            borderRadius: '8px',
                            color: '#e2e8f0',
                            outline: 'none'
                        }}
                    />
                    <input
                        required
                        placeholder="USN (e.g. 1SV22CS001)"
                        value={formData.usn}
                        onChange={(e) => setFormData({ ...formData, usn: e.target.value.toUpperCase() })}
                        style={{
                            background: 'rgba(10, 25, 47, 0.8)',
                            border: '1px solid rgba(100, 255, 218, 0.2)',
                            padding: '0.8rem',
                            borderRadius: '8px',
                            color: '#e2e8f0',
                            outline: 'none'
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
                            border: '1px solid rgba(100, 255, 218, 0.2)',
                            padding: '0.8rem',
                            borderRadius: '8px',
                            color: '#e2e8f0',
                            outline: 'none'
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
