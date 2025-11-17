# Demo Site

An interactive, fully mocked demonstration of the Polkadot Child Safety MVP. No blockchain connection required—perfect for quick demos.

## Quick Start

```bash
cd demo-site
npm install
npm run dev
```

Then open <http://localhost:3000> in your browser and explore the simulated guardian and safety registry flows. All contract interactions are mocked with realistic UX feedback.

## Features

- Next.js + Tailwind CSS standalone app
- Guardian controls for spend caps and allow lists
- Safety registry with flag/unflag flows
- Simulated dApp checks with loading indicators and toast feedback
- Responsive layout with accessibility best practices

## Tech Stack

- Next.js 14
- React 18
- Tailwind CSS
- TypeScript
- React Toastify

## Testing

Run the comprehensive test suite:

```bash
npm test
```

**Test Coverage**: 32 tests across 6 test suites
- DemoState context logic
- useMockContracts hook utilities
- GuardianPanel, RegistryPanel, and SimulatePanel components
- EventsLog component
- Full validation and state management

See [TEST_SUMMARY.md](./TEST_SUMMARY.md) for detailed test information.

## Notes

- All state is stored in-memory and resets on refresh.
- Designed for quick local demos in under two minutes.
- No blockchain connection required—all interactions are mocked.
