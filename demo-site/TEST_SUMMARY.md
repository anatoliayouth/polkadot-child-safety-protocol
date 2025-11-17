# Demo Site Test Summary

## Test Coverage

All tests pass with comprehensive coverage across the demo site's core functionality.

### Test Suites

**Total: 6 test suites, 32 tests passing**

1. **DemoState Context Tests** (6 tests)
   - Blocks flagged addresses with appropriate messages
   - Blocks addresses not in allowlist
   - Approves allowlisted addresses and updates spent amount
   - Updates spend cap and logs changes
   - Updates allowlist with new addresses
   - Flags and unflags addresses correctly

2. **useMockContracts Hook Tests** (10 tests)
   - formatAddress utility: truncation, custom lengths, edge cases
   - validatePolkadotAddress utility: valid/invalid formats, length checks
   - parseAddressList utility: parsing, trimming, filtering empty strings

3. **GuardianPanel Component Tests** (1 test)
   - Displays initial spend cap and allowlist correctly

4. **RegistryPanel Component Tests** (1 test)
   - Displays initial flagged addresses with details

5. **SimulatePanel Component Tests** (6 tests)
   - Displays guardian policy and safety registry snapshots
   - Approves transactions to allowlisted addresses
   - Blocks transactions to flagged addresses
   - Blocks transactions to non-allowlisted addresses
   - Shows validation errors for invalid address formats
   - Shows validation errors for empty address submissions

6. **EventsLog Component Tests** (8 tests)
   - Renders list of events with descriptions and timestamps
   - Displays empty state when no events present
   - Shows event icons for different event types
   - Applies custom maxHeight to scrollable container
   - Uses default maxHeight when not specified

## Running Tests

```bash
cd demo-site
npm test
```

## Test Configuration

- **Framework**: Jest 29.7.0
- **Testing Library**: React Testing Library 14.1.2
- **Environment**: jsdom
- **Mocking**: react-toastify mocked for toast notifications
- **Coverage**: Components, hooks, context, and utility functions

## Test Features

- ✅ Fake timers for async operations
- ✅ DOM mocking for browser APIs (matchMedia, scrollTo)
- ✅ Mocked toast notifications
- ✅ Comprehensive accessibility testing
- ✅ Form validation testing
- ✅ State management testing
- ✅ Utility function testing
