type LoremUnit = "paragraphs" | "sentences" | "words";

type LoremOptions = {
  amount: number;
  unit: LoremUnit;
  startWithLorem: boolean;
  seed?: number;
};

const LOREM_SENTENCES = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "Integer posuere erat a ante venenatis dapibus posuere velit aliquet.",
  "Maecenas faucibus mollis interdum donec ullamcorper nulla non metus auctor fringilla.",
  "Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.",
];

const LOREM_WORDS = LOREM_SENTENCES
  .join(" ")
  .toLowerCase()
  .replace(/[^a-z\s]/g, "")
  .split(/\s+/)
  .filter(Boolean);

function sentenceAt(index: number, startWithLorem: boolean) {
  if (index === 0 && startWithLorem) {
    return LOREM_SENTENCES[0];
  }

  const offset = startWithLorem ? index : index + 1;
  return LOREM_SENTENCES[offset % LOREM_SENTENCES.length];
}

export function generateLoremIpsum({ amount, unit, startWithLorem, seed = 0 }: LoremOptions) {
  const safeAmount = Math.min(Math.max(amount, 1), 50);
  const offset = Math.max(seed, 0) * 3;

  if (unit === "words") {
    const words = Array.from({ length: safeAmount }, (_, index) => {
      if (index === 0 && startWithLorem) {
        return "lorem";
      }

      if (index === 1 && startWithLorem && safeAmount > 1) {
        return "ipsum";
      }

      const baseIndex = (index + offset + (startWithLorem ? 2 : 0)) % LOREM_WORDS.length;
      return LOREM_WORDS[baseIndex];
    });

    return `${words.join(" ")}.`;
  }

  if (unit === "sentences") {
    return Array.from({ length: safeAmount }, (_, index) => sentenceAt(index + offset, startWithLorem)).join(" ");
  }

  return Array.from({ length: safeAmount }, (_, paragraphIndex) => {
    const sentenceCount = 3 + ((paragraphIndex + offset) % 3);

    return Array.from({ length: sentenceCount }, (_, sentenceIndex) =>
      sentenceAt(paragraphIndex * 4 + sentenceIndex + offset, paragraphIndex === 0 && sentenceIndex === 0 && startWithLorem),
    ).join(" ");
  }).join("\n\n");
}
