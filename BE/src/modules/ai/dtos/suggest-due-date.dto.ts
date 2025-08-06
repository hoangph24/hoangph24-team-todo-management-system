import { IsString, IsOptional, IsEnum, IsNumber, Min, Max } from 'class-validator';

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export class SuggestDueDateDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(Priority)
  priority: Priority;

  @IsNumber()
  @Min(1)
  @Max(10)
  teamWorkload: number;
} 