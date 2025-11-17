#!/bin/bash

# Stop All Services Script for Polkadot Child Safety Protocol Demo
# This script gracefully stops all demo services

set -e  # Exit on any error

echo "🛑 Stopping Polkadot Child Safety Protocol Demo Services..."
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
    -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Stop process by PID file
stop_process_by_pid() {
    local pid_file=$1
    local service_name=$2
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if kill -0 "$pid" 2>/dev/null; then
            log_info "Stopping $service_name (PID: $pid)..."
            kill "$pid"
            
            # Wait for process to stop
            local count=0
            while kill -0 "$pid" 2>/dev/null && [ $count -lt 10 ]; do
                sleep 1
                count=$((count + 1))
            done
            
            if kill -0 "$pid" 2>/dev/null; then
                log_warning "Force stopping $service_name..."
                kill -9 "$pid"
            fi
            
            log_success "$service_name stopped"
        else
            log_warning "$service_name was not running"
        fi
        rm -f "$pid_file"
    else
        log_warning "$service_name PID file not found"
    fi
}

# Stop processes by port
stop_process_by_port() {
    local port=$1
    local service_name=$2
    
    local pid=$(lsof -t -i:$port 2>/dev/null || true)
    if [ -n "$pid" ]; then
        log_info "Stopping $service_name (port $port, PID: $pid)..."
        kill "$pid"
        
        # Wait for process to stop
        local count=0
        while lsof -t -i:$port >/dev/null 2>&1 && [ $count -lt 10 ]; do
            sleep 1
            count=$((count + 1))
        done
        
        if lsof -t -i:$port >/dev/null 2>&1; then
            log_warning "Force stopping $service_name..."
            kill -9 $(lsof -t -i:$port)
        fi
        
        log_success "$service_name stopped"
    else
        log_info "$service_name was not running on port $port"
    fi
}

# Stop Docker containers
stop_docker_containers() {
    log_info "Stopping Docker containers..."
    
    # Stop canvas-node container
    if docker ps | grep -q canvas-node; then
        log_info "Stopping canvas-node container..."
        docker stop canvas-node
        docker rm canvas-node
        log_success "Canvas node container stopped"
    else
        log_info "Canvas node container was not running"
    fi
    
    # Stop any other demo containers
    local containers=$(docker ps -q --filter "name=child-safety" 2>/dev/null || true)
    if [ -n "$containers" ]; then
        log_info "Stopping child-safety containers..."
        docker stop $containers
        docker rm $containers
        log_success "Child safety containers stopped"
    fi
}

# Stop Node.js processes
stop_node_processes() {
    log_info "Stopping Node.js processes..."
    
    # Stop backend
    stop_process_by_pid "logs/backend.pid" "Backend service"
    stop_process_by_port 3001 "Backend service"
    
    # Stop frontend
    stop_process_by_pid "logs/frontend.pid" "Frontend application"
    stop_process_by_port 3000 "Frontend application"
    
    # Kill any remaining Node.js processes on demo ports
    for port in 3000 3001 8080; do
        local pids=$(lsof -t -i:$port 2>/dev/null || true)
        if [ -n "$pids" ]; then
            log_info "Killing remaining processes on port $port..."
            kill -9 $pids 2>/dev/null || true
        fi
    done
}

# Clean up temporary files
cleanup_temp_files() {
    log_info "Cleaning up temporary files..."
    
    # Remove PID files
    rm -f logs/backend.pid logs/frontend.pid
    
    # Remove log files if requested
    if [ "$1" = "--clean-logs" ]; then
        rm -f logs/*.log
        log_info "Log files cleaned"
    fi
    
    # Remove any temporary data files
    rm -f data/*.tmp
    
    log_success "Temporary files cleaned"
}

# Display final status
display_status() {
    echo ""
    echo "✅ All demo services have been stopped"
    echo "====================================="
    echo ""
    
    # Check if any processes are still running
    local remaining_services=""
    
    if lsof -t -i:9944 >/dev/null 2>&1; then
        remaining_services="$remaining_services  - Canvas node (port 9944)\\n"
    fi
    
    if lsof -t -i:3001 >/dev/null 2>&1; then
        remaining_services="$remaining_services  - Backend (port 3001)\\n"
    fi
    
    if lsof -t -i:3000 >/dev/null 2>&1; then
        remaining_services="$remaining_services  - Frontend (port 3000)\\n"
    fi
    
    if [ -n "$remaining_services" ]; then
        echo -e "${YELLOW}⚠️  Some services may still be running:${NC}"
        echo -e "$remaining_services"
        echo "You may need to manually stop these processes."
    else
        echo "🎉 All services stopped successfully!"
    fi
    
    echo ""
    echo "📝 Available commands:"
    echo "   Restart services: ./scripts/start-all.sh"
    echo "   Clean everything: make clean"
    echo "   Check status:     docker ps && lsof -i :3000,3001,9944"
    echo ""
}

# Main execution
main() {
    # Create logs directory if it doesn't exist
    mkdir -p logs
    
    # Check if we should clean logs too
    local clean_logs=""
    if [ "$1" = "--clean" ]; then
        clean_logs="--clean-logs"
    fi
    
    stop_docker_containers
    stop_node_processes
    cleanup_temp_files "$clean_logs"
    display_status
}

# Handle script interruption
trap 'echo ""; log_warning "Script interrupted"; exit 1' INT

# Run main function
main "$@"