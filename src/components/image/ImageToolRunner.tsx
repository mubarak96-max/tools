"use client";

import type { ImageTool } from "@/lib/tools/image-catalog";

import AddBordersToImageTool from "@/components/image/AddBordersToImageTool";
import FlipImageOnlineTool from "@/components/image/FlipImageOnlineTool";
import ImageExifViewerTool from "@/components/image/ImageExifViewerTool";
import ImageFormatConverterTool from "@/components/image/ImageFormatConverterTool";
import ImageToAsciiConverterTool from "@/components/image/ImageToAsciiConverterTool";
import ImageBlurPixelateTool from "@/components/image/ImageBlurPixelateTool";
import ImageCropperResizerTool from "@/components/image/ImageCropperResizerTool";
import ImageColorsInverterTool from "@/components/image/ImageColorsInverterTool";
import ImageCompressorTool from "@/components/image/ImageCompressorTool";
import ImagePixelatorTool from "@/components/image/ImagePixelatorTool";
import ImageToBase64Tool from "@/components/image/ImageToBase64Tool";
import ImageWatermarkTool from "@/components/image/ImageWatermarkTool";
import LaserEyesMemeGeneratorTool from "@/components/image/LaserEyesMemeGeneratorTool";
import MergeImagesOnlineTool from "@/components/image/MergeImagesOnlineTool";
import OnlineCollageMakerTool from "@/components/image/OnlineCollageMakerTool";
import PasteImageToDownloadTool from "@/components/image/PasteImageToDownloadTool";
import PixelArtConverterTool from "@/components/image/PixelArtConverterTool";
import RandomColorGeneratorTool from "@/components/image/RandomColorGeneratorTool";
import SplitImagesOnlineTool from "@/components/image/SplitImagesOnlineTool";
import TrimTransparentPixelsTool from "@/components/image/TrimTransparentPixelsTool";
import WebsiteColorPaletteExtractorTool from "@/components/image/WebsiteColorPaletteExtractorTool";
import WebsiteScreenshotTool from "@/components/image/WebsiteScreenshotTool";

export default function ImageToolRunner({ tool }: { tool: ImageTool }) {
  if (tool.conversion) {
    return <ImageFormatConverterTool tool={tool} />;
  }

  switch (tool.kind) {
    case "random-color-generator":
      return <RandomColorGeneratorTool />;
    case "image-to-base64":
      return <ImageToBase64Tool />;
    case "image-colors-inverter":
      return <ImageColorsInverterTool />;
    case "flip-image-online":
      return <FlipImageOnlineTool />;
    case "image-cropper-resizer":
      return <ImageCropperResizerTool />;
    case "image-compressor":
      return <ImageCompressorTool />;
    case "image-watermark":
      return <ImageWatermarkTool />;
    case "image-pixelator":
      return <ImagePixelatorTool />;
    case "image-blur-pixelate":
      return <ImageBlurPixelateTool />;
    case "paste-image-to-download":
      return <PasteImageToDownloadTool />;
    case "trim-transparent-pixels":
      return <TrimTransparentPixelsTool />;
    case "add-borders-to-image":
      return <AddBordersToImageTool />;
    case "split-images-online":
      return <SplitImagesOnlineTool />;
    case "merge-images-online":
      return <MergeImagesOnlineTool />;
    case "pixel-art-converter":
      return <PixelArtConverterTool />;
    case "image-to-ascii-converter":
      return <ImageToAsciiConverterTool />;
    case "online-collage-maker":
      return <OnlineCollageMakerTool />;
    case "laser-eyes-meme-generator":
      return <LaserEyesMemeGeneratorTool />;
    case "image-exif-viewer-metadata-remover":
      return <ImageExifViewerTool />;
    case "website-color-palette-extractor":
      return <WebsiteColorPaletteExtractorTool />;
    case "website-screenshot-tool":
      return <WebsiteScreenshotTool />;
    default:
      return null;
  }
}
