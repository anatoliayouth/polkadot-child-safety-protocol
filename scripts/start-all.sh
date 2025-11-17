#!/bin/bash

# Start All Services Script for Polkadot Child Safety Protocol Demo
# This script starts all demo services in the correct order

set -e  # Exit on any error

echo "🚀 Starting Polkadot Child Safety Protocol Demo Services..."
echo "=========================================================="

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

# Check if a port is in use
is_port_in_use() {
    lsof -i :$1 >/dev/null 2>&1
}

# Wait for service to be ready
wait_for_service() {
    local url=$1
    local service_name=$2
    local max_attempts=30
    local attempt=1
    
    log_info "Waiting for $service_name to be ready..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" >/dev/null 2>&1; then
            log_success "$service_name is ready!"
            return 0
        fi
        
        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    log_error "$service_name failed to start within timeout"
    return 1
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    if ! command_exists docker; then
        log_error "Docker is not installed. Please run setup-demo.sh first."
        exit 1
    fi
    
    if ! docker info >/dev/null 2>&1; then
        log_error "Docker is not running. Please start Docker first."
        exit 1
    fi
    
    log_success "Prerequisites check passed!"
}

# Start Canvas node
start_canvas_node() {
    log_info "Starting Canvas node..."
    
    # Check if already running
    if docker ps | grep -q canvas-node; then
        log_warning "Canvas node is already running"
        return 0
    fi
    
    # Pull latest image if not present
    if ! docker images | grep -q paritytech/canvas-node; then
        log_info "Pulling Canvas node image..."
        docker pull paritytech/canvas-node:latest
    fi
    
    # Start the node
    docker run -d \
        --name canvas-node \
        --restart unless-stopped \
        -p 9944:9944 \
        -p 9933:9933 \
        -v $(pwd)/data:/data \
        paritytech/canvas-node:latest \
        --dev --ws-external --rpc-external --log info
    
    # Wait for node to be ready
    if wait_for_service "http://localhost:9944/health" "Canvas node"; then
        log_success "Canvas node started successfully!"
    else
        log_error "Canvas node failed to start"
        exit 1
    fi
}

# Start backend
start_backend() {
    log_info "Starting backend service..."
    
    cd backend
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        log_info "Installing backend dependencies..."
        npm install
    fi
    
    # Start backend in background
    if [ "$NODE_ENV" = "production" ]; then
        npm start > ../logs/backend.log 2>&1 &
    else
        npm run dev > ../logs/backend.log 2>&1 &
    fi
    
    BACKEND_PID=$!
    echo $BACKEND_PID > ../logs/backend.pid
    
    cd ..
    
    # Wait for backend to be ready
    if wait_for_service "http://localhost:3001/health" "Backend service"; then
        log_success "Backend service started successfully!"
    else
        log_error "Backend service failed to start"
        exit 1
    fi
}

# Start frontend
start_frontend() {
    log_info "Starting frontend application..."
    
    cd frontend
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        log_info "Installing frontend dependencies..."
        npm install
    fi
    
    # Start frontend in background
    npm start > ../logs/frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo $FRONTEND_PID > ../logs/frontend.pid
    
    cd ..
    
    # Wait for frontend to be ready (React takes time to compile)
    log_info "Waiting for frontend to compile (this may take a minute)..."
    sleep 30
    
    if curl -s http://localhost:3000 >/dev/null 2>&1; then
        log_success "Frontend application started successfully!"
    else
        log_warning "Frontend may still be compiling..."
        log_info "Check http://localhost:3000 in a moment"
    fi
}

# Seed demo data
seed_demo_data() {
    log_info "Seeding demo data..."
    
    if [ -f "scripts/seed-demo.js" ]; then
        node scripts/seed-demo.js
        log_success "Demo data seeded successfully!"
    else
        log_warning "Demo seeder not found, skipping..."
    fi
}

# Display service status
display_status() {
    echo ""
    echo "🎉 All services are running!"
    echo "=========================="
    echo ""
    echo "🌐 Frontend:     http://localhost:3000"
    echo "🔧 Backend API:  http://localhost:3001"
    echo "⛓️  Blockchain:   ws://localhost:9944"
    echo "📊 Node RPC:     http://localhost:9933"
    echo ""
    echo "📝 Logs:"
    echo "   Backend:  tail -f logs/backend.log"
    echo "   Frontend: tail -f logs/frontend.log"
    echo "   Canvas:   docker logs -f canvas-node"
    echo ""
    echo "🛑 To stop all services: ./scripts/stop-all.sh"
    echo ""
}

# Main execution
main() {
    # Create logs directory
    mkdir -p logs
    
    # Check if services are already running
    if is_port_in_use 3000 || is_port_in_use 3001 || is_port_in_use 9944; then
        log_warning "Some services appear to be already running"
        echo ""
        echo "Running services:"
        if is_port_in_use 9944; then echo "  - Canvas node (port 9944)"; fi
        if is_port_in_use 3001; then echo "  - Backend (port 3001)"; fi
        if is_port_in_use 3000; then echo "  - Frontend (port 3000)"; fi
        echo ""
        read -p "Do you want to continue starting services? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "Aborted."
            exit 0
        fi
    fi
    
    check_prerequisites
    start_canvas_node
    start_backend
    start_frontend
    seed_demo_data
    display_status
}

# Handle script interruption
trap 'echo ""; log_warning "Script interrupted"; exit 1' INT

# Run main function
main "$@"