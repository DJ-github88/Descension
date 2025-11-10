import React, { useState, useEffect, useRef } from 'react';
import './AnimatedChatBubble.css';

const STEP_MESSAGES = {
  1: [ // Basic Info
    "Ah, a new adventurer approaches! What shall we call this brave soul?",
    "Every great hero needs a name that echoes through the ages...",
    "Choose wisely, for this name will be whispered in taverns for generations!",
    "What gender does this legendary figure identify with?",
    "Your name is your first legend - make it unforgettable!",
    "A hero's name should strike fear into the hearts of their enemies!"
  ],
  2: [ // Race & Subrace
    "Ah, the blood of ancient lineages flows through these veins!",
    "Will you be a nimble Elf, a sturdy Dwarf, or something more exotic?",
    "Your heritage shapes not just your appearance, but your very destiny!",
    "Some say the stars align differently for different races...",
    "Each race carries the wisdom of centuries in their bones!",
    "Your ancestry tells the story of where your journey truly began!",
    "From the forests to the mountains, every race has its own magic!"
  ],
  3: [ // Class
    "The moment of truth! What path shall you walk, young champion?",
    "Fighter: Smash first, ask questions later! Wizard: Knowledge is power!",
    "Rogue: Stealth and shadows, or Paladin: Light and honor?",
    "Choose your class wisely - it defines how the bards will sing of you.",
    "Every class has mastered different arts of survival and glory!",
    "Your profession shapes not just your skills, but your very worldview!",
    "Some fight with steel, others with magic, all fight for honor!"
  ],
  4: [ // Starting Spells
    "Magic flows through your veins! Which arcane secrets shall you master?",
    "Fireballs or healing light? The choice is yours, spellcaster!",
    "Every spell you learn is a key to unlocking greater mysteries...",
    "Careful now, magic is both a gift and a dangerous temptation!",
    "The arcane arts require patience, wisdom, and a touch of madness!",
    "Your first spells will define the path of your magical journey!",
    "Magic is like a double-edged sword - beautiful yet deadly!"
  ],
  5: [ // Background
    "Everyone has a story! What shaped you before your adventures began?",
    "Were you a noble, a criminal, a scholar, or something more mysterious?",
    "Your background colors every choice you make from this day forward...",
    "A character's past is like a shadow - always there, shaping the present!",
    "Every hero has a beginning, and yours is about to unfold!",
    "Your past experiences make you unique among adventurers!",
    "The world is full of stories - yours is about to become legendary!"
  ],
  6: [ // Path Selection
    "The road branches before you! Which path calls to your soul?",
    "Will you embrace the arcane mysteries, or master the blade?",
    "Some paths lead to glory, others to infamy... which will you choose?",
    "Your path determines not just what you can do, but who you become!",
    "Every path has its own challenges and rewards awaiting!",
    "Choose the path that resonates with your inner spirit!",
    "Some walk the path of light, others darkness, but all seek truth!"
  ],
  7: [ // Stat Allocation
    "Numbers and destiny intertwine! How shall we distribute your natural gifts?",
    "Strength for warriors, Intelligence for mages, Wisdom for priests...",
    "Every point spent shapes the hero you'll become!",
    "Careful allocation now will save many regrets later in the dungeon!",
    "Your natural abilities are the foundation of your legendary status!",
    "Balance is key - every stat tells part of your hero's story!",
    "Some are born with gifts, others forge them through experience!"
  ],
  8: [ // Skills & Languages
    "Knowledge is power! What worldly wisdom have you acquired?",
    "Languages of ancient empires, or skills honed in forgotten arts?",
    "A well-rounded hero is prepared for any challenge the world throws!",
    "Some skills save lives, others just make you more interesting at parties...",
    "The world speaks many tongues - which ones do you understand?",
    "Every skill mastered brings you closer to legendary status!",
    "True heroes are not just strong, but wise and knowledgeable!"
  ],
  9: [ // Lore Details
    "The soul of a character lies in their story! What mysteries do you hold?",
    "A portrait says a thousand words, but your lore tells a thousand tales!",
    "Every scar, every memory, every secret shapes who you are...",
    "The greatest heroes are not born, they are forged in the fires of experience!",
    "Your story is what makes you memorable among countless adventurers!",
    "Every detail adds depth to the legend you will become!",
    "Heroes aren't defined by their victories, but by their stories!"
  ],
  10: [ // Equipment Selection
    "Gear up, adventurer! What tools and treasures will accompany you?",
    "A sword sings, armor whispers, potions promise power...",
    "Choose wisely - what you carry today may save your life tomorrow!",
    "Every piece of equipment tells a story of battles won and treasures claimed!",
    "Your gear is an extension of yourself - choose it carefully!",
    "The right equipment can turn the tide of any battle!",
    "Adventurers live and die by their equipment choices!"
  ],
  11: [ // Character Summary
    "Behold! A hero stands ready to face destiny's call!",
    "All preparations are complete... the world awaits your legend!",
    "This is no ordinary soul, but a force that will shake the foundations!",
    "Your journey begins now. May the gods smile upon your endeavors!",
    "The world trembles at the approach of such a formidable hero!",
    "Your legend begins today - may it echo through eternity!",
    "Prepared for glory or infamy, your destiny awaits!"
  ]
};

const AnimatedChatBubble = ({ currentStep, isEditing }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCursor, setShowCursor] = useState(false);
  const messages = STEP_MESSAGES[currentStep] || STEP_MESSAGES[1];
  const intervalRef = useRef(null);
  const messageRef = useRef(null);


  // Typewriter effect
  useEffect(() => {
    if (!messages || !messages[currentMessageIndex] || typeof messages[currentMessageIndex] !== 'string') {
      setDisplayedText('Welcome, adventurer!');
      return;
    }

    const fullText = String(messages[currentMessageIndex]).trim();
    if (!fullText) {
      setDisplayedText('Welcome, adventurer!');
      return;
    }

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
    }, 80); // Slower typing speed

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentMessageIndex, currentStep, messages]);

  // Auto-advance to random message
  useEffect(() => {
    if (!isTyping && messages && messages.length > 1) {
      const advanceTimer = setTimeout(() => {
        setCurrentMessageIndex(prev => {
          // Pick a random message different from current one
          let newIndex;
          do {
            newIndex = Math.floor(Math.random() * messages.length);
          } while (newIndex === prev && messages.length > 1);
          return newIndex;
        });
      }, 5000); // Show each message for 5 seconds (slightly longer for slower typing)

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
        </div>
      </div>
    </div>
  );
};

export default AnimatedChatBubble;
