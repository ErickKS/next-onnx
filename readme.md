<div align="center">
    <h2>⚜️ O N N X ⚜️</h2>
</div>

<div align="center">
    <h4>Follow the steps below to use your .onnx model in your Next.js web application.</h4>
</div>

<br />

> [!NOTE]
> Please consider starring⭐ the repository as it was a challenging task to find a solution and adapt it to Next.js 13, making it more useful for those seeking a solution.

## ⚠ Prerequisites

#### 01. Export your ONNX model

Train your YOLOv8 model and export it in the `.onnx` format. (I'm using Google Colab, feel free to use Python.)

```npm
!yolo export model=[MODEL_PATH] format=onnx
```

Example:

```npm
!yolo export model=/content/drive/MyDrive/ia/runs/detect/train/weights/best.pt format=onnx
```

> [!WARNING]
> It is crucial to use the `yolov8n.pt` model when training your model, as it will improve project performance, reducing browser crashes on mobile devices (when using the camera to attach an image).

<br />

#### 02. Clone or fork my repository

I highly recommend you to clone my repository or fork it, as it prevents typing errors and makes it easier to follow the steps from here.

<br/>

## ⚙ Adapting the project to use your ONNX model

#### 01. Replace the model in the `/public/model` folder

Replace only the `best.onnx` model with your model.

<br />

#### 02. Change the values (256) of the constant in `page.tsx`

```javascript
const MODEL_SHAPES = [1, 3, 256, 256];
```

The values corresponding to 256 in the array are related to the `imgsz` when you trained your model.

```npm
!yolo task=detect mode=train model=yolov8n.pt data=data.yaml epochs=25 imgsz=256 plots=True
```

<br />

#### 03. Change the labels values in the `/src/utils/model-labels.json`

Replace the array values with the class values that your model obtains.
In my case, my model is for bike detection with only six possible labels.

<br />

## ⚠ Special considerations

#### - Dependency Versions:

Ensure to install the following versions of crucial dependencies for this project to work.

```npm
"copy-webpack-plugin": "^11.0.0",
"jimp": "^0.16.1",
"onnxruntime-web": "^1.16.1",
```

Quick installation command:

```npm
npm i copy-webpack-plugin@11.0.0 jimp@0.16.1 onnxruntime-web@1.16.1
```

_Feel free to test on other versions_

<br />

#### - Make sure that your project has the configurations made in the `next.config`.

In your applications, there may be multiple routes, so some configurations may change.

For example, in one of my applications, I had the following structure:

```npm
├── ...
├── src
│   ├── app
│   │   ├── register
│   │   │   ├── photos
│   │   │   │   └── page.tsx
│   │   │   └── ...
│   │   └── ...
│   └── ...
└── ...
```

Inside the `next.config`, it looked like this:

```javascript
new CopyPlugin({
  patterns: [
    {
      from: "./node_modules/onnxruntime-web/dist/ort-wasm.wasm",
      to: "static/chunks",                            // build / deploy
      // to: "static/chunks/app/register/photos",     // dev
    },
    {
      from: "./node_modules/onnxruntime-web/dist/ort-wasm-simd.wasm",
      to: "static/chunks",                            // build / deploy
      // to: "static/chunks/app/register/photos",     // dev
    },
    {
      from: "./public/model",
      to: "static/chunks/app",
    },
  ],
});
```

Just change, disable the 'dev' comment when you're developing your project, and enable the 'build' comment. And when deploying, reverse the same process.

<br />

## ⚜ Next level

#### - Create a custom hook to download the model and simplify the calling process.
#### - Make something more intuitive to show that the model is being loaded.
