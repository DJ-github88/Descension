import React, { useState } from 'react';
import useAuthStore from '../../store/authStore';
import useSocialStore from '../../store/socialStore';
import { formatTimeAgo } from '../../utils/timeUtils';
import './styles/AccountSocialManager.css';

const AccountSocialManager = () => {
    const { userData } = useAuthStore();
    const {
        friends,
        friendPresence,
        pendingRequests,
        sendFriendRequest,
        acceptFriendRequest,
        declineFriendRequest,
        removeFriend
    } = useSocialStore();

    const [friendIdInput, setFriendIdInput] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState(null);
    const [searchSuccess, setSearchSuccess] = useState(null);

    const receivedRequests = (pendingRequests || []).filter(r => r.type === 'received' && r.status === 'pending');
    const sentRequests = (pendingRequests || []).filter(r => r.type === 'sent' && r.status === 'pending');

    const handleAddFriend = async (e) => {
        e.preventDefault();
        setSearchError(null);
        setSearchSuccess(null);

        const cleanId = friendIdInput.trim().replace(/^#/, '');
        if (!cleanId) {
            setSearchError('Please enter a Friend ID');
            return;
        }

        setIsSearching(true);
        try {
            const result = await sendFriendRequest(cleanId);
            if (result.success) {
                setSearchSuccess(`Friend request sent to #${cleanId}!`);
                setFriendIdInput('');
            } else {
                setSearchError(result.error || 'Failed to send request');
            }
        } catch (err) {
            setSearchError('An unexpected error occurred');
            console.error(err);
        } finally {
            setIsSearching(false);
        }
    };

    const copyFriendId = () => {
        const fullId = userData?.friendId;
        if (fullId) {
            navigator.clipboard.writeText(fullId);
        }
    };

    return (
        <div className="account-social-manager">
            <div className="social-header-section">
                <div className="my-id-card">
                    <div className="card-label">Your Friend ID</div>
                    <div className="id-display" onClick={copyFriendId} title="Click to copy">
                        <span className="hash">#</span>
                        <span className="id-text">{userData?.friendId || '-------'}</span>
                        <i className="far fa-copy copy-icon"></i>
                    </div>
                    <p className="id-hint">Share this ID with others so they can add you.</p>
                </div>

                <div className="add-friend-section">
                    <h3>Add a Friend</h3>
                    <form className="add-friend-form" onSubmit={handleAddFriend}>
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Enter Friend ID (e.g. DragonWalker1234)"
                                value={friendIdInput}
                                onChange={(e) => setFriendIdInput(e.target.value)}
                                disabled={isSearching}
                            />
                            <button type="submit" disabled={isSearching || !friendIdInput.trim()}>
                                {isSearching ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-user-plus"></i>}
                                <span>Send Request</span>
                            </button>
                        </div>
                        {searchError && <div className="social-error">{searchError}</div>}
                        {searchSuccess && <div className="social-success">{searchSuccess}</div>}
                    </form>
                </div>
            </div>

            <div className="social-content-grid">
                {/* Friends List */}
                <div className="social-column friends-column">
                    <div className="column-header">
                        <h3>Friends ({friends?.length || 0})</h3>
                    </div>
                    <div className="friends-list">
                        {friends && friends.length > 0 ? (
                            friends.map(friend => {
                                const presence = friendPresence[friend.id];
                                // Include 'idle' as an online status
                                const isOnline = ['online', 'away', 'busy', 'idle'].includes(presence?.status);
                                const lastSeen = presence?.lastSeen || friend.addedAt;

                                return (
                                    <div key={friend.id} className={`friend-item ${!isOnline ? 'offline' : ''}`}>
                                        <div className="friend-avatar">
                                            {friend.photoURL ? (
                                                <img src={friend.photoURL} alt="" />
                                            ) : (
                                                <i className="fas fa-user"></i>
                                            )}
                                            <div className={`presence-indicator ${isOnline ? 'online' : 'offline'}`} />
                                        </div>
                                        <div className="friend-info">
                                            <div className="friend-name-row">
                                                <div className="friend-name">{friend.name}</div>
                                                <div className="status-badge">
                                                    {isOnline ? (
                                                        <span className="online-text">Online</span>
                                                    ) : (
                                                        <span className="offline-text">
                                                            Last seen {formatTimeAgo(lastSeen)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="friend-id">#{friend.friendId}</div>
                                        </div>
                                        <button
                                            className="remove-friend-btn"
                                            onClick={() => removeFriend(friend.id)}
                                            title="Remove Friend"
                                        >
                                            <i className="fas fa-user-minus"></i>
                                        </button>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="empty-state">
                                <i className="fas fa-users"></i>
                                <p>No adventurers found yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Requests Column */}
                <div className="social-column requests-column">
                    <div className="column-header">
                        <h3>Pending Requests</h3>
                    </div>

                    <div className="requests-container">
                        {receivedRequests.length > 0 && (
                            <div className="request-group">
                                <h4>Received ({receivedRequests.length})</h4>
                                {receivedRequests.map(req => (
                                    <div key={req.id} className="request-card received">
                                        <div className="req-user">
                                            <span className="req-name">{req.senderName}</span>
                                            <span className="req-id">#{req.senderFriendId}</span>
                                        </div>
                                        <div className="req-actions">
                                            <button className="accept-btn" onClick={() => acceptFriendRequest(req.id)}>
                                                Accept
                                            </button>
                                            <button className="decline-btn" onClick={() => declineFriendRequest(req.id)}>
                                                Decline
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {sentRequests.length > 0 && (
                            <div className="request-group">
                                <h4>Sent ({sentRequests.length})</h4>
                                {sentRequests.map(req => (
                                    <div key={req.id} className="request-card sent">
                                        <div className="req-user">
                                            <span className="req-name">{req.receiverName}</span>
                                            <span className="req-id">#{req.receiverFriendId}</span>
                                        </div>
                                        <div className="req-status">Waiting...</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {receivedRequests.length === 0 && sentRequests.length === 0 && (
                            <div className="empty-state">
                                <i className="far fa-paper-plane"></i>
                                <p>No pending requests.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountSocialManager;
