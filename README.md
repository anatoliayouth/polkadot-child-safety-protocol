# Polkadot Child Safety Protocol

A minimal Web3 Child Safety proof-of-concept built on Polkadot, combining ink! smart contracts, KILT decentralized identifiers, and polkadot.js to manage guardian policies and block flagged entities.

## 🚀 Quick Start

Get the demo running in minutes:

```bash
# Clone and setup everything
./scripts/setup-demo.sh

# Start all services (Canvas node, backend, frontend)
./scripts/start-all.sh

# Open the demo in your browser
open http://localhost:3000
```

## 📖 Documentation

- **[Demo Guide](docs/demo-guide.md)** - Comprehensive setup and usage instructions
- **[API Documentation](docs/api.md)** - Backend API reference (coming soon)
- **[Smart Contract Guide](docs/contracts.md)** - Contract development and deployment (coming soon)

## 🏗️ Architecture

The system consists of:

- **GuardianPolicy Contract** - ink! smart contract for role management and spending controls
- **Backend API** - Node.js service for contract interaction and real-time notifications
- **Frontend dApp** - React interface for parents and children
- **Local Canvas Node** - Polkadot development environment

## 🛠️ Development

### Prerequisites
- Node.js 18+
- Rust 1.70+ with `cargo-contract`
- Docker and Docker Compose

### Setup
```bash
# Install dependencies and build everything
make setup

# Start development environment
make start

# Run tests
make test

# Clean up
make clean
```

## 🎯 Demo Flow

1. **Create Child Account** - Parent generates a wallet for their child
2. **Set Guardian Policy** - Configure spending limits and allowed applications  
3. **Child Activity** - Child uses approved dApps with real-time monitoring
4. **Notifications** - Parents receive alerts for policy violations and activity
5. **Emergency Controls** - Parents can pause/block access instantly

## 🔧 Smart Contracts

### GuardianPolicy
An ink! smart contract implementing guardian/child role management with spending caps and allowlists.

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

## 🗺️ Roadmap

### ✅ MVP (Current)
- GuardianPolicy smart contract with roles, caps, and allowlists
- Basic parent/child interface
- Real-time activity monitoring
- Local development environment

### 🔄 Post-MVP Features
- **Medical Records Integration** - Secure medical data storage with emergency access
- **Enhanced Messaging** - End-to-end encrypted parent-child communication  
- **Advanced Analytics** - Usage pattern analysis and behavioral insights
- **Multi-chain Support** - Cross-chain policy enforcement
- **Mobile Applications** - iOS and Android apps with push notifications
- **AI-powered Moderation** - Content filtering and risk detection

### 🔮 Future Vision
- Integration with educational platforms
- Gaming addiction prevention
- Social media safety controls
- Financial literacy tools
- School partnership programs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For demo support:
1. Check the [Demo Guide](docs/demo-guide.md)
2. Review the troubleshooting section
3. Check logs for error messages
4. Reset environment if needed: `./scripts/stop-all.sh && ./scripts/start-all.sh`

---

**Note**: This is a demo project for educational purposes. For production use, ensure proper security measures and compliance with relevant regulations.
