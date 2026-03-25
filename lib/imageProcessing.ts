/**
 * Image Preprocessing Utilities
 * Handles image resizing, normalization, and conversion to tensor format
 */

export interface PreprocessedImage {
  data: Float32Array;
  width: number;
  height: number;
  channels: number;
}

/**
 * ImageNet normalization statistics
 */
export const IMAGENET_STATS = {
  mean: [0.485, 0.456, 0.406],
  std: [0.229, 0.224, 0.225],
};

/**
 * Resize image buffer to target dimensions
 * This is a client-side utility. Server-side uses Sharp.
 */
export async function resizeImage(
  imageData: ImageData,
  targetWidth: number = 224,
  targetHeight: number = 224
): Promise<ImageData> {
  const canvas = new OffscreenCanvas(targetWidth, targetHeight);
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  const tempCanvas = new OffscreenCanvas(imageData.width, imageData.height);
  const tempCtx = tempCanvas.getContext('2d');

  if (!tempCtx) {
    throw new Error('Could not get temp canvas context');
  }

  tempCtx.putImageData(imageData, 0, 0);

  ctx.drawImage(
    tempCanvas as unknown as CanvasImageSource,
    0,
    0,
    targetWidth,
    targetHeight
  );

  return ctx.getImageData(0, 0, targetWidth, targetHeight);
}

/**
 * Normalize image data using ImageNet statistics
 */
export function normalizeImage(
  imageData: ImageData,
  mean: number[] = IMAGENET_STATS.mean,
  std: number[] = IMAGENET_STATS.std
): Float32Array {
  const data = imageData.data;
  const normalized = new Float32Array(imageData.data.length);

  for (let i = 0; i < data.length; i += 4) {
    // R
    normalized[i] = (data[i] / 255.0 - mean[0]) / std[0];
    // G
    normalized[i + 1] = (data[i + 1] / 255.0 - mean[1]) / std[1];
    // B
    normalized[i + 2] = (data[i + 2] / 255.0 - mean[2]) / std[2];
  }

  return normalized;
}

/**
 * Convert image buffer to tensor format (CHW - channels, height, width)
 */
export function imageDataToTensor(
  imageData: ImageData,
  mean: number[] = IMAGENET_STATS.mean,
  std: number[] = IMAGENET_STATS.std
): Float32Array {
  const { width, height, data } = imageData;
  const channels = 3;
  const tensor = new Float32Array(channels * height * width);

  for (let i = 0; i < data.length; i += 4) {
    // Get pixel index
    const pixelIndex = i / 4;
    const row = Math.floor(pixelIndex / width);
    const col = pixelIndex % width;

    // RGB channels
    const r = (data[i] / 255.0 - mean[0]) / std[0];
    const g = (data[i + 1] / 255.0 - mean[1]) / std[1];
    const b = (data[i + 2] / 255.0 - mean[2]) / std[2];

    // Store in CHW format
    tensor[0 * height * width + row * width + col] = r;
    tensor[1 * height * width + row * width + col] = g;
    tensor[2 * height * width + row * width + col] = b;
  }

  return tensor;
}

/**
 * Validate image dimensions
 */
export function validateImageDimensions(
  width: number,
  height: number,
  minSize: number = 64,
  maxSize: number = 4096
): boolean {
  return width >= minSize && height >= minSize && width <= maxSize && height <= maxSize;
}

/**
 * Get image dimensions without fully loading it
 */
export async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
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
