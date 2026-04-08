export const TAILWIND_PALETTE = {
  slate: { 50: "#f8fafc", 100: "#f1f5f9", 200: "#e2e8f0", 300: "#cbd5e1", 400: "#94a3b8", 500: "#64748b", 600: "#475569", 700: "#334155", 800: "#1e293b", 900: "#0f172a", 950: "#020617" },
  gray: { 50: "#f9fafb", 100: "#f3f4f6", 200: "#e5e7eb", 300: "#d1d5db", 400: "#9ca3af", 500: "#6b7280", 600: "#4b5563", 700: "#374151", 800: "#1f2937", 900: "#111827", 950: "#030712" },
  red: { 50: "#fef2f2", 100: "#fee2e2", 200: "#fecaca", 300: "#fca5a5", 400: "#f87171", 500: "#ef4444", 600: "#dc2626", 700: "#b91c1c", 800: "#991b1b", 900: "#7f1d1d", 950: "#450a0a" },
  orange: { 50: "#fff7ed", 100: "#ffedd5", 200: "#fed7aa", 300: "#fdba74", 400: "#fb923c", 500: "#f97316", 600: "#ea580c", 700: "#c2410c", 800: "#9a3412", 900: "#7c2d12", 950: "#431407" },
  amber: { 50: "#fffbeb", 100: "#fef3c7", 200: "#fde68a", 300: "#fcd34d", 400: "#fbbf24", 500: "#f59e0b", 600: "#d97706", 700: "#b45309", 800: "#92400e", 900: "#78350f", 950: "#451a03" },
  yellow: { 50: "#fefce8", 100: "#fef9c3", 200: "#fef08a", 300: "#fde047", 400: "#facc15", 500: "#eab308", 600: "#ca8a04", 700: "#a16207", 800: "#854d0e", 900: "#713f12", 950: "#422006" },
  green: { 50: "#f0fdf4", 100: "#dcfce7", 200: "#bbf7d0", 300: "#86efac", 400: "#4ade80", 500: "#22c55e", 600: "#16a34a", 700: "#15803d", 800: "#166534", 900: "#14532d", 950: "#052e16" },
  emerald: { 50: "#ecfdf5", 100: "#d1fae5", 200: "#a7f3d0", 300: "#6ee7b7", 400: "#34d399", 500: "#10b981", 600: "#059669", 700: "#047857", 800: "#065f46", 900: "#064e3b", 950: "#022c22" },
  teal: { 50: "#f0fdfa", 100: "#ccfbf1", 200: "#99f6e4", 300: "#5eead4", 400: "#2dd4bf", 500: "#14b8a6", 600: "#0d9488", 700: "#0f766e", 800: "#115e59", 900: "#134e4a", 950: "#042f2e" },
  cyan: { 50: "#ecfeff", 100: "#cffafe", 200: "#a5f3fc", 300: "#67e8f9", 400: "#22d3ee", 500: "#06b6d4", 600: "#0891b2", 700: "#0e7490", 800: "#155e75", 900: "#164e63", 950: "#083344" },
  sky: { 50: "#f0f9ff", 100: "#e0f2fe", 200: "#bae6fd", 300: "#7dd3fc", 400: "#38bdf8", 500: "#0ea5e9", 600: "#0284c7", 700: "#0369a1", 800: "#075985", 900: "#0c4a6e", 950: "#082f49" },
  blue: { 50: "#eff6ff", 100: "#dbeafe", 200: "#bfdbfe", 300: "#93c5fd", 400: "#60a5fa", 500: "#3b82f6", 600: "#2563eb", 700: "#1d4ed8", 800: "#1e40af", 900: "#1e3a8a", 950: "#172554" },
  indigo: { 50: "#eef2ff", 100: "#e0e7ff", 200: "#c7d2fe", 300: "#a5b4fc", 400: "#818cf8", 500: "#6366f1", 600: "#4f46e5", 700: "#4338ca", 800: "#3730a3", 900: "#312e81", 950: "#1e1b4b" },
  violet: { 50: "#f5f3ff", 100: "#ede9fe", 200: "#ddd6fe", 300: "#c4b5fd", 400: "#a78bfa", 500: "#8b5cf6", 600: "#7c3aed", 700: "#6d28d9", 800: "#5b21b6", 900: "#4c1d95", 950: "#2e1065" },
  purple: { 50: "#faf5ff", 100: "#f3e8ff", 200: "#e9d5ff", 300: "#d8b4fe", 400: "#c084fc", 500: "#a855f7", 600: "#9333ea", 700: "#7e22ce", 800: "#6b21a8", 900: "#581c87", 950: "#3b0764" },
  pink: { 50: "#fdf2f8", 100: "#fce7f3", 200: "#fbcfe8", 300: "#f9a8d4", 400: "#f472b6", 500: "#ec4899", 600: "#db2777", 700: "#be185d", 800: "#9d174d", 900: "#831843", 950: "#500724" },
  rose: { 50: "#fff1f2", 100: "#ffe4e6", 200: "#fecdd3", 300: "#fda4af", 400: "#fb7185", 500: "#f43f5e", 600: "#e11d48", 700: "#be123c", 800: "#9f1239", 900: "#881337", 950: "#4c0519" },
} as const;

export type TailwindColorFamily = keyof typeof TAILWIND_PALETTE;
export type TailwindShade = keyof (typeof TAILWIND_PALETTE)["slate"];

export const TAILWIND_COLOR_FAMILIES = Object.keys(TAILWIND_PALETTE) as TailwindColorFamily[];
export const TAILWIND_SHADES = Object.keys(TAILWIND_PALETTE.slate).map(Number) as Array<number>;

export const TAILWIND_SHADOWS = {
  none: { className: "shadow-none", css: "none" },
  sm: { className: "shadow-sm", css: "0 1px 2px 0 rgb(15 23 42 / 0.08)" },
  md: { className: "shadow-md", css: "0 4px 6px -1px rgb(15 23 42 / 0.12), 0 2px 4px -2px rgb(15 23 42 / 0.12)" },
  lg: { className: "shadow-lg", css: "0 10px 15px -3px rgb(15 23 42 / 0.14), 0 4px 6px -4px rgb(15 23 42 / 0.14)" },
  xl: { className: "shadow-xl", css: "0 20px 25px -5px rgb(15 23 42 / 0.16), 0 8px 10px -6px rgb(15 23 42 / 0.16)" },
  "2xl": { className: "shadow-2xl", css: "0 25px 50px -12px rgb(15 23 42 / 0.22)" },
  inner: { className: "shadow-inner", css: "inset 0 2px 4px 0 rgb(15 23 42 / 0.08)" },
} as const;

export const TAILWIND_RADII = [
  { label: "Rounded none", className: "rounded-none", css: "0px" },
  { label: "Rounded md", className: "rounded-md", css: "0.375rem" },
  { label: "Rounded lg", className: "rounded-lg", css: "0.5rem" },
  { label: "Rounded xl", className: "rounded-xl", css: "0.75rem" },
  { label: "Rounded 2xl", className: "rounded-2xl", css: "1rem" },
  { label: "Rounded 3xl", className: "rounded-3xl", css: "1.5rem" },
  { label: "Rounded full", className: "rounded-full", css: "9999px" },
] as const;

export const TAILWIND_SPACING_SCALE: Record<string, string> = {
  "0": "0px",
  px: "1px",
  "0.5": "0.125rem",
  "1": "0.25rem",
  "1.5": "0.375rem",
  "2": "0.5rem",
  "2.5": "0.625rem",
  "3": "0.75rem",
  "3.5": "0.875rem",
  "4": "1rem",
  "5": "1.25rem",
  "6": "1.5rem",
  "7": "1.75rem",
  "8": "2rem",
  "9": "2.25rem",
  "10": "2.5rem",
  "11": "2.75rem",
  "12": "3rem",
  "14": "3.5rem",
  "16": "4rem",
};

const REVERSE_SPACING = Object.fromEntries(Object.entries(TAILWIND_SPACING_SCALE).map(([key, value]) => [value, key]));

export function colorHex(family: TailwindColorFamily, shade: number) {
  return TAILWIND_PALETTE[family][shade as TailwindShade];
}

export function colorToken(prefix: string, family: TailwindColorFamily, shade: number) {
  return `${prefix}-${family}-${shade}`;
}

export function normalizeHex(value: string) {
  const trimmed = value.trim().toLowerCase();
  if (!trimmed.startsWith("#")) {
    return `#${trimmed}`;
  }
  return trimmed;
}

export function findPaletteMatch(hex: string) {
  const normalized = normalizeHex(hex);

  for (const family of TAILWIND_COLOR_FAMILIES) {
    for (const shade of TAILWIND_SHADES) {
      if (TAILWIND_PALETTE[family][shade as TailwindShade] === normalized) {
        return { family, shade };
      }
    }
  }

  return null;
}

function rgbaToString(red: number, green: number, blue: number, alpha: number) {
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export function hexToRgb(hex: string) {
  const normalized = normalizeHex(hex).replace("#", "");
  const expanded = normalized.length === 3 ? normalized.split("").map((char) => `${char}${char}`).join("") : normalized;
  const red = Number.parseInt(expanded.slice(0, 2), 16);
  const green = Number.parseInt(expanded.slice(2, 4), 16);
  const blue = Number.parseInt(expanded.slice(4, 6), 16);
  return { red, green, blue };
}

export function shadowArbitraryClass(x: number, y: number, blur: number, spread: number, hex: string, opacity: number) {
  const { red, green, blue } = hexToRgb(hex);
  const rgba = rgbaToString(red, green, blue, opacity);
  const value = `${x}px_${y}px_${blur}px_${spread}px_${rgba.replaceAll(" ", "_")}`;
  return `shadow-[${value}]`;
}

export function shadowCssValue(x: number, y: number, blur: number, spread: number, hex: string, opacity: number) {
  const { red, green, blue } = hexToRgb(hex);
  return `${x}px ${y}px ${blur}px ${spread}px ${rgbaToString(red, green, blue, opacity)}`;
}

export function arbitraryColorClass(prefix: "bg" | "text" | "border" | "from" | "via" | "to", hex: string) {
  return `${prefix}-[${normalizeHex(hex)}]`;
}

function toRem(value: number) {
  return `${value / 16}rem`;
}

function parseLength(value: string) {
  const trimmed = value.trim().toLowerCase();
  if (trimmed === "0") {
    return "0px";
  }
  if (trimmed.endsWith("px")) {
    const numeric = Number.parseFloat(trimmed);
    return `${numeric}px`;
  }
  if (trimmed.endsWith("rem")) {
    return trimmed;
  }
  return trimmed;
}

function spacingTokenFromLength(value: string) {
  const parsed = parseLength(value);
  return REVERSE_SPACING[parsed] ?? null;
}

function arbitraryLength(prefix: string, value: string) {
  return `${prefix}-[${value.trim().replaceAll(" ", "_")}]`;
}

function cssToken(prefix: string, value: string) {
  const token = spacingTokenFromLength(value);
  return token ? `${prefix}-${token}` : arbitraryLength(prefix, value);
}

function mapColorDeclaration(prefix: "bg" | "text" | "border", value: string) {
  const normalized = normalizeHex(value);
  const match = findPaletteMatch(normalized);
  return match ? `${prefix}-${match.family}-${match.shade}` : arbitraryColorClass(prefix, normalized);
}

function mapRadius(value: string) {
  const normalized = parseLength(value);
  const radius = TAILWIND_RADII.find((entry) => entry.css === normalized);
  return radius ? radius.className : arbitraryLength("rounded", normalized);
}

function mapShadow(value: string) {
  const found = Object.values(TAILWIND_SHADOWS).find((entry) => entry.css === value.trim());
  return found ? found.className : `shadow-[${value.trim().replaceAll(" ", "_")}]`;
}

function parseCssDeclarations(input: string) {
  const body = input.includes("{") && input.includes("}") ? input.slice(input.indexOf("{") + 1, input.lastIndexOf("}")) : input;
  return body
    .split(";")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [property, ...rest] = line.split(":");
      return { property: property.trim().toLowerCase(), value: rest.join(":").trim() };
    })
    .filter((entry) => entry.property && entry.value);
}

export function convertCssToTailwind(input: string) {
  const declarations = parseCssDeclarations(input);
  const classes: string[] = [];
  const unsupported: string[] = [];

  const push = (value: string | null) => {
    if (value && !classes.includes(value)) {
      classes.push(value);
    }
  };

  for (const declaration of declarations) {
    switch (declaration.property) {
      case "display":
        push(
          declaration.value === "flex"
            ? "flex"
            : declaration.value === "grid"
              ? "grid"
              : declaration.value === "block"
                ? "block"
                : declaration.value === "inline-block"
                  ? "inline-block"
                  : null,
        );
        break;
      case "flex-direction":
        push(
          declaration.value === "row"
            ? "flex-row"
            : declaration.value === "column"
              ? "flex-col"
              : declaration.value === "row-reverse"
                ? "flex-row-reverse"
                : declaration.value === "column-reverse"
                  ? "flex-col-reverse"
                  : null,
        );
        break;
      case "justify-content":
        push(
          ({
            "flex-start": "justify-start",
            center: "justify-center",
            "flex-end": "justify-end",
            "space-between": "justify-between",
            "space-around": "justify-around",
            "space-evenly": "justify-evenly",
          } as Record<string, string>)[declaration.value] ?? null,
        );
        break;
      case "align-items":
        push(
          ({
            "flex-start": "items-start",
            center: "items-center",
            "flex-end": "items-end",
            stretch: "items-stretch",
            baseline: "items-baseline",
          } as Record<string, string>)[declaration.value] ?? null,
        );
        break;
      case "flex-wrap":
        push(declaration.value === "wrap" ? "flex-wrap" : declaration.value === "nowrap" ? "flex-nowrap" : null);
        break;
      case "gap":
        push(cssToken("gap", declaration.value));
        break;
      case "row-gap":
        push(cssToken("gap-y", declaration.value));
        break;
      case "column-gap":
        push(cssToken("gap-x", declaration.value));
        break;
      case "padding":
        push(cssToken("p", declaration.value));
        break;
      case "padding-left":
        push(cssToken("pl", declaration.value));
        break;
      case "padding-right":
        push(cssToken("pr", declaration.value));
        break;
      case "padding-top":
        push(cssToken("pt", declaration.value));
        break;
      case "padding-bottom":
        push(cssToken("pb", declaration.value));
        break;
      case "margin":
        push(cssToken("m", declaration.value));
        break;
      case "margin-left":
        push(cssToken("ml", declaration.value));
        break;
      case "margin-right":
        push(cssToken("mr", declaration.value));
        break;
      case "margin-top":
        push(cssToken("mt", declaration.value));
        break;
      case "margin-bottom":
        push(cssToken("mb", declaration.value));
        break;
      case "border-radius":
        push(mapRadius(declaration.value));
        break;
      case "box-shadow":
        push(mapShadow(declaration.value));
        break;
      case "background-color":
        push(mapColorDeclaration("bg", declaration.value));
        break;
      case "color":
        push(mapColorDeclaration("text", declaration.value));
        break;
      case "border-color":
        push(mapColorDeclaration("border", declaration.value));
        break;
      case "font-weight":
        push(
          ({
            "400": "font-normal",
            "500": "font-medium",
            "600": "font-semibold",
            "700": "font-bold",
            "800": "font-extrabold",
          } as Record<string, string>)[declaration.value] ?? null,
        );
        break;
      case "text-align":
        push(
          ({
            left: "text-left",
            center: "text-center",
            right: "text-right",
            justify: "text-justify",
          } as Record<string, string>)[declaration.value] ?? null,
        );
        break;
      case "width":
        push(arbitraryLength("w", declaration.value));
        break;
      case "height":
        push(arbitraryLength("h", declaration.value));
        break;
      case "max-width":
        push(arbitraryLength("max-w", declaration.value));
        break;
      default:
        unsupported.push(`${declaration.property}: ${declaration.value}`);
        break;
    }
  }

  return { classes, unsupported };
}

function spacingValueFromToken(token: string) {
  if (token === "px") {
    return "1px";
  }
  if (token in TAILWIND_SPACING_SCALE) {
    return TAILWIND_SPACING_SCALE[token];
  }
  if (!Number.isNaN(Number(token))) {
    return toRem(Number(token) * 4);
  }
  return token;
}

export function convertTailwindToCss(input: string) {
  const classes = input.split(/\s+/).map((entry) => entry.trim()).filter(Boolean);
  const declarations: string[] = [];
  const unsupported: string[] = [];

  const push = (value: string) => {
    if (!declarations.includes(value)) {
      declarations.push(value);
    }
  };

  for (const token of classes) {
    if (token === "flex") { push("display: flex;"); continue; }
    if (token === "grid") { push("display: grid;"); continue; }
    if (token === "block") { push("display: block;"); continue; }
    if (token === "inline-block") { push("display: inline-block;"); continue; }
    if (token === "flex-row") { push("flex-direction: row;"); continue; }
    if (token === "flex-col") { push("flex-direction: column;"); continue; }
    if (token === "flex-row-reverse") { push("flex-direction: row-reverse;"); continue; }
    if (token === "flex-col-reverse") { push("flex-direction: column-reverse;"); continue; }
    if (token === "flex-wrap") { push("flex-wrap: wrap;"); continue; }
    if (token === "flex-nowrap") { push("flex-wrap: nowrap;"); continue; }
    if (token.startsWith("justify-")) {
      const value = token.replace("justify-", "");
      push(`justify-content: ${value === "start" ? "flex-start" : value === "end" ? "flex-end" : value};`);
      continue;
    }
    if (token.startsWith("items-")) {
      const value = token.replace("items-", "");
      push(`align-items: ${value === "start" ? "flex-start" : value === "end" ? "flex-end" : value};`);
      continue;
    }
    if (/^grid-cols-\d+$/.test(token)) {
      push(`grid-template-columns: repeat(${token.replace("grid-cols-", "")}, minmax(0, 1fr));`);
      continue;
    }
    if (/^gap([xy])?-.+/.test(token)) {
      const [, axis] = token.match(/^gap([xy])?-/) ?? [];
      const value = spacingValueFromToken(token.split("-").slice(axis ? 2 : 1).join("-"));
      if (axis === "x") push(`column-gap: ${value};`);
      else if (axis === "y") push(`row-gap: ${value};`);
      else push(`gap: ${value};`);
      continue;
    }
    if (/^[pm][trblxy]?-.+/.test(token)) {
      const parts = token.split("-");
      const prefix = parts[0];
      const value = spacingValueFromToken(parts.slice(1).join("-"));
      const map: Record<string, string[]> = {
        p: ["padding"],
        px: ["padding-left", "padding-right"],
        py: ["padding-top", "padding-bottom"],
        pt: ["padding-top"],
        pr: ["padding-right"],
        pb: ["padding-bottom"],
        pl: ["padding-left"],
        m: ["margin"],
        mx: ["margin-left", "margin-right"],
        my: ["margin-top", "margin-bottom"],
        mt: ["margin-top"],
        mr: ["margin-right"],
        mb: ["margin-bottom"],
        ml: ["margin-left"],
      };
      for (const property of map[prefix] ?? []) {
        push(`${property}: ${value};`);
      }
      continue;
    }
    if (token.startsWith("rounded")) {
      const radius = TAILWIND_RADII.find((entry) => entry.className === token);
      if (radius) {
        push(`border-radius: ${radius.css};`);
      } else if (token.startsWith("rounded-[")) {
        push(`border-radius: ${token.slice(9, -1).replaceAll("_", " ")};`);
      } else {
        unsupported.push(token);
      }
      continue;
    }
    if (token.startsWith("shadow")) {
      const found = Object.values(TAILWIND_SHADOWS).find((entry) => entry.className === token);
      if (found) {
        push(`box-shadow: ${found.css};`);
      } else if (token.startsWith("shadow-[")) {
        push(`box-shadow: ${token.slice(8, -1).replaceAll("_", " ")};`);
      } else {
        unsupported.push(token);
      }
      continue;
    }
    if (token === "font-normal" || token === "font-medium" || token === "font-semibold" || token === "font-bold" || token === "font-extrabold") {
      const weights: Record<string, string> = {
        "font-normal": "400",
        "font-medium": "500",
        "font-semibold": "600",
        "font-bold": "700",
        "font-extrabold": "800",
      };
      push(`font-weight: ${weights[token]};`);
      continue;
    }
    if (token === "text-left" || token === "text-center" || token === "text-right" || token === "text-justify") {
      push(`text-align: ${token.replace("text-", "")};`);
      continue;
    }

    const colorMatch = token.match(/^(bg|text|border)-(white|black)$/);
    if (colorMatch) {
      const [, prefix, color] = colorMatch;
      const property = prefix === "bg" ? "background-color" : prefix === "text" ? "color" : "border-color";
      push(`${property}: ${color === "white" ? "#ffffff" : "#000000"};`);
      continue;
    }

    const paletteMatch = token.match(/^(bg|text|border)-(slate|gray|red|orange|amber|yellow|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|pink|rose)-(\d{2,3})$/);
    if (paletteMatch) {
      const [, prefix, family, shade] = paletteMatch;
      const property = prefix === "bg" ? "background-color" : prefix === "text" ? "color" : "border-color";
      push(`${property}: ${TAILWIND_PALETTE[family as TailwindColorFamily][Number(shade) as TailwindShade]};`);
      continue;
    }

    const arbitraryColorMatch = token.match(/^(bg|text|border)-\[(#.+)\]$/);
    if (arbitraryColorMatch) {
      const [, prefix, hex] = arbitraryColorMatch;
      const property = prefix === "bg" ? "background-color" : prefix === "text" ? "color" : "border-color";
      push(`${property}: ${hex};`);
      continue;
    }

    unsupported.push(token);
  }

  return { declarations, unsupported };
}
