export const INSTAGRAM_FORMATS = [
  { 
    id: "square", 
    label: "Square Post", 
    width: 1080, 
    height: 1080, 
    ratio: "1:1",
    description: "Standard feed post"
  },
  { 
    id: "portrait", 
    label: "Portrait Post", 
    width: 1080, 
    height: 1350, 
    ratio: "4:5",
    description: "Ideal for engagement"
  },
  { 
    id: "landscape", 
    label: "Landscape Post", 
    width: 1080, 
    height: 608, 
    ratio: "1.91:1",
    description: "Widescreen feed post"
  },
  { 
    id: "story", 
    label: "Story / Reel", 
    width: 1080, 
    height: 1920, 
    ratio: "9:16",
    description: "Vertical fullscreen"
  },
  { 
    id: "profile", 
    label: "Profile Picture", 
    width: 320, 
    height: 320, 
    ratio: "1:1",
    description: "Circle cutout"
  },
] as const;

export type InstagramFormat = typeof INSTAGRAM_FORMATS[number];

export function resizeImageToFit(
  img: HTMLImageElement,
  targetW: number,
  targetH: number,
  config: {
    bgColor?: string;
    bgMode?: "solid" | "blur";
    blurAmount?: number;
    objectFit?: "contain" | "cover";
  } = {}
): string {
  const { 
    bgColor = "#ffffff", 
    bgMode = "solid", 
    blurAmount = 40,
    objectFit = "contain" 
  } = config;
  
  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d")!;

  if (bgMode === "blur") {
    // 1. Draw blurred background (cover style)
    const blurCanvas = document.createElement("canvas");
    blurCanvas.width = targetW;
    blurCanvas.height = targetH;
    const bCtx = blurCanvas.getContext("2d")!;
    
    const imgRatio = img.width / img.height;
    const targetRatio = targetW / targetH;
    
    let bW, bH, bX, bY;
    if (imgRatio > targetRatio) {
      bH = targetH;
      bW = targetH * imgRatio;
    } else {
      bW = targetW;
      bH = targetW / imgRatio;
    }
    bX = (targetW - bW) / 2;
    bY = (targetH - bH) / 2;

    bCtx.drawImage(img, bX, bY, bW, bH);
    
    // Apply blur mask
    ctx.filter = `blur(${blurAmount}px)`;
    ctx.drawImage(blurCanvas, -blurAmount * 2, -blurAmount * 2, targetW + blurAmount * 4, targetH + blurAmount * 4);
    ctx.filter = "none";
    
    // Add subtle darkening overlay for better contrast
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.fillRect(0, 0, targetW, targetH);
  } else {
    // 1. Fill solid background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, targetW, targetH);
  }

  // 2. Scale image (contain or cover)
  const imgRatio = img.width / img.height;
  const targetRatio = targetW / targetH;

  let drawW, drawH, x, y;

  if (objectFit === "contain") {
    // Letterbox/Pillarbox logic
    if (imgRatio > targetRatio) {
      drawW = targetW;
      drawH = targetW / imgRatio;
    } else {
      drawH = targetH;
      drawW = targetH * imgRatio;
    }
  } else {
    // Cover/Crop logic
    if (imgRatio > targetRatio) {
      drawH = targetH;
      drawW = targetH * imgRatio;
    } else {
      drawW = targetW;
      drawH = targetW / imgRatio;
    }
  }

  x = (targetW - drawW) / 2;
  y = (targetH - drawH) / 2;

  // Smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  
  ctx.drawImage(img, x, y, drawW, drawH);

  return canvas.toDataURL("image/jpeg", 0.92);
}
