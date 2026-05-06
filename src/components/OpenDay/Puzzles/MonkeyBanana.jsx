import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MonkeyBanana = ({ onComplete }) => {
    const [state, setState] = useState({
        monkeyPos: 'A', // A, B, C
        boxPos: 'C',    // A, B, C
        onBox: false,
        hasBanana: false
    });
    const [moves, setMoves] = useState(0);
    const bananaPos = 'B';
    const [startTime] = useState(Date.now());

    const moveMonkey = (to) => {
        if (state.onBox) return; // Cannot move while on box
        setState(s => ({ ...s, monkeyPos: to }));
        setMoves(m => m + 1);
    };

    const pushBox = (to) => {
        if (state.monkeyPos !== state.boxPos || state.onBox) return;
        setState(s => ({ ...s, monkeyPos: to, boxPos: to }));
        setMoves(m => m + 1);
    };

    const climbBox = () => {
        if (state.monkeyPos !== state.boxPos) return;
        setState(s => ({ ...s, onBox: true }));
        setMoves(m => m + 1);
    };

    const jumpDown = () => {
        setState(s => ({ ...s, onBox: false }));
        setMoves(m => m + 1);
    };

    const grabBanana = () => {
        if (state.onBox && state.boxPos === bananaPos) {
            setState(s => ({ ...s, hasBanana: true }));
            const timeTaken = Math.round((Date.now() - startTime) / 1000);
            onComplete(timeTaken);
        }
    };

    return (
        <div style={{ textAlign: 'center', color: '#e2e8f0' }}>
            <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Help the monkey reach the banana! It's hanging high at Position B.</p>
            
            <div style={{ position: 'relative', height: '200px', borderBottom: '2px solid rgba(100, 255, 218, 0.3)', marginBottom: '2rem' }}>
                {/* Banana */}
                <motion.div 
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', fontSize: '3rem' }}
                >
                    🍌
                </motion.div>

                {/* Positions */}
                <div style={{ position: 'absolute', bottom: '-25px', width: '100%', display: 'flex', justifyContent: 'space-around' }}>
                    <span>Pos A</span>
                    <span>Pos B</span>
                    <span>Pos C</span>
                </div>

                {/* Box */}
                <motion.div
                    animate={{ 
                        left: state.boxPos === 'A' ? '15%' : state.boxPos === 'B' ? '45%' : '75%' 
                    }}
                    style={{ position: 'absolute', bottom: 0, width: '60px', height: '60px', background: '#b45309', borderRadius: '4px', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}
                >
                    📦
                </motion.div>

                {/* Monkey */}
                <motion.div
                    animate={{ 
                        left: state.monkeyPos === 'A' ? '15%' : state.monkeyPos === 'B' ? '45%' : '75%',
                        bottom: state.onBox ? '60px' : '0px'
                    }}
                    style={{ position: 'absolute', width: '60px', height: '60px', zIndex: 2, fontSize: '3rem' }}
                >
                    {state.hasBanana ? '🐵' : '🐒'}
                </motion.div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', width: '100%', maxWidth: '500px', margin: '0 auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button onClick={() => moveMonkey('A')} style={actBtnStyle}>Go to A</button>
                    <button onClick={() => moveMonkey('B')} style={actBtnStyle}>Go to B</button>
                    <button onClick={() => moveMonkey('C')} style={actBtnStyle}>Go to C</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button onClick={() => pushBox('A')} disabled={state.monkeyPos !== state.boxPos} style={actBtnStyle}>Push to A</button>
                    <button onClick={() => pushBox('B')} disabled={state.monkeyPos !== state.boxPos} style={actBtnStyle}>Push to B</button>
                    <button onClick={() => pushBox('C')} disabled={state.monkeyPos !== state.boxPos} style={actBtnStyle}>Push to C</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button onClick={state.onBox ? jumpDown : climbBox} style={actBtnStyle}>{state.onBox ? 'Jump Down' : 'Climb Box'}</button>
                    <button onClick={grabBanana} disabled={!state.onBox || state.boxPos !== bananaPos} style={{ ...actBtnStyle, background: '#64ffda', color: '#0a192f' }}>Grab Banana!</button>
                </div>
            </div>
            
            <div style={{ color: '#64ffda', marginTop: '2rem' }}>Moves: {moves}</div>
        </div>
    );
};

const actBtnStyle = {
    background: 'rgba(30, 58, 95, 0.8)',
    border: '1px solid rgba(100, 255, 218, 0.3)',
    color: '#e2e8f0',
    padding: '8px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem'
};

export default MonkeyBanana;
