# hoangph24-team-todo-management-system

A full-stack web application for collaborative task management built with React, NestJS, and PostgreSQL. Features real-time updates, user authentication, AI-powered features, and Docker containerization for both development and production environments.

## 📋 Project Overview

This is a comprehensive team todo management system that enables teams to collaborate on tasks with real-time updates, AI-powered features, and robust user management. The application is built with modern technologies and follows best practices for scalability and maintainability.

## 🏗️ Architecture

The project follows a microservices-like architecture with separate frontend and backend applications:

- **Frontend (FE/)**: React-based SPA with Material-UI, Redux Toolkit, and real-time WebSocket communication
- **Backend (BE/)**: NestJS API with PostgreSQL, JWT authentication, and WebSocket support

## 📁 Project Structure

```
hoangph24-team-todo-management-system/
├── BE/                    # Backend application (NestJS)
│   ├── src/              # Source code
│   ├── database/         # Database migrations and seeds
│   ├── scripts/          # Docker and deployment scripts
│   ├── README.md         # Backend documentation
│   └── ...
├── FE/                    # Frontend application (React)
│   ├── src/              # Source code
│   ├── components/       # React components
│   ├── pages/           # Page components
│   ├── store/           # Redux store
│   ├── services/        # API services
│   ├── README.md        # Frontend documentation
│   └── ...
├── scripts/              # Global deployment scripts
└── README.md            # This file
```

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js (for local development)
- Git

### Option 1: Docker Setup (Recommended)

1. **Clone the repository:**
```bash
git clone <repository-url>
cd hoangph24-team-todo-management-system
```

2. **Start the entire application:**
```bash
# Start both frontend and backend with Docker
docker-compose up -d
```

3. **Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Health Check: http://localhost:3001/health

### Option 2: Local Development

1. **Backend Setup:**
```bash
cd BE
npm install
npm run start:dev
```

2. **Frontend Setup:**
```bash
cd FE
npm install
npm run dev
```

## 🎯 Key Features

### 🔐 Authentication & Security
- JWT-based authentication
- User registration and login
- Password hashing with bcrypt
- Protected routes and role-based access

### 👥 Team Management
- Create and manage teams
- Add/remove team members
- Team-based todo filtering
- Real-time team updates

### 📋 Todo Management
- Full CRUD operations for tasks
- Task assignment to team members
- Status management (pending, in_progress, completed, cancelled)
- Priority levels (low, medium, high, urgent)
- Due date management with overdue detection
- Advanced filtering and search

### 🤖 AI-Powered Features
- Smart due date suggestions
- Task complexity analysis
- Intelligent recommendations
- Conflict detection and resolution

### ⚡ Real-time Collaboration
- WebSocket integration with Socket.io
- Live todo updates across all team members
- Real-time notifications
- Team room management

### 🐳 Docker Support
- Containerized development environment
- Production-ready Docker configurations
- Easy deployment with Docker Compose

## 📚 Documentation

For detailed documentation, please refer to the specific README files:

- **[Backend Documentation](./BE/README.md)** - Complete backend setup, API documentation, and technical details
- **[Frontend Documentation](./FE/README.md)** - Frontend setup, features, and development guidelines

## 🔧 Technology Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **PostgreSQL** - Reliable relational database
- **TypeORM** - Object-Relational Mapping
- **JWT** - JSON Web Tokens for authentication
- **Socket.io** - Real-time WebSocket communication

### Frontend
- **React 18** - Latest React version with concurrent features
- **TypeScript** - Type safety
- **Material-UI** - UI component library
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Socket.io Client** - Real-time communication
- **Vite** - Fast build tool

### Development & Deployment
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Jest** - Testing framework
- **ESLint** - Code linting

## 🧪 Testing

### Backend Testing
```bash
cd BE
npm test
npm run test:cov
```

### Frontend Testing
```bash
cd FE
npm test
```

## 🚀 Deployment

### Production Deployment
```bash
# Using Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

### Development Deployment
```bash
# Using Docker Compose
docker-compose -f docker-compose.dev.yml up -d
```

## 🔐 Demo Credentials

After running the seed script, you can use these credentials:

```
Email: sam@example.com
Password: password123
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the specific documentation files:
  - [Backend Documentation](./BE/README.md)
  - [Frontend Documentation](./FE/README.md)
- Contact the development team

---

**🎉 Ready for production deployment!**
