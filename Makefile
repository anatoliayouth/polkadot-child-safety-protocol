.PHONY: help setup start stop clean build test demo logs status

# Default target
help:
	@echo "Polkadot Child Safety Protocol - Demo Commands"
	@echo ""
	@echo "Setup Commands:"
	@echo "  setup     - Setup complete demo environment"
	@echo "  build     - Build smart contract"
	@echo ""
	@echo "Service Management:"
	@echo "  start     - Start all services (node, backend, frontend)"
	@echo "  stop      - Stop all services"
	@echo "  restart   - Restart all services"
	@echo "  status    - Show service status"
	@echo ""
	@echo "Development:"
	@echo "  test      - Run smart contract tests"
	@echo "  logs      - Show service logs"
	@echo "  seed      - Seed demo data"
	@echo ""
	@echo "Maintenance:"
	@echo "  clean     - Clean up containers and data"
	@echo "  reset     - Full reset (clean + setup)"
	@echo ""
	@echo "Demo:"
	@echo "  demo      - Run complete demo (setup + start + seed)"

# Setup complete demo environment
setup:
	@echo "Setting up demo environment..."
	./scripts/setup-demo.sh

# Start all services
start:
	@echo "Starting all services..."
	./scripts/start-all.sh

# Stop all services
stop:
	@echo "Stopping all services..."
	./scripts/stop-all.sh

# Restart all services
restart: stop start

# Build smart contract
build:
	@echo "Building smart contract..."
	cd guardian_policy && cargo contract build

# Run tests
test:
	@echo "Running smart contract tests..."
	cd guardian_policy && cargo test

# Show service logs
logs:
	@echo "Showing service logs..."
	@if [ -f "logs/backend.log" ]; then echo "=== Backend Logs ==="; tail -f logs/backend.log & fi
	@if [ -f "logs/frontend.log" ]; then echo "=== Frontend Logs ==="; tail -f logs/frontend.log & fi
	@docker logs -f canvas-node 2>/dev/null || echo "Canvas node not running"

# Show service status
status:
	@echo "=== Service Status ==="
	@echo "Docker Containers:"
	@docker ps --filter "name=canvas-node" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || echo "No containers running"
	@echo ""
	@echo "Node Processes:"
	@ps aux | grep -E "(node|npm)" | grep -E "(3000|3001|8080)" | grep -v grep || echo "No Node processes found"
	@echo ""
	@echo "Port Usage:"
	@echo "Canvas Node (9944): $$(lsof -t -i:9944 2>/dev/null || echo 'Not in use')"
	@echo "Backend (3001):     $$(lsof -t -i:3001 2>/dev/null || echo 'Not in use')"
	@echo "Frontend (3000):    $$(lsof -t -i:3000 2>/dev/null || echo 'Not in use')"

# Seed demo data
seed:
	@echo "Seeding demo data..."
	./scripts/seed-demo.sh

# Clean up containers and data
clean:
	@echo "Cleaning up..."
	./scripts/stop-all.sh --clean
	docker system prune -f
	rm -rf backend/node_modules frontend/node_modules data logs

# Full reset
reset: clean setup

# Complete demo
demo: setup
	@echo "Starting demo services..."
	$(MAKE) start
	@sleep 10
	@echo "Seeding demo data..."
	$(MAKE) seed
	@echo ""
	@echo "🎉 Demo is ready!"
	@echo "📱 Frontend: http://localhost:3000"
	@echo "🔧 Backend:  http://localhost:3001"
	@echo "⛓️  Node:     ws://localhost:9944"
	@echo ""
	@echo "To stop the demo, run: make stop"

# Install dependencies only
install-deps:
	@echo "Installing dependencies..."
	@if [ ! -d "backend/node_modules" ]; then cd backend && npm install; fi
	@if [ ! -d "frontend/node_modules" ]; then cd frontend && npm install; fi

# Quick development setup
dev: install-deps
	@echo "Starting development environment..."
	@echo "Starting Canvas node..."
	@docker run -d --name canvas-node -p 9944:9944 -p 9933:9933 paritytech/canvas-node:latest --dev --ws-external --rpc-external
	@echo "Starting backend..."
	@cd backend && npm run dev > ../logs/backend.log 2>&1 &
	@echo "Starting frontend..."
	@cd frontend && npm start > ../logs/frontend.log 2>&1 &
	@echo "Development environment started!"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend:  http://localhost:3001"

# Check prerequisites
check:
	@echo "Checking prerequisites..."
	@command -v docker >/dev/null 2>&1 || (echo "❌ Docker is not installed" && exit 1)
	@command -v node >/dev/null 2>&1 || (echo "❌ Node.js is not installed" && exit 1)
	@command -v npm >/dev/null 2>&1 || (echo "❌ npm is not installed" && exit 1)
	@command -v cargo >/dev/null 2>&1 || (echo "❌ Rust/Cargo is not installed" && exit 1)
	@command -v cargo-contract >/dev/null 2>&1 || (echo "❌ cargo-contract is not installed" && exit 1)
	@echo "✅ All prerequisites are installed!"

# Show project info
info:
	@echo "=== Polkadot Child Safety Protocol ==="
	@echo "Version: 1.0.0"
	@echo "Description: Web3 Child Safety PoC on Polkadot"
	@echo ""
	@echo "Directories:"
	@echo "  guardian_policy/ - Smart contract (ink!)"
	@echo "  backend/         - Node.js API server"
	@echo "  frontend/        - React web application"
	@echo "  scripts/         - Automation scripts"
	@echo "  docs/           - Documentation"
	@echo "  data/           - Demo data"
	@echo "  logs/           - Service logs"
	@echo ""
	@echo "For help, run: make help"