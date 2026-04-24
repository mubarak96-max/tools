'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { 
  Type, AlignLeft, Copy, Check, RefreshCcw, Smartphone, Monitor, 
  AlertCircle, CheckCircle2, XCircle, Info, Save, Trash2, Download,
  Search, Bold, Code, Eye, Zap, ChevronRight, Share2, MessageSquare, ExternalLink
} from 'lucide-react'

// --- Types ---
interface SnippetAnalysis {
  title: {
    charCount: number
    pixelWidth: number
    desktopTruncated: boolean
    mobileTruncated: boolean
    score: number
  }
  description: {
    charCount: number
    wordCount: number
    pixelWidth: number
    desktopTruncated: boolean
    mobileTruncated: boolean
    score: number
  }
  combined: {
    score: number
    rewriteRisk: 'low' | 'medium' | 'high'
    checks: {
      titleLength: 'good' | 'warning' | 'bad'
      descLength: 'good' | 'warning' | 'bad'
      mobileSafe: 'good' | 'warning' | 'bad'
      hasCTA: 'good' | 'warning' | 'bad'
      hasKeyword: 'good' | 'warning' | 'bad'
      unique: 'good' | 'warning' | 'bad'
      noSpecialChars: 'good' | 'warning' | 'bad'
    }
  }
}

// --- Constants ---
const TITLE_DESKTOP_LIMIT = 600
const TITLE_MOBILE_LIMIT = 520
const DESC_DESKTOP_LIMIT = 920
const DESC_MOBILE_LIMIT = 680

const CTAS = [
  'learn more','get started','shop now','discover how','find out',
  'read more','download now','try free','book now','contact us',
  'call today','get quote','see pricing','explore','check out'
]

const SPECIAL_CHAR_PATTERN = /[☆©®™♥★☀]/u

// --- Pixel measurement hook ---
function usePixelWidth() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  
  const measure = useCallback((text: string, font: string) => {
    if (typeof window === 'undefined') return text.length * 8
    if (!canvasRef.current) canvasRef.current = document.createElement('canvas')
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return text.length * 8
    ctx.font = font
    return ctx.measureText(text).width
  }, [])

  return measure
}

// --- Bold simulation: keywords in description get ~10% wider ---
function simulateBoldWidth(text: string, keyword: string, measure: (t: string, f: string) => number, font: string): number {
  if (!keyword.trim()) return measure(text, font)
  const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  let total = 0
  parts.forEach((part, i) => {
    // Even indices = normal text, odd indices = matched keyword (bold)
    const isMatch = i % 2 === 1
    const partFont = isMatch ? font.replace(/(\d+px)/, (m) => `bold ${m}`) : font
    total += measure(part, partFont)
  })
  return total
}

export function MetaDescriptionTool() {
  const [title, setTitle] = useState('How to Bake a Cake: 10 Easy Steps for Beginners | CakeMaster')
  const [description, setDescription] = useState('Learn how to bake a cake from scratch with our simple 10-step guide. Perfect for beginners, this tutorial covers ingredients, mixing, and baking tips. Get started today!')
  const [keyword, setKeyword] = useState('bake a cake')
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop')
  const [copied, setCopied] = useState(false)
  const [savedSnippets, setSavedSnippets] = useState<{title: string, desc: string}[]>([])
  const measureWidth = usePixelWidth()

  // Analysis
  const analysis: SnippetAnalysis = useMemo(() => {
    const titleFont = '18px Arial, "Helvetica Neue", sans-serif'
    const descFont = '14px Arial, "Helvetica Neue", sans-serif'
    
    const titlePixelWidth = measureWidth(title, titleFont)
    const descPixelWidth = simulateBoldWidth(description, keyword, measureWidth, descFont)
    
    const titleDesktopTruncated = titlePixelWidth > TITLE_DESKTOP_LIMIT
    const titleMobileTruncated = titlePixelWidth > TITLE_MOBILE_LIMIT
    const descDesktopTruncated = descPixelWidth > DESC_DESKTOP_LIMIT
    const descMobileTruncated = descPixelWidth > DESC_MOBILE_LIMIT

    const lowerDesc = description.toLowerCase()
    const hasCTA = CTAS.some(c => lowerDesc.includes(c))
    const hasKeyword = keyword.length > 1 && lowerDesc.includes(keyword.toLowerCase())
    const hasSpecial = SPECIAL_CHAR_PATTERN.test(description) || SPECIAL_CHAR_PATTERN.test(title)
    
    // Title score
    let titleScore = 0
    if (titlePixelWidth > 0) {
      if (titlePixelWidth <= TITLE_DESKTOP_LIMIT) titleScore += 40
      else if (titlePixelWidth <= TITLE_DESKTOP_LIMIT + 50) titleScore += 20
      else titleScore += 5
      if (titlePixelWidth <= TITLE_MOBILE_LIMIT) titleScore += 30
      else if (titlePixelWidth <= TITLE_MOBILE_LIMIT + 40) titleScore += 15
      if (title.length >= 30 && title.length <= 60) titleScore += 20
      if (/[|\-–:]/.test(title)) titleScore += 10
    }

    // Desc score
    let descScore = 0
    if (description.length > 0) {
      if (descPixelWidth <= DESC_DESKTOP_LIMIT) descScore += 30
      else if (descPixelWidth <= DESC_DESKTOP_LIMIT + 60) descScore += 15
      if (descPixelWidth <= DESC_MOBILE_LIMIT) descScore += 25
      else if (descPixelWidth <= DESC_MOBILE_LIMIT + 50) descScore += 10
      if (description.length >= 120 && description.length <= 158) descScore += 20
      else if (description.length >= 70 && description.length <= 170) descScore += 10
      if (hasCTA) descScore += 15
      if (hasKeyword) descScore += 10
    }

    const combinedScore = title.length > 0 || description.length > 0 
      ? Math.round((titleScore + descScore) / 1.5) 
      : 0

    // Rewrite risk
    let rewriteRisk: 'low' | 'medium' | 'high' = 'medium'
    if (description.length < 50 || description.length > 170) rewriteRisk = 'high'
    else if (!hasKeyword && keyword.length > 1) rewriteRisk = 'medium'
    else if (hasSpecial) rewriteRisk = 'medium'
    else if (descPixelWidth <= DESC_MOBILE_LIMIT && hasCTA && description.length >= 120) rewriteRisk = 'low'

    return {
      title: {
        charCount: title.length,
        pixelWidth: Math.round(titlePixelWidth),
        desktopTruncated: titleDesktopTruncated,
        mobileTruncated: titleMobileTruncated,
        score: Math.min(100, titleScore)
      },
      description: {
        charCount: description.length,
        wordCount: description.trim() ? description.trim().split(/\s+/).length : 0,
        pixelWidth: Math.round(descPixelWidth),
        desktopTruncated: descDesktopTruncated,
        mobileTruncated: descMobileTruncated,
        score: Math.min(100, descScore)
      },
      combined: {
        score: Math.min(100, combinedScore),
        rewriteRisk,
        checks: {
          titleLength: titlePixelWidth <= TITLE_DESKTOP_LIMIT && titlePixelWidth > 0 ? 'good' : titlePixelWidth <= TITLE_DESKTOP_LIMIT + 60 ? 'warning' : title.length > 0 ? 'bad' : 'warning',
          descLength: descPixelWidth <= DESC_DESKTOP_LIMIT && description.length > 0 ? 'good' : descPixelWidth <= DESC_DESKTOP_LIMIT + 80 ? 'warning' : description.length > 0 ? 'bad' : 'warning',
          mobileSafe: descPixelWidth <= DESC_MOBILE_LIMIT && titlePixelWidth <= TITLE_MOBILE_LIMIT && description.length > 0 ? 'good' : 'warning',
          hasCTA: hasCTA ? 'good' : description.length > 0 ? 'warning' : 'warning',
          hasKeyword: hasKeyword ? 'good' : keyword.length > 1 ? 'warning' : 'warning',
          unique: description.length > 20 ? 'good' : 'warning',
          noSpecialChars: !hasSpecial ? 'good' : 'bad'
        }
      }
    }
  }, [title, description, keyword, measureWidth])

  const handleCopyHTML = async () => {
    const html = `<title>${title.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</title>\n<meta name="description" content="${description.replace(/"/g, '&quot;')}">`
    await navigator.clipboard.writeText(html)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const saveSnippet = () => {
    if (!title.trim() && !description.trim()) return
    const exists = savedSnippets.some(s => s.title === title && s.desc === description)
    if (exists) return
    setSavedSnippets(prev => [{ title, desc: description }, ...prev].slice(0, 5))
  }

  const loadSnippet = (s: {title: string, desc: string}) => {
    setTitle(s.title)
    setDescription(s.desc)
  }

  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-green-600 dark:text-green-400'
    if (s >= 50) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getScoreBg = (s: number) => {
    if (s >= 80) return 'bg-green-600'
    if (s >= 50) return 'bg-yellow-500'
    return 'bg-red-600'
  }

  const getStatusIcon = (status: 'good' | 'warning' | 'bad') => {
    if (status === 'good') return <CheckCircle2 className="h-4 w-4 text-green-600" />
    if (status === 'warning') return <AlertCircle className="h-4 w-4 text-yellow-600" />
    return <XCircle className="h-4 w-4 text-red-600" />
  }

  const getRewriteColor = (risk: string) => {
    if (risk === 'low') return 'text-green-600 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/30'
    if (risk === 'medium') return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900/30'
    return 'text-red-600 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/30'
  }

  // Truncated text preview
  const getTruncatedText = (text: string, limit: number, font: string) => {
    if (!text) return text
    let low = 0, high = text.length, best = 0
    while (low <= high) {
      const mid = Math.floor((low + high) / 2)
      const w = measureWidth(text.slice(0, mid), font)
      if (w <= limit) { best = mid; low = mid + 1 }
      else { high = mid - 1 }
    }
    // Round to nearest word if truncated
    if (best < text.length) {
      while (best > 0 && text[best] !== ' ') best--
      return text.slice(0, best).trim() + ' ...'
    }
    return text
  }

  const titleTruncated = device === 'desktop' 
    ? getTruncatedText(title, TITLE_DESKTOP_LIMIT, '18px Arial, sans-serif')
    : getTruncatedText(title, TITLE_MOBILE_LIMIT, '18px Arial, sans-serif')

  const descLimit = device === 'desktop' ? DESC_DESKTOP_LIMIT : DESC_MOBILE_LIMIT
  const descTruncated = getTruncatedText(description, descLimit, '14px Arial, sans-serif')

  // Highlight keywords in preview
  const highlightKeyword = (text: string, kw: string) => {
    if (!kw.trim() || !text) return text
    const regex = new RegExp(`(${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    return text.split(regex).map((part, i) => 
      i % 2 === 1 ? <strong key={i} className="font-bold text-neutral-900 dark:text-white">{part}</strong> : part
    )
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="grid lg:grid-cols-5 gap-8">
        {/* LEFT: Inputs (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Title Input */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                <Type className="h-4 w-4 text-blue-600" />
                Title Tag
              </label>
              <div className="flex gap-2">
                <button onClick={saveSnippet} className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors" title="Save snippet">
                  <Save className="h-4 w-4" />
                </button>
                <button onClick={() => setTitle('')} className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors" title="Clear">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your page title..."
              className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 p-4 text-lg font-semibold text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
            />
            <div className="mt-3 flex items-center justify-between text-sm">
              <div className="flex gap-4">
                <span className={`font-medium ${analysis.title.desktopTruncated ? 'text-red-600' : 'text-green-600'}`}>
                  {analysis.title.charCount} chars
                </span>
                <span className="text-neutral-500">~{analysis.title.pixelWidth}px</span>
                {analysis.title.desktopTruncated && (
                  <span className="text-red-600 text-xs flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> Truncates on desktop
                  </span>
                )}
              </div>
            </div>
            
            {/* Title pixel bar */}
            <div className="mt-3 relative h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div 
                className={`absolute top-0 h-full rounded-full transition-all duration-300 ${analysis.title.desktopTruncated ? 'bg-red-500' : analysis.title.mobileTruncated ? 'bg-yellow-500' : 'bg-green-500'}`}
                style={{ width: `${Math.min((analysis.title.pixelWidth / TITLE_DESKTOP_LIMIT) * 100, 100)}%` }}
              />
              <div className="absolute top-0 h-full w-0.5 bg-neutral-400" style={{ left: `${(TITLE_MOBILE_LIMIT / TITLE_DESKTOP_LIMIT) * 100}%` }} />
            </div>
            <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
              <span>0px</span>
              <span className="text-neutral-500">Mobile {TITLE_MOBILE_LIMIT}px</span>
              <span>Desktop {TITLE_DESKTOP_LIMIT}px</span>
            </div>
          </div>

          {/* Description Input */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                <AlignLeft className="h-4 w-4 text-blue-600" />
                Meta Description
              </label>
              <div className="flex gap-2">
                <button onClick={() => setDescription('')} className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors" title="Clear">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter your meta description..."
              rows={4}
              className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 p-4 text-base text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
            />
            <div className="mt-3 flex items-center justify-between text-sm">
              <div className="flex gap-4">
                <span className={`font-medium ${analysis.description.desktopTruncated ? 'text-red-600' : 'text-green-600'}`}>
                  {analysis.description.charCount} chars
                </span>
                <span className="text-neutral-500">~{analysis.description.pixelWidth}px</span>
                {analysis.description.desktopTruncated && (
                  <span className="text-red-600 text-xs flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> Truncates on desktop
                  </span>
                )}
              </div>
              <span className="text-neutral-400">{analysis.description.wordCount} words</span>
            </div>
            
            {/* Desc pixel bar */}
            <div className="mt-3 relative h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div 
                className={`absolute top-0 h-full rounded-full transition-all duration-300 ${analysis.description.desktopTruncated ? 'bg-red-500' : analysis.description.mobileTruncated ? 'bg-yellow-500' : 'bg-green-500'}`}
                style={{ width: `${Math.min((analysis.description.pixelWidth / DESC_DESKTOP_LIMIT) * 100, 100)}%` }}
              />
              <div className="absolute top-0 h-full w-0.5 bg-neutral-400" style={{ left: `${(DESC_MOBILE_LIMIT / DESC_DESKTOP_LIMIT) * 100}%` }} />
            </div>
            <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
              <span>0px</span>
              <span className="text-neutral-500">Mobile {DESC_MOBILE_LIMIT}px</span>
              <span>Desktop {DESC_DESKTOP_LIMIT}px</span>
            </div>
          </div>

          {/* Settings & Keyword */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
              <label className="text-sm font-semibold text-neutral-900 dark:text-white mb-3 block flex items-center gap-2">
                <Search className="h-4 w-4 text-blue-600" />
                Target Keyword
              </label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Simulate bolding..."
                className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 p-3 text-sm text-neutral-900 dark:text-white outline-none focus:border-blue-500 transition-all"
              />
              <p className="mt-2 text-[10px] text-neutral-400">Shows how Google bolds matching terms (increases pixel width).</p>
            </div>
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
              <label className="text-sm font-semibold text-neutral-900 dark:text-white mb-3 block flex items-center gap-2">
                <Monitor className="h-4 w-4 text-blue-600" />
                Preview Mode
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setDevice('desktop')}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-all ${device === 'desktop' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'}`}
                >
                  <Monitor className="h-4 w-4" /> Desktop
                </button>
                <button
                  onClick={() => setDevice('mobile')}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-all ${device === 'mobile' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'}`}
                >
                  <Smartphone className="h-4 w-4" /> Mobile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Preview & Scores (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* SEO Score Circle */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm text-center">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">Snippet Quality Score</h3>
            <div className="relative inline-flex items-center justify-center">
              <svg className="h-32 w-32 transform -rotate-90">
                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-neutral-100 dark:text-neutral-800" />
                <circle
                  cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="10" fill="transparent"
                  strokeDasharray={364.4}
                  strokeDashoffset={364.4 - (364.4 * analysis.combined.score) / 100}
                  strokeLinecap="round"
                  className={`transition-all duration-1000 ${getScoreColor(analysis.combined.score).replace('text-', 'stroke-')}`}
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className={`text-3xl font-bold ${getScoreColor(analysis.combined.score)}`}>{analysis.combined.score}</span>
                <span className="text-[10px] uppercase tracking-wider text-neutral-400">Score</span>
              </div>
            </div>
            
            <div className={`mt-4 rounded-xl border p-3 flex items-center justify-center gap-2 ${getRewriteColor(analysis.combined.rewriteRisk)}`}>
              <RefreshCcw className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase">Rewrite Risk: {analysis.combined.rewriteRisk}</span>
            </div>
          </div>

          {/* SERP Preview Card */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                <Eye className="h-4 w-4 text-blue-600" />
                Live SERP Preview
              </h3>
            </div>
            
            <div className="rounded-xl border border-neutral-100 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900">
              <div className={device === 'mobile' ? 'max-w-[360px] mx-auto' : 'w-full'}>
                {/* URL */}
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="h-4 w-4 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-[10px] text-neutral-500">G</div>
                  <div className="flex items-center text-xs text-neutral-600 dark:text-neutral-400 truncate">
                    <span>findbest.tools</span>
                    <ChevronRight className="h-3 w-3" />
                    <span>seo</span>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-neutral-500">checker</span>
                  </div>
                </div>
                
                {/* Title */}
                <div className={`text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer leading-tight mb-1 ${device === 'mobile' ? 'text-lg font-normal' : 'text-xl font-normal font-arial'}`}>
                  {title ? titleTruncated : 'Please enter a title...'}
                </div>
                
                {/* Description */}
                <div className="text-sm text-neutral-700 dark:text-neutral-300 leading-normal line-clamp-3">
                  {description ? highlightKeyword(descTruncated, keyword) : 'Please enter a meta description to see how it will appear in search results...'}
                </div>
              </div>
            </div>
            
            <button
              onClick={handleCopyHTML}
              className={`mt-4 w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all ${copied ? 'bg-green-600 text-white' : 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:opacity-90'}`}
            >
              {copied ? <Check className="h-4 w-4" /> : <Code className="h-4 w-4" />}
              {copied ? 'Copied HTML!' : 'Copy Meta Tags (HTML)'}
            </button>
          </div>

          {/* Analysis Checks */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">SEO Checklist</h3>
            <div className="space-y-3">
              {[
                { id: 'titleLength', label: 'Optimal Title Width' },
                { id: 'descLength', label: 'Optimal Description Width' },
                { id: 'mobileSafe', label: 'Mobile SERP Safe' },
                { id: 'hasCTA', label: 'Includes Call-to-Action' },
                { id: 'hasKeyword', label: 'Target Keyword Included' },
                { id: 'noSpecialChars', label: 'Clean Typography' },
                { id: 'unique', label: 'Sufficient Content' },
              ].map((check) => (
                <div key={check.id} className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600 dark:text-neutral-400">{check.label}</span>
                  {getStatusIcon(analysis.combined.checks[check.id as keyof typeof analysis.combined.checks])}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
