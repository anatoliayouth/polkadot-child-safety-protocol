# Demo Guide: Polkadot Child Safety Protocol

This guide provides step-by-step instructions for running the complete end-to-end demo of the Polkadot Child Safety Protocol for the hackathon showcase.

## Overview

The demo demonstrates:
1. **Local Canvas node setup** - Running a local Polkadot development node
2. **Smart contract deployment** - Deploying the GuardianPolicy ink! contract
3. **Backend services** - API server for managing guardian policies and notifications
4. **Frontend application** - Web interface for parents and children
5. **End-to-end flow** - Create child → Add guardian → Log activity → Send notifications

## Prerequisites

### System Requirements
- **Node.js** 18+ and npm
- **Rust** 1.70+ with `cargo-contract` installed
- **Docker** and Docker Compose
- **Git**

### Install Rust Tools
```bash
# Install Rust if not already installed
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# Install cargo-contract for ink! development
cargo install cargo-contract --force
```

### Install Node.js Dependencies
```bash
# Install Node.js using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
```

## Quick Start

For the fastest demo setup, use the automated script:

```bash
# Clone and setup everything
./scripts/setup-demo.sh

# Start all services
./scripts/start-all.sh

# Open demo in browser
open http://localhost:3000
```

## Manual Setup

### 1. Start Local Canvas Node

```bash
# Pull the latest Canvas runtime image
docker pull paritytech/canvas-node:latest

# Start the node in development mode
docker run -p 9944:9944 -p 9933:9933 \
  --name canvas-node \
  paritytech/canvas-node:latest \
  --dev --ws-external --rpc-external
```

**Verify node is running:**
```bash
curl http://localhost:9944/health || echo "Node not ready yet"
```

### 2. Build and Deploy Smart Contract

```bash
# Build the GuardianPolicy contract
cd guardian_policy
cargo contract build

# Deploy contract (this will be automated in the backend startup)
# The contract will be deployed to the local node when you start the backend
```

### 3. Start Backend Services

```bash
# Install dependencies
cd backend  # (create this directory if it doesn't exist)
npm install

# Start backend server
npm run dev
```

The backend will:
- Connect to the local Canvas node
- Deploy the GuardianPolicy contract
- Set up API endpoints for the frontend
- Initialize demo accounts and data

### 4. Start Frontend Application

```bash
# Install dependencies
cd frontend  # (create this directory if it doesn't exist)
npm install

# Start development server
npm run dev
```

### 5. Access the Demo

Open your browser to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Polkadot.js Apps**: http://localhost:3000 (when configured)

## Demo Flow

### Step 1: Parent Creates Child Account
1. Navigate to the frontend application
2. Click "Create Child Account"
3. Enter child's information (name, age, etc.)
4. System generates a new wallet address for the child

### Step 2: Parent Sets Up Guardian Policy
1. As the parent, configure spending limits
2. Set allowed dApps/websites (allowlist)
3. Configure notification preferences
4. Deploy the GuardianPolicy contract with these settings

### Step 3: Child Uses Approved Applications
1. Child logs into their account
2. Attempts to access allowed applications
3. GuardianPolicy contract validates access
4. Activity is logged on-chain

### Step 4: Real-time Monitoring
1. Parent dashboard shows child's activity
2. Notifications sent for:
   - New account registrations
   - Spending limit approaches
   - Blocked access attempts
   - Policy changes

### Step 5: Emergency Controls
1. Parent can pause all child activity
2. Emergency block of specific applications
3. Modify policies in real-time

## Environment Variables

### Backend Configuration
Create a `.env` file in the backend directory:

```bash
# Blockchain connection
WSS_URL=ws://localhost:9944
CONTRACT_ADDRESS=  # Auto-populated after deployment

# API configuration
PORT=3001
NODE_ENV=development

# KILT integration (optional for demo)
KILT_WSS_URL=wss://peregrine.kilt.io
KILT_DID=  # Your KILT DID for production

# Notification settings
ENABLE_EMAIL_NOTIFICATIONS=false
ENABLE_PUSH_NOTIFICATIONS=true

# Demo mode
DEMO_MODE=true
SEED_DATA=true
```

### Frontend Configuration
Create a `.env` file in the frontend directory:

```bash
# API connection
REACT_APP_API_URL=http://localhost:3001
REACT_APP_WSS_URL=ws://localhost:9944

# Feature flags
REACT_APP_ENABLE_KILT=false  # Set to true for production
REACT_APP_ENABLE_ZEITGEIST=false  # Set to true for production

# Demo settings
REACT_APP_DEMO_MODE=true
REACT_APP_AUTO_CONNECT=true
```

## Automation Scripts

### Setup Script (`scripts/setup-demo.sh`)
Automates the entire environment setup:
- Installs dependencies
- Creates configuration files
- Builds contracts
- Seeds demo data

### Start All Services (`scripts/start-all.sh`)
Starts all demo services:
- Canvas node (Docker)
- Backend server
- Frontend application
- Monitoring tools

### Stop All Services (`scripts/stop-all.sh`)
Gracefully stops all services and cleans up containers.

### Seed Demo Data (`scripts/seed-demo.sh`)
Creates sample data for testing:
- Parent and child accounts
- Pre-configured policies
- Sample activity logs

## Troubleshooting

### Common Issues

#### Canvas Node Won't Start
```bash
# Check if port is already in use
lsof -i :9944

# Kill existing processes
sudo kill -9 $(lsof -t -i:9944)

# Restart with clean state
docker rm -f canvas-node
docker run -p 9944:9944 -p 9933:9933 \
  --name canvas-node \
  paritytech/canvas-node:latest \
  --dev --ws-external --rpc-external
```

#### Contract Deployment Fails
```bash
# Check node connectivity
curl http://localhost:9944/health

# Verify contract build
cd guardian_policy
cargo contract build --release

# Check node logs
docker logs canvas-node
```

#### Backend Connection Issues
```bash
# Verify WebSocket connection
wscat -c ws://localhost:9944

# Check backend logs
cd backend
npm run dev  # Look for connection errors
```

#### Frontend Build Errors
```bash
# Clear node modules
rm -rf node_modules package-lock.json
npm install

# Check environment variables
cat .env
```

### Debug Mode

Enable verbose logging:
```bash
# Backend
DEBUG=* npm run dev

# Frontend
REACT_APP_DEBUG=true npm start

# Canvas node (add to docker run command)
--log debug
```

### Reset Everything
```bash
# Stop all services
./scripts/stop-all.sh

# Clean Docker
docker system prune -f

# Remove node modules
rm -rf backend/node_modules frontend/node_modules

# Rebuild everything
./scripts/setup-demo.sh
./scripts/start-all.sh
```

## Integration with Real Services

### KILT DID Integration
For production use with real KILT DIDs:

1. **Create KILT DID**:
   ```bash
   npm install -g @kiltprotocol/sdk
   kilt-did create
   ```

2. **Update Backend Configuration**:
   ```bash
   KILT_WSS_URL=wss://peregrine.kilt.io
   KILT_DID=did:kilt:your_did_here
   ```

3. **Enable in Frontend**:
   ```bash
   REACT_APP_ENABLE_KILT=true
   ```

### Zeitgeist Integration
For prediction market features:

1. **Configure Zeitgeist RPC**:
   ```bash
   ZEITGEIST_WSS_URL=wss://rpc.zeitgeist.pm
   ```

2. **Enable Markets**:
   ```bash
   REACT_APP_ENABLE_ZEITGEIST=true
   ```

## Performance Monitoring

### Health Checks
```bash
# Node health
curl http://localhost:9944/health

# Backend health
curl http://localhost:3001/health

# Frontend availability
curl http://localhost:3000
```

### Monitoring Tools
- **Polkadot.js Apps**: http://localhost:3000 (when configured)
- **Contract State**: Use backend API endpoints
- **Activity Logs**: Check backend logs for real-time events

## Security Considerations

### Demo Mode Security
- Uses development keys (not secure for production)
- Local node only (no network exposure)
- Mock authentication for demo purposes

### Production Security
- Use secure key management
- Enable HTTPS/WSS
- Implement proper authentication
- Use production KILT DIDs
- Audit smart contracts

## Future Roadmap

### MVP Features (Current)
- ✅ GuardianPolicy smart contract
- ✅ Basic parent/child roles
- ✅ Spending caps and allowlists
- ✅ Activity logging
- ✅ Real-time notifications

### Post-MVP Features
- 🔄 **Medical Records Integration**
  - Secure medical data storage
  - Emergency access protocols
  - Healthcare provider verification
  
- 🔄 **Enhanced Messaging**
  - End-to-end encrypted messaging
  - Parent-child communication
  - Emergency broadcast system
  
- 🔄 **Advanced Analytics**
  - Usage pattern analysis
  - Behavioral insights
  - Risk assessment algorithms
  
- 🔄 **Multi-chain Support**
  - Cross-chain policy enforcement
  - Asset transfers across networks
  - Interoperability with other chains
  
- 🔄 **Mobile Applications**
  - iOS and Android apps
  - Push notifications
  - Offline functionality
  
- 🔄 **AI-powered Moderation**
  - Content filtering
  - Risk detection
  - Automated policy adjustments

## Support

For demo support:
1. Check this guide first
2. Review troubleshooting section
3. Check logs for error messages
4. Reset environment if needed

## Contributing

To extend the demo:
1. Follow the existing code patterns
2. Update documentation
3. Test end-to-end flow
4. Submit pull requests

---

**Note**: This demo is for educational and showcase purposes. For production use, ensure proper security measures and compliance with relevant regulations.