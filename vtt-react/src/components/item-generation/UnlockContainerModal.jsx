import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import useItemStore from '../../store/itemStore';
import '../../styles/unlock-container-modal.css';

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
        const targetWord = container.containerProperties.lockCode;
        const newGuessedLetters = new Set([...guessedLetters, newLetter]);

        // Check if the new letter is in the word (ignoring spaces)
        if (!targetWord.replace(/\s/g, '').includes(newLetter)) {
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
        const word = container.containerProperties.lockCode;
        return (
            <div className="word-display">
                {word.split(' ').map((wordPart, wordIndex, wordArray) => (
                    <React.Fragment key={wordIndex}>
                        <div className="word-part">
                            {[...wordPart].map((letter, index) => (
                                <div key={index} className="letter-box">
                                    {guessedLetters.has(letter) ? letter : '_'}
                                </div>
                            ))}
                        </div>
                        {wordIndex < wordArray.length - 1 && <div className="word-space"></div>}
                    </React.Fragment>
                ))}
            </div>
        );
    };

    const renderGuessedLetters = () => {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const uniqueLetters = new Set([...container.containerProperties.lockCode.replace(/\s/g, '')]);

        return (
            <div className="letter-status">
                <div className="letter-grid">
                    {[...alphabet].map((letter) => {
                        const isInWord = uniqueLetters.has(letter);
                        const isGuessed = guessedLetters.has(letter);
                        return (
                            <button
                                key={letter}
                                className={`letter-button ${isGuessed ? 'guessed' : ''} ${isGuessed && isInWord ? 'correct' : ''}`}
                                onClick={() => {
                                    if (!guessedLetters.has(letter)) {
                                        setGuessedLetters(new Set([...guessedLetters, letter]));
                                        checkWordProgress(letter);
                                    }
                                }}
                                disabled={guessedLetters.has(letter)}
                            >
                                {letter}
                            </button>
                        );
                    })}
                </div>
                <div className="letter-count">
                    <span>Letters Found: {[...guessedLetters].filter(l => uniqueLetters.has(l)).length} / {uniqueLetters.size}</span>
                </div>
            </div>
        );
    };

    return createPortal(
        <div className="unlock-container-overlay" onClick={onClose}>
            <div className="unlock-container-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Unlock {container.name}</h3>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                <div className="modal-content">
                    {container.containerProperties.flavorText && (
                        <div className="flavor-text">
                            <i className="fas fa-scroll"></i>
                            <p>{container.containerProperties.flavorText}</p>
                        </div>
                    )}

                    <div className="attempts-remaining">
                        <i className="fas fa-shield-alt"></i>
                        <span>Attempts Remaining: {container.containerProperties.maxAttempts - attempts}</span>
                    </div>

                    {container.containerProperties.lockType === 'code' && (
                        <>
                            {renderWordDisplay()}
                            {renderGuessedLetters()}
                            <input
                                ref={inputRef}
                                type="text"
                                onKeyDown={handleKeyPress}
                                style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
                            />
                        </>
                    )}

                    {container.containerProperties.lockType === 'numeric' && (
                        <div className="numeric-input">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 8);
                                    setInput(value);
                                    setError('');
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleNumericSubmit();
                                    }
                                }}
                                placeholder="Enter numeric code"
                                maxLength={8}
                                autoComplete="off"
                                autoCorrect="off"
                                autoCapitalize="off"
                                spellCheck="false"
                            />
                            <button
                                className="submit-button"
                                onClick={handleNumericSubmit}
                                disabled={!input}
                            >
                                Submit
                            </button>
                        </div>
                    )}

                    {container.containerProperties.lockType === 'thievery' && (
                        <div className="form-group">
                            <label>
                                <i className="fas fa-dice-d20"></i>
                                <span>Thievery Check (DC {container.containerProperties.lockDC})</span>
                            </label>
                            <div className="thievery-input">
                                <span className="dice-roll">
                                    d20 {diceRoll ? `(${diceRoll})` : ''}
                                </span>
                                <span className="plus">+</span>
                                <input
                                    type="number"
                                    min="0"
                                    max="30"
                                    value={input}
                                    onChange={(e) => {
                                        setInput(e.target.value);
                                        setError('');
                                    }}
                                    placeholder="Modifier"
                                    autoFocus
                                />
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="error-message">
                            <i className="fas fa-exclamation-circle"></i>
                            {error}
                        </div>
                    )}
                </div>
                <div className="modal-footer">
                    <button className="cancel-button" onClick={onClose}>
                        Cancel
                    </button>
                    {container.containerProperties.lockType === 'thievery' && (
                        <>
                            <button
                                className="unlock-button"
                                onClick={handleSubmit}
                                disabled={!input}
                            >
                                <i className="fas fa-unlock"></i>
                                Pick Lock
                            </button>
                            <button
                                className="success-button"
                                onClick={onSuccess}
                                style={{
                                    backgroundColor: '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    marginLeft: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                <i className="fas fa-check"></i>
                                Success
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default UnlockContainerModal;
