# polkadot-child-safety-protocol

Minimal Web3 Child Safety PoC on Polkadot using ink! contracts, KILT DIDs, and polkadot.js to set guardian policies, block flagged entities, and demo safe dApp checks.

## Project Status

This project now includes a complete **Guardian Dashboard UI** built with React and TypeScript. See [UI_README.md](UI_README.md) for detailed documentation.

### Guardian Dashboard UI Features

- ✅ **Child Identity Management**: Create and manage child profiles with DID and credential status
- ✅ **Guardian Management**: Add/remove guardians with configurable permission levels (admin, moderator, viewer)
- ✅ **Activity Log**: Real-time activity feed with timeline visualization
- ✅ **Real-time Notifications**: SSE-based notification system for instant updates
- ✅ **Form Validation**: Client-side validation with clear error messages
- ✅ **Responsive Design**: Mobile-friendly interface that works on all screen sizes
- ✅ **Accessibility**: ARIA attributes, keyboard navigation, and semantic HTML
- ✅ **Component Tests**: Comprehensive test coverage for forms and data rendering
- ✅ **Type Safety**: Full TypeScript support with strict typing

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm start
```

The dashboard will open at `http://localhost:3000`

### Testing

```bash
npm test
```

### Building

```bash
npm run build
```

## Documentation

- [Guardian Dashboard UI Documentation](UI_README.md) - Complete UI guide
- [Component Documentation](.storybook-template.md) - Component API and examples
- [Environment Configuration](.env.example) - Configuration options

## Architecture

The project is organized into clear modules:

- **components/** - React UI components with tests
- **hooks/** - Custom React hooks for form management and notifications
- **services/** - API client and notification service
- **types/** - TypeScript type definitions
- **utils/** - Validation rules and helpers
- **styles/** - Global CSS with theming support

## Requirements Met

- ✅ Child identity overview with DID and credential status display
- ✅ Guardian management interface (list, add, remove with permission levels)
- ✅ Activity log with real-time event tracking
- ✅ Forms with validation calling mocked backend endpoints
- ✅ Success/error state handling
- ✅ Real-time notification feed using mock SSE
- ✅ Responsive design that works on mobile and desktop
- ✅ ARIA attributes and keyboard navigation for accessibility
- ✅ Component and unit tests covering forms and data rendering
- ✅ All UI flows work end-to-end with mocked backend

## Next Steps

To integrate with a real backend:

1. Update API endpoints in environment variables
2. Update the `apiClient` service with actual HTTP calls
3. Configure the SSE stream URL for real notifications
4. Deploy to production environment
