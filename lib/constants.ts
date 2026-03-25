/**
 * Application Constants
 */

// Model Configuration
export const MODEL_CONFIG = {
  INPUT_WIDTH: 224,
  INPUT_HEIGHT: 224,
  INPUT_CHANNELS: 3,
  NUM_CLASSES: 4,
  VERSION: process.env.NEXT_PUBLIC_MODEL_VERSION || '1.0.0',
};

// Image Processing
export const IMAGE_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ACCEPTED_FORMATS: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  MIN_WIDTH: 64,
  MAX_WIDTH: 4096,
  MIN_HEIGHT: 64,
  MAX_HEIGHT: 4096,
};

// ImageNet Normalization
export const NORMALIZATION = {
  MEAN: [0.485, 0.456, 0.406],
  STD: [0.229, 0.224, 0.225],
};

// Tumor Classes
export const TUMOR_CLASSES = {
  GLIOMA: 'glioma',
  MENINGIOMA: 'meningioma',
  PITUITARY: 'pituitary',
  NO_TUMOR: 'notumor',
} as const;

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  TIMEOUT: 60000, // 60 seconds
  RETRY_ATTEMPTS: 2,
  RETRY_DELAY: 1000, // 1 second
};

// UI Configuration
export const UI_CONFIG = {
  THEME: 'dark',
  PRIMARY_COLOR: '#3b82f6', // Blue
  ACCENT_COLOR: '#8b5cf6', // Purple
  ANIMATION_DURATION: 300, // ms
};

// Confidence Thresholds
export const CONFIDENCE_THRESHOLDS = {
  HIGH: 0.8,
  MEDIUM: 0.6,
  LOW: 0.4,
};

// Error Messages
export const ERROR_MESSAGES = {
  INVALID_FILE: 'Please select a valid image file',
  FILE_TOO_LARGE: `Image size must be less than ${IMAGE_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB`,
  UNSUPPORTED_FORMAT: 'Unsupported image format',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  INFERENCE_FAILED: 'Model inference failed. Please try again.',
  UPLOAD_FAILED: 'Failed to upload image',
  TIMEOUT: 'Request timeout. Please try again.',
  MODEL_NOT_FOUND: 'Model file not found',
  INVALID_RESPONSE: 'Invalid response from server',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  UPLOAD_COMPLETE: 'Image uploaded successfully',
  PREDICTION_COMPLETE: 'Prediction completed',
  ANALYSIS_READY: 'Analysis ready',
};

// Severity Levels
export const SEVERITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

// Colors for Severity
export const SEVERITY_COLORS = {
  low: 'from-green-500 to-green-600',
  medium: 'from-orange-500 to-orange-600',
  high: 'from-red-500 to-red-600',
} as const;

// Logging
export const LOG_LEVELS = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};

// Cache
export const CACHE_CONFIG = {
  MODEL_CACHE_TIME: 3600000, // 1 hour
  IMAGE_CACHE_TIME: 300000, // 5 minutes
};

// Feature Flags
export const FEATURES = {
  ENABLE_GRADCAM: true,
  ENABLE_ANALYTICS: true,
  ENABLE_DARK_MODE: true,
  ENABLE_DOWNLOADS: false, // Set to true when implemented
};
