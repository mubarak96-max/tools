"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Download, RotateCcw, Copy, Check, Info, Sparkles, Wand2 } from "lucide-react";

import { getQueueDelay, MAX_INPUT_LENGTH, QUEUE_MESSAGES, type HumanizerTone } from "@/lib/tools/humanizer";
import type { HumanizerStatus } from "@/types/tools";

const textareaClass =
  "min-h-[16rem] w-full rounded-[1.25rem] border border-border bg-background px-5 py-5 text-base leading-relaxed text-foreground outline-none transition-all placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm";

const TONES: { value: HumanizerTone; label: string; icon: string; description: string }[] = [
  { value: "Professional", label: "Professional", icon: "💼", description: "Polished and formal. Ideal for reports, cover letters, and business emails." },
  { value: "Academic", label: "Academic", icon: "🎓", description: "Maintains formal vocabulary and citations while removing robotic structures." },
  { value: "Casual", label: "Casual", icon: "👋", description: "Relaxed and conversational. Includes natural contractions and friendly rhythm." },
  { value: "Creative", label: "Creative", icon: "🎨", description: "High linguistic variance. Uses metaphors and diverse sentence structures." },
];

const COMPLEXITY_LEVELS = [
  { value: "Simple", label: "Simple", icon: "🌱" },
  { value: "Balanced", label: "Balanced", icon: "⚖️" },
  { value: "Advanced", label: "Advanced", icon: "🚀" },
];

export default function AIHumanizer() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [status, setStatus] = useState<HumanizerStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);
  const [tone, setTone] = useState<HumanizerTone>("Professional");
  const [queueMessage, setQueueMessage] = useState(QUEUE_MESSAGES[0]);
  const [queueProgress, setQueueProgress] = useState(0);
  const [preserveKeywords, setPreserveKeywords] = useState(false);
  const [complexity, setComplexity] = useState("Balanced");
  const [viewMode, setViewMode] = useState<"standard" | "comparison">("standard");
  const [history, setHistory] = useState<{ id: string; original: string; humanized: string; tone: string; date: number }[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const messageIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const isOverLimit = inputText.length > MAX_INPUT_LENGTH;
  const isEmpty = inputText.trim().length === 0;
  const isProcessing = status === "queued" || status === "processing";

  // Statistics
  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const readingTime = Math.ceil(wordCount / 200);
  
  // Real-time Human Score Heuristic
  const calculateHumanScore = (text: string) => {
    if (!text || text.length < 50) return 100;
    let score = 90;
    const aiTells = ["moreover", "furthermore", "consequently", "specifically", "additionally", "in conclusion", "it is important to note", "it's worth mentioning", "lastly", "to summarize"];
    aiTells.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) score -= (matches.length * 5);
    });
    
    // Sentence length variance check
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length > 2) {
      const lengths = sentences.map(s => s.trim().split(/\s+/).length);
      const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
      const variance = lengths.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / lengths.length;
      
      // Low variance = AI-like rhythm
      if (variance < 5) score -= 20;
      else if (variance > 20) score += 5; // Good human burstiness
    }
    
    // Total word length check (AI likes long sentences)
    const avgWordLength = text.length / (wordCount || 1);
    if (avgWordLength > 6) score -= 10;

    return Math.max(Math.min(score, 100), 5);
  };

  const humanScore = calculateHumanScore(inputText);

  // Split text into sentences for "Confidence" highlighting
  const analyzeSentences = (text: string) => {
    return text.split(/([.!?]+\s+)/).filter(Boolean).map(s => {
      const isAI = calculateHumanScore(s) < 60;
      return { text: s, isAI };
    });
  };

  const analyzedInput = analyzeSentences(inputText);

  const stopQueueSimulation = useCallback(() => {
    if (messageIntervalRef.current) {
      clearInterval(messageIntervalRef.current);
      messageIntervalRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("humanizer_history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved).slice(0, 10)); // Keep last 10
      } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("humanizer_history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    return () => {
      stopQueueSimulation();
      abortRef.current?.abort();
    };
  }, [stopQueueSimulation]);

  const startQueueSimulation = useCallback((delayMs: number) => {
    setQueueProgress(0);
    setQueueMessage(QUEUE_MESSAGES[0]);
    let messageIndex = 0;
    const messageStep = Math.max(900, Math.floor(delayMs / QUEUE_MESSAGES.length));
    const tickMs = 100;
    const totalTicks = delayMs / tickMs;
    let tick = 0;

    messageIntervalRef.current = setInterval(() => {
      messageIndex = Math.min(messageIndex + 1, QUEUE_MESSAGES.length - 1);
      setQueueMessage(QUEUE_MESSAGES[messageIndex]);
    }, messageStep);

    progressIntervalRef.current = setInterval(() => {
      tick += 1;
      const raw = tick / totalTicks;
      const eased = 1 - Math.pow(1 - raw, 2);
      setQueueProgress(Math.min(eased * 92, 92));
    }, tickMs);
  }, []);

  async function handleHumanize() {
    if (isEmpty || isOverLimit || isProcessing) return;

    setStatus("queued");
    setOutputText("");
    setErrorMsg("");
    setCopied(false);

    const delay = getQueueDelay();
    startQueueSimulation(delay);
    await new Promise((resolve) => window.setTimeout(resolve, delay));

    stopQueueSimulation();
    setStatus("processing");
    setQueueMessage("Polishing your text...");
    setQueueProgress(96);

    abortRef.current = new AbortController();

    try {
      const response = await fetch("/api/humanize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          text: inputText, 
          tone,
          preserveKeywords 
        }),
        signal: abortRef.current.signal,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Something went wrong.");

      setQueueProgress(100);
      setOutputText(data.humanized);
      setStatus("done");

      // Save to history
      setHistory(prev => [
        { 
          id: Math.random().toString(36).substr(2, 9), 
          original: inputText, 
          humanized: data.humanized, 
          tone, 
          date: Date.now() 
        },
        ...prev
      ]);
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") return;
      setErrorMsg(error instanceof Error ? error.message : "An unexpected error occurred.");
      setQueueProgress(0);
      setStatus("error");
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      if (content.length > MAX_INPUT_LENGTH) {
        setErrorMsg(`File is too large (${content.length} characters). Max is ${MAX_INPUT_LENGTH}.`);
      } else {
        setInputText(content);
        setErrorMsg("");
      }
    };
    reader.readAsText(file);
  };

  const handleCopy = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  const handleExport = async (type: "txt" | "pdf") => {
    if (!outputText) return;
    if (type === "txt") {
      const element = document.createElement("a");
      const file = new Blob([outputText], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = "humanized-text.txt";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } else {
      const { jsPDF } = await import("jspdf/dist/jspdf.es.min.js");
      const doc = new jsPDF();
      const splitText = doc.splitTextToSize(outputText, 180);
      doc.text(splitText, 15, 20);
      doc.save("humanized-text.pdf");
    }
  };

  function handleReset() {
    abortRef.current?.abort();
    stopQueueSimulation();
    setStatus("idle");
    setInputText("");
    setOutputText("");
    setErrorMsg("");
    setCopied(false);
    setQueueMessage(QUEUE_MESSAGES[0]);
    setQueueProgress(0);
  }

  return (
    <section className="tool-frame p-0 overflow-hidden rounded-[2rem] border-border/60">
      <div className="grid lg:grid-cols-2 divide-x divide-border">
        {/* Input Sidebar */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Input Source
            </h3>
            <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground items-center">
              <button 
                onClick={() => setShowHistory(!showHistory)}
                className={`flex items-center gap-1 hover:text-primary transition-colors ${showHistory ? "text-primary" : ""}`}
              >
                <RotateCcw className="w-3 h-3" />
                History ({history.length})
              </button>
              <label className="cursor-pointer hover:text-primary flex items-center gap-1">
                <Download className="w-3 h-3" />
                Upload .txt
                <input type="file" accept=".txt" onChange={handleFileUpload} className="hidden" />
              </label>
              <span>{wordCount} Words</span>
            </div>
          </div>

          <div className="relative group">
            {showHistory && history.length > 0 && (
              <div className="absolute inset-0 z-20 bg-background/95 backdrop-blur-sm p-4 overflow-y-auto rounded-[1.25rem] border border-primary/20 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Recent Transformations</h4>
                  <button onClick={() => setShowHistory(false)} className="text-[10px] font-bold uppercase text-muted-foreground hover:text-foreground">Close</button>
                </div>
                <div className="space-y-3">
                  {history.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setInputText(item.original);
                        setOutputText(item.humanized);
                        setTone(item.tone as HumanizerTone);
                        setStatus("done");
                        setShowHistory(false);
                      }}
                      className="w-full text-left p-3 rounded-xl border border-border bg-background hover:border-primary/30 transition-all group"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-bold text-primary">{item.tone}</span>
                        <span className="text-[9px] text-muted-foreground">{new Date(item.date).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-xs text-foreground line-clamp-2 opacity-80 group-hover:opacity-100">{item.humanized}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              maxLength={MAX_INPUT_LENGTH}
              placeholder="Paste your AI text here (ChatGPT, Claude, etc.)..."
              className={textareaClass}
              disabled={isProcessing}
            />
            <div className="absolute bottom-4 right-5 flex items-center gap-3">
               <span className={`text-xs font-mono ${isOverLimit ? "text-danger" : "text-muted-foreground"}`}>
                {inputText.length}/{MAX_INPUT_LENGTH}
              </span>
            </div>
          </div>

          <div className="space-y-4">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              {TONES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTone(t.value)}
                  className={`flex flex-col gap-1 p-3 rounded-2xl text-left border transition-all ${
                    tone === t.value 
                      ? "bg-primary/5 border-primary ring-1 ring-primary/20" 
                      : "bg-background border-border hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{t.icon}</span>
                    <span className={`text-sm font-bold ${tone === t.value ? "text-primary" : "text-foreground"}`}>{t.label}</span>
                  </div>
                  <p className="text-[10px] leading-tight text-muted-foreground line-clamp-2">
                    {t.description}
                  </p>
                </button>
              ))}
            </div>

            <div className="space-y-3 p-4 bg-muted/30 rounded-2xl border border-border/50">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <RotateCcw className="w-3 h-3" />
                  Vocabulary Complexity
                </span>
                <span className="text-xs font-mono text-primary font-bold">{complexity}</span>
              </div>
              <div className="flex gap-2">
                {COMPLEXITY_LEVELS.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setComplexity(level.value)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      complexity === level.value
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground border-border hover:bg-muted"
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-3 bg-muted/30 rounded-xl border border-border/50">
               <input 
                type="checkbox" 
                id="preserve" 
                checked={preserveKeywords} 
                onChange={(e) => setPreserveKeywords(e.target.checked)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20"
               />
               <label htmlFor="preserve" className="text-xs font-medium text-foreground cursor-pointer select-none">
                 Preserve technical keywords (SEO optimized)
               </label>
            </div>
          </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button
              onClick={handleHumanize}
              disabled={isEmpty || isOverLimit || isProcessing}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-foreground px-6 py-4 text-base font-bold text-background transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2 text-sm italic animate-pulse">
                  <Wand2 className="w-5 h-5 animate-spin" />
                  <span>{status === "queued" ? "In Queue..." : "Humanizing..."}</span>
                </div>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Humanize Text
                </>
              )}
            </button>
            <button 
              onClick={handleReset}
              className="p-4 rounded-2xl border border-border bg-background hover:bg-muted/50 text-muted-foreground transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          {isProcessing && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-500">
              <div className="flex justify-between items-center text-xs font-bold text-primary uppercase tracking-tighter">
                <span>{queueMessage}</span>
                <span>{Math.round(queueProgress)}%</span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300 ease-out" 
                  style={{ width: `${queueProgress}%` }}
                />
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 rounded-xl border border-danger/20 bg-danger/5 text-danger text-sm flex gap-3 italic">
              <Info className="w-5 h-5 shrink-0" />
              {errorMsg}
            </div>
          )}
        </div>

        {/* Output Sidebar */}
        <div className="p-6 sm:p-8 bg-muted/10 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
               <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Progress
              </h3>
              {outputText && (
                <div className="flex bg-background border border-border rounded-lg p-0.5">
                  <button 
                    onClick={() => setViewMode("standard")}
                    className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${viewMode === "standard" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    Standard
                  </button>
                  <button 
                    onClick={() => setViewMode("comparison")}
                    className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${viewMode === "comparison" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    Comparison
                  </button>
                </div>
              )}
            </div>
            {inputText.length > 50 && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-border shadow-sm">
                <div 
                  className={`w-2 h-2 rounded-full animate-pulse ${humanScore > 75 ? "bg-success" : humanScore > 40 ? "bg-warning" : "bg-danger"}`} 
                />
                <span className="text-[10px] font-bold text-foreground">
                  Human Score: {humanScore}%
                </span>
              </div>
            )}
          </div>

          <div className="relative min-h-[22rem] rounded-[1.25rem] border border-border bg-background shadow-inner overflow-hidden">
            {outputText ? (
              viewMode === "standard" ? (
                <div className="p-6 prose prose-sm max-w-none text-foreground leading-relaxed whitespace-pre-wrap animate-in fade-in duration-700">
                  {outputText}
                </div>
              ) : (
                <div className="grid grid-cols-2 h-full min-h-[22rem] divide-x divide-border">
                  <div className="p-4 overflow-y-auto max-h-[22rem]">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Original AI Text</p>
                    <div className="text-[13px] leading-relaxed text-muted-foreground whitespace-pre-wrap">
                      {analyzedInput.map((s, i) => (
                        <span key={i} className={s.isAI ? "bg-danger/10 text-danger/80" : ""}>
                          {s.text}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 overflow-y-auto max-h-[22rem] bg-success/[0.02]">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-success mb-3">Humanized Version</p>
                    <div className="text-[13px] leading-relaxed text-foreground whitespace-pre-wrap">
                      {outputText}
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-muted-foreground space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-muted/50 flex items-center justify-center">
                  <Wand2 className="w-8 h-8 opacity-20" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Ready to humanize</p>
                  <p className="text-xs mt-1">Select your tone and click the wand to begin transformation.</p>
                </div>
              </div>
            )}
          </div>

          {outputText && (
             <div className="flex items-center justify-between pt-4 gap-4 animate-in slide-in-from-bottom-2 duration-500">
               <div className="flex gap-2">
                 <button
                   onClick={handleCopy}
                   className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-foreground text-background text-xs font-bold uppercase tracking-wider transition-all hover:opacity-90 active:scale-95"
                 >
                   {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                   {copied ? "Copied" : "Copy"}
                 </button>
                 <div className="flex items-center border border-border rounded-xl bg-background overflow-hidden shrink-0">
                    <button 
                      onClick={() => handleExport("txt")}
                      className="p-2.5 hover:bg-muted transition-colors border-r border-border"
                      title="Export as TXT"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleExport("pdf")}
                      className="p-2.5 px-3 hover:bg-muted text-[10px] font-bold transition-colors"
                      title="Export as PDF"
                    >
                      PDF
                    </button>
                 </div>
               </div>
               <div className="text-[10px] text-muted-foreground font-medium italic">
                 Human Probability: <span className="text-foreground font-bold">{calculateHumanScore(outputText)}%</span>
               </div>
             </div>
          )}
        </div>
      </div>
    </section>
  );
}
