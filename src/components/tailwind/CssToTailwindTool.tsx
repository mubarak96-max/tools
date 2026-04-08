"use client";

import { useState } from "react";

import { CodePanel, TailwindCard, TailwindField, TailwindTextarea } from "@/components/tailwind/shared";
import { convertCssToTailwind } from "@/lib/tools/tailwind";

export default function CssToTailwindTool() {
  const [input, setInput] = useState(`display: flex;
justify-content: space-between;
align-items: center;
gap: 16px;
padding: 24px;
background-color: #ffffff;
border-radius: 16px;
box-shadow: 0 10px 15px -3px rgb(15 23 42 / 0.14), 0 4px 6px -4px rgb(15 23 42 / 0.14);`);

  const result = convertCssToTailwind(input);

  return (
    <div className="space-y-6">
      <TailwindCard>
        <TailwindField label="Paste CSS declarations">
          <TailwindTextarea value={input} onChange={(event) => setInput(event.target.value)} className="min-h-[240px] font-mono" />
        </TailwindField>
      </TailwindCard>

      <div className="grid gap-4 xl:grid-cols-2">
        <CodePanel title="Tailwind classes" value={result.classes.join(" ") || "No supported classes detected yet."} />
        <CodePanel title="Unsupported declarations" value={result.unsupported.join("\n") || "None"} />
      </div>
    </div>
  );
}
