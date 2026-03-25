/**
 * Utility Functions
 */

/**
 * Format confidence as percentage
 */
export function formatConfidence(confidence: number): string {
  return `${(confidence * 100).toFixed(2)}%`;
}

/**
 * Format timestamp
 */
export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleString();
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'File must be an image' };
  }

  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return { valid: false, error: 'Image size must be less than 10MB' };
  }

  return { valid: true };
}

/**
 * Get image dimensions
 */
export async function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Get confidence level
 */
export function getConfidenceLevel(
  confidence: number
): 'high' | 'medium' | 'low' {
  if (confidence >= 0.8) return 'high';
  if (confidence >= 0.6) return 'medium';
  return 'low';
}

/**
 * Classify confidence
 */
export function classifyConfidence(confidence: number): {
  level: 'high' | 'medium' | 'low';
  label: string;
  emoji: string;
} {
  const level = getConfidenceLevel(confidence);

  const config = {
    high: { label: 'High', emoji: '✅' },
    medium: { label: 'Medium', emoji: '⚠️' },
    low: { label: 'Low', emoji: '❓' },
  };

  return {
    level,
    label: config[level].label,
    emoji: config[level].emoji,
  };
}

/**
 * Sanitize string for display
 */
export function sanitizeString(str: string): string {
  return str
    .replace(/[<>]/g, '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Load image from URL
 */
export async function loadImage(
  src: string
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = src;
  });
}

/**
 * Check if browser supports WebGL
 */
export function hasWebGL(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

/**
 * Check if browser supports Web Workers
 */
export function hasWebWorkers(): boolean {
  return typeof Worker !== 'undefined';
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Generate unique ID
 */
export function generateId(prefix: string = ''): string {
  return `${prefix}${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if running in browser
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * Get device info
 */
export function getDeviceInfo(): {
  os: string;
  browser: string;
  isMobile: boolean;
} {
  if (!isBrowser()) {
    return { os: 'unknown', browser: 'unknown', isMobile: false };
  }

  const ua = navigator.userAgent;
  const isMobile = /mobile/i.test(ua);

  let os = 'Unknown';
  if (ua.indexOf('Windows') > -1) os = 'Windows';
  if (ua.indexOf('Mac') > -1) os = 'macOS';
  if (ua.indexOf('Linux') > -1) os = 'Linux';
  if (ua.indexOf('Android') > -1) os = 'Android';
  if (ua.indexOf('iOS') > -1) os = 'iOS';

  let browser = 'Unknown';
  if (ua.indexOf('Chrome') > -1) browser = 'Chrome';
  if (ua.indexOf('Firefox') > -1) browser = 'Firefox';
  if (ua.indexOf('Safari') > -1) browser = 'Safari';
  if (ua.indexOf('Edge') > -1) browser = 'Edge';

  return { os, browser, isMobile };
}

/**
 * Copy to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    }
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}

/**
 * Parse error response
 */
export function parseErrorResponse(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message;
  }

  return 'An unknown error occurred';
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === maxRetries - 1) {
        throw err;
      }
      await new Promise((resolve) =>
        setTimeout(resolve, delayMs * Math.pow(2, i))
      );
    }
  }
  throw new Error('Max retries exceeded');
}
