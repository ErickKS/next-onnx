import { InferenceSession, Tensor } from "onnxruntime-web";
import { getImageTensorFromPath } from "./model-image-helper";

export async function detectImage(image: HTMLImageElement, session: { net: InferenceSession; nms: InferenceSession } | null) {
  const MODEL_SHAPES = [1, 3, 256, 256];
  const IOU_THRESHOLD = 0.45;
  const SCORE_THRESHOLDeThreshold = 0.7; // minimum confidence values to be returned

  const [modelWidth, modelHeight] = MODEL_SHAPES.slice(2);
  const input = await getImageTensorFromPath(image.src, modelWidth, modelHeight);

  const tensor = new Tensor("float32", input.data, MODEL_SHAPES);
  const config = new Tensor("float32", new Float32Array([100, IOU_THRESHOLD, SCORE_THRESHOLDeThreshold]));

  const { output0 } = await session!.net.run({ images: tensor });
  const { selected } = await session!.nms.run({ detection: output0, config: config });

  const boxes = [];

  for (let idx = 0; idx < selected.dims[1]; idx++) {
    const data = selected.data.slice(idx * selected.dims[2], (idx + 1) * selected.dims[2]);

    const scores = data.slice(4);           // scores === confidences
    let maxScore = -Infinity;               // maximum probability scores
    let label = -1;                         // classes

    for (let i = 0; i < scores.length; i++) {
      const score = Number(scores[i]);

      if (score > maxScore) {
        maxScore = score;
        label = i;
      }
    }

    boxes.push({ label, confidence: maxScore });
  }

  return boxes;
}
