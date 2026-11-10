import {
  loadTensorflowModel,
  useTensorflowModel,
  type TfliteModel,
  type TensorflowModelDelegate,
} from "react-native-fast-tflite";
import * as ImageManipulator from "expo-image-manipulator";
import { toByteArray } from "react-native-fast-base64";

export const MODEL_ASSET = require("../mobilenet_v3_small.tflite");
const TARGET_WIDTH = 224;
const TARGET_HEIGHT = 224;
const CONFIDENCE_THRESHOLD = 0.75; // 75% confidence threshold

/**
 * React hook to load the receipt classifier TFLite model.
 */
export function useReceiptClassifierModel(
  delegates: TensorflowModelDelegate[] = [],
) {
  return useTensorflowModel(MODEL_ASSET, delegates);
}

/**
 * Loads the TensorFlow model directly.
 */
export async function loadReceiptModel(
  delegates: TensorflowModelDelegate[] = [],
): Promise<TfliteModel> {
  return await loadTensorflowModel(MODEL_ASSET, delegates);
}

function softmax(logits: Float32Array): Float32Array {
  const max = Math.max(...logits);
  const exps = logits.map((v) => Math.exp(v - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((v) => v / sum) as Float32Array;
}

/**
 * Prepares image buffer and classifies if it is a receipt using
 * the `mobilenet_v3_small.tflite` model in the root client directory.
 */
export async function isReceiptImage(
  imageUri: string,
  model?: TfliteModel | null,
): Promise<{ isReceipt: boolean; confidence: number }> {
  try {
    let activeModel = model;

    if (!activeModel) {
      activeModel = await loadReceiptModel();
    }

    if (!activeModel) {
      throw new Error("Failed to load TensorFlow model.");
    }

    // 1. Resize image to model dimensions (224x224)
    const manipResult = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: TARGET_WIDTH, height: TARGET_HEIGHT } }],
      { format: ImageManipulator.SaveFormat.JPEG, base64: true },
    );

    if (!manipResult.base64) {
      throw new Error("Failed to generate base64 image data.");
    }

    // 2. Decode base64 into raw byte array
    const rawBytes = toByteArray(manipResult.base64);

    // 3. Normalize into Float32Array [1, 224, 224, 3]
    const inputData = new Float32Array(1 * TARGET_WIDTH * TARGET_HEIGHT * 3);
    for (let i = 0; i < TARGET_WIDTH * TARGET_HEIGHT * 3; i++) {
      inputData[i] = (rawBytes[i] || 0) / 255.0;
    }

    // 4. Run inference via TFLite model using ArrayBuffer
    const outputs = activeModel.runSync
      ? activeModel.runSync([inputData.buffer as ArrayBuffer])
      : await activeModel.run([inputData.buffer as ArrayBuffer]);

    if (!outputs || outputs.length === 0) {
      throw new Error("Model returned empty outputs.");
    }

    const scores = new Float32Array(outputs[0]);

    // Extract confidence score
    const probs = softmax(scores);
    let receiptScore = probs[1];
    if (scores.length >= 2) {
      receiptScore = scores[1];
    } else if (scores.length === 1) {
      receiptScore = scores[0];
    } else {
      receiptScore = 1.0;
    }
    console.log(receiptScore, probs)

    return {
      isReceipt: receiptScore >= CONFIDENCE_THRESHOLD,
      confidence: receiptScore,
    };
  } catch (error) {
    console.warn(
      "Receipt classification check error, falling back to valid:",
      error,
    );
    return {
      isReceipt: true,
      confidence: 1.0,
    };
  }
}
