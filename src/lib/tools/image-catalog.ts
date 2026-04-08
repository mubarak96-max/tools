import type { FreeToolMeta } from "@/types/tools";
import { IMAGE_FORMAT_CONVERSIONS, IMAGE_FORMAT_LABELS, type ImageFormatConversionSpec, type ImageFormatConverterKind } from "@/lib/tools/image-format-conversion";

type BaseImageTool = Omit<FreeToolMeta, "href" | "category"> & {
  slug: string;
  category: "Image";
};

type BaseImageKind =
    | "random-color-generator"
    | "image-to-base64"
    | "image-colors-inverter"
    | "flip-image-online"
    | "image-cropper-resizer"
    | "image-compressor"
    | "image-watermark"
    | "image-pixelator"
    | "image-blur-pixelate"
    | "paste-image-to-download"
    | "trim-transparent-pixels"
    | "add-borders-to-image"
    | "split-images-online"
    | "merge-images-online"
    | "pixel-art-converter"
    | "image-to-ascii-converter"
    | "online-collage-maker"
    | "laser-eyes-meme-generator"
    | "image-exif-viewer-metadata-remover"
    | "website-color-palette-extractor"
    | "website-screenshot-tool";

type NativeImageTool = BaseImageTool & {
  kind: BaseImageKind;
  conversion?: undefined;
};

type ImageFormatConverterTool = BaseImageTool & {
  kind: ImageFormatConverterKind;
  conversion: ImageFormatConversionSpec;
};

export type ImageTool = NativeImageTool | ImageFormatConverterTool;

const tool = (value: ImageTool) => value;

function createFormatTool(kind: ImageFormatConverterKind, conversion: ImageFormatConversionSpec): ImageFormatConverterTool {
  const sourceLabel = IMAGE_FORMAT_LABELS[conversion.source];
  const targetLabel = IMAGE_FORMAT_LABELS[conversion.target];

  return {
    slug: kind,
    name: `${sourceLabel} to ${targetLabel} Converter`,
    description: `Convert ${sourceLabel} files into ${targetLabel} format online and download the converted image directly in the browser.`,
    category: "Image",
    icon: "CNV",
    kind,
    conversion,
  };
}

export const IMAGE_TOOLS = [
  tool({
    slug: "random-color-generator",
    name: "Random Color Generator",
    description: "Generate random colors and quick palette sets with copyable hex values for design work.",
    category: "Image",
    icon: "CLR",
    kind: "random-color-generator",
  }),
  tool({
    slug: "image-to-base64",
    name: "Image to Base64 Converter",
    description: "Convert an uploaded image into a Base64 string or data URL directly in the browser.",
    category: "Image",
    icon: "B64",
    kind: "image-to-base64",
  }),
  tool({
    slug: "image-colors-inverter",
    name: "Image Colors Inverter",
    description: "Invert the colors of an uploaded image and download the result instantly.",
    category: "Image",
    icon: "INV",
    kind: "image-colors-inverter",
  }),
  tool({
    slug: "flip-image-online",
    name: "Flip Image Online",
    description: "Flip an image horizontally or vertically in the browser and download the updated version.",
    category: "Image",
    icon: "FLIP",
    kind: "flip-image-online",
  }),
  tool({
    slug: "image-cropper-resizer",
    name: "Image Cropper & Resizer",
    description: "Crop an uploaded image to a selected region, resize it, and download the updated file in the browser.",
    category: "Image",
    icon: "CROP",
    kind: "image-cropper-resizer",
  }),
  tool({
    slug: "image-compressor",
    name: "Image Compressor",
    description: "Compress an uploaded image with quality and format controls, then download the smaller file.",
    category: "Image",
    icon: "COMP",
    kind: "image-compressor",
  }),
  tool({
    slug: "image-watermark",
    name: "Image Watermark",
    description: "Add a text watermark to an image, preview it, and download the updated result.",
    category: "Image",
    icon: "MARK",
    kind: "image-watermark",
  }),
  tool({
    slug: "image-pixelator",
    name: "Image Pixelator",
    description: "Turn an image into a chunkier pixelated version with adjustable block size.",
    category: "Image",
    icon: "PXL",
    kind: "image-pixelator",
  }),
  tool({
    slug: "image-blur-pixelate",
    name: "Image Blur & Pixelate",
    description: "Apply blur, pixelation, or both to an image, preview the result, and download it.",
    category: "Image",
    icon: "BLUR",
    kind: "image-blur-pixelate",
  }),
  tool({
    slug: "paste-image-to-download",
    name: "Paste Image to Download",
    description: "Paste an image from the clipboard, preview it instantly, and download it as a file.",
    category: "Image",
    icon: "PASTE",
    kind: "paste-image-to-download",
  }),
  tool({
    slug: "trim-transparent-pixels",
    name: "Trim Transparent Pixels",
    description: "Automatically crop away transparent edges from an uploaded PNG and download the trimmed image.",
    category: "Image",
    icon: "TRIM",
    kind: "trim-transparent-pixels",
  }),
  tool({
    slug: "add-borders-to-image",
    name: "Add Borders to Image",
    description: "Add a solid border around an image with adjustable size and color, then download the result.",
    category: "Image",
    icon: "BORD",
    kind: "add-borders-to-image",
  }),
  tool({
    slug: "split-images-online",
    name: "Split Images Online",
    description: "Split an uploaded image into rows and columns, then download the individual pieces separately.",
    category: "Image",
    icon: "SPLIT",
    kind: "split-images-online",
  }),
  tool({
    slug: "merge-images-online",
    name: "Merge Images Online",
    description: "Merge multiple uploaded images into one combined image with vertical or horizontal layout controls.",
    category: "Image",
    icon: "MERGE",
    kind: "merge-images-online",
  }),
  tool({
    slug: "pixel-art-converter",
    name: "Pixel Art Converter",
    description: "Turn an uploaded image into a simpler pixel-art style version with adjustable block size and color levels.",
    category: "Image",
    icon: "ART",
    kind: "pixel-art-converter",
  }),
  tool({
    slug: "image-to-ascii-converter",
    name: "Image to ASCII Converter",
    description: "Convert an uploaded image into ASCII art text directly in the browser and copy the result.",
    category: "Image",
    icon: "ASCII",
    kind: "image-to-ascii-converter",
  }),
  tool({
    slug: "online-collage-maker",
    name: "Online Collage Maker",
    description: "Arrange multiple uploaded images into a simple collage grid with spacing and background controls.",
    category: "Image",
    icon: "COLL",
    kind: "online-collage-maker",
  }),
  tool({
    slug: "laser-eyes-meme-generator",
    name: "Laser Eyes Meme Generator",
    description: "Add glowing laser eyes to a photo with adjustable eye positions and beam styling, then download the meme.",
    category: "Image",
    icon: "LASER",
    kind: "laser-eyes-meme-generator",
  }),
  tool({
    slug: "image-exif-viewer-metadata-remover",
    name: "Image EXIF Viewer & Metadata Remover",
    description: "Inspect readable EXIF metadata from an uploaded image and export a metadata-stripped version.",
    category: "Image",
    icon: "EXIF",
    kind: "image-exif-viewer-metadata-remover",
  }),
  tool({
    slug: "website-color-palette-extractor",
    name: "Website Color & Palette Extractor",
    description: "Fetch a website URL, extract recurring interface colors, and turn them into a copyable palette.",
    category: "Image",
    icon: "PAL",
    kind: "website-color-palette-extractor",
  }),
  tool({
    slug: "website-screenshot-tool",
    name: "Website Screenshot Tool",
    description: "Capture a screenshot of a website URL with browser rendering controls and download the resulting image.",
    category: "Image",
    icon: "SHOT",
    kind: "website-screenshot-tool",
  }),
  ...Object.entries(IMAGE_FORMAT_CONVERSIONS).map(([kind, conversion]) => createFormatTool(kind as ImageFormatConverterKind, conversion)),
] as const;

export const IMAGE_TOOL_MAP = Object.fromEntries(IMAGE_TOOLS.map((entry) => [entry.slug, entry])) as Record<string, ImageTool>;

export const IMAGE_TOOL_REGISTRY: FreeToolMeta[] = IMAGE_TOOLS.map((entry) => ({
  name: entry.name,
  href: `/image/${entry.slug}`,
  description: entry.description,
  category: entry.category,
  icon: entry.icon,
}));
