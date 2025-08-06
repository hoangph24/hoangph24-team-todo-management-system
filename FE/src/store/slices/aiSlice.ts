import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import aiService from '../../services/ai';
import { Todo, Team, TodoPriority } from '../../types';

// Async thunks
export const suggestDueDate = createAsyncThunk(
  'ai/suggestDueDate',
  async (taskData: {
    title: string;
    description: string;
    priority: TodoPriority;
    teamId?: string;
    assigneeId?: string;
  }, { rejectWithValue }) => {
    try {
      return await aiService.suggestDueDate(taskData);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to suggest due date');
    }
  }
);

export const analyzeComplexity = createAsyncThunk(
  'ai/analyzeComplexity',
  async (taskData: {
    title: string;
    description: string;
    priority: TodoPriority;
    teamId?: string;
    assigneeId?: string;
  }, { rejectWithValue }) => {
    try {
      return await aiService.analyzeTask(taskData);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to analyze complexity');
    }
  }
);


// AI State interface
interface AIState {
  // Due date suggestions
  dueDateSuggestion: {
    suggestedDate: string;
    confidence: number;
    reasoning: string;
    alternatives: string[];
  } | null;
  
  // Complexity analysis
  complexityAnalysis: {
    complexity: 'low' | 'medium' | 'high';
    score: number;
    factors: string[];
    estimatedHours: number;
    recommendations: string[];
  } | null;
  
  // Task recommendations
  taskRecommendations: Array<{
    type: 'task_creation' | 'task_optimization' | 'team_assignment' | 'priority_adjustment';
    title: string;
    description: string;
    confidence: number;
    action: any;
  }>;
  
  // Team recommendations
  teamRecommendations: Array<{
    type: 'team_join' | 'team_create' | 'member_suggestion' | 'skill_gap';
    title: string;
    description: string;
    confidence: number;
    action: any;
  }>;
  
  // Productivity analytics
  productivityAnalytics: {
    metrics: {
      tasksCompleted: number;
      tasksCreated: number;
      averageCompletionTime: number;
      productivityScore: number;
      teamCollaboration: number;
      deadlineAdherence: number;
    };
    trends: Array<{
      date: string;
      value: number;
      metric: string;
    }>;
    insights: string[];
    recommendations: string[];
  } | null;
  
  // Workload optimization
  workloadOptimization: {
    optimization: {
      suggestedAssignments: Array<{
        taskId: string;
        assigneeId: string;
        reason: string;
        confidence: number;
      }>;
      priorityAdjustments: Array<{
        taskId: string;
        newPriority: TodoPriority;
        reason: string;
      }>;
      timeEstimates: Array<{
        taskId: string;
        estimatedHours: number;
        confidence: number;
      }>;
    };
    insights: string[];
  } | null;
  
  // Task templates
  taskTemplates: Array<{
    id: string;
    title: string;
    description: string;
    estimatedHours: number;
    priority: TodoPriority;
    subtasks: Array<{
      title: string;
      description: string;
      estimatedHours: number;
    }>;
  }>;
  
  // Task completion predictions
  taskPredictions: {
    [taskId: string]: {
      predictedCompletionDate: string;
      confidence: number;
      factors: string[];
      riskFactors: string[];
      recommendations: string[];
    };
  };
  
  // Team performance analysis
  teamPerformance: {
    [teamId: string]: {
      performance: {
        overallScore: number;
        taskCompletionRate: number;
        averageTaskTime: number;
        collaborationScore: number;
        memberPerformance: Array<{
          userId: string;
          score: number;
          tasksCompleted: number;
          averageTime: number;
        }>;
      };
      insights: string[];
      recommendations: string[];
      trends: Array<{
        date: string;
        metric: string;
        value: number;
      }>;
    };
  };
  
  // Task categorization
  taskCategorization: {
    category: string;
    tags: string[];
    confidence: number;
    suggestedTeam?: string;
    suggestedAssignee?: string;
  } | null;
  
  // Conflict detection
  detectedConflicts: Array<{
    type: 'schedule_conflict' | 'workload_conflict' | 'priority_conflict' | 'skill_mismatch';
    severity: 'low' | 'medium' | 'high';
    description: string;
    affectedTasks: string[];
    suggestions: string[];
  }>;
  
  // Loading states
  loading: {
    dueDateSuggestion: boolean;
    complexityAnalysis: boolean;
    taskRecommendations: boolean;
    teamRecommendations: boolean;
    productivityAnalytics: boolean;
    workloadOptimization: boolean;
    taskTemplates: boolean;
    taskPrediction: boolean;
    teamPerformance: boolean;
    taskCategorization: boolean;
    conflictDetection: boolean;
  };
  
  // Error states
  error: {
    dueDateSuggestion: string | null;
    complexityAnalysis: string | null;
    taskRecommendations: string | null;
    teamRecommendations: string | null;
    productivityAnalytics: string | null;
    workloadOptimization: string | null;
    taskTemplates: string | null;
    taskPrediction: string | null;
    teamPerformance: string | null;
    taskCategorization: string | null;
    conflictDetection: string | null;
  };
}

// Initial state
const initialState: AIState = {
  dueDateSuggestion: null,
  complexityAnalysis: null,
  taskRecommendations: [],
  teamRecommendations: [],
  productivityAnalytics: null,
  workloadOptimization: null,
  taskTemplates: [],
  taskPredictions: {},
  teamPerformance: {},
  taskCategorization: null,
  detectedConflicts: [],
  loading: {
    dueDateSuggestion: false,
    complexityAnalysis: false,
    taskRecommendations: false,
    teamRecommendations: false,
    productivityAnalytics: false,
    workloadOptimization: false,
    taskTemplates: false,
    taskPrediction: false,
    teamPerformance: false,
    taskCategorization: false,
    conflictDetection: false,
  },
  error: {
    dueDateSuggestion: null,
    complexityAnalysis: null,
    taskRecommendations: null,
    teamRecommendations: null,
    productivityAnalytics: null,
    workloadOptimization: null,
    taskTemplates: null,
    taskPrediction: null,
    teamPerformance: null,
    taskCategorization: null,
    conflictDetection: null,
  },
};

// AI slice
const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    // Clear due date suggestion
    clearDueDateSuggestion: (state) => {
      state.dueDateSuggestion = null;
      state.error.dueDateSuggestion = null;
    },
    
    // Clear complexity analysis
    clearComplexityAnalysis: (state) => {
      state.complexityAnalysis = null;
      state.error.complexityAnalysis = null;
    },
    
    // Clear task recommendations
    clearTaskRecommendations: (state) => {
      state.taskRecommendations = [];
      state.error.taskRecommendations = null;
    },
    
    // Clear team recommendations
    clearTeamRecommendations: (state) => {
      state.teamRecommendations = [];
      state.error.teamRecommendations = null;
    },
    
    // Clear productivity analytics
    clearProductivityAnalytics: (state) => {
      state.productivityAnalytics = null;
      state.error.productivityAnalytics = null;
    },
    
    // Clear workload optimization
    clearWorkloadOptimization: (state) => {
      state.workloadOptimization = null;
      state.error.workloadOptimization = null;
    },
    
    // Clear task templates
    clearTaskTemplates: (state) => {
      state.taskTemplates = [];
      state.error.taskTemplates = null;
    },
    
    // Clear task prediction
    clearTaskPrediction: (state, action: PayloadAction<string>) => {
      delete state.taskPredictions[action.payload];
      state.error.taskPrediction = null;
    },
    
    // Clear team performance
    clearTeamPerformance: (state, action: PayloadAction<string>) => {
      delete state.teamPerformance[action.payload];
      state.error.teamPerformance = null;
    },
    
    // Clear task categorization
    clearTaskCategorization: (state) => {
      state.taskCategorization = null;
      state.error.taskCategorization = null;
    },
    
    // Clear detected conflicts
    clearDetectedConflicts: (state) => {
      state.detectedConflicts = [];
      state.error.conflictDetection = null;
    },
    
    // Clear all AI data
    clearAllAIData: (state) => {
      state.dueDateSuggestion = null;
      state.complexityAnalysis = null;
      state.taskRecommendations = [];
      state.teamRecommendations = [];
      state.productivityAnalytics = null;
      state.workloadOptimization = null;
      state.taskTemplates = [];
      state.taskPredictions = {};
      state.teamPerformance = {};
      state.taskCategorization = null;
      state.detectedConflicts = [];
      
      // Clear all errors
      Object.keys(state.error).forEach(key => {
        (state.error as any)[key] = null;
      });
    },
  },
  extraReducers: (builder) => {
    // Due date suggestion
    builder
      .addCase(suggestDueDate.pending, (state) => {
        state.loading.dueDateSuggestion = true;
        state.error.dueDateSuggestion = null;
      })
      .addCase(suggestDueDate.fulfilled, (state, action) => {
        state.loading.dueDateSuggestion = false;
        state.dueDateSuggestion = action.payload;
      })
      .addCase(suggestDueDate.rejected, (state, action) => {
        state.loading.dueDateSuggestion = false;
        state.error.dueDateSuggestion = action.payload as string;
      });

    // Complexity analysis
    builder
      .addCase(analyzeComplexity.pending, (state) => {
        state.loading.complexityAnalysis = true;
        state.error.complexityAnalysis = null;
      })
      .addCase(analyzeComplexity.fulfilled, (state, action) => {
        state.loading.complexityAnalysis = false;
        state.complexityAnalysis = action.payload;
      })
      .addCase(analyzeComplexity.rejected, (state, action) => {
        state.loading.complexityAnalysis = false;
        state.error.complexityAnalysis = action.payload as string;
      });
  },
});

export const {
  clearDueDateSuggestion,
  clearComplexityAnalysis,
  clearTaskRecommendations,
  clearTeamRecommendations,
  clearProductivityAnalytics,
  clearWorkloadOptimization,
  clearTaskTemplates,
  clearTaskPrediction,
  clearTeamPerformance,
  clearTaskCategorization,
  clearDetectedConflicts,
  clearAllAIData,
} = aiSlice.actions;

export default aiSlice.reducer; 