export function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Unable to read the selected image."));
    reader.readAsDataURL(file);
  });
}

export function loadImageElement(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Unable to load the selected image."));
    image.src = src;
  });
}

export function canvasToDataUrl(canvas: HTMLCanvasElement, type = "image/png", quality?: number) {
  return canvas.toDataURL(type, quality);
}

export function dataUrlToBase64(dataUrl: string) {
  const parts = dataUrl.split(",");
  return parts[1] ?? "";
}

export function inferImageExtension(dataUrl: string) {
  const match = dataUrl.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,/);
  return match?.[1]?.replace("jpeg", "jpg") ?? "png";
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const anchor = document.createElement("a");
  anchor.href = dataUrl;
  anchor.download = filename;
  anchor.click();
}
