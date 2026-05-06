import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const OpenDayGrid = ({ puzzles, onSelectPuzzle, isMobile }) => {
    return (
        <div style={{
            position: 'relative',
            width: '100%',
            height: '80vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'visible'
        }}>
            {puzzles.map((puzzle, index) => {
                // Calculate orbit position
                const angle = (index / puzzles.length) * Math.PI * 2;
                const radius = isMobile ? 110 : 250;
                
                return (
                    <motion.div
                        key={puzzle.id}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ 
                            opacity: 1, 
                            scale: 1,
                            x: [
                                Math.cos(angle) * radius,
                                Math.cos(angle + 0.2) * (radius + 20),
                                Math.cos(angle) * radius
                            ],
                            y: [
                                Math.sin(angle) * radius,
                                Math.sin(angle + 0.2) * (radius - 20),
                                Math.sin(angle) * radius
                            ],
                        }}
                        transition={{
                            opacity: { delay: index * 0.1 },
                            scale: { delay: index * 0.1 },
                            x: { duration: 5 + index, repeat: Infinity, ease: "easeInOut" },
                            y: { duration: 4 + index, repeat: Infinity, ease: "easeInOut" }
                        }}
                        whileHover={{ scale: 1.1, zIndex: 10 }}
                        onClick={() => onSelectPuzzle(puzzle)}
                        style={{
                            position: 'absolute',
                            width: isMobile ? '100px' : '140px',
                            height: isMobile ? '100px' : '140px',
                            background: 'rgba(30, 58, 95, 0.6)',
                            backdropFilter: 'blur(10px)',
                            border: `2px solid ${puzzle.completed ? '#4ade80' : 'rgba(100, 255, 218, 0.3)'}`,
                            borderRadius: '24px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: 'pointer',
                            padding: '1rem',
                            textAlign: 'center',
                            boxShadow: puzzle.completed ? '0 0 20px rgba(74, 222, 128, 0.4)' : '0 0 15px rgba(30, 58, 95, 0.5)'
                        }}
                    >
                        <div style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', marginBottom: '0.5rem' }}>{puzzle.icon}</div>
                        <div style={{ 
                            fontSize: isMobile ? '0.7rem' : '0.9rem', 
                            fontWeight: 'bold', 
                            color: puzzle.completed ? '#4ade80' : '#64ffda' 
                        }}>
                            {puzzle.name}
                        </div>
                        {puzzle.completed && (
                            <div style={{ 
                                position: 'absolute', 
                                top: '-10px', 
                                right: '-10px', 
                                background: '#4ade80', 
                                borderRadius: '50%', 
                                width: '24px', 
                                height: '24px', 
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center',
                                color: '#0a192f',
                                fontSize: '0.8rem'
                            }}>
                                ✓
                            </div>
                        )}
                    </motion.div>
                );
            })}

            {/* Central Core */}
            <motion.div
                animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: 360
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, #64ffda 0%, transparent 70%)',
                    opacity: 0.3,
                    filter: 'blur(10px)'
                }}
            />
        </div>
    );
};

export default OpenDayGrid;
