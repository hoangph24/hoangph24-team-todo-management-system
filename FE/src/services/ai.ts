import { apiPost } from './api';
import { TodoPriority } from '../types';

// AI Service for intelligent features
class AIService {
  // Due Date Suggestions
  async suggestDueDate(taskData: {
    title: string;
    description: string;
    priority: TodoPriority;
    teamId?: string;
    assigneeId?: string;
  }): Promise<{
    suggestedDate: string;
    confidence: number;
    reasoning: string;
    alternatives: string[];
  }> {
    try {
      const response = await apiPost<{
        suggestedDate: string;
        confidence: number;
        reasoning: string;
        alternatives: string[];
      }>('/ai/suggest-due-date', taskData);
      return response;
    } catch (error) {
      console.error('Error suggesting due date:', error);
      throw error;
    }
  }

  // Task Complexity Analysis
  async analyzeTask(taskData: {
    title: string;
    description: string;
    priority: TodoPriority;
    teamId?: string;
    assigneeId?: string;
  }): Promise<{
    complexity: 'low' | 'medium' | 'high';
    score: number;
    factors: string[];
    estimatedHours: number;
    recommendations: string[];
  }> {
    try {
      const response = await apiPost<{
        complexity: 'low' | 'medium' | 'high';
        score: number;
        factors: string[];
        estimatedHours: number;
        recommendations: string[];
      }>('/ai/analyze-task', taskData);
      return response;
    } catch (error) {
      console.error('Error analyzing task:', error);
      throw error;
    }
  }
}

// Create singleton instance
const aiService = new AIService();

export default aiService; 