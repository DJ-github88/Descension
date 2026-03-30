import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { FaGift, FaCoins, FaStar, FaBoxOpen, FaCheck, FaTimes, FaUser } from 'react-icons/fa';
import '../../styles/quest-reward-dialog.css';

/**
 * QuestRewardDeliveryDialog - Shown to GM when a player completes a quest
 * GM can approve reward delivery or deny the completion
 */
const QuestRewardDeliveryDialog = ({
    quest,
    playerName,
    playerId,
    onDeliverRewards,
    onDenyCompletion,
    isVisible = true
}) => {
    const [isClosing, setIsClosing] = useState(false);
    const [isDelivering, setIsDelivering] = useState(false);

    const handleDeliver = () => {
        setIsDelivering(true);
        setIsClosing(true);
        setTimeout(() => {
            onDeliverRewards(quest.id, playerId, quest.rewards);
        }, 400);
    };

    const handleDeny = () => {
        setIsClosing(true);
        setTimeout(() => {
            onDenyCompletion(quest.id, playerId);
        }, 300);
    };

    if (!isVisible || !quest) return null;

    const hasExperienceReward = quest.rewards?.experience > 0;
    const hasCurrencyReward = quest.rewards?.currency &&
        (quest.rewards.currency.gold > 0 ||
            quest.rewards.currency.silver > 0 ||
            quest.rewards.currency.copper > 0);
    const hasItemRewards = quest.rewards?.items?.length > 0;

    return createPortal(
        <div className={`quest-reward-overlay ${isClosing ? 'closing' : ''}`}>
            <div className={`quest-reward-dialog ${isClosing ? 'closing' : ''} ${isDelivering ? 'delivering' : ''}`}>
                {/* Header */}
                <div className="quest-reward-header">
                    <FaGift className="quest-reward-header-icon" />
                    <h2 className="quest-reward-title">Quest Completion Request</h2>
                </div>

                {/* Content */}
                <div className="quest-reward-content">
                    {/* Player info */}
                    <div className="quest-reward-player-info">
                        <FaUser className="player-icon" />
                        <span className="player-name">{playerName || 'A player'}</span>
                        <span className="completion-text">has completed:</span>
                    </div>

                    {/* Quest title */}
                    <div className="quest-reward-quest-name">
                        "{quest.title}"
                    </div>

                    {/* Rewards to deliver */}
                    <div className="quest-reward-delivery-section">
                        <h3 className="quest-reward-section-title">
                            Rewards to Deliver
                        </h3>

                        <div className="quest-reward-list">
                            {hasExperienceReward && (
                                <div className="quest-reward-item experience">
                                    <FaStar className="reward-icon" />
                                    <span className="reward-label">Experience:</span>
                                    <span className="reward-value">{quest.rewards.experience} XP</span>
                                </div>
                            )}

                            {hasCurrencyReward && (
                                <div className="quest-reward-item currency">
                                    <FaCoins className="reward-icon" />
                                    <span className="reward-label">Currency:</span>
                                    <span className="reward-value">
                                        {quest.rewards.currency.gold > 0 && (
                                            <span className="gold">{quest.rewards.currency.gold}g </span>
                                        )}
                                        {quest.rewards.currency.silver > 0 && (
                                            <span className="silver">{quest.rewards.currency.silver}s </span>
                                        )}
                                        {quest.rewards.currency.copper > 0 && (
                                            <span className="copper">{quest.rewards.currency.copper}c</span>
                                        )}
                                    </span>
                                </div>
                            )}

                            {hasItemRewards && (
                                <div className="quest-reward-item items">
                                    <FaBoxOpen className="reward-icon" />
                                    <span className="reward-label">Items:</span>
                                    <div className="reward-items-list">
                                        {quest.rewards.items.map((item, index) => (
                                            <span
                                                key={item.id || index}
                                                className={`reward-item-name quality-${item.quality || 'common'}`}
                                            >
                                                {item.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Confirmation note */}
                    <div className="quest-reward-note">
                        <span className="note-icon">⚠</span>
                        Delivering rewards will add XP, currency, and items directly to {playerName}'s character.
                    </div>
                </div>

                {/* Action buttons */}
                <div className="quest-reward-actions">
                    <button
                        className="quest-reward-button deliver"
                        onClick={handleDeliver}
                        disabled={isDelivering}
                    >
                        <FaCheck className="button-icon" />
                        {isDelivering ? 'Delivering...' : 'Deliver Rewards'}
                    </button>
                    <button
                        className="quest-reward-button deny"
                        onClick={handleDeny}
                        disabled={isDelivering}
                    >
                        <FaTimes className="button-icon" />
                        Deny Completion
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default QuestRewardDeliveryDialog;
