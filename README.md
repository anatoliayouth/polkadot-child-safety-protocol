# Polkadot Child Safety Protocol

**Guardian-controlled safety layer for child wallets on Polkadot**

## 🌍 Overview

Child wallets in Web3 face exposure to risky transactions, phishing, and scams. The Polkadot Child Safety Protocol solves this with a decentralized, transparent safety layer:

- **Guardians** set spending caps and manage address allowlists for child accounts
- **SafetyRegistry** flags dangerous addresses and malicious dApps
- **dApps** query the registry before sensitive actions, ensuring transactions are blocked or approved based on guardian policies
- **Result**: Decentralized, transparent safety for Web3 children—all verifiable on-chain through KILT DIDs

---

## 🚀 Quick Demo (< 2 minutes)

Clone the repo and run the interactive Guardian Dashboard locally:

```bash
git clone https://github.com/anatoliayouth/polkadot-child-safety-protocol.git
cd polkadot-child-safety-protocol
npm install
npm start
# Open http://localhost:3000
```

**Features of the demo:**
- ✅ No wallet connection needed
- ✅ No blockchain transactions required
- ✅ All flows simulated with realistic data
- ✅ Mobile-friendly interface
- ✅ Complete in < 2 minutes

---

## ✨ Features

- ✅ **Guardian-Controlled Spending Caps** — Set maximum transaction limits per time period
- ✅ **Address Allowlist Management** — Define trusted addresses for child wallets
- ✅ **Decentralized Safety Registry** — Flag suspicious addresses and malicious dApps on-chain
- ✅ **Real-Time Flagging System** — Instant updates when addresses are marked unsafe
- ✅ **dApp Safety Simulation** — See how dApps query policies before executing transactions
- ✅ **KILT DID Integration** — Display-only in MVP; enables verifiable credentials for guardians
- ✅ **Child Identity Management** — Create and track child profiles with DID and credential status
- ✅ **Guardian & Moderator Roles** — Role-based access control for permissions
- ✅ **Activity Log & Timeline** — Track all guardian actions and transactions
- ✅ **Real-Time Notifications** — SSE-based alerts for policy updates and flagged activities
- ✅ **Responsive Design** — Optimized for mobile, tablet, and desktop
- ✅ **Full Accessibility** — WCAG 2.1 AA compliance with keyboard navigation and ARIA labels

---

## 🏗️ Architecture

```
Guardian (AccountId)
    ↓
GuardianPolicy Contract (ink!, Shibuya)
    ├─ set_allowlist()
    ├─ set_cap()
    └─ is_allowed()
    ↓
SafetyRegistry Contract (ink!, Shibuya)
    ├─ flag()
    ├─ unflag()
    └─ is_flagged()
    ↓
dApp Query Layer (polkadot.js)
    └─ Blocks/Approves transactions before execution
```

### Components

**Smart Contracts** (ink! on Astar Shibuya):
- `GuardianPolicy` — Manages per-child spending caps and address allowlists
- `SafetyRegistry` — Maintains a registry of flagged addresses and dApps

**Frontend**:
- `app/` — Main Guardian Dashboard (React + polkadot.js, requires live contracts)
- `demo-site/` — Interactive demo with simulated state (standalone Next.js app)

**Identity**:
- KILT DIDs for guardian verification and credential issuance

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Smart Contracts** | ink! 5.0 on Astar Shibuya |
| **Frontend** | Next.js + React 18 + TypeScript + polkadot.js |
| **Identity** | KILT DIDs (lightweight resolution) |
| **Testing** | Jest + React Testing Library |
| **Styling** | CSS + Responsive Design |

---

## 📁 Repository Structure

```
polkadot-child-safety-protocol/
├── src/                           # Guardian Dashboard source
│   ├── components/                # React UI components
│   │   ├── ChildIdentityForm.tsx
│   │   ├── GuardianManagement.tsx
│   │   ├── ActivityLog.tsx
│   │   ├── NotificationFeed.tsx
│   │   └── ...
│   ├── hooks/                     # Custom React hooks
│   │   ├── useForm.ts
│   │   └── useNotifications.ts
│   ├── services/                  # API client & SSE service
│   ├── types/                     # TypeScript type definitions
│   ├── utils/                     # Validation & helpers
│   ├── styles/                    # Global CSS
│   └── App.tsx
├── public/                        # Static assets
├── contracts/                     # Smart contracts (ink!)
│   ├── guardian_policy/
│   └── safety_registry/
├── docs/                          # Documentation & screenshots
├── package.json
├── tsconfig.json
├── jest.config.js
├── .env.example
├── README.md
└── LICENSE (MIT)
```

---

## 📋 Prerequisites

Before you get started, ensure you have:

- **Node.js** 18 or higher
- **npm** or **yarn** for package management
- **Rust** 1.70+ (only if building contracts)
- **Polkadot.js Extension** (for wallet interaction with live contracts)
- **cargo-contract** (only if building contracts)

---

## 🔧 Setup & Development

### Option 1: Guardian Dashboard Demo (Recommended for Quick Start)

Run the simulated demo with no blockchain required:

```bash
npm install
npm start
# Dashboard opens at http://localhost:3000
```

**In the demo you can:**
1. Create and manage child identities
2. Add/remove guardians with different roles
3. Set spending caps and address allowlists
4. View the activity log
5. See real-time notifications
6. Simulate dApp transaction queries

### Option 2: Main Dashboard (Requires Deployed Contracts)

To run the full dashboard with live Shibuya contracts:

```bash
# Install dependencies
npm install

# Create .env with contract addresses
cp .env.example .env
# Edit .env and add:
# REACT_APP_GUARDIAN_POLICY_ADDRESS=<deployed-address>
# REACT_APP_SAFETY_REGISTRY_ADDRESS=<deployed-address>

# Start development server
npm start
```

### Building Contracts (Optional)

To build the ink! contracts:

```bash
cd contracts/guardian_policy
cargo contract build

cd ../safety_registry
cargo contract build
```

---

## 🚀 Deployment to Astar Shibuya Testnet

### 1. Prepare Contract Artifacts

```bash
cd contracts/guardian_policy
cargo contract build
# Creates: target/ink/guardian_policy.contract
```

### 2. Deploy via Polkadot.js Apps

- Visit [Polkadot.js Apps - Shibuya](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frpc.shibuya.astar.network#/contracts)
- Select **Upload Code**
- Upload `guardian_policy.contract`
- Click **Instantiate**
- Record the contract address

### 3. Configure Dashboard

Create `.env` with deployed addresses:

```bash
REACT_APP_GUARDIAN_POLICY_ADDRESS=<your-deployed-address>
REACT_APP_SAFETY_REGISTRY_ADDRESS=<your-deployed-address>
REACT_APP_RPC_URL=wss://rpc.shibuya.astar.network
```

### Resources

- **Faucet**: https://faucet.astar.network/
- **RPC**: `wss://rpc.shibuya.astar.network`
- **Explorer**: https://shibuya.subscan.io/

---

## 📖 How to Use

### Via Guardian Dashboard (Local Demo)

```bash
npm install && npm start
```

Then in the dashboard:

1. **Create Child Identity**
   - Fill in child name and DID (auto-generated)
   - Click "Create Child"

2. **Add Guardians**
   - Click "Add Guardian"
   - Enter guardian address and select role (admin/moderator/viewer)
   - View permissions for each role

3. **Set Spending Caps**
   - Navigate to "Policies" section
   - Set spending cap (e.g., $500/week)
   - Confirm with guardians

4. **Manage Allowlist**
   - Add trusted addresses (exchanges, safe dApps)
   - Remove addresses as needed
   - Real-time updates reflected in activity log

5. **Flag Suspicious Addresses**
   - Report dangerous addresses to SafetyRegistry
   - View flagged status in real-time

6. **Track Activity**
   - Monitor all guardian actions in Activity Log
   - Receive real-time notifications
   - Export activity reports

### Via Live Dashboard (With Deployed Contracts)

```bash
npm start
# Connect Polkadot.js wallet to Shibuya testnet
# Interact with live contracts on testnet
```

---

## 🧪 Testing

Run the full test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

### Test Coverage

- ✅ Component rendering and interaction
- ✅ Form validation and submission
- ✅ API error handling
- ✅ Real-time notification updates
- ✅ Activity log filtering
- ✅ Accessibility compliance

---

## 📚 Documentation

- **[Guardian Dashboard UI Guide](UI_README.md)** — Complete user and developer guide
- **[Component API Reference](.storybook-template.md)** — Component documentation and examples
- **[Implementation Summary](IMPLEMENTATION_SUMMARY.md)** — Technical deep-dive
- **[Testing Guide](TESTING_GUIDE.md)** — Test strategy and coverage
- **[Environment Configuration](.env.example)** — Configuration options

---

## ⚡ Success Criteria (MVP)

- ✅ Repository is public and cloneable
- ✅ Demo site runs with `npm install && npm start`
- ✅ All buttons trigger complete flows
- ✅ Mobile-responsive design works on all devices
- ✅ Judges complete demo in < 2 minutes
- ✅ README is clear, comprehensive, and actionable
- ✅ All documentation links are valid
- ✅ Code is well-organized and follows React best practices

---

## 🎯 Hackathon Info

| Item | Value |
|------|-------|
| **Event** | Build Resilient Apps with Polkadot Cloud |
| **Theme** | Child Safety on Blockchain |
| **Chain** | Astar Shibuya Testnet |
| **Language** | Rust (contracts), TypeScript (frontend) |
| **Demo** | 2-minute interactive walkthrough |

---

## 📦 Dependencies

### Runtime

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "axios": "^1.6.0"
}
```

### Development

```json
{
  "typescript": "^5.3.3",
  "jest": "^29.7.0",
  "@testing-library/react": "^14.1.2",
  "@types/react": "^18.2.45",
  "@typescript-eslint/eslint-plugin": "^6.15.0",
  "eslint": "^8.56.0"
}
```

### Smart Contracts

- `ink! ^5.0`
- `polkadot.js ^11.0`

---

## ⚠️ Known Limitations & Future Work

### MVP Limitations

- **Single Guardian Only** — Currently supports one guardian per child; multi-guardian support planned for v2
- **Simple Role Model** — Uses on-chain AccountId checks; full verifiable credentials planned
- **Shibuya Testnet Only** — Mainnet deployment pending after security audit
- **Simulated Demo** — Demo site uses mock data; live dashboard wires real contracts

### Planned Enhancements

- [ ] Multi-guardian support with voting
- [ ] KILT verifiable credentials for guardian roles
- [ ] Mainnet deployment
- [ ] Mobile-native app (React Native)
- [ ] Spending analytics and reports
- [ ] Integration with popular child wallet dApps
- [ ] AI-powered suspicious activity detection

---

## 🔗 Resources

- 📖 [Polkadot Documentation](https://wiki.polkadot.network/)
- 📖 [ink! Documentation](https://use.ink/)
- 📖 [Astar Network](https://astar.network/)
- 🔌 [polkadot.js API](https://polkadot.js.org/)
- 🔐 [KILT Protocol](https://www.kilt.io/)
- 💧 [Astar Shibuya Faucet](https://faucet.astar.network/)
- 🔍 [Shibuya Block Explorer](https://shibuya.subscan.io/)

---

## 📄 License

MIT License — see [LICENSE](LICENSE) file for details

---

## 👥 Authors & Contributors

**Team**: Polkadot Child Safety Protocol Contributors

Special thanks to:
- Polkadot ecosystem for the amazing infrastructure
- Astar Network for Shibuya testnet support
- KILT Protocol for DID integration

---

## 💬 Feedback & Support

Have questions or feedback? Feel free to:
- Open an issue on GitHub
- Check existing documentation
- Review the TESTING_GUIDE.md for common issues

**Happy Building! 🚀**
