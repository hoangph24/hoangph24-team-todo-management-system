import { Injectable } from '@nestjs/common';

export interface AISuggestion {
  suggestedDueDate: Date;
  confidence: number;
  reasoning: string;
}

@Injectable()
export class AIService {
  /**
   * Mock AI service for smart due date suggestions
   * In a real implementation, this would use machine learning models
   * to analyze task complexity, team workload, and historical patterns
   */
  
  async suggestDueDate(
    title: string,
    description: string,
    priority: string,
    teamWorkload: number,
  ): Promise<AISuggestion> {
    // Mock AI logic based on task characteristics
    const baseDays = this.calculateBaseDays(title, description, priority);
    const workloadAdjustment = this.calculateWorkloadAdjustment(teamWorkload);
    const finalDays = Math.max(1, baseDays + workloadAdjustment);
    
    const suggestedDueDate = new Date();
    suggestedDueDate.setDate(suggestedDueDate.getDate() + finalDays);
    
    const confidence = this.calculateConfidence(title, description, priority);
    const reasoning = this.generateReasoning(title, description, priority, finalDays);
    
    return {
      suggestedDueDate,
      confidence,
      reasoning,
    };
  }

  private calculateBaseDays(title: string, description: string, priority: string): number {
    let baseDays = 3; // Default 3 days
    
    // Analyze title keywords
    const titleLower = title.toLowerCase();
    if (titleLower.includes('setup') || titleLower.includes('initialize')) {
      baseDays = 2;
    } else if (titleLower.includes('implement') || titleLower.includes('develop')) {
      baseDays = 5;
    } else if (titleLower.includes('design') || titleLower.includes('create')) {
      baseDays = 4;
    } else if (titleLower.includes('test') || titleLower.includes('debug')) {
      baseDays = 2;
    } else if (titleLower.includes('document') || titleLower.includes('write')) {
      baseDays = 3;
    }
    
    // Adjust based on description length (complexity indicator)
    if (description) {
      const wordCount = description.split(' ').length;
      if (wordCount > 50) {
        baseDays += 2;
      } else if (wordCount > 20) {
        baseDays += 1;
      }
    }
    
    // Adjust based on priority
    switch (priority) {
      case 'urgent':
        baseDays = Math.max(1, baseDays - 2);
        break;
      case 'high':
        baseDays = Math.max(1, baseDays - 1);
        break;
      case 'low':
        baseDays += 2;
        break;
    }
    
    return baseDays;
  }

  private calculateWorkloadAdjustment(teamWorkload: number): number {
    // Adjust based on team workload (0-100 scale)
    if (teamWorkload > 80) {
      return 3; // Add 3 days if team is very busy
    } else if (teamWorkload > 60) {
      return 2; // Add 2 days if team is busy
    } else if (teamWorkload > 40) {
      return 1; // Add 1 day if team is moderately busy
    }
    return 0; // No adjustment if team has capacity
  }

  private calculateConfidence(title: string, description: string, priority: string): number {
    let confidence = 0.7; // Base confidence
    
    // Higher confidence for clear, specific tasks
    if (title.length > 10 && description && description.length > 20) {
      confidence += 0.1;
    }
    
    // Higher confidence for urgent/high priority tasks
    if (priority === 'urgent' || priority === 'high') {
      confidence += 0.1;
    }
    
    // Lower confidence for vague tasks
    if (title.length < 5 || !description) {
      confidence -= 0.2;
    }
    
    return Math.min(0.95, Math.max(0.3, confidence));
  }

  private generateReasoning(
    title: string,
    description: string,
    priority: string,
    finalDays: number,
  ): string {
    const reasons = [];
    
    // Task type analysis
    const titleLower = title.toLowerCase();
    if (titleLower.includes('setup') || titleLower.includes('initialize')) {
      reasons.push('Setup tasks typically require 1-2 days for configuration');
    } else if (titleLower.includes('implement') || titleLower.includes('develop')) {
      reasons.push('Development tasks usually need 3-7 days depending on complexity');
    } else if (titleLower.includes('design')) {
      reasons.push('Design tasks often require 2-5 days for iterations');
    } else if (titleLower.includes('test')) {
      reasons.push('Testing tasks generally take 1-3 days');
    }
    
    // Priority consideration
    if (priority === 'urgent') {
      reasons.push('Urgent priority suggests expedited timeline');
    } else if (priority === 'high') {
      reasons.push('High priority requires focused attention and shorter timeline');
    } else if (priority === 'low') {
      reasons.push('Low priority allows for more flexible scheduling');
    }
    
    // Complexity consideration
    if (description && description.length > 50) {
      reasons.push('Detailed description indicates higher complexity');
    }
    
    reasons.push(`Final suggestion: ${finalDays} days`);
    
    return reasons.join('. ') + '.';
  }

  async analyzeTaskComplexity(title: string, description: string): Promise<{
    complexity: 'low' | 'medium' | 'high';
    estimatedHours: number;
    factors: string[];
  }> {
    let complexity: 'low' | 'medium' | 'high' = 'medium';
    let estimatedHours = 8; // Default 1 day
    const factors: string[] = [];
    
    // Analyze title keywords
    const titleLower = title.toLowerCase();
    if (titleLower.includes('simple') || titleLower.includes('quick') || titleLower.includes('update') || titleLower.includes('fix')) {
      complexity = 'low';
      estimatedHours = 3;
      factors.push('Task title suggests simple implementation');
    } else if (titleLower.includes('complex') || titleLower.includes('advanced') || titleLower.includes('implement') || titleLower.includes('system')) {
      complexity = 'high';
      estimatedHours = 20;
      factors.push('Task title indicates complex requirements');
    }
    
    // Analyze description length
    if (description) {
      const wordCount = description.split(' ').length;
      if (wordCount > 100) {
        complexity = 'high';
        estimatedHours += 8;
        factors.push('Detailed description suggests high complexity');
      } else if (wordCount < 20 && complexity === 'medium') {
        // Only set to low if current complexity is medium (not already set by title)
        complexity = 'low';
        estimatedHours = Math.max(2, estimatedHours - 4);
        factors.push('Brief description suggests straightforward task');
      }
    }
    
    return {
      complexity,
      estimatedHours,
      factors,
    };
  }
} 