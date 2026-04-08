"use client";

import { useState } from "react";

import { CodePanel, CopyButton, TailwindCard, TailwindField, TailwindInput } from "@/components/tailwind/shared";
import { TAILWIND_COLOR_FAMILIES, TAILWIND_SHADES, colorHex, colorToken } from "@/lib/tools/tailwind";

export default function TailwindColorsTool() {
  const [search, setSearch] = useState("");
  const families = TAILWIND_COLOR_FAMILIES.filter((family) => family.includes(search.trim().toLowerCase()));

  return (
    <div className="space-y-6">
      <TailwindCard>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Tailwind color scales</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Browse the palette, compare shades, and copy either the utility class or the raw hex value.
            </p>
          </div>
          <div className="w-full max-w-sm">
            <TailwindField label="Filter colors">
              <TailwindInput
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search a family like indigo or slate"
              />
            </TailwindField>
          </div>
        </div>
      </TailwindCard>

      {families.map((family) => (
        <TailwindCard key={family}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold capitalize tracking-tight text-foreground">{family}</h3>
              <p className="text-sm text-muted-foreground">Copy the shade you need for backgrounds, text, or borders.</p>
            </div>
          </div>
          <div className="space-y-3">
            {TAILWIND_SHADES.map((shade) => {
              const hex = colorHex(family, shade);
              return (
                <div key={shade} className="rounded-[1.25rem] border border-border bg-background p-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl border border-border" style={{ backgroundColor: hex }} />
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {family}-{shade}
                        </p>
                        <p className="text-sm text-muted-foreground">{hex}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <CopyButton value={hex} label="Hex" />
                      <CopyButton value={colorToken("bg", family, shade)} label="bg" />
                      <CopyButton value={colorToken("text", family, shade)} label="text" />
                      <CopyButton value={colorToken("border", family, shade)} label="border" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </TailwindCard>
      ))}

      <CodePanel title="Tip" value="Use lighter shades like 50 to 200 for surfaces, mid tones like 500 to 600 for accents, and darker shades like 700 to 900 for text or emphasis." />
    </div>
  );
}
