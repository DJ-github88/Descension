import React, { useEffect, useRef } from 'react';
import useCharacterStore from '../../store/characterStore';
import useGameStore from '../../store/gameStore';
import useDialogueStore from '../../store/dialogueStore';
import useChatStore from '../../store/chatStore';
import useCreatureStore from '../../store/creatureStore';
import { getCreatureTokenIconUrl } from '../../utils/assetManager';
import './DialogueSystem.css';

const DialogueSystem = () => {
  const dialogueRef = useRef(null);
  const typewriterRef = useRef(null);

  // Store hooks
  const { name: currentCharacterName, lore } = useCharacterStore();
  const { isInMultiplayer, multiplayerSocket } = useGameStore();
  const { addSocialNotification } = useChatStore();
  const creatures = useCreatureStore((state) => state.creatures);

  // Dialogue store
  const {
    activeDialogue,
    currentText,
    isTyping,
    textIndex,
    updateTypewriter,
    skipTypewriter,
    hideDialogue,
    showDialogue,
    handleMultiplayerDialogue,
    setMultiplayerSocket,
    // Drag state
    customPosition,
    isDragging,
    dragOffset,
    setCustomPosition,
    setDragging
  } = useDialogueStore();
  
  // Set up multiplayer socket integration
  useEffect(() => {
    if (multiplayerSocket) {
      setMultiplayerSocket(multiplayerSocket, isInMultiplayer);
    }
  }, [multiplayerSocket, isInMultiplayer, setMultiplayerSocket]);

  // Listen for custom dialogue events
  useEffect(() => {
    const handleShowDialogue = (event) => {
      showDialogue(event.detail.text, event.detail);
    };

    window.addEventListener('showDialogue', handleShowDialogue);

    return () => {
      window.removeEventListener('showDialogue', handleShowDialogue);
    };
  }, [showDialogue]);

  // Listen for multiplayer dialogue messages
  useEffect(() => {
    if (!multiplayerSocket) return;

    const handleDialogueMessage = (data) => {
      handleMultiplayerDialogue(data.dialogueData);
    };

    multiplayerSocket.on('dialogue_message', handleDialogueMessage);

    return () => {
      multiplayerSocket.off('dialogue_message', handleDialogueMessage);
    };
  }, [multiplayerSocket, handleMultiplayerDialogue]);

  // Typewriter effect
  useEffect(() => {
    if (!activeDialogue || !isTyping) return;

    const parsedData = parseTextWithMarkup(activeDialogue.text);
    const cleanText = parsedData.cleanText;
    const speed = activeDialogue.speed || 50; // ms per character

    if (textIndex < cleanText.length) {
      typewriterRef.current = setTimeout(() => {
        const newText = cleanText.substring(0, textIndex + 1);
        const newIndex = textIndex + 1;
        updateTypewriter(newText, newIndex, true);
      }, speed);
    } else {
      updateTypewriter(currentText, textIndex, false);
      // Auto-hide after delay if specified
      if (activeDialogue.autoHide) {
        setTimeout(() => {
          hideDialogue();
        }, activeDialogue.autoHide);
      }
    }

    return () => {
      if (typewriterRef.current) {
        clearTimeout(typewriterRef.current);
      }
    };
  }, [activeDialogue, textIndex, isTyping, currentText, updateTypewriter, hideDialogue]);

  // Send dialogue to chat when new dialogue appears (but not for multiplayer received messages)
  useEffect(() => {
    if (activeDialogue && !activeDialogue.isFromMultiplayer) {
      sendDialogueToChat(activeDialogue);
    }
  }, [activeDialogue]); // Only trigger when activeDialogue changes

  // Handle click to skip or close
  const handleDialogueClick = () => {
    if (isTyping) {
      skipTypewriter();
    } else if (activeDialogue?.closeable !== false) {
      hideDialogue();
    }
  };

  // Drag event handlers
  const handleMouseDown = (e) => {
    if (e.target.closest('.dialogue-content') || e.target.closest('.dialogue-name')) {
      // Don't start drag if clicking on text content or name
      return;
    }

    // Right-click to reset position
    if (e.button === 2) {
      e.preventDefault();
      setCustomPosition(null);
      return;
    }

    e.preventDefault();
    const rect = dialogueRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    // If no custom position is set yet, set it to the current position
    if (!customPosition) {
      setCustomPosition({ x: rect.left, y: rect.top });
    }

    setDragging(true, { x: offsetX, y: offsetY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    // Constrain to viewport bounds
    const rect = dialogueRef.current.getBoundingClientRect();
    const maxX = window.innerWidth - rect.width;
    const maxY = window.innerHeight - rect.height;

    const constrainedX = Math.max(0, Math.min(newX, maxX));
    const constrainedY = Math.max(0, Math.min(newY, maxY));

    setCustomPosition({ x: constrainedX, y: constrainedY });
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setDragging(false);
    }
  };

  // Global mouse event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset.x, dragOffset.y]);

  // Get character portrait - match DialogueControls logic
  const getCharacterPortrait = (characterData) => {
    // Check if this is a creature
    const isCreature = characterData?.lore?.isCreature;
    let creature = null;
    
    if (isCreature && characterData?.lore?.id) {
      // Try to find the creature by ID
      creature = creatures.find(c => c.id === characterData.lore.id);
    }
    
    // If we found a creature, use its icon logic (same as DialogueControls)
    if (creature) {
      if (creature.customTokenImage) {
        return {
          backgroundImage: `url(${creature.customTokenImage})`,
          backgroundSize: creature.imageTransformations
            ? `${(creature.imageTransformations.scale || 1) * 100}%`
            : 'cover',
          backgroundPosition: creature.imageTransformations
            ? `${50 + (creature.imageTransformations.positionX || 0) / 2}% ${50 - (creature.imageTransformations.positionY || 0) / 2}%`
            : 'center center',
          transform: creature.imageTransformations
            ? `rotate(${creature.imageTransformations.rotation || 0}deg)`
            : 'none',
          borderColor: creature.tokenBorder || '#d4af37'
        };
      } else if (creature.tokenIcon) {
        return {
          backgroundImage: `url(${getCreatureTokenIconUrl(creature.tokenIcon, creature.type)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          transform: 'none',
          borderColor: creature.tokenBorder || '#d4af37'
        };
      }
    }
    
    // Fall back to character image logic
    if (characterData?.lore?.characterIcon) {
      return {
        backgroundImage: `url(${characterData.lore.characterIcon})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        transform: 'none',
        borderColor: '#d4af37'
      };
    }
    if (characterData?.characterImage) {
      return {
        backgroundImage: `url(${characterData.characterImage})`,
        backgroundSize: characterData?.lore?.imageTransformations
          ? `${(characterData.lore.imageTransformations.scale || 1) * 150}%`
          : 'cover',
        backgroundPosition: characterData?.lore?.imageTransformations
          ? `${50 + (characterData.lore.imageTransformations.positionX || 0) / 2}% ${50 - (characterData.lore.imageTransformations.positionY || 0) / 2}%`
          : 'center center',
        transform: characterData?.lore?.imageTransformations
          ? `rotate(${characterData.lore.imageTransformations.rotation || 0}deg)`
          : 'none',
        borderColor: '#d4af37'
      };
    }
    if (characterData?.lore?.characterImage) {
      return {
        backgroundImage: `url(${characterData.lore.characterImage})`,
        backgroundSize: characterData.lore.imageTransformations
          ? `${(characterData.lore.imageTransformations.scale || 1) * 150}%`
          : 'cover',
        backgroundPosition: characterData.lore.imageTransformations
          ? `${50 + (characterData.lore.imageTransformations.positionX || 0) / 2}% ${50 - (characterData.lore.imageTransformations.positionY || 0) / 2}%`
          : 'center center',
        transform: characterData.lore.imageTransformations
          ? `rotate(${characterData.lore.imageTransformations.rotation || 0}deg)`
          : 'none',
        borderColor: '#d4af37'
      };
    }
    return null;
  };

  // Send dialogue to chat for history
  const sendDialogueToChat = (dialogue) => {
    if (!dialogue) return;

    const characterName = dialogue.character?.name || dialogue.characterName || 'Unknown';
    const parsedData = parseTextWithMarkup(dialogue.text);
    const cleanText = parsedData.cleanText;

    // Create a dialogue message for chat
    const chatMessage = {
      sender: {
        name: characterName,
        class: 'npc',
        level: 0
      },
      content: cleanText,
      type: 'dialogue',
      timestamp: new Date().toISOString()
    };

    // Add to social chat
    addSocialNotification(chatMessage);
  };

  // Parse text for special markup and word-level animations - supports multi-word phrases
  const parseTextWithMarkup = (text) => {
    if (!text) return { words: [], cleanText: '' };

    // First, extract all markup patterns and replace them with placeholders
    const markupRegex = /\{(\w+):\s*([^}]+)\}/g;
    const markupMatches = [];
    let processedText = text;
    let matchIndex = 0;

    // Find all markup patterns (including multi-word phrases)
    let match;
    while ((match = markupRegex.exec(text)) !== null) {
      const [fullMatch, effect, content] = match;
      const placeholder = `__MARKUP_${matchIndex}__`;

      markupMatches.push({
        placeholder,
        effect,
        content: content.trim(),
        fullMatch
      });

      processedText = processedText.replace(fullMatch, placeholder);
      matchIndex++;
    }

    // Split into words, preserving placeholders
    const words = processedText.split(' ');
    const parsedWords = [];
    let cleanText = '';

    words.forEach((word, index) => {
      // Skip empty words (from multiple spaces)
      if (!word.trim()) return;

      // Check if this word contains a markup placeholder
      const placeholderMatch = word.match(/__MARKUP_(\d+)__/);

      if (placeholderMatch) {
        const markupIndex = parseInt(placeholderMatch[1]);
        const markupData = markupMatches[markupIndex];

        if (markupData) {
          const { effect, content } = markupData;

          // Determine if it's a color or animation
          const colors = ['red', 'gold', 'blue', 'green', 'purple', 'white', 'yellow', 'orange', 'black', 'rainbow'];
          const animations = ['bounce', 'shake', 'glow', 'wave', 'float', 'pulse'];

          // Split multi-word content into individual words but keep the effect
          const contentWords = content.split(' ');

          contentWords.forEach((contentWord, contentIndex) => {
            parsedWords.push({
              text: contentWord,
              color: colors.includes(effect) ? effect : null,
              animation: animations.includes(effect) ? effect : null,
              index: parsedWords.length,
              isGrouped: contentWords.length > 1,
              groupIndex: contentIndex,
              groupTotal: contentWords.length
            });

            cleanText += contentWord + (contentIndex < contentWords.length - 1 ? ' ' : '');
          });
        }
      } else {
        // Regular word without markup
        parsedWords.push({
          text: word,
          color: null,
          animation: null,
          index: parsedWords.length,
          isGrouped: false
        });

        cleanText += word;
      }

      // Add space after word group (not after individual words in a group)
      if (index < words.length - 1) {
        cleanText += ' ';
      }
    });

    return { words: parsedWords, cleanText };
  };

  // Render text with effects and word-level animations
  const renderTextWithEffects = (displayText, effect, color) => {
    const baseStyle = {
      color: color || '#ffffff',
      // Enhanced 8-directional black text stroke for 16-bit look
      textShadow: 'var(--enhanced-text-stroke)',
      // 16-bit pixelated rendering
      imageRendering: 'pixelated'
    };

    // Get the original text with markup for parsing effects
    const originalText = activeDialogue?.text || displayText;
    const parsedData = parseTextWithMarkup(originalText);
    const parsedWords = parsedData.words;
    const cleanText = parsedData.cleanText;

    // Calculate which words should be visible based on typewriter progress
    let visibleLength = displayText.length;
    let currentPos = 0;
    const visibleWords = [];

    for (let i = 0; i < parsedWords.length; i++) {
      const word = parsedWords[i];
      const wordEndPos = currentPos + word.text.length;

      if (currentPos < visibleLength) {
        if (wordEndPos <= visibleLength) {
          // Full word is visible
          visibleWords.push({ ...word, text: word.text, isPartial: false });
        } else {
          // Partial word is visible
          const partialLength = visibleLength - currentPos;
          if (partialLength > 0) {
            visibleWords.push({
              ...word,
              text: word.text.substring(0, partialLength),
              isPartial: true
            });
          }
        }
      }

      currentPos = wordEndPos + (i < parsedWords.length - 1 ? 1 : 0); // +1 for space
    }

    return (
      <span className={`dialogue-text ${effect || 'normal'}`} style={baseStyle}>
        {visibleWords.map((wordData, index) => {
          const wordStyle = { ...baseStyle };
          let wordClass = 'dialogue-word';

          // Apply word-specific color
          if (wordData.color) {
            const colorMap = {
              red: '#ff4444',
              gold: '#ffd700',
              blue: '#4488ff',
              green: '#44ff44',
              purple: '#ff44ff',
              white: '#ffffff',
              yellow: '#ffff00',
              orange: '#ff8844',
              black: '#cccccc', // Light gray so it's visible with black outline
              rainbow: '#ff4444' // Will be animated via CSS
            };
            wordStyle.color = colorMap[wordData.color] || wordStyle.color;
            // Enhanced black outline for all colored text (16-bit style)
            wordStyle.textShadow = 'var(--enhanced-text-stroke)';
            wordStyle.imageRendering = 'pixelated';
            if (wordData.color === 'rainbow') {
              wordClass += ' rainbow-word';
            }
          }

          // Apply word-specific animation
          if (wordData.animation) {
            wordClass += ` word-${wordData.animation}`;
          }

          return (
            <React.Fragment key={index}>
              <span
                className={wordClass}
                style={{
                  ...wordStyle,
                  '--word-index': wordData.index
                }}
              >
                {wordData.text}
              </span>
              {index < visibleWords.length - 1 && !wordData.isPartial && ' '}
            </React.Fragment>
          );
        })}
      </span>
    );
  };

  if (!activeDialogue) {
    return null;
  }

  const characterPortrait = getCharacterPortrait(activeDialogue.character);
  const dialogueCharacterName = activeDialogue.character?.name || activeDialogue.characterName || 'Unknown';

  const containerStyle = customPosition ? {
    position: 'absolute',
    left: `${customPosition.x}px`,
    top: `${customPosition.y}px`,
    transform: 'none',
    cursor: isDragging ? 'grabbing' : 'grab'
  } : {
    cursor: isDragging ? 'grabbing' : 'grab'
  };

  // Get backdrop effect class
  const getBackdropEffectClass = (effect) => {
    switch (effect) {
      case 'dim': return 'backdrop-dim';
      case 'brighten': return 'backdrop-brighten';
      case 'reddish': return 'backdrop-reddish';
      case 'blueish': return 'backdrop-blueish';
      case 'greenish': return 'backdrop-greenish';
      default: return '';
    }
  };

  const backdropEffectClass = getBackdropEffectClass(activeDialogue.backdropEffect);

  return (
    <div className={`dialogue-system-overlay ${backdropEffectClass}`} onClick={handleDialogueClick}>
      <div
        ref={dialogueRef}
        className={`dialogue-container ${customPosition ? 'custom-position' : (activeDialogue.position || 'bottom')} ${isDragging ? 'dragging' : ''}`}
        style={containerStyle}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={handleMouseDown}
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* Character Portrait */}
        <div className="dialogue-portrait">
          <div className="portrait-frame">
            {characterPortrait ? (
              <div
                className="portrait-image"
                style={{
                  backgroundImage: characterPortrait.backgroundImage || `url(${characterPortrait})`,
                  backgroundSize: characterPortrait.backgroundSize || 'cover',
                  backgroundPosition: characterPortrait.backgroundPosition || 'center center',
                  transform: characterPortrait.transform || 'none',
                  borderColor: characterPortrait.borderColor || '#d4af37'
                }}
              />
            ) : (
              <div className="portrait-placeholder">
                <i className="fas fa-user"></i>
              </div>
            )}
          </div>
        </div>

        {/* Dialogue Box */}
        <div className="dialogue-box">
          {/* Character Name */}
          <div className="dialogue-name">
            {dialogueCharacterName}
          </div>
          
          {/* Text Content */}
          <div className="dialogue-content">
            {renderTextWithEffects(
              currentText, 
              activeDialogue.effect, 
              activeDialogue.color
            )}
            {isTyping && <span className="typing-cursor">|</span>}
          </div>
          
          {/* Continue Indicator */}
          {!isTyping && (
            <div className="dialogue-continue">
              <span className="continue-arrow">Continue</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Export the component and utility functions
export default DialogueSystem;

// Utility function to trigger dialogue from other components
export const triggerDialogue = (text, options = {}) => {
  const event = new CustomEvent('showDialogue', {
    detail: {
      text,
      character: options.character,
      characterName: options.characterName,
      effect: options.effect || 'normal',
      color: options.color || '#ffffff',
      speed: options.speed || 50,
      position: options.position || 'bottom',
      autoHide: options.autoHide,
      closeable: options.closeable !== false
    }
  });
  window.dispatchEvent(event);
};

// Hook for using dialogue system
export const useDialogue = () => {
  const showDialogue = (text, options = {}) => {
    triggerDialogue(text, options);
  };

  return { showDialogue };
};
