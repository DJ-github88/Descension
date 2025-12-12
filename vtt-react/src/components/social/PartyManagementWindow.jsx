import React, { useState } from 'react';
import WowWindow from '../windows/WowWindow';
import usePartyStore, { PARTY_STATUS, PARTY_ROLES } from '../../store/partyStore';
import useCharacterStore from '../../store/characterStore';
import useSocialStore from '../../store/socialStore';
import usePresenceStore from '../../store/presenceStore';
import '../../styles/party-hud.css';

const PartyManagementWindow = ({ isOpen, onClose }) => {
    const [invitePlayerName, setInvitePlayerName] = useState('');
    const [showInviteForm, setShowInviteForm] = useState(false);
    const [inviteTab, setInviteTab] = useState('friends'); // 'friends' or 'manual'

    // Store data
    const {
        isInParty,
        currentParty,
        partyMembers,
        pendingInvites,
        receivedInvites,
        createParty,
        leaveParty,
        disbandParty,
        sendPartyInvite,
        acceptPartyInvite,
        declinePartyInvite,
        removePartyMember,
        isPartyLeader,
        addPartyMember
    } = usePartyStore();

    const { name: currentPlayerName } = useCharacterStore();
    const { friends } = useSocialStore();
    const onlineUsers = usePresenceStore((state) => state.getOnlineUsersArray());

    // Handle creating a new party
    const handleCreateParty = () => {
        createParty(`${currentPlayerName}'s Party`);
    };

    // Handle sending party invite
    const handleSendInvite = (playerName) => {
        if (playerName && playerName.trim()) {
            sendPartyInvite(playerName.trim());
            setInvitePlayerName('');
        }
    };

    // Get online friends for inviting
    const onlineFriends = friends.filter(friendId => {
        const onlineUser = onlineUsers.find(user => user.uid === friendId);
        return onlineUser && onlineUser.status !== 'offline';
    }).map(friendId => {
        return onlineUsers.find(user => user.uid === friendId);
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
            removePartyMember(memberId);
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

    // Add test party members for demonstration
    const handleAddTestMember = () => {
        const testMembers = [
            {
                id: 'test-member-1',
                name: 'Thordak',
                character: {
                    class: 'Dreadnaught',
                    race: 'Dwarf',
                    level: 12,
                    health: { current: 85, max: 100 },
                    mana: { current: 20, max: 30 },
                    actionPoints: { current: 2, max: 3 }
                }
            },
            {
                id: 'test-member-2',
                name: 'Elaria',
                character: {
                    class: 'Chronarch',
                    race: 'Elf',
                    level: 10,
                    health: { current: 45, max: 60 },
                    mana: { current: 80, max: 100 },
                    actionPoints: { current: 3, max: 3 }
                }
            },
            {
                id: 'test-member-3',
                name: 'Grimjaw',
                character: {
                    class: 'Bladedancer',
                    race: 'Halfling',
                    level: 11,
                    health: { current: 55, max: 70 },
                    mana: { current: 40, max: 50 },
                    actionPoints: { current: 1, max: 3 }
                }
            },
            {
                id: 'test-member-4',
                name: 'Yad',
                character: {
                    class: 'Martyr',
                    race: 'Human',
                    level: 9,
                    health: { current: 65, max: 80 },
                    mana: { current: 60, max: 75 },
                    actionPoints: { current: 3, max: 3 }
                }
            }
        ];

        // Add a random test member that's not already in the party
        const availableMembers = testMembers.filter(testMember =>
            !partyMembers.some(partyMember => partyMember.id === testMember.id)
        );

        if (availableMembers.length > 0) {
            const randomMember = availableMembers[Math.floor(Math.random() * availableMembers.length)];
            addPartyMember(randomMember);
        } else {

        }
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
                        
                        {/* Test button for adding demo members */}
                        <button className="party-action-button test" onClick={handleAddTestMember}>
                            <i className="fas fa-plus"></i> Add Test Member (Demo)
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
                            {partyMembers.map(member => (
                                <div key={member.id} className="party-member-item">
                                    <div className="member-info">
                                        <div className="member-name">
                                            {member.name}
                                            {member.role === PARTY_ROLES.LEADER && (
                                                <span className="role-badge leader">Leader</span>
                                            )}
                                        </div>
                                        <div className="member-details">
                                            {member.character?.race} {member.character?.class}
                                            {member.character?.level && ` (Level ${member.character.level})`}
                                        </div>
                                        <div className="member-status">
                                            Status: <span className={`status ${member.status}`}>{member.status}</span>
                                        </div>
                                    </div>
                                    {isPartyLeader() && member.id !== 'current-player' && (
                                        <button 
                                            className="remove-member-button"
                                            onClick={() => handleRemoveMember(member.id)}
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                    )}
                                </div>
                            ))}
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
                                                        onlineFriends.map(friend => (
                                                            <div key={friend.uid} className="friend-invite-item">
                                                                <div className="friend-info">
                                                                    <div className="friend-name">{friend.displayName}</div>
                                                                    <div className="friend-character">
                                                                        {friend.characterName} (Level {friend.characterLevel} {friend.characterClass})
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    className="friend-invite-btn"
                                                                    onClick={() => handleSendInvite(friend.displayName)}
                                                                    disabled={partyMembers.some(m => m.name === friend.displayName)}
                                                                >
                                                                    <i className="fas fa-plus"></i>
                                                                    {partyMembers.some(m => m.name === friend.displayName) ? 'In Party' : 'Invite'}
                                                                </button>
                                                            </div>
                                                        ))
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
                                    
                                    {/* Test button for adding demo members */}
                                    <button className="party-action-button test" onClick={handleAddTestMember}>
                                        <i className="fas fa-plus"></i> Add Test Member
                                    </button>
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
