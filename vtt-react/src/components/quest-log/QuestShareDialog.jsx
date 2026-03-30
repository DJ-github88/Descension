import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaScroll, FaCoins, FaStar, FaBoxOpen, FaCheck, FaTimes } from 'react-icons/fa';
import QuestReward from './QuestReward';
import '../../styles/quest-share-dialog.css';

/**
 * QuestShareDialog - RPG-styled dialog shown to players when GM shares a quest
 * Features fantasy parchment aesthetic with acceptance/decline options
 */
const QuestShareDialog = ({
    quest,
    giverInfo,
    onAccept,
    onDecline,
    isVisible = true
}) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (isVisible) {
            // Trigger entrance animation
            setIsAnimating(true);
            const timer = setTimeout(() => setIsAnimating(false), 600);
            return () => clearTimeout(timer);
        }
    }, [isVisible]);

    const handleAccept = () => {
        setIsClosing(true);
        setTimeout(() => {
            onAccept(quest.id);
        }, 300);
    };

    const handleDecline = () => {
        setIsClosing(true);
        setTimeout(() => {
            onDecline(quest.id);
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
        <div className={`quest-share-overlay ${isClosing ? 'closing' : ''}`}>
            <div className={`quest-share-dialog ${isAnimating ? 'animating' : ''} ${isClosing ? 'closing' : ''}`}>
                {/* Decorative scroll top */}
                <div className="quest-share-scroll-top" />

                {/* Quest content */}
                <div className="quest-share-content">
                    {/* Header with quest giver */}
                    <div className="quest-share-header">
                        <div className="quest-share-giver-info">
                            {giverInfo?.name || quest.giver || 'A mysterious figure'} offers you a quest:
                        </div>
                        <h2 className="quest-share-title">
                            <FaScroll className="quest-share-title-icon" />
                            {quest.title}
                        </h2>
                    </div>

                    {/* Quest description */}
                    <div className="quest-share-description">
                        {quest.description}
                    </div>

                    {/* Objectives preview */}
                    {quest.objectives && quest.objectives.length > 0 && (
                        <div className="quest-share-objectives">
                            <h3 className="quest-share-section-title">Objectives</h3>
                            <ul className="quest-share-objective-list">
                                {quest.objectives.filter(obj => !obj.optional).slice(0, 3).map((objective, index) => (
                                    <li key={objective.id || index} className="quest-share-objective-item">
                                        <span className="objective-marker">◆</span>
                                        {objective.description}
                                        {objective.count > 1 && (
                                            <span className="objective-count"> (0/{objective.count})</span>
                                        )}
                                    </li>
                                ))}
                                {quest.objectives.filter(obj => !obj.optional).length > 3 && (
                                    <li className="quest-share-objective-more">
                                        ...and {quest.objectives.filter(obj => !obj.optional).length - 3} more objectives
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}

                    {/* Quest rewards section */}
                    <div className="quest-share-rewards">
                        <h3 className="quest-share-section-title">
                            <FaStar className="reward-star-icon" /> Rewards
                        </h3>
                        <div className="quest-share-rewards-list">
                            {hasExperienceReward && (
                                <div className="quest-share-reward-item experience">
                                    <span className="reward-icon">✧</span>
                                    <span className="reward-text">{quest.rewards.experience} Experience</span>
                                </div>
                            )}

                            {hasCurrencyReward && (
                                <div className="quest-share-reward-item currency">
                                    <FaCoins className="reward-icon gold" />
                                    <span className="reward-text">
                                        {quest.rewards.currency.gold > 0 && `${quest.rewards.currency.gold}g `}
                                        {quest.rewards.currency.silver > 0 && `${quest.rewards.currency.silver}s `}
                                        {quest.rewards.currency.copper > 0 && `${quest.rewards.currency.copper}c`}
                                    </span>
                                </div>
                            )}

                            {hasItemRewards && (
                                <div className="quest-share-reward-items">
                                    <FaBoxOpen className="reward-icon items" />
                                    <div className="reward-items-list">
                                        {quest.rewards.items.slice(0, 3).map((item, index) => (
                                            <span
                                                key={item.id || index}
                                                className={`reward-item-name quality-${item.quality || 'common'}`}
                                            >
                                                {item.name}
                                            </span>
                                        ))}
                                        {quest.rewards.items.length > 3 && (
                                            <span className="reward-items-more">
                                                +{quest.rewards.items.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="quest-share-actions">
                        <button
                            className="quest-share-button accept"
                            onClick={handleAccept}
                        >
                            <FaCheck className="button-icon" />
                            Accept Quest
                        </button>
                        <button
                            className="quest-share-button decline"
                            onClick={handleDecline}
                        >
                            <FaTimes className="button-icon" />
                            Decline
                        </button>
                    </div>
                </div>

                {/* Decorative scroll bottom */}
                <div className="quest-share-scroll-bottom" />
            </div>
        </div>,
        document.body
    );
};

export default QuestShareDialog;
