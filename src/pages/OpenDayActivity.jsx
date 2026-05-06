import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OpenDayEntry from '../components/OpenDay/OpenDayEntry';
import OpenDayGrid from '../components/OpenDay/OpenDayGrid';
import OpenDayFeedback from '../components/OpenDay/OpenDayFeedback';

// Puzzle Imports
import EightPuzzle from '../components/OpenDay/Puzzles/EightPuzzle';
import TowerOfHanoi from '../components/OpenDay/Puzzles/TowerOfHanoi';
import WaterJug from '../components/OpenDay/Puzzles/WaterJug';
import MonkeyBanana from '../components/OpenDay/Puzzles/MonkeyBanana';
import JealousHusband from '../components/OpenDay/Puzzles/JealousHusband';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const OpenDayActivity = ({ onBackToHome, isMobile }) => {
    const [step, setStep] = useState('ENTRY'); // ENTRY, PUZZLES, FEEDBACK, COMPLETED
    const [attemptId, setAttemptId] = useState(null);
    const [puzzles, setPuzzles] = useState([
        { id: 'eight-puzzle', name: '8 Puzzle', icon: '🧩', completed: false, component: EightPuzzle },
        { id: 'hanoi', name: 'Tower of Hanoi', icon: '🗼', completed: false, component: TowerOfHanoi },
        { id: 'water-jug', name: 'Water Jug', icon: '💧', completed: false, component: WaterJug },
        { id: 'monkey-banana', name: 'Monkey & Banana', icon: '🐒', completed: false, component: MonkeyBanana },
        { id: 'jealous-husband', name: 'Jealous Husband', icon: '🛶', completed: false, component: JealousHusband }
    ]);
    const [activePuzzle, setActivePuzzle] = useState(null);

    const handleRegister = async (data) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/open-day/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (response.ok) {
                setAttemptId(result.attemptId);
                setStep('PUZZLES');
            } else {
                alert(result.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Network error. Please try again.');
        }
    };

    const handlePuzzleComplete = async (puzzleId, timeTaken) => {
        try {
            await fetch(`${API_BASE_URL}/api/open-day/puzzle/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ attemptId, puzzleName: puzzleId, timeTaken })
            });
            
            setPuzzles(prev => prev.map(p => p.id === puzzleId ? { ...p, completed: true } : p));
            setActivePuzzle(null);
        } catch (error) {
            console.error('Failed to submit puzzle progress:', error);
        }
    };

    const handleFeedbackSubmit = async (feedback) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/open-day/feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ attemptId, ...feedback })
            });
            if (response.ok) {
                setStep('COMPLETED');
            }
        } catch (error) {
            console.error('Feedback submission failed:', error);
        }
    };

    const renderActivePuzzle = () => {
        if (!activePuzzle) return null;
        const PuzzleComponent = activePuzzle.component;
        return <PuzzleComponent onComplete={(time) => handlePuzzleComplete(activePuzzle.id, time)} />;
    };

    return (
        <div style={{
            minHeight: '100vh',
            width: '100vw',
            position: isMobile ? 'relative' : 'fixed',
            top: 0,
            left: 0,
            zIndex: 100,
            backgroundColor: '#0a192f',
            overflowX: 'hidden',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: isMobile ? 'flex-start' : 'center',
            padding: isMobile ? '4rem 1rem 2rem' : '0'
        }}>
            {/* Zero-Gravity background particles */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
                <div id="stars-container" />
                {/* Floating glow elements */}
                <motion.div
                    animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1],
                        x: [0, 50, 0],
                        y: [0, 30, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity }}
                    style={{
                        position: 'absolute',
                        top: '10%',
                        left: '20%',
                        width: '400px',
                        height: '400px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(100, 255, 218, 0.1) 0%, transparent 70%)',
                        filter: 'blur(60px)'
                    }}
                />
                <motion.div
                    animate={{ 
                        scale: [1, 1.3, 1],
                        opacity: [0.1, 0.15, 0.1],
                        x: [0, -40, 0],
                        y: [0, -60, 0]
                    }}
                    transition={{ duration: 25, repeat: Infinity }}
                    style={{
                        position: 'absolute',
                        bottom: '15%',
                        right: '15%',
                        width: '500px',
                        height: '500px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)',
                        filter: 'blur(80px)'
                    }}
                />
            </div>

            {/* Close Button */}
            <button
                onClick={onBackToHome}
                style={{
                    position: 'absolute',
                    top: isMobile ? '1rem' : '2rem',
                    right: isMobile ? '1rem' : '2rem',
                    background: 'rgba(100, 255, 218, 0.1)',
                    color: '#64ffda',
                    border: '1px solid rgba(100, 255, 218, 0.3)',
                    padding: '0.5rem 1rem',
                    borderRadius: '30px',
                    cursor: 'pointer',
                    zIndex: 1000,
                    fontWeight: 'bold',
                    fontSize: isMobile ? '0.8rem' : '1rem'
                }}
            >
                {isMobile ? '✕' : 'ESC Exit'}
            </button>

            <AnimatePresence mode="wait">
                {step === 'ENTRY' && (
                    <OpenDayEntry onRegister={handleRegister} key="entry" isMobile={isMobile} />
                )}

                {step === 'PUZZLES' && !activePuzzle && (
                    <div key="grid" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <OpenDayGrid puzzles={puzzles} onSelectPuzzle={setActivePuzzle} isMobile={isMobile} />
                        <div style={{ 
                            position: isMobile ? 'relative' : 'fixed', 
                            bottom: isMobile ? '1rem' : '3rem', 
                            left: isMobile ? 'auto' : '50%', 
                            transform: isMobile ? 'none' : 'translateX(-50%)',
                            textAlign: 'center',
                            marginTop: isMobile ? '2rem' : '0',
                            paddingBottom: isMobile ? '2rem' : '0'
                        }}>
                            <p style={{ color: '#94a3b8', marginBottom: '1rem', fontSize: isMobile ? '0.8rem' : '1rem' }}>
                                Complete activities to unlock final verification
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setStep('FEEDBACK')}
                                style={{
                                    background: 'rgba(100, 255, 218, 0.1)',
                                    color: '#64ffda',
                                    border: '1px solid #64ffda',
                                    padding: isMobile ? '0.6rem 1.5rem' : '0.75rem 2rem',
                                    borderRadius: '30px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    fontSize: isMobile ? '0.9rem' : '1rem'
                                }}
                            >
                                Finish Experience
                            </motion.button>
                        </div>
                    </div>
                )}

                {activePuzzle && (
                    <motion.div
                        key="active-puzzle"
                        initial={{ opacity: 0, scale: 0.5, rotateY: 45 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        exit={{ opacity: 0, scale: 0.5, rotateY: -45 }}
                        style={{
                            background: 'rgba(10, 25, 47, 0.95)',
                            backdropFilter: 'blur(20px)',
                            padding: '2rem',
                            borderRadius: '24px',
                            border: '1px solid #64ffda',
                            width: '90%',
                            maxWidth: '800px',
                            zIndex: 200,
                            position: 'relative',
                            boxShadow: '0 0 50px rgba(100, 255, 218, 0.2)'
                        }}
                    >
                        <button 
                            onClick={() => setActivePuzzle(null)}
                            style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            CLOSE
                        </button>
                        <h2 style={{ textAlign: 'center', color: '#64ffda', marginBottom: '1.5rem' }}>{activePuzzle.name}</h2>
                        
                        <div style={{ minHeight: '350px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            {renderActivePuzzle()}
                        </div>
                    </motion.div>
                )}

                {step === 'FEEDBACK' && (
                    <OpenDayFeedback onSubmit={handleFeedbackSubmit} key="feedback" isMobile={isMobile} />
                )}

                {step === 'COMPLETED' && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        key="completed"
                        style={{ textAlign: 'center' }}
                    >
                        <div style={{ fontSize: '5rem', marginBottom: '2rem' }}>🎉</div>
                        <h2 style={{ color: '#64ffda', fontSize: '2.5rem', marginBottom: '1rem' }}>Great Work!</h2>
                        <p style={{ color: '#e2e8f0', fontSize: '1.2rem', marginBottom: '2rem' }}>
                            Your progress has been transmitted to the nexus.
                        </p>
                        <p style={{ color: '#94a3b8', background: 'rgba(100, 255, 218, 0.1)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(100, 255, 218, 0.2)' }}>
                            Check your email <strong>${'shortly'}</strong> for the final attendance verification link.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onBackToHome}
                            style={{
                                marginTop: '3rem',
                                background: '#64ffda',
                                color: '#0a192f',
                                border: 'none',
                                padding: '1rem 2.5rem',
                                borderRadius: '30px',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >
                            Return to Nexus Home
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default OpenDayActivity;
