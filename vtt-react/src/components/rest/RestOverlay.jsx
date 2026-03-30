import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './RestOverlay.css';

const REST_MESSAGES = {
    short: [
        "You take a moment to catch your breath, finding solace in the quiet moments between adventures.",
        "The party settles down for a brief respite, tending to wounds and gathering strength.",
        "A short rest brings welcome relief as you bandage wounds and share quiet words.",
        "You find a peaceful spot to rest, the gentle rhythm of your breathing bringing calm.",
        "The group takes a well-deserved break, the tension of battle slowly fading away."
    ],
    long: [
        "As night falls, you rest after a long day of adventures. The stars watch over you as you drift into peaceful slumber.",
        "You settle into your camp, the warmth of the fire and the comfort of rest restoring your weary body and mind.",
        "After a day filled with trials and triumphs, you find rest. The darkness brings healing and renewal.",
        "The party makes camp, and as the hours pass, deep rest restores your strength and clears your mind.",
        "You rest after a long day of adventures, the quiet of the night bringing peace and restoration."
    ]
};

const RestOverlay = ({ isOpen, restType, onClose }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [fullText, setFullText] = useState('');
    const fadeOutTimeoutRef = useRef(null);
    const typingIntervalRef = useRef(null);

    useEffect(() => {
        if (isOpen && restType) {
            // Select a random message for this rest type
            const messages = REST_MESSAGES[restType] || REST_MESSAGES.short;
            const selectedMessage = messages[Math.floor(Math.random() * messages.length)];
            setFullText(selectedMessage);
            setDisplayedText('');
            setIsTyping(true);
            setIsFadingOut(false);

            // Type out the text character by character
            let currentIndex = 0;
            typingIntervalRef.current = setInterval(() => {
                if (currentIndex < selectedMessage.length) {
                    setDisplayedText(selectedMessage.substring(0, currentIndex + 1));
                    currentIndex++;
                } else {
                    setIsTyping(false);
                    if (typingIntervalRef.current) {
                        clearInterval(typingIntervalRef.current);
                        typingIntervalRef.current = null;
                    }
                    
                    // Wait 6-8 seconds after typing completes, then fade out
                    const fadeOutDelay = 6000 + Math.random() * 2000; // 6-8 seconds
                    fadeOutTimeoutRef.current = setTimeout(() => {
                        setIsFadingOut(true);
                        // Close after fade animation completes
                        setTimeout(() => {
                            onClose();
                        }, 800); // Match fade-out animation duration
                    }, fadeOutDelay);
                }
            }, 80); // Typing speed - slower for more dramatic effect

            return () => {
                if (typingIntervalRef.current) {
                    clearInterval(typingIntervalRef.current);
                    typingIntervalRef.current = null;
                }
                if (fadeOutTimeoutRef.current) {
                    clearTimeout(fadeOutTimeoutRef.current);
                    fadeOutTimeoutRef.current = null;
                }
            };
        } else {
            // Reset when closed
            setDisplayedText('');
            setIsTyping(false);
            setIsFadingOut(false);
            setFullText('');
        }
    }, [isOpen, restType, onClose]);

    if (!isOpen) return null;

    const handleClick = () => {
        // If still typing, show full text immediately
        if (isTyping) {
            setDisplayedText(fullText);
            setIsTyping(false);
            // Still wait a bit before auto-closing
            setTimeout(() => {
                setIsFadingOut(true);
                setTimeout(() => {
                    onClose();
                }, 800);
            }, 2000);
        } else {
            // If done typing, fade out immediately
            setIsFadingOut(true);
            setTimeout(() => {
                onClose();
            }, 800);
        }
    };

    return createPortal(
        <div 
            className={`rest-overlay ${isFadingOut ? 'fade-out' : 'fade-in'}`}
            onClick={handleClick}
        >
            <div className="rest-overlay-content">
                <div className="rest-text">
                    {displayedText}
                    {isTyping && <span className="typing-cursor">|</span>}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default RestOverlay;

