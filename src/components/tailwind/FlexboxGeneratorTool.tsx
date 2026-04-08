"use client";

import { useState } from "react";

import { CodePanel, TailwindCard, TailwindField, TailwindSelect } from "@/components/tailwind/shared";
import { TAILWIND_SPACING_SCALE } from "@/lib/tools/tailwind";

function spacing(token: string) {
  return TAILWIND_SPACING_SCALE[token] ?? token;
}

export default function FlexboxGeneratorTool() {
  const [direction, setDirection] = useState("row");
  const [justify, setJustify] = useState("between");
  const [items, setItems] = useState("center");
  const [wrap, setWrap] = useState("wrap");
  const [gap, setGap] = useState("4");

  const classString = `flex flex-${direction} justify-${justify} items-${items} flex-${wrap} gap-${gap}`;
  const cssOutput = [
    "display: flex;",
    `flex-direction: ${direction === "row" ? "row" : "column"};`,
    `justify-content: ${justify === "start" ? "flex-start" : justify === "end" ? "flex-end" : justify === "between" ? "space-between" : justify === "around" ? "space-around" : justify === "evenly" ? "space-evenly" : justify};`,
    `align-items: ${items === "start" ? "flex-start" : items === "end" ? "flex-end" : items};`,
    `flex-wrap: ${wrap === "wrap" ? "wrap" : "nowrap"};`,
    `gap: ${spacing(gap)};`,
  ].join("\n");

  return (
    <div className="space-y-6">
      <TailwindCard>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <TailwindField label="Direction">
            <TailwindSelect value={direction} onChange={(event) => setDirection(event.target.value)}>
              <option value="row">Row</option>
              <option value="col">Column</option>
            </TailwindSelect>
          </TailwindField>
          <TailwindField label="Justify">
            <TailwindSelect value={justify} onChange={(event) => setJustify(event.target.value)}>
              <option value="start">Start</option>
              <option value="center">Center</option>
              <option value="end">End</option>
              <option value="between">Between</option>
              <option value="around">Around</option>
              <option value="evenly">Evenly</option>
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
          <TailwindField label="Wrap">
            <TailwindSelect value={wrap} onChange={(event) => setWrap(event.target.value)}>
              <option value="wrap">Wrap</option>
              <option value="nowrap">No wrap</option>
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
        </div>
      </TailwindCard>

      <TailwindCard>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Preview</h2>
        <div
          className="mt-6 rounded-[1.75rem] border border-dashed border-border bg-slate-50 p-6"
          style={{
            display: "flex",
            flexDirection: direction === "row" ? "row" : "column",
            justifyContent: justify === "start" ? "flex-start" : justify === "end" ? "flex-end" : justify === "between" ? "space-between" : justify === "around" ? "space-around" : justify === "evenly" ? "space-evenly" : justify,
            alignItems: items === "start" ? "flex-start" : items === "end" ? "flex-end" : items,
            flexWrap: wrap === "wrap" ? "wrap" : "nowrap",
            gap: spacing(gap),
            minHeight: "220px",
          }}
        >
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="rounded-2xl bg-indigo-600 px-5 py-4 text-sm font-semibold text-white">
              Item {item}
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
