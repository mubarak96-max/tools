# Word Frequency Counter — Next.js Implementation Guide

### For a Multi-Tool Site at `/free-tools/word-frequency-counter`

---

## Table of Contents

1. Project Overview
2. File & Folder Structure
3. Step 1 — Core Logic
4. Step 2 — Advanced Processing (Filters)
5. Step 3 — Types
6. Step 4 — Client Component (WordFrequency.tsx)
7. Step 5 — Page (SSR + SEO)
8. Step 6 — Shared Layout Integration
9. Step 7 — Sitemap Integration
10. SEO Strategy — Word Frequency Tool
11. On-Page SEO Checklist
12. Feature Expansion Roadmap

---

## 1. Project Overview

**Goal:** Build a Word Frequency Counter as part of your multi-tool platform.

### The tool must:

* Live at `/free-tools/word-frequency-counter`
* Be **fully server-side rendered for SEO**
* Process text instantly on the client
* Show:

  * Word frequency list
  * Total words
  * Unique words
  * Most frequent word
* Be fast, minimal, and scalable

---

### What This Tool Does

Takes user text and returns:

* Frequency of each word
* Sorted list (highest → lowest)
* Basic text statistics

---

### Differentiators (Important)

| Feature               | Basic Tools | Your Tool   |
| --------------------- | ----------- | ----------- |
| Real-time analysis    | ❌           | ✅           |
| Stop-word filtering   | ❌           | ✅           |
| Word length filtering | ❌           | ✅           |
| Clean UI + SEO page   | ❌           | ✅           |
| Export results        | ❌           | ✅ (phase 2) |

---

## 2. File & Folder Structure

```
your-nextjs-project/
├── app/
│   ├── free-tools/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── word-frequency-counter/
│   │       ├── page.tsx
│   │       └── components/
│   │           └── WordFrequency.tsx
│
├── lib/
│   └── tools/
│       └── word-frequency.ts
│
└── types/
    └── tools.ts
```

> Rule: Logic in `lib/`, UI in `app/`

---

## 3. Step 1 — Core Logic

**File:** `lib/tools/word-frequency.ts`

```ts
export function countWordFrequency(text: string) {
  const cleaned = text
    .toLowerCase()
    .replace(/[^\w\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return [];

  const words = cleaned.split(" ");
  const map: Record<string, number> = {};

  for (const word of words) {
    map[word] = (map[word] || 0) + 1;
  }

  return Object.entries(map)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count);
}
```

---

## 4. Step 2 — Advanced Processing

Add filters (important for differentiation)

```ts
const STOP_WORDS = new Set([
  "the","and","is","of","to","in","a","it","that","for","on","with"
]);

export function countWordFrequencyAdvanced(
  text: string,
  options?: {
    ignoreStopWords?: boolean;
    minLength?: number;
  }
) {
  let words = text
    .toLowerCase()
    .replace(/[^\w\s']/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  if (options?.ignoreStopWords) {
    words = words.filter(w => !STOP_WORDS.has(w));
  }

  if (options?.minLength) {
    words = words.filter(w => w.length >= options.minLength);
  }

  const map: Record<string, number> = {};

  for (const word of words) {
    map[word] = (map[word] || 0) + 1;
  }

  return Object.entries(map)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count);
}
```

---

## 5. Step 3 — Types

**File:** `types/tools.ts`

```ts
export interface WordItem {
  word: string;
  count: number;
}
```

---

## 6. Step 4 — Client Component

**File:** `WordFrequency.tsx`

```tsx
"use client";

import { useState, useMemo } from "react";
import { countWordFrequencyAdvanced } from "@/lib/tools/word-frequency";

export default function WordFrequency() {
  const [text, setText] = useState("");
  const [ignoreStopWords, setIgnoreStopWords] = useState(false);
  const [minLength, setMinLength] = useState(1);

  const results = useMemo(() => {
    return countWordFrequencyAdvanced(text, {
      ignoreStopWords,
      minLength,
    });
  }, [text, ignoreStopWords, minLength]);

  const totalWords = text.trim()
    ? text.trim().split(/\s+/).length
    : 0;

  return (
    <div className="tool">

      <textarea
        placeholder="Paste your text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="controls">
        <label>
          <input
            type="checkbox"
            checked={ignoreStopWords}
            onChange={() => setIgnoreStopWords(!ignoreStopWords)}
          />
          Ignore common words
        </label>

        <label>
          Min word length:
          <input
            type="number"
            value={minLength}
            onChange={(e) => setMinLength(Number(e.target.value))}
          />
        </label>
      </div>

      <div className="stats">
        <div>Total Words: {totalWords}</div>
        <div>Unique Words: {results.length}</div>
        <div>
          Most Frequent: {results[0]?.word || "-"}
        </div>
      </div>

      <div className="results">
        {results.map((item) => (
          <div key={item.word}>
            {item.word} — {item.count}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 7. Step 5 — Page (SSR + SEO)

**File:** `page.tsx`

```tsx
import { Metadata } from "next";
import WordFrequency from "./components/WordFrequency";

export const metadata: Metadata = {
  title: "Word Frequency Counter – Free Online Tool",
  description:
    "Analyze text and count how many times each word appears. Free word frequency counter with instant results.",
};

export default function Page() {
  return (
    <main>

      <h1>Word Frequency Counter</h1>
      <p>
        Analyze your text and instantly see how often each word appears.
      </p>

      <WordFrequency />

      <section>
        <h2>What is a Word Frequency Counter?</h2>
        <p>
          A word frequency counter analyzes text and counts how many times each word appears.
        </p>

        <h2>How It Works</h2>
        <ul>
          <li>Text is cleaned (punctuation removed)</li>
          <li>Words are normalized (lowercase)</li>
          <li>Each word is counted</li>
          <li>Results are sorted by frequency</li>
        </ul>

        <h2>Use Cases</h2>
        <ul>
          <li>SEO keyword analysis</li>
          <li>Content optimization</li>
          <li>Academic writing analysis</li>
          <li>Text pattern detection</li>
        </ul>
      </section>

      <aside>
        <h2>Related Tools</h2>
        <ul>
          <li><a href="/free-tools/text-case-converter">Text Case Converter</a></li>
          <li><a href="/free-tools/word-counter">Word Counter</a></li>
        </ul>
      </aside>

    </main>
  );
}
```

---

## 8. Step 6 — Layout Integration

Add to sidebar:

```tsx
{
  name: "Word Frequency Counter",
  href: "/free-tools/word-frequency-counter",
  category: "Utility"
}
```

---

## 9. Step 7 — Sitemap

Add:

```ts
{
  url: "https://yoursite.com/free-tools/word-frequency-counter",
  priority: 0.8,
}
```

---

## 10. SEO Strategy

### Target Keywords

* word frequency counter
* keyword frequency checker
* text analyzer
* most used words tool

---

### Long-tail pages (IMPORTANT)

* word frequency in essay
* keyword density checker
* word repetition checker

---

## 11. On-Page SEO Checklist

* H1 includes keyword
* 300+ words content
* internal links
* fast load
* mobile friendly
* no login required

---

## 12. Feature Expansion Roadmap

### Phase 2

* Export CSV
* Copy results
* Highlight words in text

### Phase 3

* Keyword density %
* Compare two texts
* AI insights

---

## Final Note

This tool is:

* **Simple to build**
* **High search demand**
* **Perfect for programmatic SEO expansion**

Replicate this structure across 20+ tools → real traffic.

---
