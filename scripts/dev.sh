#!/bin/bash

# Team Todo Management System - Development Script

set -e

echo "🔧 Starting Team Todo Management System in development mode..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install it and try again."
    exit 1
fi

# Function to check if port is available
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        print_warning "Port $port is already in use. Please stop the service using this port."
        return 1
    fi
    return 0
}

# Check required ports
print_status "Checking port availability..."
check_port 3000 || exit 1
check_port 3001 || exit 1
check_port 5432 || exit 1

# Create .env.dev file if it doesn't exist
if [ ! -f .env.dev ]; then
    print_status "Creating .env.dev file..."
    cat > .env.dev << EOF
# Database Configuration
DB_HOST=db
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=todo_app

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h

# Application Configuration
NODE_ENV=development
PORT=3000

# Frontend Configuration
VITE_API_URL=http://localhost:3000
EOF
    print_status ".env.dev file created successfully"
fi

# Stop existing development containers
print_status "Stopping existing development containers..."
docker-compose -f docker-compose.dev.yml down --remove-orphans 2>/dev/null || true

# Build and start development services
print_status "Building and starting development services..."
docker-compose -f docker-compose.dev.yml up --build -d

# Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 15

# Check service health
print_status "Checking service health..."

# Check database
if docker-compose -f docker-compose.dev.yml exec -T db pg_isready -U postgres > /dev/null 2>&1; then
    print_status "✅ Database is healthy"
else
    print_error "❌ Database health check failed"
    exit 1
fi

# Check backend
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    print_status "✅ Backend is healthy"
else
    print_error "❌ Backend health check failed"
    exit 1
fi

# Check frontend
if curl -f http://localhost:3001 > /dev/null 2>&1; then
    print_status "✅ Frontend is healthy"
else
    print_error "❌ Frontend health check failed"
    exit 1
fi

# Show service status
print_status "Service status:"
docker-compose -f docker-compose.dev.yml ps

# Show access URLs
echo ""
print_status "🎉 Development environment started successfully!"
echo ""
echo "📱 Access URLs:"
echo "   Frontend: http://localhost:3001"
echo "   Backend API: http://localhost:3000"
echo "   Health Check: http://localhost:3000/health"
echo ""
echo "🔐 Demo Credentials:"
echo "   Email: sam@example.com"
echo "   Password: password123"
echo ""
echo "🔄 Hot Reload Features:"
echo "   ✅ Frontend changes auto-reload"
echo "   ✅ Backend changes auto-restart"
echo "   ✅ Database changes persist"
echo ""
echo "📊 Useful Commands:"
echo "   View logs: docker-compose -f docker-compose.dev.yml logs -f"
echo "   View frontend logs: docker-compose -f docker-compose.dev.yml logs -f frontend"
echo "   View backend logs: docker-compose -f docker-compose.dev.yml logs -f backend"
echo "   Stop services: docker-compose -f docker-compose.dev.yml down"
echo "   Restart services: docker-compose -f docker-compose.dev.yml restart"
echo ""
echo "💡 Development Tips:"
echo "   - Frontend changes will auto-reload in browser"
echo "   - Backend changes will auto-restart the server"
echo "   - Check browser console for any errors"
echo "   - Use browser dev tools for debugging"
echo "" 