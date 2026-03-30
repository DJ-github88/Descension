import React, { useState, useRef, useEffect } from 'react';
import useCharacterStore from '../../store/characterStore';
import useGameStore from '../../store/gameStore';
import useDialogueStore from '../../store/dialogueStore';
import useCreatureStore from '../../store/creatureStore';
import { getCreatureTokenIconUrl } from '../../utils/assetManager';
import './DialogueControls.css';

const DialogueControls = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedEffect, setSelectedEffect] = useState('normal');
  const [selectedColor, setSelectedColor] = useState('#ffffff');
  const [selectedPosition, setSelectedPosition] = useState('bottom');
  const [speed, setSpeed] = useState(50);
  const [selectedCreatureId, setSelectedCreatureId] = useState(null);
  const [selectedSpeaker, setSelectedSpeaker] = useState('character');
  const [selectedBackdropEffect, setSelectedBackdropEffect] = useState('none');
  const [previewText, setPreviewText] = useState('');
  const [isReplaying, setIsReplaying] = useState(false);

  const inputRef = useRef(null);
  const controlsRef = useRef(null);
  const previewRef = useRef(null);
  const replayTimeoutRef = useRef(null);
  const replayIntervalRef = useRef(null);

  // Store hooks
  const { name: characterName, lore } = useCharacterStore();
  const { isGMMode } = useGameStore();
  const creatures = useCreatureStore((state) => state.creatures);
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
    setSelectedBackdropEffect(settings.backdropEffect || 'none');
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

  // Allow other UI (e.g. mobile nav) to toggle this panel
  useEffect(() => {
    const handleToggle = () => {
      setIsOpen(prev => !prev);
    };

    window.addEventListener('toggleDialogueControls', handleToggle);
    return () => window.removeEventListener('toggleDialogueControls', handleToggle);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Auto-replay functionality for preview
  useEffect(() => {
    // Clear any existing timeouts/intervals
    if (replayTimeoutRef.current) {
      clearTimeout(replayTimeoutRef.current);
      replayTimeoutRef.current = null;
    }
    if (replayIntervalRef.current) {
      clearInterval(replayIntervalRef.current);
      replayIntervalRef.current = null;
    }

    if (message.trim()) {
      // Set the full message initially
      setPreviewText(message);
      setIsReplaying(false);

      // After 3 seconds of no typing, start replay
      replayTimeoutRef.current = setTimeout(() => {
        // Double-check message hasn't changed
        const currentMessage = message;
        if (!currentMessage.trim()) return;

        const startReplay = () => {
          // Check message hasn't changed
          if (message !== currentMessage) return;

          setIsReplaying(true);
          setPreviewText('');

          // Replay character by character
          const fullMessage = currentMessage;
          let currentIndex = 0;
          const replaySpeed = Math.max(10, parseInt(speed) || 50);

          replayIntervalRef.current = setInterval(() => {
            // Check message hasn't changed
            if (message !== currentMessage) {
              clearInterval(replayIntervalRef.current);
              replayIntervalRef.current = null;
              return;
            }

            if (currentIndex < fullMessage.length) {
              setPreviewText(fullMessage.substring(0, currentIndex + 1));
              currentIndex++;
            } else {
              // Finished replaying, wait 3 seconds and restart
              clearInterval(replayIntervalRef.current);
              replayIntervalRef.current = null;

              // Check message hasn't changed before restarting
              if (message === currentMessage) {
                replayTimeoutRef.current = setTimeout(() => {
                  if (message === currentMessage) {
                    startReplay(); // Restart the replay
                  }
                }, 3000);
              }
            }
          }, replaySpeed);
        };

        startReplay();
      }, 3000);
    } else {
      setPreviewText('');
      setIsReplaying(false);
    }

    // Cleanup on unmount or message change
    return () => {
      if (replayTimeoutRef.current) {
        clearTimeout(replayTimeoutRef.current);
        replayTimeoutRef.current = null;
      }
      if (replayIntervalRef.current) {
        clearInterval(replayIntervalRef.current);
        replayIntervalRef.current = null;
      }
    };
  }, [message, speed]);

  const handleSendDialogue = () => {
    if (!message.trim()) return;

    // Get selected speaker
    let character = {
      name: characterName,
      characterImage: lore?.characterImage,
      lore: lore
    };

    if (selectedSpeaker === 'custom') {
      // Use custom speaker name from creature selection or character
      if (selectedCreatureId) {
        const creature = creatures.find(c => c.id === selectedCreatureId);
        if (creature) {
          character = {
            name: creature.name || 'Creature',
            characterImage: creature.image || creature.token || lore?.characterImage,
            lore: {
              ...creature,
              isCreature: true
            }
          };
        }
      }
    } else {
      // Use predefined speaker
      character.name = selectedSpeaker;
    }

    showDialogue(message, {
      character,
      characterName: character.name,
      effect: selectedEffect,
      color: selectedColor,
      position: selectedPosition,
      speed: parseInt(speed),
      backdropEffect: selectedBackdropEffect,
      closeable: true,
      isGM: isGMMode
    });

    // Save settings
    updateSettings({
      effect: selectedEffect,
      color: selectedColor,
      position: selectedPosition,
      speed: parseInt(speed),
      backdropEffect: selectedBackdropEffect
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

            {/* New Intuitive Control Layout */}
            <div className="control-sections">
              {/* Speaker Selection Section */}
              <div className="control-section">
                <div className="control-section-header">
                  <div className="control-section-icon">
                    <i className="fas fa-user"></i>
                  </div>
                  <h4 className="control-section-title">Speaker</h4>
                </div>
                <div className="control-item">
                  <label>Select Speaker:</label>
                  <select
                    value={selectedSpeaker}
                    onChange={(e) => {
                      setSelectedSpeaker(e.target.value);
                      // Reset creature selection when switching to predefined speakers
                      if (e.target.value !== 'custom') {
                        setSelectedCreatureId(null);
                      }
                    }}
                  >
                    <option value="character">Character ({characterName})</option>
                    <option value="Thorin Blackforge">Thorin Blackforge</option>
                    <option value="Snicksnack the Prankster">Snicksnack the Prankster</option>
                    <option value="Gigglegut the Explosive">Gigglegut the Explosive</option>
                    <option value="Wobblestick the Unbalanced">Wobblestick the Unbalanced</option>
                    <option value="Grubfingers the Collector">Grubfingers the Collector</option>
                    <option value="Frostbite the Yeti">Frostbite the Yeti</option>
                    <option value="Thornroo">Thornroo</option>
                    <option value="custom">Custom Creature...</option>
                  </select>
                </div>

                {/* Show creature selection when custom is selected */}
                {selectedSpeaker === 'custom' && (
                  <div className="control-item">
                    <label>Select Creature:</label>
                    <select
                      value={selectedCreatureId || ''}
                      onChange={(e) => setSelectedCreatureId(e.target.value || null)}
                    >
                      <option value="">Select a creature...</option>
                      {creatures.map((creature) => (
                        <option key={creature.id} value={creature.id}>
                          {creature.name || 'Unnamed Creature'}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Visual Effects Section */}
              <div className="control-section">
                <div className="control-section-header">
                  <div className="control-section-icon">
                    <i className="fas fa-palette"></i>
                  </div>
                  <h4 className="control-section-title">Visual Effects</h4>
                </div>
                <div className="control-grid">
                  <div className="control-item">
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

                  <div className="control-item">
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

                  <div className="control-item">
                    <label>Backdrop Effect:</label>
                    <select
                      value={selectedBackdropEffect}
                      onChange={(e) => setSelectedBackdropEffect(e.target.value)}
                    >
                      <option value="none">None</option>
                      <option value="dim">Dim</option>
                      <option value="brighten">Brighten</option>
                      <option value="reddish">Reddish Tint</option>
                      <option value="blueish">Blueish Tint</option>
                      <option value="greenish">Greenish Tint</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Display Settings Section */}
              <div className="control-section">
                <div className="control-section-header">
                  <div className="control-section-icon">
                    <i className="fas fa-cog"></i>
                  </div>
                  <h4 className="control-section-title">Display Settings</h4>
                </div>
                <div className="control-grid">
                  <div className="control-item">
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

                  <div className="control-item">
                    <label>Animation Speed:</label>
                    <div className="speed-control">
                      <input
                        type="range"
                        min="10"
                        max="200"
                        value={speed}
                        onChange={(e) => setSpeed(e.target.value)}
                        className="speed-slider"
                      />
                      <div className="speed-value">{speed}ms</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Section */}
              <div className="control-section">
                <div className="control-section-header">
                  <div className="control-section-icon">
                    <i className="fas fa-eye"></i>
                  </div>
                  <h4 className="control-section-title">Preview</h4>
                </div>
                <div className="preview-text" ref={previewRef}>
                  <span
                    className={`dialogue-text ${selectedEffect} ${isReplaying ? 'replaying' : ''}`}
                    style={{
                      color: selectedColor || '#ffffff',
                      /* Enhanced 8-directional black text stroke for 16-bit look */
                      textShadow: `
                        -2px -2px 0px #000, -2px -1px 0px #000, -2px 0px 0px #000, -2px 1px 0px #000, -2px 2px 0px #000,
                        -1px -2px 0px #000, -1px -1px 0px #000, -1px 0px 0px #000, -1px 1px 0px #000, -1px 2px 0px #000,
                        0px -2px 0px #000, 0px -1px 0px #000, 0px 1px 0px #000, 0px 2px 0px #000,
                        1px -2px 0px #000, 1px -1px 0px #000, 1px 0px 0px #000, 1px 1px 0px #000, 1px 2px 0px #000,
                        2px -2px 0px #000, 2px -1px 0px #000, 2px 0px 0px #000, 2px 1px 0px #000, 2px 2px 0px #000
                      `,
                      /* 16-bit pixelated rendering */
                      imageRendering: 'pixelated',
                      fontSmooth: 'never',
                      WebkitFontSmoothing: 'none'
                    }}
                  >
                    {previewText || message || 'Type a message to see preview...'}
                  </span>
                </div>
              </div>

              {/* Actions Section */}
              <div className="control-section">
                <div className="control-section-header">
                  <div className="control-section-icon">
                    <i className="fas fa-play"></i>
                  </div>
                  <h4 className="control-section-title">Actions</h4>
                </div>
                <div className="action-buttons-grid">
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
                        color: '#ffffff',
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
              </div>

              {/* Current Speaker Display */}
              <div className="control-section">
                <div className="control-section-header">
                  <div className="control-section-icon">
                    <i className="fas fa-id-card"></i>
                  </div>
                  <h4 className="control-section-title">Current Speaker</h4>
                </div>
                <div className="character-preview">
                  {(() => {
                    const selectedCreature = selectedCreatureId
                      ? creatures.find(c => c.id === selectedCreatureId)
                      : null;
                    const displayName = selectedCreature
                      ? (selectedCreature.name || 'Creature')
                      : characterName;

                    // Get display image/icon styling - match exactly how compact-creature-icon displays it
                    let backgroundImage = null;
                    let borderColor = '#d4af37'; // Default gold border for characters
                    let backgroundSize = 'cover';
                    let backgroundPosition = 'center center';
                    let transform = 'none';

                    if (selectedCreature) {
                      // Match CompactCreatureCard logic exactly
                      if (selectedCreature.customTokenImage) {
                        backgroundImage = `url(${selectedCreature.customTokenImage})`;
                        backgroundSize = selectedCreature.imageTransformations
                          ? `${(selectedCreature.imageTransformations.scale || 1) * 100}%`
                          : 'cover';
                        backgroundPosition = selectedCreature.imageTransformations
                          ? `${50 + (selectedCreature.imageTransformations.positionX || 0) / 2}% ${50 - (selectedCreature.imageTransformations.positionY || 0) / 2}%`
                          : 'center center';
                        transform = selectedCreature.imageTransformations
                          ? `rotate(${selectedCreature.imageTransformations.rotation || 0}deg)`
                          : 'none';
                      } else if (selectedCreature.tokenIcon) {
                        backgroundImage = `url(${getCreatureTokenIconUrl(selectedCreature.tokenIcon, selectedCreature.type)})`;
                        backgroundSize = 'cover';
                        backgroundPosition = 'center center';
                        transform = 'none';
                      }
                      // Use tokenBorder for creature border color
                      if (selectedCreature.tokenBorder) {
                        borderColor = selectedCreature.tokenBorder;
                      }
                    } else {
                      // Character: use characterImage from lore
                      if (lore?.characterImage) {
                        backgroundImage = `url(${lore.characterImage})`;
                      }
                    }

                    return (
                      <div className="character-display">
                        <div
                          className={`avatar-placeholder portrait-placeholder ${backgroundImage ? '' : 'no-image'}`}
                          style={{
                            backgroundImage: backgroundImage || 'none',
                            borderColor: borderColor,
                            backgroundSize: backgroundSize,
                            backgroundPosition: backgroundPosition,
                            transform: transform,
                            display: 'flex'
                          }}
                        >
                          {!backgroundImage && (
                            <i className={`fas ${selectedCreature ? 'fa-dragon' : 'fa-user'}`}></i>
                          )}
                        </div>
                        <span className="character-name">{displayName}</span>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DialogueControls;
