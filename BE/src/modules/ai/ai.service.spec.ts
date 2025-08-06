import { Test, TestingModule } from '@nestjs/testing';
import { AIService } from './ai.service';
import { TodoPriority } from '../todos/entities/todo.entity';

describe('AIService', () => {
  let service: AIService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AIService],
    }).compile();

    service = module.get<AIService>(AIService);
  });

  describe('suggestDueDate', () => {
    it('should suggest due date for high priority task', async () => {
      const result = await service.suggestDueDate(
        'Urgent bug fix',
        'Critical security vulnerability',
        TodoPriority.HIGH,
        3,
      );

      expect(result).toHaveProperty('suggestedDueDate');
      expect(result).toHaveProperty('confidence');
      expect(result).toHaveProperty('reasoning');
      expect(result.confidence).toBeGreaterThan(0.7);
      expect(result.reasoning).toContain('High priority');
    });

    it('should suggest due date for low priority task', async () => {
      const result = await service.suggestDueDate(
        'Documentation update',
        'Update README file',
        TodoPriority.LOW,
        1,
      );

      expect(result).toHaveProperty('suggestedDueDate');
      expect(result).toHaveProperty('confidence');
      expect(result).toHaveProperty('reasoning');
      expect(result.confidence).toBeGreaterThan(0.5);
      expect(result.reasoning).toContain('Low priority');
    });


  });

  describe('analyzeTaskComplexity', () => {
    it('should analyze simple task correctly', async () => {
      const result = await service.analyzeTaskComplexity(
        'Update email template',
        'Change the welcome email text',
      );

      expect(result).toHaveProperty('complexity');
      expect(result).toHaveProperty('estimatedHours');
      expect(result).toHaveProperty('factors');
      expect(result.complexity).toBe('low');
      expect(result.estimatedHours).toBeLessThan(4);
    });




  });
}); 