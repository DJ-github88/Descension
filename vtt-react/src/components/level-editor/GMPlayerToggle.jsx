import React, { useState, useRef } from 'react';
import Draggable from 'react-draggable';
import useGameStore from '../../store/gameStore';
import './styles/GMPlayerToggle.css';

const GMPlayerToggle = () => {
    const { isGMMode, toggleGMMode, isInMultiplayer } = useGameStore();
    const [isDragging, setIsDragging] = useState(false);
    const nodeRef = useRef(null);

    const handleStart = () => {
        setIsDragging(true);
    };

    const handleStop = () => {
        // Small delay to prevent click from firing immediately after drag
        setTimeout(() => setIsDragging(false), 100);
    };

    const handleClick = (e) => {
        // Only toggle if we're not dragging and not in multiplayer
        if (!isDragging && !isInMultiplayer) {
            toggleGMMode();
        }
    };

    return (
        <Draggable
            nodeRef={nodeRef}
            handle=".drag-handle"
            onStart={handleStart}
            onStop={handleStop}
            defaultPosition={{ x: 0, y: 0 }}
        >
            <div
                ref={nodeRef}
                className={`gm-player-toggle-container ${isGMMode ? 'gm-mode' : 'player-mode'}`}
            >
                <div className="drag-handle" title="Drag to move">
                    ⋮⋮
                </div>
                <button
                    className={`gm-player-toggle-button ${isInMultiplayer ? 'disabled' : ''}`}
                    onClick={handleClick}
                    disabled={isInMultiplayer}
                    title={isInMultiplayer
                        ? 'Mode locked in multiplayer - determined by room role'
                        : (isGMMode ? 'Switch to Player View (fog blocks visibility)' : 'Switch to GM View (see through fog)')
                    }
                >
                    <span className="mode-text">
                        {isGMMode ? 'GM' : 'Player'}
                        {isInMultiplayer && isGMMode && ' 👑'}
                    </span>
                </button>
            </div>
        </Draggable>
    );
};

export default GMPlayerToggle;
