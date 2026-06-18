import React from 'react';
import Notification from './Notification';
import useNotificationStore from '../../store/notificationStore';
import './Notification.css';

const NotificationContainer = () => {
    const notifications = useNotificationStore(state => state.notifications);
    const dismissNotification = useNotificationStore(state => state.dismissNotification);

    return (
        <div className="notification-container" aria-live="polite" aria-atomic="true">
            {notifications.map(notification => (
                <Notification
                    key={notification.id}
                    {...notification}
                    onClose={dismissNotification}
                />
            ))}
        </div>
    );
};

export default NotificationContainer;
