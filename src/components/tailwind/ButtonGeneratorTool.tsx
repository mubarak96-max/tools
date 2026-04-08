"use client";

import { useState } from "react";

import { CodePanel, TailwindCard, TailwindField, TailwindInput, TailwindSelect } from "@/components/tailwind/shared";
import { TAILWIND_COLOR_FAMILIES, TAILWIND_RADII, TAILWIND_SHADOWS, TAILWIND_SHADES, colorHex, colorToken, type TailwindColorFamily } from "@/lib/tools/tailwind";

function nextShade(shade: number) {
  const index = TAILWIND_SHADES.indexOf(shade);
  return TAILWIND_SHADES[Math.min(TAILWIND_SHADES.length - 1, index + 1)] ?? shade;
}

export default function ButtonGeneratorTool() {
  const [label, setLabel] = useState("Get started");
  const [family, setFamily] = useState<TailwindColorFamily>("indigo");
  const [shade, setShade] = useState(600);
  const [radius, setRadius] = useState("rounded-xl");
  const [shadow, setShadow] = useState<keyof typeof TAILWIND_SHADOWS>("md");
  const [size, setSize] = useState("md");
  const [outlined, setOutlined] = useState(false);

  const hoverShade = nextShade(shade);
  const sizeClasses: Record<string, string> = {
    sm: "px-3 py-2 text-sm",
    md: "px-5 py-3 text-sm",
    lg: "px-6 py-3.5 text-base",
  };

  const tailwindClass = [
    "inline-flex items-center justify-center font-semibold transition-colors",
    radius,
    sizeClasses[size],
    outlined
      ? `border ${colorToken("border", family, shade)} ${colorToken("text", family, shade)} bg-white hover:${colorToken("bg", family, 50)}`
      : `${colorToken("bg", family, shade)} ${shadow !== "none" ? TAILWIND_SHADOWS[shadow].className : ""} text-white hover:${colorToken("bg", family, hoverShade)}`,
  ]
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  const cssOutput = [
    `background-color: ${outlined ? "#ffffff" : colorHex(family, shade)};`,
    `color: ${outlined ? colorHex(family, shade) : "#ffffff"};`,
    `border-radius: ${TAILWIND_RADII.find((entry) => entry.className === radius)?.css ?? "0.75rem"};`,
    `padding: ${size === "sm" ? "0.5rem 0.75rem" : size === "md" ? "0.75rem 1.25rem" : "0.875rem 1.5rem"};`,
    `font-weight: 600;`,
    outlined ? `border: 1px solid ${colorHex(family, shade)};` : `box-shadow: ${TAILWIND_SHADOWS[shadow].css};`,
  ].join("\n");

  return (
    <div className="space-y-6">
      <TailwindCard>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <TailwindField label="Button label">
            <TailwindInput value={label} onChange={(event) => setLabel(event.target.value)} />
          </TailwindField>
          <TailwindField label="Accent color">
            <div className="grid grid-cols-2 gap-2">
              <TailwindSelect value={family} onChange={(event) => setFamily(event.target.value as TailwindColorFamily)}>
                {TAILWIND_COLOR_FAMILIES.map((entry) => (
                  <option key={entry} value={entry}>
                    {entry}
                  </option>
                ))}
              </TailwindSelect>
              <TailwindSelect value={shade} onChange={(event) => setShade(Number(event.target.value))}>
                {TAILWIND_SHADES.map((entry) => (
                  <option key={entry} value={entry}>
                    {entry}
                  </option>
                ))}
              </TailwindSelect>
            </div>
          </TailwindField>
          <TailwindField label="Radius and size">
            <div className="grid grid-cols-2 gap-2">
              <TailwindSelect value={radius} onChange={(event) => setRadius(event.target.value)}>
                {TAILWIND_RADII.map((entry) => (
                  <option key={entry.className} value={entry.className}>
                    {entry.label}
                  </option>
                ))}
              </TailwindSelect>
              <TailwindSelect value={size} onChange={(event) => setSize(event.target.value)}>
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </TailwindSelect>
            </div>
          </TailwindField>
          <TailwindField label="Variant">
            <div className="space-y-2">
              <TailwindSelect value={shadow} onChange={(event) => setShadow(event.target.value as keyof typeof TAILWIND_SHADOWS)}>
                {Object.keys(TAILWIND_SHADOWS).map((entry) => (
                  <option key={entry} value={entry}>
                    Shadow {entry}
                  </option>
                ))}
              </TailwindSelect>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input type="checkbox" checked={outlined} onChange={(event) => setOutlined(event.target.checked)} />
                Use outlined style
              </label>
            </div>
          </TailwindField>
        </div>
      </TailwindCard>

      <TailwindCard>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Preview</h2>
        <div className="mt-6 flex flex-wrap gap-4 rounded-[1.75rem] border border-border bg-slate-50 p-8">
          <button
            type="button"
            className="inline-flex items-center justify-center font-semibold"
            style={{
              backgroundColor: outlined ? "#ffffff" : colorHex(family, shade),
              color: outlined ? colorHex(family, shade) : "#ffffff",
              borderRadius: TAILWIND_RADII.find((entry) => entry.className === radius)?.css,
              padding: size === "sm" ? "0.5rem 0.75rem" : size === "md" ? "0.75rem 1.25rem" : "0.875rem 1.5rem",
              border: outlined ? `1px solid ${colorHex(family, shade)}` : "none",
              boxShadow: outlined ? "none" : TAILWIND_SHADOWS[shadow].css,
            }}
          >
            {label}
          </button>
        </div>
      </TailwindCard>

      <div className="grid gap-4 xl:grid-cols-2">
        <CodePanel title="Tailwind classes" value={tailwindClass} />
        <CodePanel title="CSS output" value={cssOutput} />
      </div>
      <CodePanel title="HTML snippet" value={`<button class="${tailwindClass}">${label}</button>`} />
    </div>
  );
}
