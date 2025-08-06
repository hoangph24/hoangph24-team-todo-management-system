import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AIService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SuggestDueDateDto } from './dtos/suggest-due-date.dto';
import { AnalyzeTaskDto } from './dtos/analyze-task.dto';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Post('suggest-due-date')
  async suggestDueDate(@Body() suggestDueDateDto: SuggestDueDateDto) {
    return this.aiService.suggestDueDate(
      suggestDueDateDto.title,
      suggestDueDateDto.description || '',
      suggestDueDateDto.priority,
      suggestDueDateDto.teamWorkload,
    );
  }

  @Post('analyze-task')
  async analyzeTask(@Body() analyzeTaskDto: AnalyzeTaskDto) {
    return this.aiService.analyzeTaskComplexity(
      analyzeTaskDto.title,
      analyzeTaskDto.description || '',
    );
  }
} 