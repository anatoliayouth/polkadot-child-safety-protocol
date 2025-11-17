# API Documentation

Backend API reference for the Polkadot Child Safety Protocol.

## Base URL
```
http://localhost:3001
```

## Authentication
Currently in demo mode - no authentication required. Production will use JWT tokens with KILT DIDs.

## Endpoints

### Health Check
```
GET /health
```

Returns the health status of the backend service.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Service Status
```
GET /api/status
```

Returns the status of all connected services.

**Response:**
```json
{
  "blockchain": "connected",
  "contract": "deployed",
  "demo": "ready"
}
```

## WebSocket Connection
```
ws://localhost:8080
```

Real-time updates for:
- Activity notifications
- Policy changes
- Guardian alerts

## Data Models

### Account
```typescript
interface Account {
  address: string;
  type: 'parent' | 'child' | 'guardian';
  name: string;
  createdAt: string;
}
```

### Policy
```typescript
interface Policy {
  id: string;
  guardian: string;
  child: string;
  spendCap: string;
  allowlist: string[];
  paused: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Activity
```typescript
interface Activity {
  id: string;
  child: string;
  action: 'login' | 'purchase' | 'login_attempt';
  application: string;
  status: 'allowed' | 'blocked';
  amount: string;
  timestamp: string;
}
```

### Notification
```typescript
interface Notification {
  id: string;
  recipient: string;
  type: 'activity_alert' | 'spending_alert' | 'policy_change';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}
```

## Error Responses

All endpoints may return these error responses:

### 400 Bad Request
```json
{
  "error": "Invalid request parameters",
  "code": "INVALID_PARAMS"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "code": "INTERNAL_ERROR"
}
```

## Development

The API is built with:
- Node.js + Express
- @polkadot/api for blockchain interaction
- WebSocket for real-time updates
- TypeScript (coming soon)

## Testing

```bash
cd backend
npm test
```

---

*This documentation is a work in progress and will be expanded as the API develops.*