# Guardian Dashboard UI - Testing Guide

## Overview

This guide explains how to test the Guardian Dashboard UI components and verify that all functionality works as expected.

## Test Setup

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
npm install
```

## Running Tests

### All Tests
```bash
npm test
```

### Watch Mode (for development)
```bash
npm run test:watch
```

### With Coverage
```bash
npm test -- --coverage
```

## Test Structure

Tests are organized by the component/module they test:

```
src/
├── components/__tests__/
│   ├── FormInput.test.tsx
│   ├── CreateChildForm.test.tsx
│   ├── AddGuardianForm.test.tsx
│   ├── ChildIdentityOverview.test.tsx
│   ├── GuardianManagement.test.tsx
│   ├── ActivityLog.test.tsx
│   └── NotificationFeed.test.tsx
├── hooks/__tests__/
│   └── useForm.test.ts
└── utils/__tests__/
    └── validation.test.ts
```

## Test Coverage Summary

### Component Tests (71 test cases)

#### FormInput (9 tests)
- Rendering with label
- Required indicator display
- Error message display logic
- Value change handling
- Blur handling
- Input disabling
- ARIA attributes
- Input type variations

**Run individual test:**
```bash
npm test -- FormInput.test.tsx
```

#### CreateChildForm (8 tests)
- Form rendering with all fields
- Successful form submission
- Error handling on submission failure
- Validation error display
- Submit button disabled state
- Success message display
- Form reset after submission

**Run individual test:**
```bash
npm test -- CreateChildForm.test.tsx
```

#### AddGuardianForm (10 tests)
- Form rendering with all fields
- Successful form submission with valid data
- Error handling on submission failure
- Validation error display for required fields
- Success message display
- Form reset after submission
- Submit button disabled state
- Email validation
- Blockchain address validation
- Permission level selection

**Run individual test:**
```bash
npm test -- AddGuardianForm.test.tsx
```

#### ChildIdentityOverview (8 tests)
- Child name rendering as heading
- DID display
- Credential status display (active, pending, revoked)
- Date display
- Status CSS classes
- Missing DID handling
- Overview item count

**Run individual test:**
```bash
npm test -- ChildIdentityOverview.test.tsx
```

#### GuardianManagement (10 tests)
- Loading state display
- Guardian list display after loading
- Empty state display
- Error handling
- Guardian information display
- Permission level badge display
- Guardian removal with confirmation
- Confirmation dialog interaction
- Error handling on removal failure
- Specific child guardian fetching

**Run individual test:**
```bash
npm test -- GuardianManagement.test.tsx
```

#### ActivityLog (10 tests)
- Loading state display
- Activity entry display after loading
- Empty state display
- Error handling
- Timestamp display
- Actor information display
- Item limiting with maxItems prop
- Activity type labels
- Child-specific activity filtering
- Timeline structure rendering

**Run individual test:**
```bash
npm test -- ActivityLog.test.tsx
```

#### NotificationFeed (10 tests)
- Null rendering when no notifications
- Single notification rendering
- Multiple notifications display
- Notification dismissal
- Clear all functionality
- Auto-dismiss after 5 seconds
- Accessibility attributes (role, aria-live, aria-label)

**Run individual test:**
```bash
npm test -- NotificationFeed.test.tsx
```

### Hook Tests (11 test cases)

#### useForm (11 tests)
- Initial values setup
- Error and touched state initialization
- Value updates on change
- Field marking as touched
- Field validation on blur
- Form submission
- Validation preventing submission
- Form reset
- Field value setting
- Submit state tracking
- Valid state determination

**Run individual test:**
```bash
npm test -- useForm.test.ts
```

### Utility Tests (20+ test cases)

#### Validation Rules
- Required field validation (3 tests)
- Min/max length validation (6 tests)
- Email validation (3 tests)
- Blockchain address validation (3 tests)
- DID validation (3 tests)
- Validator composition (4 tests)

**Run individual test:**
```bash
npm test -- validation.test.ts
```

## Testing Patterns

### Form Testing Pattern

```typescript
it('submits form with valid data', async () => {
  const user = userEvent.setup();
  mockApiClient.createChild.mockResolvedValue({
    success: true,
    data: { /* child data */ },
  });

  render(<CreateChildForm onSuccess={mockOnSuccess} />);

  // Find and fill form fields
  await user.type(screen.getByLabelText(/name/i), 'Test Value');

  // Submit form
  const submitButton = screen.getByRole('button', { name: /submit/i });
  await user.click(submitButton);

  // Wait for and verify callback
  await waitFor(() => {
    expect(mockOnSuccess).toHaveBeenCalled();
  });
});
```

### Validation Testing Pattern

```typescript
it('validates required field', () => {
  const error = ValidationRules.required('');
  expect(error).toBe('This field is required');
});

it('validates email format', () => {
  const error = ValidationRules.email('invalid');
  expect(error).toBe('Must be a valid email address');
});
```

### Async Component Testing Pattern

```typescript
it('displays data after loading', async () => {
  mockApiClient.getGuardians.mockResolvedValue({
    success: true,
    data: mockGuardians,
  });

  render(<GuardianManagement childId="child-1" />);

  await waitFor(() => {
    expect(screen.getByText('Guardian Name')).toBeInTheDocument();
  });
});
```

## Mocking

### API Client Mocking

```typescript
jest.mock('@services/api');

const mockApiClient = apiModule.apiClient as jest.Mocked<typeof apiModule.apiClient>;

// Setup mock responses
mockApiClient.createChild.mockResolvedValue({
  success: true,
  data: { /* response data */ },
});
```

### Service Mocking

```typescript
jest.mock('@services/notifications');

const mockNotificationService = notificationsModule.notificationService as jest.Mocked<typeof notificationsModule.notificationService>;

mockNotificationService.subscribe.mockImplementation((callback) => {
  // Simulate receiving notification
  callback(notification);
  return jest.fn(); // unsubscribe function
});
```

## Testing Checklist

### Component Testing
- [ ] Component renders correctly
- [ ] Props are handled properly
- [ ] Event handlers work as expected
- [ ] Error states display correctly
- [ ] Loading states display correctly
- [ ] Empty states display correctly
- [ ] Accessibility attributes are present
- [ ] Keyboard navigation works
- [ ] Form validation works
- [ ] API calls are made correctly
- [ ] Success/error callbacks are called
- [ ] UI updates after data loads

### Integration Testing
- [ ] Forms can be filled out completely
- [ ] Form validation prevents invalid submission
- [ ] Form submission calls correct API endpoint
- [ ] Success messages display
- [ ] Error messages display
- [ ] Data displays after successful retrieval
- [ ] User can interact with all components
- [ ] Navigation between child profiles works
- [ ] Add guardian flow works end-to-end
- [ ] Remove guardian flow works end-to-end

### Accessibility Testing
- [ ] Form labels are associated with inputs
- [ ] Error messages have role="alert"
- [ ] Buttons are keyboard accessible
- [ ] Tab order is logical
- [ ] Focus is visible
- [ ] Screen reader announcements work
- [ ] Color isn't the only indicator
- [ ] Form fields have clear labels

## Debugging Tests

### Show Component Output
```typescript
import { screen, debug } from '@testing-library/react';

render(<Component />);
debug(); // Prints DOM tree to console
```

### Check Accessible Names
```typescript
screen.debug(); // Shows accessible names for elements

// or use logTestingPlaygroundURL
import { logTestingPlaygroundURL } from '@testing-library/react';
logTestingPlaygroundURL();
```

### Wait with Debugging
```typescript
await waitFor(
  () => {
    expect(element).toBeInTheDocument();
  },
  { timeout: 3000 }
);
```

## Performance Testing

### Render Performance
```typescript
import { render } from '@testing-library/react';
import { performance } from 'perf_hooks';

const start = performance.now();
render(<Component />);
const end = performance.now();

console.log(`Render time: ${end - start}ms`);
```

## Common Issues and Solutions

### Issue: "Unable to find an element with the text"
**Solution:** Use `screen.logTestingPlaygroundURL()` to see the DOM, or use `screen.debug()`

### Issue: "Act" warning
**Solution:** Wrap state updates in `act()` or use `waitFor()`

### Issue: Mock not being used
**Solution:** Ensure mock is defined before import, use `jest.mock()` at top of file

### Issue: Async test timeout
**Solution:** Increase timeout in `waitFor({ timeout: 5000 })` or check for actual delays

### Issue: Component not re-rendering
**Solution:** Ensure state updates are triggering, check mock implementations

## Continuous Integration

Tests are designed to run in CI/CD environments. Key considerations:

1. **No flaky tests** - All assertions are deterministic
2. **Mock external services** - No real API calls
3. **Deterministic data** - Tests use fixed mock data
4. **Timeout handling** - Tests have appropriate timeouts
5. **Environment variables** - .env.example provides defaults

## Adding New Tests

When adding new tests:

1. **Create test file** in `__tests__/` directory
2. **Follow naming convention** - `ComponentName.test.tsx`
3. **Use consistent patterns** - Match existing test structure
4. **Mock dependencies** - Mock API calls and services
5. **Test user interactions** - Use `userEvent` not `fireEvent`
6. **Wait for async updates** - Use `waitFor()` for async operations
7. **Include accessibility tests** - Verify ARIA attributes
8. **Document complex scenarios** - Add comments explaining setup

## Test Statistics

- **Total Test Files:** 11
- **Total Test Cases:** 100+
- **Coverage Target:** 80%+
- **Component Coverage:** Forms, API interaction, error handling
- **Mock Coverage:** API client, notification service
- **Utility Coverage:** All validation rules

## References

- [Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Docs](https://jestjs.io/docs/getting-started)
- [userEvent API](https://testing-library.com/docs/user-event/intro)
- [Accessibility Testing](https://testing-library.com/docs/queries/about/#priority)

## Support

For test-related questions or issues:
1. Check existing test files for examples
2. Refer to component documentation
3. Review Testing Library best practices
4. Check Jest configuration in `jest.config.js`
