/**
 * Skill Rank Upgrade Component
 * 
 * Displays a skill with its current rank and allows upgrading/downgrading
 * using skill points. Shows color-coded quality like WoW items.
 */

import React from 'react';
import { SKILL_RANKS } from '../../../constants/skillDefinitions';
import { 
    getUpgradeCost, 
    getDowngradeRefund, 
    getNextRank, 
    getPreviousRank,
    canUpgradeSkill 
} from '../../../constants/skillPointSystem';
import './SkillRankUpgrade.css';

const SkillRankUpgrade = ({ 
    skill, 
    currentRank = 'UNTRAINED', 
    onUpgrade, 
    onDowngrade, 
    availablePoints,
    isGranted = false 
}) => {
    const rankData = SKILL_RANKS[currentRank];
    const nextRank = getNextRank(currentRank);
    const prevRank = getPreviousRank(currentRank);
    const upgradeCost = getUpgradeCost(currentRank);
    const downgradeRefund = getDowngradeRefund(currentRank);
    const canUpgrade = nextRank && canUpgradeSkill(currentRank, availablePoints);
    const canDowngrade = prevRank && !isGranted;

    return (
        <div className="skill-rank-upgrade">
            <div className="skill-rank-header">
                <img src={skill.icon} alt={skill.name} className="skill-rank-icon" />
                <div className="skill-rank-info">
                    <div className="skill-rank-name-row">
                        <h4 className="skill-rank-name">{skill.name}</h4>
                        {isGranted && <span className="granted-badge-small">Granted</span>}
                    </div>
                    <p className="skill-rank-description">{skill.description}</p>
                    <div className="skill-rank-current" style={{ color: rankData.color }}>
                        <i className="fas fa-star"></i> {rankData.name}
                        {rankData.statBonus > 0 && <span className="rank-bonus"> (+{rankData.statBonus} bonus)</span>}
                    </div>
                </div>
            </div>

            <div className="skill-rank-controls">
                {/* Downgrade Button */}
                <button
                    className="rank-control-btn downgrade-btn"
                    onClick={onDowngrade}
                    disabled={!canDowngrade}
                    title={canDowngrade ? `Downgrade to ${SKILL_RANKS[prevRank]?.name} (refund ${downgradeRefund} points)` : 'Cannot downgrade'}
                >
                    <i className="fas fa-minus"></i>
                </button>

                {/* Rank Progress Bar */}
                <div className="rank-progress-container">
                    <div className="rank-progress-bar">
                        {Object.keys(SKILL_RANKS).map((rank, index) => {
                            const isActive = Object.keys(SKILL_RANKS).indexOf(currentRank) >= index;
                            const rankColor = SKILL_RANKS[rank].color;
                            
                            return (
                                <div
                                    key={rank}
                                    className={`rank-pip ${isActive ? 'active' : ''}`}
                                    style={{ 
                                        backgroundColor: isActive ? rankColor : 'rgba(139, 115, 85, 0.3)',
                                        boxShadow: isActive ? `0 0 8px ${rankColor}` : 'none'
                                    }}
                                    title={SKILL_RANKS[rank].name}
                                />
                            );
                        })}
                    </div>
                    <div className="rank-cost-info">
                        {nextRank && (
                            <span className="upgrade-cost">
                                Next: {SKILL_RANKS[nextRank].name} ({upgradeCost} pts)
                            </span>
                        )}
                        {!nextRank && (
                            <span className="max-rank">
                                <i className="fas fa-crown"></i> Maximum Rank
                            </span>
                        )}
                    </div>
                </div>

                {/* Upgrade Button */}
                <button
                    className="rank-control-btn upgrade-btn"
                    onClick={onUpgrade}
                    disabled={!canUpgrade}
                    title={canUpgrade ? `Upgrade to ${SKILL_RANKS[nextRank]?.name} (cost ${upgradeCost} points)` : nextRank ? 'Not enough points' : 'Maximum rank reached'}
                >
                    <i className="fas fa-plus"></i>
                </button>
            </div>
        </div>
    );
};

export default SkillRankUpgrade;

