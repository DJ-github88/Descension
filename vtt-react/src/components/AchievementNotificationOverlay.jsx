import React, { useState, useEffect } from 'react';

/**
 * Achievement Notification Overlay
 * Uses the same styling as player notifications for consistency
 */
const AchievementNotificationOverlay = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const handleAchievementNotification = (event) => {
      console.log('🏆 Achievement overlay received notification:', event.detail);
      const { skill, quest, characterName, characterClass, timestamp } = event.detail;

      // Add notification to the list
      const newNotification = {
        id: `achievement_${timestamp}`,
        skill,
        quest,
        characterName,
        characterClass,
        timestamp,
        visible: false
      };

      setNotifications(prev => [...prev, newNotification]);

      // Show notification with animation
      setTimeout(() => {
        setNotifications(prev =>
          prev.map(notif =>
            notif.id === newNotification.id
              ? { ...notif, visible: true }
              : notif
          )
        );
      }, 10);

      // Hide notification after display time
      setTimeout(() => {
        setNotifications(prev =>
          prev.map(notif =>
            notif.id === newNotification.id
              ? { ...notif, visible: false }
              : notif
          )
        );

        // Remove from array after fade out
        setTimeout(() => {
          setNotifications(prev =>
            prev.filter(notif => notif.id !== newNotification.id)
          );
        }, 400);
      }, 4500);
    };

    // Listen for achievement events
    document.addEventListener('showAchievementNotification', handleAchievementNotification);

    return () => {
      document.removeEventListener('showAchievementNotification', handleAchievementNotification);
    };
  }, []);

  return (
    <>
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          className={`player-notification achievement ${notification.visible ? 'show' : ''} ${!notification.visible ? 'fade-out' : ''}`}
          style={{
            top: `calc(20% + ${index * 80}px)`, // Stack notifications vertically
            right: '20px'
          }}
        >
          <div className="player-notification-content">
            <div className="player-info" style={{ marginLeft: '0' }}>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#4facfe', marginBottom: '8px', textShadow: '0 0 8px rgba(79, 172, 254, 0.5)' }}>
                Achievement Earned!
              </div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#00f2fe', marginBottom: '8px' }}>
                {notification.quest.name}({notification.skill.name})
              </div>
              <div style={{
                fontSize: '13px',
                color: '#e0e7ff',
                fontWeight: '500',
                marginBottom: '8px',
                lineHeight: '1.4',
                opacity: 0.95
              }}>
                {notification.quest.description}
              </div>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#00f2fe' }}>
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
