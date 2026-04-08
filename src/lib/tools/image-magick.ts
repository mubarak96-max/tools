import { readFile } from "node:fs/promises";
import path from "node:path";

import { AlphaAction, ImageMagick, initializeImageMagick, MagickColors, MagickFormat } from "@imagemagick/magick-wasm";

import { type ImageFormatCode } from "@/lib/tools/image-format-conversion";

const MAGICK_FORMAT_MAP: Record<ImageFormatCode, MagickFormat> = {
  JPG: MagickFormat.Jpg,
  PNG: MagickFormat.Png,
  WEBP: MagickFormat.WebP,
  TIFF: MagickFormat.Tiff,
  GIF: MagickFormat.Gif,
  BMP: MagickFormat.Bmp,
  HEIC: MagickFormat.Heic,
  AVIF: MagickFormat.Avif,
  PSD: MagickFormat.Psd,
  EPS: MagickFormat.Eps,
};

let magickReady: Promise<void> | null = null;

export async function ensureImageMagick() {
  if (!magickReady) {
    magickReady = readFile(path.join(process.cwd(), "node_modules", "@imagemagick", "magick-wasm", "dist", "magick.wasm")).then((wasm) =>
      initializeImageMagick(new Uint8Array(wasm)),
    );
  }

  await magickReady;
}

export async function convertImageBuffer(bytes: Uint8Array, source: ImageFormatCode, target: ImageFormatCode) {
  await ensureImageMagick();

  return ImageMagick.read(bytes, MAGICK_FORMAT_MAP[source], (image) => {
    image.strip();

    if (target === "JPG") {
      image.backgroundColor = MagickColors.White;
      if (image.hasAlpha) {
        image.alpha(AlphaAction.Remove);
      }
      image.quality = 92;
    } else if (target === "WEBP") {
      image.quality = 92;
    } else if (target === "TIFF") {
      image.quality = 95;
    }

    return image.write(MAGICK_FORMAT_MAP[target], (data) => new Uint8Array(data));
  });
}
