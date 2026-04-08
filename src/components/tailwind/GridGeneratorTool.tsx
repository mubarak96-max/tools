"use client";

import { useState } from "react";

import { CodePanel, TailwindCard, TailwindField, TailwindSelect } from "@/components/tailwind/shared";
import { TAILWIND_SPACING_SCALE } from "@/lib/tools/tailwind";

function spacing(token: string) {
  return TAILWIND_SPACING_SCALE[token] ?? token;
}

export default function GridGeneratorTool() {
  const [columns, setColumns] = useState("3");
  const [gap, setGap] = useState("4");
  const [items, setItems] = useState("stretch");
  const [justifyItems, setJustifyItems] = useState("stretch");

  const classString = `grid grid-cols-${columns} gap-${gap} items-${items} justify-items-${justifyItems}`;
  const cssOutput = [
    "display: grid;",
    `grid-template-columns: repeat(${columns}, minmax(0, 1fr));`,
    `gap: ${spacing(gap)};`,
    `align-items: ${items};`,
    `justify-items: ${justifyItems};`,
  ].join("\n");

  return (
    <div className="space-y-6">
      <TailwindCard>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <TailwindField label="Columns">
            <TailwindSelect value={columns} onChange={(event) => setColumns(event.target.value)}>
              {[2, 3, 4, 5, 6].map((entry) => (
                <option key={entry} value={entry}>
                  {entry} columns
                </option>
              ))}
            </TailwindSelect>
          </TailwindField>
          <TailwindField label="Gap">
            <TailwindSelect value={gap} onChange={(event) => setGap(event.target.value)}>
              {["2", "3", "4", "5", "6", "8"].map((entry) => (
                <option key={entry} value={entry}>
                  gap-{entry}
                </option>
              ))}
            </TailwindSelect>
          </TailwindField>
          <TailwindField label="Align items">
            <TailwindSelect value={items} onChange={(event) => setItems(event.target.value)}>
              <option value="start">Start</option>
              <option value="center">Center</option>
              <option value="end">End</option>
              <option value="stretch">Stretch</option>
            </TailwindSelect>
          </TailwindField>
          <TailwindField label="Justify items">
            <TailwindSelect value={justifyItems} onChange={(event) => setJustifyItems(event.target.value)}>
              <option value="start">Start</option>
              <option value="center">Center</option>
              <option value="end">End</option>
              <option value="stretch">Stretch</option>
            </TailwindSelect>
          </TailwindField>
        </div>
      </TailwindCard>

      <TailwindCard>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Preview</h2>
        <div
          className="mt-6 rounded-[1.75rem] border border-dashed border-border bg-slate-50 p-6"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            gap: spacing(gap),
            alignItems: items,
            justifyItems: justifyItems,
          }}
        >
          {Array.from({ length: Number(columns) * 2 }).map((_, index) => (
            <div key={index} className="rounded-2xl bg-white p-5 text-sm font-semibold text-slate-700 shadow-sm">
              Cell {index + 1}
            </div>
          ))}
        </div>
      </TailwindCard>

      <div className="grid gap-4 xl:grid-cols-2">
        <CodePanel title="Tailwind classes" value={classString} />
        <CodePanel title="CSS output" value={cssOutput} />
      </div>
    </div>
  );
}
