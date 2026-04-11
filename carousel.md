# Social Media Carousel Builder — Next.js Implementation Spec
### For: `github.com/mubarak96-max/tools` (Next.js 16.2, React 19, Tailwind v4)

> **For the coding agent:** Read `AGENTS.md` first — it warns that this Next.js version has breaking changes from training data. Read `node_modules/next/dist/docs/` before writing any Next.js-specific code. Every file path, package, component, state shape, bug fix, and integration detail is documented here. Follow in order. No guessing.

---

## Table of Contents

1. [Project Context & Integration](#1-project-context--integration)
2. [Product Philosophy](#2-product-philosophy)
3. [User Flows](#3-user-flows)
4. [Package Installation](#4-package-installation)
5. [Project Structure](#5-project-structure)
6. [Environment Variables](#6-environment-variables)
7. [Data Models & Types](#7-data-models--types)
8. [Template & Category Data](#8-template--category-data)
9. [State Management (Zustand)](#9-state-management-zustand)
10. [AI Generation API Route](#10-ai-generation-api-route)
11. [Programmatic SEO Pages](#11-programmatic-seo-pages)
12. [Desktop Layout Components](#12-desktop-layout-components)
13. [Mobile Layout Components](#13-mobile-layout-components)
14. [Canvas & Rendering Components](#14-canvas--rendering-components)
15. [Export System](#15-export-system)
16. [Auto-Save & localStorage](#16-auto-save--localstorage)
17. [SEO Content Component](#17-seo-content-component)
18. [Known Bugs & Mandatory Fixes](#18-known-bugs--mandatory-fixes)
19. [Fonts & Global CSS](#19-fonts--global-css)
20. [next.config.ts Changes](#20-nextconfigts-changes)
21. [Implementation Checklist](#21-implementation-checklist)

---

## 1. Project Context & Integration

### What this project already is

The repo at `github.com/mubarak96-max/tools` is a **Next.js 16.2 / React 19 / Tailwind v4** tool discovery platform. It uses:
- **Firebase** for data storage
- **OpenAI SDK** (already installed) for AI features
- **Framer Motion** for animations
- **Lucide React** for icons
- **Vercel** for deployment

The carousel builder is a **new utility tool** added to this platform, following the same pattern as other utilities in `src/app/utility/`.

### Where it lives in the project

```
src/app/utility/free-social-media-carousel-builder/
```

This follows the existing routing convention. The tool is also accessible via programmatic SEO niche pages:

```
src/app/utility/free-social-media-carousel-builder/[niche]/page.tsx
```

### What NOT to install

The project already has: `next`, `react`, `react-dom`, `tailwindcss`, `lucide-react`, `framer-motion`, `openai`, `firebase`, `zod`, `clsx`, `tailwind-merge`.

Do NOT re-install or duplicate these. Only add what is missing.

### Critical: This is Next.js 16.2 with React 19

- All components that use browser APIs (`window`, `localStorage`, `document`) MUST have `'use client'` at the top
- Server components are the default — they cannot use hooks, state, or browser APIs
- The App Router is used — no `pages/` directory
- `generateStaticParams` replaces `getStaticPaths`
- `generateMetadata` replaces `getStaticProps` for metadata

---

## 2. Product Philosophy

**This is NOT a design tool. It is the fastest way to create a high-performing social media carousel.**

Core principles in priority order:
1. Speed over features — user gets usable result in under 30 seconds
2. AI is a controlled accelerator, not the core engine — max 2 generations per hour per IP
3. Programmatic SEO is the traffic engine — 10+ niche pages targeting 50K+ monthly searches
4. Low cost per user — limited AI calls, no realtime backend needed
5. Ad revenue > operating costs — AdSense-friendly layout, high session time

### What is NOT built in v1

Do not build: charts/graph elements, polls/quizzes, interactive elements, Unsplash integration, stock photo panel, PWA service worker, shape library, text effects panel. These are deferred. The spec references them in types for forward compatibility but the UI components are not implemented.

---

## 3. User Flows

### Primary flow (AI-assisted, target < 30 seconds)
1. Land on `/utility/free-social-media-carousel-builder` or a niche page
2. See the AI input: "What is your carousel about?"
3. Type topic → click Generate
4. Get 5–7 slides with template applied automatically
5. Click any slide text to edit inline (desktop) or tap Edit Text (mobile)
6. Click Export → download PNGs

### Secondary flow (manual)
1. Browse template categories in left sidebar / Templates sheet
2. Click a template → applies to current slide
3. Edit text → export

### Return flow (retention)
1. Auto-save restores last session from localStorage on page load
2. User sees their previous carousel immediately
3. Edit and re-export without rebuilding from scratch

---

## 4. Package Installation

Run this from the repo root. These are the ONLY new packages needed:

```bash
npm install zustand html-to-image jszip
```

**Why these specific packages:**
- `zustand` — lightweight state management, no provider needed, works well with Next.js 'use client' components
- `html-to-image` — better than `html2canvas` for Next.js: handles CSS gradients, custom fonts, and CORS correctly; outputs PNG blob directly
- `jszip` — ZIP export (all slides as one download)

**Do NOT install:** `html2canvas`, `jspdf`, `@dnd-kit/*`, `react-router-dom` (not needed — Next.js handles routing).

**Fonts:** Loaded via Next.js `next/font/google` in the layout, NOT via a `<link>` tag in `<head>`. This is the correct Next.js 16 pattern.

---

## 5. Project Structure

All new files go under:

```
src/app/utility/free-social-media-carousel-builder/
├── page.tsx                          # Main tool page (Server Component wrapper)
├── [niche]/
│   └── page.tsx                      # Niche SEO pages (Server Component)
│
├── _components/                      # All components (underscore = not a route)
│   ├── CarouselBuilderClient.tsx     # 'use client' root — owns all editor state
│   ├── AIInput.tsx                   # 'use client' — AI generation input
│   │
│   ├── desktop/
│   │   ├── DesktopEditor.tsx         # Three-column shell
│   │   ├── LeftSidebar.tsx           # Category nav + template grid
│   │   ├── RightSidebar.tsx          # Color / font / layout / elements
│   │   ├── Toolbar.tsx               # Top bar: title, add slide, export
│   │   └── SlideStrip.tsx            # Bottom thumbnail strip
│   │
│   ├── mobile/
│   │   ├── MobileEditor.tsx          # Full-screen canvas + bottom nav
│   │   ├── BottomNav.tsx             # 4-tab bottom navigation
│   │   ├── BottomSheet.tsx           # Reusable slide-up sheet
│   │   └── sheets/
│   │       ├── SlidesSheet.tsx
│   │       ├── TemplatesSheet.tsx    # CRITICAL: always mounted, never display:none
│   │       ├── DesignSheet.tsx
│   │       ├── TextSheet.tsx
│   │       ├── IconSheet.tsx
│   │       └── ExportSheet.tsx
│   │
│   ├── canvas/
│   │   ├── SlideCanvas.tsx           # The slide renderer — used for edit + export
│   │   ├── EditableText.tsx          # Click-to-edit text (desktop only)
│   │   └── IconElement.tsx           # Draggable emoji/icon overlay
│   │
│   └── shared/
│       ├── TemplateCard.tsx
│       ├── SlideThumbnail.tsx
│       └── SEOContent.tsx            # Niche-specific SEO block
│
├── _store/
│   └── useEditorStore.ts             # Zustand store ('use client' implied by consumers)
│
├── _data/
│   ├── templates.ts                  # 24 template definitions
│   ├── categories.ts                 # 8 category definitions
│   ├── fonts.ts                      # 4 font options
│   ├── palettes.ts                   # 8 color palettes
│   └── niches.ts                     # 10 SEO niche configurations
│
├── _hooks/
│   ├── useIsMobile.ts                # 'use client' breakpoint hook
│   ├── useExport.ts                  # PNG + ZIP export logic
│   └── useAutoSave.ts                # localStorage auto-save
│
├── _types/
│   └── index.ts                      # All TypeScript types
│
└── api/
    └── carousel-generate/
        └── route.ts                  # POST /api/carousel-generate (AI generation)
```

**Note on underscore prefix:** Folders prefixed with `_` (e.g., `_components`, `_store`) are not treated as routes by Next.js App Router. This is the correct pattern to keep non-route code alongside route files.

**Note on API route location:** The API route lives at `src/app/utility/free-social-media-carousel-builder/api/carousel-generate/route.ts`. This means its URL is `/utility/free-social-media-carousel-builder/api/carousel-generate`. Update fetch calls accordingly.

---

## 6. Environment Variables

Add to `.env.local` (already exists in the project):

```bash
# Already present in project — used by openai package
OPENROUTER_API_KEY=your_openrouter_key_here

# Already present — used for other tools
NEXT_PUBLIC_BASE_URL=https://tools-tau-rouge.vercel.app
```

The carousel builder uses `OPENROUTER_API_KEY` via OpenRouter, not the OpenAI SDK directly. The project already has `openai` installed but the carousel route uses `fetch` directly to OpenRouter for cost control.

---

## 7. Data Models & Types

**File: `src/app/utility/free-social-media-carousel-builder/_types/index.ts`**

```typescript
// ─── Categories ───────────────────────────────────────────────────────────────

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
  color: string;
  templateTypes: string[];
}

// ─── Templates ────────────────────────────────────────────────────────────────

export type LayoutId = 'centered' | 'left' | 'top_accent' | 'split' | 'minimal' | 'bold';

export type FontId = 'syne' | 'dm_sans' | 'dm_serif' | 'space_mono';

export interface SlideTemplate {
  id: string;
  name: string;
  categoryId: CategoryId;
  background: string;       // CSS gradient string or hex
  accentColor: string;      // hex
  tagText: string;          // badge label e.g. 'PITCH DECK'
  defaultHeadline: string;
  defaultSubtitle: string;
  defaultBody: string;
  layout: LayoutId;
  darkText: boolean;        // true = dark text (for light backgrounds)
  fontFamily: FontId;
}

export interface FontOption {
  id: FontId;
  label: string;
  css: string;              // CSS font-family string
}

export interface Palette {
  id: string;
  background: string;
  accent: string;
  textPrimary: string;
  textSecondary: string;
}

// ─── Slide ────────────────────────────────────────────────────────────────────

export interface IconOverlay {
  id: string;
  content: string;          // emoji character
  x: number;               // 0-100 percent from left
  y: number;               // 0-100 percent from top
  size: number;            // px
}

export interface Slide {
  id: string;
  templateId: string;
  headline: string;
  subtitle: string;
  body: string;
  background: string;
  accentColor: string;
  fontId: FontId;
  layout: LayoutId;
  darkText: boolean;
  icons: IconOverlay[];
}

// ─── AI ───────────────────────────────────────────────────────────────────────

export interface AIGeneratedSlide {
  headline: string;
  body: string;
}

export interface AIUsage {
  count: number;
  resetTime: number;        // unix ms timestamp
}

// ─── SEO Niches ───────────────────────────────────────────────────────────────

export interface FAQ {
  question: string;
  answer: string;
}

export interface NicheConfig {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  templates: string[];      // template IDs to preselect
  defaultTopic: string;
  seoContent: {
    h1: string;
    intro: string;
    benefits: string[];
    examples: string[];
    faqs: FAQ[];
  };
}

// ─── Editor State ─────────────────────────────────────────────────────────────

export type ActiveSheet =
  | 'slides'
  | 'templates'
  | 'design'
  | 'text'
  | 'icons'
  | 'export'
  | null;

export interface EditorState {
  // State
  slides: Slide[];
  activeSlideIndex: number;
  activeSheet: ActiveSheet;
  activeCategoryId: CategoryId | 'all';
  aiUsage: AIUsage;
  isGenerating: boolean;
  generationError: string | null;

  // Navigation
  setActiveSlide: (index: number) => void;
  setActiveSheet: (sheet: ActiveSheet) => void;
  setActiveCategory: (id: CategoryId | 'all') => void;

  // Slide CRUD
  addSlide: (templateId: string) => void;
  duplicateSlide: (index: number) => void;
  deleteSlide: (index: number) => void;
  reorderSlides: (fromIndex: number, toIndex: number) => void;

  // Slide content
  applyTemplate: (templateId: string) => void;
  updateSlideText: (field: 'headline' | 'subtitle' | 'body', value: string) => void;
  updateSlideBackground: (background: string) => void;
  updateSlideAccent: (accent: string) => void;
  updateSlideFont: (fontId: FontId) => void;
  updateSlideLayout: (layout: LayoutId) => void;

  // Icons
  addIconToSlide: (icon: Omit<IconOverlay, 'id'>) => void;
  updateIconPosition: (iconId: string, x: number, y: number) => void;
  removeIconFromSlide: (iconId: string) => void;

  // AI
  generateFromAI: (topic: string, niche?: string) => Promise<void>;
  canUseAI: () => boolean;

  // Persistence
  saveToStorage: () => void;
  loadFromStorage: () => void;
  setSlides: (slides: Slide[]) => void;
}
```

---

## 8. Template & Category Data

**File: `src/app/utility/free-social-media-carousel-builder/_data/categories.ts`**

```typescript
import type { Category } from '../_types';

export const CATEGORIES: Category[] = [
  { id: 'business',    label: 'Business & Professional', color: '#378ADD', templateTypes: ['Pitch Deck', 'Company Update', 'Report'] },
  { id: 'social',      label: 'Social Media',            color: '#D4537E', templateTypes: ['Quote Card', 'Tip Card', 'Announcement'] },
  { id: 'educational', label: 'Educational',             color: '#1D9E75', templateTypes: ['How-to Guide', 'Tutorial', 'Fun Fact'] },
  { id: 'marketing',   label: 'Marketing',               color: '#EF9F27', templateTypes: ['Product Launch', 'Promotion', 'Sale'] },
  { id: 'personal',    label: 'Personal',                color: '#AFA9EC', templateTypes: ['Story', 'Testimonial', 'Lifestyle'] },
  { id: 'lists',       label: 'Lists & Tips',            color: '#5DCAA5', templateTypes: ['Step-by-Step', 'Numbered List', 'Checklist'] },
  { id: 'before_after',label: 'Before / After',          color: '#F0997B', templateTypes: ['Comparison', 'Transformation', 'Split View'] },
  { id: 'statistics',  label: 'Statistics',              color: '#7F77DD', templateTypes: ['Infographic', 'Data Visual', 'Chart Card'] },
];
```

**File: `src/app/utility/free-social-media-carousel-builder/_data/templates.ts`**

```typescript
import type { SlideTemplate } from '../_types';

export const TEMPLATES: SlideTemplate[] = [
  // ── BUSINESS ──────────────────────────────────────────────────────────────
  {
    id: 'biz_pitch', name: 'Pitch Deck', categoryId: 'business',
    background: 'linear-gradient(135deg, #0d1b2a 0%, #1b3a5c 100%)',
    accentColor: '#48bfe3', tagText: 'PITCH DECK',
    defaultHeadline: 'Series A Pitch', defaultSubtitle: 'Your Company Name',
    defaultBody: 'Transforming the way businesses connect with customers through AI-powered solutions.',
    layout: 'centered', darkText: false, fontFamily: 'syne',
  },
  {
    id: 'biz_update', name: 'Company Update', categoryId: 'business',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    accentColor: '#e94560', tagText: 'UPDATE',
    defaultHeadline: 'Q3 2024 Update', defaultSubtitle: 'Company Newsletter',
    defaultBody: "We've hit 50K users and launched 3 new features this quarter.",
    layout: 'left', darkText: false, fontFamily: 'dm_sans',
  },
  {
    id: 'biz_report', name: 'Report', categoryId: 'business',
    background: '#f8f9fa', accentColor: '#378ADD', tagText: 'REPORT',
    defaultHeadline: 'Annual Report', defaultSubtitle: 'FY 2024',
    defaultBody: 'Key metrics, milestones, and what the year ahead holds for our team.',
    layout: 'top_accent', darkText: true, fontFamily: 'dm_sans',
  },
  // ── SOCIAL MEDIA ──────────────────────────────────────────────────────────
  {
    id: 'social_quote', name: 'Quote Card', categoryId: 'social',
    background: 'linear-gradient(135deg, #b5179e 0%, #7209b7 100%)',
    accentColor: '#ffffff', tagText: 'QUOTE',
    defaultHeadline: '"Success is not final, failure is not fatal."',
    defaultSubtitle: '— Winston Churchill', defaultBody: '',
    layout: 'centered', darkText: false, fontFamily: 'dm_serif',
  },
  {
    id: 'social_tip', name: 'Tip Card', categoryId: 'social',
    background: 'linear-gradient(135deg, #2d6a4f 0%, #40916c 100%)',
    accentColor: '#d8f3dc', tagText: 'TIP',
    defaultHeadline: 'Pro Tip #7', defaultSubtitle: 'Design',
    defaultBody: 'Always use consistent spacing — it makes everything feel intentional and polished.',
    layout: 'left', darkText: false, fontFamily: 'syne',
  },
  {
    id: 'social_announcement', name: 'Announcement', categoryId: 'social',
    background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
    accentColor: '#1a1a2e', tagText: 'ANNOUNCEMENT',
    defaultHeadline: 'BIG NEWS!', defaultSubtitle: 'Something is coming...',
    defaultBody: 'We have been working on something special. Stay tuned for the reveal on Friday!',
    layout: 'centered', darkText: false, fontFamily: 'syne',
  },
  // ── EDUCATIONAL ───────────────────────────────────────────────────────────
  {
    id: 'edu_howto', name: 'How-to Guide', categoryId: 'educational',
    background: '#0d1b2a', accentColor: '#5e60ce', tagText: 'HOW-TO',
    defaultHeadline: 'How to Write Better Headlines', defaultSubtitle: 'Step 1 of 5',
    defaultBody: 'Start with a number or power word. Keep it under 70 characters. Make a promise you can keep.',
    layout: 'left', darkText: false, fontFamily: 'dm_sans',
  },
  {
    id: 'edu_tutorial', name: 'Tutorial', categoryId: 'educational',
    background: 'linear-gradient(135deg, #480ca8 0%, #3a0ca3 100%)',
    accentColor: '#4cc9f0', tagText: 'TUTORIAL',
    defaultHeadline: 'CSS Grid in 5 Minutes', defaultSubtitle: 'Tutorial',
    defaultBody: 'grid-template-columns lets you define the number and size of columns in your layout.',
    layout: 'centered', darkText: false, fontFamily: 'space_mono',
  },
  {
    id: 'edu_fact', name: 'Fun Fact', categoryId: 'educational',
    background: 'linear-gradient(135deg, #0f3460 0%, #16213e 100%)',
    accentColor: '#e94560', tagText: 'FACT',
    defaultHeadline: 'Did you know?', defaultSubtitle: 'Science',
    defaultBody: 'Honey never spoils. Archaeologists have found 3,000-year-old honey in Egyptian tombs.',
    layout: 'centered', darkText: false, fontFamily: 'syne',
  },
  // ── MARKETING ─────────────────────────────────────────────────────────────
  {
    id: 'mkt_launch', name: 'Product Launch', categoryId: 'marketing',
    background: 'linear-gradient(135deg, #7400b8 0%, #6930c3 100%)',
    accentColor: '#48bfe3', tagText: 'NEW',
    defaultHeadline: 'Introducing Pro Plan', defaultSubtitle: 'Available now',
    defaultBody: 'Everything you need to grow — unlimited projects, priority support, advanced analytics.',
    layout: 'centered', darkText: false, fontFamily: 'syne',
  },
  {
    id: 'mkt_promo', name: 'Promotion', categoryId: 'marketing',
    background: 'linear-gradient(135deg, #ff6b35 0%, #e94560 100%)',
    accentColor: '#ffffff', tagText: 'PROMO',
    defaultHeadline: '50% OFF', defaultSubtitle: 'Limited time offer',
    defaultBody: 'Use code LAUNCH50 at checkout. Offer ends Sunday at midnight.',
    layout: 'centered', darkText: false, fontFamily: 'syne',
  },
  {
    id: 'mkt_sale', name: 'Sale', categoryId: 'marketing',
    background: '#1a1a2e', accentColor: '#EF9F27', tagText: 'SALE',
    defaultHeadline: 'Flash Sale', defaultSubtitle: 'Today only',
    defaultBody: 'Our biggest discount ever on all annual plans. Do not miss this.',
    layout: 'left', darkText: false, fontFamily: 'dm_sans',
  },
  // ── PERSONAL ──────────────────────────────────────────────────────────────
  {
    id: 'per_story', name: 'Story', categoryId: 'personal',
    background: 'linear-gradient(135deg, #2d6a4f 0%, #1b4332 100%)',
    accentColor: '#74c69d', tagText: 'STORY',
    defaultHeadline: 'My Entrepreneurship Journey', defaultSubtitle: 'From zero to $1M ARR',
    defaultBody: 'Two years ago I had an idea. No investors. No team. Just a laptop and a vision.',
    layout: 'left', darkText: false, fontFamily: 'dm_serif',
  },
  {
    id: 'per_testimonial', name: 'Testimonial', categoryId: 'personal',
    background: '#0d1b2a', accentColor: '#48bfe3', tagText: 'TESTIMONIAL',
    defaultHeadline: '"This tool 10x\'d our output"', defaultSubtitle: '— Sarah M., Head of Marketing',
    defaultBody: 'We went from 2 posts a week to 20. The ROI has been incredible.',
    layout: 'centered', darkText: false, fontFamily: 'dm_serif',
  },
  {
    id: 'per_lifestyle', name: 'Lifestyle', categoryId: 'personal',
    background: 'linear-gradient(135deg, #b5179e 0%, #560bad 100%)',
    accentColor: '#f8c8e8', tagText: 'LIFESTYLE',
    defaultHeadline: 'Morning Routine', defaultSubtitle: '5am club',
    defaultBody: 'Hydrate. Move. Journal. These 30 minutes set the tone for my entire day.',
    layout: 'centered', darkText: false, fontFamily: 'syne',
  },
  // ── LISTS & TIPS ──────────────────────────────────────────────────────────
  {
    id: 'list_step', name: 'Step-by-Step', categoryId: 'lists',
    background: '#0f3460', accentColor: '#48bfe3', tagText: 'GUIDE',
    defaultHeadline: '5 Steps to Launch', defaultSubtitle: 'Start today',
    defaultBody: '1. Define your MVP\n2. Build in public\n3. Get 10 beta users\n4. Collect feedback\n5. Iterate fast',
    layout: 'left', darkText: false, fontFamily: 'dm_sans',
  },
  {
    id: 'list_numbered', name: 'Numbered List', categoryId: 'lists',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #533483 100%)',
    accentColor: '#AFA9EC', tagText: 'LIST',
    defaultHeadline: 'Top 7 Tools for 2024', defaultSubtitle: 'Productivity',
    defaultBody: 'Notion · Figma · Linear · Raycast · Arc · Superhuman · Fathom',
    layout: 'left', darkText: false, fontFamily: 'dm_sans',
  },
  {
    id: 'list_checklist', name: 'Checklist', categoryId: 'lists',
    background: '#1b4332', accentColor: '#74c69d', tagText: 'CHECKLIST',
    defaultHeadline: 'Launch Checklist', defaultSubtitle: 'Are you ready?',
    defaultBody: '✓ Landing page live\n✓ Email sequence set\n✓ Analytics connected\n○ Press outreach\n○ Social scheduled',
    layout: 'left', darkText: false, fontFamily: 'space_mono',
  },
  // ── BEFORE / AFTER ────────────────────────────────────────────────────────
  {
    id: 'ba_comparison', name: 'Comparison', categoryId: 'before_after',
    background: 'linear-gradient(135deg, #0d1b2a 0%, #1b2838 100%)',
    accentColor: '#48bfe3', tagText: 'BEFORE / AFTER',
    defaultHeadline: 'Then vs Now', defaultSubtitle: '12 months apart',
    defaultBody: 'Before: 200 followers, 0 revenue\nAfter: 42K followers, $180K ARR',
    layout: 'split', darkText: false, fontFamily: 'syne',
  },
  {
    id: 'ba_transformation', name: 'Transformation', categoryId: 'before_after',
    background: 'linear-gradient(135deg, #b5179e 0%, #7209b7 100%)',
    accentColor: '#ffffff', tagText: 'TRANSFORMATION',
    defaultHeadline: 'The Transformation', defaultSubtitle: 'Real results',
    defaultBody: 'Lost 18kg in 6 months — not through restriction, but through sustainable habits.',
    layout: 'centered', darkText: false, fontFamily: 'dm_serif',
  },
  {
    id: 'ba_split', name: 'Split View', categoryId: 'before_after',
    background: '#0f3460', accentColor: '#EF9F27', tagText: 'SPLIT',
    defaultHeadline: 'Old vs New Way', defaultSubtitle: 'Workflow redesign',
    defaultBody: 'Old: 14 steps, 3 tools, 2 hours\nNew: 3 steps, 1 tool, 15 minutes',
    layout: 'split', darkText: false, fontFamily: 'dm_sans',
  },
  // ── STATISTICS ────────────────────────────────────────────────────────────
  {
    id: 'stat_infographic', name: 'Infographic', categoryId: 'statistics',
    background: 'linear-gradient(135deg, #7400b8 0%, #3a0ca3 100%)',
    accentColor: '#4cc9f0', tagText: 'STATS',
    defaultHeadline: 'Social Media 2024', defaultSubtitle: 'Key statistics',
    defaultBody: '4.9B users · 145 min/day avg · 62% buy after story ad',
    layout: 'centered', darkText: false, fontFamily: 'syne',
  },
  {
    id: 'stat_data', name: 'Data Visual', categoryId: 'statistics',
    background: '#0d1b2a', accentColor: '#1D9E75', tagText: 'DATA',
    defaultHeadline: 'Growth Metrics', defaultSubtitle: 'Q1–Q4 2024',
    defaultBody: 'MRR ↑ 340% · Churn ↓ 2.1% · NPS 72 · CAC $48',
    layout: 'left', darkText: false, fontFamily: 'space_mono',
  },
  {
    id: 'stat_chart', name: 'Chart Card', categoryId: 'statistics',
    background: 'linear-gradient(135deg, #1b2838 0%, #0d1b2a 100%)',
    accentColor: '#48bfe3', tagText: 'CHART',
    defaultHeadline: 'Revenue Growth', defaultSubtitle: 'Monthly recurring revenue',
    defaultBody: 'Jan $12K → Jun $67K → Dec $180K',
    layout: 'left', darkText: false, fontFamily: 'syne',
  },
];
```

**File: `src/app/utility/free-social-media-carousel-builder/_data/fonts.ts`**

```typescript
import type { FontOption } from '../_types';

export const FONTS: FontOption[] = [
  { id: 'syne',       label: 'Modern (Syne)',     css: "'Syne', sans-serif" },
  { id: 'dm_sans',    label: 'Clean (DM Sans)',   css: "'DM Sans', sans-serif" },
  { id: 'dm_serif',   label: 'Editorial (Serif)', css: "'DM Serif Display', serif" },
  { id: 'space_mono', label: 'Mono (Code)',        css: "'Space Mono', monospace" },
];
```

**File: `src/app/utility/free-social-media-carousel-builder/_data/palettes.ts`**

```typescript
import type { Palette } from '../_types';

export const PALETTES: Palette[] = [
  { id: 'midnight', background: '#0d1b2a',                                              accent: '#48bfe3', textPrimary: '#ffffff', textSecondary: 'rgba(255,255,255,0.6)' },
  { id: 'violet',   background: 'linear-gradient(135deg,#7400b8,#6930c3)',             accent: '#4cc9f0', textPrimary: '#ffffff', textSecondary: 'rgba(255,255,255,0.65)' },
  { id: 'forest',   background: 'linear-gradient(135deg,#2d6a4f,#1b4332)',             accent: '#74c69d', textPrimary: '#ffffff', textSecondary: 'rgba(255,255,255,0.65)' },
  { id: 'rose',     background: 'linear-gradient(135deg,#b5179e,#7209b7)',             accent: '#f8c8e8', textPrimary: '#ffffff', textSecondary: 'rgba(255,255,255,0.65)' },
  { id: 'slate',    background: 'linear-gradient(135deg,#1a1a2e,#16213e)',             accent: '#e94560', textPrimary: '#ffffff', textSecondary: 'rgba(255,255,255,0.6)' },
  { id: 'ocean',    background: '#0f3460',                                              accent: '#5e60ce', textPrimary: '#ffffff', textSecondary: 'rgba(255,255,255,0.65)' },
  { id: 'amber',    background: 'linear-gradient(135deg,#ff6b35,#f7931e)',             accent: '#1a1a2e', textPrimary: '#ffffff', textSecondary: 'rgba(255,255,255,0.75)' },
  { id: 'light',    background: '#f8f9fa',                                              accent: '#378ADD', textPrimary: '#1a1a2e', textSecondary: 'rgba(0,0,0,0.55)' },
];
```

**File: `src/app/utility/free-social-media-carousel-builder/_data/niches.ts`**

```typescript
import type { NicheConfig } from '../_types';

export const NICHE_CONFIGS: Record<string, NicheConfig> = {
  'instagram-carousel-maker': {
    slug: 'instagram-carousel-maker',
    title: 'Instagram Carousel Maker — Create Viral Posts in 30 Seconds',
    description: 'Free Instagram carousel maker. Create engaging multi-slide posts that get more likes, comments, and followers. No design skills needed.',
    keywords: ['instagram carousel maker', 'instagram post creator', 'social media carousel', 'instagram content creator', 'carousel generator free'],
    templates: ['social_quote', 'social_tip', 'ba_comparison', 'per_story'],
    defaultTopic: 'Instagram growth tips',
    seoContent: {
      h1: 'Free Instagram Carousel Maker',
      intro: 'Create scroll-stopping Instagram carousels that get more engagement. Generate professional multi-slide posts in under 30 seconds.',
      benefits: ['Increase engagement by 300%', 'Save 2 hours per post', 'No design skills required', 'Viral-tested templates', 'Export ready-to-post images'],
      examples: ['Growth tips carousel', 'Product showcase slides', 'Behind-the-scenes story', 'Tutorial step-by-step', 'Before/after transformation'],
      faqs: [
        { question: 'How do I make an Instagram carousel?', answer: 'Simply enter your topic, click generate, and get 5–7 professionally designed slides ready to post.' },
        { question: 'What size should Instagram carousels be?', answer: 'Our tool automatically creates carousels in the optimal 1080×1350 size for maximum engagement.' },
        { question: 'Is this tool free?', answer: 'Yes, fully free. You can create and export unlimited carousels at no cost.' },
      ],
    },
  },
  'linkedin-carousel-generator': {
    slug: 'linkedin-carousel-generator',
    title: 'LinkedIn Carousel Generator — Professional Posts That Get Noticed',
    description: 'Create professional LinkedIn carousels for business growth. Stand out with engaging multi-slide posts that build authority and generate leads.',
    keywords: ['linkedin carousel generator', 'professional linkedin posts', 'business carousel maker', 'linkedin content creator', 'thought leadership carousel'],
    templates: ['biz_pitch', 'list_step', 'per_story', 'edu_howto'],
    defaultTopic: 'Business leadership insights',
    seoContent: {
      h1: 'LinkedIn Carousel Generator',
      intro: 'Stand out on LinkedIn with professional carousel posts that build thought leadership and grow your network.',
      benefits: ['Build thought leadership', 'Increase profile views by 400%', 'Generate quality leads', 'Professional templates', 'Business-focused content'],
      examples: ['Industry insights carousel', 'Career advice slides', 'Business strategy tips', 'Leadership lessons', 'Professional growth guide'],
      faqs: [
        { question: 'How do LinkedIn carousels work?', answer: 'LinkedIn carousels are multi-slide posts users swipe through, perfect for sharing detailed insights and building engagement.' },
        { question: 'What makes a good LinkedIn carousel?', answer: 'Professional design, valuable business insights, clear structure, and a strong call-to-action that encourages networking.' },
      ],
    },
  },
  'real-estate-carousel-templates': {
    slug: 'real-estate-carousel-templates',
    title: 'Real Estate Carousel Templates — Showcase Properties Like a Pro',
    description: 'Professional real estate carousel templates. Create stunning property showcases, market updates, and buyer guides that convert leads.',
    keywords: ['real estate carousel templates', 'property showcase slides', 'real estate marketing', 'property listing carousel', 'realtor social media'],
    templates: ['mkt_launch', 'ba_comparison', 'list_step', 'social_tip'],
    defaultTopic: 'Property showcase and market insights',
    seoContent: {
      h1: 'Real Estate Carousel Templates',
      intro: 'Create professional property showcases and market insights that attract buyers and sellers. Perfect for realtors and agencies.',
      benefits: ['Showcase properties professionally', 'Generate more leads', 'Build real estate authority', 'Save hours on content creation', 'Mobile-optimized designs'],
      examples: ['Property listing showcase', 'Market update slides', 'Home buying guide', 'Neighborhood highlights', 'Investment property analysis'],
      faqs: [
        { question: 'How can carousels help real estate marketing?', answer: 'Carousels let you showcase multiple property features, market data, and buying tips in one engaging post that gets more views than single images.' },
        { question: 'What should I include in a property carousel?', answer: 'Include key features, neighborhood info, pricing context, and a clear call-to-action for interested buyers.' },
      ],
    },
  },
  'fitness-carousel-maker': {
    slug: 'fitness-carousel-maker',
    title: 'Fitness Carousel Maker — Create Workout & Health Content That Converts',
    description: 'Free fitness carousel maker for trainers, gyms, and health coaches. Create workout guides, nutrition tips, and transformation stories that grow your audience.',
    keywords: ['fitness carousel maker', 'workout carousel template', 'health and fitness social media', 'personal trainer content', 'gym instagram carousel'],
    templates: ['ba_transformation', 'list_step', 'edu_howto', 'per_lifestyle'],
    defaultTopic: 'Workout tips for beginners',
    seoContent: {
      h1: 'Fitness Carousel Maker',
      intro: 'Create workout guides, nutrition tips, and transformation stories that build your fitness brand and grow your audience.',
      benefits: ['Grow fitness following faster', 'Share workouts visually', 'Inspire transformations', 'Build trainer credibility', 'No graphic design needed'],
      examples: ['Full-body workout plan', 'Nutrition tips carousel', 'Before/after transformation', 'Exercise technique guide', 'Meal prep tutorial'],
      faqs: [
        { question: 'What fitness content works best as carousels?', answer: 'Step-by-step workout guides, before/after transformations, and numbered tip lists perform best as carousels because each slide builds on the last.' },
        { question: 'How often should fitness coaches post carousels?', answer: 'Aim for 3–5 carousels per week. Consistency matters more than frequency — pick a pace you can sustain.' },
      ],
    },
  },
  'business-carousel-templates': {
    slug: 'business-carousel-templates',
    title: 'Business Carousel Templates — Grow Your Brand on Social Media',
    description: 'Professional business carousel templates for entrepreneurs and companies. Create pitch decks, company updates, and thought leadership posts that get engagement.',
    keywords: ['business carousel templates', 'entrepreneur social media', 'startup carousel maker', 'company update template', 'business post creator'],
    templates: ['biz_pitch', 'biz_update', 'mkt_launch', 'stat_data'],
    defaultTopic: 'Business growth strategies',
    seoContent: {
      h1: 'Business Carousel Templates',
      intro: 'Professional carousel templates for entrepreneurs, startups, and businesses that want to stand out on LinkedIn and Instagram.',
      benefits: ['Look like a Fortune 500', 'Share metrics that matter', 'Build investor confidence', 'Attract top talent', 'Generate B2B leads'],
      examples: ['Company milestone update', 'Product launch announcement', 'Revenue growth story', 'Team culture showcase', 'Industry insight report'],
      faqs: [
        { question: 'Should businesses use carousels on Instagram or LinkedIn?', answer: 'Both. Instagram carousels drive consumer engagement and brand awareness. LinkedIn carousels build B2B authority and generate professional leads.' },
        { question: 'What business metrics should I share in carousels?', answer: 'Growth percentages, user counts, revenue milestones, and customer satisfaction scores perform well. Always pair numbers with context.' },
      ],
    },
  },
  'marketing-carousel-creator': {
    slug: 'marketing-carousel-creator',
    title: 'Marketing Carousel Creator — Drive Sales With Engaging Slides',
    description: 'Create high-converting marketing carousels for product launches, promotions, and sales. Free tool with viral templates used by top marketers.',
    keywords: ['marketing carousel creator', 'product launch carousel', 'promotional social media', 'sales carousel template', 'marketing content creator'],
    templates: ['mkt_launch', 'mkt_promo', 'mkt_sale', 'ba_comparison'],
    defaultTopic: 'Product launch announcement',
    seoContent: {
      h1: 'Marketing Carousel Creator',
      intro: 'Create carousels that drive action. From product launches to flash sales, our templates are built to convert browsers into buyers.',
      benefits: ['Higher click-through rates', 'Drive product launches', 'Create urgency', 'Showcase social proof', 'Convert followers to customers'],
      examples: ['New product announcement', 'Limited time offer', 'Feature comparison slides', 'Customer testimonial carousel', 'Black Friday campaign'],
      faqs: [
        { question: 'Do carousels really drive more sales?', answer: 'Yes — carousel posts get 3x more engagement than single-image posts. More engagement means more visibility and more conversions.' },
        { question: 'What is the best call-to-action for a marketing carousel?', answer: 'Keep it specific: "DM us LAUNCH for 20% off" outperforms generic CTAs. Make the action frictionless and time-bound.' },
      ],
    },
  },
  'personal-brand-carousel-maker': {
    slug: 'personal-brand-carousel-maker',
    title: 'Personal Brand Carousel Maker — Build Your Audience Faster',
    description: 'Create personal brand carousels that attract followers, build trust, and establish you as an expert. Free templates for creators and entrepreneurs.',
    keywords: ['personal brand carousel maker', 'creator carousel template', 'influencer content creator', 'personal branding social media', 'thought leader carousel'],
    templates: ['per_story', 'per_testimonial', 'social_quote', 'edu_howto'],
    defaultTopic: 'My journey and lessons learned',
    seoContent: {
      h1: 'Personal Brand Carousel Maker',
      intro: 'Turn your story and expertise into scroll-stopping carousels that attract your ideal audience and build a loyal following.',
      benefits: ['Share your story powerfully', 'Build genuine trust', 'Attract dream clients', 'Grow faster organically', 'Become a recognized expert'],
      examples: ['My entrepreneurship story', 'Lessons I learned the hard way', 'How I went from X to Y', 'My daily routine', 'Mistakes I made so you don\'t have to'],
      faqs: [
        { question: 'What personal brand content works as carousels?', answer: 'Origin stories, lessons learned, transformations, behind-the-scenes processes, and strong opinions with supporting evidence all perform extremely well.' },
        { question: 'How personal should personal brand carousels be?', answer: 'The more specific and vulnerable the details, the better. Vague stories get ignored; specific stories get shared.' },
      ],
    },
  },
  'education-carousel-templates': {
    slug: 'education-carousel-templates',
    title: 'Education Carousel Templates — Teach Concepts That Stick',
    description: 'Create educational carousels that simplify complex topics. Perfect for teachers, trainers, coaches, and content creators in the education space.',
    keywords: ['education carousel templates', 'teaching social media content', 'educational post creator', 'knowledge sharing carousel', 'how-to carousel maker'],
    templates: ['edu_howto', 'edu_tutorial', 'edu_fact', 'list_step'],
    defaultTopic: 'How to learn faster',
    seoContent: {
      h1: 'Education Carousel Templates',
      intro: 'Transform complex ideas into simple, shareable carousels. Perfect for educators, coaches, and anyone who loves teaching through social media.',
      benefits: ['Simplify complex topics', 'Increase knowledge retention', 'Build teaching authority', 'Get shared more often', 'Grow student community'],
      examples: ['Step-by-step tutorial', 'Common mistakes to avoid', 'Quick tips and tricks', 'Surprising fact revealed', 'Beginner\'s guide to X'],
      faqs: [
        { question: 'What educational topics perform best as carousels?', answer: 'Step-by-step guides, myth-busting facts, beginner\'s guides to complex topics, and "X things I wish I knew" formats consistently go viral.' },
        { question: 'How many slides should an educational carousel have?', answer: 'Aim for 5–7 slides. Slide 1 is the hook, slides 2–5 deliver the value, and the final slide has a clear takeaway or next step.' },
      ],
    },
  },
  'ecommerce-carousel-generator': {
    slug: 'ecommerce-carousel-generator',
    title: 'E-commerce Carousel Generator — Showcase Products That Sell',
    description: 'Create product showcase carousels that drive online sales. Free e-commerce carousel templates for Shopify, Instagram, and all social platforms.',
    keywords: ['ecommerce carousel generator', 'product showcase carousel', 'shopify social media', 'instagram shopping post', 'product launch carousel'],
    templates: ['mkt_launch', 'mkt_promo', 'ba_comparison', 'per_testimonial'],
    defaultTopic: 'Product features and benefits',
    seoContent: {
      h1: 'E-commerce Carousel Generator',
      intro: 'Create product carousels that stop the scroll and drive clicks. Perfect for Shopify stores, DTC brands, and e-commerce entrepreneurs.',
      benefits: ['Showcase products visually', 'Drive product page traffic', 'Increase average order value', 'Build product trust', 'Turn followers into buyers'],
      examples: ['New product launch', 'Product feature showcase', 'Size/variant comparison', 'Customer reviews carousel', 'Unboxing experience slides'],
      faqs: [
        { question: 'How can carousels increase e-commerce sales?', answer: 'Carousels let you tell the full product story: the problem it solves, key features, social proof, and a direct purchase CTA. Each slide moves the buyer closer to converting.' },
        { question: 'Should I show product prices in carousels?', answer: 'Yes for promotions and sales. For regular product posts, focus on value and benefits first, then mention price as a final slide or in the caption.' },
      ],
    },
  },
  'nonprofit-carousel-maker': {
    slug: 'nonprofit-carousel-maker',
    title: 'Nonprofit Carousel Maker — Share Your Mission and Drive Donations',
    description: 'Create compelling nonprofit carousels that tell your story, share impact, and inspire donations. Free templates for charities and social causes.',
    keywords: ['nonprofit carousel maker', 'charity social media template', 'fundraising carousel', 'social cause content', 'impact story carousel'],
    templates: ['per_story', 'stat_infographic', 'ba_transformation', 'social_announcement'],
    defaultTopic: 'Our impact story',
    seoContent: {
      h1: 'Nonprofit Carousel Maker',
      intro: 'Tell your mission\'s story with carousels that move people to action. Perfect for nonprofits, charities, and social impact organizations.',
      benefits: ['Share impact visually', 'Inspire more donations', 'Tell beneficiary stories', 'Build donor community', 'Increase volunteer sign-ups'],
      examples: ['Impact report highlights', 'Beneficiary story carousel', 'Fundraising campaign launch', 'Volunteer spotlight slides', 'Annual milestones achieved'],
      faqs: [
        { question: 'What nonprofit content works best as carousels?', answer: 'Impact statistics with human stories, before/after transformations from your work, and urgent fundraising campaigns with clear goals perform best.' },
        { question: 'How can nonprofits grow their social media with carousels?', answer: 'Focus on specific stories over general statistics. "Maria now attends school" is more powerful than "1,000 children helped." Specificity creates emotional connection.' },
      ],
    },
  },
};

// Fallback config for unknown slugs
export const DEFAULT_NICHE_CONFIG: NicheConfig = {
  slug: 'free-social-media-carousel-builder',
  title: 'Free Social Media Carousel Builder — Create in 30 Seconds',
  description: 'Free carousel builder for Instagram, LinkedIn, and all social media. 24 templates, AI-assisted generation, PNG export. No sign-up required.',
  keywords: ['carousel builder', 'social media carousel', 'free carousel maker', 'instagram carousel', 'linkedin carousel'],
  templates: ['biz_pitch', 'social_quote', 'edu_howto', 'mkt_launch'],
  defaultTopic: 'Tips for your audience',
  seoContent: {
    h1: 'Free Social Media Carousel Builder',
    intro: 'Create professional social media carousels in under 30 seconds. 24 templates, AI-assisted generation, one-click PNG export.',
    benefits: ['24 professional templates', 'AI generates content for you', 'Export as PNG instantly', 'No sign-up or credit card', 'Works on mobile and desktop'],
    examples: ['Business pitch deck', 'Instagram quote card', 'Step-by-step tutorial', 'Product launch announcement', 'Before/after comparison'],
    faqs: [
      { question: 'Is this carousel builder really free?', answer: 'Yes, 100% free. Create, edit, and export unlimited carousels with no account required.' },
      { question: 'What social media platforms can I use these for?', answer: 'All major platforms: Instagram, LinkedIn, Facebook, Twitter/X, Pinterest, and TikTok. Export at 1080×1350 (portrait) which works everywhere.' },
      { question: 'Do I need design skills?', answer: 'No. Pick a template, enter your topic, and click Generate. The AI writes your content and the template handles the design.' },
    ],
  },
};
```

---

## 9. State Management (Zustand)

**File: `src/app/utility/free-social-media-carousel-builder/_store/useEditorStore.ts`**

```typescript
'use client';

import { create } from 'zustand';
import type { EditorState, Slide, FontId, LayoutId, ActiveSheet, CategoryId, IconOverlay, AIUsage } from '../_types';
import { TEMPLATES } from '../_data/templates';

const STORAGE_KEY = 'carousel-builder-v1';
const AI_LIMIT = 2;
const AI_WINDOW_MS = 60 * 60 * 1000; // 1 hour

// ─── Helper ───────────────────────────────────────────────────────────────────

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
  aiUsage: { count: 0, resetTime: 0 },
  isGenerating: false,
  generationError: null,

  // ── Navigation ──────────────────────────────────────────────────────────────

  setActiveSlide: (index) => set({ activeSlideIndex: index }),

  // Toggle: clicking the same tab twice closes the sheet
  setActiveSheet: (sheet) =>
    set((state) => ({ activeSheet: state.activeSheet === sheet ? null : sheet })),

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
      const copy: Slide = {
        ...original,
        id: crypto.randomUUID(),
        icons: original.icons.map(ic => ({ ...ic, id: crypto.randomUUID() })),
      };
      const newSlides = [...state.slides];
      newSlides.splice(index + 1, 0, copy);
      return { slides: newSlides, activeSlideIndex: index + 1 };
    }),

  deleteSlide: (index) =>
    set((state) => {
      if (state.slides.length === 1) return state; // never delete last slide
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

  // ── Template & Content Edits ──────────────────────────────────────────────

  applyTemplate: (templateId) =>
    set((state) => {
      const tmpl = TEMPLATES.find(t => t.id === templateId)!;
      const current = state.slides[state.activeSlideIndex];
      const prevTmpl = TEMPLATES.find(t => t.id === current.templateId);
      // Only replace text if it still matches the previous template's default (user hasn't edited it)
      const updated: Slide = {
        ...current,
        templateId,
        background: tmpl.background,
        accentColor: tmpl.accentColor,
        fontId: tmpl.fontFamily,
        layout: tmpl.layout,
        darkText: tmpl.darkText,
        headline: current.headline === prevTmpl?.defaultHeadline ? tmpl.defaultHeadline : current.headline,
        subtitle: current.subtitle === prevTmpl?.defaultSubtitle ? tmpl.defaultSubtitle : current.subtitle,
        body:     current.body     === prevTmpl?.defaultBody     ? tmpl.defaultBody     : current.body,
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

  // ── Icons ─────────────────────────────────────────────────────────────────

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

  // ── AI Generation ─────────────────────────────────────────────────────────

  canUseAI: () => {
    const { aiUsage } = get();
    const now = Date.now();
    if (now > aiUsage.resetTime) return true; // window expired, reset
    return aiUsage.count < AI_LIMIT;
  },

  generateFromAI: async (topic, niche) => {
    const state = get();
    if (!state.canUseAI()) {
      set({ generationError: 'Generation limit reached. Try again in 1 hour.' });
      return;
    }

    set({ isGenerating: true, generationError: null });

    try {
      const res = await fetch(
        '/utility/free-social-media-carousel-builder/api/carousel-generate',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic, niche }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        set({ generationError: data.error || 'Generation failed. Please try again.' });
        return;
      }

      // Apply generated slides — use current template style for all
      const currentTemplateId = get().slides[get().activeSlideIndex]?.templateId ?? 'biz_pitch';
      const tmpl = TEMPLATES.find(t => t.id === currentTemplateId)!;

      const generatedSlides: Slide[] = (data.slides as Array<{ headline: string; body: string }>).map((s) => ({
        id: crypto.randomUUID(),
        templateId: currentTemplateId,
        headline: s.headline,
        subtitle: '',
        body: s.body || '',
        background: tmpl.background,
        accentColor: tmpl.accentColor,
        fontId: tmpl.fontFamily,
        layout: tmpl.layout,
        darkText: tmpl.darkText,
        icons: [],
      }));

      // Update AI usage
      const now = Date.now();
      const currentUsage = get().aiUsage;
      const newUsage: AIUsage = now > currentUsage.resetTime
        ? { count: 1, resetTime: now + AI_WINDOW_MS }
        : { count: currentUsage.count + 1, resetTime: currentUsage.resetTime };

      set({ slides: generatedSlides, activeSlideIndex: 0, aiUsage: newUsage });
    } catch {
      set({ generationError: 'Network error. Please try again.' });
    } finally {
      set({ isGenerating: false });
    }
  },

  // ── Persistence ───────────────────────────────────────────────────────────

  saveToStorage: () => {
    try {
      const { slides, activeSlideIndex } = get();
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ slides, activeSlideIndex, savedAt: Date.now() }));
    } catch {
      // localStorage may be unavailable (private mode, quota exceeded)
    }
  },

  loadFromStorage: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.slides) && parsed.slides.length > 0) {
        set({ slides: parsed.slides, activeSlideIndex: parsed.activeSlideIndex ?? 0 });
      }
    } catch {
      // Corrupt data — ignore
    }
  },

  setSlides: (slides) => set({ slides }),
}));
```

---

## 10. AI Generation API Route

**File: `src/app/utility/free-social-media-carousel-builder/api/carousel-generate/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';

// In-memory rate limiting (resets on cold start — acceptable for this use case)
// For production, replace with Redis or Upstash
const ipCounts = new Map<string, { count: number; resetAt: number }>();
const LIMIT = 2;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

function getClientIp(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'anonymous';
}

function checkRateLimit(ip: string): { limited: boolean; retryAfter: number } {
  const now = Date.now();
  const entry = ipCounts.get(ip);

  if (!entry || now > entry.resetAt) {
    ipCounts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { limited: false, retryAfter: 0 };
  }

  if (entry.count >= LIMIT) {
    return { limited: true, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count += 1;
  return { limited: false, retryAfter: 0 };
}

function buildPrompt(topic: string, niche?: string): string {
  const nicheCtx = niche ? `This carousel is for ${niche.replace(/-/g, ' ')} content.` : '';
  return `Generate a high-performing social media carousel about "${topic}". ${nicheCtx}

Rules:
- Return ONLY a valid JSON array, no other text
- Exactly 6 slides
- Each headline: max 12 words, punchy and specific
- Slide 1: strong hook that creates curiosity or promises value
- Slides 2–5: deliver concrete value points
- Slide 6: clear call-to-action (follow, share, comment, DM)
- No emojis, no asterisks, no markdown
- body field: 1 short supporting sentence, or empty string ""

Required format (copy exactly):
[
  {"headline": "Hook headline here", "body": ""},
  {"headline": "Value point 1", "body": "One sentence supporting detail."},
  {"headline": "Value point 2", "body": "One sentence supporting detail."},
  {"headline": "Value point 3", "body": "One sentence supporting detail."},
  {"headline": "Value point 4", "body": "One sentence supporting detail."},
  {"headline": "Call to action slide", "body": ""}
]`;
}

function parseSlides(content: string): Array<{ headline: string; body: string }> | null {
  try {
    const match = content.match(/\[[\s\S]*\]/);
    if (!match) return null;
    const parsed = JSON.parse(match[0]);
    if (!Array.isArray(parsed)) return null;
    return parsed.filter(
      (s): s is { headline: string; body: string } =>
        typeof s.headline === 'string' && s.headline.length > 0
    );
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const { limited, retryAfter } = checkRateLimit(ip);

  if (limited) {
    return NextResponse.json(
      { error: `Generation limit reached. Try again in ${Math.ceil(retryAfter / 60)} minutes.` },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    );
  }

  let topic: string;
  let niche: string | undefined;

  try {
    const body = await req.json();
    topic = body.topic;
    niche = body.niche;
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (!topic || typeof topic !== 'string' || topic.trim().length === 0 || topic.length > 200) {
    return NextResponse.json({ error: 'Topic must be 1–200 characters.' }, { status: 400 });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Service temporarily unavailable.' }, { status: 503 });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_BASE_URL ?? 'https://tools-tau-rouge.vercel.app',
        'X-Title': 'Carousel Builder',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-lite',
        messages: [{ role: 'user', content: buildPrompt(topic.trim(), niche) }],
        temperature: 0.7,
        max_tokens: 400,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Generation failed. Please try again.' }, { status: 502 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim();

    if (!content) {
      return NextResponse.json({ error: 'Empty response from AI. Please try again.' }, { status: 502 });
    }

    const slides = parseSlides(content);
    if (!slides || slides.length === 0) {
      return NextResponse.json({ error: 'Could not parse response. Please try again.' }, { status: 502 });
    }

    return NextResponse.json({ slides });
  } catch {
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
```

---

## 11. Programmatic SEO Pages

**File: `src/app/utility/free-social-media-carousel-builder/page.tsx`**

```typescript
import type { Metadata } from 'next';
import { DEFAULT_NICHE_CONFIG } from './_data/niches';
import { CarouselBuilderClient } from './_components/CarouselBuilderClient';
import { SEOContent } from './_components/shared/SEOContent';

export const metadata: Metadata = {
  title: DEFAULT_NICHE_CONFIG.title,
  description: DEFAULT_NICHE_CONFIG.description,
  keywords: DEFAULT_NICHE_CONFIG.keywords.join(', '),
  openGraph: {
    title: DEFAULT_NICHE_CONFIG.title,
    description: DEFAULT_NICHE_CONFIG.description,
    type: 'website',
  },
};

export default function CarouselBuilderPage() {
  return (
    <main>
      {/* SEO content block ABOVE the tool (for crawlers) */}
      <SEOContent niche={DEFAULT_NICHE_CONFIG} />
      {/* The editor itself */}
      <div id="carousel-tool">
        <CarouselBuilderClient niche={DEFAULT_NICHE_CONFIG.slug} />
      </div>
    </main>
  );
}
```

**File: `src/app/utility/free-social-media-carousel-builder/[niche]/page.tsx`**

```typescript
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NICHE_CONFIGS } from '../_data/niches';
import { CarouselBuilderClient } from '../_components/CarouselBuilderClient';
import { SEOContent } from '../_components/shared/SEOContent';

// Pre-generate all niche pages at build time
export function generateStaticParams() {
  return Object.keys(NICHE_CONFIGS).map((slug) => ({ niche: slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ niche: string }> }
): Promise<Metadata> {
  const { niche } = await params;
  const config = NICHE_CONFIGS[niche];
  if (!config) return {};

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords.join(', '),
    openGraph: {
      title: config.title,
      description: config.description,
      type: 'website',
    },
  };
}

export default async function NicheCarouselPage(
  { params }: { params: Promise<{ niche: string }> }
) {
  const { niche } = await params;
  const config = NICHE_CONFIGS[niche];

  if (!config) notFound();

  return (
    <main>
      <SEOContent niche={config} />
      <div id="carousel-tool">
        <CarouselBuilderClient
          niche={config.slug}
          preselectedTemplates={config.templates}
          defaultTopic={config.defaultTopic}
        />
      </div>
    </main>
  );
}
```

**Note on `params` in Next.js 16:** In Next.js 15+, `params` is a Promise. Always `await params` before accessing properties. This is a breaking change from Next.js 14.

---

## 12. Desktop Layout Components

**File: `src/app/utility/free-social-media-carousel-builder/_components/CarouselBuilderClient.tsx`**

```tsx
'use client';

import React, { useEffect } from 'react';
import { useEditorStore } from '../_store/useEditorStore';
import { useIsMobile } from '../_hooks/useIsMobile';
import { DesktopEditor } from './desktop/DesktopEditor';
import { MobileEditor } from './mobile/MobileEditor';
import { AIInput } from './AIInput';

interface Props {
  niche?: string;
  preselectedTemplates?: string[];
  defaultTopic?: string;
}

export function CarouselBuilderClient({ niche, defaultTopic }: Props) {
  const { loadFromStorage } = useEditorStore();
  const isMobile = useIsMobile();

  // Load saved session on mount
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  return (
    <div className="w-full">
      {/* AI Input — shown above the editor on both mobile and desktop */}
      <AIInput niche={niche} defaultTopic={defaultTopic} />
      {/* Responsive editor */}
      {isMobile ? <MobileEditor /> : <DesktopEditor />}
    </div>
  );
}
```

**File: `src/app/utility/free-social-media-carousel-builder/_components/AIInput.tsx`**

```tsx
'use client';

import React, { useState } from 'react';
import { useEditorStore } from '../_store/useEditorStore';

interface Props {
  niche?: string;
  defaultTopic?: string;
}

export function AIInput({ niche, defaultTopic }: Props) {
  const [topic, setTopic] = useState(defaultTopic ?? '');
  const { generateFromAI, isGenerating, generationError, canUseAI, aiUsage } = useEditorStore();

  const remaining = Math.max(0, 2 - aiUsage.count);
  const isOverLimit = !canUseAI();

  const handleGenerate = async () => {
    if (!topic.trim() || isGenerating || isOverLimit) return;
    await generateFromAI(topic.trim(), niche);
  };

  return (
    <div className="w-full bg-gray-50 border-b border-gray-200 px-4 py-3">
      <div className="max-w-2xl mx-auto flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            placeholder="What is your carousel about? (e.g. '5 tips for better sleep')"
            disabled={isGenerating || isOverLimit}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-violet-400 disabled:opacity-50 bg-white"
          />
          <button
            onClick={handleGenerate}
            disabled={!topic.trim() || isGenerating || isOverLimit}
            className="px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap transition-colors"
          >
            {isGenerating ? 'Generating…' : 'Generate'}
          </button>
        </div>

        {/* Usage indicator */}
        {!isOverLimit && (
          <p className="text-xs text-gray-400">
            {remaining} of 2 free generations remaining this hour
          </p>
        )}

        {/* Rate limit message */}
        {isOverLimit && (
          <p className="text-xs text-amber-600">
            Generation limit reached. Resets in 1 hour — or edit slides manually below.
          </p>
        )}

        {/* Error message */}
        {generationError && (
          <p className="text-xs text-red-500">{generationError}</p>
        )}
      </div>
    </div>
  );
}
```

**File: `src/app/utility/free-social-media-carousel-builder/_components/desktop/DesktopEditor.tsx`**

```tsx
'use client';

import React from 'react';
import { useEditorStore } from '../../_store/useEditorStore';
import { Toolbar } from './Toolbar';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';
import { SlideStrip } from './SlideStrip';
import { SlideCanvas } from '../canvas/SlideCanvas';

export function DesktopEditor() {
  const { slides, activeSlideIndex } = useEditorStore();
  const activeSlide = slides[activeSlideIndex];

  return (
    <div className="flex flex-col h-[720px] bg-white border border-gray-200 rounded-xl overflow-hidden">
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar />
        <div className="flex-1 bg-gray-100 flex items-center justify-center overflow-hidden p-6">
          <SlideCanvas
            slide={activeSlide}
            slideIndex={activeSlideIndex}
            totalSlides={slides.length}
          />
        </div>
        <RightSidebar />
      </div>
      <SlideStrip />
    </div>
  );
}
```

**File: `src/app/utility/free-social-media-carousel-builder/_components/desktop/LeftSidebar.tsx`**

```tsx
'use client';

import React from 'react';
import { CATEGORIES } from '../../_data/categories';
import { TEMPLATES } from '../../_data/templates';
import { useEditorStore } from '../../_store/useEditorStore';
import { TemplateCard } from '../shared/TemplateCard';

export function LeftSidebar() {
  const { activeCategoryId, setActiveCategory, applyTemplate } = useEditorStore();

  const filtered = activeCategoryId === 'all'
    ? TEMPLATES
    : TEMPLATES.filter(t => t.categoryId === activeCategoryId);

  return (
    <div className="w-[220px] border-r border-gray-200 flex flex-col overflow-hidden flex-shrink-0">
      <div className="px-3.5 py-3 text-sm font-medium text-gray-800 border-b border-gray-100">Templates</div>
      <div className="flex-1 overflow-y-auto">
        {/* All */}
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

**File: `src/app/utility/free-social-media-carousel-builder/_components/desktop/RightSidebar.tsx`**

```tsx
'use client';

import React from 'react';
import { PALETTES } from '../../_data/palettes';
import { FONTS } from '../../_data/fonts';
import { useEditorStore } from '../../_store/useEditorStore';
import type { LayoutId } from '../../_types';

const LAYOUT_OPTIONS: { id: LayoutId; label: string }[] = [
  { id: 'centered', label: 'Center' },
  { id: 'left', label: 'Left' },
  { id: 'split', label: 'Split' },
  { id: 'top_accent', label: 'Top' },
  { id: 'minimal', label: 'Min' },
  { id: 'bold', label: 'Bold' },
];

const QUICK_ICONS = ['🚀', '⭐', '🔥', '💡', '✅', '→', '♥', '◆'];

export function RightSidebar() {
  const { slides, activeSlideIndex, updateSlideBackground, updateSlideAccent, updateSlideFont, updateSlideLayout, addIconToSlide } = useEditorStore();
  const slide = slides[activeSlideIndex];

  return (
    <div className="w-[220px] border-l border-gray-200 overflow-y-auto flex-shrink-0">
      {/* Palette */}
      <div className="p-3.5 border-b border-gray-100">
        <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">Color Palette</div>
        <div className="flex flex-wrap gap-1.5">
          {PALETTES.map(p => (
            <button
              key={p.id}
              onClick={() => { updateSlideBackground(p.background); updateSlideAccent(p.accent); }}
              className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110
                ${slide.background === p.background ? 'border-gray-800 scale-110' : 'border-transparent'}`}
              style={{ background: p.background }}
              title={p.id}
            />
          ))}
        </div>
      </div>

      {/* Font */}
      <div className="p-3.5 border-b border-gray-100">
        <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">Font Style</div>
        <div className="flex flex-col gap-1">
          {FONTS.map(f => (
            <button
              key={f.id}
              onClick={() => updateSlideFont(f.id)}
              className={`px-2 py-1.5 text-xs text-left rounded-md border transition-colors
                ${slide.fontId === f.id ? 'bg-gray-100 border-gray-300' : 'border-gray-200 hover:bg-gray-50'}`}
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
          {LAYOUT_OPTIONS.map(l => (
            <button
              key={l.id}
              onClick={() => updateSlideLayout(l.id)}
              className={`aspect-[4/5] rounded border flex flex-col items-center justify-center gap-0.5 p-1 transition-colors
                ${slide.layout === l.id ? 'border-violet-500 bg-violet-50' : 'border-gray-200 hover:bg-gray-50'}`}
            >
              <span className="w-4/5 h-1 rounded bg-gray-300 block" />
              <span className="w-3/4 h-0.5 rounded bg-gray-200 block" />
              <span className="w-2/3 h-0.5 rounded bg-gray-200 block" />
              <span className="text-[7px] text-gray-400 mt-0.5">{l.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Elements */}
      <div className="p-3.5">
        <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">Add Element</div>
        <div className="grid grid-cols-4 gap-1">
          {QUICK_ICONS.map(icon => (
            <button
              key={icon}
              onClick={() => addIconToSlide({ content: icon, x: 50, y: 40, size: 32 })}
              className="aspect-square flex items-center justify-center text-lg border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              title={`Add ${icon}`}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

**File: `src/app/utility/free-social-media-carousel-builder/_components/desktop/Toolbar.tsx`**

```tsx
'use client';

import React from 'react';
import { useEditorStore } from '../../_store/useEditorStore';
import { useExport } from '../../_hooks/useExport';
import { TEMPLATES } from '../../_data/templates';

export function Toolbar() {
  const { slides, activeSlideIndex, addSlide, duplicateSlide } = useEditorStore();
  const { exportAllPNG, exportZIP, isExporting } = useExport();
  const activeSlide = slides[activeSlideIndex];
  const tmpl = TEMPLATES.find(t => t.id === activeSlide.templateId);

  return (
    <div className="h-12 border-b border-gray-200 flex items-center gap-2 px-4 flex-shrink-0">
      <span className="text-sm text-gray-500">{tmpl?.name ?? 'Slide'}</span>
      <span className="text-xs text-gray-400 ml-1">{activeSlideIndex + 1}/{slides.length}</span>
      <div className="flex-1" />
      <button
        onClick={() => addSlide(activeSlide.templateId)}
        className="h-7 px-3 text-xs border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
      >
        + Slide
      </button>
      <button
        onClick={() => duplicateSlide(activeSlideIndex)}
        className="h-7 px-3 text-xs border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
      >
        Duplicate
      </button>
      <button
        onClick={exportAllPNG}
        disabled={isExporting}
        className="h-7 px-3 text-xs bg-violet-600 text-white rounded-md hover:bg-violet-700 disabled:opacity-50 transition-colors"
      >
        {isExporting ? 'Exporting…' : 'Export PNG'}
      </button>
      <button
        onClick={exportZIP}
        disabled={isExporting}
        className="h-7 px-3 text-xs border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
      >
        ZIP
      </button>
    </div>
  );
}
```

**File: `src/app/utility/free-social-media-carousel-builder/_components/desktop/SlideStrip.tsx`**

```tsx
'use client';

import React from 'react';
import { useEditorStore } from '../../_store/useEditorStore';
import { SlideThumbnail } from '../shared/SlideThumbnail';

export function SlideStrip() {
  const { slides, activeSlideIndex, setActiveSlide, addSlide } = useEditorStore();

  return (
    <div className="h-[100px] border-t border-gray-200 bg-gray-50 flex items-center gap-2 px-4 overflow-x-auto flex-shrink-0">
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
        className="w-16 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-2xl text-gray-400 hover:bg-gray-100 flex-shrink-0 transition-colors"
      >
        +
      </button>
    </div>
  );
}
```

---

## 13. Mobile Layout Components

**File: `src/app/utility/free-social-media-carousel-builder/_components/mobile/MobileEditor.tsx`**

```tsx
'use client';

import React from 'react';
import { useEditorStore } from '../../_store/useEditorStore';
import { SlideCanvas } from '../canvas/SlideCanvas';
import { BottomNav } from './BottomNav';
import { BottomSheet } from './BottomSheet';
import { SlidesSheet } from './sheets/SlidesSheet';
import { TemplatesSheet } from './sheets/TemplatesSheet';
import { DesignSheet } from './sheets/DesignSheet';
import { TextSheet } from './sheets/TextSheet';
import { IconSheet } from './sheets/IconSheet';
import { ExportSheet } from './sheets/ExportSheet';
import { TEMPLATES } from '../../_data/templates';

export function MobileEditor() {
  const { slides, activeSlideIndex, activeSheet, setActiveSheet, setActiveSlide } = useEditorStore();
  const activeSlide = slides[activeSlideIndex];
  const tmpl = TEMPLATES.find(t => t.id === activeSlide.templateId);

  return (
    <div className="flex flex-col bg-[#0d1b2a] overflow-hidden relative" style={{ height: 'calc(100svh - 120px)', minHeight: 500 }}>
      {/* Top bar */}
      <div className="h-12 flex items-center justify-between px-4 border-b border-white/10 flex-shrink-0">
        <span className="text-white/60 text-sm">●</span>
        <span className="text-white text-sm font-medium">{tmpl?.name ?? 'Slide'}</span>
        <button
          onClick={() => setActiveSheet('export')}
          className="h-7 px-3 bg-violet-500 text-white text-xs rounded-full"
        >
          Export
        </button>
      </div>

      {/* Canvas area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pt-4">
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
              onClick={() => setActiveSlide(i)}
              className={`h-1.5 rounded-full transition-all ${i === activeSlideIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/30'}`}
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
            <div className="text-white text-sm font-medium mb-1">Style</div>
            <div className="text-white/50 text-xs">Colors, fonts, layout</div>
          </button>
        </div>

        {/* Element pills */}
        <div className="flex gap-2 overflow-x-auto pb-3" style={{ scrollbarWidth: 'none' }}>
          {(['+ Icon', '+ Divider', '+ CTA'] as const).map(label => (
            <button
              key={label}
              onClick={() => label === '+ Icon' ? setActiveSheet('icons') : undefined}
              className="flex-shrink-0 bg-white/5 border border-white/10 rounded-full px-3 py-2 text-xs text-white/60 whitespace-nowrap"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom nav */}
      <BottomNav />

      {/*
        CRITICAL: All sheets are ALWAYS mounted in the DOM.
        Visibility is controlled via CSS transform only (translateY).
        Never use conditional rendering or display:none here.
        This ensures TemplatesSheet stays mounted and its derived state
        (filtered templates) is always up-to-date.
      */}
      <BottomSheet height="52%" isOpen={activeSheet === 'slides'}>
        <SlidesSheet />
      </BottomSheet>
      <BottomSheet height="60%" isOpen={activeSheet === 'templates'}>
        <TemplatesSheet />
      </BottomSheet>
      <BottomSheet height="65%" isOpen={activeSheet === 'design'}>
        <DesignSheet />
      </BottomSheet>
      <BottomSheet height="70%" isOpen={activeSheet === 'text'}>
        <TextSheet />
      </BottomSheet>
      <BottomSheet height="55%" isOpen={activeSheet === 'icons'}>
        <IconSheet />
      </BottomSheet>
      <BottomSheet height="45%" isOpen={activeSheet === 'export'}>
        <ExportSheet />
      </BottomSheet>
    </div>
  );
}
```

**File: `src/app/utility/free-social-media-carousel-builder/_components/mobile/BottomSheet.tsx`**

```tsx
'use client';

import React from 'react';
import { useEditorStore } from '../../_store/useEditorStore';

interface Props {
  height: string;
  isOpen: boolean;
  children: React.ReactNode;
}

export function BottomSheet({ height, isOpen, children }: Props) {
  const { setActiveSheet } = useEditorStore();

  return (
    <>
      {/* Backdrop — only rendered when open to avoid blocking touch events */}
      {isOpen && (
        <div
          className="absolute inset-0 bg-black/30 z-10"
          onClick={() => setActiveSheet(null)}
        />
      )}
      {/* Sheet — ALWAYS in DOM, position controlled by transform only */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 rounded-t-2xl bg-[#1a2438] border-t border-white/10 overflow-y-auto transition-transform duration-300 ease-out"
        style={{
          height,
          transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
        }}
      >
        <div className="w-9 h-1 bg-white/20 rounded-full mx-auto mt-2.5 mb-3.5" />
        {children}
      </div>
    </>
  );
}
```

**File: `src/app/utility/free-social-media-carousel-builder/_components/mobile/BottomNav.tsx`**

```tsx
'use client';

import React from 'react';
import { useEditorStore } from '../../_store/useEditorStore';
import type { ActiveSheet } from '../../_types';

const TABS: { id: ActiveSheet; label: string }[] = [
  { id: 'slides',    label: 'Slides' },
  { id: 'templates', label: 'Templates' },
  { id: 'design',    label: 'Design' },
  { id: 'export',    label: 'Export' },
];

export function BottomNav() {
  const { activeSheet, setActiveSheet } = useEditorStore();

  return (
    <div className="h-[60px] border-t border-white/10 flex items-center flex-shrink-0 bg-[#0d1b2a]">
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveSheet(tab.id)}
          className="flex-1 flex flex-col items-center gap-1 py-2"
        >
          <span className={`text-[10px] font-medium transition-colors ${activeSheet === tab.id ? 'text-violet-400' : 'text-white/40'}`}>
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  );
}
```

**File: `src/app/utility/free-social-media-carousel-builder/_components/mobile/sheets/TemplatesSheet.tsx`**

```tsx
'use client';

import React from 'react';
import { CATEGORIES } from '../../../_data/categories';
import { TEMPLATES } from '../../../_data/templates';
import { useEditorStore } from '../../../_store/useEditorStore';

export function TemplatesSheet() {
  const { activeCategoryId, setActiveCategory, applyTemplate, setActiveSheet } = useEditorStore();

  // IMPORTANT: This derived value recomputes every render.
  // Because this component is always mounted (never unmounted by BottomSheet),
  // changing activeCategoryId in the store immediately triggers a re-render
  // and filtered updates correctly. No useEffect or manual re-render needed.
  const filtered = activeCategoryId === 'all'
    ? TEMPLATES
    : TEMPLATES.filter(t => t.categoryId === activeCategoryId);

  return (
    <div>
      <div className="text-xs text-white/40 px-4 pb-2">Choose template</div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto px-4 pb-3" style={{ scrollbarWidth: 'none' }}>
        <button
          onClick={() => setActiveCategory('all')}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs border transition-colors
            ${activeCategoryId === 'all'
              ? 'bg-violet-500/30 border-violet-500 text-white'
              : 'border-white/15 text-white/50'}`}
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
                : 'border-white/15 text-white/50'}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Template row */}
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

**File: `src/app/utility/free-social-media-carousel-builder/_components/mobile/sheets/DesignSheet.tsx`**

```tsx
'use client';

import React from 'react';
import { PALETTES } from '../../../_data/palettes';
import { FONTS } from '../../../_data/fonts';
import { useEditorStore } from '../../../_store/useEditorStore';
import type { LayoutId } from '../../../_types';

const LAYOUT_IDS: LayoutId[] = ['centered', 'left', 'split', 'top_accent', 'minimal', 'bold'];

export function DesignSheet() {
  const { slides, activeSlideIndex, updateSlideBackground, updateSlideAccent, updateSlideFont, updateSlideLayout } = useEditorStore();
  const slide = slides[activeSlideIndex];

  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-white/40 px-4 pb-2">Color palette</div>
      <div className="flex gap-2 overflow-x-auto px-4 pb-4" style={{ scrollbarWidth: 'none' }}>
        {PALETTES.map(p => (
          <button
            key={p.id}
            onClick={() => { updateSlideBackground(p.background); updateSlideAccent(p.accent); }}
            className={`w-8 h-8 rounded-full flex-shrink-0 border-2 transition-transform hover:scale-110
              ${slide.background === p.background ? 'border-white scale-110' : 'border-transparent'}`}
            style={{ background: p.background }}
          />
        ))}
      </div>

      <div className="text-[10px] uppercase tracking-widest text-white/40 px-4 pb-2">Font</div>
      <div className="flex gap-2 overflow-x-auto px-4 pb-4" style={{ scrollbarWidth: 'none' }}>
        {FONTS.map(f => (
          <button
            key={f.id}
            onClick={() => updateSlideFont(f.id)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs border transition-colors
              ${slide.fontId === f.id ? 'bg-violet-500/30 border-violet-500 text-white' : 'border-white/15 text-white/60'}`}
            style={{ fontFamily: f.css }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="text-[10px] uppercase tracking-widest text-white/40 px-4 pb-2">Layout</div>
      <div className="flex gap-2 overflow-x-auto px-4 pb-4" style={{ scrollbarWidth: 'none' }}>
        {LAYOUT_IDS.map(id => (
          <button
            key={id}
            onClick={() => updateSlideLayout(id)}
            className={`flex-shrink-0 w-14 h-[70px] rounded-xl border flex flex-col items-center justify-center gap-1 p-1.5 transition-colors
              ${slide.layout === id ? 'border-violet-500 bg-violet-500/20' : 'border-white/15'}`}
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

**File: `src/app/utility/free-social-media-carousel-builder/_components/mobile/sheets/TextSheet.tsx`**

```tsx
'use client';

import React from 'react';
import { useEditorStore } from '../../../_store/useEditorStore';

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
            className="w-full border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm outline-none resize-none focus:border-violet-500/60 transition-colors"
            style={{ background: 'rgba(255,255,255,0.07)' }}
          />
        </div>
      ))}
    </div>
  );
}
```

**File: `src/app/utility/free-social-media-carousel-builder/_components/mobile/sheets/SlidesSheet.tsx`**

```tsx
'use client';

import React from 'react';
import { useEditorStore } from '../../../_store/useEditorStore';
import { SlideThumbnail } from '../../shared/SlideThumbnail';

export function SlidesSheet() {
  const { slides, activeSlideIndex, setActiveSlide, setActiveSheet, addSlide } = useEditorStore();

  return (
    <div>
      <div className="flex items-center justify-between px-4 pb-3">
        <span className="text-xs text-white/50">All slides ({slides.length})</span>
        <button
          onClick={() => addSlide(slides[activeSlideIndex].templateId)}
          className="bg-violet-500/20 text-violet-300 text-xs rounded-full px-3 py-1.5"
        >
          + Add
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

**File: `src/app/utility/free-social-media-carousel-builder/_components/mobile/sheets/IconSheet.tsx`**

```tsx
'use client';

import React from 'react';
import { useEditorStore } from '../../../_store/useEditorStore';

const ICONS = [
  '🚀','⭐','🔥','💡','✅','❌','→','↗','♥','◆','▲','●',
  '🎯','📈','💰','🏆','🎉','⚡','🌟','💎','🔑','🛡','⚙️','🎨',
];

export function IconSheet() {
  const { addIconToSlide, setActiveSheet } = useEditorStore();

  return (
    <div className="px-4 pb-6">
      <div className="text-xs text-white/50 mb-3">Tap to add to slide · Double-tap placed icon to remove</div>
      <div className="grid grid-cols-6 gap-2">
        {ICONS.map(icon => (
          <button
            key={icon}
            onClick={() => {
              addIconToSlide({ content: icon, x: 50, y: 30, size: 36 });
              setActiveSheet(null);
            }}
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

**File: `src/app/utility/free-social-media-carousel-builder/_components/mobile/sheets/ExportSheet.tsx`**

```tsx
'use client';

import React from 'react';
import { useExport } from '../../../_hooks/useExport';

export function ExportSheet() {
  const { exportAllPNG, exportZIP, isExporting } = useExport();

  return (
    <div className="px-4 pb-6 grid grid-cols-2 gap-3">
      <button
        onClick={exportAllPNG}
        disabled={isExporting}
        className="border border-white/10 rounded-2xl p-4 text-left disabled:opacity-50 transition-colors hover:bg-white/5"
        style={{ background: 'rgba(255,255,255,0.06)' }}
      >
        <div className="text-white font-medium text-sm mb-1">PNG files</div>
        <div className="text-white/40 text-xs">One per slide</div>
      </button>
      <button
        onClick={exportZIP}
        disabled={isExporting}
        className="border border-white/10 rounded-2xl p-4 text-left disabled:opacity-50 transition-colors hover:bg-white/5"
        style={{ background: 'rgba(255,255,255,0.06)' }}
      >
        <div className="text-white font-medium text-sm mb-1">ZIP archive</div>
        <div className="text-white/40 text-xs">All slides zipped</div>
      </button>
      <div className="col-span-2 text-center text-xs text-white/30 mt-1">
        {isExporting ? 'Preparing export…' : 'Exports at 1080×1350px (Instagram portrait)'}
      </div>
    </div>
  );
}
```

---

## 14. Canvas & Rendering Components

**File: `src/app/utility/free-social-media-carousel-builder/_components/canvas/SlideCanvas.tsx`**

```tsx
'use client';

import React from 'react';
import type { Slide } from '../../_types';
import { FONTS } from '../../_data/fonts';
import { EditableText } from './EditableText';
import { IconElement } from './IconElement';
import { useEditorStore } from '../../_store/useEditorStore';

interface Props {
  slide: Slide;
  slideIndex: number;
  totalSlides: number;
  fillContainer?: boolean;
  readOnly?: boolean;
  id?: string;
}

export function SlideCanvas({ slide, slideIndex, totalSlides, fillContainer, readOnly, id }: Props) {
  const font = FONTS.find(f => f.id === slide.fontId) ?? FONTS[0];
  const textColor = slide.darkText ? '#1a1a2e' : '#ffffff';
  const subColor  = slide.darkText ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.65)';

  const containerStyle: React.CSSProperties = fillContainer
    ? { width: '100%', height: '100%' }
    : { width: 340, height: 425, flexShrink: 0 };

  return (
    <div
      id={id}
      style={{ ...containerStyle, background: slide.background, borderRadius: 16, overflow: 'hidden', position: 'relative', fontFamily: font.css }}
    >
      {slide.layout === 'centered'   && <CenteredLayout   slide={slide} textColor={textColor} subColor={subColor} readOnly={readOnly} />}
      {slide.layout === 'left'       && <LeftLayout       slide={slide} textColor={textColor} subColor={subColor} readOnly={readOnly} />}
      {slide.layout === 'top_accent' && <TopAccentLayout  slide={slide} textColor={textColor} subColor={subColor} readOnly={readOnly} />}
      {slide.layout === 'split'      && <SplitLayout      slide={slide} textColor={textColor} subColor={subColor} readOnly={readOnly} />}
      {slide.layout === 'minimal'    && <MinimalLayout    slide={slide} textColor={textColor} subColor={subColor} readOnly={readOnly} />}
      {slide.layout === 'bold'       && <BoldLayout       slide={slide} textColor={textColor} subColor={subColor} readOnly={readOnly} />}

      {slide.icons.map(icon => (
        <IconElement key={icon.id} icon={icon} readOnly={readOnly} />
      ))}

      <div style={{ position: 'absolute', bottom: 12, right: 14, fontSize: 11, color: slide.darkText ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)' }}>
        {slideIndex + 1} / {totalSlides}
      </div>
    </div>
  );
}

// ─── Layout sub-components ────────────────────────────────────────────────────

interface LayoutProps { slide: Slide; textColor: string; subColor: string; readOnly?: boolean; }

function Tag({ slide }: { slide: Slide }) {
  const onWhite = slide.accentColor === '#ffffff' || slide.accentColor.toLowerCase() === '#fff';
  return (
    <div style={{ display: 'inline-block', background: slide.accentColor, color: onWhite ? '#333' : '#fff', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', padding: '3px 12px', borderRadius: 20, marginBottom: 12 }}>
      {slide.tagText || 'SLIDE'}
    </div>
  );
}

function useTextUpdate(readOnly?: boolean) {
  const store = useEditorStore();
  if (readOnly) return { update: (_: string, __: string) => {} };
  return { update: (field: 'headline' | 'subtitle' | 'body', val: string) => store.updateSlideText(field, val) };
}

function CenteredLayout({ slide, textColor, subColor, readOnly }: LayoutProps) {
  const { update } = useTextUpdate(readOnly);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 32, textAlign: 'center' }}>
      <Tag slide={slide} />
      <EditableText value={slide.headline} style={{ fontSize: 22, fontWeight: 700, color: textColor, lineHeight: 1.2, marginBottom: 8 }} readOnly={readOnly} onCommit={v => update('headline', v)} />
      {slide.subtitle && <EditableText value={slide.subtitle} style={{ fontSize: 13, color: subColor, marginBottom: 10 }} readOnly={readOnly} onCommit={v => update('subtitle', v)} />}
      {slide.body && <EditableText value={slide.body} multiline style={{ fontSize: 12, color: subColor, lineHeight: 1.6, whiteSpace: 'pre-line' }} readOnly={readOnly} onCommit={v => update('body', v)} />}
    </div>
  );
}

function LeftLayout({ slide, textColor, subColor, readOnly }: LayoutProps) {
  const { update } = useTextUpdate(readOnly);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '32px 28px' }}>
      <Tag slide={slide} />
      <div style={{ width: 40, height: 3, borderRadius: 2, background: slide.accentColor, marginBottom: 12 }} />
      <EditableText value={slide.headline} style={{ fontSize: 20, fontWeight: 700, color: textColor, lineHeight: 1.2, marginBottom: 8 }} readOnly={readOnly} onCommit={v => update('headline', v)} />
      {slide.subtitle && <EditableText value={slide.subtitle} style={{ fontSize: 13, color: subColor, marginBottom: 10 }} readOnly={readOnly} onCommit={v => update('subtitle', v)} />}
      {slide.body && <EditableText value={slide.body} multiline style={{ fontSize: 12, color: subColor, lineHeight: 1.6, whiteSpace: 'pre-line' }} readOnly={readOnly} onCommit={v => update('body', v)} />}
    </div>
  );
}

function TopAccentLayout({ slide, textColor, subColor, readOnly }: LayoutProps) {
  const { update } = useTextUpdate(readOnly);
  return (
    <div style={{ height: '100%' }}>
      <div style={{ height: 6, background: slide.accentColor }} />
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: 'calc(100% - 6px)', padding: 28 }}>
        <Tag slide={slide} />
        <EditableText value={slide.headline} style={{ fontSize: 20, fontWeight: 700, color: textColor, lineHeight: 1.2, marginBottom: 8 }} readOnly={readOnly} onCommit={v => update('headline', v)} />
        {slide.subtitle && <EditableText value={slide.subtitle} style={{ fontSize: 13, color: subColor, marginBottom: 10 }} readOnly={readOnly} onCommit={v => update('subtitle', v)} />}
        {slide.body && <EditableText value={slide.body} multiline style={{ fontSize: 12, color: subColor, lineHeight: 1.6 }} readOnly={readOnly} onCommit={v => update('body', v)} />}
      </div>
    </div>
  );
}

function SplitLayout({ slide, textColor, subColor, readOnly }: LayoutProps) {
  const { update } = useTextUpdate(readOnly);
  const parts = slide.body.split('\n');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 28, gap: 12, textAlign: 'center' }}>
      <Tag slide={slide} />
      <EditableText value={slide.headline} style={{ fontSize: 20, fontWeight: 700, color: textColor, lineHeight: 1.2 }} readOnly={readOnly} onCommit={v => update('headline', v)} />
      {slide.subtitle && <EditableText value={slide.subtitle} style={{ fontSize: 13, color: subColor }} readOnly={readOnly} onCommit={v => update('subtitle', v)} />}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, width: '100%', marginTop: 8 }}>
        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: 14, fontSize: 12, color: subColor, lineHeight: 1.5 }}>{parts[0] ?? ''}</div>
        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: 14, fontSize: 12, color: subColor, lineHeight: 1.5 }}>{parts[1] ?? ''}</div>
      </div>
    </div>
  );
}

function MinimalLayout({ slide, textColor, subColor, readOnly }: LayoutProps) {
  const { update } = useTextUpdate(readOnly);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%', padding: '28px 32px' }}>
      <div style={{ width: 32, height: 2, borderRadius: 1, background: slide.accentColor, marginBottom: 16 }} />
      <EditableText value={slide.headline} style={{ fontSize: 24, fontWeight: 700, color: textColor, lineHeight: 1.2, marginBottom: 8 }} readOnly={readOnly} onCommit={v => update('headline', v)} />
      {slide.subtitle && <EditableText value={slide.subtitle} style={{ fontSize: 13, color: subColor }} readOnly={readOnly} onCommit={v => update('subtitle', v)} />}
    </div>
  );
}

function BoldLayout({ slide, textColor, subColor, readOnly }: LayoutProps) {
  const { update } = useTextUpdate(readOnly);
  return (
    <div style={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '55%', background: slide.accentColor, opacity: 0.15 }} />
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '32px 28px', position: 'relative' }}>
        <Tag slide={slide} />
        <EditableText value={slide.headline} style={{ fontSize: 26, fontWeight: 800, color: textColor, lineHeight: 1.1, marginBottom: 10 }} readOnly={readOnly} onCommit={v => update('headline', v)} />
        {slide.subtitle && <EditableText value={slide.subtitle} style={{ fontSize: 14, color: subColor, marginBottom: 10 }} readOnly={readOnly} onCommit={v => update('subtitle', v)} />}
        {slide.body && <EditableText value={slide.body} multiline style={{ fontSize: 12, color: subColor, lineHeight: 1.6 }} readOnly={readOnly} onCommit={v => update('body', v)} />}
      </div>
    </div>
  );
}
```

**File: `src/app/utility/free-social-media-carousel-builder/_components/canvas/EditableText.tsx`**

```tsx
'use client';

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

  useEffect(() => { if (!editing) setDraft(value); }, [value, editing]);
  useEffect(() => { if (editing && ref.current) ref.current.focus(); }, [editing]);

  const commit = () => { setEditing(false); onCommit?.(draft); };

  if (readOnly) return <div style={style}>{value}</div>;

  if (editing) {
    const shared = {
      ref: ref as React.Ref<any>,
      value: draft,
      onChange: (e: React.ChangeEvent<any>) => setDraft(e.target.value),
      onBlur: commit,
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') { setDraft(value); setEditing(false); }
        if (!multiline && e.key === 'Enter') commit();
      },
      style: { ...style, background: 'rgba(255,255,255,0.12)', border: '2px solid rgba(255,255,255,0.6)', borderRadius: 4, outline: 'none', resize: 'none' as const, padding: '2px 6px', width: '100%', fontFamily: 'inherit' },
    };
    return multiline ? <textarea {...shared} rows={3} /> : <input {...shared} type="text" />;
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

**File: `src/app/utility/free-social-media-carousel-builder/_components/canvas/IconElement.tsx`**

```tsx
'use client';

import React, { useRef } from 'react';
import type { IconOverlay } from '../../_types';
import { useEditorStore } from '../../_store/useEditorStore';

interface Props { icon: IconOverlay; readOnly?: boolean; }

export function IconElement({ icon, readOnly }: Props) {
  const { updateIconPosition, removeIconFromSlide } = useEditorStore();
  const dragging = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (readOnly) return;
    e.preventDefault();
    dragging.current = true;
    const canvas = (e.currentTarget as HTMLElement).parentElement!;
    const rect = canvas.getBoundingClientRect();

    const onMove = (ev: MouseEvent) => {
      const x = Math.max(0, Math.min(95, ((ev.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(95, ((ev.clientY - rect.top) / rect.height) * 100));
      updateIconPosition(icon.id, x, y);
    };
    const onUp = () => { dragging.current = false; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  return (
    <div
      style={{ position: 'absolute', left: `${icon.x}%`, top: `${icon.y}%`, fontSize: icon.size, cursor: readOnly ? 'default' : 'move', userSelect: 'none', lineHeight: 1 }}
      onMouseDown={handleMouseDown}
      onDoubleClick={() => !readOnly && removeIconFromSlide(icon.id)}
      title={readOnly ? undefined : 'Drag · Double-click to remove'}
    >
      {icon.content}
    </div>
  );
}
```

**File: `src/app/utility/free-social-media-carousel-builder/_components/shared/TemplateCard.tsx`**

```tsx
'use client';

import React from 'react';
import type { SlideTemplate } from '../../_types';

interface Props { template: SlideTemplate; onClick: () => void; isSelected?: boolean; }

export function TemplateCard({ template, onClick, isSelected }: Props) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg overflow-hidden cursor-pointer border-2 transition-all hover:scale-105 aspect-[4/5] relative w-full
        ${isSelected ? 'border-violet-500' : 'border-transparent'}`}
    >
      <div className="w-full h-full flex flex-col justify-center items-center gap-1 p-2" style={{ background: template.background }}>
        <div className="w-8 h-0.5 rounded-full" style={{ background: template.accentColor }} />
        <div className="text-[8px] font-bold text-white text-center leading-tight line-clamp-2">{template.defaultHeadline}</div>
        {template.defaultSubtitle && <div className="text-[7px] text-white/55 text-center">{template.defaultSubtitle}</div>}
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[9px] py-1 px-1.5 truncate">{template.name}</div>
    </button>
  );
}
```

**File: `src/app/utility/free-social-media-carousel-builder/_components/shared/SlideThumbnail.tsx`**

```tsx
'use client';

import React from 'react';
import type { Slide } from '../../_types';
import { FONTS } from '../../_data/fonts';

interface Props { slide: Slide; isActive: boolean; onClick: () => void; }

export function SlideThumbnail({ slide, isActive, onClick }: Props) {
  const font = FONTS.find(f => f.id === slide.fontId);
  return (
    <button
      onClick={onClick}
      className={`w-16 h-20 rounded-lg overflow-hidden border-2 transition-colors flex-shrink-0 ${isActive ? 'border-violet-500' : 'border-transparent'}`}
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

## 15. Export System

**File: `src/app/utility/free-social-media-carousel-builder/_hooks/useExport.ts`**

```typescript
'use client';

import { useState, useCallback } from 'react';
import { useEditorStore } from '../_store/useEditorStore';
import type { Slide } from '../_types';
import { FONTS } from '../_data/fonts';

const EXPORT_WIDTH = 1080;
const EXPORT_HEIGHT = 1350;

// Renders one slide to an off-screen element and captures it as a data URL
async function captureSlide(slide: Slide, index: number, total: number): Promise<string> {
  // Wait for fonts to be fully loaded before capturing
  await document.fonts.ready;

  // Lazy-import html-to-image only when needed (not in SSR)
  const { toPng } = await import('html-to-image');

  const font = FONTS.find(f => f.id === slide.fontId) ?? FONTS[0];
  const textColor = slide.darkText ? '#1a1a2e' : '#ffffff';
  const subColor  = slide.darkText ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.65)';

  // Build a temporary DOM node at full export resolution
  const el = document.createElement('div');
  el.style.cssText = `
    position: fixed;
    left: -${EXPORT_WIDTH + 100}px;
    top: 0;
    width: ${EXPORT_WIDTH}px;
    height: ${EXPORT_HEIGHT}px;
    overflow: hidden;
    border-radius: 0;
    font-family: ${font.css};
    background: ${slide.background};
  `;

  // Build the slide HTML for export — mirrors SlideCanvas layout logic
  // Using innerHTML for simplicity at export resolution (no React hydration needed)
  const tagBg = slide.accentColor;
  const tagColor = (tagBg === '#ffffff' || tagBg.toLowerCase() === '#fff') ? '#333333' : '#ffffff';

  const baseTag = `<div style="display:inline-block;background:${tagBg};color:${tagColor};font-size:18px;font-weight:600;letter-spacing:0.1em;padding:6px 24px;border-radius:40px;margin-bottom:24px;">${slide.tagText || 'SLIDE'}</div>`;
  const headlineStyle = `font-size:44px;font-weight:700;color:${textColor};line-height:1.2;margin-bottom:16px;`;
  const subtitleStyle = `font-size:26px;color:${subColor};margin-bottom:20px;`;
  const bodyStyle = `font-size:24px;color:${subColor};line-height:1.6;white-space:pre-line;`;
  const slideNum = `<div style="position:absolute;bottom:24px;right:28px;font-size:22px;color:${slide.darkText ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)'};">${index + 1} / ${total}</div>`;

  let inner = '';
  if (slide.layout === 'centered') {
    inner = `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;padding:64px;text-align:center;">${baseTag}<div style="${headlineStyle}">${slide.headline}</div>${slide.subtitle ? `<div style="${subtitleStyle}">${slide.subtitle}</div>` : ''}${slide.body ? `<div style="${bodyStyle}">${slide.body}</div>` : ''}</div>`;
  } else if (slide.layout === 'left') {
    inner = `<div style="display:flex;flex-direction:column;justify-content:center;height:100%;padding:64px 56px;">${baseTag}<div style="width:80px;height:6px;border-radius:4px;background:${slide.accentColor};margin-bottom:24px;"></div><div style="${headlineStyle}">${slide.headline}</div>${slide.subtitle ? `<div style="${subtitleStyle}">${slide.subtitle}</div>` : ''}${slide.body ? `<div style="${bodyStyle}">${slide.body}</div>` : ''}</div>`;
  } else if (slide.layout === 'top_accent') {
    inner = `<div style="height:100%;"><div style="height:12px;background:${slide.accentColor};"></div><div style="display:flex;flex-direction:column;justify-content:center;height:calc(100% - 12px);padding:56px;">${baseTag}<div style="${headlineStyle}">${slide.headline}</div>${slide.subtitle ? `<div style="${subtitleStyle}">${slide.subtitle}</div>` : ''}${slide.body ? `<div style="${bodyStyle}">${slide.body}</div>` : ''}</div></div>`;
  } else if (slide.layout === 'split') {
    const parts = slide.body.split('\n');
    inner = `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;padding:56px;gap:24px;text-align:center;">${baseTag}<div style="${headlineStyle}">${slide.headline}</div>${slide.subtitle ? `<div style="${subtitleStyle}">${slide.subtitle}</div>` : ''}<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;width:100%;margin-top:16px;"><div style="background:rgba(255,255,255,0.08);border-radius:20px;padding:28px;font-size:24px;color:${subColor};line-height:1.5;">${parts[0] ?? ''}</div><div style="background:rgba(255,255,255,0.08);border-radius:20px;padding:28px;font-size:24px;color:${subColor};line-height:1.5;">${parts[1] ?? ''}</div></div></div>`;
  } else if (slide.layout === 'minimal') {
    inner = `<div style="display:flex;flex-direction:column;justify-content:flex-end;height:100%;padding:56px 64px;"><div style="width:64px;height:4px;border-radius:2px;background:${slide.accentColor};margin-bottom:32px;"></div><div style="font-size:48px;font-weight:700;color:${textColor};line-height:1.2;margin-bottom:16px;">${slide.headline}</div>${slide.subtitle ? `<div style="${subtitleStyle}">${slide.subtitle}</div>` : ''}</div>`;
  } else { // bold
    inner = `<div style="height:100%;position:relative;overflow:hidden;"><div style="position:absolute;top:0;left:0;right:0;height:55%;background:${slide.accentColor};opacity:0.15;"></div><div style="display:flex;flex-direction:column;justify-content:center;height:100%;padding:64px 56px;position:relative;">${baseTag}<div style="font-size:52px;font-weight:800;color:${textColor};line-height:1.1;margin-bottom:20px;">${slide.headline}</div>${slide.subtitle ? `<div style="${subtitleStyle}">${slide.subtitle}</div>` : ''}${slide.body ? `<div style="${bodyStyle}">${slide.body}</div>` : ''}</div></div>`;
  }

  el.innerHTML = inner + slideNum;

  // Add icon overlays
  slide.icons.forEach(icon => {
    const iconEl = document.createElement('div');
    iconEl.style.cssText = `position:absolute;left:${icon.x}%;top:${icon.y}%;font-size:${icon.size * 2}px;line-height:1;`;
    iconEl.textContent = icon.content;
    el.appendChild(iconEl);
  });

  document.body.appendChild(el);

  try {
    const dataUrl = await toPng(el, {
      width: EXPORT_WIDTH,
      height: EXPORT_HEIGHT,
      pixelRatio: 1,
    });
    return dataUrl;
  } finally {
    document.body.removeChild(el);
  }
}

function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement('a');
  a.download = filename;
  a.href = dataUrl;
  a.click();
}

export function useExport() {
  const [isExporting, setIsExporting] = useState(false);
  const { slides } = useEditorStore();

  const exportAllPNG = useCallback(async () => {
    setIsExporting(true);
    try {
      for (let i = 0; i < slides.length; i++) {
        const dataUrl = await captureSlide(slides[i], i, slides.length);
        downloadDataUrl(dataUrl, `carousel-slide-${i + 1}.png`);
        await new Promise(r => setTimeout(r, 150)); // Small delay between downloads
      }
    } finally {
      setIsExporting(false);
    }
  }, [slides]);

  const exportZIP = useCallback(async () => {
    setIsExporting(true);
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      for (let i = 0; i < slides.length; i++) {
        const dataUrl = await captureSlide(slides[i], i, slides.length);
        const base64 = dataUrl.replace('data:image/png;base64,', '');
        zip.file(`carousel-slide-${i + 1}.png`, base64, { base64: true });
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      downloadDataUrl(url, 'carousel.zip');
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  }, [slides]);

  return { exportAllPNG, exportZIP, isExporting };
}
```

---

## 16. Auto-Save & localStorage

**File: `src/app/utility/free-social-media-carousel-builder/_hooks/useAutoSave.ts`**

```typescript
'use client';

import { useEffect } from 'react';
import { useEditorStore } from '../_store/useEditorStore';

export function useAutoSave(intervalMs = 3000) {
  const { slides, saveToStorage } = useEditorStore();

  // Save every N ms when slides change
  useEffect(() => {
    const timer = setTimeout(() => {
      saveToStorage();
    }, intervalMs);
    return () => clearTimeout(timer);
  }, [slides, saveToStorage, intervalMs]);

  // Also save on page unload
  useEffect(() => {
    const handler = () => saveToStorage();
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [saveToStorage]);
}
```

**File: `src/app/utility/free-social-media-carousel-builder/_hooks/useIsMobile.ts`**

```typescript
'use client';

import { useState, useEffect } from 'react';

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Set initial value after mount (avoids SSR mismatch)
    setIsMobile(window.innerWidth < 768);
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return isMobile;
}
```

**Note:** `useIsMobile` intentionally starts as `false` (desktop) to match the server-rendered HTML, then updates after mount. This prevents Next.js hydration mismatch errors.

---

## 17. SEO Content Component

**File: `src/app/utility/free-social-media-carousel-builder/_components/shared/SEOContent.tsx`**

```tsx
import React from 'react';
import type { NicheConfig } from '../../_types';

// This is a Server Component (no 'use client') — rendered at build time for SEO
interface Props { niche: NicheConfig; }

export function SEOContent({ niche }: Props) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">{niche.seoContent.h1}</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">{niche.seoContent.intro}</p>
        <a
          href="#carousel-tool"
          className="inline-block bg-violet-600 hover:bg-violet-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
        >
          Create Your Carousel Free →
        </a>
      </div>

      {/* Benefits */}
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {niche.seoContent.benefits.map((benefit, i) => (
          <div key={benefit} className="text-center p-4">
            <div className="w-12 h-12 bg-violet-100 rounded-full mx-auto mb-3 flex items-center justify-center">
              <span className="text-xl font-bold text-violet-600">{i + 1}</span>
            </div>
            <p className="font-medium text-gray-800">{benefit}</p>
          </div>
        ))}
      </div>

      {/* Examples */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
          {niche.seoContent.h1.split(' ').slice(0, 3).join(' ')} Examples
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {niche.seoContent.examples.map((example) => (
            <div key={example} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="h-24 bg-gradient-to-br from-violet-100 to-blue-100 rounded mb-3 flex items-center justify-center">
                <span className="text-sm text-gray-500 font-medium">Preview</span>
              </div>
              <p className="font-medium text-gray-800 text-sm">{example}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {niche.seoContent.faqs.map((faq, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
              <p className="text-gray-600 text-sm">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA to tool */}
      <div className="text-center bg-gray-50 rounded-xl p-8 mb-8">
        <h2 className="text-xl font-bold mb-3 text-gray-900">Ready to create your carousel?</h2>
        <p className="text-gray-600 mb-5 text-sm">Free, no sign-up needed. Get your first carousel in under 30 seconds.</p>
        <a
          href="#carousel-tool"
          className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Start Building Free
        </a>
      </div>
    </div>
  );
}
```

---

## 18. Known Bugs & Mandatory Fixes

The agent must implement ALL of the following fixes. Do not skip any.

### Bug 1 — Templates sheet renders empty on first open

**Root cause:** The sheet content needs to re-render when `activeCategoryId` changes. In previous vanilla JS implementations, render functions were called manually from `init()`. In this React + Zustand implementation the fix is architectural.

**Fix:** `BottomSheet` must NEVER unmount its children. Use CSS transform only:

```tsx
// CORRECT — always mounted, never removed from DOM
<div style={{ transform: isOpen ? 'translateY(0)' : 'translateY(100%)' }}>
  {children}
</div>

// WRONG — unmounts on close, React loses state, template list goes blank
{isOpen && <div>{children}</div>}
```

`TemplatesSheet` derives `filtered` as a computed value in the render body — it re-computes automatically whenever `activeCategoryId` changes in Zustand, with no extra useEffect needed.

### Bug 2 — Category filter chips don't filter templates

**Root cause:** `setActiveCategory` updates state but filtered list doesn't update.

**Fix:** Already solved by the pattern above. `filtered` is derived inside the component:

```typescript
const filtered = activeCategoryId === 'all'
  ? TEMPLATES
  : TEMPLATES.filter(t => t.categoryId === activeCategoryId);
```

This re-runs every render. Zustand triggers re-render on `activeCategoryId` change. No `useEffect` or manual refresh needed. Ensure `activeCategoryId` is selected from the store with `useEditorStore()` — do not destructure it from a captured closure.

### Bug 3 — Bottom nav tab highlights don't update

**Root cause:** `setActiveSheet` doesn't toggle — clicking same tab twice leaves it active.

**Fix:** The store's `setActiveSheet` action toggles:

```typescript
setActiveSheet: (sheet) =>
  set((state) => ({ activeSheet: state.activeSheet === sheet ? null : sheet })),
```

`BottomNav` reads `activeSheet` from the store and applies `text-violet-400` to the matching tab.

### Bug 4 — Mobile text editing loses focus on iOS

**Root cause:** `contenteditable` elements inside CSS `transform` containers don't receive keyboard focus on iOS Safari.

**Fix:** Use `<textarea>` and `<input>` for all text editing. The `EditableText` component uses these native elements. On mobile, all text editing goes through `TextSheet` (a bottom sheet with textareas), not direct canvas click-to-edit. Desktop canvas click-to-edit uses `<input>`/`<textarea>` inside the canvas.

### Bug 5 — Export produces blank white images

**Root cause:** `html-to-image` runs before custom fonts are loaded.

**Fix:** Add `await document.fonts.ready;` before calling `toPng()`. Already included in `useExport.ts` above.

### Bug 6 — Deleting the last slide crashes the editor

**Fix:** `deleteSlide` in the store returns early when only one slide remains:

```typescript
deleteSlide: (index) =>
  set((state) => {
    if (state.slides.length === 1) return state;
    // ... rest of delete logic
  }),
```

### Bug 7 — Applying a template overwrites user-edited text

**Fix:** `applyTemplate` compares current text against the previous template's defaults before overwriting. If the user has edited the text (it no longer matches the default), it is preserved:

```typescript
headline: current.headline === prevTmpl?.defaultHeadline ? tmpl.defaultHeadline : current.headline,
```

### Bug 8 — SSR hydration mismatch on mobile/desktop detection

**Root cause:** `useIsMobile` reads `window.innerWidth` which doesn't exist during SSR.

**Fix:** `useIsMobile` initializes to `false` (desktop), then updates after mount via `useEffect`. This means the desktop layout renders on the server, and if the user is on mobile, a quick swap happens after hydration. This is correct — it avoids hydration errors.

### Bug 9 — Next.js 16 `params` must be awaited

**Root cause:** In Next.js 15+, `params` in `page.tsx` is a `Promise<{...}>`, not a plain object.

**Fix:** In `[niche]/page.tsx`:

```typescript
// CORRECT
export default async function NicheCarouselPage({ params }: { params: Promise<{ niche: string }> }) {
  const { niche } = await params;
  ...
}

// WRONG (Next.js 14 style — breaks in 16)
export default function NicheCarouselPage({ params }: { params: { niche: string } }) {
  const { niche } = params; // TypeError in Next.js 15+
  ...
}
```

### Bug 10 — `'use client'` missing on hook files

All hooks that use `useState`, `useEffect`, or browser APIs must have `'use client'` at the top. The affected files in this spec are: `useIsMobile.ts`, `useExport.ts`, `useAutoSave.ts`, `useEditorStore.ts`. All are already marked with `'use client'` in this spec. Verify they are present when implementing.

---

## 19. Fonts & Global CSS

Fonts are loaded via Next.js `next/font/google` in the project's root layout (`src/app/layout.tsx`). Add the carousel fonts to the existing layout — do not add a `<link>` tag in `<head>`.

**Add to `src/app/layout.tsx`** (merge with existing font imports):

```typescript
import { Syne, DM_Sans, DM_Serif_Display, Space_Mono } from 'next/font/google';

const syne = Syne({ subsets: ['latin'], weight: ['400', '700', '800'], variable: '--font-syne' });
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-dm-sans' });
const dmSerif = DM_Serif_Display({ subsets: ['latin'], weight: ['400'], variable: '--font-dm-serif' });
const spaceMono = Space_Mono({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-space-mono' });

// Add these variables to the <html> or <body> className:
// className={`${syne.variable} ${dmSans.variable} ${dmSerif.variable} ${spaceMono.variable}`}
```

Then in `_data/fonts.ts`, reference these CSS variables:

```typescript
export const FONTS: FontOption[] = [
  { id: 'syne',       label: 'Modern (Syne)',     css: "var(--font-syne), sans-serif" },
  { id: 'dm_sans',    label: 'Clean (DM Sans)',   css: "var(--font-dm-sans), sans-serif" },
  { id: 'dm_serif',   label: 'Editorial (Serif)', css: "var(--font-dm-serif), serif" },
  { id: 'space_mono', label: 'Mono (Code)',        css: "var(--font-space-mono), monospace" },
];
```

---

## 20. next.config.ts Changes

The existing `next.config.ts` likely looks like:

```typescript
import type { NextConfig } from 'next';
const nextConfig: NextConfig = {};
export default nextConfig;
```

No changes are required for the carousel builder. Do NOT add `next-pwa` (deferred to v2).

---

## 21. Implementation Checklist

Run through this in order. Check off each item before moving to the next.

**Step 1 — Install packages**
```bash
npm install zustand html-to-image jszip
```

**Step 2 — Add fonts to root layout**
Add Syne, DM Sans, DM Serif Display, Space Mono via `next/font/google` in `src/app/layout.tsx`.

**Step 3 — Create types**
Create `src/app/utility/free-social-media-carousel-builder/_types/index.ts`

**Step 4 — Create data files** (in this order)
- `_data/categories.ts`
- `_data/templates.ts`
- `_data/fonts.ts`
- `_data/palettes.ts`
- `_data/niches.ts`

**Step 5 — Create store**
`_store/useEditorStore.ts`

**Step 6 — Create hooks**
- `_hooks/useIsMobile.ts`
- `_hooks/useExport.ts`
- `_hooks/useAutoSave.ts`

**Step 7 — Create canvas components**
- `_components/canvas/EditableText.tsx`
- `_components/canvas/IconElement.tsx`
- `_components/canvas/SlideCanvas.tsx`

**Step 8 — Create shared components**
- `_components/shared/TemplateCard.tsx`
- `_components/shared/SlideThumbnail.tsx`
- `_components/shared/SEOContent.tsx`

**Step 9 — Create desktop components**
- `_components/desktop/Toolbar.tsx`
- `_components/desktop/LeftSidebar.tsx`
- `_components/desktop/RightSidebar.tsx`
- `_components/desktop/SlideStrip.tsx`
- `_components/desktop/DesktopEditor.tsx`

**Step 10 — Create mobile sheet components**
- `_components/mobile/sheets/SlidesSheet.tsx`
- `_components/mobile/sheets/TemplatesSheet.tsx`
- `_components/mobile/sheets/DesignSheet.tsx`
- `_components/mobile/sheets/TextSheet.tsx`
- `_components/mobile/sheets/IconSheet.tsx`
- `_components/mobile/sheets/ExportSheet.tsx`

**Step 11 — Create mobile shell components**
- `_components/mobile/BottomSheet.tsx`
- `_components/mobile/BottomNav.tsx`
- `_components/mobile/MobileEditor.tsx`

**Step 12 — Create client root and AI input**
- `_components/AIInput.tsx`
- `_components/CarouselBuilderClient.tsx`

**Step 13 — Create API route**
`api/carousel-generate/route.ts`

**Step 14 — Create pages**
- `page.tsx` (main page)
- `[niche]/page.tsx` (niche SEO pages)

**Step 15 — Verify**
- Run `npm run dev`
- Navigate to `/utility/free-social-media-carousel-builder`
- Test: click a template category → templates filter correctly
- Test: click Templates tab on mobile → sheet opens with correct content
- Test: type a topic → click Generate → slides populate
- Test: Export PNG → file downloads
- Test: refresh page → previous slides restore from localStorage
- Navigate to `/utility/free-social-media-carousel-builder/instagram-carousel-maker` → SEO page loads with correct title

---

## Appendix: SEO Target URLs and Keywords

These are the 10 niche pages generated by `generateStaticParams`:

| URL | Target Keyword | Est. Monthly Searches |
|-----|---------------|----------------------|
| `/instagram-carousel-maker` | instagram carousel maker | 5,000 |
| `/linkedin-carousel-generator` | linkedin carousel generator | 2,000 |
| `/real-estate-carousel-templates` | real estate carousel templates | 1,500 |
| `/fitness-carousel-maker` | fitness carousel maker | 800 |
| `/business-carousel-templates` | business carousel templates | 1,200 |
| `/marketing-carousel-creator` | marketing carousel creator | 900 |
| `/personal-brand-carousel-maker` | personal brand carousel maker | 600 |
| `/education-carousel-templates` | education carousel templates | 700 |
| `/ecommerce-carousel-generator` | ecommerce carousel generator | 800 |
| `/nonprofit-carousel-maker` | nonprofit carousel maker | 400 |

**Total target:** ~14,000 searches/month across niche pages + ~5,000 on the main page = **~19,000 targeted monthly visitors** at realistic ranking position 3–5.

---

*End of spec. All code, types, data, API routes, state, components, hooks, and known bugs are fully documented above. Read AGENTS.md before writing any Next.js code.*