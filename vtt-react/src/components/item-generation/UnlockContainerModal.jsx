import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import useItemStore from '../../store/itemStore';
import '../../styles/container-wizard.css';
import { getIconUrl } from '../../utils/assetManager';


const UnlockContainerModal = ({ container, onSuccess: originalOnSuccess, onClose }) => {

    const [input, setInput] = useState('');
    const [guessedLetters, setGuessedLetters] = useState(new Set());
    const [error, setError] = useState('');
    const [diceRoll, setDiceRoll] = useState(null);
    const [focused, setFocused] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const inputRef = useRef(null);
    const updateItem = useItemStore(state => state.updateItem);
    const removeItem = useItemStore(state => state.removeItem);

    // Create a wrapper for onSuccess that unlocks the container
    const onSuccess = (updatedContainer) => {
        // Make sure container properties exist
        if (!container.containerProperties) {
            container.containerProperties = {
                gridSize: { rows: 4, cols: 6 },
                items: [],
                isLocked: true,
                lockType: 'thievery',
                lockDC: 15,
                lockCode: '',
                flavorText: '',
                maxAttempts: 3,
                failureAction: 'none',
                failureActionDetails: {}
            };
        }

        // Update container to be unlocked
        const updatedProps = {
            ...container.containerProperties,
            isLocked: false
        };

        // Update the container in the store
        updateItem(container.id, {
            type: 'container', // Force type to be container
            containerProperties: updatedProps
        });

        // Also update the local container object for immediate use
        container.containerProperties = updatedProps;
        container.type = 'container'; // Force type to be container

        // Call the original onSuccess function
        originalOnSuccess(updatedContainer || container);
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleKeyPress = (e) => {
        if (!container?.containerProperties) return;

        if (container.containerProperties.lockType === 'code') {
            // For word-based locks, only accept letters
            if (/^[a-zA-Z]$/.test(e.key)) {
                const letter = e.key.toUpperCase();
                if (!guessedLetters.has(letter)) {
                    setGuessedLetters(new Set([...guessedLetters, letter]));
                    checkWordProgress(letter);
                }
            }
        } else if (container.containerProperties.lockType === 'thievery') {
            // For thievery checks, handle number input
            if (e.key === 'Backspace') {
                setInput(prev => prev.slice(0, -1));
                setError('');
            } else if (/^[0-9]$/.test(e.key)) {
                setInput(prev => prev + e.key);
                setError('');
            }
        }
    };

    const handleNumericSubmit = () => {
        if (!container?.containerProperties) return;

        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        if (input === container.containerProperties.lockCode) {
            onSuccess();
        } else {
            if (newAttempts >= container.containerProperties.maxAttempts) {
                handleFailure();
            } else {
                setError(`Incorrect code. ${container.containerProperties.maxAttempts - newAttempts} attempts remaining.`);
                setInput('');
            }
        }
    };

    const checkWordProgress = (newLetter) => {
        if (!container?.containerProperties) return;

        const targetWord = container.containerProperties.lockCode.toUpperCase();
        const upperLetter = newLetter.toUpperCase();
        const newGuessedLetters = new Set([...guessedLetters, upperLetter]);

        // Check if the new letter is in the word (ignoring spaces)
        if (!targetWord.replace(/\s/g, '').includes(upperLetter)) {
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);

            if (newAttempts >= container.containerProperties.maxAttempts) {
                handleFailure();
            } else {
                setError(`Wrong letter! ${container.containerProperties.maxAttempts - newAttempts} attempts remaining.`);
            }
        }

        // Check if all letters have been guessed (ignoring spaces)
        const allLettersGuessed = [...targetWord].every(letter => letter === ' ' || newGuessedLetters.has(letter));
        if (allLettersGuessed) {
            onSuccess();
        }
    };

    const handleFailure = () => {
        if (!container?.containerProperties) return;

        const { failureAction, failureActionDetails } = container.containerProperties;

        switch (failureAction) {
            case 'remove_items':
                const itemCount = container.containerProperties.items.length;
                const removeCount = Math.floor(itemCount * (failureActionDetails.removePercentage / 100));
                const remainingItems = [...container.containerProperties.items];
                for (let i = 0; i < removeCount; i++) {
                    const randomIndex = Math.floor(Math.random() * remainingItems.length);
                    remainingItems.splice(randomIndex, 1);
                }
                updateItem(container.id, {
                    containerProperties: {
                        ...container.containerProperties,
                        items: remainingItems
                    }
                });
                onSuccess();
                break;

            case 'destroy':
                removeItem(container.id);
                onClose();
                break;

            case 'trap':
                setError(`Trap triggered! ${failureActionDetails.trapDetails}`);
                onSuccess();
                break;

            case 'transform':
                setError(`The container transforms into a ${failureActionDetails.creatureType}!`);
                removeItem(container.id);
                onClose();
                break;

            default:
                setError('Failed to unlock the container.');
                onClose();
        }
    };

    const handleSubmit = () => {
        if (!container?.containerProperties) return;

        if (container.containerProperties.lockType === 'thievery') {
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);

            const roll = Math.floor(Math.random() * 20) + 1;
            setDiceRoll(roll);
            const total = roll + parseInt(input || 0);

            if (total >= container.containerProperties.lockDC) {
                onSuccess();
            } else {
                if (newAttempts >= container.containerProperties.maxAttempts) {
                    handleFailure();
                } else {
                    setError(`Failed to pick the lock (${total} vs DC ${container.containerProperties.lockDC}). ${container.containerProperties.maxAttempts - newAttempts} attempts remaining.`);
                    setInput('');
                }
            }
        }
    };

    const renderWordDisplay = () => {
        if (!container?.containerProperties) return null;

        const word = container.containerProperties.lockCode;
        return (
            <div className="cw-word-display">
                {word.split(' ').map((wordPart, wordIndex, wordArray) => (
                    <React.Fragment key={wordIndex}>
                        <div className="cw-word-part">
                            {[...wordPart].map((letter, index) => (
                                <div key={index} className="cw-letter-box">
                                    {guessedLetters.has(letter.toUpperCase()) ? letter.toUpperCase() : '_'}
                                </div>
                            ))}
                        </div>
                        {wordIndex < wordArray.length - 1 && <div className="cw-word-space"></div>}
                    </React.Fragment>
                ))}
            </div>
        );
    };

    const renderGuessedLetters = () => {
        if (!container?.containerProperties) return null;

        const rows = [
            ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
            ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
            ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
        ];
        
        const lockCode = container.containerProperties.lockCode.toUpperCase();
        const uniqueLetters = new Set([...lockCode.replace(/\s/g, '')]);

        return (
            <div className="cw-keyboard-section">
                <div className="cw-keyboard">
                    {rows.map((row, rowIndex) => (
                        <div key={rowIndex} className="cw-keyboard-row">
                            {row.map((letter) => {
                                const isInWord = uniqueLetters.has(letter);
                                const isGuessed = guessedLetters.has(letter);
                                return (
                                    <button
                                        key={letter}
                                        className={`cw-key ${isGuessed ? 'cw-key--guessed' : ''} ${isGuessed && isInWord ? 'cw-key--correct' : ''}`}
                                        onClick={() => {
                                            if (!guessedLetters.has(letter)) {
                                                setGuessedLetters(new Set([...guessedLetters, letter]));
                                                checkWordProgress(letter);
                                            }
                                        }}
                                        disabled={isGuessed}
                                    >
                                        {letter}
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </div>
                <div className="cw-keyboard-status">
                    <div className="cw-progress-badge">
                        <i className="fas fa-search" />
                        <span>Letters Found: {[...guessedLetters].filter(l => uniqueLetters.has(l)).length} / {uniqueLetters.size}</span>
                    </div>
                </div>
            </div>
        );
    };

    // Guard against missing containerProperties
    if (!container?.containerProperties) {
        console.error('❌ UnlockContainerModal: containerProperties missing for:', container?.name);
        return createPortal(
            <div className="unlock-container-overlay" onClick={onClose}>
                <div className="unlock-container-modal" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h3>Error</h3>
                        <button className="close-button" onClick={onClose}>×</button>
                    </div>
                    <div className="modal-content">
                        <p>Container properties are missing. Please try again.</p>
                    </div>
                </div>
            </div>,
            document.body
        );
    }

    return createPortal(
        <>
            <div className="cw-overlay" onClick={onClose} />
            <div className="cw-overlay cw-overlay--modal">
                <div className="cw-modal" onClick={e => e.stopPropagation()} style={{ width: '400px' }}>
                    <div className="cw-header">
                        <div className="cw-header-left">
                            <img
                                src={getIconUrl(container.iconId || 'inv_box_01', 'items', true)}
                                alt=""
                                className="cw-header-icon"
                                onError={e => { e.target.onerror = null; e.target.src = getIconUrl('Misc/Books/book-brown-teal-question-mark', 'items', true); }}
                            />
                            <h2>Unlock {container.name}</h2>
                        </div>
                        <button className="cw-close" onClick={onClose}>
                            <i className="fas fa-times" />
                        </button>
                    </div>

                    <div className="cw-body">
                        <div className="cw-panel">
                            {container.containerProperties.flavorText && (
                                <div className="cw-toggle-row" style={{ cursor: 'default', background: 'rgba(122, 59, 46, 0.04)', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                                    <div className="cw-toggle-info">
                                        <i className="fas fa-scroll" />
                                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--cw-brown)' }}>Description</span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.85rem', fontStyle: 'italic', lineHeight: '1.4' }}>
                                        {container.containerProperties.flavorText}
                                    </p>
                                </div>
                            )}

                            <div className="cw-selected-info" style={{ justifyContent: 'center', padding: '10px 0', borderBottom: '1px solid rgba(122, 59, 46, 0.1)' }}>
                                <i className="fas fa-shield-alt" style={{ color: 'var(--cw-brown)' }} />
                                <span className="cw-selected-name">Attempts Remaining: {container.containerProperties.maxAttempts - attempts}</span>
                            </div>

                            <div className="cw-lock-section" style={{ background: 'transparent', border: 'none', padding: 0 }}>
                                {container.containerProperties.lockType === 'code' && (
                                    <div className="cw-panel">
                                        {renderWordDisplay()}
                                        {renderGuessedLetters()}
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            onKeyDown={handleKeyPress}
                                            style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
                                        />
                                    </div>
                                )}

                                {container.containerProperties.lockType === 'numeric' && (
                                    <div className="cw-field">
                                        <label>Enter Code</label>
                                        <div className="cw-row">
                                            <input
                                                ref={inputRef}
                                                type="text"
                                                value={input}
                                                className="cw-field"
                                                style={{ textAlign: 'center', fontSize: '1.2rem', letterSpacing: '4px', height: '44px' }}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 8);
                                                    setInput(value);
                                                    setError('');
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') handleNumericSubmit();
                                                }}
                                                placeholder="••••"
                                                maxLength={8}
                                            />
                                            <button
                                                className="cw-btn cw-btn--create"
                                                style={{ height: '44px' }}
                                                onClick={handleNumericSubmit}
                                                disabled={!input}
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                )}


                                {container.containerProperties.lockType === 'thievery' && (
                                    <div className="cw-field">
                                        <label>Thievery Check (DC {container.containerProperties.lockDC})</label>
                                        <div className="cw-row" style={{ background: 'rgba(122, 59, 46, 0.06)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(122, 59, 46, 0.1)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                                                <i className="fas fa-dice-d20" style={{ color: 'var(--cw-brown)', fontSize: '1.2rem' }} />
                                                <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                                                    {diceRoll !== null ? diceRoll : '?'}
                                                </span>
                                                <span style={{ opacity: 0.6 }}>+</span>
                                                <input
                                                    type="number"
                                                    className="cw-field"
                                                    style={{ width: '60px', padding: '4px 8px', background: 'white', border: '1px solid var(--cw-brown-lt)', borderRadius: '4px' }}
                                                    value={input}
                                                    onChange={(e) => { setInput(e.target.value); setError(''); }}
                                                    placeholder="Mod"
                                                />
                                            </div>
                                            <button
                                                className="cw-btn cw-btn--create"
                                                onClick={handleSubmit}
                                                disabled={!input}
                                            >
                                                <i className="fas fa-unlock" style={{ marginRight: '6px' }} />
                                                Pick
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {error && (
                                    <div className="cw-toggle-row" style={{ background: 'rgba(122, 59, 46, 0.08)', borderColor: 'var(--cw-brown)', cursor: 'default' }}>
                                        <div className="cw-toggle-info" style={{ color: 'var(--cw-brown)', fontSize: '0.8rem' }}>
                                            <i className="fas fa-exclamation-circle" />
                                            <span>{error}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="cw-footer">
                        <button className="cw-btn cw-btn--cancel" onClick={onClose}>
                            Cancel
                        </button>
                        {container.containerProperties.lockType === 'thievery' && (
                            <button
                                className="cw-btn cw-btn--create"
                                style={{ background: 'linear-gradient(135deg, #4a934a, #3a7a3a)' }}
                                onClick={onSuccess}
                            >
                                <i className="fas fa-check" style={{ marginRight: '6px' }} />
                                Success
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
};

export default UnlockContainerModal;
