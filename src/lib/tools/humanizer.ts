export const MAX_INPUT_LENGTH = 1000;
export const HUMANIZER_MODEL = "openai/gpt-4o-mini";

export function sanitizeInput(text: string) {
  return text
    .replace(/<[^>]*>/g, "")
    .replace(/[^\S\r\n]+/g, " ")
    .trim();
}

export function buildHumanizerPrompt(inputText: string): Array<{ role: "system" | "user"; content: string }> {
  return [
    {
      role: "system",
      content: `You are an expert editor who rewrites AI-generated text to sound natural, human, and authentic.

When rewriting, follow these rules strictly:

REMOVE these AI writing patterns:
- Filler openers like "Certainly!", "Of course!", "Absolutely!", and "Great question!"
- Overly formal transitions like "Furthermore", "Moreover", and "In conclusion"
- Hedging phrases like "It is important to note" and "It is worth noting"
- Passive phrasing when a direct active sentence is more natural
- Bullet list rhythm or repetitive sentence shapes
- Repeating the user's request back before answering

ADD these human writing qualities:
- Varied sentence length
- Occasional contractions when natural
- Direct and confident phrasing
- Natural connectors like "so", "but", "and", and "because"
- A human cadence that does not sound robotic

PRESERVE:
- The original meaning and factual content
- The approximate length
- Technical terms, names, numbers, and specific details

OUTPUT ONLY the rewritten text. No explanation, no quotation marks, and no preamble.`,
    },
    {
      role: "user",
      content: inputText,
    },
  ];
}

export function getQueueDelay() {
  const minMs = 10_000;
  const maxMs = 15_000;
  return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
}

export const QUEUE_MESSAGES = [
  "Joining the queue...",
  "Analyzing AI patterns in your text...",
  "Identifying robotic phrasing...",
  "Rewriting sentence structures...",
  "Adding natural variation...",
  "Removing AI tells...",
  "Polishing the output...",
  "Almost done...",
];
