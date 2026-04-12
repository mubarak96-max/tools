"use client";

import CharacterCounter, { type CharacterCounterProps } from "./CharacterCounter";
import { VARIANT_TOOL_PRESETS } from "@/lib/word-counter-landings/presets";

export type WordCounterProps = {
  variant?: string;
} & CharacterCounterProps;

export function WordCounter({ variant = "default", ...rest }: WordCounterProps) {
  const preset = VARIANT_TOOL_PRESETS[variant] ?? VARIANT_TOOL_PRESETS.default ?? {};
  return <CharacterCounter {...preset} {...rest} />;
}
