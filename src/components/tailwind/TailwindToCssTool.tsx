"use client";

import { useState } from "react";

import { CodePanel, TailwindCard, TailwindField, TailwindTextarea } from "@/components/tailwind/shared";
import { convertTailwindToCss } from "@/lib/tools/tailwind";

export default function TailwindToCssTool() {
  const [input, setInput] = useState("flex items-center justify-between gap-4 rounded-2xl bg-white p-6 shadow-lg");
  const result = convertTailwindToCss(input);

  return (
    <div className="space-y-6">
      <TailwindCard>
        <TailwindField label="Paste Tailwind classes">
          <TailwindTextarea value={input} onChange={(event) => setInput(event.target.value)} className="min-h-[200px] font-mono" />
        </TailwindField>
      </TailwindCard>

      <div className="grid gap-4 xl:grid-cols-2">
        <CodePanel title="CSS output" value={result.declarations.join("\n") || "No supported classes detected yet."} />
        <CodePanel title="Unsupported classes" value={result.unsupported.join("\n") || "None"} />
      </div>
    </div>
  );
}
