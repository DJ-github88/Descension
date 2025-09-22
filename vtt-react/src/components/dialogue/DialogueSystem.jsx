import React, { useEffect, useRef } from 'react';
import useCharacterStore from '../../store/characterStore';
import useGameStore from '../../store/gameStore';
import useDialogueStore from '../../store/dialogueStore';
import './DialogueSystem.css';

const DialogueSystem = () => {
  const dialogueRef = useRef(null);
  const typewriterRef = useRef(null);

  // Store hooks
  const { name: currentCharacterName, lore } = useCharacterStore();
  const { isInMultiplayer, multiplayerSocket } = useGameStore();

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
    setMultiplayerSocket
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

    const text = activeDialogue.text;
    const speed = activeDialogue.speed || 50; // ms per character

    if (textIndex < text.length) {
      typewriterRef.current = setTimeout(() => {
        const newText = text.substring(0, textIndex + 1);
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

  // Handle click to skip or close
  const handleDialogueClick = () => {
    if (isTyping) {
      skipTypewriter();
    } else if (activeDialogue?.closeable !== false) {
      hideDialogue();
    }
  };

  // Get character portrait
  const getCharacterPortrait = (characterData) => {
    if (characterData?.characterImage) {
      return characterData.characterImage;
    }
    if (characterData?.lore?.characterImage) {
      return characterData.lore.characterImage;
    }
    return null;
  };

  // Parse text for special markup and word-level animations
  const parseTextWithMarkup = (text) => {
    if (!text) return [];

    // Split text into words and handle special markup
    const words = text.split(' ');
    const parsedWords = [];

    words.forEach((word, index) => {
      let cleanWord = word;
      let wordEffect = null;
      let wordColor = null;
      let wordAnimation = null;

      // Check for special markup patterns
      // {bounce:word} - bouncing animation
      // {shake:word} - shaking animation
      // {glow:word} - glowing effect
      // {wave:word} - wave animation
      // {float:word} - floating animation
      // {pulse:word} - pulsing animation
      // {rainbow:word} - rainbow color cycling
      // {red:word} - colored text
      // {gold:word} - gold colored text

      const markupRegex = /\{(\w+):([^}]+)\}/;
      const match = word.match(markupRegex);

      if (match) {
        const [fullMatch, effect, content] = match;
        cleanWord = content;

        // Determine effect type
        if (['bounce', 'shake', 'glow', 'wave', 'float', 'pulse'].includes(effect)) {
          wordAnimation = effect;
        } else if (['rainbow', 'red', 'gold', 'blue', 'green', 'purple', 'white', 'yellow'].includes(effect)) {
          wordColor = effect;
        }
      }

      parsedWords.push({
        text: cleanWord,
        index,
        animation: wordAnimation,
        color: wordColor,
        isLastWord: index === words.length - 1
      });
    });

    return parsedWords;
  };

  // Render text with effects and word-level animations
  const renderTextWithEffects = (text, effect, color) => {
    const baseStyle = {
      color: color || '#ffffff',
      textShadow: '2px 2px 0px #000000, -1px -1px 0px #000000, 1px -1px 0px #000000, -1px 1px 0px #000000'
    };

    const parsedWords = parseTextWithMarkup(text);

    return (
      <span className={`dialogue-text ${effect || 'normal'}`} style={baseStyle}>
        {parsedWords.map((wordData, index) => {
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
              rainbow: '#ff0000' // Will be animated via CSS
            };
            wordStyle.color = colorMap[wordData.color] || wordStyle.color;
            if (wordData.color === 'rainbow') {
              wordClass += ' rainbow-word';
            }
          }

          // Apply word-specific animation
          if (wordData.animation) {
            wordClass += ` word-${wordData.animation}`;
          }

          return (
            <span
              key={index}
              className={wordClass}
              style={{
                ...wordStyle,
                '--word-index': index
              }}
            >
              {wordData.text}
              {!wordData.isLastWord && ' '}
            </span>
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

  return (
    <div className="dialogue-system-overlay" onClick={handleDialogueClick}>
      <div 
        ref={dialogueRef}
        className={`dialogue-container ${activeDialogue.position || 'bottom'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Character Portrait */}
        <div className="dialogue-portrait">
          {characterPortrait ? (
            <img
              src={characterPortrait}
              alt={dialogueCharacterName}
              className="portrait-image"
            />
          ) : (
            <div className="portrait-placeholder">
              <i className="fas fa-user"></i>
            </div>
          )}
          <div className="portrait-frame"></div>
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
              <span className="continue-arrow">▼</span>
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
