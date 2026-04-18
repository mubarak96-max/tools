# Carousel Template System — Complete Technical Guide

A full implementation guide for building a dynamic, data-driven carousel template system in Next.js — the same architecture used by tools like aiCarousels.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [The Core Concept: Templates as Data](#2-the-core-concept-templates-as-data)
3. [File Structure](#3-file-structure)
4. [Template Config Schema](#4-template-config-schema)
5. [The 10 Templates](#5-the-10-templates)
6. [Background Effects (SVG)](#6-background-effects-svg)
7. [The Slide Renderer](#7-the-slide-renderer)
8. [The AccentTitle Component](#8-the-accenttitle-component)
9. [The Template Switcher UI](#9-the-template-switcher-ui)
10. [The Preview Strip](#10-the-preview-strip)
11. [Export to Image (html2canvas)](#11-export-to-image-html2canvas)
12. [Putting It All Together](#12-putting-it-all-together)
13. [Adding New Templates](#13-adding-new-templates)

---

## 1. Architecture Overview

### The Problem with Static Templates

Static templates (hardcoded HTML/CSS files) have three fatal flaws:

```
❌ Static approach
template-dark.html     ← changing colors = editing HTML
template-light.html    ← 10 templates = 10 files to maintain
template-bold.html     ← no user customization possible
```

Every design change means hunting through multiple files. User customization is impossible. Scaling to 50+ templates becomes unmanageable.

### The Solution: Config-Driven Rendering

```
✅ Dynamic approach

templateConfig.js         ← templates are just JSON objects
      ↓
SlideRenderer.jsx         ← one component reads any config
      ↓
Styled HTML/CSS output    ← infinite visual variations
      ↓
html2canvas export        ← screenshot each slide to PNG
```

A "template" is just a JavaScript object that describes how slides should look. The renderer is a single React component that interprets that object. Switching templates = swapping one object for another.

### Data Flow

```
User picks template
        ↓
templateConfig object loaded
        ↓
User writes/AI generates content (title, paragraph per slide)
        ↓
SlideRenderer maps content + config → styled JSX
        ↓
Export: html2canvas screenshots each rendered div → PNG/PDF
```

---

## 2. The Core Concept: Templates as Data

The key insight is that every visual decision in a template can be expressed as a value in an object.

| Visual Element | Config Key | Example Value |
|---|---|---|
| Background color | `palette.bg` | `"#111111"` |
| Accent color | `palette.accent` | `"#FF6B35"` |
| Font pair | `fonts.heading` | `"Anton"` |
| Slide layout | `body.layout` | `"text-left-image-right"` |
| Alternating slides | `body.alternating` | `true` |
| Background pattern | `backgroundEffect` | `"dots"` |
| Intro style | `intro.bgType` | `"gradient"` |
| Corner radius | `cornerRadius` | `12` |

Once you have this config object, your renderer component handles ALL the rendering logic. You never write per-template HTML again.

---

## 3. File Structure

```
src/
├── components/
│   ├── carousel/
│   │   ├── SlideRenderer.jsx          ← master renderer
│   │   ├── slides/
│   │   │   ├── IntroSlide.jsx         ← intro slide layout
│   │   │   ├── BodySlide.jsx          ← body slide layout
│   │   │   └── OutroSlide.jsx         ← outro slide layout
│   │   ├── AccentTitle.jsx            ← auto-highlights one word
│   │   ├── BackgroundEffect.jsx       ← SVG pattern overlays
│   │   ├── TemplateSwitcher.jsx       ← template picker UI
│   │   └── PreviewStrip.jsx           ← 4-slide preview row
├── lib/
│   └── templates/
│       ├── index.js                   ← exports all templates
│       ├── lightBlue.js
│       ├── darkTeal.js
│       ├── midnight.js
│       ├── sunsetOrange.js
│       ├── forestGreen.js
│       ├── lavenderDream.js
│       ├── warmCream.js
│       ├── boldRed.js
│       ├── neonDark.js
│       └── cleanWhite.js
├── hooks/
│   └── useCarousel.js                 ← carousel state management
└── app/
    └── editor/
        └── page.jsx                   ← main editor page
```

---

## 4. Template Config Schema

This is the full schema every template follows. Not all fields are required — the renderer has sensible defaults.

```js
// lib/templates/schema.js
// This file documents the full shape of a template config.
// It is not imported anywhere — it is documentation.

const TemplateSchema = {
  // ─── Identity ───────────────────────────────────────────────
  id: "string",           // unique kebab-case ID
  name: "string",         // display name shown in picker
  category: "string",     // "light" | "dark" | "vibrant" | "minimal"
  tags: ["string"],       // e.g. ["bold", "professional", "gradient"]

  // ─── Color Palette ──────────────────────────────────────────
  palette: {
    bg: "string",         // primary background color (hex)
    bgAlt: "string",      // alternate background for even/odd slides
    text: "string",       // primary text color
    textMuted: "string",  // tagline / secondary text
    accent: "string",     // accent color (CTA buttons, highlighted words, badges)
    accentText: "string", // text color on top of accent bg (usually white or dark)
    surface: "string",    // card / inner element bg
    border: "string",     // subtle border color
  },

  // ─── Typography ─────────────────────────────────────────────
  fonts: {
    heading: "string",    // Google Font name for headings
    body: "string",       // Google Font name for body text
    size: "string",       // "sm" | "md" | "lg"
    uppercase: "boolean", // whether titles are all-caps
    headingWeight: "number", // 700 | 800 | 900
  },

  // ─── Global ─────────────────────────────────────────────────
  cornerRadius: "number",      // px, applied to slides and badges
  backgroundEffect: "string",  // "none" | "dots" | "waves" | "circles" |
                               // "confetti" | "topography" | "grid" | "noise"
  slideAspectRatio: "string",  // "4/5" | "1/1" | "9/16"

  // ─── Intro Slide ────────────────────────────────────────────
  intro: {
    bgType: "string",     // "solid" | "gradient" | "image-overlay"
    bg: "string",         // overrides palette.bg if set
    gradient: "string",   // CSS gradient string (used when bgType = "gradient")
    layout: "string",     // "centered" | "text-left" | "text-left-image-right"
    showTagline: "boolean",
    showCTA: "boolean",
    ctaLabel: "string",   // default CTA text
    ctaStyle: {
      bg: "string",       // "accent" or hex
      text: "string",
      rounded: "boolean",
      variant: "string",  // "filled" | "outline" | "ghost"
    },
    image: {
      show: "boolean",
      position: "string", // "bottom-right" | "bottom-left" | "center"
      type: "string",     // "3d-illustration" | "character" | "none"
    },
    backgroundEffect: "string", // can override global effect for intro only
  },

  // ─── Body Slides ────────────────────────────────────────────
  body: {
    bgType: "string",     // "solid" | "gradient"
    bg: "string",         // overrides palette.bg if set
    alternating: "boolean",
    bgEven: "string",     // bg for even-indexed slides
    bgOdd: "string",      // bg for odd-indexed slides
    layout: "string",     // "text-only" | "text-left-image-right" | "text-image-stacked"
    showBadge: "boolean",
    badgeStyle: "string", // "filled-circle" | "outline-circle" | "square" | "none"
    badgeBg: "string",    // overrides accent color for badge
    accentWords: "string", // "auto" (first noun-like word) | "none"
    showDivider: "boolean", // horizontal line between title and paragraph
    backgroundEffect: "string",
  },

  // ─── Outro Slide ────────────────────────────────────────────
  outro: {
    bgType: "string",     // "solid" | "gradient" | "image-overlay"
    bg: "string",
    gradient: "string",
    layout: "string",     // "centered" | "text-left" | "headshot-right"
    showHeadshot: "boolean",
    headshotStyle: "string", // "circle" | "circle-border" | "none"
    showCTA: "boolean",
    ctaLabel: "string",
    showSocialIcons: "boolean",
    backgroundEffect: "string",
  },
}
```

---

## 5. The 10 Templates

### Template 1 — Light Blue ("Nurture")

Inspired by the relationships carousel. Soft blue background, warm orange accent, clean sans-serif fonts.

```js
// lib/templates/lightBlue.js
export const lightBlue = {
  id: "light-blue",
  name: "Nurture",
  category: "light",
  tags: ["soft", "warm", "professional"],

  palette: {
    bg: "#E8F4F8",
    bgAlt: "#FFFFFF",
    text: "#1A2B4A",
    textMuted: "#7A95B0",
    accent: "#F4845F",
    accentText: "#FFFFFF",
    surface: "#FFFFFF",
    border: "#D0E4EE",
  },

  fonts: {
    heading: "Merriweather",
    body: "Inter",
    size: "md",
    uppercase: false,
    headingWeight: 900,
  },

  cornerRadius: 12,
  backgroundEffect: "none",
  slideAspectRatio: "4/5",

  intro: {
    bgType: "solid",
    bg: "#E8F4F8",
    layout: "text-left-image-right",
    showTagline: true,
    showCTA: true,
    ctaLabel: "See what matters →",
    ctaStyle: { bg: "#F4845F", text: "#FFFFFF", rounded: true, variant: "filled" },
    image: { show: true, position: "bottom-right", type: "3d-illustration" },
  },

  body: {
    bgType: "solid",
    bg: "#FFFFFF",
    alternating: false,
    layout: "text-only",
    showBadge: true,
    badgeStyle: "filled-circle",
    badgeBg: "#F4845F",
    accentWords: "auto",
  },

  outro: {
    bgType: "solid",
    bg: "#E8F4F8",
    layout: "text-left-image-right",
    showHeadshot: false,
    showCTA: true,
    ctaLabel: "Tag someone who cares daily.",
    showSocialIcons: false,
    image: { show: true, position: "bottom-right", type: "3d-illustration" },
  },
}
```

---

### Template 2 — Dark Teal ("Authority")

Professional dark theme with teal tones. Alternating slide backgrounds. Dot pattern overlay.

```js
// lib/templates/darkTeal.js
export const darkTeal = {
  id: "dark-teal",
  name: "Authority",
  category: "dark",
  tags: ["professional", "bold", "linkedin"],

  palette: {
    bg: "#1E3A47",
    bgAlt: "#2C5364",
    text: "#FFFFFF",
    textMuted: "#90BDC8",
    accent: "#F4845F",
    accentText: "#FFFFFF",
    surface: "#2C5364",
    border: "#3D7080",
  },

  fonts: {
    heading: "Oswald",
    body: "Inter",
    size: "md",
    uppercase: true,
    headingWeight: 700,
  },

  cornerRadius: 8,
  backgroundEffect: "dots",
  slideAspectRatio: "4/5",

  intro: {
    bgType: "solid",
    bg: "#1E3A47",
    layout: "text-left-image-right",
    showTagline: true,
    showCTA: true,
    ctaLabel: "See the tips →",
    ctaStyle: { bg: "#F4845F", text: "#FFFFFF", rounded: false, variant: "filled" },
    image: { show: true, position: "bottom-right", type: "character" },
    backgroundEffect: "dots",
  },

  body: {
    bgType: "solid",
    bg: "#2C5364",
    alternating: true,
    bgEven: "#1E3A47",
    bgOdd: "#2C5364",
    layout: "text-only",
    showBadge: true,
    badgeStyle: "filled-circle",
    badgeBg: "#F4845F",
    accentWords: "auto",
    backgroundEffect: "dots",
  },

  outro: {
    bgType: "image-overlay",
    bg: "#1E3A47",
    layout: "text-left",
    showHeadshot: true,
    headshotStyle: "circle",
    showCTA: true,
    ctaLabel: "Share with your friends",
    showSocialIcons: true,
    backgroundEffect: "dots",
  },
}
```

---

### Template 3 — Midnight ("Deep Dive")

Full dark blue with a textured topography background. No alternating — consistent moody atmosphere. Great for serious/educational topics.

```js
// lib/templates/midnight.js
export const midnight = {
  id: "midnight",
  name: "Deep Dive",
  category: "dark",
  tags: ["moody", "atmospheric", "storytelling"],

  palette: {
    bg: "#1B2A4A",
    bgAlt: "#1B2A4A",
    text: "#FFFFFF",
    textMuted: "#8899BB",
    accent: "#6C8EFF",
    accentText: "#FFFFFF",
    surface: "#243357",
    border: "#334477",
  },

  fonts: {
    heading: "Playfair Display",
    body: "Inter",
    size: "md",
    uppercase: false,
    headingWeight: 800,
  },

  cornerRadius: 0,
  backgroundEffect: "topography",
  slideAspectRatio: "4/5",

  intro: {
    bgType: "image-overlay",
    bg: "#1B2A4A",
    layout: "text-left",
    showTagline: true,
    showCTA: true,
    ctaLabel: "Swipe →",
    ctaStyle: { bg: "transparent", text: "#FFFFFF", rounded: false, variant: "outline" },
    image: { show: true, position: "bottom-right", type: "3d-illustration" },
    backgroundEffect: "topography",
  },

  body: {
    bgType: "solid",
    bg: "#1B2A4A",
    alternating: false,
    layout: "text-only",
    showBadge: true,
    badgeStyle: "outline-circle",
    badgeBg: "#6C8EFF",
    accentWords: "auto",
    backgroundEffect: "topography",
  },

  outro: {
    bgType: "solid",
    bg: "#1B2A4A",
    layout: "headshot-right",
    showHeadshot: true,
    headshotStyle: "circle",
    showCTA: true,
    ctaLabel: "Share if you're ready to take control.",
    showSocialIcons: false,
    backgroundEffect: "topography",
  },
}
```

---

### Template 4 — Sunset Orange ("Energy")

Warm golden-yellow tones. Consistent bg across all slides with bold typography. Great for entrepreneurship and motivation content.

```js
// lib/templates/sunsetOrange.js
export const sunsetOrange = {
  id: "sunset-orange",
  name: "Energy",
  category: "vibrant",
  tags: ["warm", "motivational", "energetic"],

  palette: {
    bg: "#F5C842",
    bgAlt: "#F0BC30",
    text: "#1A1A2E",
    textMuted: "#5A4A00",
    accent: "#2D3A8C",
    accentText: "#FFFFFF",
    surface: "#F0BC30",
    border: "#D4A820",
  },

  fonts: {
    heading: "Big Shoulders Display",
    body: "Inter",
    size: "lg",
    uppercase: false,
    headingWeight: 800,
  },

  cornerRadius: 16,
  backgroundEffect: "circles",
  slideAspectRatio: "4/5",

  intro: {
    bgType: "solid",
    bg: "#F5C842",
    layout: "text-left-image-right",
    showTagline: true,
    showCTA: true,
    ctaLabel: "Swipe to Learn More →",
    ctaStyle: { bg: "#2D3A8C", text: "#FFFFFF", rounded: true, variant: "filled" },
    image: { show: true, position: "bottom-right", type: "3d-illustration" },
    backgroundEffect: "circles",
  },

  body: {
    bgType: "solid",
    bg: "#F5C842",
    alternating: false,
    layout: "text-only",
    showBadge: true,
    badgeStyle: "filled-circle",
    badgeBg: "#2D3A8C",
    accentWords: "auto",
    backgroundEffect: "circles",
  },

  outro: {
    bgType: "image-overlay",
    bg: "#F5C842",
    layout: "text-left",
    showHeadshot: true,
    headshotStyle: "circle",
    showCTA: true,
    ctaLabel: "Launch your business today!",
    showSocialIcons: true,
    backgroundEffect: "circles",
  },
}
```

---

### Template 5 — Forest Green ("Clarity")

Earthy, calming greens. Great for wellness, sustainability, productivity content. Subtle noise texture background.

```js
// lib/templates/forestGreen.js
export const forestGreen = {
  id: "forest-green",
  name: "Clarity",
  category: "dark",
  tags: ["calm", "wellness", "nature"],

  palette: {
    bg: "#1A3325",
    bgAlt: "#24442F",
    text: "#E8F5E8",
    textMuted: "#85AA85",
    accent: "#7ED56F",
    accentText: "#1A3325",
    surface: "#24442F",
    border: "#2E5539",
  },

  fonts: {
    heading: "Syne",
    body: "Inter",
    size: "md",
    uppercase: false,
    headingWeight: 700,
  },

  cornerRadius: 20,
  backgroundEffect: "noise",
  slideAspectRatio: "4/5",

  intro: {
    bgType: "gradient",
    gradient: "linear-gradient(145deg, #1A3325 0%, #2E5539 100%)",
    layout: "text-left",
    showTagline: true,
    showCTA: true,
    ctaLabel: "Read on →",
    ctaStyle: { bg: "#7ED56F", text: "#1A3325", rounded: true, variant: "filled" },
    image: { show: false, position: "bottom-right", type: "none" },
    backgroundEffect: "noise",
  },

  body: {
    bgType: "solid",
    bg: "#1A3325",
    alternating: true,
    bgEven: "#1A3325",
    bgOdd: "#24442F",
    layout: "text-only",
    showBadge: true,
    badgeStyle: "filled-circle",
    badgeBg: "#7ED56F",
    accentWords: "auto",
    backgroundEffect: "noise",
  },

  outro: {
    bgType: "gradient",
    gradient: "linear-gradient(145deg, #24442F 0%, #1A3325 100%)",
    layout: "headshot-right",
    showHeadshot: true,
    headshotStyle: "circle-border",
    showCTA: true,
    ctaLabel: "Follow for more →",
    showSocialIcons: false,
    backgroundEffect: "noise",
  },
}
```

---

### Template 6 — Lavender Dream ("Inspire")

Soft purple/lavender tones with cream accents. Elegant and modern. Works well for lifestyle, creativity, and mental health content.

```js
// lib/templates/lavenderDream.js
export const lavenderDream = {
  id: "lavender-dream",
  name: "Inspire",
  category: "light",
  tags: ["elegant", "soft", "lifestyle"],

  palette: {
    bg: "#F0EBF8",
    bgAlt: "#E4D9F5",
    text: "#2D1B69",
    textMuted: "#7B6B99",
    accent: "#8B5CF6",
    accentText: "#FFFFFF",
    surface: "#FFFFFF",
    border: "#D4C5EC",
  },

  fonts: {
    heading: "Playfair Display",
    body: "Inter",
    size: "md",
    uppercase: false,
    headingWeight: 800,
  },

  cornerRadius: 24,
  backgroundEffect: "circles",
  slideAspectRatio: "4/5",

  intro: {
    bgType: "gradient",
    gradient: "linear-gradient(135deg, #F0EBF8 0%, #E4D9F5 100%)",
    layout: "centered",
    showTagline: true,
    showCTA: true,
    ctaLabel: "Discover more →",
    ctaStyle: { bg: "#8B5CF6", text: "#FFFFFF", rounded: true, variant: "filled" },
    image: { show: false, position: "center", type: "none" },
    backgroundEffect: "circles",
  },

  body: {
    bgType: "solid",
    bg: "#F0EBF8",
    alternating: true,
    bgEven: "#F0EBF8",
    bgOdd: "#E4D9F5",
    layout: "text-only",
    showBadge: true,
    badgeStyle: "filled-circle",
    badgeBg: "#8B5CF6",
    accentWords: "auto",
    backgroundEffect: "circles",
  },

  outro: {
    bgType: "gradient",
    gradient: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
    layout: "centered",
    showHeadshot: true,
    headshotStyle: "circle-border",
    showCTA: true,
    ctaLabel: "Save this for later 🔖",
    showSocialIcons: false,
  },
}
```

---

### Template 7 — Warm Cream ("Minimal")

Ultra-clean cream/white tones. The alternating body slides switch between cream and warm yellow.

```js
// lib/templates/warmCream.js
export const warmCream = {
  id: "warm-cream",
  name: "Minimal",
  category: "light",
  tags: ["minimal", "clean", "warm"],

  palette: {
    bg: "#FAF6EC",
    bgAlt: "#F5C842",
    text: "#1A1A1A",
    textMuted: "#888870",
    accent: "#8B5CF6",
    accentText: "#FFFFFF",
    surface: "#FFFFFF",
    border: "#E5DFC8",
  },

  fonts: {
    heading: "Bricolage Grotesque",
    body: "Inter",
    size: "md",
    uppercase: false,
    headingWeight: 800,
  },

  cornerRadius: 4,
  backgroundEffect: "none",
  slideAspectRatio: "4/5",

  intro: {
    bgType: "solid",
    bg: "#FAF6EC",
    layout: "text-left",
    showTagline: true,
    showCTA: false,
    image: { show: false, position: "bottom-right", type: "none" },
  },

  body: {
    bgType: "solid",
    bg: "#FAF6EC",
    alternating: true,
    bgEven: "#FAF6EC",
    bgOdd: "#F5C842",
    layout: "text-only",
    showBadge: true,
    badgeStyle: "filled-circle",
    badgeBg: "#8B5CF6",
    accentWords: "auto",
  },

  outro: {
    bgType: "solid",
    bg: "#F5C842",
    layout: "headshot-right",
    showHeadshot: true,
    headshotStyle: "circle",
    showCTA: true,
    ctaLabel: "More focus, less mess.",
    showSocialIcons: false,
  },
}
```

---

### Template 8 — Bold Red ("Impact")

High contrast black and red. Ultra-bold typography. Perfect for bold statements and viral content.

```js
// lib/templates/boldRed.js
export const boldRed = {
  id: "bold-red",
  name: "Impact",
  category: "dark",
  tags: ["bold", "impactful", "viral"],

  palette: {
    bg: "#0D0D0D",
    bgAlt: "#1A0505",
    text: "#FFFFFF",
    textMuted: "#999999",
    accent: "#EF4444",
    accentText: "#FFFFFF",
    surface: "#1A1A1A",
    border: "#330000",
  },

  fonts: {
    heading: "Bebas Neue",
    body: "Inter",
    size: "lg",
    uppercase: true,
    headingWeight: 400,
  },

  cornerRadius: 0,
  backgroundEffect: "grid",
  slideAspectRatio: "4/5",

  intro: {
    bgType: "solid",
    bg: "#0D0D0D",
    layout: "text-left",
    showTagline: true,
    showCTA: true,
    ctaLabel: "Keep reading →",
    ctaStyle: { bg: "#EF4444", text: "#FFFFFF", rounded: false, variant: "filled" },
    image: { show: false, position: "bottom-right", type: "none" },
    backgroundEffect: "grid",
  },

  body: {
    bgType: "solid",
    bg: "#0D0D0D",
    alternating: true,
    bgEven: "#0D0D0D",
    bgOdd: "#1A0505",
    layout: "text-only",
    showBadge: true,
    badgeStyle: "square",
    badgeBg: "#EF4444",
    accentWords: "auto",
    backgroundEffect: "grid",
  },

  outro: {
    bgType: "gradient",
    gradient: "linear-gradient(145deg, #EF4444 0%, #B91C1C 100%)",
    layout: "centered",
    showHeadshot: true,
    headshotStyle: "circle",
    showCTA: true,
    ctaLabel: "Share this →",
    showSocialIcons: true,
  },
}
```

---

### Template 9 — Neon Dark ("Cyber")

Dark background with electric neon green accents. Monospace/tech fonts. Perfect for tech, developer, and startup content.

```js
// lib/templates/neonDark.js
export const neonDark = {
  id: "neon-dark",
  name: "Cyber",
  category: "dark",
  tags: ["tech", "futuristic", "developer"],

  palette: {
    bg: "#0A0A0F",
    bgAlt: "#0F0F1A",
    text: "#FFFFFF",
    textMuted: "#6B7280",
    accent: "#00FF88",
    accentText: "#0A0A0F",
    surface: "#111118",
    border: "#1F2937",
  },

  fonts: {
    heading: "JetBrains Mono",
    body: "Inter",
    size: "md",
    uppercase: false,
    headingWeight: 700,
  },

  cornerRadius: 6,
  backgroundEffect: "dots",
  slideAspectRatio: "4/5",

  intro: {
    bgType: "gradient",
    gradient: "linear-gradient(145deg, #0A0A0F 0%, #0F1A0F 100%)",
    layout: "text-left",
    showTagline: true,
    showCTA: true,
    ctaLabel: "$ read --more",
    ctaStyle: { bg: "transparent", text: "#00FF88", rounded: false, variant: "outline" },
    image: { show: false, position: "bottom-right", type: "none" },
    backgroundEffect: "dots",
  },

  body: {
    bgType: "solid",
    bg: "#0A0A0F",
    alternating: true,
    bgEven: "#0A0A0F",
    bgOdd: "#0F0F1A",
    layout: "text-only",
    showBadge: true,
    badgeStyle: "outline-circle",
    badgeBg: "#00FF88",
    accentWords: "auto",
    showDivider: true,
    backgroundEffect: "dots",
  },

  outro: {
    bgType: "solid",
    bg: "#0A0A0F",
    layout: "text-left",
    showHeadshot: true,
    headshotStyle: "circle-border",
    showCTA: true,
    ctaLabel: "Follow for more →",
    showSocialIcons: false,
    backgroundEffect: "dots",
  },
}
```

---

### Template 10 — Clean White ("Studio")

Pure minimal white. Zero decoration. Typography-first. Beautiful editorial feel.

```js
// lib/templates/cleanWhite.js
export const cleanWhite = {
  id: "clean-white",
  name: "Studio",
  category: "light",
  tags: ["minimal", "editorial", "typography"],

  palette: {
    bg: "#FFFFFF",
    bgAlt: "#F8F8F8",
    text: "#111111",
    textMuted: "#999999",
    accent: "#111111",
    accentText: "#FFFFFF",
    surface: "#F8F8F8",
    border: "#EEEEEE",
  },

  fonts: {
    heading: "DM Serif Display",
    body: "DM Sans",
    size: "md",
    uppercase: false,
    headingWeight: 700,
  },

  cornerRadius: 0,
  backgroundEffect: "none",
  slideAspectRatio: "4/5",

  intro: {
    bgType: "solid",
    bg: "#FFFFFF",
    layout: "text-left",
    showTagline: true,
    showCTA: true,
    ctaLabel: "Read on →",
    ctaStyle: { bg: "#111111", text: "#FFFFFF", rounded: false, variant: "filled" },
    image: { show: false, position: "bottom-right", type: "none" },
  },

  body: {
    bgType: "solid",
    bg: "#FFFFFF",
    alternating: false,
    layout: "text-only",
    showBadge: true,
    badgeStyle: "outline-circle",
    badgeBg: "#111111",
    accentWords: "none",
    showDivider: true,
  },

  outro: {
    bgType: "solid",
    bg: "#111111",
    layout: "headshot-right",
    showHeadshot: true,
    headshotStyle: "circle",
    showCTA: true,
    ctaLabel: "Follow for more →",
    showSocialIcons: false,
  },
}
```

---

### Template Index File

```js
// lib/templates/index.js
export { lightBlue }      from "./lightBlue"
export { darkTeal }       from "./darkTeal"
export { midnight }       from "./midnight"
export { sunsetOrange }   from "./sunsetOrange"
export { forestGreen }    from "./forestGreen"
export { lavenderDream }  from "./lavenderDream"
export { warmCream }      from "./warmCream"
export { boldRed }        from "./boldRed"
export { neonDark }       from "./neonDark"
export { cleanWhite }     from "./cleanWhite"

import { lightBlue }      from "./lightBlue"
import { darkTeal }       from "./darkTeal"
import { midnight }       from "./midnight"
import { sunsetOrange }   from "./sunsetOrange"
import { forestGreen }    from "./forestGreen"
import { lavenderDream }  from "./lavenderDream"
import { warmCream }      from "./warmCream"
import { boldRed }        from "./boldRed"
import { neonDark }       from "./neonDark"
import { cleanWhite }     from "./cleanWhite"

export const ALL_TEMPLATES = [
  lightBlue, darkTeal, midnight, sunsetOrange, forestGreen,
  lavenderDream, warmCream, boldRed, neonDark, cleanWhite,
]

export const TEMPLATES_BY_ID = Object.fromEntries(
  ALL_TEMPLATES.map(t => [t.id, t])
)

export const TEMPLATES_BY_CATEGORY = ALL_TEMPLATES.reduce((acc, t) => {
  if (!acc[t.category]) acc[t.category] = []
  acc[t.category].push(t)
  return acc
}, {})
```

---

## 6. Background Effects (SVG)

These are SVG patterns rendered as an absolutely-positioned overlay inside each slide div. They sit between the background color and the content layer, so text always sits on top.

```jsx
// components/carousel/BackgroundEffect.jsx
"use client"

const EFFECTS = {
  dots: ({ color }) => (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.5" fill={color} fillOpacity="0.25" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots)" />
    </svg>
  ),

  grid: ({ color }) => (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke={color} strokeWidth="0.5" strokeOpacity="0.2" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  ),

  circles: ({ color }) => (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" overflow="visible">
      <circle cx="90%" cy="10%" r="120" fill={color} fillOpacity="0.08" />
      <circle cx="90%" cy="10%" r="180" fill="none" stroke={color} strokeWidth="1" strokeOpacity="0.06" />
      <circle cx="90%" cy="10%" r="240" fill="none" stroke={color} strokeWidth="1" strokeOpacity="0.04" />
      <circle cx="-5%" cy="90%" r="80" fill={color} fillOpacity="0.06" />
      <circle cx="-5%" cy="90%" r="140" fill="none" stroke={color} strokeWidth="1" strokeOpacity="0.04" />
    </svg>
  ),

  waves: ({ color }) => (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <path
        d="M0,60 C150,100 350,0 500,60 C650,120 850,20 1000,60 L1000,200 L0,200 Z"
        fill={color} fillOpacity="0.06"
        transform="translate(0, 200)"
      />
      <path
        d="M0,60 C150,20 350,100 500,60 C650,0 850,100 1000,60 L1000,200 L0,200 Z"
        fill={color} fillOpacity="0.04"
        transform="translate(0, 280)"
      />
    </svg>
  ),

  topography: ({ color }) => (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="topo" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
          <path
            d="M 50 100 Q 75 50 100 100 Q 125 150 150 100"
            fill="none" stroke={color} strokeWidth="1" strokeOpacity="0.15"
          />
          <path
            d="M 0 80 Q 40 30 80 80 Q 120 130 160 80 Q 200 30 240 80"
            fill="none" stroke={color} strokeWidth="1" strokeOpacity="0.1"
          />
          <path
            d="M 20 150 Q 60 100 100 150 Q 140 200 180 150"
            fill="none" stroke={color} strokeWidth="1" strokeOpacity="0.08"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#topo)" />
    </svg>
  ),

  noise: ({ color }) => (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
        <feBlend in="SourceGraphic" mode="overlay" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)" opacity="0.04" fill={color} />
    </svg>
  ),

  confetti: ({ color }) => {
    const pieces = Array.from({ length: 20 }, (_, i) => ({
      x: (i * 137) % 100,
      y: (i * 73) % 100,
      r: (i % 3) * 3 + 3,
      rotate: (i * 47) % 360,
    }))
    return (
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        {pieces.map((p, i) => (
          <rect
            key={i}
            x={`${p.x}%`} y={`${p.y}%`}
            width={p.r} height={p.r / 2}
            fill={color} fillOpacity="0.15"
            transform={`rotate(${p.rotate} ${p.x} ${p.y})`}
          />
        ))}
      </svg>
    )
  },
}

export default function BackgroundEffect({ type, textColor = "#ffffff" }) {
  if (!type || type === "none") return null
  const Effect = EFFECTS[type]
  if (!Effect) return null

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      <Effect color={textColor} />
    </div>
  )
}
```

---

## 7. The Slide Renderer

This is the heart of the system. Three slide-type components plus a master dispatcher.

### Shared CreatorInfo Component

This is used inside all three slide types. Define it once in a shared file or at the top of each slide file.

```jsx
// components/carousel/slides/CreatorInfo.jsx
export default function CreatorInfo({ creator, palette, fonts, size }) {
  if (!creator) return null

  return (
    <div
      style={{
        position: "relative",
        zIndex: 1,
        display: "flex",
        alignItems: "center",
        gap: size * 0.02,
        marginTop: size * 0.03,
      }}
    >
      {creator.logo && (
        <img
          src={creator.logo}
          alt=""
          style={{
            width: size * 0.06,
            height: size * 0.06,
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      )}
      <div>
        <p style={{
          color: palette.text,
          fontSize: size * 0.028,
          fontWeight: 700,
          margin: 0,
          fontFamily: fonts.body,
          lineHeight: 1.2,
        }}>
          {creator.name}
        </p>
        <p style={{
          color: palette.textMuted,
          fontSize: size * 0.026,
          margin: 0,
          fontFamily: fonts.body,
          lineHeight: 1.2,
        }}>
          {creator.handle}
        </p>
      </div>
    </div>
  )
}
```

### IntroSlide.jsx

```jsx
// components/carousel/slides/IntroSlide.jsx
import AccentTitle   from "../AccentTitle"
import BackgroundEffect from "../BackgroundEffect"
import CreatorInfo   from "./CreatorInfo"

export default function IntroSlide({ template, slide, creator, size = 400 }) {
  const { palette, fonts, intro, cornerRadius } = template

  const bgStyle = intro.bgType === "gradient"
    ? { background: intro.gradient }
    : { backgroundColor: intro.bg || palette.bg }

  return (
    <div
      style={{
        ...bgStyle,
        width: size,
        height: size * 1.25,
        borderRadius: cornerRadius,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: size * 0.07,
        fontFamily: fonts.body,
        boxSizing: "border-box",
      }}
    >
      <BackgroundEffect
        type={intro.backgroundEffect || template.backgroundEffect}
        textColor={palette.text}
      />

      <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column" }}>

        {/* Tagline */}
        {intro.showTagline && slide.tagline && (
          <p style={{
            color: palette.textMuted,
            fontSize: size * 0.035,
            margin: 0,
            marginBottom: size * 0.02,
            fontFamily: fonts.body,
          }}>
            {slide.tagline}
          </p>
        )}

        {/* Title */}
        <AccentTitle
          text={slide.title}
          accentColor={palette.accent}
          textColor={palette.text}
          fontFamily={fonts.heading}
          fontSize={size * 0.072}
          fontWeight={fonts.headingWeight}
          uppercase={fonts.uppercase}
          style={{ margin: 0, marginBottom: size * 0.025, lineHeight: 1.1 }}
        />

        {/* Paragraph */}
        {slide.paragraph && (
          <p style={{
            color: palette.text,
            fontSize: size * 0.038,
            lineHeight: 1.5,
            margin: 0,
            marginBottom: size * 0.04,
            fontFamily: fonts.body,
            opacity: 0.85,
          }}>
            {slide.paragraph}
          </p>
        )}

        {/* CTA Button */}
        {intro.showCTA && (slide.cta || intro.ctaLabel) && (
          <button style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            backgroundColor: intro.ctaStyle.variant === "outline"
              ? "transparent"
              : intro.ctaStyle.bg === "accent"
              ? palette.accent
              : intro.ctaStyle.bg,
            color: intro.ctaStyle.text,
            border: intro.ctaStyle.variant === "outline"
              ? `2px solid ${intro.ctaStyle.text}`
              : "none",
            borderRadius: intro.ctaStyle.rounded ? 999 : cornerRadius / 2,
            padding: `${size * 0.02}px ${size * 0.045}px`,
            fontSize: size * 0.033,
            fontFamily: fonts.body,
            fontWeight: 600,
            cursor: "pointer",
            marginTop: "auto",
            width: "fit-content",
          }}>
            {slide.cta || intro.ctaLabel}
          </button>
        )}
      </div>

      <CreatorInfo creator={creator} palette={palette} fonts={fonts} size={size} />
    </div>
  )
}
```

### BodySlide.jsx

```jsx
// components/carousel/slides/BodySlide.jsx
import AccentTitle      from "../AccentTitle"
import BackgroundEffect from "../BackgroundEffect"
import CreatorInfo      from "./CreatorInfo"

function Badge({ number, style, bg, textColor, cornerRadius, size }) {
  const baseSize = size * 0.065

  const base = {
    width: baseSize,
    height: baseSize,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: size * 0.03,
    fontWeight: 700,
    marginBottom: size * 0.02,
    flexShrink: 0,
  }

  if (style === "filled-circle") {
    return <div style={{ ...base, backgroundColor: bg, color: textColor, borderRadius: "50%" }}>{number}</div>
  }
  if (style === "outline-circle") {
    return <div style={{ ...base, backgroundColor: "transparent", color: bg, border: `2px solid ${bg}`, borderRadius: "50%" }}>{number}</div>
  }
  if (style === "square") {
    return <div style={{ ...base, backgroundColor: bg, color: textColor, borderRadius: cornerRadius / 2 }}>{number}</div>
  }
  return null
}

export default function BodySlide({ template, slide, index, creator, size = 400 }) {
  const { palette, fonts, body, cornerRadius } = template

  let bg = body.bg || palette.bg
  if (body.alternating) {
    bg = index % 2 === 0
      ? (body.bgEven || palette.bg)
      : (body.bgOdd  || palette.bgAlt || palette.bg)
  }

  return (
    <div
      style={{
        backgroundColor: bg,
        width: size,
        height: size * 1.25,
        borderRadius: cornerRadius,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: size * 0.07,
        fontFamily: fonts.body,
        boxSizing: "border-box",
      }}
    >
      <BackgroundEffect
        type={body.backgroundEffect || template.backgroundEffect}
        textColor={palette.text}
      />

      <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column" }}>

        {body.showBadge && (
          <Badge
            number={index + 1}
            style={body.badgeStyle}
            bg={body.badgeBg || palette.accent}
            textColor={palette.accentText}
            cornerRadius={cornerRadius}
            size={size}
          />
        )}

        <AccentTitle
          text={slide.title}
          accentColor={palette.accent}
          textColor={palette.text}
          fontFamily={fonts.heading}
          fontSize={size * 0.065}
          fontWeight={fonts.headingWeight}
          uppercase={fonts.uppercase}
          applyAccent={body.accentWords === "auto"}
          style={{ margin: 0, marginTop: size * 0.025, marginBottom: size * 0.02, lineHeight: 1.15 }}
        />

        {body.showDivider && (
          <div style={{
            width: size * 0.1,
            height: 2,
            backgroundColor: palette.accent,
            marginBottom: size * 0.025,
          }} />
        )}

        {slide.paragraph && (
          <p style={{
            color: palette.text,
            fontSize: size * 0.036,
            lineHeight: 1.6,
            margin: 0,
            fontFamily: fonts.body,
            opacity: 0.85,
          }}>
            {slide.paragraph}
          </p>
        )}
      </div>

      <CreatorInfo creator={creator} palette={palette} fonts={fonts} size={size} />
    </div>
  )
}
```

### OutroSlide.jsx

```jsx
// components/carousel/slides/OutroSlide.jsx
import AccentTitle      from "../AccentTitle"
import BackgroundEffect from "../BackgroundEffect"
import CreatorInfo      from "./CreatorInfo"

export default function OutroSlide({ template, slide, creator, size = 400 }) {
  const { palette, fonts, outro, cornerRadius } = template

  const bgStyle = outro.bgType === "gradient"
    ? { background: outro.gradient }
    : { backgroundColor: outro.bg || palette.bg }

  const textColor = outro.bgType === "gradient"
    ? (outro.textColor || palette.accentText || "#FFFFFF")
    : palette.text

  return (
    <div
      style={{
        ...bgStyle,
        width: size,
        height: size * 1.25,
        borderRadius: cornerRadius,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: size * 0.07,
        fontFamily: fonts.body,
        boxSizing: "border-box",
      }}
    >
      <BackgroundEffect
        type={outro.backgroundEffect || template.backgroundEffect}
        textColor={textColor}
      />

      <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column" }}>

        {outro.showHeadshot && creator?.headshot && (
          <div style={{ marginBottom: size * 0.03 }}>
            <img
              src={creator.headshot}
              alt={creator.name}
              style={{
                width: size * 0.15,
                height: size * 0.15,
                borderRadius: "50%",
                objectFit: "cover",
                border: outro.headshotStyle === "circle-border"
                  ? `3px solid ${palette.accent}`
                  : "none",
              }}
            />
          </div>
        )}

        {slide.tagline && (
          <p style={{
            color: textColor,
            fontSize: size * 0.033,
            opacity: 0.7,
            margin: 0,
            marginBottom: size * 0.015,
            fontFamily: fonts.body,
          }}>
            {slide.tagline}
          </p>
        )}

        <AccentTitle
          text={slide.title}
          accentColor={outro.bgType === "gradient" ? textColor : palette.accent}
          textColor={textColor}
          fontFamily={fonts.heading}
          fontSize={size * 0.065}
          fontWeight={fonts.headingWeight}
          uppercase={fonts.uppercase}
          style={{ margin: 0, marginBottom: size * 0.025, lineHeight: 1.15 }}
        />

        {slide.paragraph && (
          <p style={{
            color: textColor,
            fontSize: size * 0.036,
            lineHeight: 1.5,
            margin: 0,
            marginBottom: size * 0.04,
            opacity: 0.85,
            fontFamily: fonts.body,
          }}>
            {slide.paragraph}
          </p>
        )}

        {outro.showCTA && (slide.cta || outro.ctaLabel) && (
          <button style={{
            display: "inline-flex",
            alignItems: "center",
            backgroundColor: outro.bgType === "gradient"
              ? "rgba(255,255,255,0.2)"
              : palette.accent,
            color: outro.bgType === "gradient" ? "#FFFFFF" : palette.accentText,
            border: "none",
            borderRadius: 999,
            padding: `${size * 0.018}px ${size * 0.04}px`,
            fontSize: size * 0.03,
            fontFamily: fonts.body,
            fontWeight: 600,
            cursor: "pointer",
            width: "fit-content",
          }}>
            {slide.cta || outro.ctaLabel}
          </button>
        )}

        {outro.showSocialIcons && (
          <div style={{ display: "flex", gap: size * 0.02, marginTop: "auto" }}>
            {["💬", "❤️", "🔖"].map((icon, i) => (
              <span key={i} style={{ fontSize: size * 0.045 }}>{icon}</span>
            ))}
          </div>
        )}
      </div>

      <CreatorInfo creator={creator} palette={palette} fonts={fonts} size={size} />
    </div>
  )
}
```

### Master SlideRenderer.jsx

```jsx
// components/carousel/SlideRenderer.jsx
import IntroSlide  from "./slides/IntroSlide"
import BodySlide   from "./slides/BodySlide"
import OutroSlide  from "./slides/OutroSlide"

export default function SlideRenderer({
  template,
  slide,
  index,
  total,
  creator,
  size = 400,
}) {
  const isIntro = index === 0
  const isOutro = index === total - 1
  const bodyIndex = index - 1

  const commonProps = { template, slide, creator, size }

  if (isIntro) return <IntroSlide {...commonProps} />
  if (isOutro) return <OutroSlide {...commonProps} />
  return <BodySlide {...commonProps} index={bodyIndex} />
}
```

---

## 8. The AccentTitle Component

Automatically highlights one or two words in the title using the template's accent color. This recreates the signature aiCarousels effect where every title has a colored keyword.

```jsx
// components/carousel/AccentTitle.jsx

/**
 * Renders a heading where important words are highlighted in the accent color.
 *
 * Two modes:
 * 1. Manual:  Wrap words in **asterisks** — "Building **Fulfilling** Relationships"
 * 2. Auto:    Highlights the first word longer than 5 characters
 */
export default function AccentTitle({
  text = "",
  accentColor,
  textColor,
  fontFamily,
  fontSize,
  fontWeight = 800,
  uppercase = false,
  applyAccent = true,
  style = {},
}) {
  if (!text) return null

  const processedText = uppercase ? text.toUpperCase() : text
  const segments = parseAccentSegments(processedText, applyAccent)

  return (
    <h2
      style={{
        color: textColor,
        fontFamily,
        fontSize,
        fontWeight,
        lineHeight: 1.15,
        margin: 0,
        padding: 0,
        ...style,
      }}
    >
      {segments.map((seg, i) =>
        seg.accent
          ? <span key={i} style={{ color: accentColor }}>{seg.text}</span>
          : <span key={i}>{seg.text}</span>
      )}
    </h2>
  )
}

function parseAccentSegments(text, applyAccent) {
  // Case 1: Manual marks with **word**
  if (text.includes("**")) {
    const parts = text.split(/\*\*(.*?)\*\*/g)
    return parts.map((part, i) => ({ text: part, accent: i % 2 === 1 }))
  }

  // Case 2: Auto — highlight the first word longer than 5 chars
  if (applyAccent) {
    const words = text.split(" ")
    let highlighted = false
    const segments = []
    let buffer = ""

    for (let i = 0; i < words.length; i++) {
      const word = words[i]
      const space = i < words.length - 1 ? " " : ""

      if (!highlighted && word.length > 5) {
        if (buffer) segments.push({ text: buffer, accent: false })
        segments.push({ text: word + space, accent: true })
        buffer = ""
        highlighted = true
      } else {
        buffer += word + space
      }
    }

    if (buffer) segments.push({ text: buffer, accent: false })
    return segments
  }

  // Case 3: No accent
  return [{ text, accent: false }]
}
```

---

## 9. The Template Switcher UI

```jsx
// components/carousel/TemplateSwitcher.jsx
"use client"
import { useState } from "react"
import { ALL_TEMPLATES } from "@/lib/templates"

const CATEGORIES = ["all", "light", "dark", "vibrant", "minimal"]

export default function TemplateSwitcher({ activeTemplateId, onSelect }) {
  const [category, setCategory] = useState("all")

  const filtered = category === "all"
    ? ALL_TEMPLATES
    : ALL_TEMPLATES.filter(t => t.category === category)

  return (
    <div style={{ width: 280, fontFamily: "Inter, sans-serif" }}>
      {/* Category Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            style={{
              padding: "4px 12px",
              borderRadius: 999,
              border: "1.5px solid",
              borderColor: category === cat ? "#111" : "#E5E5E5",
              backgroundColor: category === cat ? "#111" : "transparent",
              color: category === cat ? "#fff" : "#555",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Template Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, maxHeight: 500, overflowY: "auto" }}>
        {filtered.map(template => (
          <TemplateThumb
            key={template.id}
            template={template}
            isActive={template.id === activeTemplateId}
            onSelect={() => onSelect(template)}
          />
        ))}
      </div>
    </div>
  )
}

function TemplateThumb({ template, isActive, onSelect }) {
  const { palette, intro } = template

  const bgStyle = intro.bgType === "gradient"
    ? { background: intro.gradient }
    : { backgroundColor: intro.bg || palette.bg }

  return (
    <div
      onClick={onSelect}
      style={{
        cursor: "pointer",
        borderRadius: 8,
        overflow: "hidden",
        border: isActive ? "2.5px solid #111" : "2.5px solid transparent",
        transition: "border-color 0.15s",
      }}
    >
      {/* Mini preview */}
      <div style={{ ...bgStyle, height: 90, padding: 10, position: "relative", overflow: "hidden" }}>
        <div style={{ width: "70%", height: 8, backgroundColor: palette.text, borderRadius: 4, marginBottom: 5, opacity: 0.9 }} />
        <div style={{ width: "45%", height: 8, backgroundColor: palette.accent, borderRadius: 4, marginBottom: 8 }} />
        {[80, 65, 55].map((w, i) => (
          <div key={i} style={{ width: `${w}%`, height: 4, backgroundColor: palette.text, borderRadius: 2, marginBottom: 3, opacity: 0.35 }} />
        ))}
        <div style={{ position: "absolute", bottom: 8, left: 10, display: "flex", gap: 4 }}>
          {[palette.bg, palette.accent, palette.text].map((c, i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: c, border: "1px solid rgba(0,0,0,0.1)" }} />
          ))}
        </div>
      </div>
      <div style={{ padding: "6px 8px", backgroundColor: "#FAFAFA", fontSize: 11, fontWeight: 600, color: "#333" }}>
        {template.name}
      </div>
    </div>
  )
}
```

---

## 10. The Preview Strip

Renders all slides at a small size in a horizontal row — exactly like aiCarousels' template gallery preview.

```jsx
// components/carousel/PreviewStrip.jsx
"use client"
import SlideRenderer from "./SlideRenderer"

export default function PreviewStrip({
  template,
  slides,
  creator,
  thumbSize = 120,
  activeIndex,
  onSlideClick,
}) {
  return (
    <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "8px 0" }}>
      {slides.map((slide, i) => (
        <div
          key={i}
          onClick={() => onSlideClick?.(i)}
          style={{
            flexShrink: 0,
            borderRadius: 8,
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            cursor: "pointer",
            outline: activeIndex === i ? "3px solid #111" : "3px solid transparent",
            outlineOffset: 2,
            transition: "outline-color 0.15s",
          }}
        >
          <SlideRenderer
            template={template}
            slide={slide}
            index={i}
            total={slides.length}
            creator={creator}
            size={thumbSize}
          />
        </div>
      ))}
    </div>
  )
}
```

---

## 11. Export to Image (html2canvas)

This is how aiCarousels generates downloadable images. It takes a screenshot of each rendered slide div at 2x resolution.

```bash
npm install html2canvas jszip file-saver
```

```js
// lib/exportCarousel.js
import html2canvas from "html2canvas"

/**
 * Captures a DOM element as a PNG data URL.
 * @param {HTMLElement} element  - The slide div to screenshot
 * @param {number}      scale    - Resolution multiplier (2 = retina quality)
 */
export async function captureSlide(element, scale = 2) {
  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    allowTaint: false,
    backgroundColor: null,
    logging: false,
  })
  return canvas.toDataURL("image/png")
}

/**
 * Exports all slides as individual PNG files packaged in a ZIP.
 * @param {React.RefObject[]} slideRefs  - Array of refs attached to slide divs
 * @param {string}            name       - Used as the ZIP filename
 */
export async function exportAllSlides(slideRefs, name = "carousel") {
  const JSZip     = (await import("jszip")).default
  const { saveAs } = await import("file-saver")

  const zip    = new JSZip()
  const folder = zip.folder(name)

  for (let i = 0; i < slideRefs.length; i++) {
    const el = slideRefs[i]?.current
    if (!el) continue
    const dataUrl = await captureSlide(el, 2)
    const base64  = dataUrl.replace(/^data:image\/png;base64,/, "")
    folder.file(`slide-${String(i + 1).padStart(2, "0")}.png`, base64, { base64: true })
  }

  const blob = await zip.generateAsync({ type: "blob" })
  saveAs(blob, `${name}-carousel.zip`)
}
```

### Attaching refs in the editor

```jsx
// In your editor component
import { useRef } from "react"

// Create one ref per slide
const slideRefs = slides.map(() => useRef(null))

// Wrap each SlideRenderer in a div with the ref
{slides.map((slide, i) => (
  <div key={i} ref={slideRefs[i]}>
    <SlideRenderer
      template={template}
      slide={slide}
      index={i}
      total={slides.length}
      creator={creator}
      size={400}
    />
  </div>
))}

// Download button
<button onClick={() => exportAllSlides(slideRefs, template.name)}>
  Download All Slides
</button>
```

---

## 12. Putting It All Together

### The Carousel State Hook

```js
// hooks/useCarousel.js
"use client"
import { useState, useCallback } from "react"
import { lightBlue } from "@/lib/templates"

const DEFAULT_SLIDES = [
  {
    type: "intro",
    tagline: "It's not just about big moments.",
    title: "The Secret to Building **Fulfilling** Relationships",
    paragraph: "Ever wonder why some couples just click? Let's talk about what keeps people close.",
    cta: "See what matters →",
  },
  {
    type: "body",
    title: "Little things matter",
    paragraph: "Sending a message, sharing a smile, laughing together. Small stuff builds trust and brings people closer.",
  },
  {
    type: "body",
    title: "Listen, really listen",
    paragraph: "Put down your phone. Look them in the eyes. Sometimes, just being there says more than words.",
  },
  {
    type: "outro",
    tagline: "Lasting connections grow with everyday care.",
    title: "Nurture your **Relationships**",
    paragraph: "Invest a little, often.",
    cta: "Tag someone who cares daily.",
  },
]

export function useCarousel() {
  const [template,    setTemplate]  = useState(lightBlue)
  const [slides,      setSlides]    = useState(DEFAULT_SLIDES)
  const [creator,     setCreator]   = useState({ name: "Your Name", handle: "Founder at Company" })
  const [activeSlide, setActive]    = useState(0)

  const updateSlide = useCallback((index, updates) => {
    setSlides(prev => prev.map((s, i) => i === index ? { ...s, ...updates } : s))
  }, [])

  const addSlide = useCallback(() => {
    setSlides(prev => {
      const next = [...prev]
      next.splice(next.length - 1, 0, {
        type: "body",
        title: "New Slide Title",
        paragraph: "Add your content here.",
      })
      return next
    })
  }, [])

  const removeSlide = useCallback((index) => {
    setSlides(prev => prev.filter((_, i) => i !== index))
  }, [])

  const moveSlide = useCallback((from, to) => {
    setSlides(prev => {
      const next = [...prev]
      const [item] = next.splice(from, 1)
      next.splice(to, 0, item)
      return next
    })
  }, [])

  return {
    template, setTemplate,
    slides, updateSlide, addSlide, removeSlide, moveSlide,
    creator, setCreator,
    activeSlide, setActive,
  }
}
```

### The Main Editor Page

```jsx
// app/editor/page.jsx
"use client"
import { useRef } from "react"
import { useCarousel }       from "@/hooks/useCarousel"
import SlideRenderer         from "@/components/carousel/SlideRenderer"
import TemplateSwitcher      from "@/components/carousel/TemplateSwitcher"
import PreviewStrip          from "@/components/carousel/PreviewStrip"
import { exportAllSlides }   from "@/lib/exportCarousel"

export default function EditorPage() {
  const {
    template, setTemplate,
    slides, updateSlide, addSlide,
    creator,
    activeSlide, setActive,
  } = useCarousel()

  // One ref per slide for html2canvas export
  const slideRefs = slides.map(() => useRef(null))

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Inter, sans-serif" }}>

      {/* ── LEFT PANEL: Template Switcher ── */}
      <div style={{ width: 300, borderRight: "1px solid #eee", padding: 20, overflowY: "auto" }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 14 }}>Templates</h3>
        <TemplateSwitcher
          activeTemplateId={template.id}
          onSelect={setTemplate}
        />
      </div>

      {/* ── CENTER: Canvas + Preview Strip ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: 40, gap: 24, overflowY: "auto" }}>

        {/* Active slide at full size */}
        <div ref={slideRefs[activeSlide]}>
          <SlideRenderer
            template={template}
            slide={slides[activeSlide]}
            index={activeSlide}
            total={slides.length}
            creator={creator}
            size={400}
          />
        </div>

        {/* All slides as small thumbnails */}
        <PreviewStrip
          template={template}
          slides={slides}
          creator={creator}
          thumbSize={100}
          activeIndex={activeSlide}
          onSlideClick={setActive}
        />

        {/* Actions */}
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={addSlide}
            style={{
              padding: "10px 20px",
              border: "1.5px solid #ddd",
              borderRadius: 8,
              backgroundColor: "transparent",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            + Add Slide
          </button>
          <button
            onClick={() => exportAllSlides(slideRefs, template.name)}
            style={{
              padding: "10px 24px",
              backgroundColor: "#111",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Download All Slides
          </button>
        </div>
      </div>

      {/* ── RIGHT PANEL: Slide Editor ── */}
      <div style={{ width: 300, borderLeft: "1px solid #eee", padding: 20, overflowY: "auto" }}>
        <h3 style={{ margin: "0 0 4px", fontSize: 14 }}>
          Slide {activeSlide + 1} of {slides.length}
        </h3>
        <p style={{ margin: "0 0 16px", fontSize: 12, color: "#888" }}>
          {activeSlide === 0 ? "Intro" : activeSlide === slides.length - 1 ? "Outro" : "Body"}
        </p>

        {/* Tagline (intro/outro only) */}
        {(activeSlide === 0 || activeSlide === slides.length - 1) && (
          <>
            <label style={{ fontSize: 12, color: "#666", display: "block", marginBottom: 4 }}>Tagline</label>
            <input
              value={slides[activeSlide]?.tagline || ""}
              onChange={e => updateSlide(activeSlide, { tagline: e.target.value })}
              style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ddd", fontSize: 13, boxSizing: "border-box", marginBottom: 12 }}
            />
          </>
        )}

        {/* Title */}
        <label style={{ fontSize: 12, color: "#666", display: "block", marginBottom: 4 }}>
          Title <span style={{ color: "#aaa" }}>(use **word** for accent color)</span>
        </label>
        <textarea
          value={slides[activeSlide]?.title || ""}
          onChange={e => updateSlide(activeSlide, { title: e.target.value })}
          rows={3}
          style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ddd", fontSize: 13, resize: "vertical", boxSizing: "border-box", marginBottom: 12 }}
        />

        {/* Paragraph */}
        <label style={{ fontSize: 12, color: "#666", display: "block", marginBottom: 4 }}>Paragraph</label>
        <textarea
          value={slides[activeSlide]?.paragraph || ""}
          onChange={e => updateSlide(activeSlide, { paragraph: e.target.value })}
          rows={5}
          style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ddd", fontSize: 13, resize: "vertical", boxSizing: "border-box", marginBottom: 12 }}
        />

        {/* CTA */}
        <label style={{ fontSize: 12, color: "#666", display: "block", marginBottom: 4 }}>CTA Text</label>
        <input
          value={slides[activeSlide]?.cta || ""}
          onChange={e => updateSlide(activeSlide, { cta: e.target.value })}
          style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ddd", fontSize: 13, boxSizing: "border-box", marginBottom: 16 }}
        />

        {/* Slide navigator */}
        <p style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>Jump to slide</p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                width: 32, height: 32,
                borderRadius: 6,
                border: "1.5px solid",
                borderColor: activeSlide === i ? "#111" : "#ddd",
                backgroundColor: activeSlide === i ? "#111" : "transparent",
                color: activeSlide === i ? "#fff" : "#555",
                fontWeight: 600,
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
```

---

## 13. Adding New Templates

Adding a new template is exactly three steps — no component changes required.

**Step 1** — Create the config file:

```js
// lib/templates/myTemplate.js
export const myTemplate = {
  id: "my-template",       // must be unique
  name: "My Template",     // shown in picker
  category: "dark",        // "light" | "dark" | "vibrant" | "minimal"
  tags: ["bold"],

  palette: {
    bg: "#0D0D0D",
    bgAlt: "#1A1A1A",
    text: "#FFFFFF",
    textMuted: "#888888",
    accent: "#FF0080",
    accentText: "#FFFFFF",
    surface: "#1A1A1A",
    border: "#333333",
  },

  fonts: {
    heading: "Syne",     // any Google Font name
    body: "Inter",
    size: "md",
    uppercase: false,
    headingWeight: 800,
  },

  cornerRadius: 12,
  backgroundEffect: "dots",

  intro: {
    bgType: "gradient",
    gradient: "linear-gradient(135deg, #0D0D0D, #1A001A)",
    layout: "text-left",
    showTagline: true,
    showCTA: true,
    ctaLabel: "Read on →",
    ctaStyle: { bg: "#FF0080", text: "#FFFFFF", rounded: true, variant: "filled" },
    image: { show: false },
  },

  body: {
    bgType: "solid",
    bg: "#0D0D0D",
    alternating: true,
    bgEven: "#0D0D0D",
    bgOdd: "#1A001A",
    layout: "text-only",
    showBadge: true,
    badgeStyle: "filled-circle",
    badgeBg: "#FF0080",
    accentWords: "auto",
  },

  outro: {
    bgType: "gradient",
    gradient: "linear-gradient(135deg, #FF0080, #C0006A)",
    layout: "centered",
    showHeadshot: true,
    headshotStyle: "circle",
    showCTA: true,
    ctaLabel: "Follow for more →",
    showSocialIcons: false,
  },
}
```

**Step 2** — Register it in the index:

```js
// lib/templates/index.js  — just add two lines
export { myTemplate } from "./myTemplate"
import { myTemplate } from "./myTemplate"

export const ALL_TEMPLATES = [
  // ... existing templates
  myTemplate,   // ← done
]
```

**Step 3** — Done. It automatically appears in the template switcher, preview strip, and export with no other changes.

---

## Quick Reference

| You want to... | Where to look |
|---|---|
| Change a template's colors | `lib/templates/[name].js` → `palette` |
| Change alternating backgrounds | `body.bgEven` / `body.bgOdd` |
| Change intro/outro layout | `intro.layout` / `outro.layout` |
| Change background pattern | `backgroundEffect` string |
| Add a new SVG pattern | `BackgroundEffect.jsx` → `EFFECTS` object |
| Add a new badge style | `BodySlide.jsx` → `Badge` component |
| Change font pair | `fonts.heading` + `fonts.body` (Google Font names) |
| Auto-highlight accent word | `body.accentWords: "auto"` |
| Manual highlight specific word | Wrap in `**double asterisks**` in the title string |
| Export slides as PNG | `lib/exportCarousel.js` → `exportAllSlides()` |
| Add a brand new template | Create config → add to `lib/templates/index.js` |
| Scale slide size | Pass different `size` prop to `SlideRenderer` |
