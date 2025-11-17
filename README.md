# polkadot-child-safety-protocol
Minimal Web3 Child Safety PoC on Polkadot using ink! contracts, KILT DIDs, and polkadot.js to set guardian policies, block flagged entities, and demo safe dApp checks.

## Contracts

### GuardianPolicy
An ink! smart contract that implements guardian/child role management with spending caps and allowlists.

**Location:** `guardian_policy/`

**Features:**
- Guardian/child role separation
- Allowlist management for approved accounts
- Spending cap configuration
- Pause functionality
- Event emission for state changes

**Build:**
```bash
cd guardian_policy
cargo contract build
```

**Artifacts:** `guardian_policy/target/ink/guardian_policy.contract`

**Tests:**
```bash
cd guardian_policy
cargo test
```
