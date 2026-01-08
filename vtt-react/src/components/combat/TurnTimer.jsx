import React, { useState, useEffect, useRef, useCallback } from 'react';
import useCombatStore from '../../store/combatStore';
import '../../styles/turn-timer.css';

const TurnTimer = ({ tokenId, compact = false }) => {
    const { isInCombat, getTimerInfo } = useCombatStore();
    const [displayTime, setDisplayTime] = useState({ current: 0, total: 0 });
    const intervalRef = useRef(null);
    const animationFrameRef = useRef(null);

    // Optimized update function with reduced frequency
    const updateTimer = useCallback(() => {
        if (!isInCombat || !tokenId) {
            setDisplayTime({ current: 0, total: 0 });
            return;
        }

        const timerInfo = getTimerInfo(tokenId);
        setDisplayTime({
            current: timerInfo.currentTime,
            total: timerInfo.totalTime + timerInfo.currentTime,
            isActive: timerInfo.isActive
        });
    }, [isInCombat, tokenId, getTimerInfo]);

    useEffect(() => {
        if (!isInCombat || !tokenId) {
            setDisplayTime({ current: 0, total: 0 });
            return;
        }

        // Update immediately
        updateTimer();

        // Use very infrequent updates to prevent performance issues
        // Only update every 1000ms (1fps) instead of 500ms (2fps)
        const timerInfo = getTimerInfo(tokenId);
        const updateInterval = timerInfo.isActive ? 1000 : 3000; // 1fps for active, 0.33fps for inactive

        intervalRef.current = setInterval(updateTimer, updateInterval);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
        };
    }, [isInCombat, tokenId, updateTimer]);

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
