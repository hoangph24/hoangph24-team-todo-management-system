import { IsString, IsOptional } from 'class-validator';

export class AnalyzeTaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
} 