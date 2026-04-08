"use client";

import { useState } from "react";

import { CodePanel, TailwindCard, TailwindField, TailwindSelect } from "@/components/tailwind/shared";
import { TAILWIND_COLOR_FAMILIES, TAILWIND_SHADES, colorHex, colorToken, type TailwindColorFamily } from "@/lib/tools/tailwind";

function colorFamilyOptions() {
  return TAILWIND_COLOR_FAMILIES.map((family) => (
    <option key={family} value={family}>
      {family}
    </option>
  ));
}

function shadeOptions() {
  return TAILWIND_SHADES.map((shade) => (
    <option key={shade} value={shade}>
      {shade}
    </option>
  ));
}

export default function GradientGeneratorTool() {
  const [direction, setDirection] = useState("to-r");
  const [fromFamily, setFromFamily] = useState<TailwindColorFamily>("indigo");
  const [fromShade, setFromShade] = useState(500);
  const [viaEnabled, setViaEnabled] = useState(true);
  const [viaFamily, setViaFamily] = useState<TailwindColorFamily>("sky");
  const [viaShade, setViaShade] = useState(400);
  const [toFamily, setToFamily] = useState<TailwindColorFamily>("emerald");
  const [toShade, setToShade] = useState(500);

  const directionCssMap: Record<string, string> = {
    "to-r": "to right",
    "to-l": "to left",
    "to-t": "to top",
    "to-b": "to bottom",
    "to-tr": "to top right",
    "to-tl": "to top left",
    "to-br": "to bottom right",
    "to-bl": "to bottom left",
  };

  const fromHex = colorHex(fromFamily, fromShade);
  const viaHex = colorHex(viaFamily, viaShade);
  const toHex = colorHex(toFamily, toShade);
  const tailwindClass = [
    `bg-gradient-${direction}`,
    colorToken("from", fromFamily, fromShade),
    viaEnabled ? colorToken("via", viaFamily, viaShade) : null,
    colorToken("to", toFamily, toShade),
  ]
    .filter(Boolean)
    .join(" ");
  const cssValue = `background-image: linear-gradient(${directionCssMap[direction]}, ${viaEnabled ? `${fromHex}, ${viaHex}, ${toHex}` : `${fromHex}, ${toHex}`});`;

  return (
    <div className="space-y-6">
      <TailwindCard>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <TailwindField label="Direction">
            <TailwindSelect value={direction} onChange={(event) => setDirection(event.target.value)}>
              <option value="to-r">Left to right</option>
              <option value="to-l">Right to left</option>
              <option value="to-t">Bottom to top</option>
              <option value="to-b">Top to bottom</option>
              <option value="to-tr">Bottom left to top right</option>
              <option value="to-tl">Bottom right to top left</option>
              <option value="to-br">Top left to bottom right</option>
              <option value="to-bl">Top right to bottom left</option>
            </TailwindSelect>
          </TailwindField>
          <TailwindField label="From color">
            <div className="grid grid-cols-2 gap-2">
              <TailwindSelect value={fromFamily} onChange={(event) => setFromFamily(event.target.value as TailwindColorFamily)}>
                {colorFamilyOptions()}
              </TailwindSelect>
              <TailwindSelect value={fromShade} onChange={(event) => setFromShade(Number(event.target.value))}>
                {shadeOptions()}
              </TailwindSelect>
            </div>
          </TailwindField>
          <TailwindField label="Middle color">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input type="checkbox" checked={viaEnabled} onChange={(event) => setViaEnabled(event.target.checked)} />
                Include a via stop
              </label>
              <div className="grid grid-cols-2 gap-2">
                <TailwindSelect value={viaFamily} onChange={(event) => setViaFamily(event.target.value as TailwindColorFamily)} disabled={!viaEnabled}>
                  {colorFamilyOptions()}
                </TailwindSelect>
                <TailwindSelect value={viaShade} onChange={(event) => setViaShade(Number(event.target.value))} disabled={!viaEnabled}>
                  {shadeOptions()}
                </TailwindSelect>
              </div>
            </div>
          </TailwindField>
          <TailwindField label="To color">
            <div className="grid grid-cols-2 gap-2">
              <TailwindSelect value={toFamily} onChange={(event) => setToFamily(event.target.value as TailwindColorFamily)}>
                {colorFamilyOptions()}
              </TailwindSelect>
              <TailwindSelect value={toShade} onChange={(event) => setToShade(Number(event.target.value))}>
                {shadeOptions()}
              </TailwindSelect>
            </div>
          </TailwindField>
        </div>
      </TailwindCard>

      <TailwindCard>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Preview</h2>
        <div
          className="mt-5 rounded-[1.75rem] border border-border p-8 text-white"
          style={{ backgroundImage: cssValue.replace("background-image: ", "").replace(";", "") }}
        >
          <p className="text-sm uppercase tracking-[0.18em] text-white/70">Tailwind gradient preview</p>
          <h3 className="mt-4 text-3xl font-semibold">Build gradients faster</h3>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/85">
            Use this to test brand colors, hero backgrounds, section surfaces, and button gradients before you paste the final classes into your project.
          </p>
        </div>
      </TailwindCard>

      <div className="grid gap-4 xl:grid-cols-2">
        <CodePanel title="Tailwind classes" value={tailwindClass} />
        <CodePanel title="CSS output" value={cssValue} />
      </div>
    </div>
  );
}
