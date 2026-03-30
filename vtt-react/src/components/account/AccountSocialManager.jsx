import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import useAuthStore from '../../store/authStore';
import useSocialStore from '../../store/socialStore';
import { formatTimeAgo } from '../../utils/timeUtils';
import ConfirmationDialog from '../item-generation/ConfirmationDialog';
import UserCard from '../social/UserCard';
import './styles/AccountSocialManager.css';

const AccountSocialManager = () => {
    const [friendIdInput, setFriendIdInput] = useState('');
    const [socialError, setSocialError] = useState('');
    const [socialSuccess, setSocialSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [pendingRemoveFriend, setPendingRemoveFriend] = useState(null);

    const {
        friends,
        pendingRequests,
        removeFriend,
        acceptFriendRequest,
        declineFriendRequest,
        sendFriendRequest,
        friendPresence,
        migrateFriends
    } = useSocialStore();

    // Trigger migration on mount
    React.useEffect(() => {
        migrateFriends();
    }, [migrateFriends]);

    const { user, userData } = useAuthStore();

    // Split pending requests into received and sent
    const pendingInvites = (pendingRequests || []).filter(r => r.type === 'received' && r.status === 'pending');
    const sentInvites = (pendingRequests || []).filter(r => r.type === 'sent' && r.status === 'pending');

    const handleAddFriend = async (e) => {
        e.preventDefault();
        setSocialError('');
        setSocialSuccess('');

        const targetFriendId = friendIdInput.trim();
        if (!targetFriendId) {
            setSocialError('Please enter a Friend ID');
            return;
        }

        const cleanFriendId = targetFriendId.startsWith('#') ? targetFriendId.slice(1) : targetFriendId;
        const myFriendId = userData?.friendId || user?.friendId;

        if (cleanFriendId === myFriendId) {
            setSocialError("You cannot add yourself as a friend");
            return;
        }

        setIsLoading(true);
        try {
            const result = await sendFriendRequest(cleanFriendId);
            if (result && !result.success) {
                setSocialError(result.error || 'Failed to send friend request');
            } else {
                setSocialSuccess(`Friend request sent to #${cleanFriendId}`);
                setFriendIdInput('');
            }
        } catch (error) {
            setSocialError(error.message || 'Failed to send friend request');
        } finally {
            setIsLoading(false);
        }
    };

    const copyMyId = () => {
        const myFriendId = userData?.friendId || user?.friendId;
        if (myFriendId) {
            navigator.clipboard.writeText(`#${myFriendId}`);
            setSocialSuccess('Friend ID copied to clipboard!');
            setTimeout(() => setSocialSuccess(''), 3000);
        }
    };

    const renderFriendItem = (friend) => {
        // friend is an object from the friends array: { id, name, friendId, ... }
        const presence = friendPresence?.[friend.id] || { status: 'offline' };

        const friendData = {
            id: friend.id,
            userId: friend.id,
            name: friend.name || presence.accountName || presence.characterName || 'Unknown Friend',
            accountName: friend.name || presence.accountName || 'Unknown',
            characterName: presence.characterName,
            status: presence.status || 'offline',
            lastSeen: presence.lastSeen,
            level: presence.level,
            class: presence.class,
            race: presence.race,
            subrace: presence.subrace,
            raceDisplayName: presence.raceDisplayName,
            background: presence.background,
            friendId: friend.friendId,
            location: presence.location,
            isFriend: true
        };

        const sessionDisplay = !friendData.status || friendData.status === 'offline' ? (
            friendData.lastSeen ? (
                <span className="last-seen-text">
                    Last seen {formatTimeAgo(friendData.lastSeen)}
                </span>
            ) : null
        ) : (
            friendData.location ? (
                <span className="location-badge">
                    <i className="fas fa-map-marker-alt"></i> {friendData.location}
                </span>
            ) : null
        );

        return (
            <UserCard
                key={friend.id}
                user={friendData}
                showSessionInfo={true}
                sessionDisplay={sessionDisplay}
                showFriendId={true}
                additionalContent={
                    <button
                        className="remove-friend-btn"
                        onClick={() => setPendingRemoveFriend({ id: friend.id, name: friendData.name })}
                        title="Remove Friend"
                    >
                        <i className="fas fa-user-minus"></i>
                    </button>
                }
            />
        );
    };

    const renderRequestCard = (request, type) => {
        const isReceived = type === 'received';
        const displayId = isReceived ? request.senderFriendId : request.receiverFriendId;
        const displayName = isReceived
            ? (request.senderName || 'Unknown User')
            : (request.receiverName || 'Unknown User');

        const requestUser = {
            id: request.id,
            name: displayName,
            accountName: displayName,
            friendId: displayId,
            status: 'offline'
        };

        return (
            <UserCard
                key={request.id}
                user={requestUser}
                showFriendId={true}
                className="request-card-enhanced"
                additionalContent={
                    <div className="req-actions">
                        {isReceived ? (
                            <>
                                <button className="accept-btn" onClick={() => acceptFriendRequest(request.id)}>
                                    Accept
                                </button>
                                <button className="decline-btn" onClick={() => declineFriendRequest(request.id)}>
                                    Decline
                                </button>
                            </>
                        ) : (
                            <span className="req-status">Pending...</span>
                        )}
                    </div>
                }
            />
        );
    };

    return (
        <div className="account-social-manager">
            <div className="social-header-section">
                <div className="my-id-card" onClick={copyMyId}>
                    <div className="card-label">Your Friend ID</div>
                    <div className="id-display">
                        <span className="hash">#</span>
                        <span className="id-text">{userData?.friendId || user?.friendId || '-------'}</span>
                        <i className="fas fa-copy copy-icon"></i>
                    </div>
                    <p className="id-hint">Click to copy and share with friends</p>
                </div>

                <div className="add-friend-section">
                    <h3>Add Friend</h3>
                    <form className="add-friend-form" onSubmit={handleAddFriend}>
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Enter Friend ID (e.g., #StoneLight6117)"
                                value={friendIdInput}
                                onChange={(e) => setFriendIdInput(e.target.value)}
                            />
                            <button type="submit" disabled={isLoading}>
                                <i className="fas fa-user-plus"></i>
                                {isLoading ? 'Sending...' : 'Send Request'}
                            </button>
                        </div>
                        {socialError && <div className="social-error">{socialError}</div>}
                        {socialSuccess && <div className="social-success">{socialSuccess}</div>}
                    </form>
                </div>
            </div>

            <div className="social-content-grid">
                <div className="social-column friends-column">
                    <div className="column-header">
                        <h3>Friends ({friends?.length || 0})</h3>
                    </div>
                    <div className="friends-list">
                        {friends && friends.length > 0 ? (
                            friends.map(friend => renderFriendItem(friend))
                        ) : (
                            <div className="empty-state">
                                <i className="fas fa-user-group"></i>
                                <p>No friends yet</p>
                                <p>Add friends using their unique ID!</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="social-column requests-column">
                    <div className="column-header">
                        <h3>Pending Requests</h3>
                    </div>
                    <div className="requests-container">
                        {pendingInvites && pendingInvites.length > 0 && (
                            <div className="request-group">
                                <h4>Received ({pendingInvites.length})</h4>
                                {pendingInvites.map(req => renderRequestCard(req, 'received'))}
                            </div>
                        )}

                        {sentInvites && sentInvites.length > 0 && (
                            <div className="request-group">
                                <h4>Sent ({sentInvites.length})</h4>
                                {sentInvites.map(req => renderRequestCard(req, 'sent'))}
                            </div>
                        )}

                        {(!pendingInvites || pendingInvites.length === 0) && (!sentInvites || sentInvites.length === 0) && (
                            <div className="empty-state">
                                <i className="fas fa-paper-plane"></i>
                                <p>No pending requests</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {pendingRemoveFriend && createPortal(
                <ConfirmationDialog
                    message={`Remove "${pendingRemoveFriend.name}" from your friends list?`}
                    onConfirm={() => {
                        removeFriend(pendingRemoveFriend.id);
                        setPendingRemoveFriend(null);
                    }}
                    onCancel={() => setPendingRemoveFriend(null)}
                />,
                document.body
            )}
        </div>
    );
};

export default AccountSocialManager;
