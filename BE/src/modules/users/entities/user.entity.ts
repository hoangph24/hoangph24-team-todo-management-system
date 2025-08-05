import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Team } from '../../teams/entities/team.entity';
import { Todo } from '../../todos/entities/todo.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @ManyToMany(() => Team, (team) => team.members)
  teams: Team[];

  @OneToMany(() => Todo, (todo) => todo.assignee)
  assignedTodos: Todo[];

  @OneToMany(() => Todo, (todo) => todo.createdBy)
  createdTodos: Todo[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 