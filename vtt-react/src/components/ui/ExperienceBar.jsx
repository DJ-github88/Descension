import React from 'react';
import { getXPProgress, formatXP, getXPSegments } from '../../utils/experienceUtils';
import './ExperienceBar.css';

/**
 * ExperienceBar Component
 * Displays character XP progress with continuous fill bar and tick mark indicators
 * Matches Pathfinder parchment theme from ActionBar
 */
const ExperienceBar = ({ currentXP = 0, className = '' }) => {
    const progress = getXPProgress(currentXP);

    const {
        currentLevel,
        xpIntoLevel,
        xpNeededForLevel,
        percentage,
        isMaxLevel
    } = progress;

    // Generate 9 tick marks (at 10%, 20%, 30%, ... 90%)
    const tickMarks = [10, 20, 30, 40, 50, 60, 70, 80, 90];

    return (
        <div className={`experience-bar-container ${className}`}>
            {/* Continuous Progress Bar with Tick Marks */}
            <div className="experience-bar">
                {/* Fill overlay */}
                <div
                    className="experience-fill"
                    style={{ width: `${isMaxLevel ? 100 : percentage}%` }}
                >
                    <div className="fill-glow"></div>
                </div>

                {/* Tick mark indicators */}
                {tickMarks.map((tickPercent) => (
                    <div
                        key={tickPercent}
                        className="experience-tick"
                        style={{ left: `${tickPercent}%` }}
                    />
                ))}
                
                {/* Centered XP Text */}
                <div className="experience-text">
                    {isMaxLevel ? (
                        <span className="max-level-text">MAX LEVEL</span>
                    ) : (
                        <>
                            <span className="xp-current">{formatXP(xpIntoLevel)}</span>
                            <span className="xp-separator"> / </span>
                            <span className="xp-needed">{formatXP(xpNeededForLevel)}</span>
                            <span className="xp-label"> XP</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExperienceBar;

