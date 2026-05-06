import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const OpenDayFeedback = ({ onSubmit, isMobile }) => {
    const [rating, setRating] = useState(5);
    const [comments, setComments] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await onSubmit({ rating, comments });
        setLoading(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: 90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            style={{
                background: 'rgba(30, 58, 95, 0.4)',
                backdropFilter: 'blur(15px)',
                padding: isMobile ? '1.5rem' : '3rem',
                borderRadius: '32px',
                border: '1px solid rgba(100, 255, 218, 0.3)',
                maxWidth: '600px',
                width: '100%',
                margin: isMobile ? '0' : '2rem auto',
                textAlign: 'center'
            }}
        >
            <h2 style={{ color: '#64ffda', marginBottom: '1.5rem', fontSize: isMobile ? '1.5rem' : '2rem' }}>Experience Feedback</h2>
            <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>How did you like the AI Club Zero-Gravity interface?</p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button
                            key={star}
                            type="button"
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setRating(star)}
                            style={{
                                background: 'none',
                                border: 'none',
                                fontSize: isMobile ? '1.8rem' : '2.5rem',
                                cursor: 'pointer',
                                color: star <= rating ? '#fbbf24' : 'rgba(255, 255, 255, 0.1)',
                                filter: star <= rating ? 'drop-shadow(0 0 10px rgba(251, 191, 36, 0.5))' : 'none'
                            }}
                        >
                            ⭐
                        </motion.button>
                    ))}
                </div>

                <textarea
                    placeholder="Tell us about your experience..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    style={{
                        background: 'rgba(10, 25, 47, 0.8)',
                        border: '1px solid rgba(100, 255, 218, 0.2)',
                        padding: '1rem',
                        borderRadius: '12px',
                        color: '#e2e8f0',
                        minHeight: '120px',
                        fontSize: '1rem',
                        outline: 'none',
                        resize: 'none',
                        width: '100%',
                        boxSizing: 'border-box'
                    }}
                />

                <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(100, 255, 218, 0.5)' }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                        background: '#64ffda',
                        color: '#0a192f',
                        border: 'none',
                        padding: '1rem',
                        borderRadius: '16px',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Transmitting Data...' : 'Submit Feedback & Exit'}
                </motion.button>
            </form>
        </motion.div>
    );
};

export default OpenDayFeedback;
