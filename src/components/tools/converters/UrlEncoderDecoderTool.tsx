"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  Copy, 
  Trash2, 
  ArrowRightLeft, 
  Info, 
  Download, 
  Settings2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Table as TableIcon
} from "lucide-react";

const URL_SAFE_CHARS = /^[a-zA-Z0-9\-._~]+$/;

const COMMON_ENCODINGS = [
  { char: "Space", raw: " ", encoded: "%20", description: "Standard space character" },
  { char: "&", raw: "&", encoded: "%26", description: "Query parameter separator" },
  { char: "=", raw: "=", encoded: "%3D", description: "Key-value pair separator" },
  { char: "?", raw: "?", encoded: "%3F", description: "Start of query string" },
  { char: "/", raw: "/", encoded: "%2F", description: "Path segment separator" },
  { char: ":", raw: ":", encoded: "%3A", description: "Protocol or port separator" },
  { char: "#", raw: "#", encoded: "%23", description: "Fragment identifier" },
  { char: "+", raw: "+", encoded: "%2B", description: "Often used for spaces" },
  { char: "@", raw: "@", encoded: "%40", description: "User info separator" },
  { char: "!", raw: "!", encoded: "%21", description: "Sub-delimiter" },
];

export default function UrlEncoderDecoderTool() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [preserveQuery, setPreserveQuery] = useState(false);
  const [showLegend, setShowLegend] = useState(true);
  const [batchMode, setBatchMode] = useState(false);
  const [status, setStatus] = useState("");

  // Real-time transformation
  const output = useMemo(() => {
    if (!input) return "";

    if (batchMode) {
      const lines = input.split("\n");
      return lines.map(line => {
        try {
          if (mode === "encode") {
            return encodeWithPreserve(line, preserveQuery);
          } else {
            return decodeURIComponent(line);
          }
        } catch (e) {
          return "ERROR: Invalid input";
        }
      }).join("\n");
    }

    try {
      if (mode === "encode") {
        return encodeWithPreserve(input, preserveQuery);
      } else {
        return decodeURIComponent(input);
      }
    } catch (e) {
      return "ERROR: Malformed URL sequence";
    }
  }, [input, mode, preserveQuery, batchMode]);

  function encodeWithPreserve(text: string, preserve: boolean) {
    if (!preserve) return encodeURIComponent(text);
    
    // Preserve ?, &, =, /, :, @, #
    // This is a simplified "preserve query" logic
    // We encode everything except these characters
    return text.split(/([?&=/ :@#])/).map(part => {
      if (/[?&=/ :@#]/.test(part)) return part === " " ? "%20" : part;
      return encodeURIComponent(part);
    }).join("");
  }

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setStatus("Copied!");
    setTimeout(() => setStatus(""), 2000);
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `url-${mode}d-${new Date().getTime()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clear = () => {
    setInput("");
    setStatus("");
  };

  const toggleMode = () => {
    setMode(prev => prev === "encode" ? "decode" : "encode");
    setInput(output && !output.startsWith("ERROR") ? output : "");
  };

  // Highlighting logic for the split screen
  const renderHighlightedInput = () => {
    if (!input || batchMode) return input;
    
    if (mode === "encode") {
      // Highlight special characters that WILL be encoded
      return input.split("").map((char, i) => {
        const isSafe = URL_SAFE_CHARS.test(char);
        const shouldPreserve = preserveQuery && /[?&=/ :@#]/.test(char);
        
        if (!isSafe && !shouldPreserve) {
          return <span key={i} className="text-red-500 font-bold bg-red-500/10 px-0.5 rounded" title={`Encodes to ${encodeURIComponent(char)}`}>{char}</span>;
        }
        if (shouldPreserve) {
          return <span key={i} className="text-blue-500 font-medium" title="Preserved character">{char}</span>;
        }
        return char;
      });
    } else {
      // Highlight %XX sequences
      const parts = input.split(/(%[0-9A-Fa-f]{2})/g);
      return parts.map((part, i) => {
        if (/%[0-9A-Fa-f]{2}/.test(part)) {
          return <span key={i} className="text-blue-500 font-bold bg-blue-500/10 px-0.5 rounded" title={`Decodes to ${decodeURIComponent(part)}`}>{part}</span>;
        }
        return part;
      });
    }
  };

  const efficiency = useMemo(() => {
    if (!input || !output || output.startsWith("ERROR")) return null;
    const diff = output.length - input.length;
    const pct = ((output.length / input.length) * 100 - 100).toFixed(1);
    return { diff, pct };
  }, [input, output]);

  return (
    <div className="space-y-8">
      {/* Main Tool Card */}
      <div className="bg-card border border-border rounded-[2rem] shadow-xl overflow-hidden">
        {/* Toolbar */}
        <div className="border-b border-border p-4 bg-muted/30 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-background border border-border rounded-xl p-1">
            <button
              onClick={() => setMode("encode")}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${mode === "encode" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:bg-muted"}`}
            >
              Encode
            </button>
            <button
              onClick={() => setMode("decode")}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${mode === "decode" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:bg-muted"}`}
            >
              Decode
            </button>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className={`w-10 h-5 rounded-full border border-border relative transition-colors ${batchMode ? "bg-primary border-primary" : "bg-muted"}`}>
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={batchMode} 
                  onChange={() => setBatchMode(!batchMode)} 
                />
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${batchMode ? "translate-x-5" : ""}`} />
              </div>
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">Batch Mode</span>
            </label>
            
            {mode === "encode" && (
               <label className="flex items-center gap-2 cursor-pointer group">
               <div className={`w-10 h-5 rounded-full border border-border relative transition-colors ${preserveQuery ? "bg-primary border-primary" : "bg-muted"}`}>
                 <input 
                   type="checkbox" 
                   className="sr-only" 
                   checked={preserveQuery} 
                   onChange={() => setPreserveQuery(!preserveQuery)} 
                 />
                 <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${preserveQuery ? "translate-x-5" : ""}`} />
               </div>
               <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">Preserve URL Structure</span>
             </label>
            )}
          </div>
        </div>

        {/* Editor Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
          {/* Input Side */}
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Raw {mode === "encode" ? "URL/Text" : "Encoded String"}
              </div>
              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                {input.length} Chars
              </div>
            </div>
            
            <div className="relative group min-h-[300px] rounded-2xl border border-border bg-muted/10 overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              {!batchMode && input && (
                <div className="absolute inset-0 p-4 font-mono text-sm leading-relaxed pointer-events-none whitespace-pre-wrap break-all opacity-100 z-0">
                  {renderHighlightedInput()}
                </div>
              )}
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={batchMode ? "Paste multiple URLs (one per line)..." : `Enter ${mode === "encode" ? "text to encode" : "encoded URL"}...`}
                className={`absolute inset-0 w-full h-full p-4 bg-transparent outline-none resize-none font-mono text-sm leading-relaxed ${!batchMode && input ? "text-transparent caret-foreground" : "text-foreground"} z-10`}
              />
            </div>
          </div>

          {/* Output Side */}
          <div className="p-6 space-y-4 bg-muted/5 font-mono">
             <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                <span className="w-2 h-2 rounded-full bg-success" />
                Result
              </div>
              <div className="flex items-center gap-3">
                 {efficiency && (
                   <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${efficiency.diff > 0 ? "bg-amber-500/10 text-amber-600" : "bg-green-500/10 text-green-600"}`}>
                     {efficiency.diff > 0 ? "+" : ""}{efficiency.pct}% Size
                   </div>
                 )}
                <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                  {output.length} Chars
                </div>
              </div>
            </div>

            <div className="relative group min-h-[300px] rounded-2xl border border-border bg-background overflow-hidden p-4">
              <div className={`w-full h-full text-sm leading-relaxed break-all overflow-y-auto whitespace-pre-wrap ${output.startsWith("ERROR") ? "text-red-500 font-bold" : "text-foreground"}`}>
                {output || <span className="text-muted-foreground/30 italic">Results will appear here...</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border flex flex-wrap gap-2 items-center justify-between bg-muted/20">
          <div className="flex gap-2">
            <button 
              onClick={handleCopy}
              disabled={!output || output.startsWith("ERROR")}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all active:translate-y-0 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
            >
              {status === "Copied!" ? <CheckCircle2 size={16} /> : <Copy size={16} />}
              {status || "Copy Result"}
            </button>
            <button 
              onClick={toggleMode}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-background border border-border font-bold text-sm hover:bg-muted transition-all"
            >
              <ArrowRightLeft size={16} />
              Switch
            </button>
            <button 
              onClick={handleDownload}
              disabled={!output || output.startsWith("ERROR")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-background border border-border font-bold text-sm hover:bg-muted transition-all disabled:opacity-50"
            >
              <Download size={16} />
              Export
            </button>
          </div>
          
          <button 
            onClick={clear}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-500/5 transition-all text-sm font-medium"
          >
            <Trash2 size={16} />
            Clear All
          </button>
        </div>
      </div>

      {/* Legend & Help Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setShowLegend(!showLegend)}
            className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            {showLegend ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            Percent-Encoding Character Map
          </button>
          {!showLegend && <div className="h-px flex-1 mx-4 bg-border/50" />}
        </div>

        {showLegend && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
            {COMMON_ENCODINGS.map((item, i) => (
              <div key={i} className="bg-card border border-border/50 rounded-2xl p-4 flex flex-col gap-2 hover:border-primary/30 transition-colors group">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground">{item.char}</span>
                  <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary font-mono font-bold text-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {item.encoded}
                  </div>
                </div>
                <div className="text-[10px] text-muted-foreground leading-snug">
                  {item.description}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 text-primary mb-3">
            <Info size={20} />
            <h3 className="font-bold">Pro Tip: Batch Mode</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Need to process hundreds of URLs? Enable <strong>Batch Mode</strong>. 
            Paste a list with one URL per line, and we'll process them all at once. 
            You can then export the results as a text file.
          </p>
        </div>

        <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 text-amber-600 mb-3">
            <Settings2 size={20} />
            <h3 className="font-bold">Url preservation</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Standard URI encoding escapes everything except <code>- . _ ~</code>. 
            If you check <strong>Preserve URL Structure</strong>, we keep reserved delimiters 
            like <code>? & = /</code> intact, making the result clickable but safely encoded.
          </p>
        </div>
      </div>
    </div>
  );
}
