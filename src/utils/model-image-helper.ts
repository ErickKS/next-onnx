import Jimp from "jimp";
import { Tensor } from "onnxruntime-web";

export async function getImageTensorFromPath(path: string, modelWidth: number, modelHeight: number) {
  const image = await loadImageFromPath(path);

  const imageTensor = imageDataToTensor(image, modelWidth, modelHeight);

  return imageTensor;
}

async function loadImageFromPath(path: string) {
  const imageData = await Jimp.read(path).then((imageBuffer) => {
    return imageBuffer.resize(256, 256);
  });

  return imageData;
}

function imageDataToTensor(image: Jimp, modelWidth: number, modelHeight: number) {
  const imageBufferData = image.bitmap.data;
  const [redArray, greenArray, blueArray] = new Array(new Array(), new Array(), new Array());

  for (let i = 0; i < imageBufferData.length; i += 4) {
    redArray.push(imageBufferData[i]);
    greenArray.push(imageBufferData[i + 1]);
    blueArray.push(imageBufferData[i + 2]);
  }

  const transposedData = redArray.concat(greenArray).concat(blueArray);

  let i,
    l = transposedData.length;

  const float32Data = new Float32Array(3 * modelWidth * modelHeight);

  for (i = 0; i < l; i++) {
    float32Data[i] = transposedData[i] / 255;
  }

  const inputTensor = new Tensor("float32", float32Data);

  return inputTensor;
}
