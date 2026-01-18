import React, { useState, useEffect, memo } from 'react';
import '../../styles/player-selector.css';

/**
 * PlayerSelector - A reusable component for selecting party members
 * 
 * Shows toggleable circular icons for each party member. Used by GM to select
 * which players should be affected by XP awards, rests, and other actions.
 * 
 * @param {Array} partyMembers - Array of party member objects from partyStore
 * @param {Function} onSelectionChange - Callback with array of selected player IDs
 * @param {boolean} excludeGM - If true, excludes the GM from the selection (default: false)
 * @param {string} label - Label to display above the selector (optional)
 */
const PlayerSelector = memo(function PlayerSelector({
    partyMembers = [],
    onSelectionChange,
    excludeGM = false,
    label = "Select Players"
}) {
    // Filter members based on excludeGM setting
    const selectableMembers = excludeGM
        ? partyMembers.filter(member => !member.isGM)
        : partyMembers;

    // Initialize with all selectable members selected
    const [selectedIds, setSelectedIds] = useState(() =>
        selectableMembers.map(member => member.id)
    );

    // Update selection when party members change
    useEffect(() => {
        const validIds = selectableMembers.map(m => m.id);
        const filteredSelection = selectedIds.filter(id => validIds.includes(id));

        // If new members joined, add them to selection by default
        const newMemberIds = validIds.filter(id => !selectedIds.includes(id));
        if (newMemberIds.length > 0 || filteredSelection.length !== selectedIds.length) {
            setSelectedIds([...filteredSelection, ...newMemberIds]);
        }
    }, [partyMembers]);

    // Notify parent of selection changes
    useEffect(() => {
        if (onSelectionChange) {
            onSelectionChange(selectedIds);
        }
    }, [selectedIds, onSelectionChange]);

    // Toggle a single player's selection
    const togglePlayer = (playerId) => {
        setSelectedIds(prev => {
            if (prev.includes(playerId)) {
                return prev.filter(id => id !== playerId);
            } else {
                return [...prev, playerId];
            }
        });
    };

    // Select all players
    const selectAll = () => {
        setSelectedIds(selectableMembers.map(member => member.id));
    };

    // Deselect all players
    const deselectAll = () => {
        setSelectedIds([]);
    };

    // Get initials from name
    const getInitials = (name) => {
        if (!name) return '?';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    // Get a color based on player ID for variety
    const getPlayerColor = (playerId) => {
        const colors = [
            '#7a3b2e', // Rust brown
            '#2c5530', // Forest green
            '#3498db', // Blue
            '#9b59b6', // Purple
            '#d4af37', // Gold
            '#c74545', // Red
        ];
        const hash = playerId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[hash % colors.length];
    };

    if (selectableMembers.length === 0) {
        return (
            <div className="player-selector-empty">
                <i className="fas fa-users-slash"></i>
                <span>No players in party</span>
            </div>
        );
    }

    return (
        <div className="player-selector">
            <div className="player-selector-header">
                <span className="player-selector-label">{label}</span>
                <div className="player-selector-actions">
                    <button
                        className="player-selector-action-btn"
                        onClick={selectAll}
                        title="Select All"
                    >
                        <i className="fas fa-check-double"></i>
                    </button>
                    <button
                        className="player-selector-action-btn"
                        onClick={deselectAll}
                        title="Deselect All"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>
            </div>

            <div className="player-selector-grid">
                {selectableMembers.map(member => {
                    const isSelected = selectedIds.includes(member.id);
                    const playerColor = getPlayerColor(member.id);
                    const characterName = member.character?.name || member.name || 'Unknown';

                    return (
                        <div
                            key={member.id}
                            className={`player-selector-item ${isSelected ? 'selected' : 'deselected'}`}
                            onClick={() => togglePlayer(member.id)}
                            title={characterName}
                        >
                            <div
                                className="player-selector-avatar"
                                style={{
                                    backgroundColor: isSelected ? playerColor : 'transparent',
                                    borderColor: playerColor
                                }}
                            >
                                {member.character?.portrait ? (
                                    <img
                                        src={member.character.portrait}
                                        alt={characterName}
                                        className="player-avatar-image"
                                    />
                                ) : (
                                    <span className="player-avatar-initials">
                                        {getInitials(characterName)}
                                    </span>
                                )}
                                <div className="player-selector-check">
                                    <i className="fas fa-check"></i>
                                </div>
                            </div>
                            <span className="player-selector-name">
                                {characterName.length > 10
                                    ? characterName.substring(0, 8) + '...'
                                    : characterName}
                            </span>
                        </div>
                    );
                })}
            </div>

            <div className="player-selector-count">
                {selectedIds.length} of {selectableMembers.length} selected
            </div>
        </div>
    );
});

export default PlayerSelector;
