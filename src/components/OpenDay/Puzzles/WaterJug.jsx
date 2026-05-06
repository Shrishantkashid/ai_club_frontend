import React, { useState } from 'react';
import { motion } from 'framer-motion';

const WaterJug = ({ onComplete }) => {
    const [jugs, setJugs] = useState([0, 0]); // [3L, 5L]
    const capacities = [3, 5];
    const [moves, setMoves] = useState(0);
    const [startTime] = useState(Date.now());
    const target = 4;

    const fill = (i) => {
        const newJugs = [...jugs];
        newJugs[i] = capacities[i];
        setJugs(newJugs);
        setMoves(m => m + 1);
        checkWin(newJugs);
    };

    const empty = (i) => {
        const newJugs = [...jugs];
        newJugs[i] = 0;
        setJugs(newJugs);
        setMoves(m => m + 1);
        checkWin(newJugs);
    };

    const pour = (from, to) => {
        const newJugs = [...jugs];
        const amount = Math.min(newJugs[from], capacities[to] - newJugs[to]);
        newJugs[from] -= amount;
        newJugs[to] += amount;
        setJugs(newJugs);
        setMoves(m => m + 1);
        checkWin(newJugs);
    };

    const checkWin = (currentJugs) => {
        if (currentJugs[1] === target) {
            const timeTaken = Math.round((Date.now() - startTime) / 1000);
            onComplete(timeTaken);
        }
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Goal: Get exactly <strong>4 Liters</strong> in the 5L jug.</p>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', alignItems: 'flex-end', height: '200px' }}>
                {jugs.map((amount, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ 
                            width: '80px', 
                            height: `${capacities[i] * 40}px`, 
                            border: '3px solid rgba(100, 255, 218, 0.5)', 
                            borderTop: 'none',
                            position: 'relative',
                            borderRadius: '0 0 10px 10px',
                            background: 'rgba(30, 58, 95, 0.3)',
                            overflow: 'hidden'
                        }}>
                            <motion.div
                                animate={{ height: `${(amount / capacities[i]) * 100}%` }}
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    width: '100%',
                                    background: 'linear-gradient(to top, #3b82f6, #64ffda)',
                                    boxShadow: '0 0 20px rgba(100, 255, 218, 0.3)'
                                }}
                            />
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontWeight: 'bold', zIndex: 5 }}>
                                {amount}L
                            </div>
                        </div>
                        <div style={{ marginTop: '1rem', color: '#64ffda' }}>{capacities[i]}L Jug</div>
                        <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
                            <button onClick={() => fill(i)} style={btnStyle}>Fill</button>
                            <button onClick={() => empty(i)} style={btnStyle}>Empty</button>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '2rem' }}>
                <button onClick={() => pour(0, 1)} style={pourBtnStyle}>Pour 3L → 5L</button>
                <button onClick={() => pour(1, 0)} style={pourBtnStyle}>Pour 5L → 3L</button>
            </div>

            <div style={{ color: '#64ffda', marginTop: '2rem' }}>Moves: {moves}</div>
        </div>
    );
};

const btnStyle = {
    background: 'rgba(100, 255, 218, 0.1)',
    border: '1px solid #64ffda',
    color: '#64ffda',
    padding: '4px 8px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.8rem'
};

const pourBtnStyle = {
    background: '#64ffda',
    color: '#0a192f',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '20px',
    margin: '0 10px',
    fontWeight: 'bold',
    cursor: 'pointer'
};

export default WaterJug;
