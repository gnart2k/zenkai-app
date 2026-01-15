// Processing and workflow domain types
export interface ProcessingPipeline {
  stages: ProcessingStage[];
  currentStage: ProcessingStage;
  progress: number; // 0-100
  estimatedTimeRemaining?: number; // in seconds
  canProceed: boolean;
  errors?: ProcessingError[];
}

export interface ProcessingStage {
  id: string;
  name: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  progress: number; // 0-100
  result?: any;
  error?: ProcessingError;
  estimatedDuration?: number; // in seconds
}

export interface ProcessingError {
  stage: string;
  message: string;
  code?: string;
  recoverable: boolean;
  suggestions?: string[];
}