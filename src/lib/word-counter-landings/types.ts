import type { CharacterCounterProps } from "@/app/text/character-counter/components/CharacterCounter";

export type WordCounterLanding = {
  slug: string;
  toolVariant: string;
  metaTitle: string;
  h1: string;
  description: string;
  keywords: string[];
  intro: string;
  sections: { heading: string; paragraphs: string[] }[];
  faq: { question: string; answer: string }[];
  tool?: Partial<CharacterCounterProps>;
};

export type WordCounterLandingMap = Record<string, WordCounterLanding>;
