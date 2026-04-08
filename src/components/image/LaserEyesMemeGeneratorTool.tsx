"use client";

import { useEffect, useState } from "react";

import { FilePicker, ImageCard, ImageField, ImageInput, PreviewImage } from "@/components/image/shared";
import { canvasToDataUrl, downloadDataUrl, inferImageExtension, loadImageElement, readFileAsDataUrl } from "@/lib/tools/image-utils";

export default function LaserEyesMemeGeneratorTool() {
  const [source, setSource] = useState("");
  const [result, setResult] = useState("");
  const [filename, setFilename] = useState("laser-eyes");
  const [error, setError] = useState("");
  const [leftEyeX, setLeftEyeX] = useState(38);
  const [leftEyeY, setLeftEyeY] = useState(42);
  const [rightEyeX, setRightEyeX] = useState(62);
  const [rightEyeY, setRightEyeY] = useState(42);
  const [beamLength, setBeamLength] = useState(280);
  const [beamAngle, setBeamAngle] = useState(-24);
  const [beamWidth, setBeamWidth] = useState(12);
  const [glow, setGlow] = useState(26);

  useEffect(() => {
    async function renderLaserEyes() {
      if (!source) {
        return;
      }

      try {
        const image = await loadImageElement(source);
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext("2d");

        if (!context) {
          throw new Error("Unable to prepare the image canvas.");
        }

        context.drawImage(image, 0, 0);

        const eyes = [
          { x: (leftEyeX / 100) * canvas.width, y: (leftEyeY / 100) * canvas.height },
          { x: (rightEyeX / 100) * canvas.width, y: (rightEyeY / 100) * canvas.height },
        ];

        const radians = (beamAngle * Math.PI) / 180;
        const endX = Math.cos(radians) * beamLength;
        const endY = Math.sin(radians) * beamLength;

        eyes.forEach((eye) => {
          const gradient = context.createRadialGradient(eye.x, eye.y, 0, eye.x, eye.y, glow);
          gradient.addColorStop(0, "rgba(255, 255, 255, 0.95)");
          gradient.addColorStop(0.2, "rgba(255, 98, 98, 0.95)");
          gradient.addColorStop(1, "rgba(255, 0, 0, 0)");

          context.fillStyle = gradient;
          context.beginPath();
          context.arc(eye.x, eye.y, glow, 0, Math.PI * 2);
          context.fill();

          context.save();
          context.strokeStyle = "rgba(255, 32, 32, 0.95)";
          context.lineWidth = beamWidth;
          context.lineCap = "round";
          context.shadowBlur = glow;
          context.shadowColor = "rgba(255, 0, 0, 0.95)";
          context.beginPath();
          context.moveTo(eye.x, eye.y);
          context.lineTo(eye.x + endX, eye.y + endY);
          context.stroke();
          context.restore();
        });

        setResult(canvasToDataUrl(canvas));
      } catch (issue) {
        setError(issue instanceof Error ? issue.message : "Unable to generate the laser-eyes image.");
      }
    }

    void renderLaserEyes();
  }, [beamAngle, beamLength, beamWidth, glow, leftEyeX, leftEyeY, rightEyeX, rightEyeY, source]);

  async function handleFile(file: File) {
    setError("");
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setSource(dataUrl);
      setFilename(file.name.replace(/\.[^.]+$/, "") || "laser-eyes");
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to load the selected image.");
    }
  }

  return (
    <div className="space-y-6">
      <ImageCard>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Upload a photo to add laser eyes</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Position both eyes, tune the beam, and export a quick meme-ready image straight from the browser.
            </p>
          </div>
          <div className="flex gap-3">
            <FilePicker label="Image file" onFile={handleFile} />
            {result ? (
              <button
                type="button"
                onClick={() => downloadDataUrl(result, `${filename}-laser-eyes.${inferImageExtension(result)}`)}
                className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
              >
                Download image
              </button>
            ) : null}
          </div>
        </div>
        {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      </ImageCard>

      {source ? (
        <>
          <ImageCard>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <ImageField label="Left eye X (%)">
                <ImageInput type="number" min={0} max={100} step={1} value={leftEyeX} onChange={(event) => setLeftEyeX(Number(event.target.value))} />
              </ImageField>
              <ImageField label="Left eye Y (%)">
                <ImageInput type="number" min={0} max={100} step={1} value={leftEyeY} onChange={(event) => setLeftEyeY(Number(event.target.value))} />
              </ImageField>
              <ImageField label="Right eye X (%)">
                <ImageInput type="number" min={0} max={100} step={1} value={rightEyeX} onChange={(event) => setRightEyeX(Number(event.target.value))} />
              </ImageField>
              <ImageField label="Right eye Y (%)">
                <ImageInput type="number" min={0} max={100} step={1} value={rightEyeY} onChange={(event) => setRightEyeY(Number(event.target.value))} />
              </ImageField>
              <ImageField label="Beam length (px)">
                <ImageInput type="number" min={40} max={1200} step={10} value={beamLength} onChange={(event) => setBeamLength(Number(event.target.value))} />
              </ImageField>
              <ImageField label="Beam angle (deg)">
                <ImageInput type="number" min={-180} max={180} step={1} value={beamAngle} onChange={(event) => setBeamAngle(Number(event.target.value))} />
              </ImageField>
              <ImageField label="Beam width">
                <ImageInput type="number" min={2} max={80} step={1} value={beamWidth} onChange={(event) => setBeamWidth(Number(event.target.value))} />
              </ImageField>
              <ImageField label="Glow size">
                <ImageInput type="number" min={8} max={120} step={1} value={glow} onChange={(event) => setGlow(Number(event.target.value))} />
              </ImageField>
            </div>
          </ImageCard>

          <div className="grid gap-6 xl:grid-cols-2">
            <ImageCard>
              <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">Original</h2>
              <PreviewImage src={source} alt="Original uploaded image" />
            </ImageCard>
            {result ? (
              <ImageCard>
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">Laser-eyes result</h2>
                <PreviewImage src={result} alt="Photo with laser eyes effect" />
              </ImageCard>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
}
