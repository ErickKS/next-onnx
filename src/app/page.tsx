"use client";

import { useEffect, useState, useRef, ChangeEvent } from "react";
import { Tensor, InferenceSession } from "onnxruntime-web";
import clsx from "clsx";

import { downloadBuffer } from "@/utils/model-download";
import { detectImage } from "@/utils/model-detect";
import { resultTransform } from "@/utils/model-results";

interface DetectionResultProps {
  label: string;
  confidence: number;
}

export default function Home() {
  const [session, setSession] = useState<{ net: InferenceSession; nms: InferenceSession } | null>(null);
  const [detectionResult, setDetectionResult] = useState<DetectionResultProps[] | null>(null);

  const MODEL_URL = "./model/best.onnx";
  const MODEL_URL_2 = "./model/nms-yolov8.onnx";
  const MODEL_SHAPES = [1, 3, 256, 256]; // 256x256 my preset image model

  const inputImage = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!session) getModel();
  }, []);

  async function getModel() {
    const arrBufNet = await downloadBuffer(MODEL_URL);
    const yolov8 = await InferenceSession.create(arrBufNet);

    const arrBufNMS = await downloadBuffer(MODEL_URL_2);
    const nms = await InferenceSession.create(arrBufNMS, { executionProviders: ["wasm"] });

    const tensor = new Tensor("float32", new Float32Array(MODEL_SHAPES.reduce((a, b) => a * b)), MODEL_SHAPES);
    await yolov8.run({ images: tensor });

    setSession({ net: yolov8, nms: nms });

    console.log("model loaded");
  }

  function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.target;

    if (!files) return;

    const file = files[0];

    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = async () => {
      const result = await detectImage(img, session);
      const resultTransformed = resultTransform(result);

      console.log(resultTransformed);
      setDetectionResult(resultTransformed);

      URL.revokeObjectURL(img.src);
    };
  }

  function handleClick() {
    if (!inputImage.current) return;
    inputImage.current.click();
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24 gap-3">
      <div className="text-xl text-white uppercase">Onnx</div>

      <input type="file" ref={inputImage} accept="image/*" onChange={handleImageUpload} className="hidden" />

      <button
        onClick={handleClick}
        className={clsx(
          "w-36 px-4 py-2 rounded transition-all",
          { "bg-red-600 text-white pointer-events-none cursor-not-allowed": !session },
          { "bg-white text-black pointer-events-auto cursor-pointer": session }
        )}
      >
        {!session ? "loading" : "upload image"}
      </button>

      {detectionResult && (
        <>
          <p>results:</p>

          {detectionResult.map((result, index) => (
            <p key={index}>
              {result.label} - {result.confidence}
            </p>
          ))}
        </>
      )}
    </main>
  );
}
