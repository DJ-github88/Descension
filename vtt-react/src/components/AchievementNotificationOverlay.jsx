import React, { useState, useEffect, useRef } from 'react';

const DISPLAY_DURATION = 4500;
const FADE_DURATION = 400;
const SHOW_DELAY = 10;

/**
 * Achievement Notification Overlay
 * Uses the same styling as player notifications for consistency
 */
const AchievementNotificationOverlay = () => {
  const [queue, setQueue] = useState([]);
  const [currentNotification, setCurrentNotification] = useState(null);
  const timersRef = useRef([]);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  useEffect(() => {
    const handleAchievementNotification = (event) => {
      console.log('🏆 Achievement overlay received notification:', event.detail);
      const { skill, quest, characterName, characterClass, timestamp } = event.detail;

      const newNotification = {
        id: `achievement_${timestamp}`,
        skill,
        quest,
        characterName,
        characterClass,
        timestamp,
        visible: false
      };

      setQueue(prev => [...prev, newNotification]);
    };

    // Listen for achievement events
    document.addEventListener('showAchievementNotification', handleAchievementNotification);

    return () => {
      document.removeEventListener('showAchievementNotification', handleAchievementNotification);
      clearTimers();
    };
  }, []);

  // Start the next notification once the current one finishes
  useEffect(() => {
    if (!currentNotification && queue.length > 0) {
      const [next, ...rest] = queue;
      setQueue(rest);
      setCurrentNotification({ ...next, visible: false });
    }
  }, [queue, currentNotification]);

  // Drive the show/hide lifecycle for the active notification
  useEffect(() => {
    if (!currentNotification) return;

    clearTimers();

    const showTimer = setTimeout(() => {
      setCurrentNotification(prev => prev ? { ...prev, visible: true } : null);
    }, SHOW_DELAY);

    const hideTimer = setTimeout(() => {
      setCurrentNotification(prev => prev ? { ...prev, visible: false } : null);
    }, DISPLAY_DURATION);

    const cleanupTimer = setTimeout(() => {
      setCurrentNotification(null);
    }, DISPLAY_DURATION + FADE_DURATION);

    timersRef.current = [showTimer, hideTimer, cleanupTimer];

    return clearTimers;
  }, [currentNotification?.id]);

  const activeNotifications = currentNotification ? [currentNotification] : [];

  return (
    <>
      {activeNotifications.map((notification) => (
        <div
          key={notification.id}
          className={`player-notification achievement ${notification.visible ? 'show' : ''} ${!notification.visible ? 'fade-out' : ''}`}
          style={{
            top: '20%',
            right: '20px'
          }}
        >
          <div className="player-notification-content">
            <div className="player-info" style={{ marginLeft: '0' }}>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#8B4513', marginBottom: '8px', textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)' }}>
                Achievement Earned!
              </div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#6B4423', marginBottom: '8px', textShadow: '0 1px 2px rgba(255, 255, 255, 0.6)' }}>
                {notification.quest.name}({notification.skill.name})
              </div>
              <div style={{
                fontSize: '13px',
                color: '#2d1810',
                fontWeight: '500',
                marginBottom: '8px',
                lineHeight: '1.4',
                opacity: 0.9
              }}>
                {notification.quest.description}
              </div>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#8B4513', textShadow: '0 1px 2px rgba(255, 255, 255, 0.6)' }}>
                +10 Achievement Points
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default AchievementNotificationOverlay;
