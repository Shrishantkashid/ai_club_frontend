import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const JealousHusband = ({ onComplete }) => {
    // Simplified version: 3 couples cross the river
    const [leftSide, setLeftSide] = useState(['H1', 'W1', 'H2', 'W2', 'H3', 'W3']);
    const [rightSide, setRightSide] = useState([]);
    const [boat, setBoat] = useState([]);
    const [boatPos, setBoatPos] = useState('left'); // left, right
    const [moves, setMoves] = useState(0);
    const [startTime] = useState(Date.now());

    const toggleBoat = (person, from) => {
        if (from === 'shore') {
            if (boat.length >= 2) return;
            // Person must be on the same side as the boat
            const isOnBoatSide = boatPos === 'left' ? leftSide.includes(person) : rightSide.includes(person);
            if (!isOnBoatSide) return;

            if (boatPos === 'left') setLeftSide(prev => prev.filter(p => p !== person));
            else setRightSide(prev => prev.filter(p => p !== person));
            setBoat(prev => [...prev, person]);
        } else {
            setBoat(prev => prev.filter(p => p !== person));
            if (boatPos === 'left') setLeftSide(prev => [...prev, person]);
            else setRightSide(prev => [...prev, person]);
        }
    };

    const crossRiver = () => {
        if (boat.length === 0) return;
        
        // Validation logic
        const nextBoatPos = boatPos === 'left' ? 'right' : 'left';
        const nextLeft = boatPos === 'left' ? leftSide : [...leftSide, ...boat];
        const nextRight = boatPos === 'right' ? rightSide : [...rightSide, ...boat];

        if (!isValid(nextLeft) || !isValid(nextRight)) {
            alert("Rule Violated: A wife cannot be with another husband without her own husband present!");
            return;
        }

        setBoatPos(nextBoatPos);
        setMoves(m => m + 1);
        
        if (nextRight.length === 6 && boat.length === 0) {
            // This won't happen here, check win after unloading
        }
    };

    const unloadBoat = () => {
        if (boat.length === 0) return;
        const newSide = boatPos === 'left' ? [...leftSide, ...boat] : [...rightSide, ...boat];
        
        if (!isValid(newSide)) {
            alert("Rule Violated: A wife cannot be with another husband without her own husband present!");
            return;
        }

        if (boatPos === 'left') setLeftSide(newSide);
        else {
            setRightSide(newSide);
            if (newSide.length === 6) {
                const timeTaken = Math.round((Date.now() - startTime) / 1000);
                onComplete(timeTaken);
            }
        }
        setBoat([]);
    };

    const isValid = (side) => {
        const husbands = side.filter(p => p.startsWith('H'));
        const wives = side.filter(p => p.startsWith('W'));
        
        for (const wife of wives) {
            const coupleId = wife[1];
            const husbandPresent = side.includes(`H${coupleId}`);
            if (!husbandPresent && husbands.length > 0) return false;
        }
        return true;
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>3 couples must cross. A wife cannot be with another husband without her own husband.</p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', height: '200px', background: 'rgba(30, 58, 95, 0.2)', borderRadius: '16px', padding: '1rem', position: 'relative' }}>
                {/* Left Shore */}
                <div style={{ width: '30%', minWidth: '80px', borderRight: '2px dashed rgba(100, 255, 218, 0.2)' }}>
                    <div style={{ marginBottom: '10px', fontSize: '0.8rem', color: '#64ffda' }}>Left Bank</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                        {leftSide.map(p => <Person key={p} name={p} onClick={() => toggleBoat(p, 'shore')} />)}
                    </div>
                </div>

                {/* River */}
                <div style={{ flex: 1, display: 'flex', justifyContent: boatPos === 'left' ? 'flex-start' : 'flex-end', alignItems: 'center', padding: '0 20px' }}>
                    <motion.div
                        layout
                        style={{ width: '100px', height: '50px', background: '#475569', borderRadius: '30px 30px 10px 10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', cursor: 'pointer' }}
                    >
                        {boat.map(p => <Person key={p} name={p} onClick={() => toggleBoat(p, 'boat')} isSmall />)}
                    </motion.div>
                </div>

                {/* Right Shore */}
                <div style={{ width: '30%', minWidth: '80px', borderLeft: '2px dashed rgba(100, 255, 218, 0.2)' }}>
                    <div style={{ marginBottom: '10px', fontSize: '0.8rem', color: '#64ffda' }}>Right Bank</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                        {rightSide.map(p => <Person key={p} name={p} onClick={() => toggleBoat(p, 'shore')} />)}
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <button onClick={crossRiver} disabled={boat.length === 0} style={btnStyle}>Cross River</button>
                <button onClick={unloadBoat} disabled={boat.length === 0} style={btnStyle}>Unload Boat</button>
            </div>
            
            <div style={{ color: '#64ffda', marginTop: '1rem' }}>Moves: {moves}</div>
        </div>
    );
};

const Person = ({ name, onClick, isSmall }) => (
    <div 
        onClick={onClick}
        style={{ 
            width: isSmall ? '30px' : '45px', 
            height: isSmall ? '30px' : '45px', 
            background: name.startsWith('H') ? '#3b82f6' : '#ec4899', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: isSmall ? '0.6rem' : '0.8rem', 
            color: 'white', 
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
        }}
    >
        {name}
    </div>
);

const btnStyle = {
    background: '#64ffda',
    color: '#0a192f',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '20px',
    fontWeight: 'bold',
    cursor: 'pointer'
};

export default JealousHusband;
