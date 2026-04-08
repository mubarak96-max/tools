export type ImageFormatCode = "JPG" | "PNG" | "WEBP" | "TIFF" | "GIF" | "BMP" | "HEIC" | "AVIF" | "PSD" | "EPS";

export type ImageFormatConversionSpec = {
  source: ImageFormatCode;
  target: ImageFormatCode;
  accept: string;
  extension: string;
  mimeType: string;
};

export const IMAGE_FORMAT_LABELS: Record<ImageFormatCode, string> = {
  JPG: "JPG",
  PNG: "PNG",
  WEBP: "WEBP",
  TIFF: "TIFF",
  GIF: "GIF",
  BMP: "BMP",
  HEIC: "HEIC",
  AVIF: "AVIF",
  PSD: "PSD",
  EPS: "EPS",
};

export const IMAGE_FORMAT_CONVERSIONS = {
  "jpg-to-png": {
    source: "JPG",
    target: "PNG",
    accept: ".jpg,.jpeg,image/jpeg",
    extension: "png",
    mimeType: "image/png",
  },
  "png-to-jpg": {
    source: "PNG",
    target: "JPG",
    accept: ".png,image/png",
    extension: "jpg",
    mimeType: "image/jpeg",
  },
  "jpg-to-webp": {
    source: "JPG",
    target: "WEBP",
    accept: ".jpg,.jpeg,image/jpeg",
    extension: "webp",
    mimeType: "image/webp",
  },
  "webp-to-jpg": {
    source: "WEBP",
    target: "JPG",
    accept: ".webp,image/webp",
    extension: "jpg",
    mimeType: "image/jpeg",
  },
  "png-to-webp": {
    source: "PNG",
    target: "WEBP",
    accept: ".png,image/png",
    extension: "webp",
    mimeType: "image/webp",
  },
  "webp-to-png": {
    source: "WEBP",
    target: "PNG",
    accept: ".webp,image/webp",
    extension: "png",
    mimeType: "image/png",
  },
  "tiff-to-jpg": {
    source: "TIFF",
    target: "JPG",
    accept: ".tif,.tiff,image/tiff",
    extension: "jpg",
    mimeType: "image/jpeg",
  },
  "jpg-to-tiff": {
    source: "JPG",
    target: "TIFF",
    accept: ".jpg,.jpeg,image/jpeg",
    extension: "tiff",
    mimeType: "image/tiff",
  },
  "gif-to-jpg": {
    source: "GIF",
    target: "JPG",
    accept: ".gif,image/gif",
    extension: "jpg",
    mimeType: "image/jpeg",
  },
  "gif-to-png": {
    source: "GIF",
    target: "PNG",
    accept: ".gif,image/gif",
    extension: "png",
    mimeType: "image/png",
  },
  "bmp-to-jpg": {
    source: "BMP",
    target: "JPG",
    accept: ".bmp,image/bmp",
    extension: "jpg",
    mimeType: "image/jpeg",
  },
  "bmp-to-png": {
    source: "BMP",
    target: "PNG",
    accept: ".bmp,image/bmp",
    extension: "png",
    mimeType: "image/png",
  },
  "bmp-to-webp": {
    source: "BMP",
    target: "WEBP",
    accept: ".bmp,image/bmp",
    extension: "webp",
    mimeType: "image/webp",
  },
  "bmp-to-tiff": {
    source: "BMP",
    target: "TIFF",
    accept: ".bmp,image/bmp",
    extension: "tiff",
    mimeType: "image/tiff",
  },
  "heic-to-jpg": {
    source: "HEIC",
    target: "JPG",
    accept: ".heic,.heif,image/heic,image/heif",
    extension: "jpg",
    mimeType: "image/jpeg",
  },
  "heic-to-png": {
    source: "HEIC",
    target: "PNG",
    accept: ".heic,.heif,image/heic,image/heif",
    extension: "png",
    mimeType: "image/png",
  },
  "avif-to-jpg": {
    source: "AVIF",
    target: "JPG",
    accept: ".avif,image/avif",
    extension: "jpg",
    mimeType: "image/jpeg",
  },
  "avif-to-png": {
    source: "AVIF",
    target: "PNG",
    accept: ".avif,image/avif",
    extension: "png",
    mimeType: "image/png",
  },
  "psd-to-jpg": {
    source: "PSD",
    target: "JPG",
    accept: ".psd,image/vnd.adobe.photoshop",
    extension: "jpg",
    mimeType: "image/jpeg",
  },
  "psd-to-png": {
    source: "PSD",
    target: "PNG",
    accept: ".psd,image/vnd.adobe.photoshop",
    extension: "png",
    mimeType: "image/png",
  },
  "eps-to-png": {
    source: "EPS",
    target: "PNG",
    accept: ".eps,.ps,application/postscript",
    extension: "png",
    mimeType: "image/png",
  },
  "eps-to-jpg": {
    source: "EPS",
    target: "JPG",
    accept: ".eps,.ps,application/postscript",
    extension: "jpg",
    mimeType: "image/jpeg",
  },
} as const satisfies Record<string, ImageFormatConversionSpec>;

export type ImageFormatConverterKind = keyof typeof IMAGE_FORMAT_CONVERSIONS;
