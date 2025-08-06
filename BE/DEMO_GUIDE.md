# 🎯 Demo Guide - Team Todo Management System

## 📋 Demo Overview

This guide demonstrates a **new user experience** scenario where a fresh user (David) joins an existing team and collaborates with existing members (Sam) through real-time features and AI-powered task management.

## 🎪 Demo Flow: New User Experience (20-25 minutes)

### 🎯 **Demo Scenario: David joins Sam's team**
**Objective**: Demonstrate how a new user (David) registers, gets invited to an existing team, receives task assignments, and collaborates with team members through real-time features and AI assistance.

---

### 🟩 **Step 1: Sam's Existing Team (2 minutes)**
**Sam (existing user) logs in and shows his team setup**

```bash
# 1. Sam logs in (existing user from seed data)
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sam@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "user": {
    "id": "user-id",
    "email": "sam@example.com",
    "firstName": "Sam",
    "lastName": "Jose"
  },
  "access_token": "jwt-token-here"
}
```

```bash
# 2. Sam views his existing teams
curl -X GET http://localhost:3000/teams/my-teams \
  -H "Authorization: Bearer SAM_JWT_TOKEN"
```

**Expected Response:**
```json
[
  {
    "id": "team-id",
    "name": "Development Team",
    "description": "Main development team for the project",
    "owner": { "id": "sam-id", "email": "sam@example.com" },
    "members": [
      { "id": "john-id", "email": "john@example.com" },
      { "id": "jane-id", "email": "jane@example.com" }
    ]
  }
]
```

```bash
# 3. Sam views existing todos in his team
curl -X GET http://localhost:3000/todos/team/TEAM_ID \
  -H "Authorization: Bearer SAM_JWT_TOKEN"
```

**Key Points to Highlight:**
- ✅ Sam has existing team with members
- ✅ Team has existing todos
- ✅ Real-time WebSocket connection ready
- ✅ AI features available for task management

---

### 🟦 **Step 2: David (New User) Registration (3 minutes)**
**David registers as a new user**

```bash
# 1. David registers new account
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "david@example.com",
    "password": "Password123456",
    "firstName": "David",
    "lastName": "Wilson"
  }'
```

**Expected Response:**
```json
{
  "user": {
    "id": "david-user-id",
    "email": "david@example.com",
    "firstName": "David",
    "lastName": "Wilson"
  },
  "access_token": "david-jwt-token"
}
```

```bash
# 2. David logs in with new account
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "david@example.com",
    "password": "Password123456"
  }'
```

```bash
# 3. David checks his teams (should be empty initially)
curl -X GET http://localhost:3000/teams/my-teams \
  -H "Authorization: Bearer DAVID_JWT_TOKEN"
```

**Expected Response:**
```json
[]  // Empty array - David has no teams yet
```

**Key Points to Highlight:**
- ✅ New user registration successful
- ✅ JWT token generated for authentication
- ✅ David starts with no teams
- ✅ Ready for team invitation

---

### 🟨 **Step 3: Sam Invites David to Team (3 minutes)**
**Sam adds David to his Development Team**

```bash
# 1. Sam adds David to Development Team
curl -X POST http://localhost:3000/teams/TEAM_ID/members \
  -H "Authorization: Bearer SAM_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "david@example.com"
  }'
```

**Expected Response:**
```json
{
  "id": "team-id",
  "name": "Development Team",
  "description": "Main development team for the project",
  "members": [
    { "id": "john-id", "email": "john@example.com" },
    { "id": "jane-id", "email": "jane@example.com" },
    { "id": "david-id", "email": "david@example.com" }  // David added
  ]
}
```

```bash
# 2. Sam verifies David is now in team
curl -X GET http://localhost:3000/teams/TEAM_ID \
  -H "Authorization: Bearer SAM_JWT_TOKEN"
```

**Key Points to Highlight:**
- ✅ User verification before adding to team
- ✅ Real-time team member update
- ✅ Permission validation (only team owner/members can add)
- ✅ WebSocket notification to team members

---

### 🟧 **Step 4: David Sees Team and Tasks (2 minutes)**
**David now has access to team and can view tasks**

```bash
# 1. David checks his teams (should now see Development Team)
curl -X GET http://localhost:3000/teams/my-teams \
  -H "Authorization: Bearer DAVID_JWT_TOKEN"
```

**Expected Response:**
```json
[
  {
    "id": "team-id",
    "name": "Development Team",
    "description": "Main development team for the project",
    "owner": { "id": "sam-id", "email": "sam@example.com" },
    "members": [
      { "id": "john-id", "email": "john@example.com" },
      { "id": "jane-id", "email": "jane@example.com" },
      { "id": "david-id", "email": "david@example.com" }
    ]
  }
]
```

```bash
# 2. David views team todos
curl -X GET http://localhost:3000/todos/team/TEAM_ID \
  -H "Authorization: Bearer DAVID_JWT_TOKEN"
```

**Expected Response:**
```json
[
  {
    "id": "todo-1",
    "title": "Setup project structure",
    "description": "Initialize the project with proper folder structure and configuration",
    "status": "pending",
    "priority": "high",
    "dueDate": "2024-01-15T10:00:00Z",
    "assigneeId": "john-user-id",
    "createdById": "sam-user-id"
  }
  // ... other existing todos
]
```

**Key Points to Highlight:**
- ✅ David now sees the team he was invited to
- ✅ David can view all team todos (existing todos from seed data)
- ✅ David can see team collaboration in action
- ✅ Real-time access to team data

---

### 🟨 **Step 5: Sam Creates Task for David (2 minutes)**
**Sam creates a new task and assigns it to David**

```bash
# 1. Sam creates a new task and assigns it to David
curl -X POST http://localhost:3000/todos \
  -H "Authorization: Bearer SAM_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Review authentication implementation",
    "description": "Review and test the JWT authentication system implementation",
    "dueDate": "2025-08-20T10:00:00Z",
    "priority": "medium",
    "teamId": "TEAM_ID",
    "assigneeId": "DAVID_USER_ID"
  }'
```

**Expected Response:**
```json
{
  "id": "new-task-id",
  "title": "Review authentication implementation",
  "description": "Review and test the JWT authentication system implementation",
  "status": "pending",
  "priority": "medium",
  "dueDate": "2024-01-20T10:00:00Z",
  "teamId": "TEAM_ID",
  "assigneeId": "DAVID_USER_ID",
  "createdById": "SAM_USER_ID"
}
```

**Key Points to Highlight:**
- ✅ Sam can assign tasks to any team member
- ✅ Task creation with proper team context
- ✅ Real-time notification to David via WebSocket
- ✅ Task assignment workflow

---

### 🟧 **Step 6: David Sees His Assigned Tasks (2 minutes)**
**David now sees tasks assigned specifically to him**

```bash
# 1. David views tasks assigned to him
curl -X GET http://localhost:3000/todos/my-todos \
  -H "Authorization: Bearer DAVID_JWT_TOKEN"
```

**Expected Response:**
```json
[
  {
    "id": "new-task-id",
    "title": "Review authentication implementation",
    "description": "Review and test the JWT authentication system implementation",
    "status": "pending",
    "priority": "medium",
    "dueDate": "2024-01-20T10:00:00Z",
    "teamId": "TEAM_ID",
    "assigneeId": "DAVID_USER_ID",
    "createdById": "SAM_USER_ID"
  }
]
```

**Key Points to Highlight:**
- ✅ David now sees tasks assigned specifically to him
- ✅ Task assignment system working correctly
- ✅ David can filter his own tasks
- ✅ Real-time task assignment notification

---

### 🟪 **Step 7: David Creates Task with AI Assistance (4 minutes)**
**David creates a new task using AI for deadline suggestions**

```bash
# 1. David uses AI to get deadline suggestion
curl -X POST http://localhost:3000/ai/suggest-due-date \
  -H "Authorization: Bearer DAVID_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Implement user authentication",
    "description": "Build JWT-based authentication system with role-based access control",
    "priority": "high",
    "teamWorkload": 3
  }'
```

**Expected Response:**
```json
{
  "suggestedDueDate": "2024-01-15T10:00:00Z",
  "confidence": 0.85,
  "reasoning": "High priority task with moderate complexity. Team workload is manageable. Suggested 3-day timeline."
}
```

```bash
# 2. David creates new todo with AI-suggested deadline
curl -X POST http://localhost:3000/todos \
  -H "Authorization: Bearer DAVID_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Implement user authentication",
    "description": "Build JWT-based authentication system with role-based access control",
    "dueDate": "2025-08-20T10:00:00Z",
    "priority": "high",
    "teamId": "TEAM_ID",
    "assigneeId": "SAM_USER_ID"
  }'
```

**Expected Response:**
```json
{
  "id": "new-todo-id",
  "title": "Implement user authentication",
  "description": "Build JWT-based authentication system with role-based access control",
  "dueDate": "2025-08-20T10:00:00Z",
  "priority": "high",
  "status": "pending",
  "teamId": "TEAM_ID",
  "assigneeId": "SAM_USER_ID",
  "createdById": "DAVID_USER_ID"
}
```

**Key Points to Highlight:**
- ✅ AI analyzes task complexity and priority
- ✅ Smart deadline suggestions based on team workload
- ✅ David can assign tasks to any team member
- ✅ Task creation with proper team context

---

### 🟫 **Step 8: Real-time Collaboration Demo (3 minutes)**
**Sam sees David's new task in real-time via WebSocket**

**WebSocket Connection Setup:**
```javascript
// Sam's browser connects to WebSocket
const socket = io('http://localhost:3000');

// Sam joins his team room
socket.emit('join-team', { teamId: 'TEAM_ID' });

// Sam listens for real-time updates
socket.on('todo-created', (todo) => {
  console.log('New todo created:', todo);
  // Update UI to show new task
});

socket.on('todo-updated', (todo) => {
  console.log('Todo updated:', todo);
  // Update UI to reflect changes
});
```

**Real-time Test Scenarios:**

```bash
# 1. David updates task status
curl -X PUT http://localhost:3000/todos/TODO_ID/status/in_progress \
  -H "Authorization: Bearer DAVID_JWT_TOKEN"
```

```bash
# 2. David assigns task to different team member
curl -X PUT http://localhost:3000/todos/TODO_ID/assign/JANE_USER_ID \
  -H "Authorization: Bearer DAVID_JWT_TOKEN"
```

**Expected Real-time Events:**
```javascript
// Sam receives these events instantly:
{
  "type": "todo-status-changed",
  "data": {
    "id": "todo-id",
    "status": "IN_PROGRESS",
    "updatedBy": "david@example.com"
  }
}

{
  "type": "todo-assigned",
  "data": {
    "id": "todo-id",
    "assigneeId": "jane-user-id",
    "assignee": { "email": "jane@example.com" }
  }
}
```

**Key Points to Highlight:**
- ✅ Instant real-time updates across all team members
- ✅ WebSocket room management for team isolation
- ✅ Event-driven architecture
- ✅ Live collaboration capabilities
- ✅ No page refresh needed

---


## 🎯 Demo Credentials

### **Existing Users (Seed Data)**
```
Sam (Team Owner):
Email: sam@example.com
Password: password123

John (Team Member):
Email: john@example.com
Password: password

Jane (Team Member):
Email: jane@example.com
Password: password

Bob (Team Member):
Email: bob@example.com
Password: password
```

### **New User (For Registration Demo)**
```
David (New User):
Email: david@example.com
Password: 123456
FirstName: David
LastName: Wilson
``` 