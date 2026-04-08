/**
 * Global Chat Window Component
 * 
 * Main container for the combined online users list and global chat.
 * Uses a split-pane layout with resizable divider.
 */

import React, { useState, useEffect } from 'react';
import WowWindow from '../windows/WowWindow';
import OnlineUsersList from './OnlineUsersList';
import ChatTabs from './ChatTabs';
import TabbedChat from './TabbedChat';
import usePresenceStore from '../../store/presenceStore';
import useAuthStore from '../../store/authStore';
import useCharacterStore from '../../store/characterStore';
import useSocialStore from '../../store/socialStore';
import '../../styles/global-chat.css';

const GlobalChatWindow = ({ isOpen, onClose }) => {
  const [splitPosition, setSplitPosition] = useState(35); // 35% for users list
  const [isDragging, setIsDragging] = useState(false);
  const [isUsersPaneHidden, setIsUsersPaneHidden] = useState(false);

  const { user, userData } = useAuthStore();
  // Get character data from characterStore - use individual selectors to trigger updates
  const characterName = useCharacterStore((state) => state.name);
  const characterClass = useCharacterStore((state) => state.class);
  const characterLevel = useCharacterStore((state) => state.level);
  const characterRace = useCharacterStore((state) => state.race);
  const characterSubrace = useCharacterStore((state) => state.subrace);
  const characterRaceDisplayName = useCharacterStore((state) => state.raceDisplayName);
  const characterBackground = useCharacterStore((state) => state.background);
  const characterBackgroundDisplayName = useCharacterStore((state) => state.backgroundDisplayName);
  const characterPath = useCharacterStore((state) => state.path);
  const characterPathDisplayName = useCharacterStore((state) => state.pathDisplayName);
  const characterId = useCharacterStore((state) => state.currentCharacterId);

  const currentUserPresence = usePresenceStore((state) => state.currentUserPresence);
  const initializePresence = usePresenceStore((state) => state.initializePresence);
  const subscribeToOnlineUsers = usePresenceStore((state) => state.subscribeToOnlineUsers);
  const cleanup = usePresenceStore((state) => state.cleanup);
  const openWhisperTab = usePresenceStore((state) => state.openWhisperTab);
  const initializeSocial = useSocialStore((state) => state.initialize);

  // Initialize presence when window opens (fallback if not already initialized by GlobalSocketManager)
  // NOTE: GlobalSocketManager now initializes presence on login, so this is a backup
  useEffect(() => {
    if (isOpen && !currentUserPresence) {
      // CRITICAL: Check for default "Character Name" and use account name as fallback
      const isDefaultName = characterName === 'Character Name' || characterName === 'Character Name (Room Name)';
      const resolvedCharacterName = (!isDefaultName && characterName) ? characterName : (user?.displayName || 'Guest');
      
      // Use character data if available, otherwise use defaults
      const characterData = {
        id: characterId || 'temp_character',
        name: resolvedCharacterName,
        level: characterLevel || 1,
        class: characterClass || 'Adventurer',
        background: characterBackground || '',
        backgroundDisplayName: characterBackgroundDisplayName || '',
        race: characterRace || '',
        subrace: characterSubrace || '',
        raceDisplayName: characterRaceDisplayName || '',
        path: characterPath || '',
        pathDisplayName: characterPathDisplayName || ''
      };

      const sessionData = {
        sessionType: null // Will be updated when entering game
      };

      // Use user.uid if logged in, otherwise use a dev mode ID
      const userId = user?.uid || `dev_user_${characterId || 'guest'}`;
      const accountName = user?.displayName || user?.name || user?.email?.split('@')[0] || (user?.isGuest ? 'Guest' : 'Adventurer');
      const isGuest = user?.isGuest || false;

      console.log('🎭 GlobalChatWindow: Initializing presence (fallback) with character:', characterData);
      console.log('🎭 User ID:', userId, '(logged in:', !!user, ')');
      console.log('🎭 Account Name:', accountName, 'isGuest:', isGuest);
      const friendId = userData?.friendId || user?.friendId || null;
      initializePresence(userId, characterData, sessionData, accountName, isGuest, friendId);
      subscribeToOnlineUsers();
    }

    // Initialize social store for friends and requests (always when window opens and user exists)
    if (isOpen && user?.uid) {
      initializeSocial(user.uid);
    }
  }, [isOpen, user, characterId, currentUserPresence]);

  // Update presence when character changes
  useEffect(() => {
    if (isOpen && characterId && currentUserPresence) {
      // CRITICAL: Check for default "Character Name" and use account name as fallback
      const isDefaultName = characterName === 'Character Name' || characterName === 'Character Name (Room Name)';
      const resolvedCharacterName = (!isDefaultName && characterName) ? characterName : (user?.displayName || 'Adventurer');
      
      const characterData = {
        id: characterId,
        name: resolvedCharacterName,
        level: characterLevel,
        class: characterClass,
        background: characterBackground,
        backgroundDisplayName: characterBackgroundDisplayName,
        race: characterRace,
        subrace: characterSubrace,
        raceDisplayName: characterRaceDisplayName,
        path: characterPath,
        pathDisplayName: characterPathDisplayName
      };

      const sessionData = {
        sessionType: currentUserPresence.sessionType || null
      };

      // Use user.uid if logged in, otherwise use a dev mode ID
      const userId = user?.uid || `dev_user_${characterId}`;
      const accountName = user?.displayName || user?.name || user?.email?.split('@')[0] || (user?.isGuest ? 'Guest' : 'Adventurer');
      const isGuest = user?.isGuest || false;
      const friendId = userData?.friendId || user?.friendId || null;

      console.log('🔄 Updating presence with new character data:', characterData);
      // Re-initialize presence with updated character data
      initializePresence(userId, characterData, sessionData, accountName, isGuest, friendId);
    }
  }, [characterId, characterName, characterClass, characterRace, characterSubrace, characterRaceDisplayName, characterBackground, characterBackgroundDisplayName, characterPath, characterLevel]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (!isOpen) {
        cleanup();
      }
    };
  }, [isOpen]);

  // Handle split pane dragging
  const handleMouseDown = (e) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const container = document.querySelector('.global-chat-container');
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const newPosition = ((e.clientX - rect.left) / rect.width) * 100;

    // Constrain between 20% and 50%
    setSplitPosition(Math.max(20, Math.min(50, newPosition)));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  // Handle user click
  const handleUserClick = (user) => {
    console.log('User clicked:', user);
    // Could expand to show user profile or other actions
  };

  // Handle whisper - opens whisper tab
  const handleWhisper = (user) => {
    openWhisperTab(user);
  };

  // Handle invite to room
  const handleInviteToRoom = (user) => {
    const sendRoomInvite = usePresenceStore.getState().sendRoomInvite;

    if (currentUserPresence?.sessionType === 'multiplayer') {
      sendRoomInvite(
        user.userId,
        currentUserPresence.roomId,
        currentUserPresence.roomName
      );

      // Show confirmation
      console.log(`Invitation sent to ${user.characterName}`);
    }
  };

  // Toggle users pane visibility
  const toggleUsersPane = () => {
    setIsUsersPaneHidden(!isUsersPaneHidden);
  };

  if (!isOpen) return null;

  console.log('🎭 GlobalChatWindow rendering, isOpen:', isOpen);

  return (
    <>
      <WowWindow
        isOpen={isOpen}
        onClose={onClose}
        defaultSize={{ width: 1200, height: 800 }}
        className="global-chat-window"
        customHeader={
          <div className="spellbook-tab-container">
            <button className="spellbook-tab-button active">
              <i className="fas fa-users" style={{ marginRight: '8px' }}></i>
              <span>COMMUNITY</span>
            </button>
          </div>
        }
      >
        <div
          className={`global-chat-container ${isDragging ? 'dragging' : ''} ${isUsersPaneHidden ? 'users-pane-hidden' : ''}`}
          onMouseMove={isDragging ? handleMouseMove : undefined}
        >
          {/* Left Pane - Online Users */}
          <div
            className="users-pane"
            style={{ width: `${splitPosition}%` }}
          >
            <OnlineUsersList
              onUserClick={handleUserClick}
              onWhisper={handleWhisper}
              onInviteToRoom={handleInviteToRoom}
            />
          </div>

          {/* Resizable Divider */}
          <div
            className="split-divider"
            onMouseDown={!isUsersPaneHidden ? handleMouseDown : undefined}
            style={{ cursor: isUsersPaneHidden ? 'default' : 'col-resize' }}
          >
            <div className="divider-handle">
              <i className="fas fa-grip-lines-vertical"></i>
            </div>
          </div>

          {/* Right Pane - Tabbed Chat */}
          <div
            className="chat-pane"
            style={{ width: isUsersPaneHidden ? '100%' : `${100 - splitPosition}%` }}
          >
            <ChatTabs
              isUsersPaneHidden={isUsersPaneHidden}
              onToggleUsersPane={toggleUsersPane}
            />
            <TabbedChat />
          </div>
        </div>
      </WowWindow>
    </>
  );
};

export default GlobalChatWindow;
