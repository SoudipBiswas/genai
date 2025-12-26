// Request & Response Types for API

export interface AnalyzeCodeRequest {
  oldCode?: string;
  newCode: string;
  mode: 'compare' | 'single';
  language?: string;
}

export interface AssumptionChange {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  category: string;
  title: string;
  description: string;
  oldAssumption: string;
  newAssumption: string;
  impact: string;
  recommendation?: string;
}

export interface AnalysisStats {
  totalChanges: number;
  criticalCount: number;
  warningCount: number;
  estimatedCostImpact?: string;
  performanceImpact?: string;
}

export interface AnalyzeCodeResponse {
  success: boolean;
  results: AssumptionChange[];
  stats: AnalysisStats;
  error?: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  message: string;
}
