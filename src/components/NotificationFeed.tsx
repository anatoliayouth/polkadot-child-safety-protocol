import React, { useEffect } from 'react';
import { useNotifications } from '@hooks/useNotifications';

export const NotificationFeed: React.FC = () => {
  const { notifications, clearNotification, clearAllNotifications } = useNotifications();

  useEffect(() => {
    // Auto-dismiss notifications after 5 seconds
    const timers = notifications.map(notification => {
      return setTimeout(() => {
        clearNotification(notification.id);
      }, 5000);
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [notifications, clearNotification]);

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div
      className="notification-feed"
      role="region"
      aria-live="polite"
      aria-label="Notifications"
    >
      <div className="notification-feed-header">
        <h2 className="notification-feed-title">Notifications</h2>
        <button
          onClick={clearAllNotifications}
          className="btn btn--small btn--secondary"
          aria-label="Clear all notifications"
        >
          Clear All
        </button>
      </div>

      <ul className="notification-list">
        {notifications.map(notification => (
          <li key={notification.id} className="notification-item">
            <div className="notification-content">
              <p className="notification-message">{notification.message}</p>
              <time
                dateTime={new Date(notification.timestamp).toISOString()}
                className="notification-time"
              >
                {new Date(notification.timestamp).toLocaleTimeString()}
              </time>
            </div>
            <button
              onClick={() => clearNotification(notification.id)}
              className="btn btn--small btn--icon"
              aria-label={`Dismiss notification: ${notification.message}`}
              title="Dismiss"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
