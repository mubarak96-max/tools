'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { 
  Type, Image, Copy, Check, RefreshCcw, Smartphone, Monitor, LayoutList, 
  Tv, AlertCircle, CheckCircle2, XCircle, Info, Upload, Eye, EyeOff,
  Download, Trash2, Save
} from 'lucide-react'

// --- Types ---
interface TitleAnalysis {
  charCount: number
  wordCount: number
  pixelWidth: number
  mobileTruncated: boolean
  desktopTruncated: boolean
  suggestedTruncated: boolean
  score: number
  checks: {
    length: 'good' | 'warning' | 'bad'
    keywordFront: 'good' | 'warning' | 'bad'
    powerWords: 'good' | 'warning' | 'bad'
    numbers: 'good' | 'warning' | 'bad'
    brackets: 'good' | 'warning' | 'bad'
    clickbait: 'good' | 'warning' | 'bad'
    emojiCount: number
  }
}

interface ThumbnailData {
  file: File
  url: string
  width: number
  height: number
  sizeMB: number
  format: string
}

// --- Constants ---
const MAX_TITLE_CHARS = 100
const OPTIMAL_MIN = 50
const OPTIMAL_MAX = 60
const MOBILE_PIXEL_CUTOFF = 310
const DESKTOP_PIXEL_CUTOFF = 500
const SUGGESTED_PIXEL_CUTOFF = 390

const POWER_WORDS = [
  'ultimate','complete','essential','proven','secret','exclusive','official',
  'guaranteed','instant','free','new','best','top','easy','quick','simple',
  'hack','trick','guide','tutorial','review','vs','versus','update','2026','2025'
]

const CLICKBAIT_PATTERNS = [
  /you won't believe/i, /shocking/i, /this is crazy/i, /omg/i, /mind blowing/i,
  /click here/i, /dont click/i, /wait for it/i, /gone wrong/i
]

// --- Utility: Measure pixel width via canvas ---
function usePixelWidth() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  
  const measure = useCallback((text: string, font = '16px Roboto, sans-serif') => {
    if (typeof window === 'undefined') return text.length * 9
    
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas')
    }
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return text.length * 9
    ctx.font = font
    return ctx.measureText(text).width
  }, [])

  return measure
}

// --- Component ---
export function YouTubeSEOTool() {
  const [title, setTitle] = useState('')
  const [thumbnail, setThumbnail] = useState<ThumbnailData | null>(null)
  const [activeTab, setActiveTab] = useState<'title' | 'thumbnail'>('title')
  const [copied, setCopied] = useState(false)
  const [showSafeZone, setShowSafeZone] = useState(true)
  const [previewContext, setPreviewContext] = useState<'search' | 'home' | 'suggested' | 'mobile'>('search')
  const [savedTitles, setSavedTitles] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const measureWidth = usePixelWidth()

  // Title Analysis
  const analysis: TitleAnalysis = useMemo(() => {
    const charCount = title.length
    const wordCount = title.trim() ? title.trim().split(/\s+/).length : 0
    const pixelWidth = measureWidth(title, 'bold 16px Roboto, "Segoe UI", sans-serif')
    
    const hasKeywordFront = title.length > 0 // Simplified; user can interpret their own keyword
    const lower = title.toLowerCase()
    const hasPowerWords = POWER_WORDS.some(w => lower.includes(w))
    const hasNumbers = /\d/.test(title)
    const hasBrackets = /[\[\]\(\)\{\}]/.test(title)
    const clickbaitDetected = CLICKBAIT_PATTERNS.some(p => p.test(title))
    const emojiCount = Array.from(title).filter(c => /\p{Emoji}/u.test(c)).length

    // Score calculation
    let score = 0
    if (charCount >= OPTIMAL_MIN && charCount <= OPTIMAL_MAX) score += 25
    else if (charCount >= 40 && charCount <= 70) score += 15
    else if (charCount > 0) score += 5

    if (hasKeywordFront) score += 20
    if (hasPowerWords) score += 15
    if (hasNumbers) score += 15
    if (hasBrackets) score += 15
    if (!clickbaitDetected) score += 10
    else score -= 10

    if (emojiCount > 3) score -= 10
    if (charCount > 80) score -= 10

    score = Math.max(0, Math.min(100, score))

    return {
      charCount,
      wordCount,
      pixelWidth,
      mobileTruncated: pixelWidth > MOBILE_PIXEL_CUTOFF,
      desktopTruncated: pixelWidth > DESKTOP_PIXEL_CUTOFF,
      suggestedTruncated: pixelWidth > SUGGESTED_PIXEL_CUTOFF,
      score,
      checks: {
        length: charCount >= OPTIMAL_MIN && charCount <= OPTIMAL_MAX ? 'good' : charCount >= 40 && charCount <= 80 ? 'warning' : 'bad',
        keywordFront: title.length > 5 ? 'good' : 'warning',
        powerWords: hasPowerWords ? 'good' : 'warning',
        numbers: hasNumbers ? 'good' : 'warning',
        brackets: hasBrackets ? 'good' : 'warning',
        clickbait: clickbaitDetected ? 'bad' : 'good',
        emojiCount
      }
    }
  }, [title, measureWidth])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(title)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    const url = URL.createObjectURL(file)
    const img = new window.Image()
    img.onload = () => {
      setThumbnail({
        file,
        url,
        width: img.width,
        height: img.height,
        sizeMB: file.size / (1024 * 1024),
        format: file.type.split('/')[1].toUpperCase()
      })
    }
    img.src = url
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0])
  }

  const saveTitle = () => {
    if (!title.trim() || savedTitles.includes(title)) return
    setSavedTitles(prev => [title, ...prev].slice(0, 5))
  }

  const getScoreColor = (s: number) => {
    if (s >= 85) return 'text-green-600 dark:text-green-400'
    if (s >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getScoreBg = (s: number) => {
    if (s >= 85) return 'bg-green-600'
    if (s >= 60) return 'bg-yellow-500'
    return 'bg-red-600'
  }

  const getStatusIcon = (status: 'good' | 'warning' | 'bad') => {
    if (status === 'good') return <CheckCircle2 className="h-4 w-4 text-green-600" />
    if (status === 'warning') return <AlertCircle className="h-4 w-4 text-yellow-600" />
    return <XCircle className="h-4 w-4 text-red-600" />
  }

  // Preview dimensions
  const previewSizes = {
    search: { w: 360, h: 202, titleW: 360 },
    home: { w: 320, h: 180, titleW: 320 },
    suggested: { w: 168, h: 94, titleW: 168 },
    mobile: { w: 116, h: 65, titleW: 116 }
  }

  return (
    <div className="mx-auto max-w-6xl">
      {/* Tab Switcher */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-full bg-neutral-100 dark:bg-neutral-800 p-1">
          <button
            onClick={() => setActiveTab('title')}
            className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-all ${
              activeTab === 'title' 
                ? 'bg-white dark:bg-neutral-700 text-red-600 dark:text-red-400 shadow-sm' 
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Type className="h-4 w-4" />
            Title Analyzer
          </button>
          <button
            onClick={() => setActiveTab('thumbnail')}
            className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-all ${
              activeTab === 'thumbnail' 
                ? 'bg-white dark:bg-neutral-700 text-red-600 dark:text-red-400 shadow-sm' 
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Image className="h-4 w-4" />
            Thumbnail Preview
          </button>
        </div>
      </div>

      {activeTab === 'title' ? (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* LEFT: Input & Analysis */}
          <div className="space-y-6">
            {/* Input Card */}
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                  <Type className="h-4 w-4 text-red-600" />
                  Video Title
                </label>
                <div className="flex gap-2">
                  <button 
                    onClick={saveTitle}
                    className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors"
                    title="Save variation"
                  >
                    <Save className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => setTitle('')}
                    className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors"
                    title="Clear"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <textarea
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, MAX_TITLE_CHARS))}
                placeholder="Enter your YouTube title here..."
                className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 p-4 text-lg font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all resize-none"
                rows={3}
              />
              
              <div className="mt-3 flex items-center justify-between text-sm">
                <div className="flex gap-4">
                  <span className={`font-medium ${
                    analysis.charCount > MAX_TITLE_CHARS ? 'text-red-600' : 
                    analysis.charCount > OPTIMAL_MAX ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {analysis.charCount}/{MAX_TITLE_CHARS} chars
                  </span>
                  <span className="text-neutral-500">{analysis.wordCount} words</span>
                  <span className="text-neutral-500">~{Math.round(analysis.pixelWidth)}px wide</span>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              {/* Saved variations */}
              {savedTitles.length > 0 && (
                <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                  <p className="text-xs font-medium text-neutral-500 mb-2">Saved Variations</p>
                  <div className="flex flex-wrap gap-2">
                    {savedTitles.map((t, i) => (
                      <button
                        key={i}
                        onClick={() => setTitle(t)}
                        className="text-xs rounded-lg bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors truncate max-w-[200px]"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* SEO Score Card */}
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-neutral-900 dark:text-white">SEO Score</h3>
                <span className={`text-3xl font-bold ${getScoreColor(analysis.score)}`}>
                  {analysis.score}<span className="text-lg text-neutral-400">/100</span>
                </span>
              </div>
              
              <div className="h-3 w-full rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden mb-6">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${getScoreBg(analysis.score)}`}
                  style={{ width: `${analysis.score}%` }}
                />
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Optimal Length (50-60 chars)', status: analysis.checks.length },
                  { label: 'Keyword Front-Loaded', status: analysis.checks.keywordFront },
                  { label: 'Contains Power Words', status: analysis.checks.powerWords },
                  { label: 'Includes Numbers', status: analysis.checks.numbers },
                  { label: 'Uses Brackets/Parentheses', status: analysis.checks.brackets },
                  { label: 'No Clickbait Detected', status: analysis.checks.clickbait },
                ].map((check, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-neutral-50 dark:border-neutral-800 last:border-0">
                    <span className="text-sm text-neutral-700 dark:text-neutral-300">{check.label}</span>
                    {getStatusIcon(check.status)}
                  </div>
                ))}
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">Emoji Count</span>
                  <span className={`text-sm font-medium ${analysis.checks.emojiCount > 3 ? 'text-red-600' : 'text-green-600'}`}>
                    {analysis.checks.emojiCount} {analysis.checks.emojiCount > 3 ? '(too many)' : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div className="rounded-2xl border border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-950/20 p-6">
              <h3 className="font-semibold text-red-900 dark:text-red-400 mb-3 flex items-center gap-2">
                <Info className="h-4 w-4" />
                Optimization Tips
              </h3>
              <ul className="space-y-2 text-sm text-red-800 dark:text-red-300">
                {analysis.charCount < OPTIMAL_MIN && (
                  <li>• Your title is short. Add a modifier like "2026", "Guide", or "Tutorial" to reach 50-60 characters.</li>
                )}
                {analysis.charCount > OPTIMAL_MAX && (
                  <li>• Your title exceeds the optimal range. Consider removing filler words to stay under 60 characters.</li>
                )}
                {!analysis.checks.powerWords && (
                  <li>• Add a power word like "Ultimate", "Complete", or "Proven" to increase CTR.</li>
                )}
                {!analysis.checks.numbers && (
                  <li>• Titles with numbers (e.g., "7 Tips", "2026") typically outperform vague titles.</li>
                )}
                {!analysis.checks.brackets && (
                  <li>• Try adding brackets [like this] — they can increase CTR by making titles stand out.</li>
                )}
                {analysis.checks.clickbait === 'bad' && (
                  <li>• Avoid clickbait patterns. They may hurt watch time and channel trust.</li>
                )}
                {analysis.checks.emojiCount > 3 && (
                  <li>• Reduce emoji usage. Each emoji consumes significant pixel width and can trigger truncation.</li>
                )}
                {analysis.score >= 85 && (
                  <li>• Excellent title! This is well-optimized for both algorithmic indexing and human CTR.</li>
                )}
              </ul>
            </div>
          </div>

          {/* RIGHT: Previews */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                <Eye className="h-4 w-4 text-red-600" />
                Live Previews
              </h3>

              {/* Mobile Preview */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2 text-xs font-medium text-neutral-500">
                  <Smartphone className="h-3.5 w-3.5" />
                  Mobile Home Feed (~35-40 chars visible)
                </div>
                <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 p-3 max-w-[200px]">
                  <div className="aspect-video rounded-lg bg-neutral-200 dark:bg-neutral-800 mb-2" />
                  <div className="text-xs font-medium text-neutral-900 dark:text-white leading-tight line-clamp-2">
                    {title || 'Your video title appears here...'}
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-[10px] text-neutral-500">
                    <div className="h-3 w-3 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                    <span>Channel Name</span>
                    <span>•</span>
                    <span>12K views</span>
                  </div>
                </div>
                {analysis.mobileTruncated && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Truncates on mobile at ~{MOBILE_PIXEL_CUTOFF}px
                  </p>
                )}
              </div>

              {/* Desktop Search Preview */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2 text-xs font-medium text-neutral-500">
                  <Monitor className="h-3.5 w-3.5" />
                  Desktop Search Results (~50-60 chars visible)
                </div>
                <div className="flex gap-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-3">
                  <div className="h-[94px] w-[168px] rounded-lg bg-neutral-200 dark:bg-neutral-800 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-blue-700 dark:text-blue-400 leading-snug line-clamp-2 mb-1">
                      {title || 'Your video title appears here...'}
                    </div>
                    <div className="text-xs text-neutral-500 mb-0.5">YouTube · Channel Name</div>
                    <div className="text-xs text-neutral-500">120K views · 2 days ago</div>
                    <div className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 line-clamp-1">
                      Description snippet appears here based on your video description...
                    </div>
                  </div>
                </div>
                {analysis.desktopTruncated && (
                  <p className="mt-1 text-xs text-yellow-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    May truncate on desktop search at ~{DESKTOP_PIXEL_CUTOFF}px
                  </p>
                )}
              </div>

              {/* Suggested Videos */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2 text-xs font-medium text-neutral-500">
                  <LayoutList className="h-3.5 w-3.5" />
                  Suggested Videos Sidebar
                </div>
                <div className="flex gap-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-2 max-w-[320px]">
                  <div className="h-[94px] w-[168px] rounded-lg bg-neutral-200 dark:bg-neutral-800 flex-shrink-0" />
                  <div className="flex-1 min-w-0 py-0.5">
                    <div className="text-xs font-medium text-neutral-900 dark:text-white leading-tight line-clamp-2 mb-1">
                      {title || 'Your video title...'}
                    </div>
                    <div className="text-[10px] text-neutral-500">Channel Name</div>
                    <div className="text-[10px] text-neutral-500">45K views · 1 week ago</div>
                  </div>
                </div>
              </div>

              {/* Pixel Ruler */}
              <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
                  <span>0px</span>
                  <span>Mobile cutoff</span>
                  <span>Suggested cutoff</span>
                  <span>Desktop cutoff</span>
                </div>
                <div className="relative h-8 bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden">
                  <div 
                    className="absolute top-0 h-full bg-red-600/10 border-r border-red-600"
                    style={{ left: `${(MOBILE_PIXEL_CUTOFF / 700) * 100}%` }}
                  />
                  <div 
                    className="absolute top-0 h-full bg-yellow-500/10 border-r border-yellow-500"
                    style={{ left: `${(SUGGESTED_PIXEL_CUTOFF / 700) * 100}%` }}
                  />
                  <div 
                    className="absolute top-0 h-full bg-green-600/10 border-r border-green-600"
                    style={{ left: `${(DESKTOP_PIXEL_CUTOFF / 700) * 100}%` }}
                  />
                  <div 
                    className="absolute top-0 h-full bg-red-600 transition-all duration-300"
                    style={{ width: `${Math.min((analysis.pixelWidth / 700) * 100, 100)}%`, opacity: 0.3 }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                  <span className="text-red-600 font-medium">Mobile: {MOBILE_PIXEL_CUTOFF}px</span>
                  <span className="text-yellow-600 font-medium">Suggested: {SUGGESTED_PIXEL_CUTOFF}px</span>
                  <span className="text-green-600 font-medium">Desktop: {DESKTOP_PIXEL_CUTOFF}px</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* THUMBNAIL TAB */
        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT COL: Upload / File Analysis */}
          <div className="lg:col-span-1 space-y-6">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              className="hidden"
            />

            {!thumbnail && (
              <div
                className="rounded-2xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-8 text-center transition-colors hover:border-red-400 dark:hover:border-red-600"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <div className="mx-auto h-12 w-12 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center mb-4">
                  <Upload className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">Upload Thumbnail</h3>
                <p className="text-sm text-neutral-500 mb-4">Drag &amp; drop or click to browse</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                >
                  Select Image
                </button>
                <p className="mt-3 text-xs text-neutral-400">JPG, PNG, WebP up to 2MB</p>
              </div>
            )}

            {thumbnail && (
              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">File Analysis</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Dimensions</span>
                    <span className={`font-medium ${thumbnail.width >= 1280 && thumbnail.height >= 720 ? 'text-green-600' : 'text-yellow-600'}`}>
                      {thumbnail.width} &times; {thumbnail.height}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Aspect Ratio</span>
                    <span className={`font-medium ${Math.abs(thumbnail.width / thumbnail.height - 16/9) < 0.05 ? 'text-green-600' : 'text-red-600'}`}>
                      {(thumbnail.width / thumbnail.height).toFixed(2)}:1
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">File Size</span>
                    <span className={`font-medium ${thumbnail.sizeMB <= 2 ? 'text-green-600' : 'text-red-600'}`}>
                      {thumbnail.sizeMB.toFixed(2)} MB
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Format</span>
                    <span className="font-medium text-neutral-900 dark:text-white">{thumbnail.format}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    {thumbnail.width >= 1280 ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-600" />}
                    <span className={thumbnail.width >= 1280 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
                      {thumbnail.width >= 1280 ? 'Width meets recommendation' : 'Width below 1280px'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    {Math.abs(thumbnail.width / thumbnail.height - 16/9) < 0.05 ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-600" />}
                    <span className={Math.abs(thumbnail.width / thumbnail.height - 16/9) < 0.05 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
                      {Math.abs(thumbnail.width / thumbnail.height - 16/9) < 0.05 ? '16:9 aspect ratio correct' : 'Aspect ratio not 16:9'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    {thumbnail.sizeMB <= 2 ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-600" />}
                    <span className={thumbnail.sizeMB <= 2 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
                      {thumbnail.sizeMB <= 2 ? 'Under 2MB limit' : 'Exceeds 2MB limit'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                  >
                    <Upload className="h-4 w-4" />
                    Replace
                  </button>
                  <button
                    onClick={() => { setThumbnail(null); if (fileInputRef.current) fileInputRef.current.value = '' }}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-neutral-200 dark:border-neutral-700 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COL: Preview + Context Switcher below */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                <Eye className="h-4 w-4 text-red-600" />
                {previewContext === 'search' && 'Search Results Preview'}
                {previewContext === 'home' && 'Home Feed Preview'}
                {previewContext === 'suggested' && 'Suggested Videos Preview'}
                {previewContext === 'mobile' && 'Mobile Preview'}
              </h3>

              {!thumbnail ? (
                <div className="flex flex-col items-center justify-center h-[400px] rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-dashed border-neutral-200 dark:border-neutral-800">
                  <Image className="h-12 w-12 text-neutral-300 dark:text-neutral-700 mb-3" />
                  <p className="text-neutral-500">Upload a thumbnail to see previews</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="relative overflow-hidden rounded-xl bg-neutral-900" style={{ width: previewSizes[previewContext].w, maxWidth: '100%' }}>
                    <div className="relative" style={{ width: previewSizes[previewContext].w, height: previewSizes[previewContext].h }}>
                      <img src={thumbnail.url} alt="Thumbnail preview" className="w-full h-full object-cover" />
                      {showSafeZone && (
                        <>
                          <div className="absolute border-2 border-green-500/60 bg-green-500/5" style={{ left: '8%', top: '8%', right: '8%', bottom: '20%' }} />
                          <div className="absolute bottom-0 right-0 bg-red-500/20 border-l-2 border-t-2 border-red-500/60" style={{ width: '25%', height: '20%' }} />
                          <div className="absolute inset-y-0 left-0 w-[4%] bg-red-500/10" />
                          <div className="absolute inset-y-0 right-0 w-[4%] bg-red-500/10" />
                          <div className="absolute top-2 left-2 text-[8px] font-bold text-green-400 bg-black/60 px-1 rounded">SAFE ZONE</div>
                          <div className="absolute bottom-1 right-1 text-[8px] font-bold text-red-400 bg-black/60 px-1 rounded">DURATION OVERLAY</div>
                        </>
                      )}
                      <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-medium px-1 rounded">10:24</div>
                    </div>
                    {previewContext !== 'suggested' && (
                      <div className="p-2 bg-neutral-900">
                        <div className="text-white text-xs font-medium leading-tight line-clamp-2 mb-1">
                          {title || 'Your Video Title Here'}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-neutral-400">
                          <div className="h-3 w-3 rounded-full bg-neutral-700" />
                          <span>Channel</span>
                          <span>&bull;</span>
                          <span>100K views</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="mt-3 text-xs text-neutral-500">
                    Displayed at {previewSizes[previewContext].w} &times; {previewSizes[previewContext].h}px
                    {previewContext === 'mobile' && ' (actual mobile size)'}
                    {previewContext === 'suggested' && ' (actual suggested sidebar size)'}
                  </p>

                  <div className="mt-6 w-full grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-neutral-50 dark:bg-neutral-800 p-3">
                      <p className="text-xs text-neutral-500 mb-1">Thumbnail renders at</p>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        {previewContext === 'search' && '360 \u00d7 202 px'}
                        {previewContext === 'home' && '320 \u00d7 180 px'}
                        {previewContext === 'suggested' && '168 \u00d7 94 px'}
                        {previewContext === 'mobile' && '116 \u00d7 65 px'}
                      </p>
                    </div>
                    <div className="rounded-lg bg-neutral-50 dark:bg-neutral-800 p-3">
                      <p className="text-xs text-neutral-500 mb-1">Your file resolution</p>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        {thumbnail.width} &times; {thumbnail.height} px
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Context Switcher — only after upload, sits below preview */}
            {thumbnail && (
              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">Preview Context</h3>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {([
                    { id: 'search', label: 'Search', icon: Monitor },
                    { id: 'home', label: 'Home Feed', icon: LayoutList },
                    { id: 'suggested', label: 'Suggested', icon: LayoutList },
                    { id: 'mobile', label: 'Mobile', icon: Smartphone },
                  ] as const).map((ctx) => (
                    <button
                      key={ctx.id}
                      onClick={() => setPreviewContext(ctx.id)}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        previewContext === ctx.id
                          ? 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400'
                          : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                      }`}
                    >
                      <ctx.icon className="h-4 w-4" />
                      {ctx.label}
                    </button>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showSafeZone}
                      onChange={(e) => setShowSafeZone(e.target.checked)}
                      className="rounded border-neutral-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm text-neutral-700 dark:text-neutral-300">Show Safe Zone Overlay</span>
                  </label>
                </div>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  )
}
