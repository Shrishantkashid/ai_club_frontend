import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import Webcam from 'react-webcam';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const OpenDayVerify = () => {
    const [status, setStatus] = useState('LOADING'); // LOADING, READY, VERIFYING, SUCCESS, ERROR
    const [token, setToken] = useState('');
    const [usn, setUsn] = useState('');
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');
    const [name, setName] = useState('');
    const webcamRef = useRef(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
        const tokenParam = urlParams.get('token');
        const usnParam = urlParams.get('usn');
        
        if (tokenParam && usnParam) {
            setToken(tokenParam);
            setUsn(usnParam);
            fetchDetails(tokenParam, usnParam);
        } else {
            setStatus('ERROR');
            setMessage('Invalid verification link. Please check your email.');
        }
    }, []);

    const fetchDetails = async (t, u) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/open-day/details?token=${t}&usn=${u}`);
            const data = await response.json();
            if (response.ok) {
                setName(data.name);
                if (data.isVerified) {
                    setStatus('SUCCESS');
                } else {
                    setStatus('READY');
                }
            } else {
                setStatus('ERROR');
                setMessage(data.message);
            }
        } catch (error) {
            setStatus('ERROR');
            setMessage('Connection to Nexus lost.');
        }
    };

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImage(imageSrc);
    }, [webcamRef]);

    const handleVerify = async () => {
        if (!image) return;
        setStatus('VERIFYING');
        try {
            const response = await fetch(`${API_BASE_URL}/api/open-day/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, usn, finalPhoto: image })
            });
            const result = await response.json();
            if (response.ok) {
                setStatus('SUCCESS');
            } else {
                setStatus('ERROR');
                setMessage(result.message);
            }
        } catch (error) {
            setStatus('ERROR');
            setMessage('Transmission failed.');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            width: '100vw',
            backgroundColor: '#0a192f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#e2e8f0',
            overflow: 'hidden'
        }}>
            {/* Background elements */}
            <div style={{ position: 'absolute', width: '100%', height: '100%', background: 'radial-gradient(circle at center, #112240 0%, #0a192f 100%)', zIndex: 0 }} />
            
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                style={{
                    background: 'rgba(17, 34, 64, 0.7)',
                    backdropFilter: 'blur(15px)',
                    padding: '3rem',
                    borderRadius: '30px',
                    border: '1px solid rgba(100, 255, 218, 0.2)',
                    maxWidth: '500px',
                    width: '90%',
                    textAlign: 'center',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                    zIndex: 1,
                    position: 'relative'
                }}
            >
                {/* Holographic scanner effect */}
                <motion.div 
                    animate={{ y: [0, 400, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: 'linear-gradient(90deg, transparent, #64ffda, transparent)',
                        opacity: 0.3,
                        zIndex: 2
                    }}
                />

                {status === 'LOADING' && (
                    <div style={{ padding: '2rem' }}>
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            style={{ fontSize: '3rem', marginBottom: '1rem' }}
                        >
                            🌀
                        </motion.div>
                        <p style={{ color: '#64ffda', letterSpacing: '2px' }}>DECODING PACKET...</p>
                    </div>
                )}

                {status === 'READY' && (
                    <>
                        <h2 style={{ color: '#64ffda', marginBottom: '0.5rem', fontSize: '2rem', textTransform: 'uppercase', letterSpacing: '3px' }}>Identity Link</h2>
                        <div style={{ height: '2px', width: '50px', background: '#64ffda', margin: '0 auto 2rem' }} />
                        
                        {/* Prefilled non-editable info */}
                        <div style={{ marginBottom: '2rem', textAlign: 'left', background: 'rgba(10, 25, 47, 0.5)', padding: '1.5rem', borderRadius: '15px', border: '1px solid rgba(100, 255, 218, 0.1)' }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.7rem', color: '#64ffda', textTransform: 'uppercase', marginBottom: '0.3rem', opacity: 0.7 }}>Subject Name</label>
                                <div style={{ fontSize: '1.2rem', color: '#e2e8f0', fontWeight: 'bold' }}>{name || '...'}</div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.7rem', color: '#64ffda', textTransform: 'uppercase', marginBottom: '0.3rem', opacity: 0.7 }}>Nexus ID (USN)</label>
                                <div style={{ fontSize: '1.2rem', color: '#e2e8f0', fontWeight: 'bold' }}>{usn}</div>
                            </div>
                        </div>

                        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                            Please align your face for the final verification snapshot.
                        </p>
                        
                        <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', border: '2px solid rgba(100, 255, 218, 0.3)', marginBottom: '2rem', background: '#000' }}>
                            {!image ? (
                                <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    style={{ width: '100%', display: 'block', filter: 'contrast(1.1) brightness(1.1)' }}
                                />
                            ) : (
                                <motion.img initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={image} alt="Captured" style={{ width: '100%', display: 'block' }} />
                            )}
                            
                            {/* Camera overlay corners */}
                            <div style={{ position: 'absolute', top: '10px', left: '10px', width: '20px', height: '20px', borderTop: '2px solid #64ffda', borderLeft: '2px solid #64ffda' }} />
                            <div style={{ position: 'absolute', top: '10px', right: '10px', width: '20px', height: '20px', borderTop: '2px solid #64ffda', borderRight: '2px solid #64ffda' }} />
                            <div style={{ position: 'absolute', bottom: '10px', left: '10px', width: '20px', height: '20px', borderBottom: '2px solid #64ffda', borderLeft: '2px solid #64ffda' }} />
                            <div style={{ position: 'absolute', bottom: '10px', right: '10px', width: '20px', height: '20px', borderBottom: '2px solid #64ffda', borderRight: '2px solid #64ffda' }} />

                            <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}>
                                <motion.button
                                    whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(100, 255, 218, 0.5)' }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={image ? () => setImage(null) : capture}
                                    style={{ 
                                        background: '#64ffda', 
                                        color: '#0a192f', 
                                        border: 'none', 
                                        padding: '0.7rem 1.5rem', 
                                        borderRadius: '30px', 
                                        fontWeight: 'bold', 
                                        cursor: 'pointer',
                                        fontSize: '0.8rem',
                                        textTransform: 'uppercase'
                                    }}
                                >
                                    {image ? 'Retake Bio-Scan' : 'Capture Scan'}
                                </motion.button>
                            </div>
                        </div>

                        <motion.button
                            onClick={handleVerify}
                            disabled={!image}
                            whileHover={image ? { scale: 1.05, background: '#64ffda', color: '#0a192f' } : {}}
                            style={{
                                background: image ? 'rgba(100, 255, 218, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                                color: image ? '#64ffda' : 'rgba(255, 255, 255, 0.2)',
                                border: `1px solid ${image ? '#64ffda' : 'transparent'}`,
                                padding: '1.2rem 2.5rem',
                                borderRadius: '40px',
                                fontWeight: 'bold',
                                cursor: image ? 'pointer' : 'not-allowed',
                                width: '100%',
                                fontSize: '1rem',
                                textTransform: 'uppercase',
                                letterSpacing: '2px',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            Finalize Attendance
                        </motion.button>
                    </>
                )}

                {status === 'VERIFYING' && (
                    <div style={{ padding: '3rem' }}>
                        <motion.div 
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            style={{ fontSize: '3rem', marginBottom: '2rem' }}
                        >
                            📡
                        </motion.div>
                        <h3 style={{ color: '#64ffda', letterSpacing: '3px' }}>TRANSMITTING...</h3>
                        <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '1rem' }}>Uploading bio-data to centralized server.</p>
                    </div>
                )}

                {status === 'SUCCESS' && (
                    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                        <div style={{ width: '80px', height: '80px', background: 'rgba(100, 255, 218, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', border: '2px solid #64ffda' }}>
                            <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", damping: 10, stiffness: 100 }}
                                style={{ fontSize: '2.5rem' }}
                            >
                                ✓
                            </motion.div>
                        </div>
                        <h2 style={{ color: '#64ffda', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Scan Verified</h2>
                        <p style={{ color: '#e2e8f0' }}>Attendance logged for <strong>{name}</strong>.</p>
                        <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(100, 255, 218, 0.05)', borderRadius: '15px', border: '1px dashed rgba(100, 255, 218, 0.3)' }}>
                            <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0 }}>Timestamp recorded. You may now safely disconnect from the Nexus.</p>
                        </div>
                    </motion.div>
                )}

                {status === 'ERROR' && (
                    <div style={{ color: '#f87171' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
                        <h2 style={{ marginBottom: '1rem', textTransform: 'uppercase' }}>Link Corrupted</h2>
                        <p>{message}</p>
                        <button 
                            onClick={() => window.location.reload()}
                            style={{ marginTop: '2rem', background: 'none', border: '1px solid #f87171', color: '#f87171', padding: '0.5rem 1rem', borderRadius: '20px', cursor: 'pointer' }}
                        >
                            Retry Handshake
                        </button>
                    </div>
                )}
            </motion.div>

            {/* Floating decorative elements */}
            <div style={{ position: 'absolute', top: '10%', left: '5%', width: '100px', height: '100px', background: 'radial-gradient(circle, rgba(100, 255, 218, 0.1) 0%, transparent 70%)', filter: 'blur(20px)' }} />
            <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, transparent 70%)', filter: 'blur(30px)' }} />
        </div>
    );
};

export default OpenDayVerify;
