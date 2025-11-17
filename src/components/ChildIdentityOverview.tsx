import React from 'react';
import { Child } from '@types/index';

interface ChildIdentityOverviewProps {
  child: Child;
}

export const ChildIdentityOverview: React.FC<ChildIdentityOverviewProps> = ({ child }) => {
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active':
        return 'status--active';
      case 'pending':
        return 'status--pending';
      case 'revoked':
        return 'status--revoked';
      default:
        return '';
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'pending':
        return 'Pending';
      case 'revoked':
        return 'Revoked';
      default:
        return status;
    }
  };

  return (
    <div className="card">
      <h2 id="child-overview-heading" className="card-title">{child.name}</h2>
      <div className="identity-overview" aria-labelledby="child-overview-heading">
        <div className="overview-item">
          <span className="overview-label">DID:</span>
          <code className="overview-value did-value">{child.did || 'Not set'}</code>
        </div>

        <div className="overview-item">
          <span className="overview-label">Credential Status:</span>
          <span className={`status ${getStatusColor(child.credentialStatus)}`}>
            {getStatusLabel(child.credentialStatus)}
          </span>
        </div>

        <div className="overview-item">
          <span className="overview-label">Created:</span>
          <time dateTime={new Date(child.createdAt).toISOString()}>
            {new Date(child.createdAt).toLocaleDateString()}
          </time>
        </div>

        <div className="overview-item">
          <span className="overview-label">Last Updated:</span>
          <time dateTime={new Date(child.updatedAt).toISOString()}>
            {new Date(child.updatedAt).toLocaleDateString()}
          </time>
        </div>
      </div>
    </div>
  );
};
