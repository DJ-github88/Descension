import React, { useState, useEffect } from 'react';
import useSocialStore from '../../store/socialStore';
import usePartyStore from '../../store/partyStore';
import useChatStore from '../../store/chatStore';
import { CLASS_RESOURCE_TYPES } from '../../data/classResources';
import { getBackgroundNames } from '../../data/backgroundData';
import SocialContextMenu from './SocialContextMenu';
import '../../styles/social-window.css';

const WhoList = () => {
  const {
    whoResults,
    whoQuery,
    setWhoQuery,
    searchWho,
    addFriend,
    addIgnored
  } = useSocialStore();

  // Party store for invites
  const { addPartyMember, isInParty, createParty } = usePartyStore();

  // Chat store for whispers
  const { addSocialNotification, setIsOpen: setChatOpen, setActiveTab: setChatTab } = useChatStore();

  // State for context menu
  const [contextMenu, setContextMenu] = useState(null);
  // State for selected player
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (whoQuery.trim()) {
      searchWho(whoQuery);
    }
  };

  // Handle player selection
  const handleSelectPlayer = (id) => {
    setSelectedPlayer(id);
  };

  // Handle right-click on player
  const handleContextMenu = (e, player) => {
    e.preventDefault();
    e.stopPropagation();

    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      player: {
        ...player,
        isFriend: false,
        isIgnored: false,
        status: 'online' // Who results are always online
      }
    });
  };

  // Close context menu
  const closeContextMenu = () => {
    setContextMenu(null);
  };

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenu && !event.target.closest('.social-context-menu')) {
        closeContextMenu();
      }
    };

    if (contextMenu) {
      // Use a slight delay to avoid conflicts with the right-click event
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 10);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenu]);

  // Handle whisper
  const handleWhisper = (player) => {
    // Add a whisper notification to chat
    addSocialNotification({
      type: 'whisper_start',
      target: player.name,
      content: `Whisper conversation started with ${player.name}`,
      sender: { name: 'System', class: 'system', level: 0 }
    });

    // Open chat window and switch to social tab
    setChatOpen(true);
    setChatTab('social');

    // Close context menu
    closeContextMenu();


  };

  // Handle invite
  const handleInvite = (player) => {
    if (!isInParty) {
      // Create party automatically and add the player
      createParty(`${player.name}'s Party`);

      // Add notification about party creation
      addSocialNotification({
        type: 'party_created',
        content: `Party created and ${player.name} has been invited`,
        sender: { name: 'System', class: 'system', level: 0 }
      });
    }

    // Add the player directly to the party
    const newMember = {
      id: `who-${player.id}`,
      name: player.name,
      role: 'member',
      status: 'online',
      character: {
        level: player.level,
        race: 'Unknown', // Who results don't include race
        class: player.class,
        health: { current: 100, max: 100 },
        mana: { current: 50, max: 50 },
        actionPoints: { current: 3, max: 3 }
      }
    };

    addPartyMember(newMember);

    // Add notification to chat
    addSocialNotification({
      type: 'party_member_added',
      target: player.name,
      content: `${player.name} has been added to your party`,
      sender: { name: 'System', class: 'system', level: 0 }
    });

    // Open chat to show the message
    setChatOpen(true);
    setChatTab('social');

    // Close context menu
    closeContextMenu();


  };

  // Handle add friend
  const handleAddFriend = (player) => {
    addFriend({
      name: player.name,
      level: player.level,
      class: player.class,
      status: 'online',
      location: player.location
    });
  };

  // Handle add ignore
  const handleAddIgnore = (player) => {
    addIgnored({
      name: player.name,
      level: player.level,
      class: player.class
    });
  };

  // Render a player entry
  const renderPlayerEntry = (player) => (
    <div
      key={player.id}
      className={`friend-entry ${selectedPlayer === player.id ? 'selected' : ''}`}
      onClick={() => handleSelectPlayer(player.id)}
      onContextMenu={(e) => handleContextMenu(e, player)}
      onDoubleClick={() => handleWhisper(player)}
    >
      <div className="friend-status online"></div>
      <div className="friend-name">{player.name}</div>
      <div className="friend-info">
        <span className="friend-level">{player.level}</span>
        <span className={`friend-class ${player.class}`}>{player.class}</span>
        {player.background && (
          <span className="friend-background">{player.background}</span>
        )}
        {player.location && (
          <div className="friend-location">{player.location}</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="friends-list-container">
      {/* Search Form */}
      <form className="who-search" onSubmit={handleSearch}>
        <input
          type="text"
          value={whoQuery}
          onChange={(e) => setWhoQuery(e.target.value)}
          placeholder="Search for players..."
          className="who-input"
        />
        <button
          type="submit"
          className="social-button"
        >
          Search
        </button>
      </form>

      {/* Who Results */}
      <div className="who-results">
        {whoResults.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <i className="fas fa-search"></i>
            </div>
            <div className="empty-state-text">No results</div>
            <div className="empty-state-subtext">
              Search for players to see them here
            </div>
          </div>
        ) : (
          <>
            <div className="friends-section-header">Search Results</div>
            {whoResults.map(renderPlayerEntry)}
          </>
        )}
      </div>

      {/* Content Spacer - pushes action buttons to bottom */}
      <div style={{ flex: 1 }}></div>

      {/* Action Buttons */}
      <div className="social-actions">
        <button
          className="social-button"
          onClick={() => selectedPlayer && handleWhisper(whoResults.find(p => p.id === selectedPlayer))}
          disabled={!selectedPlayer}
        >
          Whisper
        </button>
        <button
          className="social-button"
          onClick={() => selectedPlayer && handleInvite(whoResults.find(p => p.id === selectedPlayer))}
          disabled={!selectedPlayer}
        >
          Invite
        </button>
        <button
          className="social-button"
          onClick={() => selectedPlayer && handleAddFriend(whoResults.find(p => p.id === selectedPlayer))}
          disabled={!selectedPlayer}
        >
          Add Friend
        </button>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <SocialContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          player={contextMenu.player}
          onClose={closeContextMenu}
          onWhisper={handleWhisper}
          onInvite={handleInvite}
          onAddFriend={handleAddFriend}
          onRemoveFriend={() => {}}
          onAddIgnore={handleAddIgnore}
          onRemoveIgnore={() => {}}
        />
      )}
    </div>
  );
};

export default WhoList;
