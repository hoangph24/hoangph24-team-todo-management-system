import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../modules/users/users.service';
import { TeamsService } from '../modules/teams/teams.service';
import { TodosService } from '../modules/todos/todos.service';
import { CreateUserDto } from '../modules/users/dtos/create-user.dto';
import { CreateTeamDto } from '../modules/teams/dtos/create-team.dto';
import { CreateTodoDto } from '../modules/todos/dtos/create-todo.dto';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const usersService = app.get(UsersService);
  const teamsService = app.get(TeamsService);
  const todosService = app.get(TodosService);

  try {
    console.log('🌱 Starting database seeding...');

    // Create demo users
    const demoUsers = [
      {
        email: 'sam@example.com',
        password: 'password123',
        firstName: 'Sam',
        lastName: 'Jose',
      },
      {
        email: 'john@example.com',
        password: 'password',
        firstName: 'John',
        lastName: 'Doe',
      },
      {
        email: 'jane@example.com',
        password: 'password',
        firstName: 'Jane',
        lastName: 'Smith',
      },
      {
        email: 'bob@example.com',
        password: 'password',
        firstName: 'Bob',
        lastName: 'Johnson',
      },
    ];

    const createdUsers = [];
    for (const userData of demoUsers) {
      try {
        const user = await usersService.create(userData as CreateUserDto);
        createdUsers.push(user);
        console.log(`Created user: ${user.email}`);
      } catch (error) {
        if (error.message.includes('already exists')) {
          const existingUser = await usersService.findByEmail(userData.email);
          createdUsers.push(existingUser);
          console.log(`User already exists: ${userData.email}`);
        } else {
          console.error(`Error creating user ${userData.email}:`, error.message);
        }
      }
    }

    // Create demo teams
    const demoTeams = [
      {
        name: 'Development Team',
        description: 'Main development team for the project',
      },
      {
        name: 'Design Team',
        description: 'UI/UX design team',
      },
      {
        name: 'Marketing Team',
        description: 'Marketing and promotion team',
      },
    ];

    const createdTeams = [];
    for (const teamData of demoTeams) {
      try {
        // Ensure we have a valid user to be the owner
        if (createdUsers.length === 0) {
          console.error('No users created, cannot create teams');
          return;
        }
        
        const owner = createdUsers[0]; // sam@example.com user
        console.log(`Creating team '${teamData.name}' with owner: ${owner.email}`);
        
        const team = await teamsService.create(teamData as CreateTeamDto, owner.id);
        createdTeams.push(team);
        console.log(`✅ Created team: ${team.name} (Owner: ${owner.email})`);
      } catch (error) {
        console.error(`❌ Error creating team ${teamData.name}:`, error.message);
      }
    }

    // Add members to teams
    if (createdTeams.length > 0 && createdUsers.length > 1) {
      try {
        const owner = createdUsers[0]; // sam@example.com user
        
        // Add John to Development Team
        await teamsService.addMember(createdTeams[0].id, { email: 'john@example.com' }, owner.id);
        console.log('✅ Added John to Development Team');

        // Add Jane to Development Team
        await teamsService.addMember(createdTeams[0].id, { email: 'jane@example.com' }, owner.id);
        console.log('✅ Added Jane to Development Team');

        // Add Bob to Design Team
        await teamsService.addMember(createdTeams[1].id, { email: 'bob@example.com' }, owner.id);
        console.log('✅ Added Bob to Design Team');
      } catch (error) {
        console.error('❌ Error adding team members:', error.message);
      }
    }

    // Create demo todos
    const demoTodos = [
      {
        title: 'Setup project structure',
        description: 'Initialize the project with proper folder structure and configuration',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
        teamId: createdTeams[0]?.id,
        assigneeId: createdUsers[1]?.id,
      },
      {
        title: 'Design user interface',
        description: 'Create wireframes and mockups for the application',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
        teamId: createdTeams[1]?.id,
        assigneeId: createdUsers[3]?.id,
      },
      {
        title: 'Implement authentication',
        description: 'Set up JWT authentication and user management',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
        teamId: createdTeams[0]?.id,
        assigneeId: createdUsers[2]?.id,
      },
      {
        title: 'Create marketing materials',
        description: 'Design brochures and promotional content',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        teamId: createdTeams[2]?.id,
      },
      {
        title: 'Write API documentation',
        description: 'Document all API endpoints and provide usage examples',
        dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days from now
        teamId: createdTeams[0]?.id,
        assigneeId: createdUsers[1]?.id,
      },
    ];

    for (const todoData of demoTodos) {
      try {
        const creator = createdUsers[0]; // sam@example.com user
        const todo = await todosService.create(todoData as CreateTodoDto, creator.id);
        console.log(`✅ Created todo: ${todo.title} (Creator: ${creator.email})`);
      } catch (error) {
        console.error(`❌ Error creating todo ${todoData.title}:`, error.message);
      }
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('\nDemo Credentials:');
    console.log('Email: sam@example.com');
    console.log('Password: password123');
    console.log('\nAPI Endpoints:');
    console.log('POST /auth/login - Login');
    console.log('POST /auth/register - Register');
    console.log('GET /teams/my-teams - Get my teams');
    console.log('GET /todos/my-todos - Get my todos');

  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await app.close();
  }
}

seed(); 