import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import '../../styles/unified-context-menu.css';

const SocialContextMenu = ({ x, y, player, onClose, onWhisper, onInvite, onAddFriend, onRemoveFriend, onAddIgnore, onRemoveIgnore }) => {
  const menuRef = useRef(null);
  
  // Handle clicks outside the menu to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  // Handle menu item click
  const handleMenuItemClick = (action) => {
    action(player);
    onClose();
  };
  
  // Determine which menu items to show based on player type
  const isFriend = player?.isFriend;
  const isIgnored = player?.isIgnored;
  
  return ReactDOM.createPortal(
    <div
      ref={menuRef}
      className="unified-context-menu small"
      style={{
        left: x,
        top: y
      }}
    >
      {/* Whisper option - always available for online players */}
      {player?.status === 'online' && (
        <div 
          className="context-menu-item"
          onClick={() => handleMenuItemClick(onWhisper)}
        >
          Whisper
        </div>
      )}
      
      {/* Invite option - always available for online players */}
      {player?.status === 'online' && (
        <div 
          className="context-menu-item"
          onClick={() => handleMenuItemClick(onInvite)}
        >
          Invite to Group
        </div>
      )}
      
      {/* Separator if we have both sections */}
      {player?.status === 'online' && (isFriend !== undefined || isIgnored !== undefined) && (
        <div className="context-menu-separator" />
      )}
      
      {/* Friend management options */}
      {isFriend !== undefined && (
        <>
          {!isFriend ? (
            <div 
              className="context-menu-item"
              onClick={() => handleMenuItemClick(onAddFriend)}
            >
              Add Friend
            </div>
          ) : (
            <div 
              className="context-menu-item"
              onClick={() => handleMenuItemClick(onRemoveFriend)}
            >
              Remove Friend
            </div>
          )}
        </>
      )}
      
      {/* Ignore management options */}
      {isIgnored !== undefined && (
        <>
          {!isIgnored ? (
            <div 
              className="context-menu-item"
              onClick={() => handleMenuItemClick(onAddIgnore)}
            >
              Add to Ignore List
            </div>
          ) : (
            <div 
              className="context-menu-item"
              onClick={() => handleMenuItemClick(onRemoveIgnore)}
            >
              Remove from Ignore List
            </div>
          )}
        </>
      )}
    </div>,
    document.body
  );
};

export default SocialContextMenu;
