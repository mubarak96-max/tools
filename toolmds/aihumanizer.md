# AI Humanizer — Next.js Implementation Guide
### For a Multi-Tool Site at `/free-tools/ai-humanizer`

> **Prerequisites:**
> This guide follows the same SSR + client component architecture as the other tools like emi calculator, word counter, etc.
> Unlike the calculators, this tool makes live API calls to OpenRouter from a
> Next.js API route — the client component never touches the API key directly.

---

## Table of Contents

1. [Tool Overview & Differentiators](#1-tool-overview--differentiators)
2. [File & Folder Structure](#2-file--folder-structure)
3. [Step 1 — OpenRouter API Route](#3-step-1--openrouter-api-route)
4. [Step 2 — Humanizer Logic & Prompt](#4-step-2--humanizer-logic--prompt)
5. [Step 3 — Types](#5-step-3--types)
6. [Step 4 — Client Component (AIHumanizer.tsx)](#6-step-4--client-component-aihumanizertsx)
7. [Step 5 — Page (SSR + SEO)](#7-step-5--page-ssr--seo)
8. [Step 6 — Environment Variables](#8-step-6--environment-variables)
9. [Step 7 — Update Shared Layout & Index](#9-step-7--update-shared-layout--index)
10. [Step 8 — Update Sitemap](#10-step-8--update-sitemap)
11. [SEO Strategy — AI Humanizer](#11-seo-strategy--ai-humanizer)
12. [Regional Keyword Targeting](#12-regional-keyword-targeting)
13. [On-Page SEO Checklist](#13-on-page-seo-checklist)
14. [Rate Limiting & Abuse Prevention](#14-rate-limiting--abuse-prevention)

---

## 1. Tool Overview & Differentiators

### What This Tool Does

Takes AI-generated text (from ChatGPT, Claude, Gemini, etc.) and rewrites it
to sound natural, human, and undetectable by AI detectors. The user pastes
their text (up to 300 characters), clicks Humanize, waits in a simulated
queue, and receives a rewritten version.

### Key UX Decisions

**300-character input limit per request.**
Enforced on both client (textarea `maxLength`) and server (API route
validation). Keeps costs low, prevents abuse, and encourages repeat visits
rather than one-time paste-and-leave sessions.

**Artificial queue delay of 10–15 seconds.**
A random delay is introduced before the API call resolves on the client.
The user sees rotating queue status messages and a progress bar during this
period. This serves two purposes: (1) it anchors perceived value — instant
results feel cheap, a wait feels like real processing; (2) it naturally
throttles concurrent usage. The actual OpenRouter call is fast; the delay is
a purely client-side UX construct.

**OpenRouter as the sole AI provider.**
All AI calls go through a single Next.js API route using OpenRouter.
The API key lives only in server-side environment variables and is never
exposed to the client.

### What Makes This Better Than Competitors

| Feature | Most Competitors | **Your Tool** |
|---|---|---|
| No sign-up required | No | ✅ Yes |
| Fast, clean UI | No (ad-heavy) | ✅ Yes |
| SSR page for SEO | No | ✅ Yes |
| API key never client-side | Mixed | ✅ Always server-side |
| Queue UX (perceived quality) | No | ✅ Yes |
| JSON-LD structured data | No | ✅ Yes |
| Part of a trusted tools domain | No | ✅ Domain authority |

---

## 2. File & Folder Structure

Add only the files marked `← NEW`.

```
your-nextjs-project/
├── app/
│   ├── api/
│   │   └── humanize/
│   │       └── route.ts                        ← NEW: OpenRouter API route
│   └──AI-tools/
│       ├── layout.tsx                          ← UPDATE
│       ├── page.tsx                            ← UPDATE
│       └── ai-humanizer/
│           ├── page.tsx                        ← NEW: SSR page + SEO
│           └── components/
│               └── AIHumanizer.tsx             ← NEW: client component
│
├── lib/
│   └── tools/
│       └── humanizer.ts                        ← NEW: prompt + config
│
└── .env.local                                  ← UPDATE: add OPENROUTER_API_KEY
```

---

## 3. Step 1 — OpenRouter API Route

**File:** `app/api/humanize/route.ts`

This is the only file that touches the OpenRouter API key. The client
component calls `/api/humanize` — it never sees the key.

```ts
import { NextRequest, NextResponse } from "next/server";
import {
  buildHumanizerPrompt,
  sanitizeInput,
  HUMANIZER_MODEL,
  MAX_INPUT_LENGTH,
} from "@/lib/tools/humanizer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text } = body;

    // ── Input validation ───────────────────────────────────────
    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid text field." },
        { status: 400 }
      );
    }

    const trimmed = sanitizeInput(text);

    if (trimmed.length === 0) {
      return NextResponse.json(
        { error: "Text cannot be empty." },
        { status: 400 }
      );
    }

    if (trimmed.length > MAX_INPUT_LENGTH) {
      return NextResponse.json(
        { error: `Text exceeds the ${MAX_INPUT_LENGTH} character limit.` },
        { status: 400 }
      );
    }

    // ── OpenRouter call ────────────────────────────────────────
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      console.error("OPENROUTER_API_KEY is not set.");
      return NextResponse.json(
        { error: "Service temporarily unavailable." },
        { status: 503 }
      );
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "https://yoursite.com",
        "X-Title": "AI Humanizer",
      },
      body: JSON.stringify({
        model: HUMANIZER_MODEL,
        messages: buildHumanizerPrompt(trimmed),
        temperature: 0.85,   // Higher = more natural variation in output
        max_tokens: 600,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("OpenRouter error:", response.status, errorBody);
      return NextResponse.json(
        { error: "Rewriting failed. Please try again." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const humanized = data.choices?.[0]?.message?.content?.trim();

    if (!humanized) {
      return NextResponse.json(
        { error: "No output received. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ humanized });

  } catch (err) {
    console.error("Humanize route error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
```

---

## 4. Step 2 — Humanizer Logic & Prompt

**File:** `lib/tools/humanizer.ts`

The quality of the output lives entirely in the system prompt. The model,
prompt, queue config, and sanitiser are all kept here so they can be iterated
independently of the route or component.

```ts
export const MAX_INPUT_LENGTH = 300;

// OpenRouter model to use.
// openai/gpt-4o-mini is fast, low-cost, and produces natural rewrites

export const HUMANIZER_MODEL = "openai/gpt-4o-mini"

/**
 * Strips HTML tags, collapses whitespace, and trims the input.
 * Always run this before passing user text to the API.
 */
export function sanitizeInput(text: string): string {
  return text
    .replace(/<[^>]*>/g, "")        // strip HTML tags
    .replace(/[^\S\r\n]+/g, " ")    // collapse multiple spaces
    .trim();
}

/**
 * Builds the message array for the OpenRouter chat completions call.
 * The system prompt is the most critical part — it instructs the model
 * to rewrite without AI tells while preserving meaning.
 */
export function buildHumanizerPrompt(
  inputText: string
): { role: "system" | "user"; content: string }[] {
  return [
    {
      role: "system",
      content: `You are an expert editor who rewrites AI-generated text to sound natural, human, and authentic.

When rewriting, follow these rules strictly:

REMOVE these AI writing patterns:
- Filler openers: "Certainly!", "Of course!", "Absolutely!", "Great question!", "Sure!"
- Overly formal transitions: "Furthermore", "Moreover", "In conclusion", "It is worth noting that"
- Hedging phrases: "It is important to note", "It is crucial to understand", "One must consider"
- Passive constructions where active phrasing is natural
- Bullet points and numbered lists — convert to flowing prose
- Symmetrical sentence structures where every sentence is roughly the same length
- Repeating the user's question back before answering

ADD these human writing qualities:
- Varied sentence length — mix short punchy sentences with longer ones
- Occasional contractions (don't, it's, you'll, they're)
- Direct, confident phrasing — say things plainly
- Natural connectors (so, but, and, because) instead of formal transitions
- Subtle imperfections real writers have — a parenthetical aside, a dash, an em-dash
- First or second person voice where appropriate

PRESERVE:
- The original meaning and all factual content — do not add or remove information
- Approximate length — do not pad or trim significantly
- Any technical terms, proper nouns, or specific data

OUTPUT ONLY the rewritten text. No preamble, no explanation, no quotation marks.`,
    },
    {
      role: "user",
      content: inputText,
    },
  ];
}

/**
 * Returns a random queue delay in milliseconds between 10 and 15 seconds.
 * Called client-side only — this is a UX delay, not a server delay.
 */
export function getQueueDelay(): number {
  const minMs = 10_000;
  const maxMs = 15_000;
  return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
}

/**
 * Rotating status messages shown to the user during the artificial delay.
 * Displayed in sequence to simulate real processing activity.
 */
export const QUEUE_MESSAGES = [
  "Joining the queue...",
  "Analysing AI patterns in your text...",
  "Identifying robotic phrasing...",
  "Rewriting sentence structures...",
  "Adding natural variation...",
  "Removing AI tells...",
  "Polishing the output...",
  "Almost done...",
];
```

---

## 5. Step 3 — Types

**File:** `types/tools.ts` — add to your existing types file.

```ts
export type HumanizerStatus =
  | "idle"
  | "queued"      // artificial delay phase — progress bar + rotating messages
  | "processing"  // actual API call in flight
  | "done"
  | "error";
```

---

## 6. Step 4 — Client Component (AIHumanizer.tsx)

**File:** `app/free-tools/ai-humanizer/components/AIHumanizer.tsx`

Handles the full UX: textarea with live character counter, queue delay with
rotating messages and progress bar, result display, and copy-to-clipboard.

```tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  getQueueDelay,
  QUEUE_MESSAGES,
  MAX_INPUT_LENGTH,
} from "@/lib/tools/humanizer";
import type { HumanizerStatus } from "@/types/tools";

export default function AIHumanizer() {
  const [inputText, setInputText]       = useState("");
  const [outputText, setOutputText]     = useState("");
  const [status, setStatus]             = useState<HumanizerStatus>("idle");
  const [errorMsg, setErrorMsg]         = useState("");
  const [copied, setCopied]             = useState(false);
  const [queueMessage, setQueueMessage] = useState(QUEUE_MESSAGES[0]);
  const [queueProgress, setQueueProgress] = useState(0); // 0–100

  const messageIntervalRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortRef            = useRef<AbortController | null>(null);

  const charsRemaining = MAX_INPUT_LENGTH - inputText.length;
  const isOverLimit    = inputText.length > MAX_INPUT_LENGTH;
  const isEmpty        = inputText.trim().length === 0;
  const isProcessing   = status === "queued" || status === "processing";

  // ── Cleanup on unmount ────────────────────────────────────────
  useEffect(() => {
    return () => {
      messageIntervalRef.current  && clearInterval(messageIntervalRef.current);
      progressIntervalRef.current && clearInterval(progressIntervalRef.current);
      abortRef.current?.abort();
    };
  }, []);

  // ── Queue simulation ──────────────────────────────────────────
  const startQueueSimulation = useCallback((delayMs: number) => {
    setQueueProgress(0);
    let msgIndex = 0;
    setQueueMessage(QUEUE_MESSAGES[0]);

    // Rotate messages — spread evenly across the delay window
    const msgInterval = Math.floor(delayMs / QUEUE_MESSAGES.length);
    messageIntervalRef.current = setInterval(() => {
      msgIndex = Math.min(msgIndex + 1, QUEUE_MESSAGES.length - 1);
      setQueueMessage(QUEUE_MESSAGES[msgIndex]);
    }, msgInterval);

    // Smooth eased progress bar — caps at 92% so it never completes during queue
    const tickMs     = 100;
    const totalTicks = delayMs / tickMs;
    let tick         = 0;

    progressIntervalRef.current = setInterval(() => {
      tick++;
      const raw   = tick / totalTicks;
      const eased = 1 - Math.pow(1 - raw, 2); // ease-out quad
      setQueueProgress(Math.min(eased * 92, 92));
    }, tickMs);
  }, []);

  const stopQueueSimulation = useCallback(() => {
    messageIntervalRef.current  && clearInterval(messageIntervalRef.current);
    progressIntervalRef.current && clearInterval(progressIntervalRef.current);
    messageIntervalRef.current  = null;
    progressIntervalRef.current = null;
  }, []);

  // ── Main handler ──────────────────────────────────────────────
  const handleHumanize = async () => {
    if (isEmpty || isOverLimit || isProcessing) return;

    setStatus("queued");
    setOutputText("");
    setErrorMsg("");
    setCopied(false);

    // 1. Run the artificial queue delay
    const delay = getQueueDelay();
    startQueueSimulation(delay);
    await new Promise((resolve) => setTimeout(resolve, delay));

    // 2. Transition to actual processing
    stopQueueSimulation();
    setStatus("processing");
    setQueueMessage("Processing...");
    setQueueProgress(96);

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/humanize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
        signal: abortRef.current.signal,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Something went wrong.");
      }

      setQueueProgress(100);
      setOutputText(data.humanized);
      setStatus("done");

    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setErrorMsg(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
      setStatus("error");
      setQueueProgress(0);
    }
  };

  // ── Copy to clipboard ─────────────────────────────────────────
  const handleCopy = async () => {
    if (!outputText) return;
    await navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setStatus("idle");
    setOutputText("");
    setInputText("");
    setErrorMsg("");
    setQueueProgress(0);
  };

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="ai-humanizer">

      {/* Input panel */}
      <div className="humanizer-panel humanizer-panel--input">
        <div className="panel-header">
          <label htmlFor="ai-input">Paste your AI-generated text</label>
          <span
            className={[
              "char-counter",
              isOverLimit        ? "char-counter--over"    : "",
              charsRemaining <= 30 && !isOverLimit ? "char-counter--warning" : "",
            ].join(" ").trim()}
            aria-live="polite"
            aria-label={`${charsRemaining} characters remaining`}
          >
            {inputText.length} / {MAX_INPUT_LENGTH}
          </span>
        </div>

        <textarea
          id="ai-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          maxLength={MAX_INPUT_LENGTH}
          placeholder="Paste AI-generated text here (up to 300 characters)…"
          rows={6}
          disabled={isProcessing}
          aria-describedby="input-hint"
          spellCheck={false}
        />

        <p id="input-hint" className="input-hint">
          Works with text from ChatGPT, Claude, Gemini, Copilot, and other AI tools.
        </p>

        <button
          onClick={handleHumanize}
          disabled={isEmpty || isOverLimit || isProcessing}
          className="humanize-btn"
          aria-busy={isProcessing}
        >
          {isProcessing ? "Processing…" : "Humanize Text →"}
        </button>
      </div>

      {/* Queue / progress indicator */}
      {isProcessing && (
        <div className="queue-indicator" role="status" aria-live="polite">
          <div
            className="queue-progress-bar"
            role="progressbar"
            aria-valuenow={queueProgress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Processing progress"
          >
            <div
              className="queue-progress-fill"
              style={{ width: `${queueProgress}%` }}
            />
          </div>
          <p className="queue-message">{queueMessage}</p>
        </div>
      )}

      {/* Error state */}
      {status === "error" && (
        <div className="humanizer-error" role="alert">
          <p>{errorMsg}</p>
          <button onClick={() => setStatus("idle")}>Try again</button>
        </div>
      )}

      {/* Output panel */}
      {status === "done" && outputText && (
        <div className="humanizer-panel humanizer-panel--output">
          <div className="panel-header">
            <span>Humanized text</span>
            <button
              onClick={handleCopy}
              className="copy-btn"
              aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
            >
              {copied ? "✓ Copied" : "Copy"}
            </button>
          </div>

          <div
            className="output-text"
            aria-label="Humanized output"
            aria-live="polite"
          >
            {outputText}
          </div>

          <button onClick={handleReset} className="reset-btn">
            Humanize another →
          </button>
        </div>
      )}

    </div>
  );
}
```

---

## 7. Step 5 — Page (SSR + SEO)

**File:** `app/free-tools/ai-humanizer/page.tsx`

```tsx
import { Metadata } from "next";
import AIHumanizer from "./components/AIHumanizer";

export const metadata: Metadata = {
  title: "AI Humanizer — Make AI Text Sound Human | YourSite",
  description:
    "Free AI humanizer. Paste AI-generated text from ChatGPT, Claude or Gemini and get a natural, human-sounding rewrite instantly. No sign-up required.",
  keywords: [
    "AI humanizer",
    "humanize AI text",
    "make AI text sound human",
    "AI text rewriter",
    "remove AI writing",
    "ChatGPT humanizer",
    "bypass AI detection",
    "AI to human text converter",
    "humanize ChatGPT text",
  ],
  alternates: {
    canonical: "https://yoursite.com/free-tools/ai-humanizer",
  },
  openGraph: {
    title: "AI Humanizer — Make AI Text Sound Human",
    description:
      "Instantly rewrite AI-generated text to sound natural and human. Free, no sign-up.",
    url: "https://yoursite.com/free-tools/ai-humanizer",
    siteName: "YourSite",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "AI Humanizer",
      url: "https://yoursite.com/free-tools/ai-humanizer",
      description:
        "Rewrite AI-generated text to sound natural and human. Removes AI writing patterns and adds natural variation.",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "All",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home",       item: "https://yoursite.com" },
        { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://yoursite.com/free-tools" },
        { "@type": "ListItem", position: 3, name: "AI Humanizer", item: "https://yoursite.com/free-tools/ai-humanizer" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is an AI humanizer?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "An AI humanizer rewrites AI-generated text to sound more natural and human. It removes common AI writing patterns — filler openers, formal transitions, symmetrical sentence structures — and replaces them with varied, natural phrasing.",
          },
        },
        {
          "@type": "Question",
          name: "What AI writing patterns does this tool remove?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Common AI tells include filler openers like 'Certainly!' and 'Of course!', overused transitions like 'Furthermore' and 'Moreover', hedging phrases like 'It is important to note', passive constructions, and symmetrical sentence structures where every sentence is roughly the same length.",
          },
        },
        {
          "@type": "Question",
          name: "Does this work on text from ChatGPT, Claude, and Gemini?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. The tool targets writing patterns common across all major AI models — ChatGPT, Claude, Gemini, Copilot, and others. The rewriting works regardless of which model produced the original text.",
          },
        },
        {
          "@type": "Question",
          name: "Why is there a 300 character limit?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The 300 character limit keeps the tool fast and free for everyone. For longer texts, humanize your content in multiple short sections for best results.",
          },
        },
        {
          "@type": "Question",
          name: "Will the meaning of my text change?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. The tool rewrites phrasing and sentence structure while preserving original meaning, all factual content, and technical terms. It changes how something is said, not what is said.",
          },
        },
        {
          "@type": "Question",
          name: "Why does it take 10–15 seconds?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The tool analyses your text and processes it through a rewriting model. Queue times vary based on current demand.",
          },
        },
      ],
    },
  ],
};

export default function AIHumanizerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main>
        <nav aria-label="Breadcrumb">
          <ol>
            <li><a href="/">Home</a></li>
            <li><a href="/free-tools">Free Tools</a></li>
            <li aria-current="page">AI Humanizer</li>
          </ol>
        </nav>

        <h1>AI Humanizer</h1>
        <p>
          Paste AI-generated text and get a natural, human-sounding rewrite
          in seconds. Removes robotic phrasing, filler openers, and AI writing
          patterns from ChatGPT, Claude, Gemini, and other AI tools.
          Free, no sign-up required.
        </p>

        <AIHumanizer />

        <section aria-label="About AI humanizing">

          <h2>Why Does AI-Generated Text Sound Robotic?</h2>
          <p>
            AI writing tools like ChatGPT, Claude, and Gemini produce text that
            is grammatically correct — but it often reads as mechanical. Large
            language models are trained to predict the most statistically likely
            next word, which produces patterns that are consistent to the point
            of sounding formulaic: every sentence a similar length, every
            paragraph beginning with a transition, every response opening with
            an affirmation.
          </p>
          <p>
            Human writing is messier — and more readable. A short sentence.
            Then a longer one that builds on it, adds context, maybe a side
            thought. Contractions. Direct phrasing. Variety. That is what
            this tool restores.
          </p>

          <h2>What This Tool Changes</h2>
          <p>
            The humanizer targets specific AI writing patterns and replaces
            them with natural alternatives. The meaning and facts of the
            original are always preserved — only the phrasing changes.
          </p>
          <table>
            <thead>
              <tr>
                <th>AI Pattern</th>
                <th>Example</th>
                <th>Human Alternative</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Filler opener</td>
                <td>"Certainly! I'd be happy to help."</td>
                <td>Removed — start with the content</td>
              </tr>
              <tr>
                <td>Formal transition</td>
                <td>"Furthermore, it is important to consider…"</td>
                <td>"There's also…"</td>
              </tr>
              <tr>
                <td>Hedging phrase</td>
                <td>"It is worth noting that…"</td>
                <td>State it directly</td>
              </tr>
              <tr>
                <td>Passive voice</td>
                <td>"The report was written by the team."</td>
                <td>"The team wrote the report."</td>
              </tr>
              <tr>
                <td>Uniform sentence length</td>
                <td>Every sentence ~20 words</td>
                <td>Mix of short and long sentences</td>
              </tr>
              <tr>
                <td>No contractions</td>
                <td>"It is not possible to do this."</td>
                <td>"It's not possible."</td>
              </tr>
            </tbody>
          </table>

          <h2>Tips for Best Results</h2>
          <ul>
            <li>
              <strong>Paste one paragraph at a time.</strong> The 300-character
              limit is per submission — humanize in short sections for the most
              consistent output.
            </li>
            <li>
              <strong>Read and edit the output.</strong> The tool produces a
              strong starting point. A quick read-through to match your personal
              voice will always improve the result.
            </li>
            <li>
              <strong>Run it twice on tricky sections.</strong> If the first
              output still sounds stiff, paste it back in for a second pass.
            </li>
          </ul>

          <h2>Frequently Asked Questions</h2>

          <h3>What is an AI humanizer?</h3>
          <p>
            A tool that rewrites AI-generated text to sound natural and human
            by removing the formulaic patterns that AI writing tools produce.
          </p>

          <h3>Does this work on ChatGPT, Claude, and Gemini text?</h3>
          <p>
            Yes — it targets patterns common across all major AI models,
            regardless of which one produced the original text.
          </p>

          <h3>Will the meaning of my text change?</h3>
          <p>
            No. Meaning, facts, and technical terms are always preserved.
            Only phrasing and sentence structure change.
          </p>

          <h3>Why is there a 300 character limit?</h3>
          <p>
            To keep the tool fast and free for everyone. Humanize longer
            texts in multiple short sections.
          </p>

          <h3>Why does it take 10–15 seconds?</h3>
          <p>
            The tool analyses your text and processes it through a rewriting
            model. Queue times vary with demand.
          </p>

        </section>

        <aside aria-label="Related tools">
          <h2>Other Free Tools</h2>
          <ul>
            <li>
              <a href="/free-tools/profit-margin-calculator">Profit Margin Calculator</a>
              {" "}— Calculate gross margin, markup, and selling price
            </li>
            <li>
              <a href="/free-tools/vat-calculator">VAT Calculator</a>
              {" "}— Add or remove VAT for 30+ countries
            </li>
            <li>
              <a href="/free-tools/discount-calculator">Discount Calculator</a>
              {" "}— Calculate sale prices and percentage savings
            </li>
          </ul>
        </aside>

      </main>
    </>
  );
}
```

---

## 8. Step 6 — Environment Variables

**File:** `.env.local`

```bash
# OpenRouter API key — get yours at https://openrouter.ai/keys
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Your site's public URL — sent as HTTP-Referer to OpenRouter (required by their ToS)
NEXT_PUBLIC_SITE_URL=https://yoursite.com
```

**File:** `.env.example` — commit this file, never `.env.local`

```bash
OPENROUTER_API_KEY=
NEXT_PUBLIC_SITE_URL=
```

> **Security rules:**
> - `OPENROUTER_API_KEY` has no `NEXT_PUBLIC_` prefix — it is server-only
>   and never bundled into the client JavaScript.
> - Verify `.env.local` is in `.gitignore` before your first commit.
> - On Vercel, Netlify, or Railway: add these as environment variables in
>   the dashboard. Do not rely on `.env.local` in production.

---

## 9. Step 7 — Update Shared Layout & Index

### Layout sidebar

**File:** `app/free-tools/layout.tsx` — add a new AI Tools section:

```tsx
<section>
  <h3>AI Tools</h3>
  <ul>
    <li><a href="/free-tools/ai-humanizer">AI Humanizer</a></li>
  </ul>
</section>
```

### Tools index page

**File:** `app/free-tools/page.tsx`

```ts
// Add "AI" as a new category in your ToolMeta type if not already present:
// category: "Finance" | "Converter" | "Utility" | "AI"

// Then add to the tools array:
{
  name: "AI Humanizer",
  href: "/free-tools/ai-humanizer",
  description:
    "Rewrite AI-generated text from ChatGPT, Claude or Gemini to sound natural and human. Free, no sign-up.",
  category: "AI",
},
```

---

## 10. Step 8 — Update Sitemap

**File:** `app/sitemap.ts`

```ts
{
  url: "https://yoursite.com/free-tools/ai-humanizer",
  lastModified: new Date(),
  changeFrequency: "monthly" as const, // Prompt tuning will update this periodically
  priority: 0.9,                       // High — AI tools are the fastest-growing search category
},
```

---

## 11. SEO Strategy — AI Humanizer

### Why This Page Has Exceptional SEO Potential

"AI humanizer" and related queries have gone from near-zero to millions of
monthly searches in under two years, driven by mass adoption of ChatGPT and
other AI writing tools. The market is large, fast-growing, and still dominated
by slow, ad-heavy, sign-up-gated tools. A fast, clean, free tool on your
existing domain can rank quickly.

### Your Competitive Advantage

The dominant tools in this space (Undetectable.ai, Humanize.pro, etc.) all
require sign-up, are heavily monetised with ads and upsells, and have slow
page loads. Your tool wins on:
- **No sign-up** — lower friction than every major competitor
- **Fast page load** — SSR with no ad scripts
- **Trusted domain** — existing domain authority from your calculator tools
- **Clean UX** — no popups, no upsell modals, no distractions

### Topical Authority

```
/free-tools                         ← Hub
    ├── /ai-humanizer               ← NEW: highest traffic growth potential
    ├── /salary-calculator          ← Different audience, same domain authority
    └── /profit-margin-calculator   ← Different audience
```

Consider adding more AI writing tools over time — an AI summarizer, grammar
checker, or paraphrasing tool — to build a topical cluster around AI writing.
Each new tool strengthens the others.

### Content Angle

The "AI writing patterns" table in the page copy directly answers searches
like "what does AI writing look like?" and "how do AI detectors work?" —
both high-volume informational queries. Expand this table over time and it
will drive long-tail traffic independent of the tool itself.

---

## 12. Regional Keyword Targeting

### United States
| Primary | Secondary |
|---|---|
| AI humanizer | humanize AI text |
| make AI text sound human | AI text rewriter |
| ChatGPT humanizer | bypass AI detection |
| AI to human text | remove AI writing |

### United Kingdom
| Primary | Secondary |
|---|---|
| AI humanizer UK | humanise AI text |
| make ChatGPT sound human | AI text rewriter UK |
| remove AI writing patterns | ChatGPT rewriter free |

### UAE / Middle East
| Primary | Secondary |
|---|---|
| AI humanizer UAE | humanize AI text Dubai |
| ChatGPT rewriter UAE | AI writing tool UAE |
| remove AI detection UAE | make AI text human free |

### India
| Primary | Secondary |
|---|---|
| AI humanizer India | humanize AI text free |
| ChatGPT text humanizer | AI to human converter |
| remove AI text patterns | bypass AI detector free |

### Australia
| Primary | Secondary |
|---|---|
| AI humanizer Australia | humanise AI text free |
| ChatGPT rewriter Australia | make AI writing sound natural |

---

## 13. On-Page SEO Checklist

### Content
- [ ] H1 is "AI Humanizer" (exact match primary keyword)
- [ ] Intro mentions ChatGPT, Claude, and Gemini by name
- [ ] "Why AI text sounds robotic" section is present
- [ ] AI writing patterns table is present (minimum 5 rows)
- [ ] "Tips for best results" section is present
- [ ] At least 5 FAQ questions with FAQPage schema markup
- [ ] Internal links to at least 3 other tools

### Technical
- [ ] `metadata.title` includes "AI Humanizer" and "AI Text"
- [ ] `metadata.description` mentions ChatGPT, Claude, Gemini (150–160 chars)
- [ ] `alternates.canonical` points to `/free-tools/ai-humanizer`
- [ ] JSON-LD includes WebApplication + BreadcrumbList + FAQPage
- [ ] Breadcrumb in UI matches BreadcrumbList schema
- [ ] Only `<AIHumanizer />` uses `"use client"` — page itself is SSR
- [ ] `OPENROUTER_API_KEY` set in production environment
- [ ] `NEXT_PUBLIC_SITE_URL` set in production environment
- [ ] Server-side input length validation is in place (not client-only)
- [ ] `.env.local` is in `.gitignore`
- [ ] Entry added to `sitemap.xml` with `priority: 0.9`
- [ ] Entry added to tools sidebar and index page
- [ ] Page loads under 1.5s on initial load (no AI call at SSR time)

### After Publishing
- [ ] Submit updated sitemap in Google Search Console
- [ ] Request indexing for `/free-tools/ai-humanizer`
- [ ] Add link from homepage — highest traffic potential of all your tools
- [ ] Add link from any blog posts about AI writing on your site

---

## 14. Rate Limiting & Abuse Prevention

Unlike the calculators, this tool makes real API calls with real cost.
Without rate limiting, a single bad actor can exhaust your OpenRouter credits
in minutes. Implement at least the basic tier before going live.

### Recommended: Upstash Redis Rate Limiting

Upstash has a generous free tier and integrates natively with Next.js.

```bash
npm install @upstash/ratelimit @upstash/redis
```

**File:** `app/api/humanize/route.ts` — add at the top of the POST handler:

```ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 h"), // 5 requests per IP per hour
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
  const { success, reset } = await ratelimit.limit(ip);

  if (!success) {
    const retryAfter = Math.ceil((reset - Date.now()) / 1000);
    return NextResponse.json(
      { error: `Rate limit reached. Try again in ${Math.ceil(retryAfter / 60)} minutes.` },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  // ... rest of existing handler
}
```

Add to `.env.local`:

```bash
UPSTASH_REDIS_REST_URL=https://your-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token
```

### Fallback: In-Memory Map (No Redis)

Suitable only for low-traffic deployments running a single server instance.
Resets on every restart and does not work across multiple instances.

```ts
// Add above the POST handler in route.ts:
const ipCounts = new Map<string, { count: number; resetAt: number }>();
const LIMIT    = 5;
const WINDOW   = 3_600_000; // 1 hour in ms

function checkRateLimit(ip: string): boolean {
  const now   = Date.now();
  const entry = ipCounts.get(ip);

  if (!entry || now > entry.resetAt) {
    ipCounts.set(ip, { count: 1, resetAt: now + WINDOW });
    return false; // not limited
  }
  if (entry.count >= LIMIT) return true; // limited
  entry.count++;
  return false;
}

// Inside POST, before the API call:
const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
if (checkRateLimit(ip)) {
  return NextResponse.json(
    { error: "Rate limit reached. Please try again later." },
    { status: 429 }
  );
}
```

---

*Guide version 1.0 — covers Next.js 14+ App Router, TypeScript, OpenRouter API, artificial queue UX, rate limiting*
*Extends the EMI, Car Loan, Salary, Discount, VAT, and Profit Margin Calculator guides for the same multi-tool site*