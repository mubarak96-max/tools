export type UnitMode =
  | "miles-to-km"
  | "km-to-miles"
  | "c-to-f"
  | "f-to-c"
  | "deg-to-rad"
  | "rad-to-deg"
  | "lb-to-kg"
  | "kg-to-lb"
  | "hex-to-rgb"
  | "rgb-to-hex"
  | "cmyk-to-rgb"
  | "rgb-to-cmyk";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function convertUnit(input: string, mode: UnitMode) {
  try {
    switch (mode) {
      case "miles-to-km":
        return { output: (Number(input) * 1.60934).toFixed(4) };
      case "km-to-miles":
        return { output: (Number(input) / 1.60934).toFixed(4) };
      case "c-to-f":
        return { output: ((Number(input) * 9) / 5 + 32).toFixed(2) };
      case "f-to-c":
        return { output: (((Number(input) - 32) * 5) / 9).toFixed(2) };
      case "deg-to-rad":
        return { output: ((Number(input) * Math.PI) / 180).toFixed(6) };
      case "rad-to-deg":
        return { output: ((Number(input) * 180) / Math.PI).toFixed(6) };
      case "lb-to-kg":
        return { output: (Number(input) * 0.45359237).toFixed(4) };
      case "kg-to-lb":
        return { output: (Number(input) / 0.45359237).toFixed(4) };
      case "hex-to-rgb": {
        const hex = input.replace("#", "").padEnd(6, "0");
        const channels = [0, 2, 4].map((index) => Number.parseInt(hex.slice(index, index + 2), 16));
        return { output: `rgb(${channels.join(", ")})` };
      }
      case "rgb-to-hex": {
        const channels = input.split(/[, ]+/).filter(Boolean).map((part) => clamp(Number(part), 0, 255));
        return {
          output: `#${channels
            .slice(0, 3)
            .map((value) => value.toString(16).padStart(2, "0"))
            .join("")}`.toUpperCase(),
        };
      }
      case "cmyk-to-rgb": {
        const [c = 0, m = 0, y = 0, k = 0] = input.split(/[, ]+/).filter(Boolean).map((part) => Number(part) / 100);
        const red = Math.round(255 * (1 - c) * (1 - k));
        const green = Math.round(255 * (1 - m) * (1 - k));
        const blue = Math.round(255 * (1 - y) * (1 - k));
        return { output: `rgb(${red}, ${green}, ${blue})` };
      }
      case "rgb-to-cmyk": {
        const [r = 0, g = 0, b = 0] = input.split(/[, ]+/).filter(Boolean).map((part) => clamp(Number(part), 0, 255) / 255);
        const k = 1 - Math.max(r, g, b);
        if (k === 1) {
          return { output: "cmyk(0%, 0%, 0%, 100%)" };
        }
        const c = ((1 - r - k) / (1 - k)) * 100;
        const m = ((1 - g - k) / (1 - k)) * 100;
        const y = ((1 - b - k) / (1 - k)) * 100;
        return { output: `cmyk(${c.toFixed(1)}%, ${m.toFixed(1)}%, ${y.toFixed(1)}%, ${(k * 100).toFixed(1)}%)` };
      }
      default:
        return { output: input };
    }
  } catch (error) {
    return {
      output: "",
      error: error instanceof Error ? error.message : "Unit conversion failed.",
    };
  }
}
