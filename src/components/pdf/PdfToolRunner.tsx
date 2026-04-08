"use client";

import type { PdfTool } from "@/lib/tools/pdf-catalog";

import AddPageNumbersTool from "@/components/pdf/AddPageNumbersTool";
import AddWatermarkTool from "@/components/pdf/AddWatermarkTool";
import ComparePdfTool from "@/components/pdf/ComparePdfTool";
import CompressPdfTool from "@/components/pdf/CompressPdfTool";
import CropPdfTool from "@/components/pdf/CropPdfTool";
import ExcelToPdfTool from "@/components/pdf/ExcelToPdfTool";
import ExtractPagesTool from "@/components/pdf/ExtractPagesTool";
import HtmlToPdfTool from "@/components/pdf/HtmlToPdfTool";
import JpgToPdfTool from "@/components/pdf/JpgToPdfTool";
import MergePdfTool from "@/components/pdf/MergePdfTool";
import OrganizePdfTool from "@/components/pdf/OrganizePdfTool";
import PdfToPdfaTool from "@/components/pdf/PdfToPdfaTool";
import PowerpointToPdfTool from "@/components/pdf/PowerpointToPdfTool";
import ProtectPdfTool from "@/components/pdf/ProtectPdfTool";
import RemovePagesTool from "@/components/pdf/RemovePagesTool";
import RotatePdfTool from "@/components/pdf/RotatePdfTool";
import SignPdfTool from "@/components/pdf/SignPdfTool";
import SplitPdfTool from "@/components/pdf/SplitPdfTool";
import UnlockPdfTool from "@/components/pdf/UnlockPdfTool";
import WordToPdfTool from "@/components/pdf/WordToPdfTool";

export default function PdfToolRunner({ tool }: { tool: PdfTool }) {
  switch (tool.kind) {
    case "merge-pdf":
      return <MergePdfTool />;
    case "split-pdf":
      return <SplitPdfTool />;
    case "remove-pages":
      return <RemovePagesTool />;
    case "extract-pages":
      return <ExtractPagesTool />;
    case "rotate-pdf":
      return <RotatePdfTool />;
    case "add-page-numbers":
      return <AddPageNumbersTool />;
    case "add-watermark":
      return <AddWatermarkTool />;
    case "jpg-to-pdf":
      return <JpgToPdfTool />;
    case "protect-pdf":
      return <ProtectPdfTool />;
    case "unlock-pdf":
      return <UnlockPdfTool />;
    case "organize-pdf":
      return <OrganizePdfTool />;
    case "crop-pdf":
      return <CropPdfTool />;
    case "sign-pdf":
      return <SignPdfTool />;
    case "compress-pdf":
      return <CompressPdfTool />;
    case "html-to-pdf":
      return <HtmlToPdfTool />;
    case "compare-pdf":
      return <ComparePdfTool />;
    case "word-to-pdf":
      return <WordToPdfTool />;
    case "powerpoint-to-pdf":
      return <PowerpointToPdfTool />;
    case "excel-to-pdf":
      return <ExcelToPdfTool />;
    case "pdf-to-pdfa":
      return <PdfToPdfaTool />;
    default:
      return null;
  }
}
