import React, { useState, useEffect } from 'react';
import { Child } from '@types/index';
import { apiClient } from '@services/api';
import { ChildIdentityOverview } from './ChildIdentityOverview';
import { CreateChildForm } from './CreateChildForm';
import { AddGuardianForm } from './AddGuardianForm';
import { GuardianManagement } from './GuardianManagement';
import { ActivityLog } from './ActivityLog';
import { NotificationFeed } from './NotificationFeed';

export const GuardianDashboard: React.FC = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    setLoading(true);
    setError('');
    const response = await apiClient.getChildren();
    if (response.success && response.data) {
      setChildren(response.data);
      if (response.data.length > 0 && !selectedChildId) {
        setSelectedChildId(response.data[0].id);
      }
    } else {
      setError(response.error || 'Failed to load children');
    }
    setLoading(false);
  };

  const handleChildCreated = (childId: string) => {
    fetchChildren();
    setSelectedChildId(childId);
  };

  const selectedChild = children.find(c => c.id === selectedChildId);

  return (
    <div className="guardian-dashboard">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Guardian Dashboard</h1>
        <p className="dashboard-subtitle">Manage child profiles, guardians, and activities</p>
      </header>

      <NotificationFeed />

      <main className="dashboard-main">
        {error && (
          <div className="alert alert--error" role="alert">
            {error}
          </div>
        )}

        <div className="dashboard-grid">
          {/* Left Column: Create Child & Forms */}
          <div className="sidebar">
            <CreateChildForm onSuccess={handleChildCreated} onError={setError} />
          </div>

          {/* Right Column: Dashboard Content */}
          <div className="content">
            {loading ? (
              <div className="loading" aria-busy="true">
                Loading dashboard...
              </div>
            ) : children.length === 0 ? (
              <div className="empty-state">
                <h2>No children yet</h2>
                <p>Create your first child profile to get started.</p>
              </div>
            ) : (
              <>
                <div className="child-selector">
                  <label htmlFor="child-select">Select Child:</label>
                  <select
                    id="child-select"
                    value={selectedChildId || ''}
                    onChange={e => setSelectedChildId(e.target.value)}
                    className="form-select"
                  >
                    {children.map(child => (
                      <option key={child.id} value={child.id}>
                        {child.name}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedChild && (
                  <>
                    <ChildIdentityOverview child={selectedChild} />

                    <div className="content-section">
                      <AddGuardianForm
                        childId={selectedChild.id}
                        onSuccess={fetchChildren}
                        onError={setError}
                      />
                    </div>

                    <div className="content-section">
                      <GuardianManagement
                        childId={selectedChild.id}
                        onError={setError}
                      />
                    </div>

                    <div className="content-section">
                      <ActivityLog childId={selectedChild.id} onError={setError} />
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
