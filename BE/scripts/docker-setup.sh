#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Team Todo Backend Docker Setup${NC}"
echo "=================================="

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}❌ Docker is not running. Please start Docker and try again.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Docker is running${NC}"
}

# Function to build and start development environment
start_dev() {
    echo -e "${YELLOW}🔨 Building and starting development environment...${NC}"
    
    # Stop existing containers
    docker-compose down
    
    # Build and start
    docker-compose up --build -d
    
    echo -e "${GREEN}✅ Development environment started!${NC}"
    echo -e "${BLUE}📊 Backend: http://localhost:3000${NC}"
    echo -e "${BLUE}📊 Health Check: http://localhost:3000/health${NC}"
    echo -e "${BLUE}📊 Database: localhost:5432${NC}"
    echo ""
    echo -e "${YELLOW}📋 Demo Credentials:${NC}"
    echo "Email: sam@example.com"
    echo "Password: password123"
}

# Function to start production environment
start_prod() {
    echo -e "${YELLOW}🚀 Building and starting production environment...${NC}"
    
    # Stop existing containers
    docker-compose -f docker-compose.prod.yml down
    
    # Build and start
    docker-compose -f docker-compose.prod.yml up --build -d
    
    echo -e "${GREEN}✅ Production environment started!${NC}"
    echo -e "${BLUE}📊 Backend: http://localhost:3000${NC}"
    echo -e "${BLUE}📊 Health Check: http://localhost:3000/health${NC}"
}

# Function to stop all containers
stop_all() {
    echo -e "${YELLOW}🛑 Stopping all containers...${NC}"
    docker-compose down
    docker-compose -f docker-compose.prod.yml down
    echo -e "${GREEN}✅ All containers stopped${NC}"
}

# Function to show logs
show_logs() {
    echo -e "${YELLOW}📋 Showing logs...${NC}"
    docker-compose logs -f
}

# Function to show status
show_status() {
    echo -e "${YELLOW}📊 Container Status:${NC}"
    docker-compose ps
}

# Main script logic
case "${1:-dev}" in
    "dev")
        check_docker
        start_dev
        ;;
    "prod")
        check_docker
        start_prod
        ;;
    "stop")
        stop_all
        ;;
    "logs")
        show_logs
        ;;
    "status")
        show_status
        ;;
    *)
        echo "Usage: $0 {dev|prod|stop|logs|status}"
        echo ""
        echo "Commands:"
        echo "  dev     - Start development environment"
        echo "  prod    - Start production environment"
        echo "  stop    - Stop all containers"
        echo "  logs    - Show logs"
        echo "  status  - Show container status"
        exit 1
        ;;
esac 