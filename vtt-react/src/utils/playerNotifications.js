// Player join/leave notification system
// Uses the same pattern as loot notifications for consistency

export const showPlayerJoinNotification = (playerName, roomName) => {
  if (typeof window === 'undefined') return;

  const notification = document.createElement('div');
  notification.className = 'player-notification join';
  notification.innerHTML = `
    <div class="player-notification-content">
      <div class="player-icon">
        <i class="fas fa-user-plus"></i>
      </div>
      <div class="player-info">
        <span class="player-name">${playerName}</span>
        <span class="action-text">joined the party</span>
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
    }, 300);
  }, 4000);
};

export const showPlayerLeaveNotification = (playerName, roomName) => {
  if (typeof window === 'undefined') return;

  const notification = document.createElement('div');
  notification.className = 'player-notification leave';
  notification.innerHTML = `
    <div class="player-notification-content">
      <div class="player-icon">
        <i class="fas fa-user-minus"></i>
      </div>
      <div class="player-info">
        <span class="player-name">${playerName}</span>
        <span class="action-text">left the party</span>
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
    }, 300);
  }, 4000);
};

export const showRoomCreatedNotification = (roomName) => {
  if (typeof window === 'undefined') return;

  const notification = document.createElement('div');
  notification.className = 'player-notification room-created';
  notification.innerHTML = `
    <div class="player-notification-content">
      <div class="player-icon">
        <i class="fas fa-home"></i>
      </div>
      <div class="player-info">
        <span class="room-name">${roomName}</span>
        <span class="action-text">room created</span>
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
    }, 300);
  }, 4000);
};
