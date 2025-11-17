import React, { useState, useEffect } from 'react';
import { ActivityEntry } from '@types/index';
import { apiClient } from '@services/api';

interface ActivityLogProps {
  childId?: string;
  maxItems?: number;
  onError?: (error: string) => void;
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ childId, maxItems = 10, onError }) => {
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchActivityLog();
  }, [childId]);

  const fetchActivityLog = async () => {
    setLoading(true);
    setError('');
    const response = await apiClient.getActivityLog(childId);
    if (response.success && response.data) {
      setActivities(response.data.slice(0, maxItems));
    } else {
      const errorMsg = response.error || 'Failed to load activity log';
      setError(errorMsg);
      onError?.(errorMsg);
    }
    setLoading(false);
  };

  const getActivityIcon = (type: string): string => {
    switch (type) {
      case 'child_created':
        return '👶';
      case 'guardian_added':
        return '👤';
      case 'guardian_removed':
        return '✖️';
      case 'credential_updated':
        return '🔐';
      case 'entity_blocked':
        return '🚫';
      case 'entity_unblocked':
        return '✅';
      default:
        return '📝';
    }
  };

  const getActivityTypeLabel = (type: string): string => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  return (
    <div className="card">
      <h2 id="activity-log-heading" className="card-title">Activity Log</h2>

      {error && (
        <div className="alert alert--error" role="alert">
          {error}
        </div>
      )}

      {loading && <div className="loading" aria-busy="true">Loading activities...</div>}

      {!loading && activities.length === 0 && (
        <p className="text-muted">No activities yet.</p>
      )}

      {!loading && activities.length > 0 && (
        <div className="activity-list">
          <ul className="timeline" aria-labelledby="activity-log-heading">
            {activities.map(activity => (
              <li key={activity.id} className="timeline-item">
                <div className="timeline-marker">
                  <span aria-hidden="true">{getActivityIcon(activity.type)}</span>
                </div>
                <div className="timeline-content">
                  <div className="activity-header">
                    <span className="activity-type">
                      {getActivityTypeLabel(activity.type)}
                    </span>
                    <time
                      dateTime={new Date(activity.timestamp).toISOString()}
                      className="activity-time"
                    >
                      {new Date(activity.timestamp).toLocaleString()}
                    </time>
                  </div>
                  <p className="activity-description">{activity.description}</p>
                  {activity.actor && (
                    <p className="activity-actor">
                      <small>By: {activity.actor}</small>
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
