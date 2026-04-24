'use client'

import { useState, useCallback, useRef } from 'react'
import { 
  GitBranch, Upload, Copy, Check, Download, Sparkles,
  Search, SlidersHorizontal, ChevronDown, ChevronUp,
  GripVertical, X, FileText, ArrowRightLeft
} from 'lucide-react'

type ClusterMethod = 'semantic' | 'wordmatch' | 'hybrid'

interface Cluster {
  id: string
  name: string
  keywords: string[]
  primaryKeyword: string
}

// Simple stemming for word matching
function stem(word: string): string {
  return word
    .toLowerCase()
    .replace(/ing$|ed$|s$|es$|ies$|ly$|er$|est$/, '')
    .replace(/[^a-z0-9]/g, '')
}

function getWords(keyword: string): string[] {
  return keyword
    .toLowerCase()
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w))
    .map(stem)
    .filter(w => w.length > 2)
}

const STOP_WORDS = new Set([
  'the','a','an','and','or','but','in','on','at','to','for','of','with','by',
  'from','up','about','into','through','during','before','after','above','below',
  'between','among','within','without','against','under','over','is','are','was',
  'were','be','been','being','have','has','had','do','does','did','will','would',
  'could','should','may','might','must','can','shall','this','that','these','those',
  'i','you','he','she','it','we','they','me','him','her','us','them','my','your',
  'his','her','its','our','their','what','which','who','whom','whose','where',
  'when','why','how','all','any','both','each','few','more','most','other','some',
  'such','no','nor','not','only','own','same','so','than','too','very','just','now'
])

// Semantic similarity using word overlap + position
function semanticSimilarity(kw1: string, kw2: string): number {
  const words1 = getWords(kw1)
  const words2 = getWords(kw2)
  if (words1.length === 0 || words2.length === 0) return 0
  
  const set1 = new Set(words1)
  const set2 = new Set(words2)
  const intersection = [...set1].filter(w => set2.has(w))
  const union = new Set([...words1, ...words2])
  
  // Jaccard similarity
  const jaccard = intersection.length / union.size
  
  // Bonus for shared word order
  let orderBonus = 0
  for (let i = 0; i < Math.min(words1.length, words2.length); i++) {
    if (words1[i] === words2[i]) orderBonus += 0.05
  }
  
  return Math.min(jaccard + orderBonus, 1)
}

// Word match similarity
function wordMatchSimilarity(kw1: string, kw2: string): number {
  const words1 = getWords(kw1)
  const words2 = getWords(kw2)
  if (words1.length === 0 || words2.length === 0) return 0
  
  const set1 = new Set(words1)
  const set2 = new Set(words2)
  const intersection = [...set1].filter(w => set2.has(w))
  
  return intersection.length / Math.max(set1.size, set2.size)
}

function clusterKeywords(keywords: string[], method: ClusterMethod, threshold: number): Cluster[] {
  if (keywords.length === 0) return []
  
  const normalized = keywords.map(k => k.trim().toLowerCase()).filter(k => k.length > 0)
  const unique = [...new Set(normalized)]
  
  const clusters: Cluster[] = []
  const used = new Set<number>()
  
  for (let i = 0; i < unique.length; i++) {
    if (used.has(i)) continue
    
    const clusterKeywords: string[] = [unique[i]]
    used.add(i)
    
    for (let j = i + 1; j < unique.length; j++) {
      if (used.has(j)) continue
      
      let sim = 0
      if (method === 'semantic') {
        sim = semanticSimilarity(unique[i], unique[j])
      } else if (method === 'wordmatch') {
        sim = wordMatchSimilarity(unique[i], unique[j])
      } else {
        sim = (semanticSimilarity(unique[i], unique[j]) * 0.6) + (wordMatchSimilarity(unique[i], unique[j]) * 0.4)
      }
      
      if (sim >= threshold) {
        clusterKeywords.push(unique[j])
        used.add(j)
      }
    }
    
    // Generate cluster name from most common words
    const wordCounts = new Map<string, number>()
    clusterKeywords.forEach(kw => {
      getWords(kw).forEach(w => {
        wordCounts.set(w, (wordCounts.get(w) || 0) + 1)
      })
    })
    const topWords = [...wordCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([w]) => w)
    const name = topWords.length > 0 ? topWords.join(' ').replace(/^\w/, c => c.toUpperCase()) : 'Misc'
    
    // Primary keyword = longest in cluster (usually most specific)
    const primaryKeyword = clusterKeywords.reduce((a, b) => a.length > b.length ? a : b)
    
    clusters.push({
      id: Math.random().toString(36).substring(2, 9),
      name,
      keywords: clusterKeywords,
      primaryKeyword
    })
  }
  
  // Sort clusters by size (largest first)
  return clusters.sort((a, b) => b.keywords.length - a.keywords.length)
}

export function ClusteringTool() {
  const [inputText, setInputText] = useState('')
  const [method, setMethod] = useState<ClusterMethod>('hybrid')
  const [threshold, setThreshold] = useState(0.3)
  const [clusters, setClusters] = useState<Cluster[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [copied, setCopied] = useState(false)
  const [expandedClusters, setExpandedClusters] = useState<Set<string>>(new Set())
  const [draggedKeyword, setDraggedKeyword] = useState<{clusterId: string, keyword: string} | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processKeywords = useCallback(() => {
    const keywords = inputText
      .split(/[\n,]/)
      .map(k => k.trim())
      .filter(k => k.length > 0)
    
    if (keywords.length === 0) return
    
    setIsProcessing(true)
    // Small delay to show processing state
    setTimeout(() => {
      const result = clusterKeywords(keywords, method, threshold)
      setClusters(result)
      setExpandedClusters(new Set(result.slice(0, 3).map(c => c.id)))
      setIsProcessing(false)
    }, 300)
  }, [inputText, method, threshold])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      setInputText(text)
    }
    reader.readAsText(file)
  }

  const toggleCluster = (id: string) => {
    setExpandedClusters(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const removeKeyword = (clusterId: string, keyword: string) => {
    setClusters(prev => prev.map(c => {
      if (c.id !== clusterId) return c
      return { ...c, keywords: c.keywords.filter(k => k !== keyword) }
    }).filter(c => c.keywords.length > 0))
  }

  const moveKeyword = (fromClusterId: string, toClusterId: string, keyword: string) => {
    if (fromClusterId === toClusterId) return
    setClusters(prev => prev.map(c => {
      if (c.id === fromClusterId) {
        return { ...c, keywords: c.keywords.filter(k => k !== keyword) }
      }
      if (c.id === toClusterId) {
        return { ...c, keywords: [...c.keywords, keyword] }
      }
      return c
    }).filter(c => c.keywords.length > 0))
  }

  const mergeClusters = (id1: string, id2: string) => {
    setClusters(prev => {
      const c1 = prev.find(c => c.id === id1)
      const c2 = prev.find(c => c.id === id2)
      if (!c1 || !c2) return prev
      const merged: Cluster = {
        id: Math.random().toString(36).substring(2, 9),
        name: c1.name,
        keywords: [...c1.keywords, ...c2.keywords],
        primaryKeyword: c1.keywords.length > c2.keywords.length ? c1.primaryKeyword : c2.primaryKeyword
      }
      return [...prev.filter(c => c.id !== id1 && c.id !== id2), merged]
        .sort((a, b) => b.keywords.length - a.keywords.length)
    })
  }

  const handleCopy = async () => {
    const text = clusters.map(c => 
      `CLUSTER: ${c.name}\nPrimary: ${c.primaryKeyword}\nKeywords:\n${c.keywords.map(k => `  - ${k}`).join('\n')}\n`
    ).join('\n')
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const csv = [
      'Cluster Name,Primary Keyword,Keyword',
      ...clusters.flatMap(c => c.keywords.map(k => `"${c.name}","${c.primaryKeyword}","${k}"`))
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'keyword-clusters.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const totalKeywords = clusters.reduce((sum, c) => sum + c.keywords.length, 0)
  const orphanedKeywords = clusters.filter(c => c.keywords.length === 1).length

  const sampleData = `best espresso machine
top espresso makers 2026
espresso machine reviews
budget espresso machine under 500
commercial espresso machine
espresso machine for beginners
how to clean espresso machine
espresso machine maintenance tips
best coffee beans for espresso
arabica vs robusta espresso
espresso grind size guide
espresso tamping technique
home espresso setup
espresso vs drip coffee
manual espresso maker`

  return (
    <div className="mx-auto max-w-5xl">
      {/* Input Section */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
            <FileText className="h-4 w-4 text-emerald-600" />
            Keyword Input
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setInputText(sampleData)}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Load Sample
            </button>
            <button
              onClick={() => setInputText('')}
              className="text-xs text-neutral-500 hover:text-neutral-700"
            >
              Clear
            </button>
          </div>
        </div>
        
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste your keywords here, one per line or comma-separated...
Example:
best running shoes
top running shoes 2026
running shoes for flat feet"
          className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 p-4 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all resize-none"
          rows={8}
        />
        
        <div className="mt-3 flex items-center justify-between">
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            >
              <Upload className="h-3.5 w-3.5" />
              Upload CSV/TXT
            </button>
          </div>
          <span className="text-xs text-neutral-500">
            {inputText.split(/[\n,]/).filter(k => k.trim().length > 0).length} keywords
          </span>
        </div>
      </div>

      {/* Settings */}
      <div className="mt-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
        <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-emerald-600" />
          Clustering Settings
        </h3>
        
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">Method</label>
            <div className="relative">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as ClusterMethod)}
                className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:border-emerald-500 outline-none appearance-none"
              >
                <option value="hybrid">Hybrid (Recommended)</option>
                <option value="semantic">Semantic (NLP-Based)</option>
                <option value="wordmatch">Word Match (Fast)</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">
              Similarity Threshold: {threshold.toFixed(1)}
            </label>
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.1"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-neutral-400">
              <span>Loose (more clusters)</span>
              <span>Tight (fewer clusters)</span>
            </div>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={processKeywords}
              disabled={isProcessing || !inputText.trim()}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? (
                <Sparkles className="h-4 w-4 animate-spin" />
              ) : (
                <GitBranch className="h-4 w-4" />
              )}
              {isProcessing ? 'Clustering...' : 'Generate Clusters'}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {clusters.length > 0 && (
        <div className="mt-6 space-y-4">
          {/* Stats Bar */}
          <div className="flex flex-wrap items-center gap-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
            <div className="flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-medium text-neutral-900 dark:text-white">{clusters.length} Clusters</span>
            </div>
            <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-700" />
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-neutral-500" />
              <span className="text-sm text-neutral-600 dark:text-neutral-400">{totalKeywords} Keywords</span>
            </div>
            <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-700" />
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-neutral-500" />
              <span className="text-sm text-neutral-600 dark:text-neutral-400">Avg: {(totalKeywords / clusters.length).toFixed(1)} per cluster</span>
            </div>
            {orphanedKeywords > 0 && (
              <>
                <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-700" />
                <span className="text-sm text-yellow-600">{orphanedKeywords} single-keyword clusters</span>
              </>
            )}
            <div className="ml-auto flex gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                CSV
              </button>
            </div>
          </div>

          {/* Cluster Cards */}
          <div className="space-y-3">
            {clusters.map((cluster, index) => (
              <div 
                key={cluster.id}
                className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  if (draggedKeyword) {
                    moveKeyword(draggedKeyword.clusterId, cluster.id, draggedKeyword.keyword)
                    setDraggedKeyword(null)
                  }
                }}
              >
                <button
                  onClick={() => toggleCluster(cluster.id)}
                  className="w-full flex items-center gap-3 p-4 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                >
                  {expandedClusters.has(cluster.id) ? (
                    <ChevronUp className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-neutral-400">#{index + 1}</span>
                      <h4 className="font-semibold text-neutral-900 dark:text-white truncate">{cluster.name}</h4>
                      <span className="text-xs bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                        {cluster.keywords.length}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5 truncate">
                      Primary: <span className="text-emerald-600 font-medium">{cluster.primaryKeyword}</span>
                    </p>
                  </div>
                </button>
                
                {expandedClusters.has(cluster.id) && (
                  <div className="px-4 pb-4 border-t border-neutral-100 dark:border-neutral-800">
                    <div className="pt-3 flex flex-wrap gap-2">
                      {cluster.keywords.map((keyword, kidx) => (
                        <div
                          key={`${cluster.id}-${kidx}`}
                          draggable
                          onDragStart={() => setDraggedKeyword({ clusterId: cluster.id, keyword })}
                          onDragEnd={() => setDraggedKeyword(null)}
                          className="group flex items-center gap-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 text-xs text-neutral-700 dark:text-neutral-300 cursor-move hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-colors"
                        >
                          <GripVertical className="h-3 w-3 text-neutral-400" />
                          <span>{keyword}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              removeKeyword(cluster.id, keyword)
                            }}
                            className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-red-500 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    {/* Merge option for small clusters */}
                    {cluster.keywords.length <= 3 && clusters.length > 1 && (
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs text-neutral-500">Merge with:</span>
                        {clusters
                          .filter(c => c.id !== cluster.id && c.keywords.length >= 3)
                          .slice(0, 3)
                          .map(c => (
                            <button
                              key={c.id}
                              onClick={() => mergeClusters(cluster.id, c.id)}
                              className="text-xs rounded-full bg-violet-50 dark:bg-violet-950/20 text-violet-700 dark:text-violet-400 px-2 py-1 hover:bg-violet-100 transition-colors"
                            >
                              {c.name}
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Content Map Preview */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4 text-emerald-600" />
              Content Map Preview
            </h3>
            <div className="space-y-3">
              {clusters.slice(0, 5).map((cluster, i) => (
                <div key={cluster.id} className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-xs font-bold text-emerald-700 dark:text-emerald-400 flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {cluster.primaryKeyword}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {cluster.keywords.length} keywords → 1 article ({cluster.keywords.slice(0, 3).join(', ')}
                      {cluster.keywords.length > 3 && ` +${cluster.keywords.length - 3} more`})
                    </p>
                  </div>
                </div>
              ))}
              {clusters.length > 5 && (
                <p className="text-xs text-neutral-500 text-center">
                  +{clusters.length - 5} more clusters in export
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
