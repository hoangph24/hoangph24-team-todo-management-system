import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import {
  suggestDueDate,
  analyzeComplexity,
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
} from '../store/slices/aiSlice';
import { Todo, Team, TodoPriority } from '../types';

export const useAI = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    dueDateSuggestion,
    complexityAnalysis,
    taskRecommendations,
    teamRecommendations,
    productivityAnalytics,
    workloadOptimization,
    taskTemplates,
    taskPredictions,
    teamPerformance,
    taskCategorization,
    detectedConflicts,
    loading,
    error,
  } = useSelector((state: RootState) => state.ai);

  // Due Date Suggestions
  const suggestDueDateForTask = useCallback(async (taskData: {
    title: string;
    description: string;
    priority: TodoPriority;
    teamId?: string;
    assigneeId?: string;
  }) => {
    try {
      await dispatch(suggestDueDate(taskData)).unwrap();
    } catch (error) {
      console.error('Error suggesting due date:', error);
      throw error;
    }
  }, [dispatch]);

  // Complexity Analysis
  const analyzeTaskComplexity = useCallback(async (taskData: {
    title: string;
    description: string;
    priority: TodoPriority;
    teamId?: string;
    assigneeId?: string;
  }) => {
    try {
      await dispatch(analyzeComplexity(taskData)).unwrap();
    } catch (error) {
      console.error('Error analyzing complexity:', error);
      throw error;
    }
  }, [dispatch]);


  // Clear functions
  const clearDueDateSuggestionData = useCallback(() => {
    dispatch(clearDueDateSuggestion());
  }, [dispatch]);

  const clearComplexityAnalysisData = useCallback(() => {
    dispatch(clearComplexityAnalysis());
  }, [dispatch]);

  const clearTaskRecommendationsData = useCallback(() => {
    dispatch(clearTaskRecommendations());
  }, [dispatch]);

  const clearTeamRecommendationsData = useCallback(() => {
    dispatch(clearTeamRecommendations());
  }, [dispatch]);

  const clearProductivityAnalyticsData = useCallback(() => {
    dispatch(clearProductivityAnalytics());
  }, [dispatch]);

  const clearWorkloadOptimizationData = useCallback(() => {
    dispatch(clearWorkloadOptimization());
  }, [dispatch]);

  const clearTaskTemplatesData = useCallback(() => {
    dispatch(clearTaskTemplates());
  }, [dispatch]);

  const clearTaskPredictionData = useCallback((taskId: string) => {
    dispatch(clearTaskPrediction(taskId));
  }, [dispatch]);

  const clearTeamPerformanceData = useCallback((teamId: string) => {
    dispatch(clearTeamPerformance(teamId));
  }, [dispatch]);

  const clearTaskCategorizationData = useCallback(() => {
    dispatch(clearTaskCategorization());
  }, [dispatch]);

  const clearDetectedConflictsData = useCallback(() => {
    dispatch(clearDetectedConflicts());
  }, [dispatch]);

  const clearAllAIDataAction = useCallback(() => {
    dispatch(clearAllAIData());
  }, [dispatch]);

  return {
    // State
    dueDateSuggestion,
    complexityAnalysis,
    taskRecommendations,
    teamRecommendations,
    productivityAnalytics,
    workloadOptimization,
    taskTemplates,
    taskPredictions,
    teamPerformance,
    taskCategorization,
    detectedConflicts,
    loading,
    error,

    // Actions
    suggestDueDateForTask,
    analyzeTaskComplexity,

    // Clear actions
    clearDueDateSuggestionData,
    clearComplexityAnalysisData,
    clearTaskRecommendationsData,
    clearTeamRecommendationsData,
    clearProductivityAnalyticsData,
    clearWorkloadOptimizationData,
    clearTaskTemplatesData,
    clearTaskPredictionData,
    clearTeamPerformanceData,
    clearTaskCategorizationData,
    clearDetectedConflictsData,
    clearAllAIDataAction,
  };
}; 