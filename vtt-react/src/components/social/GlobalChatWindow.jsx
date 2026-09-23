/**
 * Global Chat Window Component
 * 
 * Main container for the combined online users list and global chat.
 * Uses a split-pane layout with resizable divider.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import MythrillWindow from '../windows/MythrillWindow';
import OnlineUsersList from './OnlineUsersList';
import ChatTabs from './ChatTabs';
import TabbedChat from './TabbedChat';
import usePresenceStore from '../../store/presenceStore';
import useAuthStore from '../../store/authStore';
import useCharacterStore from '../../store/characterStore';
import useSocialStore from '../../store/socialStore';
import '../../styles/global-chat.css';

const isMobile = () => window.innerWidth <= 768;

/**
 * HeaderDropdown — renders the dropdown menu in a portal so that
 * overflow:hidden on the spellbook-tab-container never clips it.
 */
const HeaderDropdown = ({ label, icon, children }) => {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const hideTimerRef = useRef(null);

  const showMenu = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setMenuPos({ top: rect.bottom, left: rect.left });
    }
    setOpen(true);
  }, []);

  const scheduleHide = useCallback(() => {
    hideTimerRef.current = setTimeout(() => setOpen(false), 120);
  }, []);

  const cancelHide = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
  }, []);

  useEffect(() => () => { if (hideTimerRef.current) clearTimeout(hideTimerRef.current); }, []);

  return (
    <div
      className="header-tab-dropdown"
      onMouseEnter={showMenu}
      onMouseLeave={scheduleHide}
    >
      <button
        ref={btnRef}
        className="spellbook-tab-button active"
        type="button"
      >
        <i className={`fas ${icon}`}></i>
        <span className="tab-text">{label}</span>
      </button>

      {open && createPortal(
        <div
          ref={menuRef}
          className="header-dropdown-menu header-dropdown-menu--portal"
          style={{ top: menuPos.top, left: menuPos.left }}
          onMouseEnter={cancelHide}
          onMouseLeave={scheduleHide}
        >
          {children}
        </div>,
        document.body
      )}
    </div>
  );
};

const GlobalChatWindow = ({ isOpen, onClose }) => {
  const [splitPosition, setSplitPosition] = useState(35);
  const [isDragging, setIsDragging] = useState(false);
  const [isUsersPaneHidden, setIsUsersPaneHidden] = useState(isMobile());
  const splitRafRef = useRef(null);

  // Community (left pane) view — lifted here so the header dropdown can control it
  const [communityView, setCommunityView] = useState('online');

  // Chat (right pane) view — read/write from presence store
  const chatActiveTab = usePresenceStore((state) => state.activeTab);
  const setChatActiveTab = usePresenceStore((state) => state.setActiveTab);

  const isMobileRef = useRef(isMobile());

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
  const openWhisperTab = usePresenceStore((state) => state.openWhisperTab);
  const initializeSocial = useSocialStore((state) => state.initialize);

  // Primitive auth slices keep effects from re-running on unrelated auth-store
  // updates (the whole `user` object changes identity easily).
  const userUid = user?.uid;
  const userDisplayName = user?.displayName;
  const userEmail = user?.email;
  const userIsGuest = user?.isGuest;
  const userFriendId = user?.friendId;
  const friendId = userData?.friendId || userFriendId || null;

  // Signature of the character fields that actually affect presence. Used to
  // stop the per-keystroke `setDoc(presence)` storm: typing a character name
  // used to rewrite the full presence document on every keypress.
  const presenceSignature = [
    characterId,
    characterName,
    characterClass,
    characterLevel,
    characterRace,
    characterSubrace,
    characterRaceDisplayName,
    characterBackground,
    characterBackgroundDisplayName,
    characterPath,
    characterPathDisplayName
  ].join('|');
  const lastPresenceSignatureRef = useRef(null);

  // Initialize presence when window opens (fallback if not already initialized by GlobalSocketManager)
  // NOTE: GlobalSocketManager now initializes presence on login, so this is a backup
  useEffect(() => {
    if (isOpen && !currentUserPresence) {
      // CRITICAL: Check for default "Character Name" and use account name as fallback
      const isDefaultName = characterName === 'Character Name' || characterName === 'Character Name (Room Name)';
      const resolvedCharacterName = (!isDefaultName && characterName) ? characterName : (userDisplayName || 'Guest');

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
      const userId = userUid || `dev_user_${characterId || 'guest'}`;
      const accountName = userDisplayName || userEmail?.split('@')[0] || (userIsGuest ? 'Guest' : 'Adventurer');

      lastPresenceSignatureRef.current = presenceSignature;
      initializePresence(userId, characterData, sessionData, accountName, userIsGuest || false, friendId);
      subscribeToOnlineUsers();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, currentUserPresence, initializePresence, subscribeToOnlineUsers]);

  // Initialize social store for friends and requests (idempotent in the store)
  useEffect(() => {
    if (isOpen && userUid) {
      initializeSocial(userUid);
    }
  }, [isOpen, userUid, initializeSocial]);

  // Update presence when character changes (guarded by signature)
  useEffect(() => {
    if (!isOpen || !characterId || !currentUserPresence) return;
    if (lastPresenceSignatureRef.current === presenceSignature) return;
    lastPresenceSignatureRef.current = presenceSignature;

    // CRITICAL: Check for default "Character Name" and use account name as fallback
    const isDefaultName = characterName === 'Character Name' || characterName === 'Character Name (Room Name)';
    const resolvedCharacterName = (!isDefaultName && characterName) ? characterName : (userDisplayName || 'Adventurer');

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
    const userId = userUid || `dev_user_${characterId}`;
    const accountName = userDisplayName || userEmail?.split('@')[0] || (userIsGuest ? 'Guest' : 'Adventurer');

    console.log('🔄 Updating presence with new character data:', characterData.name);
    // Re-initialize presence with updated character data
    initializePresence(userId, characterData, sessionData, accountName, userIsGuest || false, friendId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, presenceSignature, currentUserPresence, initializePresence]);

  // NOTE: presence/social teardown intentionally lives with the app-level
  // GlobalSocketManager and auth lifecycle. This window unmounts whenever it
  // is closed (GlobalChatWindowWrapper returns null), so cleaning up presence
  // here would mark the user offline just for closing the chat window.

  useEffect(() => {
    const handleResize = () => {
      const mobile = isMobile();
      if (mobile && !isMobileRef.current) {
        setIsUsersPaneHidden(true);
      }
      isMobileRef.current = mobile;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDragMove = useCallback((clientX) => {
    const container = document.querySelector('.global-chat-container');
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const newPosition = ((clientX - rect.left) / rect.width) * 100;
    const clamped = Math.max(20, Math.min(50, newPosition));
    if (!splitRafRef.current) {
      splitRafRef.current = requestAnimationFrame(() => {
        splitRafRef.current = null;
        setSplitPosition(clamped);
      });
    }
  }, []);

  const handleMouseDown = (e) => {
    if (isMobile()) return;
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleDragMove(e.clientX);
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

  const handleTouchStart = (e) => {
    if (isMobile()) return;
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !e.touches[0]) return;
    handleDragMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      return () => {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
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
    setIsUsersPaneHidden(prev => !prev);
  };

  const closeMobileDrawer = () => {
    if (isMobile()) {
      setIsUsersPaneHidden(true);
    }
  };

  if (!isOpen) return null;

  console.log('🎭 GlobalChatWindow rendering, isOpen:', isOpen);

  return (
    <>
      <MythrillWindow
        isOpen={isOpen}
        onClose={onClose}
        defaultSize={{ width: 1200, height: 800 }}
        className="global-chat-window"
        customHeader={
          <div className="spellbook-tab-container">
            {/* COMMUNITY tab — portal dropdown switches left pane view */}
            <HeaderDropdown label="COMMUNITY" icon="fa-users">
              <button
                className={`header-dropdown-option ${communityView === 'online' ? 'active' : ''}`}
                onClick={() => setCommunityView('online')}
              >
                <i className="fas fa-globe"></i>
                <span>Global</span>
              </button>
              <button
                className={`header-dropdown-option ${communityView === 'friends' ? 'active' : ''}`}
                onClick={() => setCommunityView('friends')}
              >
                <i className="fas fa-user-friends"></i>
                <span>Friend List</span>
              </button>
              <button
                className={`header-dropdown-option ${communityView === 'ignored' ? 'active' : ''}`}
                onClick={() => setCommunityView('ignored')}
              >
                <i className="fas fa-user-slash"></i>
                <span>Ignored</span>
              </button>
              <button
                className={`header-dropdown-option ${communityView === 'party' ? 'active' : ''}`}
                onClick={() => setCommunityView('party')}
              >
                <i className="fas fa-users"></i>
                <span>Party</span>
              </button>
            </HeaderDropdown>

            {/* CHAT tab — portal dropdown switches right pane chat view */}
            <HeaderDropdown label="CHAT" icon="fa-comment-dots">
              <button
                className={`header-dropdown-option ${chatActiveTab === 'global' ? 'active' : ''}`}
                onClick={() => setChatActiveTab('global')}
              >
                <i className="fas fa-globe"></i>
                <span>Global</span>
              </button>
              <button
                className={`header-dropdown-option ${chatActiveTab === 'party' ? 'active' : ''}`}
                onClick={() => setChatActiveTab('party')}
              >
                <i className="fas fa-users"></i>
                <span>Party</span>
              </button>
              <button
                className={`header-dropdown-option ${chatActiveTab === 'loot' ? 'active' : ''}`}
                onClick={() => setChatActiveTab('loot')}
              >
                <i className="fas fa-coins"></i>
                <span>Loot</span>
              </button>
              <button
                className={`header-dropdown-option ${chatActiveTab === 'combat' ? 'active' : ''}`}
                onClick={() => setChatActiveTab('combat')}
              >
                <i className="fas fa-swords"></i>
                <span>Combat</span>
              </button>
            </HeaderDropdown>
          </div>
        }
      >
        <div
          className={`global-chat-container ${isDragging ? 'dragging' : ''} ${isUsersPaneHidden ? 'users-pane-hidden' : ''}`}
          onMouseMove={isDragging ? handleMouseMove : undefined}
          onTouchMove={isDragging ? handleTouchMove : undefined}
        >
          {!isUsersPaneHidden && isMobile() && (
            <div className="mobile-drawer-backdrop" onClick={closeMobileDrawer} />
          )}
          <div
            className="users-pane"
            style={{ width: isMobile() ? undefined : `${splitPosition}%` }}
          >
            <OnlineUsersList
              activeTab={communityView}
              setActiveTab={setCommunityView}
              onUserClick={handleUserClick}
              onWhisper={handleWhisper}
              onInviteToRoom={handleInviteToRoom}
            />
          </div>

          {/* Resizable Divider */}
          <div
            className="split-divider"
            onMouseDown={!isUsersPaneHidden ? handleMouseDown : undefined}
            onTouchStart={!isUsersPaneHidden ? handleTouchStart : undefined}
            style={{ cursor: isUsersPaneHidden || isMobile() ? 'default' : 'col-resize' }}
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
      </MythrillWindow>
    </>
  );
};

export default GlobalChatWindow;
