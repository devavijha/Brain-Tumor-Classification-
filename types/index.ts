/**
 * Global Type Definitions
 */

export interface PredictionRequest {
  image: File | Blob;
  includeGradCAM?: boolean;
}

export interface PredictionResponse {
  prediction: string;
  confidence: number;
  timestamp: string;
  gradcam?: string;
  modelVersion?: string;
  processingTime?: number;
}

export interface ModelMetadata {
  version: string;
  inputShape: number[];
  outputShape: number[];
  classes: string[];
  trainedOn?: string;
  accuracy?: number;
}

export interface ImagePreprocessingConfig {
  targetWidth: number;
  targetHeight: number;
  channels: number;
  normalize: boolean;
  meanValues?: number[];
  stdValues?: number[];
}

export interface InferenceConfig {
  maxDuration: number;
  temperature?: number;
  topK?: number;
  confidenceThreshold?: number;
}

export interface UIState {
  loading: boolean;
  error: string | null;
  result: PredictionResponse | null;
  uploadedImage: string | null;
}

export type TumorClass = 'glioma' | 'meningioma' | 'pituitary' | 'notumor';

export interface TumorInfo {
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  color: string;
  icon?: string;
  recommendations?: string[];
}

export type TumorClassification = {
  [key in TumorClass]: TumorInfo;
};

export interface AnalyticsEvent {
  type: 'prediction' | 'error' | 'upload' | 'visualization';
  timestamp: string;
  data?: Record<string, unknown>;
}

// Next.js API Response types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

// Canvas types for cross-browser compatibility
export type CanvasImageSource =
  | HTMLImageElement
  | HTMLVideoElement
  | HTMLCanvasElement
  | ImageBitmap
  | OffscreenCanvas;

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_API_URL: string;
      NEXT_PUBLIC_MODEL_VERSION: string;
      DEBUG?: string;
    }
  }
}

export {};
