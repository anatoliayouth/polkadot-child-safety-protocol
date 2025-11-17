# Guardian Dashboard UI

This is a React-based web interface for the Guardian Dashboard, enabling parents/guardians to manage child profiles, assign guardians, and monitor activity in real-time.

## Features

- **Child Identity Management**: Create and manage child profiles with DID and credential status tracking
- **Guardian Management**: Add/remove guardians with configurable permission levels (admin, moderator, viewer)
- **Activity Log**: Real-time activity feed showing child profile events and changes
- **Real-time Notifications**: SSE-based notification system for instant updates
- **Form Validation**: Client-side validation with clear error messages
- **Responsive Design**: Mobile-friendly interface that works on all screen sizes
- **Accessibility**: ARIA attributes, keyboard navigation, and semantic HTML

## Project Structure

```
src/
├── components/           # React components
│   ├── GuardianDashboard.tsx       # Main dashboard container
│   ├── CreateChildForm.tsx         # Form to create new child profiles
│   ├── AddGuardianForm.tsx         # Form to add guardians
│   ├── ChildIdentityOverview.tsx   # Display child information
│   ├── GuardianManagement.tsx      # Guardian list and management
│   ├── ActivityLog.tsx             # Activity feed
│   ├── NotificationFeed.tsx        # Real-time notifications
│   ├── FormInput.tsx               # Reusable input component
│   ├── FormSelect.tsx              # Reusable select component
│   ├── __tests__/                  # Component tests
│   └── index.ts                    # Component exports
├── hooks/               # Custom React hooks
│   ├── useForm.ts       # Form state management
│   ├── useNotifications.ts # Notification subscription
│   ├── __tests__/       # Hook tests
│   └── index.ts         # Hook exports
├── services/            # API and service layer
│   ├── api.ts           # API client for backend
│   ├── notifications.ts # SSE notification service
│   ├── __tests__/       # Service tests
│   └── index.ts         # Service exports
├── types/               # TypeScript type definitions
│   └── index.ts         # All types and interfaces
├── utils/               # Utility functions
│   ├── validation.ts    # Form validation rules
│   ├── __tests__/       # Utility tests
│   └── index.ts         # Utility exports
├── styles/              # CSS styles
│   └── global.css       # Global styles and variables
├── App.tsx              # Root app component
├── index.tsx            # React entry point
└── setupTests.ts        # Test configuration

public/
└── index.html           # HTML entry point
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update the API URLs to match your backend:
```
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_SSE_URL=http://localhost:3001/api/notifications/stream
```

## Development

Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## Building

Create a production build:
```bash
npm run build
```

## Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## API Integration

The dashboard expects the following backend endpoints:

### Children Endpoints
- `GET /api/children` - Get all children
- `GET /api/children/:id` - Get child by ID
- `POST /api/children` - Create new child

### Guardians Endpoints
- `GET /api/guardians` - Get all guardians
- `GET /api/guardians?childId=:id` - Get guardians for child
- `POST /api/guardians` - Add guardian
- `DELETE /api/guardians/:id` - Remove guardian

### Activity Endpoints
- `GET /api/activity` - Get all activities
- `GET /api/activity?childId=:id` - Get activities for child
- `POST /api/activity` - Log activity

### Notifications (SSE)
- `GET /api/notifications/stream` - Server-Sent Events stream

## Form Validation

The application includes built-in validation rules:

- `required`: Field is mandatory
- `minLength`: Minimum character length
- `maxLength`: Maximum character length
- `email`: Valid email format
- `address`: Valid blockchain address
- `did`: Valid DID format

Example usage:
```typescript
const validator = createValidator({
  name: [ValidationRules.required, ValidationRules.minLength(2)],
  email: [ValidationRules.email],
});
```

## Accessibility

The UI is built with accessibility in mind:

- ARIA labels and descriptions for form inputs
- Semantic HTML (proper heading hierarchy, forms, lists)
- Keyboard navigation support
- Error announcements with `role="alert"`
- Live regions for dynamic content
- High contrast color scheme
- Focus management

## Type Safety

The project uses TypeScript for full type safety. Key types are defined in `src/types/index.ts`:

```typescript
interface Child {
  id: string;
  name: string;
  did: string;
  credentialStatus: 'active' | 'pending' | 'revoked';
  createdAt: Date;
  updatedAt: Date;
}

interface Guardian {
  id: string;
  address: string;
  name: string;
  email?: string;
  permissionLevel: 'admin' | 'moderator' | 'viewer';
  childIds: string[];
  createdAt: Date;
}

interface ActivityEntry {
  id: string;
  childId: string;
  type: 'child_created' | 'guardian_added' | 'guardian_removed' | 'credential_updated' | 'entity_blocked' | 'entity_unblocked';
  description: string;
  timestamp: Date;
  actor?: string;
}
```

## Real-time Notifications

The notification system uses Server-Sent Events (SSE) for real-time updates:

```typescript
import { useNotifications } from '@hooks/useNotifications';

export const MyComponent = () => {
  const { notifications, clearNotification } = useNotifications();
  
  return (
    <div>
      {notifications.map(n => (
        <div key={n.id}>
          {n.message}
          <button onClick={() => clearNotification(n.id)}>Dismiss</button>
        </div>
      ))}
    </div>
  );
};
```

## Performance

- Components are optimized with proper memoization
- API calls are cached where appropriate
- CSS uses custom properties for efficient theming
- Images are optimized and lazy-loaded
- Bundle size is minimized through code splitting

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- iOS Safari 12+
- Android Chrome

## Contributing

Follow these guidelines:

1. Write tests for new features
2. Use TypeScript for type safety
3. Follow the existing code style
4. Keep components small and focused
5. Document complex logic
6. Ensure accessibility compliance

## License

See LICENSE file
