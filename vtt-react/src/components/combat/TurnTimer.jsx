import React, { useState, useEffect } from 'react';
import useCombatStore from '../../store/combatStore';
import '../../styles/turn-timer.css';

const TurnTimer = ({ tokenId, compact = false }) => {
    const { isInCombat, getTimerInfo } = useCombatStore();
    const [displayTime, setDisplayTime] = useState({ current: 0, total: 0 });

    useEffect(() => {
        if (!isInCombat) {
            setDisplayTime({ current: 0, total: 0 });
            return;
        }

        const updateTimer = () => {
            const timerInfo = getTimerInfo(tokenId);
            setDisplayTime({
                current: timerInfo.currentTime,
                total: timerInfo.totalTime + timerInfo.currentTime,
                isActive: timerInfo.isActive
            });
        };

        // Update immediately
        updateTimer();

        // Update every 100ms for smooth display
        const interval = setInterval(updateTimer, 100);

        return () => clearInterval(interval);
    }, [isInCombat, tokenId, getTimerInfo]);

    // Don't render if not in combat
    if (!isInCombat) return null;

    const formatTime = (milliseconds) => {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        if (minutes > 0) {
            return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        }
        return `${remainingSeconds}s`;
    };

    const getTotalTime = () => {
        return displayTime.total;
    };

    const getCurrentTime = () => {
        return displayTime.current;
    };

    const getTimerClass = () => {
        const totalSeconds = getTotalTime() / 1000;
        
        if (displayTime.isActive) {
            return 'turn-timer active';
        } else if (totalSeconds > 120) { // 2 minutes
            return 'turn-timer slow';
        } else if (totalSeconds > 60) { // 1 minute
            return 'turn-timer moderate';
        } else {
            return 'turn-timer fast';
        }
    };

    if (compact) {
        return (
            <div className="turn-timer-compact">
                <div className="timer-compact-text">
                    {formatTime(getTotalTime())}
                </div>
            </div>
        );
    }

    return (
        <div className={getTimerClass()}>
            <div className="timer-display">
                <div className="timer-icon">
                    <img src="/icons/spell_holy_borrowedtime.jpg" alt="Timer" />
                </div>
                <div className="timer-text">
                    <div className="timer-total">
                        {formatTime(getTotalTime())}
                    </div>
                    {displayTime.isActive && (
                        <div className="timer-current">
                            +{formatTime(getCurrentTime())}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TurnTimer;
