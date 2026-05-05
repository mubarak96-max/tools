# Quotecraft — Beautiful Quote Image Generator

Create stunning quote images with background photos from Unsplash. Select backgrounds, search or write your own quotes, customize the style, and download as high-quality PNG.

## Features

- 🖼 **Browse Unsplash** — Search thousands of high-quality images
- 🔗 **Custom Image URL** — Use any image from the web
- 💬 **Quote Search** — Search quotes by keyword via Quotable API
- ✍️ **Custom Quotes** — Write your own quote and author
- 🎨 **Style Controls** — Adjust font, size, overlay, colors, alignment, position
- 📥 **Download PNG** — Export at 2x resolution for crisp images
- 📱 **Responsive** — Works on mobile and desktop

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.local.example .env.local
# Edit .env.local and add your Unsplash API key

# 3. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Getting an Unsplash API Key

1. Go to [https://unsplash.com/developers](https://unsplash.com/developers)
2. Click "Register as a developer"
3. Create a new application
4. Copy the **Access Key**
5. Paste it into `.env.local` as `UNSPLASH_ACCESS_KEY`

> **Note:** The app includes 6 curated fallback images if no API key is set, so you can test it without one.

## Project Structure

```
quote-generator/
├── app/
│   ├── api/
│   │   ├── unsplash/route.ts    # Unsplash proxy (hides API key)
│   │   └── quotes/route.ts      # Quotable.io proxy
│   ├── page.tsx                 # Main app page
│   ├── layout.tsx               # Root layout with fonts
│   └── globals.css              # Global styles & design tokens
├── components/
│   ├── ImagePicker.tsx          # Unsplash grid + custom URL input
│   ├── QuoteSearch.tsx          # Quote search + custom quote
│   ├── StyleControls.tsx        # All style customization controls
│   ├── QuoteCanvas.tsx          # Live preview canvas (exported)
│   └── DownloadButton.tsx       # html2canvas download logic
└── lib/
    └── types.ts                 # Shared TypeScript types
```

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **html2canvas** — screenshot the preview element
- **Unsplash API** — background images
- **Quotable API** — public domain quotes

## License

MIT
