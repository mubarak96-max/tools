"use client";

import { useState } from "react";

import { CodePanel, TailwindCard, TailwindField, TailwindInput, TailwindSelect } from "@/components/tailwind/shared";
import { TAILWIND_SHADOWS, shadowArbitraryClass, shadowCssValue } from "@/lib/tools/tailwind";

export default function ShadowGeneratorTool() {
  const [mode, setMode] = useState<keyof typeof TAILWIND_SHADOWS | "custom">("lg");
  const [x, setX] = useState(0);
  const [y, setY] = useState(18);
  const [blur, setBlur] = useState(40);
  const [spread, setSpread] = useState(-16);
  const [hex, setHex] = useState("#0f172a");
  const [opacity, setOpacity] = useState(0.18);

  const previewShadow = mode === "custom" ? shadowCssValue(x, y, blur, spread, hex, opacity) : TAILWIND_SHADOWS[mode].css;
  const tailwindClass = mode === "custom" ? shadowArbitraryClass(x, y, blur, spread, hex, opacity) : TAILWIND_SHADOWS[mode].className;
  const cssValue = `box-shadow: ${previewShadow};`;

  return (
    <div className="space-y-6">
      <TailwindCard>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <TailwindField label="Shadow mode">
            <TailwindSelect value={mode} onChange={(event) => setMode(event.target.value as keyof typeof TAILWIND_SHADOWS | "custom")}>
              <option value="none">None</option>
              <option value="sm">Preset sm</option>
              <option value="md">Preset md</option>
              <option value="lg">Preset lg</option>
              <option value="xl">Preset xl</option>
              <option value="2xl">Preset 2xl</option>
              <option value="inner">Preset inner</option>
              <option value="custom">Custom shadow</option>
            </TailwindSelect>
          </TailwindField>
          <TailwindField label="Color">
            <TailwindInput type="color" value={hex} onChange={(event) => setHex(event.target.value)} disabled={mode !== "custom"} className="h-12 p-2" />
          </TailwindField>
          <TailwindField label="Opacity">
            <TailwindInput type="number" min={0} max={1} step={0.01} value={opacity} onChange={(event) => setOpacity(Number(event.target.value))} disabled={mode !== "custom"} />
          </TailwindField>
          <TailwindField label="Offsets and blur">
            <div className="grid grid-cols-2 gap-2">
              <TailwindInput type="number" value={x} onChange={(event) => setX(Number(event.target.value))} disabled={mode !== "custom"} placeholder="X" />
              <TailwindInput type="number" value={y} onChange={(event) => setY(Number(event.target.value))} disabled={mode !== "custom"} placeholder="Y" />
              <TailwindInput type="number" value={blur} onChange={(event) => setBlur(Number(event.target.value))} disabled={mode !== "custom"} placeholder="Blur" />
              <TailwindInput type="number" value={spread} onChange={(event) => setSpread(Number(event.target.value))} disabled={mode !== "custom"} placeholder="Spread" />
            </div>
          </TailwindField>
        </div>
      </TailwindCard>

      <TailwindCard>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Preview</h2>
        <div className="mt-6 rounded-[2rem] border border-dashed border-border bg-slate-100 p-10">
          <div className="mx-auto max-w-sm rounded-[1.5rem] bg-white p-8" style={{ boxShadow: previewShadow }}>
            <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Shadow preview</p>
            <h3 className="mt-3 text-2xl font-semibold text-slate-900">Surface elevation</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Adjust the depth until the card feels distinct without becoming muddy or overly dramatic.
            </p>
          </div>
        </div>
      </TailwindCard>

      <div className="grid gap-4 xl:grid-cols-2">
        <CodePanel title="Tailwind class" value={tailwindClass} />
        <CodePanel title="CSS output" value={cssValue} />
      </div>
    </div>
  );
}
