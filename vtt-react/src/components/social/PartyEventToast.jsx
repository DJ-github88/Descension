/**
 * Party Event Toast
 * 
 * Small auto-dismissing toast for party events:
 * - Party created
 * - Member joined / left
 * - Invite accepted / declined
 */

import React, { useState, useEffect } from 'react';

const ICONS = {
    party_created: { icon: 'fas fa-users', color: '#386641', label: 'created successfully', title: 'Party Created' },
    joined: { icon: 'fas fa-user-plus', color: '#386641', label: 'joined the party', title: 'Member Joined' },
    left: { icon: 'fas fa-sign-out-alt', color: '#8c3b2d', label: 'left the party', title: 'Member Left' },
    accepted: { icon: 'fas fa-check', color: '#386641', label: 'accepted your invite', title: 'Invite Accepted' },
    declined: { icon: 'fas fa-times', color: '#8c3b2d', label: 'declined your invite', title: 'Invite Declined' },
    disbanded: { icon: 'fas fa-shield-alt', color: '#8a6d45', label: 'The party was disbanded', title: 'Party Disbanded' },
    you_joined: { icon: 'fas fa-door-open', color: '#386641', label: 'You joined the party', title: 'Party Joined' },
    you_declined: { icon: 'fas fa-times', color: '#8c3b2d', label: 'Declined invitation', title: 'Invite Declined' },
    invite_failed: { icon: 'fas fa-exclamation-circle', color: '#8c3b2d', label: 'Invite failed', title: 'Invitation Issue' },
    invitation_sent: { icon: 'fas fa-scroll', color: '#8a6d45', label: 'Invitation sent', title: 'Invitation Sent' },
};

const PartyEventToast = ({ event, onDismiss }) => {
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => {
            setIsLeaving(true);
            setTimeout(() => onDismiss(event.id), 300);
        }, 5000);
        return () => clearTimeout(t);
    }, [event.id, onDismiss]);

    const meta = ICONS[event.type] || ICONS.party_created;

    const renderContent = () => {
        if (event.message) {
            // Format quotes around party/room names with tasteful emphasis in Crimson Text
            const quoteMatch = event.message.match(/^(.*?)"([^"]+)"(.*)$/);
            if (quoteMatch) {
                return (
                    <span>
                        {quoteMatch[1]}<strong>&ldquo;{quoteMatch[2]}&rdquo;</strong>{quoteMatch[3]}
                    </span>
                );
            }
            return <span>{event.message}</span>;
        }

        if (event.type === 'disbanded') {
            return <span>The party was disbanded.</span>;
        }
        if (event.type === 'you_joined') {
            return event.partyName ? (
                <span>You joined <strong>&ldquo;{event.partyName}&rdquo;</strong></span>
            ) : (
                <span>You joined the party!</span>
            );
        }
        if (event.type === 'you_declined') {
            return <span>You declined the party invitation.</span>;
        }
        return (
            <span>
                <strong>{event.memberName}</strong> {meta.label}
            </span>
        );
    };

    return (
        <div className={`party-event-toast party-event-${event.type || 'notice'} ${isLeaving ? 'leaving' : 'entering'}`}>
            <div className="party-event-seal" style={{ '--seal-color': meta.color }}>
                <i className={meta.icon} aria-hidden="true"></i>
            </div>
            <div className="party-event-content">
                <div className="party-event-header">{meta.title || 'Fellowship Notice'}</div>
                <div className="party-event-text">
                    {renderContent()}
                </div>
            </div>
            <button
                className="party-event-close"
                onClick={() => { setIsLeaving(true); setTimeout(() => onDismiss(event.id), 300); }}
                title="Dismiss notification"
                aria-label="Dismiss notification"
            >
                <i className="fas fa-times"></i>
            </button>
        </div>
    );
};

export default PartyEventToast;
