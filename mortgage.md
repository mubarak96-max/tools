# Mortgage Calculator — Next.js Implementation Guide
### For a Multi-Tool Site at `/free-tools/mortgage-calculator`

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [File & Folder Structure](#2-file--folder-structure)
3. [Step 1 — Calculation Logic](#3-step-1--calculation-logic)
4. [Step 2 — Currency Config](#4-step-2--currency-config)
5. [Step 3 — Types](#5-step-3--types)
6. [Step 4 — Client Component (MortgageCalculator.tsx)](#6-step-4--client-component-mortgagecalculatortsx)
7. [Step 5 — Page (SSR + SEO)](#7-step-5--page-ssr--seo)
8. [Step 6 — Shared Tools Layout](#8-step-6--shared-tools-layout)
9. [Step 7 — Free Tools Index Page](#9-step-7--free-tools-index-page)
10. [Step 8 — Sitemap Integration](#10-step-8--sitemap-integration)
11. [Step 9 — Robots.txt](#11-step-9--robotstxt)
12. [SEO Strategy — Multi-Tool Site](#12-seo-strategy--multi-tool-site)
13. [Regional Keyword Targeting](#13-regional-keyword-targeting)
14. [On-Page SEO Checklist](#14-on-page-seo-checklist)
15. [Post-Launch Checklist](#15-post-launch-checklist)

---

## 1. Project Overview

**Goal:** Build a mortgage calculator as one tool within a larger multi-tool Next.js site. The tool must:

- Live at `yoursite.com/free-tools/mortgage-calculator`
- Default to USD, with currency options for EUR, GBP, AED, and INR
- Be fully server-side rendered for SEO
- Rank globally targeting the USA, Europe (UK/EU), and Asia (India/UAE)
- Integrate cleanly with the rest of your tools site (shared layout, internal linking)

Unlike a simple EMI calculator, this mortgage calculator should estimate the **full monthly home payment**, not just principal and interest.

It should include:

- Home price
- Down payment
- Loan amount
- Interest rate
- Loan term
- Property tax
- Home insurance
- HOA fee
- PMI
- Full amortization schedule

**Tech Stack:** Next.js 14+ (App Router), TypeScript, Tailwind CSS (optional)

---

## 2. File & Folder Structure

Add the following to your existing Next.js project. Do **not** create a new project.

```txt
your-nextjs-project/
├── app/
│   ├── free-tools/
│   │   ├── layout.tsx                        ← Shared tools layout
│   │   ├── page.tsx                          ← /free-tools hub page
│   │   └── mortgage-calculator/
│   │       ├── page.tsx                      ← SSR page: metadata, JSON-LD, SEO content
│   │       └── components/
│   │           └── MortgageCalculator.tsx   ← "use client" interactive component
│   └── sitemap.ts                            ← Add mortgage entry here
│
├── lib/
│   └── tools/
│       └── mortgage.ts                       ← Pure calculation logic (no React)
│
└── types/
    └── tools.ts                              ← Shared TypeScript types