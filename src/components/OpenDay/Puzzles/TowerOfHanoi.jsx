import React, { useState } from 'react';
import { motion } from 'framer-motion';

const TowerOfHanoi = ({ onComplete }) => {
    const [poles, setPoles] = useState([
        [3, 2, 1],
        [],
        []
    ]);
    const [selectedDisk, setSelectedDisk] = useState(null);
    const [selectedPole, setSelectedPole] = useState(null);
    const [moves, setMoves] = useState(0);
    const [startTime] = useState(Date.now());

    const handlePoleClick = (poleIndex) => {
        if (selectedDisk === null) {
            // Select disk from top of pole
            if (poles[poleIndex].length > 0) {
                const newPoles = [...poles];
                const disk = newPoles[poleIndex].pop();
                setSelectedDisk(disk);
                setSelectedPole(poleIndex);
                setPoles(newPoles);
            }
        } else {
            // Try to place disk
            const targetPole = poles[poleIndex];
            if (targetPole.length === 0 || targetPole[targetPole.length - 1] > selectedDisk) {
                const newPoles = [...poles];
                newPoles[poleIndex].push(selectedDisk);
                setPoles(newPoles);
                setSelectedDisk(null);
                setSelectedPole(null);
                setMoves(prev => prev + 1);

                // Check win (all disks on pole 1 or 2 - assuming starting on 0)
                if (poleIndex !== 0 && newPoles[poleIndex].length === 3) {
                    const timeTaken = Math.round((Date.now() - startTime) / 1000);
                    onComplete(timeTaken);
                }
            } else {
                // Invalid move - return to original pole
                const newPoles = [...poles];
                newPoles[selectedPole].push(selectedDisk);
                setPoles(newPoles);
                setSelectedDisk(null);
                setSelectedPole(null);
            }
        }
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Move all disks to another pole. Larger disks cannot be placed on smaller ones.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', height: '200px', alignItems: 'flex-end', overflow: 'hidden' }}>
                {poles.map((pole, i) => (
                    <div 
                        key={i} 
                        onClick={() => handlePoleClick(i)}
                        style={{ 
                            width: '80px', 
                            height: '100%', 
                            position: 'relative', 
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column-reverse',
                            alignItems: 'center',
                            gap: '5px'
                        }}
                    >
                        {/* Pole stick */}
                        <div style={{ position: 'absolute', bottom: 0, width: '8px', height: '150px', background: 'rgba(100, 255, 218, 0.3)', borderRadius: '4px' }} />
                        
                        {pole.map((disk, di) => (
                            <motion.div
                                key={disk}
                                layoutId={`disk-${disk}`}
                                style={{
                                    width: `${40 + disk * 20}px`,
                                    height: '24px',
                                    background: '#64ffda',
                                    borderRadius: '12px',
                                    zIndex: 2,
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                                }}
                            />
                        ))}
                    </div>
                ))}
            </div>
            
            <div style={{ height: '50px', marginTop: '20px' }}>
                {selectedDisk && (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        style={{
                            width: `${40 + selectedDisk * 20}px`,
                            height: '24px',
                            background: '#4ade80',
                            borderRadius: '12px',
                            margin: '0 auto',
                            boxShadow: '0 0 15px rgba(74, 222, 128, 0.5)'
                        }}
                    />
                )}
            </div>
            
            <div style={{ color: '#64ffda', marginTop: '1rem' }}>Moves: {moves}</div>
        </div>
    );
};

export default TowerOfHanoi;
