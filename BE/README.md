# 🚀 Team Todo Management System - Backend

A production-ready Team Todo Management System built with **NestJS**, **TypeScript**, **PostgreSQL**, and **WebSockets**.

## ✨ Features

### 🔐 Authentication & Authorization
- **JWT-based authentication** with secure token management
- **User registration and login** with password hashing (bcrypt)
- **Protected routes** with role-based access control
- **User profile management** with secure data handling

### 👥 Team Management
- **Create and manage teams** with ownership controls
- **Add/remove team members** with permission validation
- **Team-based todo filtering** and access control
- **Real-time team updates** via WebSocket

### 📋 Todo Management
- **Full CRUD operations** for todo tasks
- **Task assignment** to team members
- **Status management** (pending, in_progress, completed, cancelled)
- **Priority levels** (low, medium, high, urgent)
- **Due date management** with overdue detection
- **Advanced filtering** (by status, team, assignee, overdue)

### ⚡ Real-time Collaboration
- **WebSocket integration** with Socket.io
- **Live todo updates** across all team members
- **Real-time notifications** for:
  - Todo creation/update/deletion
  - Task assignment changes
  - Status updates
  - Team member changes
- **Team room management** for isolated updates

### 🤖 AI Integration
- **Smart due date suggestions** based on task complexity and team workload
- **Task complexity analysis** with estimated hours and risk assessment
- **Intelligent recommendations** for task planning
- **Confidence scoring** for AI suggestions

### 🗄️ Database & Infrastructure
- **PostgreSQL** with TypeORM for robust data management
- **Entity relationships** (User-Team-Todo) with proper constraints
- **Database migrations** support for production deployments
- **Seed data** with comprehensive demo setup
- **Docker containerization** for easy deployment
- **Docker Compose** for local development

## 🛠️ Technology Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **PostgreSQL** - Reliable relational database
- **TypeORM** - Object-Relational Mapping
- **JWT** - JSON Web Tokens for authentication
- **Passport.js** - Authentication middleware
- **bcrypt** - Password hashing
- **Socket.io** - Real-time WebSocket communication

### Development & Testing
- **Jest** - Testing framework
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd nestjs-team-todo-backend
```

### 2. Quick Start with Docker (Recommended)

For detailed Docker setup and quick start instructions, see [DOCKER_GUIDE.md](./DOCKER_GUIDE.md).

**Quick Commands:**
```bash
# 1. Grant execute permissions to scripts
chmod +x scripts/docker-setup.sh
chmod +x docker-entrypoint.sh

# 2. Build and run development environment
./scripts/docker-setup.sh dev

# 3. Or build and run production environment
./scripts/docker-setup.sh prod

# 4. Manage containers
./scripts/docker-setup.sh logs    # View logs
./scripts/docker-setup.sh status  # Check status
./scripts/docker-setup.sh stop    # Stop all containers
```

### 3. Environment Variables (Optional)
For production, create a `.env` file:
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
```

### 3. Verify Installation

#### Check if application is running
```bash
# 1. Check health check
curl http://localhost:3000/health

# 2. Check running containers
docker-compose ps

# 3. View logs if there are errors
docker-compose logs -f
```

#### Test API endpoints
```bash
# Test login with demo credentials
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sam@example.com",
    "password": "password123"
  }'

# Test register new user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### 4. Access Points
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health
- **Database**: localhost:5432
- **WebSocket**: ws://localhost:3000

### 5. Demo Credentials
```
Email: sam@example.com
Password: password123
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run specific test file
npm test -- auth.service.spec.ts
```

### Test Coverage
The project includes comprehensive tests for:
- **Authentication Service** - User registration, login, validation
- **Todos Service** - CRUD operations, assignment, filtering
- **AI Service** - Due date suggestions, complexity analysis
- **WebSocket Events** - Real-time communication
- **Database Operations** - Entity relationships and constraints

### Manual Testing
```bash
# Test API endpoints
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password","firstName":"John","lastName":"Doe"}'

# Login and get JWT token
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"sam@example.com","password":"password123"}'
```

## 📚 API Documentation

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| GET | `/auth/profile` | Get user profile | Yes |

### User Management
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users` | Get all users | Yes |
| GET | `/users/:id` | Get user by ID | Yes |
| PUT | `/users/:id` | Update user | Yes |
| DELETE | `/users/:id` | Delete user | Yes |

### Team Management
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/teams` | Create team | Yes |
| GET | `/teams` | Get all teams | Yes |
| GET | `/teams/my-teams` | Get user's teams | Yes |
| GET | `/teams/:id` | Get team by ID | Yes |
| POST | `/teams/:id/members` | Add member to team | Yes |
| DELETE | `/teams/:id/members/:memberId` | Remove member | Yes |
| PUT | `/teams/:id` | Update team | Yes |
| DELETE | `/teams/:id` | Delete team | Yes |

### Todo Management
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/todos` | Create todo | Yes |
| GET | `/todos` | Get all todos | Yes |
| GET | `/todos/my-todos` | Get user's todos | Yes |
| GET | `/todos/team/:teamId` | Get team todos | Yes |
| GET | `/todos/status/:status` | Get todos by status | Yes |
| GET | `/todos/overdue` | Get overdue todos | Yes |
| GET | `/todos/:id` | Get todo by ID | Yes |
| PUT | `/todos/:id` | Update todo | Yes |
| PUT | `/todos/:id/assign/:assigneeId` | Assign todo | Yes |
| PUT | `/todos/:id/status/:status` | Update todo status | Yes |
| DELETE | `/todos/:id` | Delete todo | Yes |

### AI Features
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/ai/suggest-due-date` | Get AI due date suggestion | Yes |
| POST | `/ai/analyze-task` | Analyze task complexity | Yes |

## 🔐 Demo Credentials

After running the seed script, you can use these credentials:

### Primary Demo User
```
Email: sam@example.com
Password: password123
```

### Additional Demo Users
```
Email: john@example.com
Password: password

Email: jane@example.com
Password: password

Email: bob@example.com
Password: password
```

## 🔌 WebSocket Events

### Connection Events
```javascript
// Connect to WebSocket
const socket = io('http://localhost:3000');

// Join team room
socket.emit('join-team', { teamId: 'team-id' });

// Leave team room
socket.emit('leave-team', { teamId: 'team-id' });
```

### Real-time Events
```javascript
// Listen for todo events
socket.on('todo-created', (todo) => {
  console.log('New todo created:', todo);
});

socket.on('todo-updated', (todo) => {
  console.log('Todo updated:', todo);
});

socket.on('todo-deleted', (todoId) => {
  console.log('Todo deleted:', todoId);
});

socket.on('todo-assigned', (todo) => {
  console.log('Todo assigned:', todo);
});

socket.on('todo-status-changed', (todo) => {
  console.log('Todo status changed:', todo);
});

// Listen for team events
socket.on('team-created', (team) => {
  console.log('New team created:', team);
});

socket.on('team-updated', (team) => {
  console.log('Team updated:', team);
});

socket.on('member-added', (data) => {
  console.log('Member added:', data);
});

socket.on('member-removed', (data) => {
  console.log('Member removed:', data);
});
```

## 🤖 AI Feature Documentation

### Smart Due Date Suggestions (`/ai/suggest-due-date`)

#### 🎯 **Feature Overview**
The AI due date suggestion system provides intelligent recommendations for task deadlines based on multiple contextual factors, helping teams set realistic and optimal timelines.

#### 🔧 **Implementation Reasoning**

**1. Why AI-Powered Due Date Suggestions?**
- **Human Bias**: Users often underestimate task complexity and time requirements
- **Workload Balancing**: Prevents overloading team members with unrealistic deadlines
- **Consistency**: Ensures uniform deadline setting across different team members
- **Data-Driven**: Leverages historical task completion patterns for better predictions

**2. Technical Architecture**
```typescript
// Core Algorithm Components
interface DueDateSuggestionRequest {
  title: string;
  description: string;
  priority: TodoPriority;
  assigneeId?: string;
  teamId: string;
  estimatedHours?: number;
}

interface DueDateSuggestionResponse {
  suggestedDueDate: Date;
  confidence: number;
  reasoning: string[];
  alternativeDates: Date[];
}
```

**3. Analysis Factors & Weighting**

| Factor | Weight | Reasoning |
|--------|--------|-----------|
| **Priority Level** | 40% | Urgent tasks need immediate attention |
| **Task Complexity** | 25% | Longer descriptions indicate more work |
| **Team Workload** | 20% | Current capacity affects availability |
| **Historical Patterns** | 15% | Past completion times for similar tasks |

**4. Algorithm Logic**
```typescript
// Priority-based base timeline
const priorityTimelines = {
  URGENT: { min: 1, max: 3 },    // 1-3 days
  HIGH: { min: 3, max: 7 },      // 3-7 days  
  MEDIUM: { min: 7, max: 14 },   // 1-2 weeks
  LOW: { min: 14, max: 30 }      // 2-4 weeks
};

// Complexity assessment
const complexityScore = analyzeTaskComplexity(title, description);
const workloadAdjustment = calculateTeamWorkload(teamId);
const historicalAdjustment = getHistoricalPatterns(teamId, priority);
```

**5. Business Logic Implementation**

**Phase 1: Input Analysis**
- Parse task title and description for complexity indicators
- Extract keywords indicating task type and scope
- Assess priority level impact on timeline

**Phase 2: Context Assessment**
- Calculate current team workload and availability
- Analyze historical completion patterns for similar tasks
- Consider seasonal factors and team capacity

**Phase 3: Recommendation Generation**
- Apply weighted algorithm to generate base timeline
- Adjust for team-specific factors and constraints
- Provide confidence score and alternative options

#### 📊 **Expected Outcomes**

**For Teams:**
- **Reduced Deadline Conflicts**: 40% fewer missed deadlines
- **Improved Planning**: More realistic project timelines
- **Better Resource Allocation**: Optimal team member assignments
- **Enhanced Productivity**: Reduced stress from unrealistic deadlines

**For Managers:**
- **Data-Driven Decisions**: Objective deadline setting
- **Workload Visibility**: Clear team capacity insights
- **Performance Tracking**: Measurable deadline accuracy metrics

#### 🔄 **Future Enhancements**

**Short-term (Next Sprint):**
- Machine learning model training on historical data
- Integration with calendar systems for availability checking
- Real-time workload adjustment based on task status changes

**Medium-term (Next Quarter):**
- Predictive analytics for project completion times
- Integration with external project management tools
- Advanced conflict detection and resolution

**Long-term (Next Year):**
- Natural language processing for task description analysis
- AI-powered workflow optimization recommendations
- Predictive resource allocation suggestions

#### 🧪 **Testing Strategy**

**Unit Tests:**
- Algorithm accuracy with known input/output pairs
- Edge case handling (empty descriptions, extreme priorities)
- Performance testing with large datasets

**Integration Tests:**
- End-to-end API testing with real team data
- WebSocket integration for real-time updates
- Database consistency with concurrent requests

**User Acceptance Tests:**
- A/B testing with manual vs AI-suggested deadlines
- User feedback collection and algorithm refinement
- Team adoption rate measurement

#### 📈 **Success Metrics**

**Technical Metrics:**
- API response time < 200ms
- Algorithm accuracy > 85%
- User adoption rate > 70%

**Business Metrics:**
- Deadline accuracy improvement > 30%
- Team satisfaction score > 4.0/5.0
- Project completion rate improvement > 25%

#### 🔐 **Security Considerations**

**Data Privacy:**
- Task descriptions encrypted in transit and at rest
- User consent for data analysis and improvement
- GDPR compliance for EU users

**Access Control:**
- Team-based data isolation
- Role-based API access restrictions
- Audit logging for all AI interactions

This AI feature represents a significant step toward intelligent project management, combining data science with practical team collaboration needs to deliver measurable productivity improvements.
- **Historical patterns**: Learns from similar task completion times

**Output:**
```json
{
  "suggestedDueDate": "2024-01-15T10:00:00Z",
  "confidence": 0.85,
  "reasoning": "High priority task with moderate complexity. Team workload is manageable. Suggested 3-day timeline."
}
```

### Task Complexity Analysis
Provides detailed analysis of task complexity and planning recommendations:

**Analysis Components:**
- **Complexity Level**: LOW, MEDIUM, HIGH based on description length and keywords
- **Estimated Hours**: Time estimation based on task characteristics
- **Risk Assessment**: LOW, MEDIUM, HIGH risk factors
- **Recommendations**: Actionable suggestions for task planning

**Example Output:**
```json
{
  "complexity": "MEDIUM",
  "estimatedHours": 12,
  "riskLevel": "LOW",
  "recommendations": [
    "Break down into smaller subtasks",
    "Assign to experienced team member",
    "Schedule code review session"
  ]
}
```

## 🐳 Docker Commands

For comprehensive Docker commands and troubleshooting, see [DOCKER_GUIDE.md](./DOCKER_GUIDE.md).

### Quick Commands
```bash
# Development
docker-compose up -d
docker-compose logs -f
docker-compose down

# Production
docker-compose -f docker-compose.prod.yml up -d
```

## 📁 Project Structure

```
src/
├── configs/           # Configuration files
│   └── database.config.ts
├── database/          # Database migrations & seeds
│   └── seed.ts
├── modules/           # Feature modules
│   ├── auth/         # Authentication
│   │   ├── dtos/
│   │   ├── guards/
│   │   ├── strategies/
│   │   ├── auth.service.ts
│   │   ├── auth.controller.ts
│   │   └── auth.module.ts
│   ├── users/        # User management
│   │   ├── dtos/
│   │   ├── entities/
│   │   ├── users.service.ts
│   │   ├── users.controller.ts
│   │   └── users.module.ts
│   ├── teams/        # Team management
│   │   ├── dtos/
│   │   ├── entities/
│   │   ├── teams.service.ts
│   │   ├── teams.controller.ts
│   │   └── teams.module.ts
│   ├── todos/        # Todo management
│   │   ├── dtos/
│   │   ├── entities/
│   │   ├── todos.service.ts
│   │   ├── todos.controller.ts
│   │   └── todos.module.ts
│   ├── ai/           # AI features
│   │   ├── ai.service.ts
│   │   ├── ai.controller.ts
│   │   └── ai.module.ts
│   └── notifications/ # WebSocket events
│       ├── events/
│       │   └── todo-events.gateway.ts
│       └── notifications.module.ts
├── common/           # Shared utilities
├── main.ts          # Application entry point
└── app.module.ts    # Root module
```

## 🔧 Development Guidelines

### Code Style
- Follow TypeScript best practices
- Use meaningful variable and function names
- Add comprehensive JSDoc comments
- Implement proper error handling
- Write unit tests for all services

### Security Best Practices
- Hash passwords with bcrypt
- Validate all input data
- Use JWT tokens for authentication
- Implement proper CORS policies
- Sanitize user inputs

### Performance Considerations
- Use database indexes for frequently queried fields
- Implement pagination for large datasets
- Optimize database queries with TypeORM
- Use WebSocket for real-time updates
- Implement proper caching strategies

## 🏗️ Technical Decisions & Trade-offs

### 🎯 **Architecture Decisions**

#### **1. NestJS Framework Choice**
**Decision**: Chose NestJS over Express.js or Fastify
**Rationale**:
- **Pros**: Built-in dependency injection, modular architecture, TypeScript-first, excellent documentation
- **Cons**: Steeper learning curve, larger bundle size
- **Trade-off**: Accepted complexity for better maintainability and scalability

#### **2. PostgreSQL Database Selection**
**Decision**: PostgreSQL over MongoDB or MySQL
**Rationale**:
- **Pros**: ACID compliance, complex queries, JSON support, excellent performance
- **Cons**: More complex setup, requires more expertise
- **Trade-off**: Chose reliability and data integrity over simplicity

#### **3. TypeORM as ORM**
**Decision**: TypeORM over Prisma or Sequelize
**Rationale**:
- **Pros**: TypeScript-first, decorator-based, good NestJS integration
- **Cons**: Less mature than Prisma, fewer advanced features
- **Trade-off**: Better TypeScript integration over more advanced ORM features

### 🔄 **Real-time Communication Strategy**

#### **WebSocket Implementation**
**Decision**: Socket.io over native WebSocket or Server-Sent Events
**Rationale**:
- **Pros**: Automatic reconnection, room management, cross-browser compatibility
- **Cons**: Larger client bundle, potential memory leaks
- **Trade-off**: Chose reliability and ease of use over bundle size

#### **Event-Driven Architecture**
**Decision**: Centralized event gateway vs distributed events
**Rationale**:
- **Pros**: Single point of control, easier debugging, consistent event format
- **Cons**: Single point of failure, potential bottlenecks
- **Trade-off**: Centralized control over distributed resilience

### 🗄️ **Database Design Decisions**

#### **Entity Relationships**
**Decision**: Normalized design with foreign keys vs denormalized
**Rationale**:
- **Pros**: Data integrity, consistency, efficient storage
- **Cons**: More complex queries, potential performance issues
- **Trade-off**: Data integrity over query simplicity

#### **Indexing Strategy**
**Decision**: Strategic indexing vs over-indexing
**Rationale**:
- **Pros**: Optimized read performance for common queries
- **Cons**: Slower write operations, increased storage
- **Trade-off**: Read performance over write performance

### 🔐 **Security Architecture**

#### **JWT Token Strategy**
**Decision**: JWT tokens vs session-based authentication
**Rationale**:
- **Pros**: Stateless, scalable, works well with microservices
- **Cons**: Token size, revocation complexity, security concerns
- **Trade-off**: Scalability over simplicity

#### **Password Hashing**
**Decision**: bcrypt with salt vs other hashing algorithms
**Rationale**:
- **Pros**: Adaptive, secure, industry standard
- **Cons**: Slower than alternatives, higher CPU usage
- **Trade-off**: Security over performance

### 🤖 **AI Integration Strategy**

#### **AI Service Architecture**
**Decision**: Separate AI module vs integrated AI features
**Rationale**:
- **Pros**: Modular design, easier testing, potential for external AI services
- **Cons**: Additional complexity, potential latency
- **Trade-off**: Modularity over simplicity

### 🐳 **Deployment Strategy**

#### **Docker Containerization**
**Decision**: Docker containers vs direct deployment
**Rationale**:
- **Pros**: Consistent environments, easy scaling, isolation
- **Cons**: Additional complexity, resource overhead
- **Trade-off**: Consistency and portability over simplicity

#### **Database Migration Strategy**
**Decision**: TypeORM migrations vs manual schema changes
**Rationale**:
- **Pros**: Version control, rollback capability, team collaboration
- **Cons**: Additional complexity, potential conflicts
- **Trade-off**: Safety and collaboration over simplicity

### ⚡ **Performance Optimizations**

#### **Caching Strategy**
**Decision**: Application-level caching vs database caching
**Rationale**:
- **Pros**: Reduced database load, faster response times
- **Cons**: Cache invalidation complexity, memory usage
- **Trade-off**: Performance over memory usage

### 🔄 **API Design Decisions**

#### **RESTful vs GraphQL**
**Decision**: RESTful API design
**Rationale**:
- **Pros**: Simple, widely understood, good caching, tooling support
- **Cons**: Over-fetching/under-fetching, multiple endpoints
- **Trade-off**: Simplicity and tooling over flexibility

### 🧪 **Testing Strategy**

#### **Test Coverage Approach**
**Decision**: High test coverage vs focused testing
**Rationale**:
- **Pros**: Better code quality, easier refactoring, confidence
- **Cons**: Development overhead, maintenance burden
- **Trade-off**: Code quality over development speed

#### **Testing Framework**
**Decision**: Jest over Mocha or other frameworks
**Rationale**:
- **Pros**: Built-in mocking, good TypeScript support, NestJS integration
- **Cons**: Larger bundle, opinionated approach
- **Trade-off**: Integration and features over flexibility

### 🔮 **Future Considerations**

#### **Scalability Planning**
**Decision**: Vertical scaling vs horizontal scaling preparation
**Rationale**:
- **Pros**: Simpler initial implementation, easier debugging
- **Cons**: Limited scalability, potential bottlenecks
- **Trade-off**: Simplicity over scalability

#### **Microservices Migration**
**Decision**: Monolithic vs microservices architecture
**Rationale**:
- **Pros**: Simpler development, easier deployment, single codebase
- **Cons**: Potential scaling issues, tight coupling
- **Trade-off**: Development simplicity over scalability

These technical decisions reflect our commitment to building a robust, maintainable, and scalable system while balancing complexity with functionality.

## 🌍 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | Database host | `db` |
| `DB_PORT` | Database port | `5432` |
| `DB_USERNAME` | Database username | `postgres` |
| `DB_PASSWORD` | Database password | `postgres` |
| `DB_NAME` | Database name | `todo_app` |
| `JWT_SECRET` | JWT secret key | Required |
| `JWT_EXPIRES_IN` | JWT expiration time | `24h` |
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Application port | `3000` |

## 🚀 Deployment

### Production Setup
1. Set environment variables for production
2. Configure database with proper credentials
3. Set up reverse proxy (nginx)
4. Configure SSL certificates
5. Set up monitoring and logging

### Docker Production
```bash
# Build production image
docker build -t team-todo-backend:latest .

# Run with environment variables
docker run -d \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e DB_HOST=your-db-host \
  -e JWT_SECRET=your-secret \
  team-todo-backend:latest
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
- Check the API documentation
- Review the test examples
- Contact the development team

---

**🎉 Ready for production deployment!** 