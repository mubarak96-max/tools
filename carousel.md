# High-Performance Carousel Builder (Ad-Supported) — Full Product Spec

> **Objective:** Build a fast, SEO-driven carousel builder optimized for repeat usage, ad monetization, and low operating cost. AI is used in a controlled, limited way to improve UX — not as the core engine.

---

## Table of Contents

1. [Product Philosophy](#1-product-philosophy)
2. [Core User Flow](#2-core-user-flow)
3. [Feature Scope](#3-feature-scope)
4. [Tech Stack](#4-tech-stack)
5. [Project Structure](#5-project-structure)
6. [Data Model](#6-data-model)
7. [Templates Strategy](#7-templates-strategy)
8. [AI System](#8-ai-system)
9. [Editor UX](#9-editor-ux)
10. [Export System](#10-export-system)
11. [Autosave & Storage](#11-autosave--storage)
12. [Programmatic SEO Strategy](#12-programmatic-seo-strategy)
13. [Monetization Strategy](#13-monetization-strategy)
14. [Performance Targets](#14-performance-targets)
15. [Implementation Phases](#15-implementation-phases)

---

## 1. Product Philosophy

### This is NOT a design tool.

### This is: **The fastest way to create a high-performing social media carousel**

#### Core Principles
- **Speed > features**
- **Simplicity > flexibility**
- **Outcomes > customization**
- **Retention > one-time use**
- **Low cost per user** (critical for AdSense)

---

## 2. Core User Flow (Optimized for Retention)

### Primary Flow (Default Experience)
1. User lands on niche-specific page (e.g., `/instagram-carousel-maker`)
2. Sees input: **"What is your carousel about?"**
3. Enters topic
4. Clicks **Generate** (AI-assisted)
5. Gets:
   - 5–7 slides
   - Applied template
6. Edits quickly
7. Exports

**⏱ Target: < 30 seconds to first usable result**

### Secondary Flow (Manual)
1. Browse templates
2. Select template
3. Edit content
4. Export

### Return Flow (Retention)
1. **"Your previous carousels"**
2. Duplicate + edit
3. Faster second session

---

## 3. Feature Scope (Lean, High ROI)

### 3.1 Core Features
- **Templates** (10–15 max, high quality)
- **Text editing** (headline, body)
- **Slide management:**
  - Add
  - Duplicate
  - Delete
- **Color themes** (preset palettes)
- **Export:**
  - PNG
  - ZIP (multiple slides)

### 3.2 AI (Controlled, Limited)
**AI is NOT unlimited.**

**Allowed Actions:**
- Generate carousel (1–2 times per session)
- Improve headline
- Generate CTA

**Restrictions:**
- Max 2 generations per session
- No continuous chat
- No long-form generation

**Goal:**
- Reduce friction
- Increase session time
- Keep costs low

### 3.3 Removed / Deferred Features
**DO NOT BUILD (v1):**
- Charts
- Polls / quizzes
- Interactive elements
- Complex canvas tools
- Fabric / Konva heavy editing

**Reason:** → High complexity, low usage, no revenue impact

---

## 4. Tech Stack

```
Next.js 14
React 18
TypeScript
Zustand
Tailwind CSS
```

### Minimal Additions
```
html-to-image (export)
JSZip (ZIP export)
OpenRouter API (controlled usage) - Already integrated
```

---

## 5. Project Structure

```
src/app/carousel-builder/
├── page.tsx                    # Main tool page
├── [...slug]/
│   └── page.tsx               # Programmatic SEO pages
├── components/
│   ├── Editor.tsx
│   ├── Canvas.tsx
│   ├── TemplateSelector.tsx
│   ├── SlideStrip.tsx
│   ├── Toolbar.tsx
│   ├── AIInput.tsx
│   ├── ExportButton.tsx
│   ├── SavedProjects.tsx
│   └── SEOContent.tsx         # Niche-specific content
├── store/
│   └── useEditorStore.ts
├── data/
│   ├── templates.ts
│   ├── palettes.ts
│   └── niches.ts              # SEO niche configurations
├── utils/
│   ├── ai.ts
│   ├── export.ts
│   ├── storage.ts
│   └── seo.ts                 # SEO utilities
├── hooks/
│   └── useAutosave.ts
└── types/
    └── index.ts
```

---

## 6. Data Model (Simplified)

```typescript
export interface Slide {
  id: string;
  headline: string;
  body: string;
}

export interface Project {
  id: string;
  slides: Slide[];
  templateId: string;
  paletteId: string;
  createdAt: number;
  updatedAt: number;
}

export interface NicheConfig {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  templates: string[];
  defaultTopic: string;
  seoContent: {
    h1: string;
    intro: string;
    benefits: string[];
    examples: string[];
    faqs: FAQ[];
  };
}

export interface AIUsage {
  count: number;
  limit: 2;
  resetTime: number;
}
```

---

## 7. Templates Strategy (Strategic, Not Generic)

Templates are based on **viral formats**, not categories.

### Required Templates
1. **Hook → Value → CTA**
2. **Mistakes list**
3. **Step-by-step guide**
4. **Before / After**
5. **Story format**
6. **Controversial opinion**
7. **Tips carousel**
8. **Personal growth**
9. **Business advice**
10. **Product promotion**

Each template includes:
- Pre-written structure
- Slide count
- Tone guidance

### Template Data Structure

```typescript
export interface Template {
  id: string;
  name: string;
  description: string;
  slideCount: number;
  structure: string[];
  niches: string[];
  viralScore: number;
  slides: {
    headline: string;
    body: string;
    placeholder: string;
  }[];
}
```

---

## 8. AI System (Cost-Controlled)

### 8.1 AI Entry Point
**Component:** `AIInput.tsx`
- Input: "What is your carousel about?"
- Button: Generate

### 8.2 AI Prompt Design

**System Prompt:**
```
You generate short, high-performing carousel slides.

Rules:
- Max 6 slides
- Each slide max 12 words
- Strong hook on slide 1
- Clear CTA on last slide
- No emojis
- No fluff
```

### 8.3 API Implementation

**File: `src/app/api/carousel-generate/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { logServerError } from "@/lib/monitoring/logger";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const ipCounts = new Map<string, RateLimitEntry>();
const LIMIT = 2; // Max 2 generations per hour per IP
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

function getClientIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous";
}

function checkRateLimit(ip: string) {
  const now = Date.now();
  const entry = ipCounts.get(ip);

  if (!entry || now > entry.resetAt) {
    ipCounts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { limited: false, retryAfter: 0 };
  }

  if (entry.count >= LIMIT) {
    return {
      limited: true,
      retryAfter: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    };
  }

  entry.count += 1;
  return { limited: false, retryAfter: 0 };
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const { limited, retryAfter } = checkRateLimit(ip);

  if (limited) {
    return NextResponse.json(
      { error: `Generation limit reached. Try again in ${Math.ceil(retryAfter / 60)} minutes.` },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  try {
    const body = await req.json();
    const { topic, niche } = body;

    if (!topic || typeof topic !== "string") {
      return NextResponse.json({ error: "Missing or invalid topic." }, { status: 400 });
    }

    const trimmed = topic.trim();
    if (trimmed.length === 0 || trimmed.length > 200) {
      return NextResponse.json({ error: "Topic must be 1-200 characters." }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Service temporarily unavailable." }, { status: 503 });
    }

    const prompt = buildCarouselPrompt(trimmed, niche);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_BASE_URL || "https://findbest.tools",
        "X-Title": "findbesttool Carousel Builder",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite", // Cost-effective model
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 400, // Keep tokens low for cost control
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      logServerError("carousel_generate_failed", errorBody, {
        status: response.status,
      });
      return NextResponse.json(
        { error: "Generation failed. Please try again." },
        { status: 502 },
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim();

    if (!content) {
      return NextResponse.json(
        { error: "No content generated. Please try again." },
        { status: 502 },
      );
    }

    // Parse JSON response
    const slides = parseCarouselResponse(content);
    if (!slides || slides.length === 0) {
      return NextResponse.json(
        { error: "Invalid response format. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ slides });
  } catch (error) {
    logServerError("carousel_generate_route_failed", error, { ip });
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}

function buildCarouselPrompt(topic: string, niche?: string): string {
  const nicheContext = niche ? `This is for ${niche.replace('-', ' ')} content.` : '';
  
  return `Generate a high-performing social media carousel about "${topic}". ${nicheContext}

Rules:
- Return ONLY valid JSON array
- Max 6 slides
- Each headline max 12 words
- Strong hook on slide 1
- Clear CTA on last slide
- No emojis or special characters
- Focus on value and engagement

Format:
[
  {"headline": "Hook that grabs attention", "body": ""},
  {"headline": "Value point 1", "body": ""},
  {"headline": "Value point 2", "body": ""},
  {"headline": "Value point 3", "body": ""},
  {"headline": "Social proof or story", "body": ""},
  {"headline": "Clear call to action", "body": ""}
]`;
}

function parseCarouselResponse(content: string): Array<{headline: string, body: string}> | null {
  try {
    // Extract JSON from response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return null;
    
    const slides = JSON.parse(jsonMatch[0]);
    
    // Validate structure
    if (!Array.isArray(slides) || slides.length === 0) return null;
    
    return slides.filter(slide => 
      slide.headline && 
      typeof slide.headline === 'string' && 
      slide.headline.length > 0
    );
  } catch (error) {
    return null;
  }
}
```

### 8.4 Client-Side Usage

**File: `src/utils/ai.ts`**

```typescript
export interface CarouselSlide {
  headline: string;
  body: string;
}

export interface GenerateCarouselRequest {
  topic: string;
  niche?: string;
}

export interface GenerateCarouselResponse {
  slides: CarouselSlide[];
  error?: string;
}

export async function generateCarousel(
  request: GenerateCarouselRequest
): Promise<GenerateCarouselResponse> {
  try {
    const response = await fetch('/api/carousel-generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
      return { slides: [], error: data.error || 'Generation failed' };
    }

    return { slides: data.slides || [] };
  } catch (error) {
    return { slides: [], error: 'Network error. Please try again.' };
  }
}

export function isRateLimited(error: string): boolean {
  return error.includes('limit reached');
}

export function getRateLimitMessage(error: string): string {
  const match = error.match(/Try again in (\d+) minutes/);
  if (match) {
    return `You've reached the generation limit. Try again in ${match[1]} minutes.`;
  }
  return 'Generation limit reached. Please try again later.';
}
```

### 8.5 Usage Limits (Critical)

Store in Zustand:
```typescript
interface AIUsage {
  count: number;
  limit: 2;
  resetTime: number;
  isBlocked: boolean;
}

// In store
aiUsage: {
  count: 0,
  limit: 2,
  resetTime: 0,
  isBlocked: false,
}
```

Logic:
```typescript
const canUseAI = () => {
  const now = Date.now();
  if (now > aiUsage.resetTime) {
    // Reset counter after 1 hour
    updateAIUsage({ count: 0, resetTime: now + 3600000, isBlocked: false });
    return true;
  }
  return aiUsage.count < aiUsage.limit;
};
```

### 8.6 Cost Optimization
- **Use Gemini 2.5 Flash Lite** (cost-effective model via OpenRouter)
- **Max tokens: 400** (keeps costs very low)
- **No conversation memory** (stateless requests)
- **Rate limiting: 2 generations per hour per IP**
- **Simple JSON responses** (no complex parsing needed)

---

## 9. Editor UX (Simplified)

### Layout
```
[ Toolbar ]
[ Template Selector ] [ Canvas ] [ Controls ]
[ Slide Strip ]
```

### Canvas
- Fixed ratio (1080x1350)
- Scaled preview
- No drag complexity

### Editing
- Click text → edit inline
- Minimal controls:
  - font size
  - alignment
  - color

---

## 10. Export System

### Formats
- **PNG** (single slide)
- **ZIP** (all slides)

### Naming
- `carousel-slide-1.png`
- `carousel-slide-2.png`

### Sizes
- **Default:** 1080x1350
- **Optional:**
  - 1080x1080
  - 1920x1080

---

## 11. Autosave & Storage

### Local Storage
- Save project on change
- Restore on reload

### Saved Projects
Show:
- last 5 projects
- preview thumbnails

---

## 12. Programmatic SEO Strategy (CRITICAL FOR ADS)

### 12.1 Niche-Specific Landing Pages

Create multiple targeted pages that all lead to the same tool:

```
/carousel-builder                    → Main tool
/instagram-carousel-maker           → Instagram-focused
/linkedin-carousel-generator        → LinkedIn-focused  
/real-estate-carousel-templates     → Real estate niche
/fitness-carousel-maker             → Fitness niche
/business-carousel-templates        → Business focus
/marketing-carousel-creator         → Marketing niche
/personal-brand-carousel-maker      → Personal branding
/education-carousel-templates       → Education niche
/ecommerce-carousel-generator       → E-commerce focus
/nonprofit-carousel-maker           → Nonprofit sector
```

### 12.2 Implementation Structure

**File: `src/app/[...slug]/page.tsx`**

```typescript
import { getNicheConfig, generateMetadata } from '@/utils/seo';
import { CarouselBuilder } from '@/components/Editor';
import { SEOContent } from '@/components/SEOContent';

export async function generateStaticParams() {
  return [
    { slug: ['instagram-carousel-maker'] },
    { slug: ['linkedin-carousel-generator'] },
    { slug: ['real-estate-carousel-templates'] },
    { slug: ['fitness-carousel-maker'] },
    { slug: ['business-carousel-templates'] },
    { slug: ['marketing-carousel-creator'] },
    { slug: ['personal-brand-carousel-maker'] },
    { slug: ['education-carousel-templates'] },
    { slug: ['ecommerce-carousel-generator'] },
    { slug: ['nonprofit-carousel-maker'] },
  ];
}

export async function generateMetadata({ params }: { params: { slug: string[] } }) {
  const niche = getNicheConfig(params.slug[0]);
  return {
    title: niche.title,
    description: niche.description,
    keywords: niche.keywords.join(', '),
    openGraph: {
      title: niche.title,
      description: niche.description,
      images: [`/og-images/${niche.slug}.jpg`]
    }
  };
}

export default function NichePage({ params }: { params: { slug: string[] } }) {
  const niche = getNicheConfig(params.slug[0]);
  
  return (
    <div>
      {/* SEO Content Block */}
      <SEOContent niche={niche} />
      
      {/* Same Carousel Builder Tool */}
      <CarouselBuilder 
        preselectedTemplates={niche.templates}
        defaultTopic={niche.defaultTopic}
        niche={niche.slug}
      />
    </div>
  );
}
```

### 12.3 Niche Configuration Data

**File: `src/data/niches.ts`**

```typescript
export const NICHE_CONFIGS: Record<string, NicheConfig> = {
  'instagram-carousel-maker': {
    slug: 'instagram-carousel-maker',
    title: 'Instagram Carousel Maker - Create Viral Posts in 30 Seconds',
    description: 'Free Instagram carousel maker. Create engaging multi-slide posts that get more likes, comments, and followers. No design skills needed.',
    keywords: [
      'instagram carousel maker',
      'instagram post creator',
      'social media carousel',
      'instagram content creator',
      'carousel generator free'
    ],
    templates: ['hook-value-cta', 'tips-carousel', 'before-after', 'story-format'],
    defaultTopic: 'Instagram growth tips',
    seoContent: {
      h1: 'Free Instagram Carousel Maker',
      intro: 'Create scroll-stopping Instagram carousels that get more engagement. Generate professional multi-slide posts in under 30 seconds.',
      benefits: [
        'Increase engagement by 300%',
        'Save 2 hours per post',
        'No design skills required',
        'Viral-tested templates',
        'Export ready-to-post images'
      ],
      examples: [
        'Growth tips carousel',
        'Product showcase slides',
        'Behind-the-scenes story',
        'Tutorial step-by-step',
        'Before/after transformation'
      ],
      faqs: [
        {
          question: 'How do I make an Instagram carousel?',
          answer: 'Simply enter your topic, click generate, and get 5-7 professionally designed slides ready to post.'
        },
        {
          question: 'What size should Instagram carousels be?',
          answer: 'Our tool automatically creates carousels in the optimal 1080x1350 size for maximum engagement.'
        }
      ]
    }
  },

  'linkedin-carousel-generator': {
    slug: 'linkedin-carousel-generator',
    title: 'LinkedIn Carousel Generator - Professional Posts That Get Noticed',
    description: 'Create professional LinkedIn carousels for business growth. Stand out with engaging multi-slide posts that build authority.',
    keywords: [
      'linkedin carousel generator',
      'professional linkedin posts',
      'business carousel maker',
      'linkedin content creator',
      'professional social media'
    ],
    templates: ['business-advice', 'step-by-step', 'personal-growth', 'controversial-opinion'],
    defaultTopic: 'Business leadership insights',
    seoContent: {
      h1: 'LinkedIn Carousel Generator',
      intro: 'Stand out on LinkedIn with professional carousel posts that build thought leadership and grow your network.',
      benefits: [
        'Build thought leadership',
        'Increase profile views by 400%',
        'Generate quality leads',
        'Professional templates',
        'Business-focused content'
      ],
      examples: [
        'Industry insights carousel',
        'Career advice slides',
        'Business strategy tips',
        'Leadership lessons',
        'Professional growth guide'
      ],
      faqs: [
        {
          question: 'How do LinkedIn carousels work?',
          answer: 'LinkedIn carousels are multi-slide posts that users can swipe through, perfect for sharing detailed insights and building engagement.'
        },
        {
          question: 'What makes a good LinkedIn carousel?',
          answer: 'Professional design, valuable business insights, clear structure, and a strong call-to-action that encourages networking.'
        }
      ]
    }
  },

  'real-estate-carousel-templates': {
    slug: 'real-estate-carousel-templates',
    title: 'Real Estate Carousel Templates - Showcase Properties Like a Pro',
    description: 'Professional real estate carousel templates. Create stunning property showcases, market updates, and buyer guides that convert.',
    keywords: [
      'real estate carousel templates',
      'property showcase slides',
      'real estate marketing',
      'property listing carousel',
      'realtor social media'
    ],
    templates: ['product-promotion', 'before-after', 'step-by-step', 'tips-carousel'],
    defaultTopic: 'Property showcase and market insights',
    seoContent: {
      h1: 'Real Estate Carousel Templates',
      intro: 'Create professional property showcases and market insights that attract buyers and sellers. Perfect for realtors and agencies.',
      benefits: [
        'Showcase properties professionally',
        'Generate more leads',
        'Build real estate authority',
        'Save hours on content creation',
        'Mobile-optimized designs'
      ],
      examples: [
        'Property listing showcase',
        'Market update slides',
        'Home buying guide',
        'Neighborhood highlights',
        'Investment property analysis'
      ],
      faqs: [
        {
          question: 'How can carousels help real estate marketing?',
          answer: 'Carousels let you showcase multiple property photos, market data, and buying tips in one engaging post that gets more views than single images.'
        },
        {
          question: 'What should I include in a property carousel?',
          answer: 'Include exterior/interior photos, key features, neighborhood info, pricing, and a clear call-to-action for interested buyers.'
        }
      ]
    }
  }

  // Add more niches...
};
```

### 12.4 SEO Content Component

**File: `src/components/SEOContent.tsx`**

```typescript
'use client';

import React from 'react';
import { NicheConfig } from '@/types';

interface SEOContentProps {
  niche: NicheConfig;
}

export const SEOContent: React.FC<SEOContentProps> = ({ niche }) => {
  const scrollToTool = () => {
    document.getElementById('carousel-tool')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
          {niche.seoContent.h1}
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          {niche.seoContent.intro}
        </p>
        <button 
          onClick={scrollToTool}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
        >
          Create Your Carousel Now →
        </button>
      </div>

      {/* Benefits Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {niche.seoContent.benefits.map((benefit, index) => (
          <div key={benefit} className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">{index + 1}</span>
            </div>
            <h3 className="font-semibold mb-2 text-gray-900">{benefit}</h3>
          </div>
        ))}
      </div>

      {/* Examples Gallery */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
          {niche.title.split(' ')[0]} Carousel Examples
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {niche.seoContent.examples.map((example, index) => (
            <div key={example} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 h-32 rounded mb-3 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">Preview {index + 1}</span>
              </div>
              <h4 className="font-medium text-gray-900">{example}</h4>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {niche.seoContent.faqs.map((faq, index) => (
            <div key={index} className="border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2 text-gray-900">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="text-center bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">
          Ready to Create Your First Carousel?
        </h2>
        <p className="text-gray-600 mb-6">
          Join thousands of creators using our tool to grow their audience
        </p>
        <button 
          onClick={scrollToTool}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
        >
          Start Creating Free Carousels
        </button>
      </div>
    </div>
  );
};
```

### 12.5 SEO Utilities

**File: `src/utils/seo.ts`**

```typescript
import { NICHE_CONFIGS } from '@/data/niches';
import { NicheConfig } from '@/types';

export const getNicheConfig = (slug: string): NicheConfig => {
  return NICHE_CONFIGS[slug] || NICHE_CONFIGS['carousel-builder'];
};

export const generateMetadata = (niche: NicheConfig) => ({
  title: niche.title,
  description: niche.description,
  keywords: niche.keywords.join(', '),
  openGraph: {
    title: niche.title,
    description: niche.description,
    images: [`/og-images/${niche.slug}.jpg`],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: niche.title,
    description: niche.description,
    images: [`/og-images/${niche.slug}.jpg`]
  }
});

export const getToolConfig = (niche: string) => {
  const config = getNicheConfig(niche);
  return {
    templates: config.templates,
    defaultTopic: config.defaultTopic,
    placeholder: `e.g., ${config.defaultTopic}`,
    suggestedTopics: generateSuggestedTopics(niche)
  };
};

const generateSuggestedTopics = (niche: string): string[] => {
  const suggestions: Record<string, string[]> = {
    'instagram-carousel-maker': [
      'Instagram growth hacks',
      'Content creation tips',
      'Engagement strategies',
      'Hashtag research guide'
    ],
    'linkedin-carousel-generator': [
      'Leadership lessons',
      'Career advancement tips',
      'Industry insights',
      'Networking strategies'
    ],
    'real-estate-carousel-templates': [
      'Home buying process',
      'Market trends analysis',
      'Property investment tips',
      'Neighborhood guides'
    ]
  };
  
  return suggestions[niche] || ['Business tips', 'Growth strategies', 'Industry insights'];
};
```

### 12.6 Traffic Projection

**Target Keywords & Monthly Searches:**
- "instagram carousel maker" → 5,000 searches
- "linkedin carousel generator" → 2,000 searches  
- "real estate carousel templates" → 1,500 searches
- "fitness carousel maker" → 800 searches
- "business carousel templates" → 1,200 searches
- "marketing carousel creator" → 900 searches
- "personal brand carousel" → 600 searches
- "education carousel templates" → 700 searches
- "ecommerce carousel generator" → 800 searches
- "nonprofit carousel maker" → 400 searches

**Total Potential:** 50,000+ targeted searches/month vs 5,000 generic searches

---

## 13. Monetization Strategy

### Ads Placement
- **Top banner** (non-intrusive)
- **Sidebar** (desktop)
- **Between actions** (after export)

### Revenue Model
- **High traffic** (50K+ monthly visitors)
- **Low cost per user** (AI usage limited)
- **Multiple touchpoints** (programmatic SEO)

### Ad Optimization
- **AdSense integration**
- **Niche-specific ads** (higher CPM)
- **User behavior tracking**

---

## 14. Performance Targets

- **Load time:** < 2s
- **First interaction:** < 1s
- **Export time:** < 2s
- **SEO pages:** < 1.5s

---

## 15. Implementation Phases

### Phase 1: MVP (2 weeks)
1. Core editor with 5 viral templates
2. AI input with controlled usage (2 generations/session)
3. Basic export (PNG/ZIP)
4. Local storage autosave
5. Main carousel-builder page

### Phase 2: SEO Growth (2 weeks)
1. Implement programmatic SEO structure
2. Create 10 niche-specific landing pages
3. SEO content components
4. Ad placement integration
5. Analytics setup

### Phase 3: Optimization (2 weeks)
1. Performance optimization
2. Additional viral templates (10 total)
3. User behavior tracking
4. Conversion optimization
5. Advanced analytics

### Phase 4: Scale (Ongoing)
1. More niche pages (50+ total)
2. Template performance tracking
3. A/B testing system
4. Advanced monetization
5. User retention features

---

## 16. Success Metrics

### This product wins if:
- Users get value in **< 30 seconds**
- They **return without friction**
- It **ranks on Google** for target keywords
- **AI improves experience** without increasing cost
- **Ad revenue > operating costs**

### Final Rule
If a feature:
- Slows down the user
- Increases cost
- Doesn't increase retention

**→ Do not build it**

---

**End of Spec**

---

## 3. Project Structure

```
src/app/utility/free-social-media-carousel-builder/
├── page.tsx                          # Main carousel builder page
├── components/
│   ├── desktop/
│   │   ├── DesktopEditor.tsx         # Three-column shell
│   │   ├── LeftSidebar.tsx           # Category nav + template grid
│   │   ├── RightSidebar.tsx          # Enhanced design panel
│   │   ├── Toolbar.tsx               # Top bar with export button
│   │   └── SlideStrip.tsx            # Bottom slide thumbnails
│   │
│   ├── mobile/
│   │   ├── MobileEditor.tsx          # Full-screen canvas + bottom nav
│   │   ├── BottomNav.tsx             # Enhanced 6-tab nav bar
│   │   ├── BottomSheet.tsx           # Reusable swipe-up sheet
│   │   ├── sheets/
│   │   │   ├── SlidesSheet.tsx       # All slides grid
│   │   │   ├── TemplatesSheet.tsx    # Category chips + template row
│   │   │   ├── DesignSheet.tsx       # Enhanced design options
│   │   │   ├── TextSheet.tsx         # Rich text editors with effects
│   │   │   ├── MediaSheet.tsx        # Stock photos + patterns
│   │   │   ├── ShapesSheet.tsx       # Geometric shapes + charts
│   │   │   ├── IconSheet.tsx         # Social media icons + emojis
│   │   │   ├── InteractiveSheet.tsx  # Polls, quizzes, clickable areas
│   │   │   └── ExportSheet.tsx       # PNG / PDF / interactive export
│   │
│   ├── canvas/
│   │   ├── SlideCanvas.tsx           # Enhanced canvas with layers
│   │   ├── EditableText.tsx          # Rich text with effects
│   │   ├── MediaElement.tsx          # Stock photos + patterns
│   │   ├── ShapeElement.tsx          # Geometric shapes + charts
│   │   ├── IconElement.tsx           # Social media icons
│   │   ├── InteractiveElement.tsx    # Polls, quizzes, clickable areas
│   │   └── SlideNumber.tsx           # Slide X/Y indicator
│   │
│   ├── panels/
│   │   ├── StockPhotoPanel.tsx       # Unsplash integration
│   │   ├── PatternPanel.tsx          # Pattern overlays
│   │   ├── TextEffectsPanel.tsx      # Shadows, outlines, gradients
│   │   ├── ShapeLibrary.tsx          # Geometric shapes + arrows
│   │   ├── ChartBuilder.tsx          # Chart/graph elements
│   │   ├── IconLibrary.tsx           # Social media icons
│   │   └── InteractiveBuilder.tsx    # Poll/quiz creator
│   │
│   └── shared/
│       ├── ColorSwatch.tsx
│       ├── FontPill.tsx
│       ├── LayoutOption.tsx
│       ├── TemplateCard.tsx
│       ├── SlideThumbnail.tsx
│       ├── AutoSaveIndicator.tsx
│       └── PWAInstallPrompt.tsx
│
├── hooks/
│   ├── useIsMobile.ts                # Responsive breakpoint hook
│   ├── useExport.ts                  # Enhanced PNG/PDF/interactive export
│   ├── useAutoSave.ts                # Auto-save to localStorage
│   ├── useUnsplash.ts                # Stock photo integration
│   ├── usePWA.ts                     # PWA installation & offline
│   └── useInteractive.ts             # Interactive elements handler
│
├── store/
│   └── useEditorStore.ts             # Enhanced Zustand store
│
├── data/
│   ├── templates.ts                  # All 24 template definitions
│   ├── categories.ts                 # Category metadata
│   ├── patterns.ts                   # Pattern overlay definitions
│   ├── shapes.ts                     # Geometric shape library
│   ├── charts.ts                     # Chart/graph templates
│   ├── icons.ts                      # Social media icon library
│   └── interactive.ts                # Interactive element templates
│
├── types/
│   └── index.ts                      # Enhanced TypeScript types
│
├── utils/
│   ├── unsplash.ts                   # Unsplash API client
│   ├── canvas.ts                     # Canvas manipulation utilities
│   ├── export.ts                     # Enhanced export utilities
│   ├── storage.ts                    # localStorage utilities
│   └── pwa.ts                        # PWA utilities
│
└── styles/
    ├── globals.css                   # Enhanced global styles
    └── components.css                # Component-specific styles
```

---

## 4. Data Models & Types

**File: `src/app/utility/carousel-builder/types/index.ts`**

```typescript
// ─── Category ────────────────────────────────────────────────────────────────

export type CategoryId =
  | 'business'
  | 'social'
  | 'educational'
  | 'marketing'
  | 'personal'
  | 'lists'
  | 'before_after'
  | 'statistics';

export interface Category {
  id: CategoryId;
  label: string;
  color: string; // hex, used for dot and accent
  templateTypes: string[]; // human-readable names of template types in this category
}

// ─── Enhanced Media & Assets ─────────────────────────────────────────────────

export interface StockPhoto {
  id: string;
  url: string;
  thumbnailUrl: string;
  photographer: string;
  description: string;
  tags: string[];
  width: number;
  height: number;
}

export interface PatternOverlay {
  id: string;
  name: string;
  url: string;
  category: 'geometric' | 'organic' | 'texture' | 'noise';
  opacity: number;
  blendMode: 'multiply' | 'overlay' | 'soft-light' | 'normal';
}

export interface TextEffect {
  shadow?: {
    offsetX: number;
    offsetY: number;
    blur: number;
    color: string;
  };
  outline?: {
    width: number;
    color: string;
  };
  gradient?: {
    type: 'linear' | 'radial';
    colors: string[];
    angle?: number;
  };
}

// ─── Shapes & Elements ───────────────────────────────────────────────────────

export type ShapeType = 
  | 'rectangle' | 'circle' | 'triangle' | 'arrow' | 'line' | 'divider'
  | 'star' | 'heart' | 'diamond' | 'hexagon';

export interface GeometricShape {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  opacity: number;
}

export type ChartType = 'bar' | 'line' | 'pie' | 'doughnut' | 'area' | 'progress';

export interface ChartElement {
  id: string;
  type: ChartType;
  x: number;
  y: number;
  width: number;
  height: number;
  data: any; // Chart.js data format
  options: any; // Chart.js options
  colors: string[];
}

export interface SocialIcon {
  id: string;
  platform: string;
  iconType: 'filled' | 'outlined' | 'brand';
  x: number;
  y: number;
  size: number;
  color: string;
  url?: string; // for clickable icons
}

// ─── Interactive Elements ────────────────────────────────────────────────────

export type InteractiveType = 'poll' | 'quiz' | 'clickable-area' | 'button' | 'link';

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  color: string;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  showResults: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface ClickableArea {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  action: 'link' | 'next-slide' | 'previous-slide' | 'custom';
  url?: string;
  customAction?: string;
  tooltip?: string;
}

export interface InteractiveElement {
  id: string;
  type: InteractiveType;
  x: number;
  y: number;
  width: number;
  height: number;
  data: Poll | QuizQuestion | ClickableArea | any;
  style: {
    backgroundColor: string;
    textColor: string;
    borderRadius: number;
    fontSize: number;
  };
}

// ─── Template ────────────────────────────────────────────────────────────────

export type LayoutId = 'centered' | 'left' | 'top_accent' | 'split' | 'minimal' | 'bold';

export interface SlideTemplate {
  id: string;                  // unique, e.g. 'biz_pitch_deck'
  name: string;                // display name, e.g. 'Pitch Deck'
  categoryId: CategoryId;
  background: string;          // CSS value: hex, gradient, or 'url(...)'
  accentColor: string;         // hex
  tagText: string;             // badge label, e.g. 'PITCH DECK'
  defaultHeadline: string;
  defaultSubtitle: string;
  defaultBody: string;
  layout: LayoutId;
  darkText: boolean;           // true = use dark text (for light backgrounds)
  fontFamily: FontId;          // default font for this template
  // Enhanced template features
  defaultPatterns?: PatternOverlay[];
  defaultShapes?: GeometricShape[];
  defaultIcons?: SocialIcon[];
  defaultInteractive?: InteractiveElement[];
}

// ─── Fonts ───────────────────────────────────────────────────────────────────

export type FontId = 'syne' | 'dm_sans' | 'dm_serif' | 'space_mono';

export interface FontOption {
  id: FontId;
  label: string;
  css: string;  // CSS font-family string
}

// ─── Palette ─────────────────────────────────────────────────────────────────

export interface Palette {
  id: string;
  background: string;   // main bg color/gradient
  accent: string;       // accent/highlight color
  textPrimary: string;  // main text color
  textSecondary: string;
}

// ─── Enhanced Slide ──────────────────────────────────────────────────────────

export interface IconOverlay {
  id: string;
  content: string;     // emoji character or SVG string
  x: number;          // percentage 0-100 from left
  y: number;          // percentage 0-100 from top
  size: number;       // px
}

export interface Slide {
  id: string;                  // uuid
  templateId: string;          // references SlideTemplate.id
  headline: string;
  subtitle: string;
  body: string;
  background: string;          // overrides template background if set
  accentColor: string;         // overrides template accent
  fontId: FontId;              // overrides template font
  layout: LayoutId;            // overrides template layout
  darkText: boolean;
  
  // Enhanced elements
  textEffects: TextEffect;     // text styling effects
  stockPhoto?: StockPhoto;     // background stock photo
  patterns: PatternOverlay[];  // pattern overlays
  shapes: GeometricShape[];    // geometric shapes
  charts: ChartElement[];      // chart/graph elements
  socialIcons: SocialIcon[];   // social media icons
  interactive: InteractiveElement[]; // polls, quizzes, clickable areas
  icons: IconOverlay[];        // legacy emoji/icon support
  
  customPaletteId?: string;    // if user picked a palette swatch
  
  // Auto-save metadata
  lastModified: Date;
  autoSaved: boolean;
}

// ─── PWA & Auto-Save ─────────────────────────────────────────────────────────

export interface AutoSaveState {
  enabled: boolean;
  interval: number; // milliseconds
  lastSaved: Date | null;
  isDirty: boolean;
  isOnline: boolean;
}

export interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isOffline: boolean;
  updateAvailable: boolean;
}

// ─── Enhanced Editor State ───────────────────────────────────────────────────

export type ActiveSheet =
  | 'slides'
  | 'templates'
  | 'design'
  | 'text'
  | 'media'      // Stock photos + patterns
  | 'shapes'     // Geometric shapes + charts
  | 'icons'      // Social media icons + emojis
  | 'interactive' // Polls, quizzes, clickable areas
  | 'export'
  | null;

export interface EditorState {
  slides: Slide[];
  activeSlideIndex: number;
  activeSheet: ActiveSheet;           // mobile only
  activeCategoryId: CategoryId | 'all';
  
  // Enhanced state
  autoSave: AutoSaveState;
  pwa: PWAState;
  unsplashApiKey?: string;
  selectedElement: string | null;     // ID of currently selected element
  clipboardElement: any | null;      // For copy/paste functionality

  // actions
  setActiveSlide: (index: number) => void;
  setActiveSheet: ActiveSheet) => void;
  setActiveCategory: (id: CategoryId | 'all') => void;
  setSelectedElement: (id: string | null) => void;

  // Slide CRUD
  adide: (templateId: string) => void;
  duplicateSlide: (index: numberd;
  deleteSlide: (index: number) => void;
  reorderSlides: (fromIndex: number, toIndex: number) => void;

  // Template & Basic Edits
  applyTemplate: (templateId: string) => void;
  updateSlideText: (field: 'headline' | 'subtitle' | 'body', value: string) => void;
  updateSlideBackground: (background: string) => void;
  updateSlideAccent: (accent: string) => void;
  updateSlideFont: (fontId: FontId) => void;
  updateSleLayout: (layout: LayoutId) => void;

  // Enhanced Features
  updateTextEffects: (effects: TextEffect) => void;
  setStockPhoto: (photo: StockPhoto) => void;
  addPattern: (pattern: PatternOverlay) => void;
  removePattern: (patternId: string) => void;
  addShape: (shape: Omit<GeometricShape, 'id'>) => void;
  updateShape: (shapeId: string, updates: Partial<GeometricShape>) => void;
  removeShape: (shapeId: string) => void;
  addChart: (chart: Omit<ChartElement, 'id'>) => void;
  updateChart: (chartId: string, updates: Partial<ChartElement>) => void;
  removeChart: (chartId: string) => void;
  addSocialIcon: (icon: Omit<SocialIcon, 'id'>) => void;
  updateSialIcon: (iconId: string, updates: Partial<SocialIcon>) => void;
  removeSocialIcon: (iconId: string) => void;
  addInteract (element: Omit<InteractiveElement, 'id'>) => void;
  updateInteractiveElement: (elementId: string, updates: Partial<InteractiveElement>) => void;
  removeInteractiveElement: (elementId: string) => void;

  // Legacy icoport
  addIconToSlide: (icon: Omit<IconOverlay, 'id'>) => void;
  updateIconPosition: (iconId: string, x: number, y: number) => void;
  removeIconFromSlide: (iconId: string) => void;

  // Auto-save & PWA
  enableAutoSave: () => void;
  bleAutoSave: () => void;
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
  clearLocalStorage: () => void;
  updatePWAState: (updates: Partial<PWAState>) => void;
}
```

## 7. Enhanced Features

### 7.1 Stock Photo Integration (Unsplash API)

**File: `src/app/utility/carousel-builder/utils/unsplash.ts`**

```typescript
import { createApi } from 'unsplash-js';
import { StockPhoto } from '../types';

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || '',
});

export async function searchPhotos(query: string, page = 1, perPage = 20): Promise<StockPhoto[]> {
  try {
    const result = await unsplash.search.getPhotos({
      query,
      page,
      perPage,
      orientation: 'squarish', // Good for social media
    });

    if (result.errors) {
      console.error('Unsplash API error:', result.errors);
      return [];
    }

    return result.response?.results.map(photo => ({
      id: photo.id,
      url: photo.urls.regular,
      thumbnailUrl: photo.urls.thumb,
      photographer: photo.user.name,
      description: photo.alt_description || '',
      tags: photo.tags?.map(tag => tag.title) || [],
      width: photo.width,
      height: photo.height,
    })) || [];
  } catch (error) {
    console.error('Failed to fetch photos:', error);
    return [];
  }
}

export async function getFeaturedPhotos(): Promise<StockPhoto[]> {
  try {
    const result = await unsplash.photos.list({
      page: 1,
      perPage: 20,
      orderBy: 'popular',
    });

    if (result.errors) {
      console.error('Unsplash API error:', result.errors);
      return [];
    }

    return result.response?.results.map(photo => ({
      id: photo.id,
      url: photo.urls.regular,
      thumbnailUrl: photo.urls.thumb,
      photographer: photo.user.name,
      description: photo.alt_description || '',
      tags: photo.tags?.map(tag => tag.title) || [],
      width: photo.width,
      height: photo.height,
    })) || [];
  } catch (error) {
    console.error('Failed to fetch featured photos:', error);
    return [];
  }
}
```

### 7.2 Pattern Overlays

**File: `src/app/utility/carousel-builder/data/patterns.ts`**

```typescript
import { PatternOverlay } from '../types';

export const PATTERN_OVERLAYS: PatternOverlay[] = [
  // Geometric patterns
  {
    id: 'dots-small',
    name: 'Small Dots',
    url: 'data:image/svg+xml,<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="2" fill="currentColor"/></svg>',
    category: 'geometric',
    opacity: 0.1,
    blendMode: 'multiply',
  },
  {
    id: 'grid-lines',
    name: 'Grid Lines',
    url: 'data:image/svg+xml,<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h40v40H0z" fill="none" stroke="currentColor" stroke-width="1"/></svg>',
    category: 'geometric',
    opacity: 0.05,
    blendMode: 'multiply',
  },
  {
    id: 'diagonal-lines',
    name: 'Diagonal Lines',
    url: 'data:image/svg+xml,<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M0 20L20 0" stroke="currentColor" stroke-width="1"/></svg>',
    category: 'geometric',
    opacity: 0.08,
    blendMode: 'multiply',
  },
  
  // Organic patterns
  {
    id: 'noise-light',
    name: 'Light Noise',
    url: '/patterns/noise-light.png', // You'll need to add these pattern images
    category: 'texture',
    opacity: 0.15,
    blendMode: 'overlay',
  },
  {
    id: 'paper-texture',
    name: 'Paper Texture',
    url: '/patterns/paper-texture.png',
    category: 'texture',
    opacity: 0.2,
    blendMode: 'multiply',
  },
];
```

### 7.3 Text Effects

**File: `src/app/utility/carousel-builder/components/panels/TextEffectsPanel.tsx`**

```typescript
'use client';

import React from 'react';
import { useEditorStore } from '../../store/useEditorStore';
import { TextEffect } from '../../types';

export const TextEffectsPanel: React.FC = () => {
  const { slides, activeSlideIndex, updateTextEffects } = useEditorStore();
  const currentSlide = slides[activeSlideIndex];
  const effects = currentSlide?.textEffects || {};

  const updateShadow = (shadow: TextEffect['shadow']) => {
    updateTextEffects({ ...effects, shadow });
  };

  const updateOutline = (outline: TextEffect['outline']) => {
    updateTextEffects({ ...effects, outline });
  };

  const updateGradient = (gradient: TextEffect['gradient']) => {
    updateTextEffects({ ...effects, gradient });
  };

  return (
    <div className="space-y-6">
      {/* Shadow Effects */}
      <div>
        <h3 className="font-semibold mb-3">Text Shadow</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!effects.shadow}
              onChange={(e) => updateShadow(e.target.checked ? { offsetX: 2, offsetY: 2, blur: 4, color: '#000000' } : undefined)}
            />
            <label>Enable Shadow</label>
          </div>
          
          {effects.shadow && (
            <div className="space-y-2 pl-6">
              <div>
                <label className="block text-sm">Offset X</label>
                <input
                  type="range"
                  min="-10"
                  max="10"
                  value={effects.shadow.offsetX}
                  onChange={(e) => updateShadow({ ...effects.shadow!, offsetX: Number(e.target.value) })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm">Offset Y</label>
                <input
                  type="range"
                  min="-10"
                  max="10"
                  value={effects.shadow.offsetY}
                  onChange={(e) => updateShadow({ ...effects.shadow!, offsetY: Number(e.target.value) })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm">Blur</label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={effects.shadow.blur}
                  onChange={(e) => updateShadow({ ...effects.shadow!, blur: Number(e.target.value) })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm">Color</label>
                <input
                  type="color"
                  value={effects.shadow.color}
                  onChange={(e) => updateShadow({ ...effects.shadow!, color: e.target.value })}
                  className="w-full h-8"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Outline Effects */}
      <div>
        <h3 className="font-semibold mb-3">Text Outline</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!effects.outline}
              onChange={(e) => updateOutline(e.target.checked ? { width: 2, color: '#000000' } : undefined)}
            />
            <label>Enable Outline</label>
          </div>
          
          {effects.outline && (
            <div className="space-y-2 pl-6">
              <div>
                <label className="block text-sm">Width</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={effects.outline.width}
                  onChange={(e) => updateOutline({ ...effects.outline!, width: Number(e.target.value) })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm">Color</label>
                <input
                  type="color"
                  value={effects.outline.color}
                  onChange={(e) => updateOutline({ ...effects.outline!, color: e.target.value })}
                  className="w-full h-8"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Gradient Effects */}
      <div>
        <h3 className="font-semibold mb-3">Text Gradient</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!effects.gradient}
              onChange={(e) => updateGradient(e.target.checked ? { type: 'linear', colors: ['#ff0000', '#0000ff'] } : undefined)}
            />
            <label>Enable Gradient</label>
          </div>
          
          {effects.gradient && (
            <div className="space-y-2 pl-6">
              <div>
                <label className="block text-sm">Type</label>
                <select
                  value={effects.gradient.type}
                  onChange={(e) => updateGradient({ ...effects.gradient!, type: e.target.value as 'linear' | 'radial' })}
                  className="w-full p-2 border rounded"
                >
                  <option value="linear">Linear</option>
                  <option value="radial">Radial</option>
                </select>
              </div>
              
              {effects.gradient.type === 'linear' && (
                <div>
                  <label className="block text-sm">Angle</label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={effects.gradient.angle || 0}
                    onChange={(e) => updateGradient({ ...effects.gradient!, angle: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm">Colors</label>
                <div className="flex gap-2">
                  {effects.gradient.colors.map((color, index) => (
                    <input
                      key={index}
                      type="color"
                      value={color}
                      onChange={(e) => {
                        const newColors = [...effects.gradient!.colors];
                        newColors[index] = e.target.value;
                        updateGradient({ ...effects.gradient!, colors: newColors });
                      }}
                      className="w-12 h-8"
                    />
                  ))}
                  <button
                    onClick={() => updateGradient({ ...effects.gradient!, colors: [...effects.gradient!.colors, '#000000'] })}
                    className="px-2 py-1 bg-gray-200 rounded text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
```

### 7.4 Geometric Shapes Library

**File: `src/app/utility/carousel-builder/data/shapes.ts`**

```typescript
import { GeometricShape, ShapeType } from '../types';

export const SHAPE_PRESETS: Record<ShapeType, Omit<GeometricShape, 'id' | 'x' | 'y'>> = {
  rectangle: {
    type: 'rectangle',
    width: 200,
    height: 100,
    rotation: 0,
    fill: '#3B82F6',
    stroke: '#1E40AF',
    strokeWidth: 2,
    opacity: 1,
  },
  circle: {
    type: 'circle',
    width: 100,
    height: 100,
    rotation: 0,
    fill: '#EF4444',
    stroke: '#DC2626',
    strokeWidth: 2,
    opacity: 1,
  },
  triangle: {
    type: 'triangle',
    width: 100,
    height: 100,
    rotation: 0,
    fill: '#10B981',
    stroke: '#059669',
    strokeWidth: 2,
    opacity: 1,
  },
  arrow: {
    type: 'arrow',
    width: 150,
    height: 50,
    rotation: 0,
    fill: '#F59E0B',
    stroke: '#D97706',
    strokeWidth: 2,
    opacity: 1,
  },
  line: {
    type: 'line',
    width: 200,
    height: 2,
    rotation: 0,
    fill: '#6B7280',
    opacity: 1,
  },
  divider: {
    type: 'divider',
    width: 300,
    height: 4,
    rotation: 0,
    fill: '#E5E7EB',
    opacity: 1,
  },
  star: {
    type: 'star',
    width: 80,
    height: 80,
    rotation: 0,
    fill: '#FBBF24',
    stroke: '#F59E0B',
    strokeWidth: 2,
    opacity: 1,
  },
  heart: {
    type: 'heart',
    width: 80,
    height: 80,
    rotation: 0,
    fill: '#F87171',
    stroke: '#EF4444',
    strokeWidth: 2,
    opacity: 1,
  },
  diamond: {
    type: 'diamond',
    width: 80,
    height: 80,
    rotation: 45,
    fill: '#A78BFA',
    stroke: '#8B5CF6',
    strokeWidth: 2,
    opacity: 1,
  },
  hexagon: {
    type: 'hexagon',
    width: 100,
    height: 100,
    rotation: 0,
    fill: '#34D399',
    stroke: '#10B981',
    strokeWidth: 2,
    opacity: 1,
  },
};
```

### 7.5 Interactive Elements

**File: `src/app/utility/carousel-builder/data/interactive.ts`**

```typescript
import { InteractiveElement, Poll, QuizQuestion, ClickableArea } from '../types';

export const POLL_TEMPLATES: Poll[] = [
  {
    id: 'yes-no-poll',
    question: 'Do you agree?',
    options: [
      { id: '1', text: 'Yes', votes: 0, color: '#10B981' },
      { id: '2', text: 'No', votes: 0, color: '#EF4444' },
    ],
    totalVotes: 0,
    showResults: false,
  },
  {
    id: 'rating-poll',
    question: 'How would you rate this?',
    options: [
      { id: '1', text: '⭐', votes: 0, color: '#FBBF24' },
      { id: '2', text: '⭐⭐', votes: 0, color: '#FBBF24' },
      { id: '3', text: '⭐⭐⭐', votes: 0, color: '#FBBF24' },
      { id: '4', text: '⭐⭐⭐⭐', votes: 0, color: '#FBBF24' },
      { id: '5', text: '⭐⭐⭐⭐⭐', votes: 0, color: '#FBBF24' },
    ],
    totalVotes: 0,
    showResults: false,
  },
];

export const QUIZ_TEMPLATES: QuizQuestion[] = [
  {
    id: 'sample-quiz',
    question: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctAnswer: 2,
    explanation: 'Paris is the capital and largest city of France.',
  },
];

export const INTERACTIVE_PRESETS: Record<string, Omit<InteractiveElement, 'id' | 'x' | 'y'>> = {
  poll: {
    type: 'poll',
    width: 300,
    height: 200,
    data: POLL_TEMPLATES[0],
    style: {
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937',
      borderRadius: 12,
      fontSize: 16,
    },
  },
  quiz: {
    type: 'quiz',
    width: 350,
    height: 250,
    data: QUIZ_TEMPLATES[0],
    style: {
      backgroundColor: '#F3F4F6',
      textColor: '#1F2937',
      borderRadius: 12,
      fontSize: 16,
    },
  },
  button: {
    type: 'button',
    width: 150,
    height: 50,
    data: { text: 'Click me!', action: 'link', url: 'https://example.com' },
    style: {
      backgroundColor: '#3B82F6',
      textColor: '#FFFFFF',
      borderRadius: 8,
      fontSize: 16,
    },
  },
  'clickable-area': {
    type: 'clickable-area',
    width: 200,
    height: 100,
    data: {
      action: 'next-slide',
      tooltip: 'Click to go to next slide',
    },
    style: {
      backgroundColor: 'transparent',
      textColor: '#1F2937',
      borderRadius: 0,
      fontSize: 14,
    },
  },
};
```

### 7.6 Auto-Save System

**File: `src/app/utility/carousel-builder/hooks/useAutoSave.ts`**

```typescript
'use client';

import { useEffect, useRef } from 'react';
import { useEditorStore } from '../store/useEditorStore';

export const useAutoSave = () => {
  const { 
    slides, 
    autoSave, 
    saveToLocalStorage, 
    enableAutoSave, 
    disableAutoSave 
  } = useEditorStore();
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSaveRef = useRef<string>('');

  useEffect(() => {
    if (autoSave.enabled) {
      intervalRef.current = setInterval(() => {
        const currentState = JSON.stringify(slides);
        
        // Only save if something has changed
        if (currentState !== lastSaveRef.current) {
          saveToLocalStorage();
          lastSaveRef.current = currentState;
        }
      }, autoSave.interval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoSave.enabled, autoSave.interval, slides, saveToLocalStorage]);

  // Save on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (autoSave.enabled && autoSave.isDirty) {
        saveToLocalStorage();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [autoSave.enabled, autoSave.isDirty, saveToLocalStorage]);

  return {
    isAutoSaveEnabled: autoSave.enabled,
    lastSaved: autoSave.lastSaved,
    isDirty: autoSave.isDirty,
    enableAutoSave,
    disableAutoSave,
  };
};
```

### 7.7 PWA Configuration

**File: `next.config.js`**

```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'unsplash-images',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
    {
      urlPattern: /^https:\/\/api\.unsplash\.com\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'unsplash-api',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 5 * 60, // 5 minutes
        },
      },
    },
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
  },
};

module.exports = withPWA(nextConfig);
```

**File: `public/manifest.json`**

```json
{
  "name": "Carousel Builder",
  "short_name": "Carousel",
  "description": "Create stunning social media carousels with ease",
  "start_url": "/utility/carousel-builder",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3B82F6",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

**File: `src/data/categories.ts`**

```typescript
import { Category } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'business',
    label: 'Business & Professional',
    color: '#378ADD',
    templateTypes: ['Pitch Deck', 'Company Update', 'Report'],
  },
  {
    id: 'social',
    label: 'Social Media',
    color: '#D4537E',
    templateTypes: ['Quote Card', 'Tip Card', 'Announcement'],
  },
  {
    id: 'educational',
    label: 'Educational',
    color: '#1D9E75',
    templateTypes: ['How-to Guide', 'Tutorial', 'Fun Fact'],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    color: '#EF9F27',
    templateTypes: ['Product Launch', 'Promotion', 'Sale'],
  },
  {
    id: 'personal',
    label: 'Personal',
    color: '#AFA9EC',
    templateTypes: ['Story', 'Testimonial', 'Lifestyle'],
  },
  {
    id: 'lists',
    label: 'Lists & Tips',
    color: '#5DCAA5',
    templateTypes: ['Step-by-Step', 'Numbered List', 'Checklist'],
  },
  {
    id: 'before_after',
    label: 'Before / After',
    color: '#F0997B',
    templateTypes: ['Comparison', 'Transformation', 'Split View'],
  },
  {
    id: 'statistics',
    label: 'Statistics',
    color: '#7F77DD',
    templateTypes: ['Infographic', 'Data Visual', 'Chart Card'],
  },
];
```

**File: `src/data/templates.ts`**

```typescript
import { SlideTemplate } from '../types';

export const TEMPLATES: SlideTemplate[] = [
  // ── BUSINESS ──────────────────────────────────────────────────────────────
  {
    id: 'biz_pitch',
    name: 'Pitch Deck',
    categoryId: 'business',
    background: 'linear-gradient(135deg, #0d1b2a 0%, #1b3a5c 100%)',
    accentColor: '#48bfe3',
    tagText: 'PITCH DECK',
    defaultHeadline: 'Series A Pitch',
    defaultSubtitle: 'Your Company Name',
    defaultBody: 'Transforming the way businesses connect with customers through AI-powered solutions.',
    layout: 'centered',
    darkText: false,
    fontFamily: 'syne',
  },
  {
    id: 'biz_update',
    name: 'Company Update',
    categoryId: 'business',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    accentColor: '#e94560',
    tagText: 'UPDATE',
    defaultHeadline: 'Q3 2024 Update',
    defaultSubtitle: 'Company Newsletter',
    defaultBody: "We've hit 50K users and launched 3 new features this quarter.",
    layout: 'left',
    darkText: false,
    fontFamily: 'dm_sans',
  },
  {
    id: 'biz_report',
    name: 'Report',
    categoryId: 'business',
    background: '#f8f9fa',
    accentColor: '#378ADD',
    tagText: 'REPORT',
    defaultHeadline: 'Annual Report',
    defaultSubtitle: 'FY 2024',
    defaultBody: 'Key metrics, milestones, and what the year ahead holds for our team.',
    layout: 'top_accent',
    darkText: true,
    fontFamily: 'dm_sans',
  },

  // ── SOCIAL MEDIA ──────────────────────────────────────────────────────────
  {
    id: 'social_quote',
    name: 'Quote Card',
    categoryId: 'social',
    background: 'linear-gradient(135deg, #b5179e 0%, #7209b7 100%)',
    accentColor: '#ffffff',
    tagText: 'QUOTE',
    defaultHeadline: '"Success is not final, failure is not fatal."',
    defaultSubtitle: '— Winston Churchill',
    defaultBody: '',
    layout: 'centered',
    darkText: false,
    fontFamily: 'dm_serif',
  },
  {
    id: 'social_tip',
    name: 'Tip Card',
    categoryId: 'social',
    background: 'linear-gradient(135deg, #2d6a4f 0%, #40916c 100%)',
    accentColor: '#d8f3dc',
    tagText: 'TIP',
    defaultHeadline: 'Pro Tip #7',
    defaultSubtitle: 'Design',
    defaultBody: 'Always use consistent spacing — it makes everything feel intentional and polished.',
    layout: 'left',
    darkText: false,
    fontFamily: 'syne',
  },
  {
    id: 'social_announcement',
    name: 'Announcement',
    categoryId: 'social',
    background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
    accentColor: '#1a1a2e',
    tagText: 'ANNOUNCEMENT',
    defaultHeadline: 'BIG NEWS!',
    defaultSubtitle: 'Something is coming...',
    defaultBody: 'We have been working on something special. Stay tuned for the reveal on Friday!',
    layout: 'centered',
    darkText: false,
    fontFamily: 'syne',
  },

  // ── EDUCATIONAL ───────────────────────────────────────────────────────────
  {
    id: 'edu_howto',
    name: 'How-to Guide',
    categoryId: 'educational',
    background: '#0d1b2a',
    accentColor: '#5e60ce',
    tagText: 'HOW-TO',
    defaultHeadline: 'How to Write Better Headlines',
    defaultSubtitle: 'Step 1 of 5',
    defaultBody: 'Start with a number or power word. Keep it under 70 characters. Make a promise you can keep.',
    layout: 'left',
    darkText: false,
    fontFamily: 'dm_sans',
  },
  {
    id: 'edu_tutorial',
    name: 'Tutorial',
    categoryId: 'educational',
    background: 'linear-gradient(135deg, #480ca8 0%, #3a0ca3 100%)',
    accentColor: '#4cc9f0',
    tagText: 'TUTORIAL',
    defaultHeadline: 'CSS Grid in 5 Minutes',
    defaultSubtitle: 'Tutorial',
    defaultBody: 'grid-template-columns lets you define the number and size of columns in your layout.',
    layout: 'centered',
    darkText: false,
    fontFamily: 'space_mono',
  },
  {
    id: 'edu_fact',
    name: 'Fun Fact',
    categoryId: 'educational',
    background: 'linear-gradient(135deg, #0f3460 0%, #16213e 100%)',
    accentColor: '#e94560',
    tagText: 'FACT',
    defaultHeadline: 'Did you know?',
    defaultSubtitle: 'Science',
    defaultBody: 'Honey never spoils. Archaeologists have found 3,000-year-old honey in Egyptian tombs.',
    layout: 'centered',
    darkText: false,
    fontFamily: 'syne',
  },

  // ── MARKETING ─────────────────────────────────────────────────────────────
  {
    id: 'mkt_launch',
    name: 'Product Launch',
    categoryId: 'marketing',
    background: 'linear-gradient(135deg, #7400b8 0%, #6930c3 100%)',
    accentColor: '#48bfe3',
    tagText: 'NEW',
    defaultHeadline: 'Introducing Pro Plan',
    defaultSubtitle: 'Available now',
    defaultBody: 'Everything you need to grow — unlimited projects, priority support, advanced analytics.',
    layout: 'centered',
    darkText: false,
    fontFamily: 'syne',
  },
  {
    id: 'mkt_promo',
    name: 'Promotion',
    categoryId: 'marketing',
    background: 'linear-gradient(135deg, #ff6b35 0%, #e94560 100%)',
    accentColor: '#ffffff',
    tagText: 'PROMO',
    defaultHeadline: '50% OFF',
    defaultSubtitle: 'Limited time offer',
    defaultBody: 'Use code LAUNCH50 at checkout. Offer ends Sunday at midnight.',
    layout: 'centered',
    darkText: false,
    fontFamily: 'syne',
  },
  {
    id: 'mkt_sale',
    name: 'Sale',
    categoryId: 'marketing',
    background: '#1a1a2e',
    accentColor: '#EF9F27',
    tagText: 'SALE',
    defaultHeadline: 'Flash Sale',
    defaultSubtitle: 'Today only',
    defaultBody: 'Our biggest discount ever on all annual plans. Do not miss this.',
    layout: 'left',
    darkText: false,
    fontFamily: 'dm_sans',
  },

  // ── PERSONAL ──────────────────────────────────────────────────────────────
  {
    id: 'per_story',
    name: 'Story',
    categoryId: 'personal',
    background: 'linear-gradient(135deg, #2d6a4f 0%, #1b4332 100%)',
    accentColor: '#74c69d',
    tagText: 'STORY',
    defaultHeadline: 'My Entrepreneurship Journey',
    defaultSubtitle: 'From zero to $1M ARR',
    defaultBody: 'Two years ago I had an idea. No investors. No team. Just a laptop and a vision.',
    layout: 'left',
    darkText: false,
    fontFamily: 'dm_serif',
  },
  {
    id: 'per_testimonial',
    name: 'Testimonial',
    categoryId: 'personal',
    background: '#0d1b2a',
    accentColor: '#48bfe3',
    tagText: 'TESTIMONIAL',
    defaultHeadline: '"This tool 10x\'d our output"',
    defaultSubtitle: '— Sarah M., Head of Marketing',
    defaultBody: 'We went from 2 posts a week to 20. The ROI has been incredible.',
    layout: 'centered',
    darkText: false,
    fontFamily: 'dm_serif',
  },
  {
    id: 'per_lifestyle',
    name: 'Lifestyle',
    categoryId: 'personal',
    background: 'linear-gradient(135deg, #b5179e 0%, #560bad 100%)',
    accentColor: '#f8c8e8',
    tagText: 'LIFESTYLE',
    defaultHeadline: 'Morning Routine',
    defaultSubtitle: '5am club',
    defaultBody: 'Hydrate. Move. Journal. These 30 minutes set the tone for my entire day.',
    layout: 'centered',
    darkText: false,
    fontFamily: 'syne',
  },

  // ── LISTS & TIPS ──────────────────────────────────────────────────────────
  {
    id: 'list_step',
    name: 'Step-by-Step',
    categoryId: 'lists',
    background: '#0f3460',
    accentColor: '#48bfe3',
    tagText: 'GUIDE',
    defaultHeadline: '5 Steps to Launch',
    defaultSubtitle: 'Start today',
    defaultBody: '1. Define your MVP\n2. Build in public\n3. Get 10 beta users\n4. Collect feedback\n5. Iterate fast',
    layout: 'left',
    darkText: false,
    fontFamily: 'dm_sans',
  },
  {
    id: 'list_numbered',
    name: 'Numbered List',
    categoryId: 'lists',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #533483 100%)',
    accentColor: '#AFA9EC',
    tagText: 'LIST',
    defaultHeadline: 'Top 7 Tools for 2024',
    defaultSubtitle: 'Productivity',
    defaultBody: 'Notion · Figma · Linear · Raycast · Arc · Superhuman · Fathom',
    layout: 'left',
    darkText: false,
    fontFamily: 'dm_sans',
  },
  {
    id: 'list_checklist',
    name: 'Checklist',
    categoryId: 'lists',
    background: '#1b4332',
    accentColor: '#74c69d',
    tagText: 'CHECKLIST',
    defaultHeadline: 'Launch Checklist',
    defaultSubtitle: 'Are you ready?',
    defaultBody: '✓ Landing page live\n✓ Email sequence set\n✓ Analytics connected\n○ Press outreach\n○ Social scheduled',
    layout: 'left',
    darkText: false,
    fontFamily: 'space_mono',
  },

  // ── BEFORE / AFTER ────────────────────────────────────────────────────────
  {
    id: 'ba_comparison',
    name: 'Comparison',
    categoryId: 'before_after',
    background: 'linear-gradient(135deg, #0d1b2a 0%, #1b2838 100%)',
    accentColor: '#48bfe3',
    tagText: 'BEFORE / AFTER',
    defaultHeadline: 'Then vs Now',
    defaultSubtitle: '12 months apart',
    defaultBody: 'Before: 200 followers, 0 revenue\nAfter: 42K followers, $180K ARR',
    layout: 'split',
    darkText: false,
    fontFamily: 'syne',
  },
  {
    id: 'ba_transformation',
    name: 'Transformation',
    categoryId: 'before_after',
    background: 'linear-gradient(135deg, #b5179e 0%, #7209b7 100%)',
    accentColor: '#ffffff',
    tagText: 'TRANSFORMATION',
    defaultHeadline: 'The Transformation',
    defaultSubtitle: 'Real results',
    defaultBody: 'Lost 18kg in 6 months — not through restriction, but through building sustainable habits.',
    layout: 'centered',
    darkText: false,
    fontFamily: 'dm_serif',
  },
  {
    id: 'ba_split',
    name: 'Split View',
    categoryId: 'before_after',
    background: '#0f3460',
    accentColor: '#EF9F27',
    tagText: 'SPLIT',
    defaultHeadline: 'Old vs New Way',
    defaultSubtitle: 'Workflow redesign',
    defaultBody: 'Old: 14 steps, 3 tools, 2 hours\nNew: 3 steps, 1 tool, 15 minutes',
    layout: 'split',
    darkText: false,
    fontFamily: 'dm_sans',
  },

  // ── STATISTICS ────────────────────────────────────────────────────────────
  {
    id: 'stat_infographic',
    name: 'Infographic',
    categoryId: 'statistics',
    background: 'linear-gradient(135deg, #7400b8 0%, #3a0ca3 100%)',
    accentColor: '#4cc9f0',
    tagText: 'STATS',
    defaultHeadline: 'Social Media 2024',
    defaultSubtitle: 'Key statistics',
    defaultBody: '4.9B users · 145 min/day avg · 62% buy after story ad',
    layout: 'centered',
    darkText: false,
    fontFamily: 'syne',
  },
  {
    id: 'stat_data',
    name: 'Data Visual',
    categoryId: 'statistics',
    background: '#0d1b2a',
    accentColor: '#1D9E75',
    tagText: 'DATA',
    defaultHeadline: 'Growth Metrics',
    defaultSubtitle: 'Q1–Q4 2024',
    defaultBody: 'MRR ↑ 340% · Churn ↓ 2.1% · NPS 72 · CAC $48',
    layout: 'left',
    darkText: false,
    fontFamily: 'space_mono',
  },
  {
    id: 'stat_chart',
    name: 'Chart Card',
    categoryId: 'statistics',
    background: 'linear-gradient(135deg, #1b2838 0%, #0d1b2a 100%)',
    accentColor: '#48bfe3',
    tagText: 'CHART',
    defaultHeadline: 'Revenue Growth',
    defaultSubtitle: 'Monthly recurring revenue',
    defaultBody: 'Jan $12K → Jun $67K → Dec $180K',
    layout: 'left',
    darkText: false,
    fontFamily: 'syne',
  },
];
```

**File: `src/data/fonts.ts`**

```typescript
import { FontOption } from '../types';

export const FONTS: FontOption[] = [
  { id: 'syne',       label: 'Modern (Syne)',      css: "'Syne', sans-serif" },
  { id: 'dm_sans',    label: 'Clean (DM Sans)',    css: "'DM Sans', sans-serif" },
  { id: 'dm_serif',   label: 'Editorial (Serif)',  css: "'DM Serif Display', serif" },
  { id: 'space_mono', label: 'Mono (Code)',         css: "'Space Mono', monospace" },
];
```

**File: `src/data/palettes.ts`**

```typescript
import { Palette } from '../types';

export const PALETTES: Palette[] = [
  { id: 'midnight',   background: '#0d1b2a', accent: '#48bfe3', textPrimary: '#ffffff', textSecondary: 'rgba(255,255,255,0.6)' },
  { id: 'violet',     background: 'linear-gradient(135deg,#7400b8,#6930c3)', accent: '#4cc9f0', textPrimary: '#ffffff', textSecondary: 'rgba(255,255,255,0.65)' },
  { id: 'forest',     background: 'linear-gradient(135deg,#2d6a4f,#1b4332)', accent: '#74c69d', textPrimary: '#ffffff', textSecondary: 'rgba(255,255,255,0.65)' },
  { id: 'rose',       background: 'linear-gradient(135deg,#b5179e,#7209b7)', accent: '#f8c8e8', textPrimary: '#ffffff', textSecondary: 'rgba(255,255,255,0.65)' },
  { id: 'slate',      background: 'linear-gradient(135deg,#1a1a2e,#16213e)', accent: '#e94560', textPrimary: '#ffffff', textSecondary: 'rgba(255,255,255,0.6)' },
  { id: 'ocean',      background: '#0f3460', accent: '#5e60ce', textPrimary: '#ffffff', textSecondary: 'rgba(255,255,255,0.65)' },
  { id: 'amber',      background: 'linear-gradient(135deg,#ff6b35,#f7931e)', accent: '#1a1a2e', textPrimary: '#ffffff', textSecondary: 'rgba(255,255,255,0.75)' },
  { id: 'light',      background: '#f8f9fa', accent: '#378ADD', textPrimary: '#1a1a2e', textSecondary: 'rgba(0,0,0,0.55)' },
];
```

---

## 6. State Management (Zustand)

**File: `src/store/useEditorStore.ts`**

```typescript
import { create } from 'zustand';
import { EditorState, Slide, FontId, LayoutId, ActiveSheet, CategoryId, IconOverlay } from '../types';
import { TEMPLATES } from '../data/templates';

// ─── Helper: create a Slide from a template ───────────────────────────────────

function slideFromTemplate(templateId: string): Slide {
  const tmpl = TEMPLATES.find(t => t.id === templateId)!;
  return {
    id: crypto.randomUUID(),
    templateId,
    headline: tmpl.defaultHeadline,
    subtitle: tmpl.defaultSubtitle,
    body: tmpl.defaultBody,
    background: tmpl.background,
    accentColor: tmpl.accentColor,
    fontId: tmpl.fontFamily,
    layout: tmpl.layout,
    darkText: tmpl.darkText,
    icons: [],
  };
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useEditorStore = create<EditorState>((set, get) => ({
  slides: [slideFromTemplate('biz_pitch')],
  activeSlideIndex: 0,
  activeSheet: null,
  activeCategoryId: 'all',

  // ── Navigation ──────────────────────────────────────────────────────────────

  setActiveSlide: (index) => set({ activeSlideIndex: index }),

  setActiveSheet: (sheet) =>
    set((state) => ({
      // toggle: clicking the same tab again closes the sheet
      activeSheet: state.activeSheet === sheet ? null : sheet,
    })),

  setActiveCategory: (id) => set({ activeCategoryId: id }),

  // ── Slide CRUD ───────────────────────────────────────────────────────────────

  addSlide: (templateId) =>
    set((state) => {
      const newSlide = slideFromTemplate(templateId);
      const newSlides = [...state.slides, newSlide];
      return { slides: newSlides, activeSlideIndex: newSlides.length - 1 };
    }),

  duplicateSlide: (index) =>
    set((state) => {
      const original = state.slides[index];
      const copy: Slide = { ...original, id: crypto.randomUUID(), icons: original.icons.map(ic => ({ ...ic, id: crypto.randomUUID() })) };
      const newSlides = [...state.slides];
      newSlides.splice(index + 1, 0, copy);
      return { slides: newSlides, activeSlideIndex: index + 1 };
    }),

  deleteSlide: (index) =>
    set((state) => {
      if (state.slides.length === 1) return state; // never delete the last slide
      const newSlides = state.slides.filter((_, i) => i !== index);
      const newIndex = Math.min(state.activeSlideIndex, newSlides.length - 1);
      return { slides: newSlides, activeSlideIndex: newIndex };
    }),

  reorderSlides: (fromIndex, toIndex) =>
    set((state) => {
      const newSlides = [...state.slides];
      const [moved] = newSlides.splice(fromIndex, 1);
      newSlides.splice(toIndex, 0, moved);
      return { slides: newSlides, activeSlideIndex: toIndex };
    }),

  // ── Slide Edits ───────────────────────────────────────────────────────────────

  applyTemplate: (templateId) =>
    set((state) => {
      const tmpl = TEMPLATES.find(t => t.id === templateId)!;
      const current = state.slides[state.activeSlideIndex];
      const updated: Slide = {
        ...current,
        templateId,
        background: tmpl.background,
        accentColor: tmpl.accentColor,
        fontId: tmpl.fontFamily,
        layout: tmpl.layout,
        darkText: tmpl.darkText,
        // preserve user-edited text if they've already customised it
        headline: current.headline === TEMPLATES.find(t => t.id === current.templateId)?.defaultHeadline
          ? tmpl.defaultHeadline : current.headline,
        subtitle: current.subtitle === TEMPLATES.find(t => t.id === current.templateId)?.defaultSubtitle
          ? tmpl.defaultSubtitle : current.subtitle,
        body: current.body === TEMPLATES.find(t => t.id === current.templateId)?.defaultBody
          ? tmpl.defaultBody : current.body,
      };
      const newSlides = [...state.slides];
      newSlides[state.activeSlideIndex] = updated;
      return { slides: newSlides };
    }),

  updateSlideText: (field, value) =>
    set((state) => {
      const newSlides = [...state.slides];
      newSlides[state.activeSlideIndex] = { ...newSlides[state.activeSlideIndex], [field]: value };
      return { slides: newSlides };
    }),

  updateSlideBackground: (background) =>
    set((state) => {
      const newSlides = [...state.slides];
      newSlides[state.activeSlideIndex] = { ...newSlides[state.activeSlideIndex], background };
      return { slides: newSlides };
    }),

  updateSlideAccent: (accentColor) =>
    set((state) => {
      const newSlides = [...state.slides];
      newSlides[state.activeSlideIndex] = { ...newSlides[state.activeSlideIndex], accentColor };
      return { slides: newSlides };
    }),

  updateSlideFont: (fontId: FontId) =>
    set((state) => {
      const newSlides = [...state.slides];
      newSlides[state.activeSlideIndex] = { ...newSlides[state.activeSlideIndex], fontId };
      return { slides: newSlides };
    }),

  updateSlideLayout: (layout: LayoutId) =>
    set((state) => {
      const newSlides = [...state.slides];
      newSlides[state.activeSlideIndex] = { ...newSlides[state.activeSlideIndex], layout };
      return { slides: newSlides };
    }),

  addIconToSlide: (icon) =>
    set((state) => {
      const newIcon: IconOverlay = { ...icon, id: crypto.randomUUID() };
      const newSlides = [...state.slides];
      newSlides[state.activeSlideIndex] = {
        ...newSlides[state.activeSlideIndex],
        icons: [...newSlides[state.activeSlideIndex].icons, newIcon],
      };
      return { slides: newSlides };
    }),

  updateIconPosition: (iconId, x, y) =>
    set((state) => {
      const newSlides = [...state.slides];
      const slide = newSlides[state.activeSlideIndex];
      newSlides[state.activeSlideIndex] = {
        ...slide,
        icons: slide.icons.map(ic => ic.id === iconId ? { ...ic, x, y } : ic),
      };
      return { slides: newSlides };
    }),

  removeIconFromSlide: (iconId) =>
    set((state) => {
      const newSlides = [...state.slides];
      const slide = newSlides[state.activeSlideIndex];
      newSlides[state.activeSlideIndex] = {
        ...slide,
        icons: slide.icons.filter(ic => ic.id !== iconId),
      };
      return { slides: newSlides };
    }),
}));
```

---

## 7. Desktop Layout

The desktop layout is a classic three-column editor shell. It is shown when `window.innerWidth >= 768`.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Toolbar (top bar): title | + Slide  Duplicate  Export                       │
├─────────────────────┬──────────────────────────────┬─────────────────────────┤
│  Left Sidebar       │  Canvas Area (centered)       │  Right Sidebar          │
│  220px              │  flex-1 bg-gray-100           │  220px                  │
│                     │                               │                         │
│  ● Category nav     │  SlideCanvas (340×425px       │  Color Palette          │
│    (8 categories)   │  rendered at 1:1, export      │  Font Style             │
│                     │  at 1080×1350 via scale)      │  Layout                 │
│  ● Template grid    │                               │  Background Type        │
│    (2-col)          │                               │  Elements (+icon etc.)  │
│                     │                               │                         │
├─────────────────────┴──────────────────────────────┴─────────────────────────┤
│  Slide Strip (100px): scrollable thumbnails                                  │
└──────────────────────────────────────────────────────────────────────────────┘
```

**File: `src/components/desktop/DesktopEditor.tsx`**

```tsx
import React from 'react';
import { Toolbar } from './Toolbar';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';
import { SlideStrip } from './SlideStrip';
import { SlideCanvas } from '../canvas/SlideCanvas';
import { useEditorStore } from '../../store/useEditorStore';

export function DesktopEditor() {
  const { slides, activeSlideIndex } = useEditorStore();
  const activeSlide = slides[activeSlideIndex];

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar />
        {/* Canvas Area */}
        <div className="flex-1 bg-gray-100 flex items-center justify-center overflow-hidden p-6">
          <SlideCanvas slide={activeSlide} slideIndex={activeSlideIndex} totalSlides={slides.length} />
        </div>
        <RightSidebar />
      </div>
      <SlideStrip />
    </div>
  );
}
```

**File: `src/components/desktop/LeftSidebar.tsx`**

```tsx
import React from 'react';
import { CATEGORIES } from '../../data/categories';
import { TEMPLATES } from '../../data/templates';
import { useEditorStore } from '../../store/useEditorStore';
import { TemplateCard } from '../shared/TemplateCard';

export function LeftSidebar() {
  const { activeCategoryId, setActiveCategory, applyTemplate } = useEditorStore();

  const filtered = activeCategoryId === 'all'
    ? TEMPLATES
    : TEMPLATES.filter(t => t.categoryId === activeCategoryId);

  return (
    <div className="w-[220px] border-r border-gray-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-3.5 py-3 text-sm font-medium text-gray-800">Templates</div>

      {/* Category nav */}
      <div className="flex-1 overflow-y-auto">
        {/* "All" option */}
        <button
          onClick={() => setActiveCategory('all')}
          className={`w-full flex items-center gap-2 px-3.5 py-1.5 text-xs rounded-md mx-1.5 my-0.5 transition-colors
            ${activeCategoryId === 'all' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          <span className="w-2 h-2 rounded-full bg-gray-400 flex-shrink-0" />
          All templates
        </button>

        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`w-full flex items-center gap-2 px-3.5 py-1.5 text-xs rounded-md mx-1.5 my-0.5 transition-colors
              ${activeCategoryId === cat.id ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cat.color }} />
            {cat.label}
          </button>
        ))}

        {/* Template grid */}
        <div className="px-3 pb-4 mt-2">
          <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">
            {activeCategoryId === 'all' ? 'All' : CATEGORIES.find(c => c.id === activeCategoryId)?.label}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {filtered.map(tmpl => (
              <TemplateCard key={tmpl.id} template={tmpl} onClick={() => applyTemplate(tmpl.id)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

**File: `src/components/desktop/RightSidebar.tsx`**

```tsx
import React from 'react';
import { PALETTES } from '../../data/palettes';
import { FONTS } from '../../data/fonts';
import { useEditorStore } from '../../store/useEditorStore';
import { LayoutId } from '../../types';

const LAYOUTS: { id: LayoutId; label: string }[] = [
  { id: 'centered',   label: 'Centered' },
  { id: 'left',       label: 'Left' },
  { id: 'split',      label: 'Split' },
  { id: 'top_accent', label: 'Top accent' },
  { id: 'minimal',    label: 'Minimal' },
  { id: 'bold',       label: 'Bold' },
];

export function RightSidebar() {
  const {
    slides, activeSlideIndex,
    updateSlideBackground, updateSlideAccent,
    updateSlideFont, updateSlideLayout,
    addIconToSlide,
  } = useEditorStore();

  const activeSlide = slides[activeSlideIndex];

  return (
    <div className="w-[220px] border-l border-gray-200 overflow-y-auto">

      {/* Color Palette */}
      <div className="p-3.5 border-b border-gray-100">
        <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">Color Palette</div>
        <div className="flex flex-wrap gap-1.5">
          {PALETTES.map(p => (
            <button
              key={p.id}
              onClick={() => { updateSlideBackground(p.background); updateSlideAccent(p.accent); }}
              className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110
                ${activeSlide.background === p.background ? 'border-gray-800' : 'border-transparent'}`}
              style={{ background: p.background }}
              title={p.id}
            />
          ))}
        </div>
      </div>

      {/* Font Style */}
      <div className="p-3.5 border-b border-gray-100">
        <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">Font Style</div>
        <div className="flex flex-col gap-1">
          {FONTS.map(f => (
            <button
              key={f.id}
              onClick={() => updateSlideFont(f.id)}
              className={`px-2 py-1.5 text-xs text-left rounded-md border transition-colors
                ${activeSlide.fontId === f.id
                  ? 'bg-gray-100 border-gray-300'
                  : 'border-gray-200 hover:bg-gray-50'}`}
              style={{ fontFamily: f.css }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Layout */}
      <div className="p-3.5 border-b border-gray-100">
        <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">Layout</div>
        <div className="grid grid-cols-3 gap-1">
          {LAYOUTS.map(l => (
            <button
              key={l.id}
              onClick={() => updateSlideLayout(l.id)}
              className={`aspect-[4/5] rounded border flex flex-col items-center justify-center gap-1 p-1 text-[8px] text-gray-400 transition-colors
                ${activeSlide.layout === l.id ? 'border-violet-500 bg-violet-50' : 'border-gray-200 hover:bg-gray-50'}`}
            >
              <span className="w-4/5 h-1 rounded bg-gray-300" />
              <span className="w-3/4 h-0.5 rounded bg-gray-200" />
              <span className="w-2/3 h-0.5 rounded bg-gray-200" />
            </button>
          ))}
        </div>
      </div>

      {/* Elements */}
      <div className="p-3.5">
        <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">Elements</div>
        <div className="flex flex-col gap-1">
          {['🚀', '⭐', '🔥', '💡', '✅', '→', '♥', '◆'].map(icon => (
            <button
              key={icon}
              onClick={() => addIconToSlide({ content: icon, x: 50, y: 50, size: 32 })}
              className="px-2 py-1.5 text-xs text-left border border-gray-200 rounded-md hover:bg-gray-50"
            >
              {icon} Add icon
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

**File: `src/components/desktop/Toolbar.tsx`**

```tsx
import React from 'react';
import { useEditorStore } from '../../store/useEditorStore';
import { useExport } from '../../hooks/useExport';
import { TEMPLATES } from '../../data/templates';

export function Toolbar() {
  const { slides, activeSlideIndex, addSlide, duplicateSlide } = useEditorStore();
  const { exportAllPNG, exportPDF, isExporting } = useExport();
  const activeSlide = slides[activeSlideIndex];
  const tmpl = TEMPLATES.find(t => t.id === activeSlide.templateId);

  return (
    <div className="h-12 border-b border-gray-200 flex items-center gap-2 px-4">
      <span className="text-sm text-gray-500 mr-2">{tmpl?.name ?? 'Slide'}</span>
      <div className="flex-1" />
      <button
        onClick={() => addSlide(activeSlide.templateId)}
        className="h-7 px-3 text-xs border border-gray-200 rounded-md hover:bg-gray-50"
      >
        + Slide
      </button>
      <button
        onClick={() => duplicateSlide(activeSlideIndex)}
        className="h-7 px-3 text-xs border border-gray-200 rounded-md hover:bg-gray-50"
      >
        Duplicate
      </button>
      <button
        onClick={exportAllPNG}
        disabled={isExporting}
        className="h-7 px-3 text-xs bg-violet-600 text-white rounded-md hover:bg-violet-700 disabled:opacity-50"
      >
        {isExporting ? 'Exporting…' : 'Export PNG'}
      </button>
      <button
        onClick={exportPDF}
        disabled={isExporting}
        className="h-7 px-3 text-xs border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50"
      >
        PDF
      </button>
    </div>
  );
}
```

**File: `src/components/desktop/SlideStrip.tsx`**

```tsx
import React from 'react';
import { useEditorStore } from '../../store/useEditorStore';
import { SlideThumbnail } from '../shared/SlideThumbnail';

export function SlideStrip() {
  const { slides, activeSlideIndex, setActiveSlide, addSlide } = useEditorStore();

  return (
    <div className="h-[100px] border-t border-gray-200 bg-gray-50 flex items-center gap-2 px-4 overflow-x-auto">
      {slides.map((slide, i) => (
        <SlideThumbnail
          key={slide.id}
          slide={slide}
          isActive={i === activeSlideIndex}
          onClick={() => setActiveSlide(i)}
        />
      ))}
      <button
        onClick={() => addSlide(slides[activeSlideIndex].templateId)}
        className="w-16 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-2xl text-gray-400 hover:bg-gray-100 flex-shrink-0"
      >
        +
      </button>
    </div>
  );
}
```

---

## 8. Mobile Layout

Mobile is shown when `window.innerWidth < 768`. The canvas fills the screen. All controls live in bottom sheets.

```
┌────────────────────────┐
│  Status bar            │
│  Top bar: ← Title  Share│
│                        │
│                        │
│   SlideCanvas          │
│   (full width,         │
│    aspect 4:5)         │
│                        │
│   Slide dot nav        │
│                        │
│  Quick action row      │
│  [Edit text] [Style]   │
│  + Icon  + Image  ...  │
│                        │
│  Bottom Nav            │
│  Slides Templates Design More │
└────────────────────────┘

Bottom sheets slide up over canvas:
- Slides sheet    (52% height): all slide thumbnails grid
- Templates sheet (60% height): category chips + template row
- Design sheet    (65% height): palette + font + layout rows
- Text sheet      (55% height): headline / subtitle / body textareas
- Icons sheet     (55% height): emoji grid
- Export sheet    (45% height): PNG / PDF / share
```

**File: `src/components/mobile/MobileEditor.tsx`**

```tsx
import React from 'react';
import { useEditorStore } from '../../store/useEditorStore';
import { SlideCanvas } from '../canvas/SlideCanvas';
import { BottomNav } from './BottomNav';
import { BottomSheet } from './BottomSheet';
import { SlidesSheet } from './sheets/SlidesSheet';
import { TemplatesSheet } from './sheets/TemplatesSheet';
import { DesignSheet } from './sheets/DesignSheet';
import { TextSheet } from './sheets/TextSheet';
import { IconSheet } from './sheets/IconSheet';
import { ExportSheet } from './sheets/ExportSheet';
import { TEMPLATES } from '../../data/templates';

export function MobileEditor() {
  const { slides, activeSlideIndex, activeSheet, setActiveSheet, addSlide } = useEditorStore();
  const activeSlide = slides[activeSlideIndex];
  const tmpl = TEMPLATES.find(t => t.id === activeSlide.templateId);

  return (
    <div className="flex flex-col h-screen bg-[#0d1b2a] overflow-hidden relative">
      {/* Top bar */}
      <div className="h-12 flex items-center justify-between px-4 border-b border-white/10 flex-shrink-0">
        <button className="text-white/60">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.8}>
            <path d="M12 4L6 10L12 16" />
          </svg>
        </button>
        <span className="text-white text-sm font-medium">{tmpl?.name ?? 'Slide'}</span>
        <button
          onClick={() => setActiveSheet('export')}
          className="h-7 px-3 bg-violet-500 text-white text-xs rounded-full"
        >
          Share
        </button>
      </div>

      {/* Canvas scroll area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pt-4">
        {/* Slide */}
        <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden mb-3">
          <SlideCanvas
            slide={activeSlide}
            slideIndex={activeSlideIndex}
            totalSlides={slides.length}
            fillContainer
          />
        </div>

        {/* Dot nav */}
        <div className="flex justify-center gap-1.5 mb-4">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => useEditorStore.getState().setActiveSlide(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === activeSlideIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/30'
              }`}
            />
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <button
            onClick={() => setActiveSheet('text')}
            className="bg-white/5 border border-white/10 rounded-xl p-3 text-left"
          >
            <div className="text-white text-lg font-bold mb-1">T</div>
            <div className="text-white/50 text-xs">Edit text</div>
          </button>
          <button
            onClick={() => setActiveSheet('design')}
            className="bg-white/5 border border-white/10 rounded-xl p-3 text-left"
          >
            <div className="text-white/70 text-xs mb-1">Style</div>
            <div className="text-white/50 text-xs">Colors, fonts, layout</div>
          </button>
        </div>

        {/* Element pills */}
        <div className="flex gap-2 overflow-x-auto pb-3" style={{ scrollbarWidth: 'none' }}>
          {['+ Icon', '+ Image', '+ Divider', '+ CTA'].map(label => (
            <button
              key={label}
              onClick={() => label === '+ Icon' && setActiveSheet('icons')}
              className="flex-shrink-0 bg-white/5 border border-white/10 rounded-full px-3 py-2 text-xs text-white/60 whitespace-nowrap"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom nav */}
      <BottomNav />

      {/* Bottom sheets */}
      <BottomSheet id="slides"    height="52%"  isOpen={activeSheet === 'slides'}>    <SlidesSheet /></BottomSheet>
      <BottomSheet id="templates" height="60%"  isOpen={activeSheet === 'templates'}><TemplatesSheet /></BottomSheet>
      <BottomSheet id="design"    height="65%"  isOpen={activeSheet === 'design'}>   <DesignSheet /></BottomSheet>
      <BottomSheet id="text"      height="70%"  isOpen={activeSheet === 'text'}>     <TextSheet /></BottomSheet>
      <BottomSheet id="icons"     height="55%"  isOpen={activeSheet === 'icons'}>    <IconSheet /></BottomSheet>
      <BottomSheet id="export"    height="45%"  isOpen={activeSheet === 'export'}>   <ExportSheet /></BottomSheet>
    </div>
  );
}
```

**File: `src/components/mobile/BottomSheet.tsx`**

```tsx
import React from 'react';
import { useEditorStore } from '../../store/useEditorStore';

interface Props {
  id: string;
  height: string;
  isOpen: boolean;
  children: React.ReactNode;
}

export function BottomSheet({ height, isOpen, children }: Props) {
  const { setActiveSheet } = useEditorStore();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="absolute inset-0 bg-black/30 z-10"
          onClick={() => setActiveSheet(null)}
        />
      )}
      {/* Sheet */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 rounded-t-2xl bg-[#1a2438] border-t border-white/10 overflow-y-auto transition-transform duration-300"
        style={{
          height,
          transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
        }}
      >
        {/* Handle */}
        <div className="w-9 h-1 bg-white/20 rounded-full mx-auto mt-2.5 mb-3.5" />
        {/* Content — rendered regardless of open/close so state is preserved */}
        {children}
      </div>
    </>
  );
}
```

**File: `src/components/mobile/BottomNav.tsx`**

```tsx
import React from 'react';
import { useEditorStore } from '../../store/useEditorStore';
import { ActiveSheet } from '../../types';

const TABS: { id: ActiveSheet; label: string }[] = [
  { id: 'slides',    label: 'Slides' },
  { id: 'templates', label: 'Templates' },
  { id: 'design',    label: 'Design' },
  { id: 'export',    label: 'More' },
];

export function BottomNav() {
  const { activeSheet, setActiveSheet } = useEditorStore();

  return (
    <div className="h-[60px] border-t border-white/10 flex items-center flex-shrink-0">
      {TABS.map(tab => {
        const isActive = activeSheet === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveSheet(tab.id)}
            className="flex-1 flex flex-col items-center gap-1 py-2"
          >
            <span className={`text-[10px] font-medium ${isActive ? 'text-violet-400' : 'text-white/40'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
```

**File: `src/components/mobile/sheets/TemplatesSheet.tsx`**

> **Critical:** This sheet must call its own render logic whenever it mounts or `activeCategoryId` changes. Do NOT rely on global `init()` calls.

```tsx
import React from 'react';
import { CATEGORIES } from '../../../data/categories';
import { TEMPLATES } from '../../../data/templates';
import { useEditorStore } from '../../../store/useEditorStore';

export function TemplatesSheet() {
  const { activeCategoryId, setActiveCategory, applyTemplate, setActiveSheet } = useEditorStore();

  // Derived — filters update automatically because Zustand triggers re-render
  const filtered = activeCategoryId === 'all'
    ? TEMPLATES
    : TEMPLATES.filter(t => t.categoryId === activeCategoryId);

  return (
    <div>
      <div className="text-xs text-white/40 px-4 pb-2">Choose template</div>

      {/* Category chips — horizontal scroll */}
      <div className="flex gap-2 overflow-x-auto px-4 pb-3" style={{ scrollbarWidth: 'none' }}>
        <button
          onClick={() => setActiveCategory('all')}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs border transition-colors
            ${activeCategoryId === 'all'
              ? 'bg-violet-500/30 border-violet-500 text-white'
              : 'border-white/15 text-white/50 bg-transparent'}`}
        >
          All
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs border transition-colors
              ${activeCategoryId === cat.id
                ? 'bg-violet-500/30 border-violet-500 text-white'
                : 'border-white/15 text-white/50 bg-transparent'}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Template row — horizontal scroll */}
      <div className="flex gap-2.5 overflow-x-auto px-4 pb-4" style={{ scrollbarWidth: 'none' }}>
        {filtered.map(tmpl => (
          <button
            key={tmpl.id}
            onClick={() => {
              applyTemplate(tmpl.id);
              setTimeout(() => setActiveSheet(null), 250);
            }}
            className="flex-shrink-0 w-20 rounded-xl overflow-hidden border-2 border-transparent hover:border-violet-500 transition-colors"
          >
            {/* Mini preview */}
            <div
              className="h-[100px] flex flex-col justify-center items-center gap-1 p-2"
              style={{ background: tmpl.background }}
            >
              <div className="w-8 h-0.5 rounded-full" style={{ background: tmpl.accentColor }} />
              <div className="text-[8px] font-bold text-white text-center leading-tight line-clamp-2">
                {tmpl.defaultHeadline}
              </div>
            </div>
            <div className="bg-black/40 text-[9px] text-white/70 text-center py-1 px-1 truncate">
              {tmpl.name}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
```

**File: `src/components/mobile/sheets/DesignSheet.tsx`**

```tsx
import React from 'react';
import { PALETTES } from '../../../data/palettes';
import { FONTS } from '../../../data/fonts';
import { useEditorStore } from '../../../store/useEditorStore';
import { LayoutId } from '../../../types';

const LAYOUT_IDS: LayoutId[] = ['centered', 'left', 'split', 'top_accent', 'minimal', 'bold'];

export function DesignSheet() {
  const { slides, activeSlideIndex, updateSlideBackground, updateSlideAccent, updateSlideFont, updateSlideLayout } = useEditorStore();
  const slide = slides[activeSlideIndex];

  return (
    <div>
      {/* Palette */}
      <div className="text-[10px] uppercase tracking-widest text-white/40 px-4 pb-2">Color palette</div>
      <div className="flex gap-2 overflow-x-auto px-4 pb-4" style={{ scrollbarWidth: 'none' }}>
        {PALETTES.map(p => (
          <button
            key={p.id}
            onClick={() => { updateSlideBackground(p.background); updateSlideAccent(p.accent); }}
            className={`w-8 h-8 rounded-full flex-shrink-0 border-2 transition-transform hover:scale-110 ${
              slide.background === p.background ? 'border-white' : 'border-transparent'
            }`}
            style={{ background: p.background }}
          />
        ))}
      </div>

      {/* Font */}
      <div className="text-[10px] uppercase tracking-widest text-white/40 px-4 pb-2">Font</div>
      <div className="flex gap-2 overflow-x-auto px-4 pb-4" style={{ scrollbarWidth: 'none' }}>
        {FONTS.map(f => (
          <button
            key={f.id}
            onClick={() => updateSlideFont(f.id)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs border transition-colors ${
              slide.fontId === f.id
                ? 'bg-violet-500/30 border-violet-500 text-white'
                : 'border-white/15 text-white/60 bg-transparent'
            }`}
            style={{ fontFamily: f.css }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Layout */}
      <div className="text-[10px] uppercase tracking-widest text-white/40 px-4 pb-2">Layout</div>
      <div className="flex gap-2 overflow-x-auto px-4 pb-4" style={{ scrollbarWidth: 'none' }}>
        {LAYOUT_IDS.map(id => (
          <button
            key={id}
            onClick={() => updateSlideLayout(id)}
            className={`flex-shrink-0 w-14 h-[70px] rounded-xl border flex flex-col items-center justify-center gap-1 p-1.5 transition-colors ${
              slide.layout === id
                ? 'border-violet-500 bg-violet-500/20'
                : 'border-white/15 bg-transparent'
            }`}
          >
            <span className="w-4/5 h-1 rounded bg-white/30 block" />
            <span className="w-3/4 h-0.5 rounded bg-white/20 block" />
            <span className="w-2/3 h-0.5 rounded bg-white/20 block" />
            <span className="text-[7px] text-white/30 mt-0.5">{id}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
```

**File: `src/components/mobile/sheets/TextSheet.tsx`**

```tsx
import React from 'react';
import { useEditorStore } from '../../../store/useEditorStore';

export function TextSheet() {
  const { slides, activeSlideIndex, updateSlideText } = useEditorStore();
  const slide = slides[activeSlideIndex];

  return (
    <div className="px-4 flex flex-col gap-3 pb-6">
      {(['headline', 'subtitle', 'body'] as const).map(field => (
        <div key={field}>
          <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1.5">{field}</div>
          <textarea
            value={slide[field]}
            onChange={e => updateSlideText(field, e.target.value)}
            rows={field === 'body' ? 4 : 2}
            className="w-full bg-white/7 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm outline-none resize-none focus:border-violet-500/60 transition-colors"
            style={{ background: 'rgba(255,255,255,0.07)' }}
          />
        </div>
      ))}
    </div>
  );
}
```

**File: `src/components/mobile/sheets/SlidesSheet.tsx`**

```tsx
import React from 'react';
import { useEditorStore } from '../../../store/useEditorStore';
import { SlideThumbnail } from '../../shared/SlideThumbnail';

export function SlidesSheet() {
  const { slides, activeSlideIndex, setActiveSlide, setActiveSheet, addSlide } = useEditorStore();

  return (
    <div>
      <div className="flex items-center justify-between px-4 pb-3">
        <span className="text-xs text-white/50">All slides</span>
        <button
          onClick={() => addSlide(slides[activeSlideIndex].templateId)}
          className="bg-violet-500/20 text-violet-300 text-xs rounded-full px-3 py-1.5"
        >
          + Add slide
        </button>
      </div>
      <div className="flex gap-2.5 overflow-x-auto px-4 pb-4" style={{ scrollbarWidth: 'none' }}>
        {slides.map((slide, i) => (
          <div key={slide.id} className="flex-shrink-0">
            <SlideThumbnail
              slide={slide}
              isActive={i === activeSlideIndex}
              onClick={() => { setActiveSlide(i); setActiveSheet(null); }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
```

**File: `src/components/mobile/sheets/IconSheet.tsx`**

```tsx
import React from 'react';
import { useEditorStore } from '../../../store/useEditorStore';

const ICONS = [
  '🚀','⭐','🔥','💡','✅','❌','→','↗','♥','◆','▲','●',
  '🎯','📈','💰','🏆','🎉','⚡','🌟','💎','🔑','🛡','⚙️','🎨',
];

export function IconSheet() {
  const { addIconToSlide, setActiveSheet } = useEditorStore();

  const handleAdd = (icon: string) => {
    addIconToSlide({ content: icon, x: 50, y: 30, size: 36 });
    setActiveSheet(null);
  };

  return (
    <div className="px-4 pb-6">
      <div className="text-xs text-white/50 mb-3">Tap to add to slide</div>
      <div className="grid grid-cols-6 gap-2">
        {ICONS.map(icon => (
          <button
            key={icon}
            onClick={() => handleAdd(icon)}
            className="aspect-square flex items-center justify-center text-2xl rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            {icon}
          </button>
        ))}
      </div>
    </div>
  );
}
```

**File: `src/components/mobile/sheets/ExportSheet.tsx`**

```tsx
import React from 'react';
import { useExport } from '../../../hooks/useExport';

export function ExportSheet() {
  const { exportAllPNG, exportPDF, isExporting } = useExport();

  return (
    <div className="px-4 pb-6 grid grid-cols-2 gap-3">
      <button
        onClick={exportAllPNG}
        disabled={isExporting}
        className="bg-white/6 border border-white/10 rounded-2xl p-4 text-left disabled:opacity-50"
        style={{ background: 'rgba(255,255,255,0.06)' }}
      >
        <div className="text-white font-medium text-sm mb-1">PNG files</div>
        <div className="text-white/40 text-xs">One per slide</div>
      </button>
      <button
        onClick={exportPDF}
        disabled={isExporting}
        className="bg-white/6 border border-white/10 rounded-2xl p-4 text-left disabled:opacity-50"
        style={{ background: 'rgba(255,255,255,0.06)' }}
      >
        <div className="text-white font-medium text-sm mb-1">PDF</div>
        <div className="text-white/40 text-xs">All slides</div>
      </button>
      <button
        className="col-span-2 bg-violet-500/20 border border-violet-500/40 rounded-2xl p-4 text-left"
      >
        <div className="text-white font-medium text-sm mb-1">Share link</div>
        <div className="text-violet-300 text-xs">Anyone with link can view</div>
      </button>
    </div>
  );
}
```

---

## 9. Core Components

### SlideCanvas

This is the most important component. It renders the actual slide. It is used for both the editor canvas and the hidden export clones. The `fillContainer` prop makes it stretch to fill its parent (used on mobile). Without it, it renders at a fixed 340×425px (used on desktop and thumbnails).

**File: `src/components/canvas/SlideCanvas.tsx`**

```tsx
import React, { useRef } from 'react';
import { Slide } from '../../types';
import { FONTS } from '../../data/fonts';
import { EditableText } from './EditableText';
import { IconElement } from './IconElement';

interface Props {
  slide: Slide;
  slideIndex: number;
  totalSlides: number;
  fillContainer?: boolean;   // stretches to parent width/height (mobile)
  readOnly?: boolean;        // disables all editing (thumbnails, export)
  id?: string;               // optional DOM id, used by export hook
}

export function SlideCanvas({ slide, slideIndex, totalSlides, fillContainer, readOnly, id }: Props) {
  const font = FONTS.find(f => f.id === slide.fontId) ?? FONTS[0];
  const textColor = slide.darkText ? '#1a1a2e' : '#ffffff';
  const subColor = slide.darkText ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.65)';

  const containerStyle: React.CSSProperties = fillContainer
    ? { width: '100%', height: '100%' }
    : { width: 340, height: 425, flexShrink: 0 };

  return (
    <div
      id={id}
      style={{
        ...containerStyle,
        background: slide.background,
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
        fontFamily: font.css,
      }}
    >
      {/* Layout-specific content */}
      {slide.layout === 'centered' && (
        <CenteredLayout slide={slide} textColor={textColor} subColor={subColor} readOnly={readOnly} />
      )}
      {slide.layout === 'left' && (
        <LeftLayout slide={slide} textColor={textColor} subColor={subColor} readOnly={readOnly} />
      )}
      {slide.layout === 'top_accent' && (
        <TopAccentLayout slide={slide} textColor={textColor} subColor={subColor} readOnly={readOnly} />
      )}
      {slide.layout === 'split' && (
        <SplitLayout slide={slide} textColor={textColor} subColor={subColor} readOnly={readOnly} />
      )}
      {slide.layout === 'minimal' && (
        <MinimalLayout slide={slide} textColor={textColor} subColor={subColor} readOnly={readOnly} />
      )}
      {slide.layout === 'bold' && (
        <BoldLayout slide={slide} textColor={textColor} subColor={subColor} readOnly={readOnly} />
      )}

      {/* Icon overlays */}
      {slide.icons.map(icon => (
        <IconElement key={icon.id} icon={icon} readOnly={readOnly} />
      ))}

      {/* Slide number */}
      <div
        style={{
          position: 'absolute', bottom: 12, right: 14,
          fontSize: 11, color: slide.darkText ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)',
        }}
      >
        {slideIndex + 1} / {totalSlides}
      </div>
    </div>
  );
}

// ─── Layout components ────────────────────────────────────────────────────────

interface LayoutProps {
  slide: Slide;
  textColor: string;
  subColor: string;
  readOnly?: boolean;
}

function Tag({ slide }: { slide: Slide }) {
  const isDarkAccent = slide.accentColor === '#ffffff' || slide.accentColor.toLowerCase() === '#fff';
  return (
    <div style={{
      display: 'inline-block',
      background: slide.accentColor,
      color: isDarkAccent ? '#333333' : '#ffffff',
      fontSize: 10, fontWeight: 600, letterSpacing: '0.1em',
      padding: '3px 12px', borderRadius: 20, marginBottom: 12,
    }}>
      {slide.tagText || 'SLIDE'}
    </div>
  );
}

function CenteredLayout({ slide, textColor, subColor, readOnly }: LayoutProps) {
  const { updateSlideText } = readOnly ? { updateSlideText: undefined } : require('../../store/useEditorStore').useEditorStore.getState();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '32px', textAlign: 'center' }}>
      <Tag slide={slide} />
      <EditableText
        value={slide.headline}
        style={{ fontSize: 22, fontWeight: 700, color: textColor, lineHeight: 1.2, marginBottom: 8 }}
        readOnly={readOnly}
        onCommit={val => updateSlideText?.('headline', val)}
      />
      {slide.subtitle && (
        <EditableText
          value={slide.subtitle}
          style={{ fontSize: 13, color: subColor, marginBottom: 10 }}
          readOnly={readOnly}
          onCommit={val => updateSlideText?.('subtitle', val)}
        />
      )}
      {slide.body && (
        <EditableText
          value={slide.body}
          multiline
          style={{ fontSize: 12, color: subColor, lineHeight: 1.6, whiteSpace: 'pre-line' }}
          readOnly={readOnly}
          onCommit={val => updateSlideText?.('body', val)}
        />
      )}
    </div>
  );
}

function LeftLayout({ slide, textColor, subColor, readOnly }: LayoutProps) {
  const { updateSlideText } = readOnly ? { updateSlideText: undefined } : require('../../store/useEditorStore').useEditorStore.getState();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '32px 28px' }}>
      <Tag slide={slide} />
      <div style={{ width: 40, height: 3, borderRadius: 2, background: slide.accentColor, marginBottom: 12 }} />
      <EditableText value={slide.headline} style={{ fontSize: 20, fontWeight: 700, color: textColor, lineHeight: 1.2, marginBottom: 8 }} readOnly={readOnly} onCommit={val => updateSlideText?.('headline', val)} />
      {slide.subtitle && <EditableText value={slide.subtitle} style={{ fontSize: 13, color: subColor, marginBottom: 10 }} readOnly={readOnly} onCommit={val => updateSlideText?.('subtitle', val)} />}
      {slide.body && <EditableText value={slide.body} multiline style={{ fontSize: 12, color: subColor, lineHeight: 1.6, whiteSpace: 'pre-line' }} readOnly={readOnly} onCommit={val => updateSlideText?.('body', val)} />}
    </div>
  );
}

function TopAccentLayout({ slide, textColor, subColor, readOnly }: LayoutProps) {
  const { updateSlideText } = readOnly ? { updateSlideText: undefined } : require('../../store/useEditorStore').useEditorStore.getState();

  return (
    <div style={{ height: '100%' }}>
      <div style={{ height: 6, background: slide.accentColor }} />
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: 'calc(100% - 6px)', padding: 28 }}>
        <Tag slide={slide} />
        <EditableText value={slide.headline} style={{ fontSize: 20, fontWeight: 700, color: textColor, lineHeight: 1.2, marginBottom: 8 }} readOnly={readOnly} onCommit={val => updateSlideText?.('headline', val)} />
        {slide.subtitle && <EditableText value={slide.subtitle} style={{ fontSize: 13, color: subColor, marginBottom: 10 }} readOnly={readOnly} onCommit={val => updateSlideText?.('subtitle', val)} />}
        {slide.body && <EditableText value={slide.body} multiline style={{ fontSize: 12, color: subColor, lineHeight: 1.6 }} readOnly={readOnly} onCommit={val => updateSlideText?.('body', val)} />}
      </div>
    </div>
  );
}

function SplitLayout({ slide, textColor, subColor, readOnly }: LayoutProps) {
  const { updateSlideText } = readOnly ? { updateSlideText: undefined } : require('../../store/useEditorStore').useEditorStore.getState();
  const parts = slide.body.split('\n');
  const left = parts[0] ?? '';
  const right = parts[1] ?? '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 28, gap: 12, textAlign: 'center' }}>
      <Tag slide={slide} />
      <EditableText value={slide.headline} style={{ fontSize: 20, fontWeight: 700, color: textColor, lineHeight: 1.2 }} readOnly={readOnly} onCommit={val => updateSlideText?.('headline', val)} />
      {slide.subtitle && <EditableText value={slide.subtitle} style={{ fontSize: 13, color: subColor }} readOnly={readOnly} onCommit={val => updateSlideText?.('subtitle', val)} />}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, width: '100%', marginTop: 8 }}>
        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: 14, fontSize: 12, color: subColor, lineHeight: 1.5 }}>{left}</div>
        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: 14, fontSize: 12, color: subColor, lineHeight: 1.5 }}>{right}</div>
      </div>
    </div>
  );
}

function MinimalLayout({ slide, textColor, subColor, readOnly }: LayoutProps) {
  const { updateSlideText } = readOnly ? { updateSlideText: undefined } : require('../../store/useEditorStore').useEditorStore.getState();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%', padding: '28px 32px' }}>
      <div style={{ width: 32, height: 2, borderRadius: 1, background: slide.accentColor, marginBottom: 16 }} />
      <EditableText value={slide.headline} style={{ fontSize: 24, fontWeight: 700, color: textColor, lineHeight: 1.2, marginBottom: 8 }} readOnly={readOnly} onCommit={val => updateSlideText?.('headline', val)} />
      {slide.subtitle && <EditableText value={slide.subtitle} style={{ fontSize: 13, color: subColor }} readOnly={readOnly} onCommit={val => updateSlideText?.('subtitle', val)} />}
    </div>
  );
}

function BoldLayout({ slide, textColor, subColor, readOnly }: LayoutProps) {
  const { updateSlideText } = readOnly ? { updateSlideText: undefined } : require('../../store/useEditorStore').useEditorStore.getState();

  return (
    <div style={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '55%', background: slide.accentColor, opacity: 0.15 }} />
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '32px 28px', position: 'relative' }}>
        <Tag slide={slide} />
        <EditableText value={slide.headline} style={{ fontSize: 26, fontWeight: 800, color: textColor, lineHeight: 1.1, marginBottom: 10 }} readOnly={readOnly} onCommit={val => updateSlideText?.('headline', val)} />
        {slide.subtitle && <EditableText value={slide.subtitle} style={{ fontSize: 14, color: subColor, marginBottom: 10 }} readOnly={readOnly} onCommit={val => updateSlideText?.('subtitle', val)} />}
        {slide.body && <EditableText value={slide.body} multiline style={{ fontSize: 12, color: subColor, lineHeight: 1.6 }} readOnly={readOnly} onCommit={val => updateSlideText?.('body', val)} />}
      </div>
    </div>
  );
}
```

**File: `src/components/canvas/EditableText.tsx`**

```tsx
import React, { useState, useRef, useEffect } from 'react';

interface Props {
  value: string;
  style: React.CSSProperties;
  readOnly?: boolean;
  multiline?: boolean;
  onCommit?: (value: string) => void;
}

export function EditableText({ value, style, readOnly, multiline, onCommit }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  // Sync if parent value changes while not editing
  useEffect(() => {
    if (!editing) setDraft(value);
  }, [value, editing]);

  useEffect(() => {
    if (editing && ref.current) ref.current.focus();
  }, [editing]);

  const commit = () => {
    setEditing(false);
    onCommit?.(draft);
  };

  if (readOnly) {
    return <div style={style}>{value}</div>;
  }

  if (editing) {
    const sharedProps = {
      ref: ref as any,
      value: draft,
      onChange: (e: React.ChangeEvent<any>) => setDraft(e.target.value),
      onBlur: commit,
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') { setDraft(value); setEditing(false); }
        if (!multiline && e.key === 'Enter') commit();
      },
      style: {
        ...style,
        background: 'rgba(255,255,255,0.12)',
        border: '2px solid rgba(255,255,255,0.6)',
        borderRadius: 4,
        outline: 'none',
        resize: 'none' as const,
        padding: '2px 6px',
        width: '100%',
        fontFamily: 'inherit',
      },
    };

    return multiline
      ? <textarea {...sharedProps} rows={3} />
      : <input {...sharedProps} type="text" />;
  }

  return (
    <div
      style={{ ...style, cursor: 'text', borderRadius: 4, padding: '2px 4px', transition: 'background 0.15s' }}
      onClick={() => setEditing(true)}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {value}
    </div>
  );
}
```

**File: `src/components/canvas/IconElement.tsx`**

```tsx
import React, { useRef } from 'react';
import { IconOverlay } from '../../types';
import { useEditorStore } from '../../store/useEditorStore';

interface Props {
  icon: IconOverlay;
  readOnly?: boolean;
}

export function IconElement({ icon, readOnly }: Props) {
  const { updateIconPosition, removeIconFromSlide } = useEditorStore();
  const isDragging = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (readOnly) return;
    e.preventDefault();
    isDragging.current = true;
    const canvas = (e.currentTarget as HTMLElement).parentElement!;
    const rect = canvas.getBoundingClientRect();

    const onMove = (ev: MouseEvent) => {
      const x = Math.max(0, Math.min(95, ((ev.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(95, ((ev.clientY - rect.top) / rect.height) * 100));
      updateIconPosition(icon.id, x, y);
    };

    const onUp = () => {
      isDragging.current = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: `${icon.x}%`,
        top: `${icon.y}%`,
        fontSize: icon.size,
        cursor: readOnly ? 'default' : 'move',
        userSelect: 'none',
        lineHeight: 1,
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={() => !readOnly && removeIconFromSlide(icon.id)}
      title={readOnly ? undefined : 'Drag to move · Double-click to remove'}
    >
      {icon.content}
    </div>
  );
}
```

### Shared Components

**File: `src/components/shared/TemplateCard.tsx`**

```tsx
import React from 'react';
import { SlideTemplate } from '../../types';

interface Props {
  template: SlideTemplate;
  onClick: () => void;
  isSelected?: boolean;
}

export function TemplateCard({ template, onClick, isSelected }: Props) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg overflow-hidden cursor-pointer border-2 transition-all hover:scale-105 aspect-[4/5] relative
        ${isSelected ? 'border-violet-500' : 'border-transparent'}`}
    >
      {/* Mini slide preview */}
      <div
        className="w-full h-full flex flex-col justify-center items-center gap-1 p-2"
        style={{ background: template.background }}
      >
        <div className="w-8 h-0.5 rounded-full" style={{ background: template.accentColor }} />
        <div className="text-[8px] font-bold text-white text-center leading-tight line-clamp-2">{template.defaultHeadline}</div>
        {template.defaultSubtitle && (
          <div className="text-[7px] text-white/55 text-center">{template.defaultSubtitle}</div>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[9px] py-1 px-1.5 truncate">
        {template.name}
      </div>
    </button>
  );
}
```

**File: `src/components/shared/SlideThumbnail.tsx`**

```tsx
import React from 'react';
import { Slide } from '../../types';
import { TEMPLATES } from '../../data/templates';
import { FONTS } from '../../data/fonts';

interface Props {
  slide: Slide;
  isActive: boolean;
  onClick: () => void;
}

export function SlideThumbnail({ slide, isActive, onClick }: Props) {
  const tmpl = TEMPLATES.find(t => t.id === slide.templateId);
  const font = FONTS.find(f => f.id === slide.fontId);

  return (
    <button
      onClick={onClick}
      className={`w-16 h-20 rounded-lg overflow-hidden border-2 transition-colors flex-shrink-0
        ${isActive ? 'border-violet-500' : 'border-transparent'}`}
      style={{ background: slide.background, fontFamily: font?.css }}
    >
      <div className="w-full h-full p-1.5 flex flex-col justify-center">
        <div className="w-5 h-0.5 rounded mb-1" style={{ background: slide.accentColor }} />
        <div className="text-[7px] font-bold text-white leading-tight line-clamp-2">{slide.headline}</div>
      </div>
    </button>
  );
}
```

---

## 10. Rendering Engine

### Export Hook

Export works by rendering hidden full-resolution `SlideCanvas` elements (at 1080×1350px — standard Instagram portrait size), capturing them with `html2canvas`, and either triggering downloads or bundling into a PDF.

**File: `src/hooks/useExport.ts`**

```typescript
import { useState, useCallback } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useEditorStore } from '../store/useEditorStore';

// The export canvas dimensions (Instagram portrait = 1080×1350)
const EXPORT_WIDTH = 1080;
const EXPORT_HEIGHT = 1350;

export function useExport() {
  const [isExporting, setIsExporting] = useState(false);
  const { slides } = useEditorStore();

  // ── Create a hidden export DOM node ─────────────────────────────────────────

  const createHiddenNode = (slideId: string): HTMLElement => {
    const el = document.createElement('div');
    el.id = `export-${slideId}`;
    el.style.cssText = `
      position: fixed;
      left: -9999px;
      top: 0;
      width: ${EXPORT_WIDTH}px;
      height: ${EXPORT_HEIGHT}px;
      overflow: hidden;
      border-radius: 0;
    `;
    document.body.appendChild(el);
    return el;
  };

  // ── Render a single slide to canvas ─────────────────────────────────────────

  const renderSlide = async (index: number): Promise<HTMLCanvasElement> => {
    const slide = slides[index];
    const el = createHiddenNode(slide.id);

    // Build the slide HTML manually (avoids React hydration overhead for export)
    el.style.background = slide.background;
    el.style.fontFamily = slide.fontId;

    // Re-use SlideCanvas by rendering it via ReactDOM into the hidden node
    const { createRoot } = await import('react-dom/client');
    const { SlideCanvas } = await import('../components/canvas/SlideCanvas');
    const React = await import('react');

    const root = createRoot(el);
    await new Promise<void>(resolve => {
      root.render(
        React.createElement(SlideCanvas, {
          slide,
          slideIndex: index,
          totalSlides: slides.length,
          readOnly: true,
          fillContainer: true,
        })
      );
      // Give React a tick to flush
      setTimeout(resolve, 100);
    });

    const canvas = await html2canvas(el, {
      width: EXPORT_WIDTH,
      height: EXPORT_HEIGHT,
      scale: 1,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: null,
    });

    root.unmount();
    document.body.removeChild(el);
    return canvas;
  };

  // ── Export all slides as individual PNG downloads ────────────────────────────

  const exportAllPNG = useCallback(async () => {
    setIsExporting(true);
    try {
      for (let i = 0; i < slides.length; i++) {
        const canvas = await renderSlide(i);
        const link = document.createElement('a');
        link.download = `slide-${i + 1}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        // small delay between downloads so the browser doesn't block them
        await new Promise(r => setTimeout(r, 200));
      }
    } finally {
      setIsExporting(false);
    }
  }, [slides]);

  // ── Export all slides as a single PDF ────────────────────────────────────────

  const exportPDF = useCallback(async () => {
    setIsExporting(true);
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [EXPORT_WIDTH, EXPORT_HEIGHT],
      });

      for (let i = 0; i < slides.length; i++) {
        if (i > 0) pdf.addPage([EXPORT_WIDTH, EXPORT_HEIGHT], 'portrait');
        const canvas = await renderSlide(i);
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, EXPORT_WIDTH, EXPORT_HEIGHT);
      }

      pdf.save('carousel.pdf');
    } finally {
      setIsExporting(false);
    }
  }, [slides]);

  return { exportAllPNG, exportPDF, isExporting };
}
```

### Responsive Hook

**File: `src/hooks/useIsMobile.ts`**

```typescript
import { useState, useEffect } from 'react';

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return isMobile;
}
```

---

## 11. Export System

Export renders slides at 1080×1350px (Instagram portrait). The approach is:

1. For each slide, create an off-screen `div` at full resolution
2. Render `<SlideCanvas readOnly fillContainer>` into it
3. Capture with `html2canvas`
4. Either trigger a PNG download per slide, or accumulate into a jsPDF document

**Known `html2canvas` limitations:**
- CSS gradients are captured correctly in Chrome. Safari may have issues — test there.
- `position: fixed` elements inside the captured node are ignored. Never use `fixed` inside `SlideCanvas`.
- Custom fonts (Syne, DM Serif etc.) must be fully loaded before capture. Add a `document.fonts.ready` await before calling `html2canvas`.

Add this to your export hook before the `html2canvas` call:

```typescript
await document.fonts.ready;
const canvas = await html2canvas(el, { ... });
```

---

## 13. PWA & Auto-Save

### 13.1 Auto-Save Implementation

**File: `src/app/utility/carousel-builder/utils/storage.ts`**

```typescript
import { Slide, EditorState } from '../types';

const STORAGE_KEY = 'carousel-builder-data';
const BACKUP_KEY = 'carousel-builder-backup';

export interface StoredData {
  slides: Slide[];
  activeSlideIndex: number;
  timestamp: number;
  version: string;
}

export const saveToLocalStorage = (slides: Slide[], activeSlideIndex: number): void => {
  try {
    const data: StoredData = {
      slides,
      activeSlideIndex,
      timestamp: Date.now(),
      version: '1.0.0',
    };
    
    // Save current data
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    
    // Keep a backup of previous version
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing) {
      localStorage.setItem(BACKUP_KEY, existing);
    }
    
    console.log('Auto-saved to localStorage');
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

export const loadFromLocalStorage = (): StoredData | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    
    const parsed = JSON.parse(data) as StoredData;
    
    // Validate data structure
    if (!parsed.slides || !Array.isArray(parsed.slides)) {
      console.warn('Invalid stored data structure');
      return null;
    }
    
    return parsed;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
};

export const clearLocalStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(BACKUP_KEY);
    console.log('Cleared localStorage');
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
};

export const hasStoredData = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
};

export const getStorageSize = (): number => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? new Blob([data]).size : 0;
  } catch {
    return 0;
  }
};
```

### 13.2 PWA Utilities

**File: `src/app/utility/carousel-builder/utils/pwa.ts`**

```typescript
export const isPWAInstalled = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true;
};

export const canInstallPWA = (): boolean => {
  return 'serviceWorker' in navigator && 'BeforeInstallPromptEvent' in window;
};

export const isOnline = (): boolean => {
  return navigator.onLine;
};

export const registerServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

export const checkForUpdates = async (): Promise<boolean> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.update();
        return registration.waiting !== null;
      }
    } catch (error) {
      console.error('Failed to check for updates:', error);
    }
  }
  return false;
};
```

### 13.3 Auto-Save Indicator Component

**File: `src/app/utility/carousel-builder/components/shared/AutoSaveIndicator.tsx`**

```typescript
'use client';

import React from 'react';
import { useEditorStore } from '../../store/useEditorStore';
import { useAutoSave } from '../../hooks/useAutoSave';

export const AutoSaveIndicator: React.FC = () => {
  const { autoSave } = useEditorStore();
  const { isAutoSaveEnabled, lastSaved, isDirty } = useAutoSave();

  if (!isAutoSaveEnabled) return null;

  const getStatusText = () => {
    if (!navigator.onLine) return 'Offline';
    if (isDirty) return 'Saving...';
    if (lastSaved) {
      const timeDiff = Date.now() - lastSaved.getTime();
      if (timeDiff < 60000) return 'Saved just now';
      if (timeDiff < 3600000) return `Saved ${Math.floor(timeDiff / 60000)}m ago`;
      return `Saved ${Math.floor(timeDiff / 3600000)}h ago`;
    }
    return 'Auto-save enabled';
  };

  const getStatusColor = () => {
    if (!navigator.onLine) return 'text-red-500';
    if (isDirty) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className={`w-2 h-2 rounded-full ${
        !navigator.onLine ? 'bg-red-500' : 
        isDirty ? 'bg-yellow-500 animate-pulse' : 
        'bg-green-500'
      }`} />
      <span className={getStatusColor()}>
        {getStatusText()}
      </span>
    </div>
  );
};
```

### 13.4 PWA Install Prompt

**File: `src/app/utility/carousel-builder/components/shared/PWAInstallPrompt.tsx`**

```typescript
'use client';

import React, { useState, useEffect } from 'react';
import { useEditorStore } from '../../store/useEditorStore';

export const PWAInstallPrompt: React.FC = () => {
  const { pwa, updatePWAState } = useEditorStore();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      updatePWAState({ isInstallable: true });
      
      // Show prompt after user has been using the app for a bit
      setTimeout(() => setShowPrompt(true), 30000); // 30 seconds
    };

    const handleAppInstalled = () => {
      updatePWAState({ isInstalled: true, isInstallable: false });
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [updatePWAState]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      updatePWAState({ isInstalled: true });
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  if (!showPrompt || !pwa.isInstallable || pwa.isInstalled) return null;
  if (sessionStorage.getItem('pwa-prompt-dismissed')) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V8z" clipRule="evenodd" />
          </svg>
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">Install Carousel Builder</h3>
          <p className="text-sm text-gray-600 mb-3">
            Install our app for faster access and offline editing capabilities.
          </p>
          
          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              Install
            </button>
            <button
              onClick={handleDismiss}
              className="px-3 py-1.5 text-gray-600 text-sm hover:text-gray-800 transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
        
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};
```

These are the bugs discovered during development. The agent must implement these fixes — do not skip them.

### Bug 1: Template sheet renders empty on first open

**Root cause:** `renderCatChips()` and `renderTmplRow()` are called once in `init()` but the sheet starts hidden. When it opens for the first time, nothing re-renders the content.

**Fix:** In the React version, this is already solved because `TemplatesSheet` is a React component — it re-renders whenever `activeCategoryId` changes in the Zustand store. Ensure `TemplatesSheet` is always mounted (even when the sheet is closed) by keeping it in the DOM inside `BottomSheet`. The `BottomSheet` component hides the sheet via CSS `transform: translateY(100%)`, never via `display: none` or conditional rendering. This ensures React state is preserved and the component stays mounted.

```tsx
// CORRECT — sheet stays mounted, just off-screen
<div style={{ transform: isOpen ? 'translateY(0)' : 'translateY(100%)' }}>
  {children}
</div>

// WRONG — unmounts content on close, loses state
{isOpen && <div>{children}</div>}
```

### Bug 2: Category filter chips don't filter templates

**Root cause:** `setActiveCategory` updates `activeCategoryId` in the store, but the template list isn't re-filtered.

**Fix:** In `TemplatesSheet`, the `filtered` variable is derived directly from `activeCategoryId`:

```typescript
const filtered = activeCategoryId === 'all'
  ? TEMPLATES
  : TEMPLATES.filter(t => t.categoryId === activeCategoryId);
```

Because this is inside the React component body, it re-computes on every render. As long as `activeCategoryId` comes from `useEditorStore()`, changing it triggers a re-render and `filtered` updates automatically. No extra `useEffect` needed.

### Bug 3: Bottom nav tab highlights don't update

**Root cause:** `activeSheet` in the store is not updated on toggle — clicking the same tab twice should close the sheet.

**Fix:** The `setActiveSheet` action in the store toggles:

```typescript
setActiveSheet: (sheet) =>
  set((state) => ({
    activeSheet: state.activeSheet === sheet ? null : sheet,
  })),
```

The `BottomNav` reads `activeSheet` from the store and applies `text-violet-400` to the matching tab. This is reactive.

### Bug 4: Inline text editing loses focus on mobile

**Root cause:** On iOS, `contenteditable` elements inside a transformed container don't receive focus reliably.

**Fix:** Use `<textarea>` for inline editing on all platforms (not `contenteditable`). The `EditableText` component above already uses `<textarea>` and `<input>` elements, which work correctly on iOS. When `TextSheet` is open on mobile, users edit text in the sheet textareas rather than tapping the canvas. This is the correct UX pattern for mobile — canvas tap-to-edit is a desktop pattern only.

### Bug 5: Export produces blank images

**Root cause:** `html2canvas` runs before fonts are loaded.

**Fix:**

```typescript
await document.fonts.ready; // wait for all custom fonts
const canvas = await html2canvas(el, { ... });
```

Also ensure Google Fonts are loaded in `index.html` with `display=swap` and that the export node stays in the DOM long enough for fonts to apply (the 100ms `setTimeout` in `renderSlide` handles this).

### Bug 6: Deleting the last slide crashes

**Fix:** The `deleteSlide` action checks `slides.length === 1` and returns early:

```typescript
deleteSlide: (index) =>
  set((state) => {
    if (state.slides.length === 1) return state;
    // ...
  }),
```

### Bug 7: applyTemplate overwrites user-edited text

**Fix:** The `applyTemplate` action preserves user text if it differs from the template default:

```typescript
headline: current.headline === TEMPLATES.find(t => t.id === current.templateId)?.defaultHeadline
  ? tmpl.defaultHeadline
  : current.headline,
```

This checks if the current text still equals the previous template's default (i.e. user hasn't edited it). If so, swap to the new default. If the user has customised the text, keep it.

---

## 13. Routing & Pages

**File: `src/App.tsx`**

```tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { EditorPage } from './pages/EditorPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EditorPage />} />
        <Route path="/editor" element={<EditorPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

**File: `src/pages/EditorPage.tsx`**

```tsx
import React from 'react';
import { useIsMobile } from '../hooks/useIsMobile';
import { DesktopEditor } from '../components/desktop/DesktopEditor';
import { MobileEditor } from '../components/mobile/MobileEditor';

export function EditorPage() {
  const isMobile = useIsMobile();
  return isMobile ? <MobileEditor /> : <DesktopEditor />;
}
```

---

## 14. Environment & Scripts

### `index.html`

Add Google Fonts in `<head>`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>Carousel Builder</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@400;500&family=DM+Serif+Display&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### `src/main.tsx`

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### `src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

*, *::before, *::after {
  box-sizing: border-box;
}

html, body, #root {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

/* Prevent bounce scroll on iOS */
body {
  overscroll-behavior: none;
  -webkit-text-size-adjust: 100%;
}

/* Hide scrollbars globally except when needed */
::-webkit-scrollbar { display: none; }
* { scrollbar-width: none; }
```

### `tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### `vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### `package.json` scripts

```json
{
  "scripts": {
    "dev":     "vite",
    "build":   "tsc && vite build",
    "preview": "vite preview"
  }
}
```

### Run commands

```bash
# Development
npm run dev

# Production build
npm run build
npm run preview
```

---

## Quick-start checklist for the agent

1. `npm create vite@latest carousel-builder -- --template react-ts`
2. `cd carousel-builder && npm install zustand react-router-dom html2canvas jspdf lucide-react @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`
3. `npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p`
4. Replace `index.html` with the version above (adds Google Fonts)
5. Replace `tailwind.config.js` with the version above
6. Create every file in `src/` exactly as documented above, in this order:
   - `types/index.ts`
   - `data/categories.ts`, `data/templates.ts`, `data/fonts.ts`, `data/palettes.ts`
   - `store/useEditorStore.ts`
   - `hooks/useIsMobile.ts`, `hooks/useExport.ts`
   - `components/canvas/*`
   - `components/shared/*`
   - `components/desktop/*`
   - `components/mobile/BottomSheet.tsx`, `BottomNav.tsx`, `MobileEditor.tsx`
   - `components/mobile/sheets/*`
   - `pages/EditorPage.tsx`
   - `App.tsx`, `main.tsx`, `index.css`
7. `npm run dev` — should open at `http://localhost:5173`

---

*End of spec. All code, types, data, state, components, and bugs are fully documented above.*