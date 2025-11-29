/**
 * Achievement Notification System
 * Shows beautiful achievement notifications on the ObjectSystem canvas
 */

export const showAchievementNotification = (skill, quest, characterName, characterClass) => {
  if (typeof window === 'undefined') return;

  // Create achievement notification event for the ObjectSystem
  const achievementEvent = new CustomEvent('showAchievementNotification', {
    detail: {
      skill,
      quest,
      characterName,
      characterClass,
      timestamp: Date.now()
    }
  });

  // Dispatch the event to be picked up by AchievementNotificationOverlay
  document.dispatchEvent(achievementEvent);

  console.log('🏆 Achievement notification dispatched:', {
    skillName: skill.name,
    questName: quest.name,
    characterName,
    characterClass
  });
};
