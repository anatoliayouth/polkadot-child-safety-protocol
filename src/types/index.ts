// Child identity types
export interface Child {
  id: string;
  name: string;
  did: string;
  credentialStatus: 'active' | 'pending' | 'revoked';
  createdAt: Date;
  updatedAt: Date;
}

// Guardian types
export interface Guardian {
  id: string;
  address: string;
  name: string;
  email?: string;
  permissionLevel: 'admin' | 'moderator' | 'viewer';
  childIds: string[];
  createdAt: Date;
}

// Activity log types
export interface ActivityEntry {
  id: string;
  childId: string;
  type: 'child_created' | 'guardian_added' | 'guardian_removed' | 'credential_updated' | 'entity_blocked' | 'entity_unblocked';
  description: string;
  timestamp: Date;
  actor?: string;
}

// Form data types
export interface CreateChildFormData {
  name: string;
  did?: string;
}

export interface AddGuardianFormData {
  address: string;
  name: string;
  email?: string;
  permissionLevel: 'admin' | 'moderator' | 'viewer';
  childId: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Notification types
export interface Notification {
  id: string;
  childId: string;
  message: string;
  timestamp: Date;
  read: boolean;
}
