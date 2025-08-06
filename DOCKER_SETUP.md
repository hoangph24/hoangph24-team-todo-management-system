# 🐳 Docker Setup Guide

## 📋 Overview

This guide explains how to run the Team Todo Management System using Docker containers. The setup includes:

- **Frontend**: React application with nginx
- **Backend**: NestJS API server
- **Database**: PostgreSQL database
- **Development**: Hot reloading for both FE and BE

## 🚀 Quick Start

### **Production Deployment**

```bash
# Make scripts executable
chmod +x scripts/deploy.sh

# Deploy the full stack
./scripts/deploy.sh
```

**Access URLs:**
- Frontend: http://localhost
- Backend API: http://localhost:3000
- Health Check: http://localhost:3000/health

### **Development Mode**

```bash
# Make scripts executable
chmod +x scripts/dev.sh

# Start development environment
./scripts/dev.sh
```

**Access URLs:**
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000
- Health Check: http://localhost:3000/health

## 🏗️ Architecture

### **Production Architecture**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │    Database     │
│   (Nginx)       │◄──►│   (NestJS)      │◄──►│   (PostgreSQL)  │
│   Port: 80      │    │   Port: 3000    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Development Architecture**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │    Database     │
│   (Vite Dev)    │◄──►│   (NestJS Dev)  │◄──►│   (PostgreSQL)  │
│   Port: 3001    │    │   Port: 3000    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 File Structure

```
├── docker-compose.yml          # Production compose
├── docker-compose.dev.yml      # Development compose
├── scripts/
│   ├── deploy.sh              # Production deployment script
│   └── dev.sh                 # Development script
├── FE/
│   ├── Dockerfile             # Production frontend
│   ├── Dockerfile.dev         # Development frontend
│   ├── nginx.conf             # Nginx configuration
│   └── .dockerignore          # Frontend ignore file
└── BE/
    ├── Dockerfile             # Production backend
    ├── Dockerfile.dev         # Development backend
    └── .dockerignore          # Backend ignore file
```

## 🔧 Configuration

### **Environment Variables**

#### **Production (.env)**
```env
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
NODE_ENV=production
PORT=3000

# Frontend Configuration
VITE_API_URL=http://localhost:3000
```

#### **Development (.env.dev)**
```env
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
```

## 🐳 Docker Commands

### **Production Commands**

```bash
# Build and start all services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Restart services
docker-compose restart

# View service status
docker-compose ps

# Scale services
docker-compose up --scale backend=3 -d
```

### **Development Commands**

```bash
# Build and start development services
docker-compose -f docker-compose.dev.yml up --build -d

# View development logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop development services
docker-compose -f docker-compose.dev.yml down

# View frontend logs only
docker-compose -f docker-compose.dev.yml logs -f frontend

# View backend logs only
docker-compose -f docker-compose.dev.yml logs -f backend
```

## 🔍 Troubleshooting

### **Common Issues**

#### **1. Port Already in Use**
```bash
# Check what's using the port
lsof -i :3000
lsof -i :3001
lsof -i :80

# Kill the process
kill -9 <PID>
```

#### **2. Docker Build Fails**
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

#### **3. Database Connection Issues**
```bash
# Check database container
docker-compose exec db psql -U postgres -d todo_app

# Check database logs
docker-compose logs db
```

#### **4. Frontend Not Loading**
```bash
# Check nginx configuration
docker-compose exec frontend nginx -t

# Check frontend logs
docker-compose logs frontend
```

#### **5. Backend API Not Responding**
```bash
# Check backend logs
docker-compose logs backend

# Test API directly
curl http://localhost:3000/health
```

### **Debug Commands**

```bash
# Enter container shell
docker-compose exec backend sh
docker-compose exec frontend sh
docker-compose exec db psql -U postgres

# View container resources
docker stats

# Check container details
docker inspect <container_name>

# View container processes
docker-compose exec backend ps aux
```

## 📊 Performance Optimization

### **Production Optimizations**

1. **Multi-stage Builds**: Separate build and runtime stages
2. **Layer Caching**: Optimize Docker layer order
3. **Nginx Caching**: Static file caching and compression
4. **Database Indexing**: Optimize PostgreSQL performance
5. **Resource Limits**: Set memory and CPU limits

### **Development Optimizations**

1. **Volume Mounting**: Source code mounted for hot reload
2. **Node Modules**: Preserved in named volumes
3. **Fast Refresh**: Vite HMR for instant updates
4. **Debug Mode**: Enhanced logging and error reporting

## 🔐 Security Considerations

### **Production Security**

1. **Environment Variables**: Sensitive data in .env files
2. **Network Isolation**: Services communicate via Docker network
3. **Nginx Security**: Security headers and SSL configuration
4. **Database Security**: PostgreSQL authentication and encryption
5. **JWT Secrets**: Strong, unique secrets for each environment

### **Development Security**

1. **Local Development**: Services isolated in development network
2. **Debug Mode**: Enhanced error reporting for development
3. **Hot Reload**: Secure file watching and reloading
4. **Database**: Local PostgreSQL with development credentials

## 🚀 Deployment Options

### **Local Development**
```bash
./scripts/dev.sh
```

### **Production Deployment**
```bash
./scripts/deploy.sh
```

### **Staging Environment**
```bash
# Create staging compose file
cp docker-compose.yml docker-compose.staging.yml
# Modify for staging environment
docker-compose -f docker-compose.staging.yml up -d
```

### **Cloud Deployment**
```bash
# AWS ECS
aws ecs create-service --cluster todo-cluster --service-name todo-service

# Google Cloud Run
gcloud run deploy todo-app --source .

# Azure Container Instances
az container create --resource-group todo-rg --name todo-app
```

## 📈 Monitoring

### **Health Checks**
- Frontend: http://localhost/health
- Backend: http://localhost:3000/health
- Database: PostgreSQL connection check

### **Logging**
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### **Metrics**
```bash
# Container resource usage
docker stats

# Service status
docker-compose ps

# Network connectivity
docker network ls
docker network inspect todo_network
```

## 🎯 Best Practices

### **Development**
1. Use development compose for local development
2. Enable hot reloading for both FE and BE
3. Use volume mounts for source code
4. Preserve node_modules in named volumes

### **Production**
1. Use multi-stage builds for smaller images
2. Implement proper health checks
3. Set resource limits and requests
4. Use environment-specific configurations
5. Implement proper logging and monitoring

### **Security**
1. Never commit secrets to version control
2. Use environment variables for configuration
3. Implement proper network isolation
4. Regular security updates for base images
5. Scan images for vulnerabilities

---

**🎉 Docker setup completed!** Your Team Todo Management System is now containerized and ready for development and production deployment. 