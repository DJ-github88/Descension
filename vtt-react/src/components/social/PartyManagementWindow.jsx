import React, { useState, useMemo } from 'react';
import WowWindow from '../windows/WowWindow';
import usePartyStore, { PARTY_STATUS } from '../../store/partyStore';
import useCharacterStore from '../../store/characterStore';
import useSocialStore from '../../store/socialStore';
import usePresenceStore from '../../store/presenceStore';
import UserCard from './UserCard';
import '../../styles/party-hud.css';
import useAuthStore from '../../store/authStore';

const PartyManagementWindow = ({ isOpen, onClose }) => {
    const [invitePlayerName, setInvitePlayerName] = useState('');
    const [showInviteForm, setShowInviteForm] = useState(false);
    const [inviteTab, setInviteTab] = useState('friends'); // 'friends' or 'manual'

    // Store data
    const {
        isInParty,
        currentParty,
        partyMembers,
        pendingPartyInvites: receivedInvites,
        sentPartyInvites: pendingInvites,
        createParty,
        leaveParty,
        disbandParty,
        sendPartyInvite,
        acceptPartyInvite,
        declinePartyInvite,
        kickPartyMember,
        isPartyLeader,
        isUserLeader,
        addPartyMember,
        leaderId
    } = usePartyStore();

    const { name: currentPlayerName } = useCharacterStore();
    const { friends, friendPresence } = useSocialStore();
    const onlineUsersMap = usePresenceStore((state) => state.onlineUsers);
    const onlineUsers = useMemo(() => Array.from(onlineUsersMap.values()), [onlineUsersMap]);

    // Handle creating a new party
    const handleCreateParty = async () => {
        try {
            await createParty(`${currentPlayerName}'s Party`);
        } catch (error) {
            console.error('❌ Failed to create party:', error);
        }
    };

    // Handle sending party invite
    const handleSendInvite = (playerName) => {
        if (playerName && playerName.trim()) {
            sendPartyInvite(playerName.trim());
            setInvitePlayerName('');
        }
    };

    // Get online friends for inviting
    const onlineFriends = (friends || []).filter(friend => {
        const presence = friendPresence?.[friend.id] || onlineUsers.find(user => user.uid === friend.id);
        return presence && presence.status !== 'offline';
    }).map(friend => {
        return friendPresence?.[friend.id] || onlineUsers.find(user => user.uid === friend.id);
    }).filter(Boolean);

    // Handle accepting invite
    const handleAcceptInvite = (inviteId) => {
        acceptPartyInvite(inviteId);
    };

    // Handle declining invite
    const handleDeclineInvite = (inviteId) => {
        declinePartyInvite(inviteId);
    };

    // Handle removing party member
    const handleRemoveMember = (memberId) => {
        if (isPartyLeader() && memberId !== 'current-player') {
            kickPartyMember(memberId);
        }
    };

    // Handle leaving party
    const handleLeaveParty = () => {
        if (isPartyLeader()) {
            disbandParty();
        } else {
            leaveParty();
        }
    };

    const renderPartyMember = (member) => {
        const isLeader = member.id === leaderId || member.isGM;
        const isCurrentPlayer = member.id === 'current-player' || member.userId === useAuthStore.getState().user?.uid;

        const userCardData = {
            ...member,
            characterName: member.name,
            level: member.character?.level || member.level,
            class: member.character?.class || member.class,
            race: member.character?.race || member.race,
            status: member.status || 'online'
        };

        return (
            <UserCard
                key={member.id}
                user={userCardData}
                nameFormat="party"
                isCurrentUser={isCurrentPlayer}
                isLeader={isLeader}
                showLeaderCrown={true}
                showYouBadge={true}
                className="party-member-card-enhanced"
                additionalContent={
                    isPartyLeader() && member.id !== 'current-player' && (
                        <button
                            className="remove-member-button"
                            onClick={() => handleRemoveMember(member.id)}
                            title="Remove Member"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    )
                }
            />
        );
    };

    const renderFriendInviteItem = (friend) => {
        const isAlreadyInParty = partyMembers.some(m => m.name === friend.characterName || m.name === friend.name);

        const friendData = {
            ...friend,
            name: friend.displayName || friend.accountName || friend.name,
            characterName: friend.characterName || friend.name,
            level: friend.characterLevel || friend.level,
            class: friend.characterClass || friend.class,
            status: friend.status || 'online'
        };

        return (
            <UserCard
                key={friend.uid || friend.id}
                user={friendData}
                className="friend-invite-card"
                additionalContent={
                    <button
                        className="friend-invite-btn"
                        onClick={() => handleSendInvite(friendData.characterName)}
                        disabled={isAlreadyInParty}
                    >
                        <i className="fas fa-plus"></i>
                        {isAlreadyInParty ? 'In Party' : 'Invite'}
                    </button>
                }
            />
        );
    };


    return (
        <WowWindow
            title="Party Management"
            isOpen={isOpen}
            onClose={onClose}
            defaultPosition={{ x: 300, y: 200 }}
            defaultSize={{ width: 500, height: 600 }}
            centered={true}
        >
            <div className="party-management-window">
                {!isInParty ? (
                    // Not in party - show create party option
                    <div className="no-party-section">
                        <h3>You are not in a party</h3>
                        <p>Create a party to invite other players and adventure together!</p>
                        <button className="party-action-button create" onClick={handleCreateParty}>
                            <i className="fas fa-users"></i> Create Party
                        </button>


                        <p style={{ fontSize: '12px', color: '#666', textAlign: 'center', marginTop: '10px' }}>
                            💡 Tip: Once you create a party, the Party HUD will appear on the left side of your screen!
                        </p>
                    </div>
                ) : (
                    // In party - show party management
                    <div className="party-section">
                        <div className="party-header">
                            <h3>{currentParty?.name}</h3>
                            <div className="party-info">
                                <span>Members: {partyMembers.length}/6</span>
                                {isPartyLeader() && <span className="leader-badge">Leader</span>}
                            </div>
                        </div>

                        {/* Party Members List */}
                        <div className="party-members-list">
                            <h4>Party Members</h4>
                            {partyMembers.map(member => renderPartyMember(member))}
                        </div>

                        {/* Party Actions */}
                        <div className="party-actions">
                            {isPartyLeader() && (
                                <>
                                    {!showInviteForm ? (
                                        <button
                                            className="party-action-button invite"
                                            onClick={() => setShowInviteForm(true)}
                                        >
                                            <i className="fas fa-user-plus"></i> Invite Player
                                        </button>
                                    ) : (
                                        <div className="invite-form">
                                            <div className="invite-tabs">
                                                <button
                                                    className={`invite-tab ${inviteTab === 'friends' ? 'active' : ''}`}
                                                    onClick={() => setInviteTab('friends')}
                                                >
                                                    <i className="fas fa-user-friends"></i> Friends
                                                </button>
                                                <button
                                                    className={`invite-tab ${inviteTab === 'manual' ? 'active' : ''}`}
                                                    onClick={() => setInviteTab('manual')}
                                                >
                                                    <i className="fas fa-keyboard"></i> Manual
                                                </button>
                                            </div>

                                            {inviteTab === 'friends' ? (
                                                <div className="friends-invite-list">
                                                    {onlineFriends.length > 0 ? (
                                                        onlineFriends.map(friend => renderFriendInviteItem(friend))
                                                    ) : (
                                                        <div className="no-friends-message">
                                                            <i className="fas fa-users-slash"></i>
                                                            <p>No online friends to invite</p>
                                                            <small>Add friends in the Social window to invite them to parties</small>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="manual-invite-section">
                                                    <input
                                                        type="text"
                                                        placeholder="Enter player name..."
                                                        value={invitePlayerName}
                                                        onChange={(e) => setInvitePlayerName(e.target.value)}
                                                        onKeyPress={(e) => e.key === 'Enter' && handleSendInvite(invitePlayerName)}
                                                    />
                                                    <div className="invite-form-actions">
                                                        <button onClick={() => handleSendInvite(invitePlayerName)}>Send Invite</button>
                                                        <button onClick={() => setShowInviteForm(false)}>Cancel</button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                </>
                            )}

                            <button
                                className="party-action-button leave"
                                onClick={handleLeaveParty}
                            >
                                <i className="fas fa-sign-out-alt"></i>
                                {isPartyLeader() ? 'Disband Party' : 'Leave Party'}
                            </button>
                        </div>

                        {/* Pending Invites */}
                        {pendingInvites.length > 0 && (
                            <div className="pending-invites">
                                <h4>Pending Invites</h4>
                                {pendingInvites.map(invite => (
                                    <div key={invite.id} className="invite-item">
                                        <span>Invited: {invite.targetPlayer}</span>
                                        <span className="invite-status">{invite.status}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Received Invites */}
                {receivedInvites.length > 0 && (
                    <div className="received-invites">
                        <h4>Party Invitations</h4>
                        {receivedInvites.map(invite => (
                            <div key={invite.id} className="invite-item">
                                <div className="invite-info">
                                    <span>From: {invite.fromPlayer}</span>
                                    <span>Party: {invite.partyName}</span>
                                </div>
                                <div className="invite-actions">
                                    <button
                                        className="accept-button"
                                        onClick={() => handleAcceptInvite(invite.id)}
                                    >
                                        Accept
                                    </button>
                                    <button
                                        className="decline-button"
                                        onClick={() => handleDeclineInvite(invite.id)}
                                    >
                                        Decline
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </WowWindow>
    );
};

export default PartyManagementWindow;
