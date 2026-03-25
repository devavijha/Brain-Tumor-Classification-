import { NextRequest, NextResponse } from 'next/server';
import * as ort from 'onnxruntime-node';
import sharp from 'sharp';
import path from 'path';

const CLASS_NAMES = ['glioma', 'meningioma', 'notumor', 'pituitary'];
const MODEL_PATH = path.join(process.cwd(), 'model.onnx');

export const maxDuration = 60;

// Singleton pattern for model loading
let session: ort.InferenceSession | null = null;

async function getSession(): Promise<ort.InferenceSession> {
  if (!session) {
    try {
      session = await ort.InferenceSession.create(MODEL_PATH, {
        executionProviders: ['cpu'],
      });
    } catch (error) {
      console.error('Failed to load model:', error);
      throw new Error('Failed to load ONNX model');
    }
  }
  return session;
}

/**
 * Apply softmax to logits
 */
function softmax(logits: Float32Array): Float32Array {
  const max = Math.max(...Array.from(logits));
  const exps = Array.from(logits).map((x) => Math.exp(x - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return new Float32Array(exps.map((x) => x / sum));
}

/**
 * POST /api/predict
 * Accepts a multipart form with an image file and returns tumor classification
 */
export async function POST(request: NextRequest) {
  try {
    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);

    // Get prediction from ONNX model
    const prediction = await runInference(uint8Array);

    return NextResponse.json(prediction);
  } catch (error) {
    console.error('Prediction error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to process image',
      },
      { status: 500 }
    );
  }
}

/**
 * Run inference on the image using ONNX model
 */
async function runInference(
  imageBuffer: Uint8Array
): Promise<{
  prediction: string;
  confidence: number;
  timestamp: string;
  modelVersion: string;
}> {
  try {
    // Process image: resize to 224x224, remove alpha, convert to RGB buffer
    const imageData = await sharp(imageBuffer)
      .resize(224, 224, {
        fit: 'fill',
        withoutEnlargement: false,
      })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { data } = imageData;

    // Convert to Float32Array and normalize
    const float32Data = new Float32Array(data.length);
    for (let i = 0; i < data.length; i++) {
      float32Data[i] = data[i] / 255.0;
    }

    // Convert HWC (Height x Width x Channels) to CHW (Channels x Height x Width)
    // Input: HWC format with shape [224, 224, 3]
    // Output: CHW format with shape [1, 3, 224, 224]
    const height = 224;
    const width = 224;
    const channels = 3;
    const chwData = new Float32Array(1 * channels * height * width);

    const mean = [0.485, 0.456, 0.406];
    const std = [0.229, 0.224, 0.225];

    let chwIndex = 0;
    // For each channel
    for (let c = 0; c < channels; c++) {
      // For each pixel
      for (let h = 0; h < height; h++) {
        for (let w = 0; w < width; w++) {
          const hwcIndex = (h * width + w) * channels + c;
          chwData[chwIndex++] = (float32Data[hwcIndex] - mean[c]) / std[c];
        }
      }
    }

    // Create input tensor with shape [1, 3, 224, 224]
    const inputTensor = new ort.Tensor('float32', chwData, [1, 3, 224, 224]);

    // Get the session
    const sess = await getSession();

    // Run inference
    const results = await sess.run({ [sess.inputNames[0]]: inputTensor });

    // Get output (logits)
    const outputKey = sess.outputNames[0];
    const outputTensor = results[outputKey] as ort.Tensor;
    const logits = outputTensor.data as Float32Array;

    // Apply softmax
    const probabilities = softmax(logits);

    // Find prediction with highest probability
    const maxIndex = Array.from(probabilities).indexOf(
      Math.max(...Array.from(probabilities))
    );
    const prediction = CLASS_NAMES[maxIndex];
    const confidence = probabilities[maxIndex];

    return {
      prediction,
      confidence: Math.round(confidence * 10000) / 10000,
      timestamp: new Date().toISOString(),
      modelVersion: '1.0.0',
    };
  } catch (error) {
    console.error('Inference error:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Model inference failed'
    );
  }
}
