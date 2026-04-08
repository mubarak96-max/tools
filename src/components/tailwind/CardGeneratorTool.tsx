"use client";

import { useState } from "react";

import { CodePanel, TailwindCard, TailwindField, TailwindInput, TailwindSelect, TailwindTextarea } from "@/components/tailwind/shared";
import { TAILWIND_COLOR_FAMILIES, TAILWIND_RADII, TAILWIND_SHADOWS, TAILWIND_SHADES, TAILWIND_SPACING_SCALE, colorHex, colorToken, type TailwindColorFamily } from "@/lib/tools/tailwind";

function spacing(token: string) {
  return TAILWIND_SPACING_SCALE[token] ?? token;
}

export default function CardGeneratorTool() {
  const [badge, setBadge] = useState("Featured");
  const [title, setTitle] = useState("Premium analytics card");
  const [body, setBody] = useState("Use this as a starting point for feature cards, dashboard panels, and product highlights in Tailwind projects.");
  const [buttonLabel, setButtonLabel] = useState("Learn more");
  const [family, setFamily] = useState<TailwindColorFamily>("indigo");
  const [shade, setShade] = useState(600);
  const [radius, setRadius] = useState("rounded-2xl");
  const [shadow, setShadow] = useState<keyof typeof TAILWIND_SHADOWS>("lg");
  const [padding, setPadding] = useState("6");

  const wrapperClass = `max-w-sm ${radius} bg-white p-${padding} ${TAILWIND_SHADOWS[shadow].className} border border-slate-200`;
  const htmlSnippet = `<article class="${wrapperClass}">
  <span class="inline-flex rounded-full ${colorToken("bg", family, 100)} px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${colorToken("text", family, shade)}">${badge}</span>
  <h3 class="mt-4 text-xl font-semibold text-slate-900">${title}</h3>
  <p class="mt-3 text-sm leading-6 text-slate-600">${body}</p>
  <button class="mt-6 inline-flex items-center rounded-xl ${colorToken("bg", family, shade)} px-4 py-2 text-sm font-semibold text-white">${buttonLabel}</button>
</article>`;

  return (
    <div className="space-y-6">
      <TailwindCard>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <TailwindField label="Badge">
            <TailwindInput value={badge} onChange={(event) => setBadge(event.target.value)} />
          </TailwindField>
          <TailwindField label="Title">
            <TailwindInput value={title} onChange={(event) => setTitle(event.target.value)} />
          </TailwindField>
          <TailwindField label="Button label">
            <TailwindInput value={buttonLabel} onChange={(event) => setButtonLabel(event.target.value)} />
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
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <TailwindField label="Body copy">
            <TailwindTextarea value={body} onChange={(event) => setBody(event.target.value)} className="min-h-[120px]" />
          </TailwindField>
          <TailwindField label="Radius">
            <TailwindSelect value={radius} onChange={(event) => setRadius(event.target.value)}>
              {TAILWIND_RADII.map((entry) => (
                <option key={entry.className} value={entry.className}>
                  {entry.label}
                </option>
              ))}
            </TailwindSelect>
          </TailwindField>
          <TailwindField label="Shadow and padding">
            <div className="grid grid-cols-2 gap-2">
              <TailwindSelect value={shadow} onChange={(event) => setShadow(event.target.value as keyof typeof TAILWIND_SHADOWS)}>
                {Object.keys(TAILWIND_SHADOWS).map((entry) => (
                  <option key={entry} value={entry}>
                    Shadow {entry}
                  </option>
                ))}
              </TailwindSelect>
              <TailwindSelect value={padding} onChange={(event) => setPadding(event.target.value)}>
                {["4", "5", "6", "8", "10"].map((entry) => (
                  <option key={entry} value={entry}>
                    p-{entry}
                  </option>
                ))}
              </TailwindSelect>
            </div>
          </TailwindField>
        </div>
      </TailwindCard>

      <TailwindCard>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Preview</h2>
        <div className="mt-6 rounded-[1.75rem] border border-dashed border-border bg-slate-50 p-8">
          <article
            className="max-w-sm bg-white"
            style={{
              borderRadius: TAILWIND_RADII.find((entry) => entry.className === radius)?.css,
              boxShadow: TAILWIND_SHADOWS[shadow].css,
              padding: spacing(padding),
              border: "1px solid #e2e8f0",
            }}
          >
            <span
              className="inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]"
              style={{ backgroundColor: colorHex(family, 100), color: colorHex(family, shade) }}
            >
              {badge}
            </span>
            <h3 className="mt-4 text-xl font-semibold text-slate-900">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{body}</p>
            <button
              type="button"
              className="mt-6 inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold text-white"
              style={{ backgroundColor: colorHex(family, shade) }}
            >
              {buttonLabel}
            </button>
          </article>
        </div>
      </TailwindCard>

      <div className="grid gap-4 xl:grid-cols-2">
        <CodePanel title="Card wrapper classes" value={wrapperClass} />
        <CodePanel title="HTML snippet" value={htmlSnippet} />
      </div>
    </div>
  );
}
