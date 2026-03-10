import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import usePartyStore from '../../store/partyStore';
import usePresenceStore from '../../store/presenceStore';
import useGameStore from '../../store/gameStore';
import useAuthStore from '../../store/authStore';
import '../../styles/unified-context-menu.css';

const PartyMemberContextMenu = ({ 
  x, 
  y, 
  member, 
  currentUserId, 
  leaderId, 
  onClose,
  onWhisper 
}) => {
  const menuRef = useRef(null);
  
  const { leaveParty, partyMembers } = usePartyStore();
  const { sendSessionInvitation, requestToJoinSession } = usePresenceStore();
  const { isInMultiplayer, multiplayerSocket, currentRoom } = useGameStore();
  const { user } = useAuthStore();
  
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
  
  const handleMenuItemClick = (action) => {
    action();
    onClose();
  };
  
  const isSelf = member.id === currentUserId || 
                 member.userId === currentUserId || 
                 member.id === 'current-player' ||
                 member.userId === user?.uid;
  
  const isLeader = member.id === leaderId || 
                   member.userId === leaderId ||
                   member.socketId === leaderId;
  
  const currentUserIsLeader = leaderId === currentUserId || 
                              leaderId === user?.uid ||
                              leaderId === 'current-player';
  
  const leaderInSession = isLeader && isInMultiplayer && currentRoom;
  
  const currentUserInSession = isInMultiplayer && currentRoom;
  
  const menuItems = [];
  
  if (isSelf) {
    if (partyMembers.length > 1) {
      menuItems.push({
        label: 'Leave Party',
        icon: 'fas fa-sign-out-alt',
        action: () => {
          console.log('🚪 Leaving party');
          leaveParty();
        },
        className: 'danger'
      });
    }
  } else {
    if (leaderInSession && !isSelf) {
      menuItems.push({
        label: 'Join Session',
        icon: 'fas fa-door-open',
        action: () => {
          console.log('🎯 Requesting to join session:', currentRoom.id);
          requestToJoinSession(
            leaderId,
            currentRoom.id,
            currentUserId || user?.uid,
            'Player'
          );
        },
        className: 'primary'
      });
    }
    
    if (currentUserIsLeader && currentUserInSession && !isLeader) {
      menuItems.push({
        label: 'Invite to Session',
        icon: 'fas fa-user-plus',
        action: () => {
          console.log('📨 Inviting member to session:', member.id);
          sendSessionInvitation(member.userId || member.id, currentRoom.id);
        },
        className: 'primary'
      });
    }
    
    if (onWhisper) {
      menuItems.push({
        label: 'Whisper',
        icon: 'fas fa-comment',
        action: () => {
          console.log('💬 Opening whisper for:', member.name);
          onWhisper(member);
        },
        className: 'default'
      });
    }
  }
  
  if (menuItems.length === 0) {
    return null;
  }
  
  return ReactDOM.createPortal(
    <div
      ref={menuRef}
      className="unified-context-menu small"
      style={{
        left: x,
        top: y
      }}
    >
      {menuItems.map((item, index) => (
        <div
          key={index}
          className={`context-menu-item ${item.className || ''}`}
          onClick={() => handleMenuItemClick(item.action)}
        >
          {item.icon && <i className={item.icon} style={{ marginRight: '8px' }} />}
          {item.label}
        </div>
      ))}
    </div>,
    document.body
  );
};

export default PartyMemberContextMenu;
