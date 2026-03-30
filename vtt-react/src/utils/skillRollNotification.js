/**
 * Skill Roll Notification System
 * Shows beautiful fade-out notifications for skill rolls instead of ugly browser alerts
 */

export const showSkillRollNotification = (roll, result, skillName) => {
  if (typeof window === 'undefined') return;

  const notification = document.createElement('div');
  notification.className = `skill-roll-notification ${result.type}`;
  
  // Determine dice icon based on roll value
  let diceIcon = 'fa-dice-d20';
  if (roll === 20) diceIcon = 'fa-dice-d20 critical-success';
  else if (roll === 1) diceIcon = 'fa-dice-d20 critical-failure';
  
  notification.innerHTML = `
    <div class="skill-roll-content">
      <div class="roll-header">
        <i class="fas ${diceIcon}"></i>
        <span class="roll-value">${roll}</span>
      </div>
      <div class="roll-info">
        <span class="skill-name">${skillName}</span>
        <span class="roll-result">${result.result}</span>
      </div>
    </div>
  `;
  
  document.body.appendChild(notification);

  // Add animation class after a small delay to trigger the animation
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);

  // Remove notification after 4 seconds
  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 500);
  }, 4000);
};

