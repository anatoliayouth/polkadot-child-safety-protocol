#!/bin/bash

# Demo Setup Script for Polkadot Child Safety Protocol
# This script automates the complete environment setup

set -e  # Exit on any error

echo "🚀 Setting up Polkadot Child Safety Protocol Demo..."
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check Docker
    if ! command_exists docker; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check Node.js
    if ! command_exists node; then
        log_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    # Check npm
    if ! command_exists npm; then
        log_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    # Check Rust
    if ! command_exists cargo; then
        log_error "Rust/Cargo is not installed. Please install Rust first."
        exit 1
    fi
    
    log_success "All prerequisites are installed!"
}

# Install cargo-contract if not present
install_cargo_contract() {
    if ! command_exists cargo-contract; then
        log_info "Installing cargo-contract..."
        cargo install cargo-contract --force
        log_success "cargo-contract installed!"
    else
        log_info "cargo-contract is already installed"
    fi
}

# Create necessary directories
create_directories() {
    log_info "Creating project directories..."
    
    mkdir -p backend frontend logs data
    
    log_success "Directories created!"
}

# Setup backend
setup_backend() {
    log_info "Setting up backend..."
    
    if [ ! -d "backend" ]; then
        mkdir -p backend
        log_info "Creating backend package.json..."
        cat > backend/package.json << 'EOF'
{
  "name": "child-safety-backend",
  "version": "1.0.0",
  "description": "Backend for Polkadot Child Safety Protocol",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "test": "jest"
  },
  "dependencies": {
    "@polkadot/api": "^10.9.1",
    "@polkadot/api-contract": "^10.9.1",
    "@polkadot/keyring": "^12.6.2",
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "ws": "^8.14.2",
    "nodemon": "^3.0.1"
  },
  "devDependencies": {
    "jest": "^29.7.0"
  }
}
EOF
    fi
    
    cd backend
    if [ ! -d "node_modules" ]; then
        log_info "Installing backend dependencies..."
        npm install
    fi
    
    # Create basic backend structure
    mkdir -p src routes middleware utils
    
    # Create main server file
    if [ ! -f "src/index.js" ]; then
        log_info "Creating main server file..."
        cat > src/index.js << 'EOF'
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const WebSocket = require('ws');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// WebSocket server for real-time updates
const wss = new WebSocket.Server({ port: 8080 });

// Basic routes
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/status', (req, res) => {
    res.json({ 
        blockchain: 'connected',
        contract: 'deployed',
        demo: 'ready'
    });
});

// WebSocket connection handler
wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    
    ws.on('message', (message) => {
        console.log('Received:', message);
    });
    
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
    console.log(`WebSocket server running on port 8080`);
});
EOF
    fi
    
    # Create environment file
    if [ ! -f ".env" ]; then
        log_info "Creating backend environment file..."
        cat > .env << 'EOF'
WSS_URL=ws://localhost:9944
PORT=3001
NODE_ENV=development
DEMO_MODE=true
SEED_DATA=true
ENABLE_EMAIL_NOTIFICATIONS=false
ENABLE_PUSH_NOTIFICATIONS=true
EOF
    fi
    
    cd ..
    log_success "Backend setup complete!"
}

# Setup frontend
setup_frontend() {
    log_info "Setting up frontend..."
    
    if [ ! -d "frontend" ]; then
        log_info "Creating React frontend..."
        npx create-react-app frontend --template typescript
    fi
    
    cd frontend
    
    # Install additional dependencies
    log_info "Installing frontend dependencies..."
    npm install @polkadot/api @polkadot/extension-dapp
    
    # Create environment file
    if [ ! -f ".env" ]; then
        log_info "Creating frontend environment file..."
        cat > .env << 'EOF'
REACT_APP_API_URL=http://localhost:3001
REACT_APP_WSS_URL=ws://localhost:9944
REACT_APP_DEMO_MODE=true
REACT_APP_AUTO_CONNECT=true
REACT_APP_ENABLE_KILT=false
REACT_APP_ENABLE_ZEITGEIST=false
EOF
    fi
    
    cd ..
    log_success "Frontend setup complete!"
}

# Build smart contract
build_contract() {
    log_info "Building GuardianPolicy smart contract..."
    
    cd guardian_policy
    
    if [ ! -f "Cargo.toml" ]; then
        log_error "GuardianPolicy contract not found!"
        exit 1
    fi
    
    cargo contract build
    
    if [ $? -eq 0 ]; then
        log_success "Smart contract built successfully!"
    else
        log_error "Smart contract build failed!"
        exit 1
    fi
    
    cd ..
}

# Create demo data seeder
create_demo_seeder() {
    log_info "Creating demo data seeder..."
    
    cat > scripts/seed-demo.js << 'EOF'
const { Keyring } = require('@polkadot/keyring');
const { cryptoWaitReady } = require('@polkadot/util-crypto');

async function seedDemoData() {
    await cryptoWaitReady();
    
    const keyring = new Keyring({ type: 'sr25519' });
    
    // Create demo accounts
    const parent = keyring.addFromUri('//Alice');
    const child = keyring.addFromUri('//Bob');
    
    console.log('Demo Accounts:');
    console.log('Parent:', parent.address);
    console.log('Child:', child.address);
    
    // Demo policy data
    const demoPolicy = {
        guardian: parent.address,
        child: child.address,
        spendCap: 1000000000000, // 1 unit
        allowlist: [
            '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY', // Charlie
            '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'  // Dave
        ],
        paused: false
    };
    
    console.log('Demo Policy:', demoPolicy);
    
    // Save to file for later use
    const fs = require('fs');
    fs.writeFileSync('data/demo-accounts.json', JSON.stringify({
        parent: parent.address,
        child: child.address,
        policy: demoPolicy
    }, null, 2));
    
    console.log('Demo data saved to data/demo-accounts.json');
}

seedDemoData().catch(console.error);
EOF
    
    log_success "Demo seeder created!"
}

# Create Docker Compose file
create_docker_compose() {
    log_info "Creating Docker Compose configuration..."
    
    cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  canvas-node:
    image: paritytech/canvas-node:latest
    container_name: canvas-node
    ports:
      - "9944:9944"
      - "9933:9933"
    command: --dev --ws-external --rpc-external --log info
    volumes:
      - ./data:/data
    networks:
      - child-safety-net

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: child-safety-backend
    ports:
      - "3001:3001"
      - "8080:8080"
    environment:
      - WSS_URL=ws://canvas-node:9944
      - PORT=3001
      - NODE_ENV=development
      - DEMO_MODE=true
    depends_on:
      - canvas-node
    networks:
      - child-safety-net
    volumes:
      - ./backend:/app
      - /app/node_modules

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: child-safety-frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:3001
      - REACT_APP_WSS_URL=ws://localhost:9944
      - REACT_APP_DEMO_MODE=true
    depends_on:
      - backend
    networks:
      - child-safety-net
    volumes:
      - ./frontend:/app
      - /app/node_modules

networks:
  child-safety-net:
    driver: bridge

volumes:
  canvas-data:
EOF
    
    log_success "Docker Compose configuration created!"
}

# Create Makefile for easy commands
create_makefile() {
    log_info "Creating Makefile..."
    
    cat > Makefile << 'EOF'
.PHONY: help setup start stop clean build test demo

help:
	@echo "Polkadot Child Safety Protocol - Demo Commands"
	@echo ""
	@echo "setup     - Setup complete demo environment"
	@echo "start     - Start all services"
	@echo "stop      - Stop all services"
	@echo "clean     - Clean up containers and data"
	@echo "build     - Build smart contract"
	@echo "test      - Run tests"
	@echo "demo      - Run complete demo flow"

setup:
	@echo "Setting up demo environment..."
	./scripts/setup-demo.sh

start:
	@echo "Starting all services..."
	docker-compose up -d
	@echo "Services starting..."
	@echo "Frontend: http://localhost:3000"
	@echo "Backend:  http://localhost:3001"
	@echo "Node:     ws://localhost:9944"

stop:
	@echo "Stopping all services..."
	docker-compose down

clean:
	@echo "Cleaning up..."
	docker-compose down -v
	docker system prune -f
	rm -rf backend/node_modules frontend/node_modules

build:
	@echo "Building smart contract..."
	cd guardian_policy && cargo contract build

test:
	@echo "Running tests..."
	cd guardian_policy && cargo test

demo: setup start
	@echo "Demo is ready! Visit http://localhost:3000"
	@echo "Use './scripts/seed-demo.sh' to populate demo data"

logs:
	docker-compose logs -f

status:
	docker-compose ps
EOF
    
    log_success "Makefile created!"
}

# Main execution
main() {
    echo ""
    log_info "Starting demo setup process..."
    echo ""
    
    check_prerequisites
    install_cargo_contract
    create_directories
    setup_backend
    setup_frontend
    build_contract
    create_demo_seeder
    create_docker_compose
    create_makefile
    
    echo ""
    log_success "🎉 Demo setup complete!"
    echo ""
    echo "Next steps:"
    echo "1. Start all services:     make start"
    echo "2. Or use Docker Compose:  docker-compose up -d"
    echo "3. Seed demo data:        ./scripts/seed-demo.sh"
    echo "4. Open browser:          http://localhost:3000"
    echo ""
    echo "For help, run: make help"
    echo ""
}

# Run main function
main "$@"