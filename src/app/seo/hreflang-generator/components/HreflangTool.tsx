'use client'

import { useState, useCallback, useMemo } from 'react'
import { 
  Plus, Trash2, Copy, Check, AlertCircle, CheckCircle2, XCircle, 
  Globe, Code, Network, Download, RefreshCcw, ChevronDown, Info
} from 'lucide-react'

// --- ISO 639-1 Language Codes ---
const LANGUAGES = [
  { code: 'en', name: 'English' }, { code: 'es', name: 'Spanish' }, { code: 'de', name: 'German' },
  { code: 'fr', name: 'French' }, { code: 'it', name: 'Italian' }, { code: 'pt', name: 'Portuguese' },
  { code: 'nl', name: 'Dutch' }, { code: 'ru', name: 'Russian' }, { code: 'ja', name: 'Japanese' },
  { code: 'zh', name: 'Chinese' }, { code: 'ko', name: 'Korean' }, { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' }, { code: 'tr', name: 'Turkish' }, { code: 'pl', name: 'Polish' },
  { code: 'sv', name: 'Swedish' }, { code: 'da', name: 'Danish' }, { code: 'no', name: 'Norwegian' },
  { code: 'fi', name: 'Finnish' }, { code: 'cs', name: 'Czech' }, { code: 'el', name: 'Greek' },
  { code: 'he', name: 'Hebrew' }, { code: 'th', name: 'Thai' }, { code: 'id', name: 'Indonesian' },
  { code: 'ms', name: 'Malay' }, { code: 'vi', name: 'Vietnamese' }, { code: 'uk', name: 'Ukrainian' },
  { code: 'ro', name: 'Romanian' }, { code: 'hu', name: 'Hungarian' }, { code: 'sk', name: 'Slovak' },
]

// --- ISO 3166-1 Alpha-2 Country Codes (common) ---
const COUNTRIES = [
  { code: '', name: 'No region (language only)' },
  { code: 'US', name: 'United States' }, { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' }, { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' }, { code: 'FR', name: 'France' },
  { code: 'ES', name: 'Spain' }, { code: 'IT', name: 'Italy' },
  { code: 'JP', name: 'Japan' }, { code: 'CN', name: 'China' },
  { code: 'KR', name: 'South Korea' }, { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' }, { code: 'IN', name: 'India' },
  { code: 'RU', name: 'Russia' }, { code: 'NL', name: 'Netherlands' },
  { code: 'SE', name: 'Sweden' }, { code: 'CH', name: 'Switzerland' },
  { code: 'AT', name: 'Austria' }, { code: 'BE', name: 'Belgium' },
  { code: 'PL', name: 'Poland' }, { code: 'TR', name: 'Turkey' },
  { code: 'SA', name: 'Saudi Arabia' }, { code: 'AE', name: 'UAE' },
  { code: 'SG', name: 'Singapore' }, { code: 'HK', name: 'Hong Kong' },
  { code: 'TW', name: 'Taiwan' }, { code: 'ID', name: 'Indonesia' },
  { code: 'MY', name: 'Malaysia' }, { code: 'TH', name: 'Thailand' },
  { code: 'VN', name: 'Vietnam' }, { code: 'ZA', name: 'South Africa' },
  { code: 'IE', name: 'Ireland' }, { code: 'NZ', name: 'New Zealand' },
  { code: 'AR', name: 'Argentina' }, { code: 'CL', name: 'Chile' },
  { code: 'CO', name: 'Colombia' }, { code: 'PE', name: 'Peru' },
  { code: 'PH', name: 'Philippines' }, { code: 'NG', name: 'Nigeria' },
  { code: 'EG', name: 'Egypt' }, { code: 'IL', name: 'Israel' },
  { code: 'UA', name: 'Ukraine' }, { code: 'CZ', name: 'Czech Republic' },
]

interface Variant {
  id: string
  language: string
  country: string
  url: string
  isXDefault: boolean
}

interface ValidationError {
  id: string
  message: string
  type: 'error' | 'warning'
}

function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

export function HreflangTool() {
  const [variants, setVariants] = useState<Variant[]>([
    { id: generateId(), language: 'en', country: 'US', url: 'https://example.com/en-us/', isXDefault: false },
    { id: generateId(), language: 'en', country: 'GB', url: 'https://example.com/en-gb/', isXDefault: false },
    { id: generateId(), language: 'de', country: 'DE', url: 'https://example.com/de/', isXDefault: false },
  ])
  const [outputFormat, setOutputFormat] = useState<'html' | 'sitemap'>('html')
  const [copied, setCopied] = useState(false)
  const [showTips, setShowTips] = useState(true)

  const addVariant = () => {
    setVariants(prev => [...prev, { id: generateId(), language: 'en', country: '', url: '', isXDefault: false }])
  }

  const removeVariant = (id: string) => {
    setVariants(prev => prev.filter(v => v.id !== id))
  }

  const updateVariant = (id: string, field: keyof Variant, value: string | boolean) => {
    setVariants(prev => prev.map(v => {
      if (v.id !== id) return v
      if (field === 'isXDefault' && value === true) {
        // Uncheck all others
        return { ...v, isXDefault: true }
      }
      return { ...v, [field]: value }
    }).map(v => v.id !== id && field === 'isXDefault' && value === true ? { ...v, isXDefault: false } : v))
  }

  // Validation
  const errors: ValidationError[] = useMemo(() => {
    const errs: ValidationError[] = []
    const hreflangs = new Map<string, string[]>()

    variants.forEach(v => {
      const hreflang = v.country ? `${v.language}-${v.country}` : v.language
      
      // Check empty fields
      if (!v.language) errs.push({ id: v.id, message: 'Language code is required', type: 'error' })
      if (!v.url.trim()) errs.push({ id: v.id, message: 'URL is required', type: 'error' })
      
      // Check URL format
      if (v.url.trim() && !/^https?:\/\/.+/.test(v.url.trim())) {
        errs.push({ id: v.id, message: 'URL must be absolute (https://...)', type: 'error' })
      }

      // Check duplicate hreflangs
      if (hreflangs.has(hreflang)) {
        errs.push({ id: v.id, message: `Duplicate hreflang value: ${hreflang}`, type: 'error' })
      } else {
        hreflangs.set(hreflang, [])
      }
    })

    // Check for x-default when multiple variants exist
    const hasXDefault = variants.some(v => v.isXDefault)
    if (variants.length > 1 && !hasXDefault) {
      errs.push({ id: 'global', message: 'Consider adding an x-default fallback for unmatched users', type: 'warning' })
    }

    return errs
  }, [variants])

  const hasErrors = errors.some(e => e.type === 'error')
  const hasWarnings = errors.some(e => e.type === 'warning')

  // Generate output
  const generateHtmlOutput = useCallback(() => {
    if (hasErrors) return '<!-- Fix validation errors before generating output -->'
    
    const lines: string[] = []
    variants.forEach(v => {
      const hreflang = v.country ? `${v.language}-${v.country}` : v.language
      lines.push(`<link rel="alternate" hreflang="${hreflang}" href="${v.url.trim()}" />`)
    })
    // Add x-default
    const xDefault = variants.find(v => v.isXDefault)
    if (xDefault) {
      lines.push(`<link rel="alternate" hreflang="x-default" href="${xDefault.url.trim()}" />`)
    }
    return lines.join('\n')
  }, [variants, hasErrors])

  const generateSitemapOutput = useCallback(() => {
    if (hasErrors) return '<!-- Fix validation errors before generating output -->'
    
    const urls = variants.map(v => {
      const hreflang = v.country ? `${v.language}-${v.country}` : v.language
      return `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${v.url.trim()}" />`
    })
    const xDefault = variants.find(v => v.isXDefault)
    if (xDefault) {
      urls.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${xDefault.url.trim()}" />`)
    }
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${variants[0]?.url.trim() || 'https://example.com/'}</loc>
${urls.join('\n')}
  </url>
</urlset>`
  }, [variants, hasErrors])

  const output = outputFormat === 'html' ? generateHtmlOutput() : generateSitemapOutput()

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getVariantErrors = (id: string) => errors.filter(e => e.id === id)
  const getGlobalErrors = () => errors.filter(e => e.id === 'global')

  return (
    <div className="mx-auto max-w-5xl">
      {/* Validation Banner */}
      {(hasErrors || hasWarnings) && (
        <div className={`mb-6 rounded-xl border p-4 ${hasErrors ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/30' : 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900/30'}`}>
          <div className="flex items-start gap-3">
            {hasErrors ? <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" /> : <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />}
            <div>
              <h3 className={`font-semibold text-sm ${hasErrors ? 'text-red-900 dark:text-red-400' : 'text-yellow-900 dark:text-yellow-400'}`}>
                {hasErrors ? `${errors.filter(e => e.type === 'error').length} Error${errors.filter(e => e.type === 'error').length > 1 ? 's' : ''} Found` : 'Warnings'}
              </h3>
              <ul className="mt-1 space-y-1">
                {getGlobalErrors().map((e, i) => (
                  <li key={`global-${i}`} className={`text-xs ${e.type === 'error' ? 'text-red-700 dark:text-red-300' : 'text-yellow-700 dark:text-yellow-300'}`}>
                    • {e.message}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Variants Table */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-neutral-700 dark:text-neutral-300 w-12">#</th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-700 dark:text-neutral-300">Language</th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-700 dark:text-neutral-300">Region</th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-700 dark:text-neutral-300">URL</th>
                <th className="px-4 py-3 text-center font-semibold text-neutral-700 dark:text-neutral-300 w-24">X-Default</th>
                <th className="px-4 py-3 text-center font-semibold text-neutral-700 dark:text-neutral-300 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {variants.map((v, index) => {
                const variantErrors = getVariantErrors(v.id)
                return (
                  <tr key={v.id} className={variantErrors.length > 0 ? 'bg-red-50/50 dark:bg-red-950/10' : ''}>
                    <td className="px-4 py-3 text-neutral-500 font-mono text-xs">{index + 1}</td>
                    <td className="px-4 py-3">
                      <div className="relative">
                        <select
                          value={v.language}
                          onChange={(e) => updateVariant(v.id, 'language', e.target.value)}
                          className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none appearance-none"
                        >
                          {LANGUAGES.map(l => (
                            <option key={l.code} value={l.code}>{l.name} ({l.code})</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="relative">
                        <select
                          value={v.country}
                          onChange={(e) => updateVariant(v.id, 'country', e.target.value)}
                          className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none appearance-none"
                        >
                          {COUNTRIES.map(c => (
                            <option key={c.code} value={c.code}>{c.name} {c.code && `(${c.code})`}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <input
                          type="text"
                          value={v.url}
                          onChange={(e) => updateVariant(v.id, 'url', e.target.value)}
                          placeholder="https://example.com/en-us/page"
                          className={`w-full rounded-lg border px-3 py-2 text-sm text-neutral-900 dark:text-white bg-white dark:bg-neutral-950 focus:ring-2 outline-none transition-all ${
                            variantErrors.some(e => e.message.includes('URL')) 
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                              : 'border-neutral-200 dark:border-neutral-700 focus:border-emerald-500 focus:ring-emerald-500/20'
                          }`}
                        />
                        {variantErrors.length > 0 && (
                          <div className="mt-1 space-y-0.5">
                            {variantErrors.map((e, i) => (
                              <p key={i} className="text-xs text-red-600 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" /> {e.message}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="radio"
                        name="xdefault"
                        checked={v.isXDefault}
                        onChange={() => updateVariant(v.id, 'isXDefault', true)}
                        className="h-4 w-4 text-emerald-600 border-neutral-300 focus:ring-emerald-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => removeVariant(v.id)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        title="Remove variant"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        
        {/* Add Variant Button */}
        <div className="p-4 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
          <button
            onClick={addVariant}
            className="flex items-center gap-2 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700 px-4 py-2.5 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-all"
          >
            <Plus className="h-4 w-4" />
            Add Variant
          </button>
        </div>
      </div>

      {/* Hreflang Preview Cluster */}
      <div className="mt-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
        <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
          <Globe className="h-4 w-4 text-emerald-600" />
          Hreflang Cluster Preview
        </h3>
        <div className="flex flex-wrap gap-2">
          {variants.map(v => {
            const hreflang = v.country ? `${v.language}-${v.country}` : v.language
            const isValid = getVariantErrors(v.id).length === 0
            return (
              <div 
                key={v.id} 
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium border ${
                  isValid 
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30' 
                    : 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/30'
                }`}
              >
                <span className="font-mono">{hreflang}</span>
                <span className="text-neutral-400">→</span>
                <span className="truncate max-w-[150px]">{v.url || '...'}</span>
                {v.isXDefault && <span className="ml-1 text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded-full">x-default</span>}
              </div>
            )
          })}
        </div>
        {!hasErrors && variants.length > 0 && (
          <div className="mt-3 flex items-center gap-2 text-xs text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            <span>All variants are valid. Self-referencing and reciprocity are satisfied.</span>
          </div>
        )}
      </div>

      {/* Output Section */}
      <div className="mt-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden">
        {/* Format Tabs */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-800">
          <button
            onClick={() => setOutputFormat('html')}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
              outputFormat === 'html'
                ? 'border-b-2 border-emerald-600 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/10'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Code className="h-4 w-4" />
            HTML &lt;head&gt;
          </button>
          <button
            onClick={() => setOutputFormat('sitemap')}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
              outputFormat === 'sitemap'
                ? 'border-b-2 border-emerald-600 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/10'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Network className="h-4 w-4" />
            XML Sitemap
          </button>
        </div>

        <div className="p-6">
          <div className="relative">
            <pre className={`rounded-xl bg-neutral-950 p-4 overflow-x-auto text-sm font-mono leading-relaxed ${
              hasErrors ? 'text-red-400' : 'text-emerald-400'
            }`}>
              <code>{output}</code>
            </pre>
            <button
              onClick={handleCopy}
              disabled={hasErrors}
              className={`absolute top-3 right-3 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                hasErrors
                  ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white'
              }`}
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          
          <div className="mt-4 flex items-start gap-2 text-xs text-neutral-500">
            <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <p>
              {outputFormat === 'html' 
                ? 'Paste these tags inside the <head> section of every page in the cluster. Each page must include all variants including itself (self-referencing).'
                : 'Include this in your XML sitemap. Each URL entry should contain the full hreflang cluster for that page. Ensure your sitemap is submitted to Google Search Console.'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      {showTips && (
        <div className="mt-6 rounded-xl border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50 dark:bg-emerald-950/20 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-emerald-900 dark:text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Quick Validation Checklist
            </h3>
            <button onClick={() => setShowTips(false)} className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline">Hide</button>
          </div>
          <ul className="grid sm:grid-cols-2 gap-2 text-sm text-emerald-800 dark:text-emerald-300">
            <li className="flex items-center gap-2">
              {variants.every(v => v.url.trim().startsWith('http')) ? <Check className="h-3.5 w-3.5" /> : <div className="h-3.5 w-3.5 rounded-full border border-emerald-600/30" />}
              All URLs are absolute (https://)
            </li>
            <li className="flex items-center gap-2">
              {new Set(variants.map(v => v.country ? `${v.language}-${v.country}` : v.language)).size === variants.length ? <Check className="h-3.5 w-3.5" /> : <div className="h-3.5 w-3.5 rounded-full border border-emerald-600/30" />}
              No duplicate hreflang values
            </li>
            <li className="flex items-center gap-2">
              {variants.some(v => v.isXDefault) ? <Check className="h-3.5 w-3.5" /> : <div className="h-3.5 w-3.5 rounded-full border border-emerald-600/30" />}
              X-default fallback is set
            </li>
            <li className="flex items-center gap-2">
              {variants.length >= 2 ? <Check className="h-3.5 w-3.5" /> : <div className="h-3.5 w-3.5 rounded-full border border-emerald-600/30" />}
              At least 2 variants in cluster
            </li>
            <li className="flex items-center gap-2">
              {!hasErrors ? <Check className="h-3.5 w-3.5" /> : <div className="h-3.5 w-3.5 rounded-full border border-emerald-600/30" />}
              No validation errors
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5" />
              Self-referencing included (auto-generated)
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}
