import React, { useState, useRef, useEffect } from 'react';
import useCharacterStore from '../../store/characterStore';
import useDialogueStore from '../../store/dialogueStore';
import './DialogueControls.css';

const DialogueControls = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedEffect, setSelectedEffect] = useState('normal');
  const [selectedColor, setSelectedColor] = useState('#ffffff');
  const [selectedPosition, setSelectedPosition] = useState('bottom');
  const [speed, setSpeed] = useState(50);
  
  const inputRef = useRef(null);
  const controlsRef = useRef(null);
  
  // Store hooks
  const { name: characterName, lore } = useCharacterStore();
  const { 
    showDialogue, 
    textEffects, 
    textColors, 
    positions,
    updateSettings,
    getSettings,
    isDialogueActive
  } = useDialogueStore();

  // Load saved settings
  useEffect(() => {
    const settings = getSettings();
    setSelectedEffect(settings.effect);
    setSelectedColor(settings.color);
    setSelectedPosition(settings.position);
    setSpeed(settings.speed);
  }, [getSettings]);

  // Close controls when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (controlsRef.current && !controlsRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendDialogue = () => {
    if (!message.trim()) return;

    const character = {
      name: characterName,
      characterImage: lore?.characterImage,
      lore: lore
    };

    showDialogue(message, {
      character,
      characterName,
      effect: selectedEffect,
      color: selectedColor,
      position: selectedPosition,
      speed: parseInt(speed),
      closeable: true
    });

    // Save settings
    updateSettings({
      effect: selectedEffect,
      color: selectedColor,
      position: selectedPosition,
      speed: parseInt(speed)
    });

    setMessage('');
    setIsOpen(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendDialogue();
    }
  };

  const toggleControls = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="dialogue-controls" ref={controlsRef}>
      {/* Toggle Button */}
      <button 
        className={`dialogue-toggle-btn ${isOpen ? 'active' : ''}`}
        onClick={toggleControls}
        title="Open Dialogue System"
      >
        <i className="fas fa-comment-dots"></i>
        <span className="btn-text">Dialogue</span>
      </button>

      {/* Controls Panel */}
      {isOpen && (
        <div className="dialogue-panel">
          <div className="panel-header">
            <h3>Character Dialogue</h3>
            <button 
              className="close-btn"
              onClick={() => setIsOpen(false)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="panel-content">
            {/* Message Input */}
            <div className="input-section">
              <label>Message:</label>
              <textarea
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your character's dialogue... Use {bounce:word} for animations!"
                maxLength={500}
                rows={2}
              />
              <div className="char-count">
                {message.length}/500
              </div>

              {/* Markup Help */}
              <div className="markup-help">
                <details>
                  <summary>Text Effects Guide</summary>
                  <div className="markup-examples">
                    <div className="effect-category">
                      <strong>Animations:</strong>
                      <div className="effect-list">
                        <span><code>{'{bounce:word}'}</code> - Bouncing text</span>
                        <span><code>{'{shake:word}'}</code> - Shaking text</span>
                        <span><code>{'{glow:word}'}</code> - Glowing text</span>
                        <span><code>{'{wave:word}'}</code> - Wave animation</span>
                        <span><code>{'{float:word}'}</code> - Floating text</span>
                        <span><code>{'{pulse:word}'}</code> - Pulsing text</span>
                      </div>
                    </div>
                    <div className="effect-category">
                      <strong>Colors:</strong>
                      <div className="effect-list">
                        <span><code>{'{red:word}'}</code> <code>{'{gold:word}'}</code> <code>{'{blue:word}'}</code></span>
                        <span><code>{'{green:word}'}</code> <code>{'{purple:word}'}</code> <code>{'{rainbow:word}'}</code></span>
                      </div>
                    </div>
                    <div className="effect-category">
                      <strong>Multi-word Support:</strong>
                      <div className="effect-list">
                        <span><code>{'{red: crimson road}'}</code> - Colors multiple words</span>
                        <span><code>{'{bounce: magical spell}'}</code> - Animates phrases</span>
                        <span>Supports spaces in effect content!</span>
                      </div>
                    </div>
                  </div>
                </details>
              </div>
            </div>

            {/* Effect Selection */}
            <div className="control-row">
              <div className="control-group">
                <label>Text Effect:</label>
                <select 
                  value={selectedEffect} 
                  onChange={(e) => setSelectedEffect(e.target.value)}
                >
                  {Object.entries(textEffects).map(([key, value]) => (
                    <option key={key} value={value}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="control-group">
                <label>Text Color:</label>
                <select 
                  value={selectedColor} 
                  onChange={(e) => setSelectedColor(e.target.value)}
                >
                  {Object.entries(textColors).map(([key, value]) => (
                    <option key={key} value={value} style={{ color: value }}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Position and Speed */}
            <div className="control-row">
              <div className="control-group">
                <label>Position:</label>
                <select 
                  value={selectedPosition} 
                  onChange={(e) => setSelectedPosition(e.target.value)}
                >
                  {Object.entries(positions).map(([key, value]) => (
                    <option key={key} value={value}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="control-group">
                <label>Speed: {speed}ms</label>
                <input
                  type="range"
                  min="10"
                  max="200"
                  value={speed}
                  onChange={(e) => setSpeed(e.target.value)}
                  className="speed-slider"
                />
              </div>
            </div>

            {/* Preview */}
            <div className="preview-section">
              <label>Preview:</label>
              <div className="preview-text">
                <span
                  className={`dialogue-text ${selectedEffect}`}
                  style={{
                    color: selectedColor || '#2c3e50',
                    textShadow: 'none'
                  }}
                >
                  {message || 'Type a message to see preview...'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button 
                className="send-btn"
                onClick={handleSendDialogue}
                disabled={!message.trim() || isDialogueActive()}
              >
                <i className="fas fa-paper-plane"></i>
                Send Dialogue
              </button>
              
              <button
                className="clear-btn"
                onClick={() => setMessage('')}
                disabled={!message}
              >
                <i className="fas fa-eraser"></i>
                Clear
              </button>

              <button
                className="test-btn"
                onClick={() => {
                  const testMessage = "Welcome to the {bounce:magical retro} dialogue system! This {glow:amazing feature} has {shake:incredible multi-word} {float:phrase support} just like {pulse:classic RPG} {wave:adventure games}! Now you can use {red:crimson road} and {gold:golden treasures} with multiple words!";
                  const character = {
                    name: characterName,
                    characterImage: lore?.characterImage,
                    lore: lore
                  };
                  showDialogue(testMessage, {
                    character,
                    characterName,
                    effect: 'normal',
                    color: '#2c3e50',
                    position: 'bottom',
                    speed: 40,
                    closeable: true
                  });
                }}
                style={{
                  background: 'linear-gradient(135deg, #4a90e2, #357abd)',
                  border: '2px solid #6ab7ff'
                }}
              >
                <i className="fas fa-vial"></i>
                Test Animations
              </button>
            </div>

            {/* Character Info */}
            <div className="character-info">
              <div className="character-preview">
                {lore?.characterImage ? (
                  <img 
                    src={lore.characterImage} 
                    alt={characterName}
                    className="character-avatar"
                  />
                ) : (
                  <div className="avatar-placeholder">
                    <i className="fas fa-user"></i>
                  </div>
                )}
                <span className="character-name">{characterName}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DialogueControls;
