# Smart Contracts Documentation

Technical documentation for the GuardianPolicy ink! smart contract and future contract developments.

## GuardianPolicy Contract

The core smart contract implementing guardian/child relationship management with spending controls and allowlists.

### Location
```
guardian_policy/
```

### Build
```bash
cd guardian_policy
cargo contract build
```

### Test
```bash
cd guardian_policy
cargo test
```

### Deploy
```bash
# Using the backend deployment script
curl -X POST http://localhost:3001/api/deploy \
  -H "Content-Type: application/json" \
  -d '{
    "guardian": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
    "child": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
    "spendCap": "10000000000000"
  }'
```

## Contract Architecture

### Storage Layout
```rust
pub struct GuardianPolicy {
    guardian: AccountId,     // Guardian account address
    child: AccountId,        // Child account address
    allowlist: Vec<AccountId>, // Approved applications/accounts
    spend_cap: Balance,      // Maximum spending limit
    paused: bool,           // Emergency pause state
}
```

### Events
```rust
pub struct AllowlistUpdated {
    #[ink(topic)]
    allowlist: Vec<AccountId>,
}

pub struct CapUpdated {
    #[ink(topic)]
    new_cap: Balance,
}

pub struct Paused {
    #[ink(topic)]
    paused: bool,
}
```

### Functions

#### Constructor
```rust
pub fn new(guardian: AccountId, child: AccountId, spend_cap: Balance) -> Self
```

#### Guardian-only Functions
```rust
pub fn set_allowlist(&mut self, allowlist: Vec<AccountId>) -> Result<()>
pub fn set_cap(&mut self, cap: Balance) -> Result<()>
pub fn pause(&mut self, paused: bool) -> Result<()>
```

#### Public View Functions
```rust
pub fn is_allowed(&self, account: AccountId) -> bool
pub fn get_cap(&self) -> Balance
pub fn is_paused(&self) -> bool
pub fn get_guardian(&self) -> AccountId
pub fn get_child(&self) -> AccountId
```

## Usage Patterns

### Creating a Policy
```typescript
import { ContractPromise } from '@polkadot/api-contract';

const contract = new ContractPromise(api, abi, contractAddress);

// Deploy new policy
const tx = contract.tx['new'](
  { gasLimit: '2000000000' },
  guardianAddress,
  childAddress,
  spendCap
);

const result = await tx.signAndSend(account);
```

### Updating Allowlist
```typescript
const tx = contract.tx['set_allowlist'](
  { gasLimit: '1000000000' },
  [approvedApp1, approvedApp2]
);

const result = await tx.signAndSend(guardianAccount);
```

### Checking Permissions
```typescript
const { result } = await contract.query['is_allowed'](
  accountAddress,
  {},
  applicationAddress
);

const isAllowed = result.output.toHuman();
```

## Security Considerations

### Access Control
- Only guardian can modify policy settings
- Child accounts have read-only access
- Emergency pause functionality

### Gas Optimization
- Use efficient data structures (Vec for allowlist)
- Minimize storage operations
- Batch operations where possible

### Upgradeability
- Contract is immutable by design
- Migration patterns for future upgrades
- Proxy contracts for complex logic

## Future Contracts

### Medical Records Contract
```rust
// Planned features
- Encrypted medical data storage
- Emergency access protocols
- Healthcare provider verification
- Access logging and audit trails
```

### Messaging Contract
```rust
// Planned features
- End-to-end encrypted messaging
- Parent-child communication channels
- Message expiration and deletion
- Content filtering and moderation
```

### Analytics Contract
```rust
// Planned features
- Usage pattern tracking
- Behavioral analysis
- Risk scoring algorithms
- Privacy-preserving analytics
```

## Development Tools

### ink! CLI
```bash
# Install
cargo install cargo-contract

# Build
cargo contract build

# Test
cargo test

# Deploy (local)
cargo contract instantiate --url ws://localhost:9944
```

### Polkadot.js Integration
```typescript
import { ApiPromise, WsProvider } from '@polkadot/api';
import { ContractPromise } from '@polkadot/api-contract';

const wsProvider = new WsProvider('ws://localhost:9944');
const api = await ApiPromise.create({ provider: wsProvider });
```

### Testing Strategy
- Unit tests for individual functions
- Integration tests for contract interactions
- E2E tests with full workflow
- Gas usage optimization tests

## Best Practices

### Code Organization
- Separate storage, events, and functions
- Use clear naming conventions
- Document complex logic
- Implement comprehensive error handling

### Security
- Validate all inputs
- Implement access controls
- Use reentrancy guards where needed
- Regular security audits

### Performance
- Optimize storage layout
- Minimize gas consumption
- Use efficient algorithms
- Profile and benchmark critical paths

## Troubleshooting

### Common Issues
- Insufficient gas limits
- Incorrect account permissions
- Storage capacity limits
- Network connectivity issues

### Debug Tools
- Contract events for debugging
- Polkadot.js apps for inspection
- Local node logs
- Contract state queries

---

*This documentation will be expanded as the contract ecosystem develops.*