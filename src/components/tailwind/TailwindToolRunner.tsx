"use client";

import type { TailwindTool } from "@/lib/tools/tailwind-catalog";

import ButtonGeneratorTool from "@/components/tailwind/ButtonGeneratorTool";
import CardGeneratorTool from "@/components/tailwind/CardGeneratorTool";
import CssToTailwindTool from "@/components/tailwind/CssToTailwindTool";
import FlexboxGeneratorTool from "@/components/tailwind/FlexboxGeneratorTool";
import GradientGeneratorTool from "@/components/tailwind/GradientGeneratorTool";
import GridGeneratorTool from "@/components/tailwind/GridGeneratorTool";
import ShadowGeneratorTool from "@/components/tailwind/ShadowGeneratorTool";
import TailwindColorsTool from "@/components/tailwind/TailwindColorsTool";
import TailwindToCssTool from "@/components/tailwind/TailwindToCssTool";

export default function TailwindToolRunner({ tool }: { tool: TailwindTool }) {
  switch (tool.kind) {
    case "colors":
      return <TailwindColorsTool />;
    case "gradient":
      return <GradientGeneratorTool />;
    case "shadow":
      return <ShadowGeneratorTool />;
    case "button":
      return <ButtonGeneratorTool />;
    case "flexbox":
      return <FlexboxGeneratorTool />;
    case "grid":
      return <GridGeneratorTool />;
    case "card":
      return <CardGeneratorTool />;
    case "css-to-tailwind":
      return <CssToTailwindTool />;
    case "tailwind-to-css":
      return <TailwindToCssTool />;
  }
}
