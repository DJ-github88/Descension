import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import useSettingsStore from '../../store/settingsStore';
import usePresenceStore from '../../store/presenceStore';
import usePartyStore from '../../store/partyStore';
import useCharacterStore from '../../store/characterStore';
import './chat-bubble.css';

const ChatBubbleManager = () => {
  const showSpeechBubbles = useSettingsStore(state => state.showSpeechBubbles);
  const bubbleDuration = useSettingsStore(state => (state.speechBubbleDuration || 5) * 1000);
  
  // Subscribe to all message sources
  const globalMessages = usePresenceStore(state => state.globalChatMessages);
  const partyMessages = usePresenceStore(state => state.partyChatMessages);
  const whisperTabs = usePresenceStore(state => state.whisperTabs);
  const partyMembers = usePartyStore(state => state.partyMembers);
  
  // Get current user's ID from presence store
  const currentUser = useCharacterStore(state => state.name);
  const currentUserId = usePresenceStore(state => 
    state.currentUserPresence?.userId || 'current-player'
  );
  
  const [activeBubbles, setActiveBubbles] = useState([]);
  const processedMessageIds = useRef(new Set());
  
  // Determine if current user should see bubble
  const shouldShowBubbleForUser = (message) => {
    // Global/Party messages: everyone sees bubble
    if (message.type === 'message' || message.type === 'party') {
      return true;
    }
    
    // Whisper messages: only recipient sees bubble
    if (message.type === 'whisper_sent' || message.type === 'whisper_received') {
      // Check if current user is the recipient
      return message.recipientId === currentUserId;
    }
    
    // System messages: no bubbles
    return false;
  };
  
  // Get sender's screen position
  const getSenderPosition = (senderName, senderId) => {
    // Try party member HUD position first (look for data-player-id)
    const hudMemberElement = document.querySelector(
      `[data-player-id="${senderId}"], [data-character-name="${senderName}"]`
    );
    
    if (hudMemberElement) {
      const rect = hudMemberElement.getBoundingClientRect();
      
      // Position bubble to the RIGHT of HUD element
      // Small horizontal gap (10px) and vertical centering
      return {
        x: rect.right + 10,  // 10px to the right of HUD element
        y: rect.top + rect.height / 2 - 30,  // Vertically centered, offset up
        element: hudMemberElement  // Store reference for dynamic updates
      };
    }
    
    // Fallback: Try token position
    const tokenElement = document.querySelector(
      `[data-character-name="${senderName}"], [data-player-id="${senderId}"]`
    );
    
    if (tokenElement) {
      const rect = tokenElement.getBoundingClientRect();
      return {
        x: rect.right + 10,  // Right of token
        y: rect.top - 80,
        element: tokenElement
      };
    }
    
    // Last resort: Default position (right side of screen)
    return { x: window.innerWidth - 300, y: 100 };
  };
  
  // Main effect: Process messages and create bubbles
  useEffect(() => {
    if (!showSpeechBubbles) {
      // Clear all bubbles immediately if disabled
      if (activeBubbles.length > 0) {
        setActiveBubbles([]);
        processedMessageIds.current.clear();
      }
      return;
    }
    
    const newBubbles = [];
    
    // Process global chat messages
    const newGlobalMessages = globalMessages.filter(msg => 
      msg.type === 'message' && !processedMessageIds.current.has(msg.id)
    );
    
    newGlobalMessages.forEach(msg => {
      if (shouldShowBubbleForUser(msg)) {
        const position = getSenderPosition(msg.senderName, msg.senderId);
        newBubbles.push({
          id: msg.id,
          sender: msg.senderName,
          senderId: msg.senderId,
          content: msg.content,
          position,
          timestamp: Date.now()
        });
      }
      processedMessageIds.current.add(msg.id);
    });
    
    // Process party chat messages
    const newPartyMessages = partyMessages.filter(msg => 
      !processedMessageIds.current.has(msg.id)
    );
    
    newPartyMessages.forEach(msg => {
      if (shouldShowBubbleForUser(msg)) {
        const position = getSenderPosition(msg.senderName, msg.senderId);
        newBubbles.push({
          id: msg.id,
          sender: msg.senderName,
          senderId: msg.senderId,
          content: msg.content,
          position,
          timestamp: Date.now()
        });
      }
      processedMessageIds.current.add(msg.id);
    });
    
    // Process whisper messages from all whisper tabs
    whisperTabs.forEach((whisperTab, userId) => {
      const newWhisperMessages = whisperTab.messages.filter(msg => 
        !processedMessageIds.current.has(msg.id)
      );
      
      newWhisperMessages.forEach(msg => {
        if (shouldShowBubbleForUser(msg)) {
          // For whispers, bubble shows from SENDER (person who whispered to you)
          const position = getSenderPosition(msg.senderName, msg.senderId);
          newBubbles.push({
            id: msg.id,
            sender: msg.senderName,
            senderId: msg.senderId,
            content: msg.content,
            position,
            timestamp: Date.now(),
            isWhisper: true  // For visual styling distinction
          });
        }
        processedMessageIds.current.add(msg.id);
      });
    });
    
    if (newBubbles.length === 0) return;
    
    // Add new bubbles with limit to 15 max (FIFO)
    setActiveBubbles(prev => {
      const combined = [...prev, ...newBubbles];
      return combined.slice(-15);  // Keep only most recent 15
    });
    
    // Remove bubbles after configured duration
    setTimeout(() => {
      setActiveBubbles(prev => 
        prev.filter(b => !newBubbles.some(nb => nb.id === b.id))
      );
    }, bubbleDuration);
    
  }, [globalMessages, partyMessages, whisperTabs, showSpeechBubbles, currentUserId, partyMembers, bubbleDuration]);
  
  // Listen for window resize to recalculate positions
  useEffect(() => {
    if (activeBubbles.length === 0) return;
    
    const handleResize = () => {
      setActiveBubbles(prev => 
        prev.map(bubble => {
          if (bubble.element) {
            const rect = bubble.element.getBoundingClientRect();
            return {
              ...bubble,
              position: {
                x: rect.right + 10,
                y: rect.top + rect.height / 2 - 30
              }
            };
          }
          return bubble;
        })
      );
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeBubbles]);
  
  return createPortal(
    <div className="chat-bubbles-overlay" style={{ '--bubble-duration': `${bubbleDuration / 1000}s` }}>
      {activeBubbles.map(bubble => (
        <div
          key={bubble.id}
          className={`chat-bubble ${bubble.isWhisper ? 'whisper-bubble' : ''}`}
          style={{
            position: 'fixed',
            left: bubble.position.x,
            top: bubble.position.y,
            zIndex: 9999
          }}
        >
          <div className="chat-bubble-sender">
            {bubble.sender}
            {bubble.isWhisper && <span className="whisper-indicator"> (whisper)</span>}
          </div>
          <div className="chat-bubble-content">{bubble.content}</div>
        </div>
      ))}
    </div>,
    document.body
  );
};

export default ChatBubbleManager;
