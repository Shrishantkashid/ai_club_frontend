import React, { useState, useEffect } from 'react';
import { motion, LayoutGroup } from 'framer-motion';

const EightPuzzle = ({ onComplete }) => {
    const createInitialPuzzle = () => {
        const tiles = [1, 2, 3, 4, 5, 6, 7, 8, null];
        return tiles;
    };

    const shufflePuzzle = (tiles) => {
        const shuffled = [...tiles];
        // Perform 100 random valid moves to ensure solvability
        let emptyIndex = shuffled.indexOf(null);
        for (let i = 0; i < 100; i++) {
            const possibleMoves = [];
            const row = Math.floor(emptyIndex / 3);
            const col = emptyIndex % 3;
            
            if (row > 0) possibleMoves.push(emptyIndex - 3);
            if (row < 2) possibleMoves.push(emptyIndex + 3);
            if (col > 0) possibleMoves.push(emptyIndex - 1);
            if (col < 2) possibleMoves.push(emptyIndex + 1);
            
            const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            [shuffled[emptyIndex], shuffled[move]] = [shuffled[move], shuffled[emptyIndex]];
            emptyIndex = move;
        }
        return shuffled;
    };

    const [tiles, setTiles] = useState(shufflePuzzle(createInitialPuzzle()));
    const [moves, setMoves] = useState(0);
    const [startTime] = useState(Date.now());

    const moveTile = (index) => {
        const emptyIndex = tiles.indexOf(null);
        const row = Math.floor(index / 3);
        const col = index % 3;
        const emptyRow = Math.floor(emptyIndex / 3);
        const emptyCol = emptyIndex % 3;

        if (Math.abs(row - emptyRow) + Math.abs(col - emptyCol) === 1) {
            const newTiles = [...tiles];
            [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
            setTiles(newTiles);
            setMoves(prev => prev + 1);

            // Check win
            if (newTiles.every((tile, i) => tile === (i === 8 ? null : i + 1))) {
                const timeTaken = Math.round((Date.now() - startTime) / 1000);
                onComplete(timeTaken);
            }
        }
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>Arrange the tiles in numerical order (1-8).</p>
            <LayoutGroup>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '10px',
                    width: '300px',
                    margin: '0 auto'
                }}>
                    {tiles.map((tile, i) => (
                        <motion.div
                            key={tile || 'empty'}
                            layout
                            onClick={() => moveTile(i)}
                            style={{
                                width: '90px',
                                height: '90px',
                                background: tile ? 'rgba(100, 255, 218, 0.1)' : 'transparent',
                                border: tile ? '2px solid #64ffda' : '2px dashed rgba(100, 255, 218, 0.2)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.5rem',
                                color: '#64ffda',
                                fontWeight: 'bold',
                                cursor: tile ? 'pointer' : 'default'
                            }}
                        >
                            {tile}
                        </motion.div>
                    ))}
                </div>
            </LayoutGroup>
            <div style={{ marginTop: '2rem', color: '#64ffda' }}>Moves: {moves}</div>
        </div>
    );
};

export default EightPuzzle;
