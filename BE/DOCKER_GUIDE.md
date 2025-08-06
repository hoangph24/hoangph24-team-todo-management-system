# 🐳 Docker Setup & Quick Start Guide

## 📋 Overview

This project includes comprehensive Docker configuration for both development and production environments with a complete quick start guide.

## 🏗️ Architecture

### Development Environment
- **PostgreSQL 15** - Database with health checks
- **NestJS Backend** - Hot-reload development server
- **Volume Mounting** - Live code changes
- **Health Checks** - Automatic container monitoring

### Production Environment
- **Multi-stage Build** - Optimized image size
- **Security** - Non-root user execution
- **Performance** - Production-optimized settings
- **Monitoring** - Health checks and logging

## 📁 Docker Files

### Core Files
- `Dockerfile` - Production multi-stage build
- `Dockerfile.dev` - Development environment
- `docker-compose.yml` - Development orchestration
- `docker-compose.prod.yml` - Production orchestration
- `.dockerignore` - Optimized build context

### Scripts
- `docker-entrypoint.sh` - Container startup script
- `scripts/docker-setup.sh` - Easy management script

## 🚀 Quick Start

### Prerequisites

#### 1. Check Docker
```bash
# Check if Docker is installed
docker --version
docker-compose --version

# If not installed, download Docker Desktop from:
# https://www.docker.com/products/docker-desktop/
```

#### 2. Start Docker
```bash
# Windows/macOS: Open Docker Desktop
# Linux: sudo systemctl start docker

# Check if Docker is working
docker info
```

### Build & Run

#### Option 1: Using Script (Recommended)
```bash
# 1. Grant execute permissions
chmod +x scripts/docker-setup.sh
chmod +x docker-entrypoint.sh

# 2. Build and run development
. /scripts/docker-setup.sh dev

# 3. Or build and run production
. /scripts/docker-setup.sh prod
```

#### Option 2: Manual Commands
```bash
# 1. Build images
docker-compose build

# 2. Run development
docker-compose up -d

# 3. Or run production
docker-compose -f docker-compose.prod.yml up -d
```

### Verification

#### 1. Check containers
```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs -f
```

#### 2. Test health check
```bash
# Test health endpoint
curl http://localhost:3000/health

# Expected result:
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "development"
}
```

#### 3. Test API
```bash
# Test login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sam@example.com",
    "password": "password123"
  }'
```

## 🔧 Management & Commands

### Container Management
```bash
# 1. Check container status
. /scripts/docker-setup.sh status
# or
docker-compose ps

# 2. View real-time logs
. /scripts/docker-setup.sh logs
# or
docker-compose logs -f

# 3. Stop all containers
. /scripts/docker-setup.sh stop
# or
docker-compose down
```

### Debug Commands
```bash
# 1. View specific container logs
docker-compose logs -f backend
docker-compose logs -f db

# 2. Access container shell
docker-compose exec backend sh
docker-compose exec db psql -U postgres -d todo_app

# 3. Check container health
docker-compose ps
docker ps

# 4. View resource usage
docker stats

# 5. Check images
docker images

# 6. Check networks
docker network ls

# 7. Check volumes
docker volume ls

# 8. Restart service
docker-compose restart backend
```

## 🔧 Configuration Details

### Development Environment
- **Hot Reload**: Code changes reflect immediately
- **Volume Mounting**: Source code mounted for live editing
- **Database**: PostgreSQL with persistent data
- **Health Checks**: Automatic container monitoring
- **Networking**: Isolated network for services

### Production Environment
- **Multi-stage Build**: Optimized image size (~200MB)
- **Security**: Non-root user (nestjs:1001)
- **Performance**: Production dependencies only
- **Health Checks**: Built-in monitoring
- **Environment Variables**: Configurable via .env

## 🛡️ Security Features

### Development
- **Alpine Linux**: Minimal attack surface
- **Non-root User**: Limited permissions
- **Health Checks**: Container monitoring
- **Network Isolation**: Service separation

### Production
- **Multi-stage Build**: Reduced attack surface
- **Non-root Execution**: Security best practice
- **Minimal Dependencies**: Only production packages
- **Environment Variables**: Secure configuration

## 📊 Health Monitoring

### Database Health Check
```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U postgres"]
  interval: 10s
  timeout: 5s
  retries: 5
```

### Backend Health Check
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Docker Not Running
```bash
# Check Docker status
docker info

# Start Docker:
# Windows/macOS: Open Docker Desktop
# Linux: sudo systemctl start docker

# Check if Docker is working
docker ps
```

#### 2. Port Already in Use
```bash
# Check which port is being used
netstat -tulpn | grep :3000
netstat -tulpn | grep :5432
# or
lsof -i :3000
lsof -i :5432

# Stop service using the port
sudo systemctl stop postgresql
```

#### 3. Build Failures
```bash
# Clean build
docker-compose down
docker system prune -f
docker-compose build --no-cache
docker-compose up -d
```

#### 4. Database Connection Issues
```bash
# Check database container
docker-compose logs db

# Restart database
docker-compose restart db

# Check database health
docker-compose exec db pg_isready -U postgres
```

#### 5. Permission Issues
```bash
# Grant execute permissions to scripts
chmod +x scripts/docker-setup.sh
chmod +x docker-entrypoint.sh

# Check permissions
ls -la scripts/docker-setup.sh
ls -la docker-entrypoint.sh
```

## 📈 Performance Optimization

### Development
- **Volume Mounting**: Fast file access
- **Hot Reload**: Instant code changes
- **Cached Dependencies**: Faster rebuilds

### Production
- **Multi-stage Build**: Smaller images
- **Alpine Linux**: Minimal footprint
- **Production Dependencies**: Reduced size
- **Health Checks**: Automatic recovery

## 🔄 Environment Variables

### Development (.env)
```env
NODE_ENV=development
DB_HOST=db
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=todo_app
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

### Production (.env)
```env
NODE_ENV=production
DB_HOST=db
DB_PORT=5432
DB_USERNAME=${DB_USERNAME:-postgres}
DB_PASSWORD=${DB_PASSWORD:-postgres}
DB_NAME=${DB_NAME:-todo_app}
JWT_SECRET=${JWT_SECRET:-your-super-secret-jwt-key-change-in-production}
PORT=3000
```

## 📊 Access Points

- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health
- **Database**: localhost:5432
- **WebSocket**: ws://localhost:3000

## 🔐 Demo Credentials

```
Email: sam@example.com
Password: password123
```

## 📝 Best Practices

### Development
1. **Use Volume Mounting**: For live code changes
2. **Health Checks**: Monitor container status
3. **Logging**: Use structured logging
4. **Environment Variables**: Secure configuration

### Production
1. **Multi-stage Builds**: Optimize image size
2. **Non-root Users**: Security best practice
3. **Health Checks**: Automatic monitoring
4. **Resource Limits**: Prevent resource exhaustion
5. **Backup Strategy**: Database persistence

## 🎯 Next Steps

1. **Test API endpoints** with Postman or curl
2. **Connect WebSocket** to test real-time features
3. **Explore database** with pgAdmin or psql
4. **Check logs** to monitor application
5. **Customize Environment**: Modify .env files
6. **Add Monitoring**: Integrate with monitoring tools
7. **CI/CD Pipeline**: Automate deployments
8. **Security Scanning**: Regular vulnerability checks
9. **Performance Tuning**: Optimize for your workload

---

**🎉 Congratulations! Application is running successfully!** 