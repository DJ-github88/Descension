import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import useSettingsStore from '../../store/settingsStore';
import usePresenceStore from '../../store/presenceStore';
import usePartyStore from '../../store/partyStore';
import useGameStore from '../../store/gameStore';
import '../../styles/chat-bubble.css';

const ChatBubbleManager = () => {
  const showSpeechBubbles = useSettingsStore(state => state.showSpeechBubbles);
  const bubbleDuration = useSettingsStore(state => (state.speechBubbleDuration || 5) * 1000);
  
  // Subscribe to all message sources
  const globalMessages = usePresenceStore(state => state.globalChatMessages);
  const partyMessages = usePresenceStore(state => state.partyChatMessages);
  const whisperTabs = usePresenceStore(state => state.whisperTabs);
  const partyMembers = usePartyStore(state => state.partyMembers);
  
  // Get current user's ID from presence store
  const currentGamePlayerId = useGameStore(state => state.currentPlayer?.id);
  const multiplayerRoomId = useGameStore(state => state.multiplayerRoom?.id);
  const isInMultiplayer = useGameStore(state => state.isInMultiplayer);
  const currentUserId = usePresenceStore(state => 
    state.currentUserPresence?.userId || currentGamePlayerId || 'current-player'
  );
  
  const [activeBubbles, setActiveBubbles] = useState([]);
  const processedMessageIds = useRef(new Set());
  const senderQueuesRef = useRef(new Map());
  const senderTimersRef = useRef(new Map());
  const activeSenderKeysRef = useRef(new Set());
  
  // CRITICAL: Reset all queues when switching rooms or multiplayer status
  useEffect(() => {
    // Stop all current animations and clear queues
    setActiveBubbles([]);
    clearAllBubbleTimers();
    senderQueuesRef.current.clear();
    activeSenderKeysRef.current.clear();
    // Note: We don't clear processedMessageIds here as it would cause 
    // the main effect to re-play all recent history from the store.
  }, [multiplayerRoomId, isInMultiplayer]);

  const clearAllBubbleTimers = () => {
    senderTimersRef.current.forEach((timerId) => {
      clearTimeout(timerId);
    });
    senderTimersRef.current.clear();
  };

  const getSenderKey = (senderId, senderName) => senderId || senderName || 'unknown-sender';

  const showNextBubbleForSender = (senderKey) => {
    const queue = senderQueuesRef.current.get(senderKey) || [];
    const nextBubble = queue.shift();

    if (!nextBubble) {
      activeSenderKeysRef.current.delete(senderKey);
      senderQueuesRef.current.delete(senderKey);
      return;
    }

    senderQueuesRef.current.set(senderKey, queue);
    activeSenderKeysRef.current.add(senderKey);

    setActiveBubbles((prev) => {
      const withoutSender = prev.filter((bubble) => bubble.senderKey !== senderKey);
      return [...withoutSender, nextBubble].slice(-20);
    });

    const existingTimer = senderTimersRef.current.get(senderKey);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    const timerId = setTimeout(() => {
      setActiveBubbles((prev) => prev.filter((bubble) => bubble.id !== nextBubble.id));
      showNextBubbleForSender(senderKey);
    }, bubbleDuration);

    senderTimersRef.current.set(senderKey, timerId);
  };

  const enqueueBubbleForSender = (bubble) => {
    const senderKey = getSenderKey(bubble.senderId, bubble.sender);
    const queue = senderQueuesRef.current.get(senderKey) || [];
    queue.push({ ...bubble, senderKey });
    senderQueuesRef.current.set(senderKey, queue);

    if (!activeSenderKeysRef.current.has(senderKey)) {
      showNextBubbleForSender(senderKey);
    }
  };
  
  // Determine if current user should see bubble
  const shouldShowBubbleForUser = (message) => {
    // Global/Party messages: everyone sees bubble
    if (message.type === 'message' || message.type === 'party') {
      return true;
    }
    
    // Whisper messages: recipient always sees incoming; sender sees own sent whisper
    if (message.type === 'whisper_received') {
      return !message.recipientId || message.recipientId === currentUserId;
    }

    if (message.type === 'whisper_sent') {
      return message.senderId === currentUserId;
    }
    
    // System messages: no bubbles
    return false;
  };
  
  // Get sender's screen position
  const getSenderPosition = (senderName, senderId) => {
    const esc = (value) => {
      if (!value) return '';
      if (typeof window !== 'undefined' && window.CSS && window.CSS.escape) {
        return window.CSS.escape(String(value));
      }
      return String(value).replace(/"/g, '\\"');
    };

    const partyMemberMatch = partyMembers.find((member) =>
      member?.id === senderId ||
      member?.socketId === senderId ||
      (senderName && member?.name === senderName)
    );

    const candidateSenderIds = Array.from(new Set([
      senderId,
      partyMemberMatch?.id,
      partyMemberMatch?.socketId
    ].filter(Boolean)));

    const safeSenderIdSelectors = candidateSenderIds.map((id) => `[data-player-id="${esc(id)}"]`);
    const safeSenderName = esc(senderName);

    // Try party member HUD position first (look for data-player-id)
    const hudSelector = [
      ...safeSenderIdSelectors,
      safeSenderName ? `[data-character-name="${safeSenderName}"]` : null
    ].filter(Boolean).join(', ');

    const hudMemberElement = hudSelector ? document.querySelector(hudSelector) : null;
    
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

    // Fallback: try matching party HUD member text by sender name
    if (senderName) {
      const partyFrames = Array.from(document.querySelectorAll('.party-member-frame'));
      const matchingFrame = partyFrames.find((frame) => {
        const nameEl = frame.querySelector('.member-name');
        const text = (nameEl?.textContent || '').toLowerCase();
        return text.includes(String(senderName).toLowerCase());
      });

      if (matchingFrame) {
        const rect = matchingFrame.getBoundingClientRect();
        return {
          x: rect.right + 10,
          y: rect.top + rect.height / 2 - 30,
          element: matchingFrame
        };
      }
    }
    
    // Fallback: Try token position
    const tokenSelector = [
      safeSenderName ? `[data-character-name="${safeSenderName}"]` : null,
      ...safeSenderIdSelectors
    ].filter(Boolean).join(', ');

    const tokenElement = tokenSelector ? document.querySelector(tokenSelector) : null;
    
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
      clearAllBubbleTimers();
      senderQueuesRef.current.clear();
      activeSenderKeysRef.current.clear();
      return;
    }
    
    /* 
    // Process global chat messages - DISABLED as per user request (only whisper/party)
    const newGlobalMessages = globalMessages.filter(msg => 
      msg.type === 'message' && !processedMessageIds.current.has(msg.id)
    );
    
    newGlobalMessages.forEach(msg => {
      if (shouldShowBubbleForUser(msg)) {
        const position = getSenderPosition(msg.senderName, msg.senderId);
        enqueueBubbleForSender({
          id: msg.id,
          sender: msg.senderName,
          senderId: msg.senderId,
          content: msg.content,
          position,
          anchorElement: position.element,
          timestamp: Date.now()
        });
      }
      processedMessageIds.current.add(msg.id);
    });
    */
    
    // Process party chat messages
    const newPartyMessages = partyMessages.filter(msg => 
      !processedMessageIds.current.has(msg.id)
    );
    
    newPartyMessages.forEach(msg => {
      if (shouldShowBubbleForUser(msg)) {
        // Signature-based deduplication (prevent double bubbles from Social + Room sockets)
        const signature = `party:${msg.senderId}:${msg.content.substring(0, 20)}:${Math.floor(new Date(msg.timestamp).getTime() / 1000)}`;
        if (processedMessageIds.current.has(signature)) return;

        const position = getSenderPosition(msg.senderName, msg.senderId);
        enqueueBubbleForSender({
          id: msg.id,
          sender: msg.senderName,
          senderId: msg.senderId,
          content: msg.content,
          position,
          anchorElement: position.element,
          timestamp: Date.now(),
          isParty: true
        });
        
        processedMessageIds.current.add(signature);
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
          // Signature-based deduplication for whispers
          const signature = `whisper:${msg.senderId}:${msg.content.substring(0, 20)}:${Math.floor(new Date(msg.timestamp).getTime() / 1000)}`;
          if (processedMessageIds.current.has(signature)) return;

          // For whispers, bubble shows from SENDER (person who whispered to you)
          const position = getSenderPosition(msg.senderName, msg.senderId);
          enqueueBubbleForSender({
            id: msg.id,
            sender: msg.senderName,
            senderId: msg.senderId,
            content: msg.content,
            position,
            anchorElement: position.element,
            timestamp: Date.now(),
            isWhisper: true  // For visual styling distinction
          });

          processedMessageIds.current.add(signature);
        }
        processedMessageIds.current.add(msg.id);
      });
    });

  }, [globalMessages, partyMessages, whisperTabs, showSpeechBubbles, currentUserId, partyMembers, bubbleDuration]);

  useEffect(() => {
    return () => {
      clearAllBubbleTimers();
    };
  }, []);
  
  // Listen for window resize to recalculate positions
  useEffect(() => {
    if (activeBubbles.length === 0) return;
    
    const handleResize = () => {
      setActiveBubbles(prev => 
        prev.map(bubble => {
          if (bubble.anchorElement) {
            const rect = bubble.anchorElement.getBoundingClientRect();
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
          className={`chat-bubble ${bubble.isWhisper ? 'whisper-bubble' : ''} ${bubble.isParty ? 'party-bubble' : ''}`}
          style={{
            position: 'fixed',
            left: bubble.position.x,
            top: bubble.position.y,
            zIndex: 9999
          }}
        >
          <div className="chat-bubble-content">{bubble.content}</div>
        </div>
      ))}
    </div>,
    document.body
  );
};

export default ChatBubbleManager;
