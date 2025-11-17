import React, { useState, useEffect } from 'react';
import { Guardian } from '@types/index';
import { apiClient } from '@services/api';

interface GuardianManagementProps {
  childId: string;
  onError?: (error: string) => void;
}

export const GuardianManagement: React.FC<GuardianManagementProps> = ({ childId, onError }) => {
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGuardians();
  }, [childId]);

  const fetchGuardians = async () => {
    setLoading(true);
    setError('');
    const response = await apiClient.getGuardians(childId);
    if (response.success && response.data) {
      setGuardians(response.data);
    } else {
      const errorMsg = response.error || 'Failed to load guardians';
      setError(errorMsg);
      onError?.(errorMsg);
    }
    setLoading(false);
  };

  const handleRemoveGuardian = async (guardianId: string) => {
    if (window.confirm('Are you sure you want to remove this guardian?')) {
      const response = await apiClient.removeGuardian(guardianId);
      if (response.success) {
        setGuardians(guardians.filter(g => g.id !== guardianId));
      } else {
        const errorMsg = response.error || 'Failed to remove guardian';
        setError(errorMsg);
        onError?.(errorMsg);
      }
    }
  };

  return (
    <div className="card">
      <h2 id="guardian-management-heading" className="card-title">Guardian Management</h2>

      {error && (
        <div className="alert alert--error" role="alert">
          {error}
        </div>
      )}

      {loading && <div className="loading" aria-busy="true">Loading guardians...</div>}

      {!loading && guardians.length === 0 && (
        <p className="text-muted">No guardians assigned yet.</p>
      )}

      {!loading && guardians.length > 0 && (
        <div className="guardian-list">
          <div className="table-responsive">
            <table className="table" aria-labelledby="guardian-management-heading">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Permission Level</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {guardians.map(guardian => (
                  <tr key={guardian.id}>
                    <td>{guardian.name}</td>
                    <td>
                      <code className="address-display">{guardian.address.substring(0, 10)}...</code>
                    </td>
                    <td>
                      <span className={`badge badge--${guardian.permissionLevel}`}>
                        {guardian.permissionLevel}
                      </span>
                    </td>
                    <td>{guardian.email || '-'}</td>
                    <td>
                      <button
                        onClick={() => handleRemoveGuardian(guardian.id)}
                        className="btn btn--small btn--danger"
                        aria-label={`Remove ${guardian.name}`}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
