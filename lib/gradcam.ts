/**
 * Grad-CAM Visualization Utilities
 * Generates attention maps showing which image regions influenced the prediction
 */

type GradCanvas = OffscreenCanvas | HTMLCanvasElement;

/**
 * Generate Grad-CAM visualization
 * This is a simplified implementation for client-side
 */
export function generateGradCAM(
  imageData: ImageData,
  gradients: Float32Array,
  activations: Float32Array
): GradCanvas {
  const width = imageData.width;
  const height = imageData.height;

  // Create canvas for heatmap
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Compute weighted activation map
  const heatmap = new Float32Array(width * height);

  // Normalize activations
  let maxAct = 0;
  for (let i = 0; i < activations.length; i++) {
    maxAct = Math.max(maxAct, Math.abs(activations[i]));
  }

  for (let i = 0; i < activations.length; i++) {
    const weight = Math.abs(gradients[i] || 0);
    heatmap[i] = (Math.abs(activations[i]) / (maxAct + 1e-8)) * weight;
  }

  // Normalize heatmap
  let maxHeat = 0;
  for (let i = 0; i < heatmap.length; i++) {
    maxHeat = Math.max(maxHeat, heatmap[i]);
  }

  // Convert to RGB with jet colormap
  const imageDataOut = ctx.createImageData(width, height);
  const data = imageDataOut.data;

  for (let i = 0; i < heatmap.length; i++) {
    const value = heatmap[i] / (maxHeat + 1e-8);
    const color = jetColormap(value);

    const idx = i * 4;
    data[idx] = color.r;
    data[idx + 1] = color.g;
    data[idx + 2] = color.b;
    data[idx + 3] = 255;
  }

  ctx.putImageData(imageDataOut, 0, 0);

  return canvas;
}

/**
 * Jet colormap (blue -> cyan -> green -> yellow -> red)
 */
function jetColormap(value: number): { r: number; g: number; b: number } {
  // Clamp value between 0 and 1
  value = Math.max(0, Math.min(1, value));

  let r = 0,
    g = 0,
    b = 0;

  if (value < 0.125) {
    b = 255;
  } else if (value < 0.375) {
    b = 255;
    g = Math.round(255 * ((value - 0.125) / 0.25));
  } else if (value < 0.625) {
    g = 255;
    b = Math.round(255 * (1 - (value - 0.375) / 0.25));
  } else if (value < 0.875) {
    r = Math.round(255 * ((value - 0.625) / 0.25));
    g = 255;
  } else {
    r = 255;
    g = Math.round(255 * (1 - (value - 0.875) / 0.125));
  }

  return { r, g, b };
}

/**
 * Overlay heatmap on original image
 */
export function overlayGradCAM(
  originalImage: ImageData,
  heatmapCanvas: GradCanvas,
  alpha: number = 0.4
): ImageData {
  const canvas = new OffscreenCanvas(originalImage.width, originalImage.height);
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Draw original image
  ctx.putImageData(originalImage, 0, 0);

  // Draw heatmap with transparency
  ctx.globalAlpha = alpha;
  ctx.drawImage(heatmapCanvas as unknown as CanvasImageSource, 0, 0);
  ctx.globalAlpha = 1.0;

  return ctx.getImageData(0, 0, originalImage.width, originalImage.height);
}

/**
 * Convert canvas to data URL for display
 */
export function canvasToDataURL(canvas: GradCanvas): string {
  if (typeof OffscreenCanvas !== 'undefined' && canvas instanceof OffscreenCanvas) {
    // OffscreenCanvas - use convertToBlob (async)
    // For now, return empty string - should be handled asynchronously
    return '';
  }

  // Regular canvas
  return (canvas as unknown as HTMLCanvasElement).toDataURL('image/png');
}

/**
 * Async version of canvas to data URL
 */
export async function canvasToDataURLAsync(canvas: GradCanvas): Promise<string> {
  if (typeof OffscreenCanvas !== 'undefined' && canvas instanceof OffscreenCanvas) {
    const blob = await (canvas as OffscreenCanvas).convertToBlob();
    return URL.createObjectURL(blob);
  }

  return (canvas as unknown as HTMLCanvasElement).toDataURL('image/png');
}
