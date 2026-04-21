"use client";

import React, { useMemo, useState, useEffect } from "react";
import { calculateReadability } from "@/lib/tools/readability";

const actionClass =
  "rounded-[0.9rem] border border-border bg-card px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary disabled:cursor-not-allowed disabled:opacity-50";

const textareaClass =
  "w-full rounded-[1.5rem] border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-shadow focus:ring-2 focus:ring-primary";

function ReadabilityGauge({
  score,
  label,
  min = 0,
  max = 100,
  className = "",
}: {
  score: number;
  label: string;
  min?: number;
  max?: number;
  className?: string;
}) {
  const normalizedScore = Math.min(Math.max(score, min), max);
  const percentage = ((normalizedScore - min) / (max - min)) * 100;
  const colorClass =
    normalizedScore >= 80
      ? "text-emerald-500"
      : normalizedScore >= 60
        ? "text-green-500"
        : normalizedScore >= 50
          ? "text-yellow-500"
          : normalizedScore >= 30
            ? "text-orange-500"
            : "text-red-500";
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      <svg className="h-32 w-32 -rotate-90 transform" viewBox="0 0 100 100">
        <circle
          className="text-muted/20"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
        />
        <circle
          className={`${colorClass} transition-all duration-700 ease-in-out`}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center space-y-0.5">
        <span className={`text-2xl font-bold ${colorClass}`}>{score.toFixed(1)}</span>
        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Score</span>
      </div>
      <p className="mt-2 text-sm font-semibold text-foreground">{label}</p>
    </div>
  );
}

export default function ReadabilityCalculator() {
  const [text, setText] = useState("");
  const [showHighlight, setShowHighlight] = useState(true);
  const result = useMemo(() => calculateReadability(text), [text]);

  const hasContent = text.trim().length > 0;

  useEffect(() => {
    const sharedText = sessionStorage.getItem("shared_tool_text");
    if (sharedText) {
      setText(sharedText);
      sessionStorage.removeItem("shared_tool_text");
    }
  }, []);

  const difficultyColors = {
    easy: "bg-emerald-100/50 text-emerald-900 decoration-emerald-300",
    average: "bg-transparent",
    hard: "bg-orange-100/50 text-orange-900 border-b-2 border-orange-200",
    "very-hard": "bg-red-100/60 text-red-900 border-b-2 border-red-300 font-medium",
  };

  const benchmarks = [
    { name: "Harry Potter", grade: 5, ease: 80 },
    { name: "New York Times", grade: 8, ease: 60 },
    { name: "Academic Paper", grade: 14, ease: 30 },
    { name: "Legal Document", grade: 20, ease: 10 },
  ];

  return (
    <div className="space-y-8">


      <section className="tool-frame p-4 sm:p-6 bg-white/50 backdrop-blur-sm border-border/40 shadow-sm rounded-2xl">
        <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground tracking-tight">Enter your text below</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowHighlight(!showHighlight)}
                  className={`text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded transition-colors ${showHighlight ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}
                >
                  {showHighlight ? "Hide Highlighting" : "Show Highlighting"}
                </button>
              </div>
            </div>

            <div className="relative group">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your text here to analyze its readability..."
                className={`${textareaClass} min-h-[400px] resize-y transition-all focus:ring-primary/20 bg-white/80`}
              />
              {!hasContent && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                  <div className="text-center space-y-2">
                    <p className="text-lg font-medium">Text analysis ready</p>
                    <p className="text-sm">Start typing or paste content to see scores</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => navigator.clipboard.writeText(text)}
                className={actionClass}
                disabled={!hasContent}
              >
                Copy Text
              </button>
              <button
                onClick={() => setText("")}
                className={actionClass}
                disabled={!hasContent}
              >
                Clear
              </button>
              <label
                className={`${actionClass} cursor-pointer flex items-center justify-center`}
              >
                <input
                  type="file"
                  accept=".txt"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const content = event.target?.result;
                      if (typeof content === "string") {
                        setText(content);
                      }
                    };
                    reader.readAsText(file);
                    e.target.value = ''; // Reset input to allow uploading same file again
                  }}
                />
                Upload .txt
              </label>
            </div>

            {hasContent && showHighlight && (
              <div className="mt-8 space-y-4 border-t border-border/40 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-foreground">Sentence-Level Analysis</h3>
                  <div className="flex gap-3 text-[10px] font-bold uppercase">
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-400"></span> Easy</span>
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-orange-400"></span> Hard</span>
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-400"></span> Very Hard</span>
                  </div>
                </div>
                <div className="prose prose-slate max-w-none text-base leading-[1.8] text-foreground/90 p-4 rounded-xl bg-slate-50/50 border border-slate-100">
                  {result.sentences.map((s, idx) => (
                    <span
                      key={idx}
                      className={`inline px-0.5 rounded transition-all cursor-help ${difficultyColors[s.difficulty]}`}
                      title={`${s.words} words, Grade ${s.gradeLevel.toFixed(1)}`}
                    >
                      {s.text}{" "}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            {/* Primary Gauges */}
            <div className={`grid grid-cols-1 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 shadow-inner ${!hasContent && 'opacity-30 grayscale'}`}>
              <ReadabilityGauge
                score={result.fleschReadingEase}
                label={result.fleschReadingEaseLabel}
                className="scale-90"
              />
              <div className="pt-2 border-t border-slate-200">
                <div className="flex justify-between items-center px-2 py-2">
                  <span className="text-xs font-medium text-slate-500">Grade Level</span>
                  <span className="text-sm font-bold text-slate-900">{result.fleschKincaidGrade.toFixed(1)}</span>
                </div>
                <div className="flex justify-between items-center px-2 py-2">
                  <span className="text-xs font-medium text-slate-500">Difficulty</span>
                  <span className="text-sm font-bold text-slate-900">{result.fleschKincaidGradeLabel}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className={`grid grid-cols-2 gap-3 ${!hasContent && 'opacity-30'}`}>
              <div className="p-3 border border-border/60 bg-white/40 rounded-xl">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Words</div>
                <div className="mt-1 text-lg font-bold">{result.words}</div>
              </div>
              <div className="p-3 border border-border/60 bg-white/40 rounded-xl">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Sentences</div>
                <div className="mt-1 text-lg font-bold">{result.sentenceCount}</div>
              </div>
              <div className="p-3 border border-border/60 bg-white/40 rounded-xl">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Reading Time</div>
                <div className="mt-1 text-lg font-bold text-primary font-mono">{result.readingTimeMinutes.toFixed(1)}m</div>
              </div>
              <div className="p-3 border border-border/60 bg-white/40 rounded-xl">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Complex Words</div>
                <div className="mt-1 text-lg font-bold">{result.complexWords}</div>
              </div>
            </div>

            {/* Other Algorithms */}
            <div className={`space-y-3 ${!hasContent && 'opacity-30'}`}>
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80 px-1">Other Consensus Scores</h4>
              <div className="space-y-2">
                {[
                  { name: "Gunning Fog", score: result.gunningFog },
                  { name: "Coleman-Liau", score: result.colemanLiau },
                  { name: "ARI", score: result.ari },
                  { name: "SMOG Index", score: result.smog }
                ].map(algo => (
                  <div key={algo.name} className="flex items-center justify-between p-2.5 rounded-lg border border-border/40 bg-white/40 group hover:border-primary/20 transition-colors">
                    <span className="text-xs font-semibold text-slate-600">{algo.name}</span>
                    <span className="text-xs font-mono font-bold bg-slate-100 px-2 py-0.5 rounded">{algo.score.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Benchmarking */}
            <div className={`space-y-3 ${!hasContent && 'opacity-30'}`}>
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80 px-1">How you compare</h4>
              <div className="space-y-4">
                {benchmarks.map(b => {
                  const diff = Math.abs(result.fleschKincaidGrade - b.grade);
                  const isClose = diff < 2 && hasContent;
                  return (
                    <div key={b.name} className="relative">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold text-slate-700">{b.name}</span>
                        <span className="text-[10px] text-slate-400">Grade {b.grade}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${isClose ? 'bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]' : 'bg-slate-300'}`}
                          style={{ width: `${(b.grade / 20) * 100}%` }}
                        />
                      </div>
                      {isClose && (
                        <div className="absolute -top-1 right-0 animate-pulse">
                          <span className="text-[9px] font-bold text-primary uppercase">Your Match</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Score Interpretation Table */}
      <section className="grid gap-6 md:grid-cols-2">
        <div className="tool-frame p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Reading Ease Reference</h3>
          <div className="overflow-hidden border border-border/60 rounded-xl">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="p-3 text-left">Score</th>
                  <th className="p-3 text-left">Difficulty</th>
                  <th className="p-3 text-left">Audience</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                <tr><td className="p-3 font-mono">90-100</td><td className="p-3 text-emerald-600 font-medium">Very Easy</td><td className="p-3">Average 11-year old child</td></tr>
                <tr><td className="p-3 font-mono">80-90</td><td className="p-3 text-emerald-500 font-medium">Easy</td><td className="p-3">Conversational English</td></tr>
                <tr><td className="p-3 font-mono">70-80</td><td className="p-3 text-green-500 font-medium">Fairly Easy</td><td className="p-3">7th Grade students</td></tr>
                <tr><td className="p-3 font-mono">60-70</td><td className="p-3 text-slate-600 font-medium">Standard</td><td className="p-3">8th-9th Grade (NYT level)</td></tr>
                <tr><td className="p-3 font-mono">50-60</td><td className="p-3 text-orange-500 font-medium">Fairly Difficult</td><td className="p-3">High school graduates</td></tr>
                <tr><td className="p-3 font-mono">0-30</td><td className="p-3 text-red-600 font-medium">Very Difficult</td><td className="p-3">Postgraduate graduates</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="tool-frame p-6 bg-primary/[0.02] border-primary/10">
          <h3 className="text-lg font-bold text-foreground mb-4">Actionable Tips</h3>
          <ul className="space-y-4">
            <li className="flex gap-3">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs">1</div>
              <div>
                <p className="text-sm font-bold text-slate-900">Shorten your sentences</p>
                <p className="text-xs text-slate-500 mt-1">Aim for an average of 15-20 words. Longer sentences are harder for the brain to process in one go.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs">2</div>
              <div>
                <p className="text-sm font-bold text-slate-900">Use simpler words</p>
                <p className="text-xs text-slate-500 mt-1">Swap complex multisyllabic words (3+ syllables) for simpler synonyms where possible.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs">3</div>
              <div>
                <p className="text-sm font-bold text-slate-900">Avoid the passive voice</p>
                <p className="text-xs text-slate-500 mt-1">Active voice is more direct and easier to follow, which naturally improves readability scores.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs">4</div>
              <div>
                <p className="text-sm font-bold text-slate-900">Be target audience aware</p>
                <p className="text-xs text-slate-500 mt-1">If your audience is the general public, aim for a Reading Ease score above 60 and Grade 8-9.</p>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
