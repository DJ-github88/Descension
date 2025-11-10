import React, { useState, useEffect, useRef } from 'react';
import './AnimatedChatBubble.css';

const STEP_MESSAGES = {
  1: [ // Basic Info
    "Ah, a new adventurer approaches! What shall we call this brave soul?",
    "Every great hero needs a name that echoes through the ages...",
    "Choose wisely, for this name will be whispered in taverns for generations!",
    "What gender does this legendary figure identify with?"
  ],
  2: [ // Race & Subrace
    "Ah, the blood of ancient lineages flows through these veins!",
    "Will you be a nimble Elf, a sturdy Dwarf, or something more exotic?",
    "Your heritage shapes not just your appearance, but your very destiny!",
    "Some say the stars align differently for different races..."
  ],
  3: [ // Class
    "The moment of truth! What path shall you walk, young champion?",
    "Fighter: Smash first, ask questions later! Wizard: Knowledge is power!",
    "Rogue: Stealth and shadows, or Paladin: Light and honor?",
    "Choose your class wisely - it defines how the bards will sing of you!"
  ],
  4: [ // Starting Spells
    "Magic flows through your veins! Which arcane secrets shall you master?",
    "Fireballs or healing light? The choice is yours, spellcaster!",
    "Every spell you learn is a key to unlocking greater mysteries...",
    "Careful now, magic is both a gift and a dangerous temptation!"
  ],
  5: [ // Background
    "Everyone has a story! What shaped you before your adventures began?",
    "Were you a noble, a criminal, a scholar, or something more mysterious?",
    "Your background colors every choice you make from this day forward...",
    "A character's past is like a shadow - always there, shaping the present!"
  ],
  6: [ // Path Selection
    "The road branches before you! Which path calls to your soul?",
    "Will you embrace the arcane mysteries, or master the blade?",
    "Some paths lead to glory, others to infamy... which will you choose?",
    "Your path determines not just what you can do, but who you become!"
  ],
  7: [ // Stat Allocation
    "Numbers and destiny intertwine! How shall we distribute your natural gifts?",
    "Strength for warriors, Intelligence for mages, Wisdom for priests...",
    "Every point spent shapes the hero you'll become!",
    "Careful allocation now will save many regrets later in the dungeon!"
  ],
  8: [ // Skills & Languages
    "Knowledge is power! What worldly wisdom have you acquired?",
    "Languages of ancient empires, or skills honed in forgotten arts?",
    "A well-rounded hero is prepared for any challenge the world throws!",
    "Some skills save lives, others just make you more interesting at parties..."
  ],
  9: [ // Lore Details
    "The soul of a character lies in their story! What mysteries do you hold?",
    "A portrait says a thousand words, but your lore tells a thousand tales!",
    "Every scar, every memory, every secret shapes who you are...",
    "The greatest heroes are not born, they are forged in the fires of experience!"
  ],
  10: [ // Equipment Selection
    "Gear up, adventurer! What tools and treasures will accompany you?",
    "A sword sings, armor whispers, potions promise power...",
    "Choose wisely - what you carry today may save your life tomorrow!",
    "Every piece of equipment tells a story of battles won and treasures claimed!"
  ],
  11: [ // Character Summary
    "Behold! A hero stands ready to face destiny's call!",
    "All preparations are complete... the world awaits your legend!",
    "This is no ordinary soul, but a force that will shake the foundations!",
    "Your journey begins now. May the gods smile upon your endeavors!"
  ]
};

const AnimatedChatBubble = ({ currentStep, isEditing }) => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCursor, setShowCursor] = useState(false);
  const messages = STEP_MESSAGES[currentStep] || STEP_MESSAGES[1];
  const intervalRef = useRef(null);
  const messageRef = useRef(null);

  // Typewriter effect
  useEffect(() => {
    if (!messages || !messages[currentMessage]) return;

    const fullText = messages[currentMessage];
    let charIndex = 0;
    setDisplayedText('');
    setIsTyping(true);
    setShowCursor(true);

    intervalRef.current = setInterval(() => {
      if (charIndex < fullText.length) {
        setDisplayedText(prev => prev + fullText[charIndex]);
        charIndex++;
      } else {
        setIsTyping(false);
        setShowCursor(true);
        clearInterval(intervalRef.current);
      }
    }, 50); // Typing speed

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentMessage, currentStep]);

  // Auto-advance to next message
  useEffect(() => {
    if (!isTyping && messages && messages.length > 1) {
      const advanceTimer = setTimeout(() => {
        setCurrentMessage(prev => (prev + 1) % messages.length);
      }, 4000); // Show each message for 4 seconds

      return () => clearTimeout(advanceTimer);
    }
  }, [isTyping, messages]);

  // Cursor blinking effect
  useEffect(() => {
    if (showCursor && !isTyping) {
      const blinkInterval = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 500);

      return () => clearInterval(blinkInterval);
    }
  }, [showCursor, isTyping]);

  return (
    <div className="animated-chat-bubble">
      <div className="chat-bubble-container">
        <div className="chat-bubble">
          <div className="chat-content">
            <span ref={messageRef}>
              {displayedText}
              {showCursor && <span className="cursor">|</span>}
            </span>
          </div>
          <div className="chat-tail"></div>
        </div>
        <div className="step-indicator">
          Step {currentStep}/11
        </div>
      </div>
    </div>
  );
};

export default AnimatedChatBubble;
