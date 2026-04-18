# Carousel Background System — Complete Technical Guide

A full implementation guide for building a pluggable, data-driven background system for carousels — exactly how aiCarousels implements their "Topography", "Wobbly Waves", "Poly Grid", "Roundly Arrows", and other named background effects.

---

## Table of Contents

1. [How It Works — The Architecture](#1-how-it-works--the-architecture)
2. [What You Saw in the Screenshots](#2-what-you-saw-in-the-screenshots)
3. [The Background Registry Pattern](#3-the-background-registry-pattern)
4. [The BackgroundLayer Component](#4-the-backgroundlayer-component)
5. [The 10 Backgrounds — Full Code](#5-the-10-backgrounds--full-code)
   - Background 1: Dots Grid
   - Background 2: Poly Grid
   - Background 3: Topography
   - Background 4: Wobbly Waves
   - Background 5: Roundly Arrows
   - Background 6: Concentric Circles
   - Background 7: Diagonal Lines
   - Background 8: Hex Mesh
   - Background 9: Noise Burst
   - Background 10: Node Voyage
6. [The Background Picker UI](#6-the-background-picker-ui)
7. [Integrating with the Template System](#7-integrating-with-the-template-system)
8. [How the Carousel Slide Uses a Background](#8-how-the-carousel-slide-uses-a-background)
9. [Adding New Backgrounds](#9-adding-new-backgrounds)
10. [Performance Notes](#10-performance-notes)

---

## 1. How It Works — The Architecture

### The Core Insight

Looking at the aiCarousels screenshots, every background is:
1. A **repeating SVG pattern** OR a **full-size SVG illustration** rendered inside a `<svg>` element
2. Rendered at **the exact size of the slide** (or using `width="100%" height="100%"`)
3. **Semi-transparent** — the lines/shapes are the same hue as the slide background but lighter, so they sit subtly on top
4. Placed in an **absolutely positioned overlay layer** that sits between the background color and the content

The background is NOT baked into the template. It is a **separate, independently selectable layer**. This means any background can be applied to any template.

### The Three-Layer Stack

Every slide has exactly three visual layers stacked in z-order:

```
┌─────────────────────────────────────────┐
│  Layer 3: Content (z-index: 2)          │
│  title, paragraph, badge, CTA, creator  │
├─────────────────────────────────────────┤
│  Layer 2: Background Effect (z-index: 1)│
│  SVG pattern overlay, semi-transparent  │
├─────────────────────────────────────────┤
│  Layer 1: Base Color (z-index: 0)       │
│  backgroundColor from template palette  │
└─────────────────────────────────────────┘
```

The slide container is `position: relative; overflow: hidden`. The background layer is `position: absolute; inset: 0`. The content layer is `position: relative; z-index: 2`.

### What a Background Is (as Data)

```js
{
  id: "topography",          // unique ID stored on the carousel state
  name: "Topography",        // shown in the picker UI
  category: "organic",       // for filtering in the picker
  preview: TopographySVG,    // small thumbnail shown in picker
  render: TopographyBg,      // React component that draws the full background
}
```

The `render` function receives two props:
- `color` — the color to draw the pattern in (usually the text color at low opacity)
- `opacity` — overall opacity multiplier

That's it. The background knows nothing about the template. The template knows nothing about the background. They are decoupled.

---

## 2. What You Saw in the Screenshots

### Screenshot 1 — Roundly Arrows
Large curved arrow shapes that span across slide boundaries. Each slide shows a fragment of the arrow. The arrows are drawn as SVG `<path>` elements using quadratic bezier curves. The pattern tiles every ~2 slides worth of width.

### Screenshot 2 — Topography + Wobbly Waves
**Topography**: Closed, irregularly shaped contour lines — like a topographic map. Rendered as a tiling SVG `<pattern>` with multiple nested oval `<path>` elements.

**Wobbly Waves**: Organic flowing vertical lines that curve left and right. Not a repeating pattern — it's a single full-width SVG with many `<path>` lines drawn from top to bottom with sinusoidal x-offsets.

### Screenshot 3 — Dots + Poly Grid
**Dots**: Simple evenly-spaced dot grid using SVG `<circle>` in a `<pattern>`. 

**Poly Grid**: Fine square grid — very small cell size (~20px), thin stroke. Just a `<pattern>` with a `<path>` drawing one grid cell edge.

### The Key Visual Property

In all cases, the pattern color is the slide's **text color** (usually white or dark) at **10–25% opacity**. This keeps the pattern subtle and prevents it from competing with content. The exact opacity value is part of each background definition.

---

## 3. The Background Registry Pattern

All backgrounds live in a central registry — a plain array of objects. Nothing is hardcoded anywhere else.

```js
// lib/backgrounds/index.js

import { DotsGridBg,       dotsGridPreview      } from "./dotsGrid"
import { PolyGridBg,       polyGridPreview       } from "./polyGrid"
import { TopographyBg,     topographyPreview     } from "./topography"
import { WobblyWavesBg,    wobblyWavesPreview    } from "./wobblyWaves"
import { RoundlyArrowsBg,  roundlyArrowsPreview  } from "./roundlyArrows"
import { ConcentricBg,     concentricPreview     } from "./concentric"
import { DiagonalLinesBg,  diagonalLinesPreview  } from "./diagonalLines"
import { HexMeshBg,        hexMeshPreview        } from "./hexMesh"
import { NoiseBurstBg,     noiseBurstPreview     } from "./noiseBurst"
import { NodeVoyageBg,     nodeVoyagePreview     } from "./nodeVoyage"

export const BACKGROUNDS = [
  {
    id:       "none",
    name:     "None",
    category: "basic",
    preview:  null,
    render:   null,
  },
  {
    id:       "dots-grid",
    name:     "Dots Grid",
    category: "geometric",
    preview:  dotsGridPreview,
    render:   DotsGridBg,
  },
  {
    id:       "poly-grid",
    name:     "Poly Grid",
    category: "geometric",
    preview:  polyGridPreview,
    render:   PolyGridBg,
  },
  {
    id:       "topography",
    name:     "Topography",
    category: "organic",
    preview:  topographyPreview,
    render:   TopographyBg,
  },
  {
    id:       "wobbly-waves",
    name:     "Wobbly Waves",
    category: "organic",
    preview:  wobblyWavesPreview,
    render:   WobblyWavesBg,
  },
  {
    id:       "roundly-arrows",
    name:     "Roundly Arrows",
    category: "illustrative",
    preview:  roundlyArrowsPreview,
    render:   RoundlyArrowsBg,
  },
  {
    id:       "concentric",
    name:     "Concentric Circles",
    category: "geometric",
    preview:  concentricPreview,
    render:   ConcentricBg,
  },
  {
    id:       "diagonal-lines",
    name:     "Diagonal Lines",
    category: "geometric",
    preview:  diagonalLinesPreview,
    render:   DiagonalLinesBg,
  },
  {
    id:       "hex-mesh",
    name:     "Hex Mesh",
    category: "geometric",
    preview:  hexMeshPreview,
    render:   HexMeshBg,
  },
  {
    id:       "noise-burst",
    name:     "Noise Burst",
    category: "organic",
    preview:  noiseBurstPreview,
    render:   NoiseBurstBg,
  },
  {
    id:       "node-voyage",
    name:     "Node Voyage",
    category: "illustrative",
    preview:  nodeVoyagePreview,
    render:   NodeVoyageBg,
  },
]

export const BACKGROUNDS_BY_ID = Object.fromEntries(
  BACKGROUNDS.map(b => [b.id, b])
)

export const BACKGROUND_CATEGORIES = ["all", "geometric", "organic", "illustrative"]
```

---

## 4. The BackgroundLayer Component

This is the single component that every slide uses. It looks up the background from the registry and renders it.

```jsx
// components/carousel/BackgroundLayer.jsx
"use client"
import { BACKGROUNDS_BY_ID } from "@/lib/backgrounds"

/**
 * Renders the background pattern layer inside a slide.
 *
 * @param {string}  backgroundId  - ID from BACKGROUNDS registry (e.g. "topography")
 * @param {string}  color         - Pattern color (usually palette.text)
 * @param {number}  opacity       - Global opacity override (0–1, default 1)
 * @param {number}  width         - Slide width in px
 * @param {number}  height        - Slide height in px
 */
export default function BackgroundLayer({
  backgroundId = "none",
  color = "#ffffff",
  opacity = 1,
  width = 400,
  height = 500,
}) {
  if (!backgroundId || backgroundId === "none") return null

  const bg = BACKGROUNDS_BY_ID[backgroundId]
  if (!bg || !bg.render) return null

  const RenderComponent = bg.render

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
        overflow: "hidden",
        opacity,
      }}
    >
      <RenderComponent
        color={color}
        width={width}
        height={height}
      />
    </div>
  )
}
```

### How it's used inside a slide

```jsx
// Inside any slide component (IntroSlide, BodySlide, OutroSlide)

<div style={{ position: "relative", backgroundColor: palette.bg, ... }}>

  {/* Layer 1: Background pattern */}
  <BackgroundLayer
    backgroundId={activeBackgroundId}   // from carousel state
    color={palette.text}                // uses text color at low opacity (set inside each bg)
    width={size}
    height={size * 1.25}
  />

  {/* Layer 2: Content */}
  <div style={{ position: "relative", zIndex: 2 }}>
    {/* title, paragraph, etc. */}
  </div>

</div>
```

---

## 5. The 10 Backgrounds — Full Code

Each background exports two things:
- `[Name]Bg` — the full React component used inside slides
- `[name]Preview` — a tiny SVG string used as the picker thumbnail

---

### Background 1: Dots Grid

Evenly-spaced dot matrix. The most subtle background — works with any template.

```jsx
// lib/backgrounds/dotsGrid.jsx

export function DotsGridBg({ color = "#ffffff", width = 400, height = 500 }) {
  const spacing = 22
  const dotRadius = 1.2

  return (
    <svg
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      <defs>
        <pattern
          id="dots-grid-pattern"
          x="0"
          y="0"
          width={spacing}
          height={spacing}
          patternUnits="userSpaceOnUse"
        >
          <circle
            cx={spacing / 2}
            cy={spacing / 2}
            r={dotRadius}
            fill={color}
            fillOpacity="0.3"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots-grid-pattern)" />
    </svg>
  )
}

// Tiny 60x60 preview SVG string (used in picker thumbnail)
export const dotsGridPreview = `
<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="p" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
      <circle cx="5" cy="5" r="1" fill="white" fill-opacity="0.35"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#p)"/>
</svg>
`
```

---

### Background 2: Poly Grid

Fine square grid. Tight cell spacing (~20px) with hairline strokes. Great for the "Cyber" and "Clean White" templates.

```jsx
// lib/backgrounds/polyGrid.jsx

export function PolyGridBg({ color = "#ffffff", width = 400, height = 500 }) {
  const cellSize = 20

  return (
    <svg
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      <defs>
        <pattern
          id="poly-grid-pattern"
          x="0"
          y="0"
          width={cellSize}
          height={cellSize}
          patternUnits="userSpaceOnUse"
        >
          {/* Draws the top and left edges of each cell = full grid when tiled */}
          <path
            d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`}
            fill="none"
            stroke={color}
            strokeWidth="0.5"
            strokeOpacity="0.2"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#poly-grid-pattern)" />
    </svg>
  )
}

export const polyGridPreview = `
<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="p" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
      <path d="M 8 0 L 0 0 0 8" fill="none" stroke="white" stroke-width="0.5" stroke-opacity="0.3"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#p)"/>
</svg>
`
```

---

### Background 3: Topography

Organic nested contour lines — the signature aiCarousels look. Uses a tiling pattern with hand-crafted closed paths that suggest elevation contours.

```jsx
// lib/backgrounds/topography.jsx

export function TopographyBg({ color = "#ffffff", width = 400, height = 500 }) {
  // The pattern tile is 200x200 and contains several nested irregular closed shapes
  const patternSize = 200

  return (
    <svg
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      <defs>
        <pattern
          id="topo-pattern"
          x="0"
          y="0"
          width={patternSize}
          height={patternSize}
          patternUnits="userSpaceOnUse"
        >
          {/* Outer blob */}
          <path
            d="M 20 100 C 10 60, 40 20, 80 30 C 120 40, 160 20, 180 60
               C 195 90, 180 130, 150 140 C 120 155, 80 160, 50 145
               C 25 132, 28 130, 20 100 Z"
            fill="none"
            stroke={color}
            strokeWidth="1"
            strokeOpacity="0.2"
          />
          {/* Middle blob */}
          <path
            d="M 50 100 C 42 75, 60 50, 90 55 C 120 60, 148 50, 155 75
               C 162 98, 148 120, 125 128 C 100 138, 72 132, 58 118
               C 48 108, 50 110, 50 100 Z"
            fill="none"
            stroke={color}
            strokeWidth="1"
            strokeOpacity="0.2"
          />
          {/* Inner blob */}
          <path
            d="M 78 100 C 74 85, 85 72, 100 74 C 115 76, 126 85, 124 100
               C 122 114, 112 122, 98 120 C 84 118, 80 112, 78 100 Z"
            fill="none"
            stroke={color}
            strokeWidth="1"
            strokeOpacity="0.2"
          />
          {/* Innermost dot-like blob */}
          <path
            d="M 92 100 C 91 94, 95 90, 101 91 C 107 92, 110 97, 109 103
               C 108 108, 104 111, 99 110 C 93 108, 92 105, 92 100 Z"
            fill="none"
            stroke={color}
            strokeWidth="1"
            strokeOpacity="0.15"
          />
          {/* Second isolated contour group — offset to lower-right */}
          <path
            d="M 130 170 C 125 160, 140 148, 160 152 C 178 156, 195 165, 190 178
               C 185 190, 168 194, 152 190 C 136 186, 132 180, 130 170 Z"
            fill="none"
            stroke={color}
            strokeWidth="1"
            strokeOpacity="0.15"
          />
          <path
            d="M 148 170 C 146 163, 154 158, 163 161 C 172 163, 176 170, 173 178
               C 170 184, 162 186, 155 183 C 148 180, 148 175, 148 170 Z"
            fill="none"
            stroke={color}
            strokeWidth="1"
            strokeOpacity="0.12"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#topo-pattern)" />
    </svg>
  )
}

export const topographyPreview = `
<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="p" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M 6 30 C 3 18, 12 6, 24 9 C 36 12, 48 6, 54 18 C 59 27, 54 39, 45 42 C 36 46, 24 48, 15 43 C 7 40, 8 39, 6 30 Z" fill="none" stroke="white" stroke-width="1" stroke-opacity="0.3"/>
      <path d="M 15 30 C 13 23, 18 15, 27 17 C 36 18, 44 15, 47 23 C 49 30, 44 37, 38 39 C 30 42, 21 40, 17 35 C 14 32, 15 33, 15 30 Z" fill="none" stroke="white" stroke-width="1" stroke-opacity="0.3"/>
      <path d="M 23 30 C 22 25, 26 22, 30 22 C 35 23, 38 26, 37 30 C 37 35, 34 37, 30 37 C 25 36, 23 33, 23 30 Z" fill="none" stroke="white" stroke-width="1" stroke-opacity="0.3"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#p)"/>
</svg>
`
```

---

### Background 4: Wobbly Waves

Flowing vertical lines that undulate across the slide. Each line is a sinusoidal path drawn from top to bottom. Lines are spaced ~18px apart with randomized phase offsets so they look organic, not mechanical.

```jsx
// lib/backgrounds/wobblyWaves.jsx

export function WobblyWavesBg({ color = "#ffffff", width = 400, height = 500 }) {
  const lineSpacing = 18
  const amplitude = 8        // how far each line sways left/right
  const frequency = 0.018    // how fast it oscillates (lower = longer waves)
  const steps = 80           // number of points per line path

  // Generate a single wobbly vertical path
  function makeLine(xBase, phaseOffset) {
    const points = []
    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      const y = t * height
      const x = xBase + Math.sin(y * frequency * Math.PI * 2 + phaseOffset) * amplitude
      points.push(`${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`)
    }
    return points.join(" ")
  }

  const lines = []
  const lineCount = Math.ceil(width / lineSpacing) + 2

  for (let i = 0; i < lineCount; i++) {
    const xBase = i * lineSpacing - lineSpacing
    // Vary phase per line so they don't all wiggle in sync
    const phase = (i * 1.3) % (Math.PI * 2)
    lines.push(makeLine(xBase, phase))
  }

  return (
    <svg
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      {lines.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke={color}
          strokeWidth="1"
          strokeOpacity="0.18"
        />
      ))}
    </svg>
  )
}

export const wobblyWavesPreview = `
<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
  <path d="M 5 0 C 3 15, 7 30, 5 60" fill="none" stroke="white" stroke-width="1" stroke-opacity="0.3"/>
  <path d="M 13 0 C 11 15, 15 30, 13 60" fill="none" stroke="white" stroke-width="1" stroke-opacity="0.3"/>
  <path d="M 21 0 C 19 15, 23 30, 21 60" fill="none" stroke="white" stroke-width="1" stroke-opacity="0.3"/>
  <path d="M 29 0 C 27 15, 31 30, 29 60" fill="none" stroke="white" stroke-width="1" stroke-opacity="0.3"/>
  <path d="M 37 0 C 35 15, 39 30, 37 60" fill="none" stroke="white" stroke-width="1" stroke-opacity="0.3"/>
  <path d="M 45 0 C 43 15, 47 30, 45 60" fill="none" stroke="white" stroke-width="1" stroke-opacity="0.3"/>
  <path d="M 53 0 C 51 15, 55 30, 53 60" fill="none" stroke="white" stroke-width="1" stroke-opacity="0.3"/>
</svg>
`
```

---

### Background 5: Roundly Arrows

Large curved arrow shapes. Each arrow is made of a curved arc (the body) plus an arrowhead. The arrows span multiple slides' worth of space and use a tiling pattern so they appear at consistent intervals. This exactly matches the aiCarousels screenshot.

```jsx
// lib/backgrounds/roundlyArrows.jsx

export function RoundlyArrowsBg({ color = "#ffffff", width = 400, height = 500 }) {
  // Pattern is wide enough to tile nicely across slides
  // Each tile contains: one downward arc + arrowhead at right, one upward arc + arrowhead at left
  const pw = 280  // pattern width
  const ph = 280  // pattern height

  return (
    <svg
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      <defs>
        <pattern
          id="arrows-pattern"
          x="0"
          y="0"
          width={pw}
          height={ph}
          patternUnits="userSpaceOnUse"
        >
          {/*
            Top arc: starts at left edge, arcs down, ends at right edge with downward arrowhead
            This looks like an upside-down U
          */}
          <path
            d={`M 0 60 Q ${pw / 2} 160, ${pw} 60`}
            fill="none"
            stroke={color}
            strokeWidth="14"
            strokeOpacity="0.22"
            strokeLinecap="round"
          />
          {/* Arrowhead pointing down-right at end of top arc */}
          <path
            d={`M ${pw - 28} 38 L ${pw} 60 L ${pw - 8} 88`}
            fill="none"
            stroke={color}
            strokeWidth="14"
            strokeOpacity="0.22"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/*
            Bottom arc: starts at right edge, arcs up, ends at left edge with upward arrowhead
            This looks like a U
          */}
          <path
            d={`M ${pw} 220 Q ${pw / 2} 120, 0 220`}
            fill="none"
            stroke={color}
            strokeWidth="14"
            strokeOpacity="0.22"
            strokeLinecap="round"
          />
          {/* Arrowhead pointing up-left at end of bottom arc */}
          <path
            d={`M 28 198 L 0 220 L 8 248`}
            fill="none"
            stroke={color}
            strokeWidth="14"
            strokeOpacity="0.22"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#arrows-pattern)" />
    </svg>
  )
}

export const roundlyArrowsPreview = `
<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
  <path d="M 0 15 Q 30 40, 60 15" fill="none" stroke="white" stroke-width="4" stroke-opacity="0.35" stroke-linecap="round"/>
  <path d="M 44 8 L 60 15 L 54 28" fill="none" stroke="white" stroke-width="4" stroke-opacity="0.35" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 0 55 Q 30 30, 60 55" fill="none" stroke="white" stroke-width="4" stroke-opacity="0.35" stroke-linecap="round"/>
  <path d="M 6 42 L 0 55 L 14 58" fill="none" stroke="white" stroke-width="4" stroke-opacity="0.35" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`
```

---

### Background 6: Concentric Circles

Expanding circles radiating from a corner. Creates a radar-pulse or ripple effect. The circles are clipped to the slide bounds so they feel anchored to the corner.

```jsx
// lib/backgrounds/concentric.jsx

export function ConcentricBg({ color = "#ffffff", width = 400, height = 500 }) {
  // Circles originate from the top-right corner
  const cx = width * 0.95
  const cy = height * 0.05
  const ringCount = 10
  const maxRadius = Math.sqrt(width * width + height * height) * 0.9
  const gap = maxRadius / ringCount

  return (
    <svg
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      <defs>
        <clipPath id="slide-clip">
          <rect width={width} height={height} />
        </clipPath>
      </defs>
      <g clipPath="url(#slide-clip)">
        {Array.from({ length: ringCount }, (_, i) => {
          const r = (i + 1) * gap
          // Fade out the outer rings
          const opacity = 0.18 - (i / ringCount) * 0.1
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={color}
              strokeWidth="1"
              strokeOpacity={Math.max(opacity, 0.04)}
            />
          )
        })}
      </g>
    </svg>
  )
}

export const concentricPreview = `
<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="c"><rect width="60" height="60"/></clipPath>
  </defs>
  <g clip-path="url(#c)">
    <circle cx="57" cy="3" r="15" fill="none" stroke="white" stroke-width="1" stroke-opacity="0.3"/>
    <circle cx="57" cy="3" r="28" fill="none" stroke="white" stroke-width="1" stroke-opacity="0.22"/>
    <circle cx="57" cy="3" r="42" fill="none" stroke="white" stroke-width="1" stroke-opacity="0.16"/>
    <circle cx="57" cy="3" r="56" fill="none" stroke="white" stroke-width="1" stroke-opacity="0.1"/>
    <circle cx="57" cy="3" r="70" fill="none" stroke="white" stroke-width="1" stroke-opacity="0.06"/>
  </g>
</svg>
`
```

---

### Background 7: Diagonal Lines

Classic hatching lines running at 45 degrees. A staple of editorial and bold design styles. Works especially well with the "Impact" (bold-red) and "Studio" (clean-white) templates.

```jsx
// lib/backgrounds/diagonalLines.jsx

export function DiagonalLinesBg({ color = "#ffffff", width = 400, height = 500 }) {
  const spacing = 16   // distance between lines
  const lineWidth = 1

  return (
    <svg
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      <defs>
        {/*
          The trick: a pattern rotated 45 degrees.
          The pattern cell is a rectangle with one horizontal line.
          When rotated 45deg and tiled, it produces perfect diagonal stripes.
        */}
        <pattern
          id="diag-lines-pattern"
          x="0"
          y="0"
          width={spacing}
          height={spacing}
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line
            x1="0" y1="0"
            x2="0" y2={spacing}
            stroke={color}
            strokeWidth={lineWidth}
            strokeOpacity="0.15"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#diag-lines-pattern)" />
    </svg>
  )
}

export const diagonalLinesPreview = `
<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="p" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="8" stroke="white" stroke-width="1" stroke-opacity="0.3"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#p)"/>
</svg>
`
```

---

### Background 8: Hex Mesh

Honeycomb hexagon grid. Each hexagon is drawn as a 6-sided polygon. The hex grid uses the classic brick-offset tiling technique so rows alternate position.

```jsx
// lib/backgrounds/hexMesh.jsx

export function HexMeshBg({ color = "#ffffff", width = 400, height = 500 }) {
  const hexRadius = 20       // circumradius of each hexagon
  const strokeOpacity = 0.16

  // Flat-top hexagon geometry
  const hexWidth  = hexRadius * 2
  const hexHeight = Math.sqrt(3) * hexRadius
  const colSpacing = hexWidth * 0.75
  const rowSpacing = hexHeight

  // Generates the 6 points of a flat-top hexagon centered at (cx, cy)
  function hexPoints(cx, cy) {
    return Array.from({ length: 6 }, (_, i) => {
      const angle = (Math.PI / 3) * i
      return `${(cx + hexRadius * Math.cos(angle)).toFixed(2)},${(cy + hexRadius * Math.sin(angle)).toFixed(2)}`
    }).join(" ")
  }

  const hexagons = []
  const cols = Math.ceil(width / colSpacing) + 2
  const rows = Math.ceil(height / rowSpacing) + 2

  for (let col = -1; col < cols; col++) {
    for (let row = -1; row < rows; row++) {
      const cx = col * colSpacing
      const cy = row * rowSpacing + (col % 2 === 0 ? 0 : rowSpacing / 2)
      hexagons.push(hexPoints(cx, cy))
    }
  }

  return (
    <svg
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      {hexagons.map((points, i) => (
        <polygon
          key={i}
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="1"
          strokeOpacity={strokeOpacity}
        />
      ))}
    </svg>
  )
}

export const hexMeshPreview = `
<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
  <polygon points="15,5 25,5 30,14 25,23 15,23 10,14" fill="none" stroke="white" stroke-width="1" stroke-opacity="0.3"/>
  <polygon points="30,14 40,14 45,23 40,32 30,32 25,23" fill="none" stroke="white" stroke-width="1" stroke-opacity="0.3"/>
  <polygon points="0,23 10,23 15,32 10,41 0,41 -5,32" fill="none" stroke="white" stroke-width="1" stroke-opacity="0.3"/>
  <polygon points="15,32 25,32 30,41 25,50 15,50 10,41" fill="none" stroke="white" stroke-width="1" stroke-opacity="0.3"/>
  <polygon points="30,41 40,41 45,50 40,59 30,59 25,50" fill="none" stroke="white" stroke-width="1" stroke-opacity="0.3"/>
  <polygon points="45,5 55,5 60,14 55,23 45,23 40,14" fill="none" stroke="white" stroke-width="1" stroke-opacity="0.3"/>
  <polygon points="45,32 55,32 60,41 55,50 45,50 40,41" fill="none" stroke="white" stroke-width="1" stroke-opacity="0.3"/>
</svg>
`
```

---

### Background 9: Noise Burst

Turbulent, organic noise radiating outward from the center — like an energy pulse or camera lens blur. Uses SVG's `feTurbulence` and `feDisplacementMap` filters for a fully CSS/SVG approach with no canvas needed.

```jsx
// lib/backgrounds/noiseBurst.jsx

export function NoiseBurstBg({ color = "#ffffff", width = 400, height = 500 }) {
  // The trick: a radial gradient mask combined with a turbulence filter
  // creates the "burst" that's denser in the center and fades out.
  const filterId   = "noise-burst-filter"
  const maskId     = "noise-burst-mask"
  const gradientId = "noise-burst-grad"

  return (
    <svg
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      <defs>
        {/* Noise filter */}
        <filter id={filterId} x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.04 0.04"
            numOctaves="4"
            seed="8"
            result="noise"
          />
          <feColorMatrix
            type="saturate"
            values="0"
            in="noise"
            result="grayNoise"
          />
          <feComposite
            in="grayNoise"
            in2="SourceGraphic"
            operator="in"
          />
        </filter>

        {/* Radial gradient: opaque center, transparent edges */}
        <radialGradient id={gradientId} cx="50%" cy="50%" r="60%">
          <stop offset="0%"   stopColor="white" stopOpacity="0.5" />
          <stop offset="60%"  stopColor="white" stopOpacity="0.15" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>

        {/* Mask uses the gradient */}
        <mask id={maskId}>
          <rect width="100%" height="100%" fill={`url(#${gradientId})`} />
        </mask>
      </defs>

      {/* Colored rect run through noise filter, then masked with radial gradient */}
      <rect
        width="100%"
        height="100%"
        fill={color}
        fillOpacity="0.25"
        filter={`url(#${filterId})`}
        mask={`url(#${maskId})`}
      />
    </svg>
  )
}

export const noiseBurstPreview = `
<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="f">
      <feTurbulence type="turbulence" baseFrequency="0.06" numOctaves="3" seed="5"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComposite in2="SourceGraphic" operator="in"/>
    </filter>
    <radialGradient id="g" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="white" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="white" stop-opacity="0"/>
    </radialGradient>
    <mask id="m"><rect width="60" height="60" fill="url(#g)"/></mask>
  </defs>
  <rect width="60" height="60" fill="white" fill-opacity="0.3" filter="url(#f)" mask="url(#m)"/>
</svg>
`
```

---

### Background 10: Node Voyage

Connected dot graph — nodes (dots) connected by lines in an organic-looking network. Named after a real aiCarousels background. Uses a deterministic pseudo-random generator so the node positions are stable across renders.

```jsx
// lib/backgrounds/nodeVoyage.jsx

export function NodeVoyageBg({ color = "#ffffff", width = 400, height = 500 }) {
  // Deterministic pseudo-random so pattern is stable (not random on each render)
  function seededRandom(seed) {
    let s = seed
    return () => {
      s = (s * 16807 + 0) % 2147483647
      return (s - 1) / 2147483646
    }
  }

  const rand      = seededRandom(42)
  const nodeCount = 28
  const nodeRadius = 2.5
  const connectionDistance = width * 0.32  // max dist for a line to be drawn

  // Generate stable node positions
  const nodes = Array.from({ length: nodeCount }, () => ({
    x: rand() * width,
    y: rand() * height,
  }))

  // Build connections: connect pairs within connectionDistance
  const connections = []
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x
      const dy = nodes[i].y - nodes[j].y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < connectionDistance) {
        // Fade lines based on distance
        const opacity = (1 - dist / connectionDistance) * 0.18
        connections.push({ i, j, opacity })
      }
    }
  }

  return (
    <svg
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      {/* Draw lines first so nodes sit on top */}
      {connections.map(({ i, j, opacity }, idx) => (
        <line
          key={idx}
          x1={nodes[i].x.toFixed(1)}
          y1={nodes[i].y.toFixed(1)}
          x2={nodes[j].x.toFixed(1)}
          y2={nodes[j].y.toFixed(1)}
          stroke={color}
          strokeWidth="1"
          strokeOpacity={opacity.toFixed(3)}
        />
      ))}

      {/* Draw nodes */}
      {nodes.map((node, i) => (
        <circle
          key={i}
          cx={node.x.toFixed(1)}
          cy={node.y.toFixed(1)}
          r={nodeRadius}
          fill={color}
          fillOpacity="0.3"
        />
      ))}
    </svg>
  )
}

export const nodeVoyagePreview = `
<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
  <line x1="10" y1="15" x2="35" y2="8"  stroke="white" stroke-width="1" stroke-opacity="0.25"/>
  <line x1="35" y1="8"  x2="52" y2="22" stroke="white" stroke-width="1" stroke-opacity="0.25"/>
  <line x1="10" y1="15" x2="22" y2="40" stroke="white" stroke-width="1" stroke-opacity="0.2"/>
  <line x1="35" y1="8"  x2="22" y2="40" stroke="white" stroke-width="1" stroke-opacity="0.2"/>
  <line x1="22" y1="40" x2="48" y2="50" stroke="white" stroke-width="1" stroke-opacity="0.18"/>
  <line x1="52" y1="22" x2="48" y2="50" stroke="white" stroke-width="1" stroke-opacity="0.2"/>
  <line x1="5"  y1="50" x2="22" y2="40" stroke="white" stroke-width="1" stroke-opacity="0.15"/>
  <circle cx="10" cy="15" r="2.5" fill="white" fill-opacity="0.35"/>
  <circle cx="35" cy="8"  r="2.5" fill="white" fill-opacity="0.35"/>
  <circle cx="52" cy="22" r="2.5" fill="white" fill-opacity="0.35"/>
  <circle cx="22" cy="40" r="2.5" fill="white" fill-opacity="0.35"/>
  <circle cx="48" cy="50" r="2.5" fill="white" fill-opacity="0.35"/>
  <circle cx="5"  cy="50" r="2.5" fill="white" fill-opacity="0.35"/>
</svg>
`
```

---

## 6. The Background Picker UI

The picker renders a scrollable grid of thumbnail cards. Clicking one updates the `activeBackgroundId` in your carousel state.

```jsx
// components/carousel/BackgroundPicker.jsx
"use client"
import { useState } from "react"
import { BACKGROUNDS, BACKGROUND_CATEGORIES } from "@/lib/backgrounds"

export default function BackgroundPicker({ activeId, onSelect, slideColor = "#7C5CBF" }) {
  const [category, setCategory] = useState("all")

  const filtered = category === "all"
    ? BACKGROUNDS
    : BACKGROUNDS.filter(b => b.category === category || b.id === "none")

  return (
    <div style={{ fontFamily: "Inter, sans-serif" }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: "#666", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        Background
      </p>

      {/* Category filter tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
        {BACKGROUND_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            style={{
              padding: "3px 10px",
              borderRadius: 999,
              border: "1.5px solid",
              borderColor: category === cat ? "#111" : "#E5E5E5",
              backgroundColor: category === cat ? "#111" : "transparent",
              color: category === cat ? "#fff" : "#666",
              fontSize: 11,
              fontWeight: 500,
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Background grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 8,
        maxHeight: 380,
        overflowY: "auto",
      }}>
        {filtered.map(bg => (
          <BackgroundCard
            key={bg.id}
            bg={bg}
            isActive={bg.id === activeId}
            slideColor={slideColor}
            onSelect={() => onSelect(bg.id)}
          />
        ))}
      </div>
    </div>
  )
}

function BackgroundCard({ bg, isActive, slideColor, onSelect }) {
  return (
    <div
      onClick={onSelect}
      title={bg.name}
      style={{
        cursor: "pointer",
        borderRadius: 8,
        overflow: "hidden",
        border: isActive ? "2.5px solid #111" : "2.5px solid transparent",
        transition: "border-color 0.15s, transform 0.1s",
        transform: isActive ? "scale(1.02)" : "scale(1)",
      }}
    >
      {/* Preview thumbnail */}
      <div
        style={{
          height: 56,
          backgroundColor: slideColor,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {bg.id === "none" ? (
          <span style={{ fontSize: 18, opacity: 0.4 }}>∅</span>
        ) : bg.preview ? (
          // Render the preview SVG string as inline HTML
          <div
            style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
            dangerouslySetInnerHTML={{ __html: bg.preview }}
          />
        ) : null}
      </div>

      {/* Label */}
      <div style={{
        padding: "5px 6px",
        backgroundColor: "#F8F8F8",
        fontSize: 10,
        fontWeight: 500,
        color: "#444",
        textAlign: "center",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}>
        {bg.name}
      </div>
    </div>
  )
}
```

---

## 7. Integrating with the Template System

The background is stored as a separate field in your carousel state — completely independent of the template.

### Update useCarousel.js

```js
// hooks/useCarousel.js  — add backgroundId to state

export function useCarousel() {
  const [template,      setTemplate]      = useState(lightBlue)
  const [backgroundId,  setBackgroundId]  = useState("none")  // ← add this
  const [slides,        setSlides]        = useState(DEFAULT_SLIDES)
  const [creator,       setCreator]       = useState({ name: "Your Name", handle: "Founder" })
  const [activeSlide,   setActive]        = useState(0)

  // ... existing update functions ...

  return {
    template, setTemplate,
    backgroundId, setBackgroundId,          // ← expose these
    slides, updateSlide, addSlide, removeSlide,
    creator, setCreator,
    activeSlide, setActive,
  }
}
```

### Update SlideRenderer to accept backgroundId

```jsx
// components/carousel/SlideRenderer.jsx

import BackgroundLayer from "./BackgroundLayer"

export default function SlideRenderer({
  template,
  slide,
  index,
  total,
  creator,
  size = 400,
  backgroundId = "none",   // ← new prop
}) {
  const isIntro   = index === 0
  const isOutro   = index === total - 1
  const bodyIndex = index - 1

  const props = { template, slide, creator, size, backgroundId }  // ← pass through

  if (isIntro) return <IntroSlide {...props} />
  if (isOutro) return <OutroSlide {...props} />
  return <BodySlide {...props} index={bodyIndex} />
}
```

### Update each slide component to use BackgroundLayer

Inside `IntroSlide`, `BodySlide`, and `OutroSlide`, replace the old `BackgroundEffect` with:

```jsx
// Inside any slide component:

<BackgroundLayer
  backgroundId={backgroundId}       // passed from SlideRenderer
  color={palette.text}              // draw in text color — auto matches theme
  width={size}
  height={size * 1.25}
/>
```

### Pass backgroundId from the editor page

```jsx
// app/editor/page.jsx

const { template, backgroundId, setBackgroundId, ... } = useCarousel()

// In the render:
<SlideRenderer
  template={template}
  slide={slides[activeSlide]}
  index={activeSlide}
  total={slides.length}
  creator={creator}
  size={400}
  backgroundId={backgroundId}   // ← add this
/>

// In the right panel sidebar — add BackgroundPicker:
<BackgroundPicker
  activeId={backgroundId}
  onSelect={setBackgroundId}
  slideColor={template.palette.bg}  // so preview matches template color
/>
```

---

## 8. How the Carousel Slide Uses a Background

Here is the complete rendering stack inside a slide div, showing exactly how all three layers work together:

```jsx
// The complete layer stack in any slide component

<div
  style={{
    // ── Layer 0: Base color ──────────────────────────────────
    backgroundColor: palette.bg,

    // Layout
    width: size,
    height: size * 1.25,
    borderRadius: cornerRadius,
    position: "relative",    // REQUIRED: makes absolute children position to this
    overflow: "hidden",       // REQUIRED: clips bg pattern to slide bounds
    padding: size * 0.07,
    boxSizing: "border-box",
  }}
>
  {/* ── Layer 1: Background pattern ───────────────────────── */}
  <BackgroundLayer
    backgroundId={backgroundId}
    color={palette.text}           // uses text color so it adapts to dark/light themes
    width={size}
    height={size * 1.25}
    // Internally: position: absolute; inset: 0; z-index: 1; pointer-events: none
  />

  {/* ── Layer 2: Content ──────────────────────────────────── */}
  <div style={{ position: "relative", zIndex: 2 }}>
    {/* tagline, title, paragraph, badge, CTA, creator info */}
  </div>
</div>
```

### Why `color={palette.text}` Is the Right Choice

You might wonder why we don't use a fixed white or gray. The answer is that templates vary:

- A **light template** (white bg) has `palette.text = "#111111"` → the pattern draws in dark at low opacity = subtle dark lines on white ✓
- A **dark template** (black bg) has `palette.text = "#FFFFFF"` → the pattern draws in white at low opacity = subtle light lines on black ✓

This single prop makes the background self-adapt to any template automatically.

---

## 9. Adding New Backgrounds

Three steps, no component changes needed.

**Step 1** — Create the background file:

```jsx
// lib/backgrounds/myBackground.jsx

export function MyBackgroundBg({ color = "#ffffff", width = 400, height = 500 }) {
  return (
    <svg
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      {/* Your SVG content here */}
      {/* Use color prop for stroke/fill. Keep opacity between 0.1 and 0.25 */}
    </svg>
  )
}

// 60x60 preview SVG string for the picker thumbnail
export const myBackgroundPreview = `
<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
  <!-- Small version of your pattern -->
</svg>
`
```

**Step 2** — Register in the index:

```js
// lib/backgrounds/index.js
import { MyBackgroundBg, myBackgroundPreview } from "./myBackground"

export const BACKGROUNDS = [
  // ... existing entries
  {
    id:       "my-background",
    name:     "My Background",
    category: "geometric",       // "geometric" | "organic" | "illustrative"
    preview:  myBackgroundPreview,
    render:   MyBackgroundBg,
  },
]
```

**Step 3** — Done. It appears in the picker immediately.

---

## 10. Performance Notes

### SVG vs Canvas

All 10 backgrounds use pure SVG — no canvas, no WebGL, no external libraries. This has several advantages:

- **Zero dependencies** — no npm packages needed
- **CSS transitions work** — you can fade backgrounds in/out with CSS opacity
- **html2canvas compatible** — SVG inside a div is captured correctly by html2canvas for export
- **No flicker** — SVG renders synchronously with the DOM, no async frame delay

### Pattern-based vs Computed

Backgrounds 1–5 and 7 use SVG `<pattern>` with `patternUnits="userSpaceOnUse"`. This means the browser tiles the pattern internally with near-zero CPU cost, regardless of slide size.

Backgrounds 6, 8, 9, 10 compute element positions in JavaScript but only run when `width` or `height` props change — they do not re-run on every render if you memoize correctly:

```jsx
// Memoize computed backgrounds to avoid re-running path calculations on re-render
import { useMemo } from "react"

function NodeVoyageBg({ color, width, height }) {
  const { nodes, connections } = useMemo(
    () => computeNodes(width, height),
    [width, height]   // only recompute if size changes
  )
  // ...
}
```

### Export Quality

When exporting slides via html2canvas, set `scale: 2` to get 2x resolution (retina quality). The SVG backgrounds scale perfectly at any resolution since they use `width` and `height` props passed explicitly — they are not CSS-scaled, they are rendered at the correct pixel dimensions.

---

## Quick Reference

| You want to... | Where |
|---|---|
| Add a background to a slide | Pass `backgroundId` prop to `SlideRenderer` |
| Change background pattern color | It uses `palette.text` automatically |
| Register a new background | Add entry to `BACKGROUNDS` array in `lib/backgrounds/index.js` |
| Show background picker in UI | Drop in `<BackgroundPicker>` component |
| Make background denser/sparser | Edit `spacing`, `lineSpacing`, or `nodeCount` in the background file |
| Make background more/less visible | Edit `strokeOpacity` / `fillOpacity` values in the background file |
| Animate background | Wrap SVG elements in CSS animations (keyframes on stroke-dashoffset, transform, etc.) |
| Export slides with background | Use html2canvas at scale 2 — SVG is captured correctly |
