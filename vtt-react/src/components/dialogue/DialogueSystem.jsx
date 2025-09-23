import React, { useEffect, useRef } from 'react';
import useCharacterStore from '../../store/characterStore';
import useGameStore from '../../store/gameStore';
import useDialogueStore from '../../store/dialogueStore';
import useChatStore from '../../store/chatStore';
import './DialogueSystem.css';

const DialogueSystem = () => {
  const dialogueRef = useRef(null);
  const typewriterRef = useRef(null);

  // Store hooks
  const { name: currentCharacterName, lore } = useCharacterStore();
  const { isInMultiplayer, multiplayerSocket } = useGameStore();
  const { addSocialNotification } = useChatStore();

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

  // Get character portrait
  const getCharacterPortrait = (characterData) => {
    if (characterData?.lore?.characterIcon) {
      return characterData.lore.characterIcon;
    }
    if (characterData?.characterImage) {
      return characterData.characterImage;
    }
    if (characterData?.lore?.characterImage) {
      return characterData.lore.characterImage;
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

  // Parse text for special markup and word-level animations
  const parseTextWithMarkup = (text) => {
    if (!text) return { words: [], cleanText: '' };

    // Split text into words while preserving spaces
    const words = text.split(' ');
    const parsedWords = [];
    const cleanWords = [];

    words.forEach((word, index) => {
      // Skip empty words (from multiple spaces)
      if (!word.trim()) return;

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

      cleanWords.push(cleanWord);
      parsedWords.push({
        text: cleanWord,
        index: parsedWords.length, // Use parsedWords length for proper indexing
        animation: wordAnimation,
        color: wordColor,
        needsSpace: true // Always add space after words
      });
    });

    return {
      words: parsedWords,
      cleanText: cleanWords.join(' ')
    };
  };

  // Render text with effects and word-level animations
  const renderTextWithEffects = (displayText, effect, color) => {
    const baseStyle = {
      color: color || '#ffffff',
      textShadow: '1px 1px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000'
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
            // Add black outline to all colored text
            wordStyle.textShadow = '1px 1px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000';
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

  return (
    <div className="dialogue-system-overlay" onClick={handleDialogueClick}>
      <div 
        ref={dialogueRef}
        className={`dialogue-container ${activeDialogue.position || 'bottom'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Character Portrait */}
        <div className="dialogue-portrait">
          <div className="portrait-frame">
            {characterPortrait ? (
              <div
                className="portrait-image"
                style={{
                  backgroundImage: `url(${characterPortrait})`,
                  backgroundSize: activeDialogue.character?.lore?.imageTransformations
                    ? `${(activeDialogue.character.lore.imageTransformations.scale || 1) * 150}%`
                    : 'cover',
                  backgroundPosition: activeDialogue.character?.lore?.imageTransformations
                    ? `${50 + (activeDialogue.character.lore.imageTransformations.positionX || 0) / 2}% ${50 - (activeDialogue.character.lore.imageTransformations.positionY || 0) / 2}%`
                    : 'center center',
                  transform: activeDialogue.character?.lore?.imageTransformations
                    ? `rotate(${activeDialogue.character.lore.imageTransformations.rotation || 0}deg)`
                    : 'none'
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
