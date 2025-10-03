/**
 * Global Chat Window Component
 * 
 * Main container for the combined online users list and global chat.
 * Uses a split-pane layout with resizable divider.
 */

import React, { useState, useEffect } from 'react';
import WowWindow from '../windows/WowWindow';
import OnlineUsersList from './OnlineUsersList';
import GlobalChat from './GlobalChat';
import RoomInvitationNotification from './RoomInvitationNotification';
import usePresenceStore from '../../store/presenceStore';
import useAuthStore from '../../store/authStore';
import useCharacterStore from '../../store/characterStore';
import '../../styles/global-chat.css';

const GlobalChatWindow = ({ isOpen, onClose }) => {
  const [whisperTarget, setWhisperTarget] = useState(null);
  const [splitPosition, setSplitPosition] = useState(35); // 35% for users list
  const [isDragging, setIsDragging] = useState(false);

  const { user } = useAuthStore();
  const character = useCharacterStore((state) => state.character);
  const currentUserPresence = usePresenceStore((state) => state.currentUserPresence);
  const initializePresence = usePresenceStore((state) => state.initializePresence);
  const subscribeToOnlineUsers = usePresenceStore((state) => state.subscribeToOnlineUsers);
  const cleanup = usePresenceStore((state) => state.cleanup);
  const pendingInvitations = usePresenceStore((state) => state.pendingInvitations);

  // Initialize presence when window opens
  useEffect(() => {
    if (isOpen && user && character && !currentUserPresence) {
      const characterData = {
        id: character.id,
        name: character.name,
        level: character.level,
        class: character.class,
        background: character.background,
        race: character.race,
        subrace: character.subrace
      };

      const sessionData = {
        sessionType: null // Will be updated when entering game
      };

      initializePresence(user.uid, characterData, sessionData);
      subscribeToOnlineUsers();
    }

    // Initialize mock users for testing (always, even without login)
    if (isOpen) {
      const initializeMockUsers = usePresenceStore.getState().initializeMockUsers;
      initializeMockUsers();
    }
  }, [isOpen, user, character, currentUserPresence]);

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

    const container = e.currentTarget.closest('.global-chat-container');
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

  // Handle whisper
  const handleWhisper = (user) => {
    setWhisperTarget(user);
  };

  // Clear whisper target
  const handleClearWhisper = () => {
    setWhisperTarget(null);
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

  if (!isOpen) return null;

  console.log('🎭 GlobalChatWindow rendering, isOpen:', isOpen);

  return (
    <>
      <WowWindow
        title="Community"
        icon="fas fa-users"
        isOpen={isOpen}
        onClose={onClose}
        defaultWidth={900}
        defaultHeight={600}
        minWidth={700}
        minHeight={400}
        className="global-chat-window"
      >
        <div 
          className={`global-chat-container ${isDragging ? 'dragging' : ''}`}
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
            onMouseDown={handleMouseDown}
          >
            <div className="divider-handle">
              <i className="fas fa-grip-lines-vertical"></i>
            </div>
          </div>

          {/* Right Pane - Global Chat */}
          <div 
            className="chat-pane"
            style={{ width: `${100 - splitPosition}%` }}
          >
            <GlobalChat
              whisperTarget={whisperTarget}
              onClearWhisper={handleClearWhisper}
            />
          </div>
        </div>
      </WowWindow>

      {/* Room Invitations */}
      {pendingInvitations.map((invitation) => (
        <RoomInvitationNotification
          key={invitation.id}
          invitation={invitation}
        />
      ))}
    </>
  );
};

export default GlobalChatWindow;

