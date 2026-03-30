import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
// REMOVED: import './FloatingCombatText.css'; // CAUSES CSS POLLUTION - loaded centrally

/**
 * Floating Combat Text Component
 * Displays damage, healing, and other combat feedback floating above tokens
 */
const FloatingCombatText = ({
    text,
    type = 'damage', // 'damage', 'heal', 'mana', 'mana-loss', 'ap', 'ap-loss'
    position,
    onComplete,
    duration = 2000
}) => {
    const [isVisible, setIsVisible] = useState(true);
    const [animationPhase, setAnimationPhase] = useState('enter');
    const randomArc = useRef((Math.random() - 0.5) * 100).current;
    const randomAngle = useRef((Math.random() - 0.5) * 20).current;

    useEffect(() => {
        // Start animation sequence
        const startTimer = setTimeout(() => {
            setAnimationPhase('active');
        }, 50);

        // Start fade out animation before completion
        const fadeTimer = setTimeout(() => {
            setAnimationPhase('exit');
        }, duration - 400);

        // Complete animation and cleanup
        const completeTimer = setTimeout(() => {
            setIsVisible(false);
            if (onComplete) {
                onComplete();
            }
        }, duration);

        return () => {
            clearTimeout(startTimer);
            clearTimeout(fadeTimer);
            clearTimeout(completeTimer);
        };
    }, [duration, onComplete]);

    if (!isVisible) return null;

    const getTextColor = () => {
        switch (type) {
            case 'damage': return '#ff4444';
            case 'heal': return '#44ff44';
            case 'mana': return '#4444ff';
            case 'mana-loss': return '#ffbb00';
            case 'ap': return '#00ffff';
            case 'ap-loss': return '#ff00ff';
            default: return '#ffffff';
        }
    };

    const getPrefix = () => {
        switch (type) {
            case 'damage': return '-';
            case 'heal': return '+';
            case 'mana': return '+';
            case 'mana-loss': return '-';
            case 'ap': return '+';
            case 'ap-loss': return '-';
            default: return '';
        }
    };

    // Inline style for the fountain animation
    const fountainStyle = `
        @keyframes fct-fountain-${randomArc.toFixed(0)} {
            0% { 
                transform: translate(-50%, 0) scale(0.5); 
                opacity: 0; 
            }
            15% { 
                transform: translate(-50%, -100px) scale(1.4) rotate(${randomAngle}deg); 
                opacity: 1; 
            }
            30% { 
                transform: translate(calc(-50% + ${randomArc}px), -130px) scale(1.1) rotate(${randomAngle * 0.5}deg); 
            }
            100% { 
                transform: translate(calc(-50% + ${randomArc * 1.5}px), -80px) scale(0.9) rotate(${randomAngle * 0.2}deg); 
                opacity: 0; 
            }
        }
    `;

    return createPortal(
        <>
            <style>{fountainStyle}</style>
            <div
                className={`floating-combat-text ${type} ${animationPhase}`}
                style={{
                    position: 'fixed',
                    left: position.x,
                    top: position.y,
                    color: getTextColor(),
                    zIndex: 10000,
                    pointerEvents: 'none',
                    fontFamily: "'Cinzel', serif",
                    fontSize: '32px',
                    fontWeight: '900',
                    textShadow: '0 0 4px rgba(0,0,0,1), 2px 2px 0 rgba(0,0,0,0.8)',
                    userSelect: 'none',
                    animation: `fct-fountain-${randomArc.toFixed(0)} ${duration}ms cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards`,
                    whiteSpace: 'nowrap',
                    filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))'
                }}
            >
                {getPrefix()}{text}
            </div>
        </>,
        document.body
    );
};

/**
 * Floating Combat Text Manager
 * Manages multiple floating text instances with sequential delay
 */
export const FloatingCombatTextManager = () => {
    const [activeTexts, setActiveTexts] = useState([]);
    const lastTextTimeRef = useRef(0);
    const messageQueueRef = useRef([]);
    const processingQueueRef = useRef(false);

    // Process the message queue with delays
    const processQueue = useCallback(() => {
        if (messageQueueRef.current.length === 0) {
            processingQueueRef.current = false;
            return;
        }

        processingQueueRef.current = true;
        const nextMessage = messageQueueRef.current.shift();

        setActiveTexts(prev => [...prev, nextMessage]);

        // Schedule next message
        setTimeout(() => {
            processQueue();
        }, 400); // 400ms delay between messages
    }, []);

    // Function to add new floating text
    const addFloatingText = (text, type, position) => {
        const id = Date.now() + Math.random();
        const newText = {
            id,
            text,
            type,
            position: {
                x: position.x + (Math.random() - 0.5) * 30, // Slight horizontal jitter
                y: position.y - 40
            }
        };

        messageQueueRef.current.push(newText);

        if (!processingQueueRef.current) {
            processQueue();
        }
    };

    // Expose the function globally for easy access
    useEffect(() => {
        window.showFloatingCombatText = addFloatingText;

        return () => {
            delete window.showFloatingCombatText;
        };
    }, []);

    return (
        <>
            {activeTexts.map(textData => (
                <FloatingCombatText
                    key={textData.id}
                    text={textData.text}
                    type={textData.type}
                    position={textData.position}
                    onComplete={() => {
                        setActiveTexts(prev => prev.filter(t => t.id !== textData.id));
                    }}
                />
            ))}
        </>
    );
};

export default FloatingCombatText;
