import type { HubContent } from "./types";

export const aiHub: HubContent = {
  path: "/ai",
  label: "AI Tools",
  metaTitle: "Free AI Writing Tools: AI Humanizer & Readability Checks",
  metaDescription:
    "Free AI-assisted writing tools: rewrite stiff AI drafts into natural prose with the AI humanizer, then check readability, repetition and word frequency.",
  h1: "AI writing tools for editing drafts",
  lead:
    "Use AI to turn a stiff first draft into natural, readable prose, then check the result with readability and repetition tools before you publish.",
  intro: [
    "AI-generated drafts tend to share the same habits: uniform sentence lengths, stock transitions, hedging and overused words. The AI humanizer rewrites a draft with control over tone and complexity, so the result reads more like a person wrote it.",
    "Rewriting is only half the job. The analysis tools here check the output: whether the readability score suits your audience, whether a word now repeats too often, and which terms dominate. Always read the final text yourself. Make sure it's accurate and says what you mean.",
  ],
  groups: [
    {
      heading: "Rewrite",
      intro: "Rework AI-sounding text with adjustable tone, complexity and keyword preservation.",
      hrefs: ["/ai/ai-humanizer"],
    },
    {
      heading: "Check the result",
      intro: "Score readability, catch repeated words and see your word distribution.",
      hrefs: [
        "/text/readability-flesch-kincaid-calculator",
        "/text/duplicate-word-finder",
        "/text/word-frequency",
        "/text/case-converter",
      ],
    },
  ],
  methodology: {
    heading: "Using AI responsibly",
    points: [
      {
        title: "How your text is handled",
        body: "The humanizer sends your text to an AI model to generate the rewrite. Don't paste confidential or personal information.",
      },
      {
        title: "Human review required",
        body: "AI can change meaning or introduce errors. Check facts, figures and quotes in the output before you use it.",
      },
      {
        title: "Check, then publish",
        body: "Run the rewrite through the readability and repetition checkers, which work locally in your browser.",
      },
      {
        title: "Your responsibility",
        body: "Follow your school's, publisher's or employer's rules on AI-assisted writing.",
      },
    ],
  },
  faqs: [
    {
      question: "What does an AI humanizer do?",
      answer:
        "It rewrites text to vary sentence structure, vocabulary and rhythm, removing the predictable patterns typical of AI-generated drafts. The goal is clearer, more natural writing that keeps your original meaning.",
    },
    {
      question: "Is the text I paste into the AI humanizer private?",
      answer:
        "Your text is sent to an AI model to produce the rewrite and isn't published anywhere. Even so, avoid pasting confidential, personal or client-restricted material into any online AI tool.",
    },
    {
      question: "Should I edit the output?",
      answer:
        "Yes. Read it for accuracy and voice, then use the readability calculator to make sure it suits your audience.",
    },
  ],
};
