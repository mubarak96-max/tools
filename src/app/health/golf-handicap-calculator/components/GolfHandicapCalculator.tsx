"use client";

import React, { useState, useMemo } from "react";
import { Plus, Trash2, Copy, CheckCircle2, Flag, TrendingDown } from "lucide-react";

interface Round {
  id: number;
  score: string;
  courseRating: string;
  slopeRating: string;
}

function calcDifferential(score: number, courseRating: number, slopeRating: number): number {
  return (score - courseRating) * 113 / slopeRating;
}

// WHS: how many best differentials to use based on total rounds
function getBestCount(total: number): number {
  if (total < 3) return 0;
  if (total <= 4) return 1;
  if (total <= 6) return 2;
  if (total <= 8) return 2;
  if (total <= 11) return 3;
  if (total <= 14) return 4;
  if (total <= 16) return 5;
  if (total <= 18) return 6;
  if (total === 19) return 7;
  return 8;
}

export function GolfHandicapCalculator() {
  const [rounds, setRounds] = useState<Round[]>([
    { id: 1, score: "85", courseRating: "71.5", slopeRating: "125" },
    { id: 2, score: "88", courseRating: "72.0", slopeRating: "130" },
    { id: 3, score: "83", courseRating: "70.8", slopeRating: "118" },
    { id: 4, score: "87", courseRating: "71.5", slopeRating: "125" },
    { id: 5, score: "84", courseRating: "71.0", slopeRating: "120" },
  ]);
  const [nextId, setNextId] = useState(6);
  const [copied, setCopied] = useState(false);

  const addRound = () => {
    if (rounds.length >= 20) return;
    setRounds([...rounds, { id: nextId, score: "", courseRating: "71.5", slopeRating: "113" }]);
    setNextId(nextId + 1);
  };

  const removeRound = (id: number) => {
    setRounds(rounds.filter(r => r.id !== id));
  };

  const updateRound = (id: number, field: keyof Round, value: string) => {
    setRounds(rounds.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const stats = useMemo(() => {
    const validRounds = rounds
      .map(r => {
        const score = parseFloat(r.score);
        const cr = parseFloat(r.courseRating);
        const sr = parseFloat(r.slopeRating);
        if (isNaN(score) || isNaN(cr) || isNaN(sr) || sr <= 0) return null;
        return { ...r, differential: calcDifferential(score, cr, sr) };
      })
      .filter(Boolean) as Array<{ id: number; score: string; courseRating: string; slopeRating: string; differential: number }>;

    const total = validRounds.length;
    const bestCount = getBestCount(total);
    if (bestCount === 0) return { handicapIndex: null, bestCount: 0, differentials: [], validRounds, total };

    const sorted = [...validRounds].sort((a, b) => a.differential - b.differential);
    const best = sorted.slice(0, bestCount);
    const avgBest = best.reduce((s, r) => s + r.differential, 0) / bestCount;
    const handicapIndex = Math.round(avgBest * 0.96 * 10) / 10;

    return { handicapIndex, bestCount, differentials: sorted, validRounds, total };
  }, [rounds]);

  const copyToClipboard = () => {
    const text = `Handicap Index: ${stats.handicapIndex ?? "N/A"}\nRounds recorded: ${stats.total}\nBest differentials used: ${stats.bestCount}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSkillLevel = (h: number | null) => {
    if (h === null) return { label: "—", color: "text-muted-foreground" };
    if (h <= 0) return { label: "Scratch / Pro", color: "text-emerald-600" };
    if (h <= 9) return { label: "Low Handicap", color: "text-emerald-500" };
    if (h <= 18) return { label: "Mid Handicap", color: "text-amber-500" };
    return { label: "High Handicap", color: "text-orange-500" };
  };

  const skill = getSkillLevel(stats.handicapIndex);

  return (
    <section className="tool-frame p-4 sm:p-8 md:p-12 rounded-[3.5rem] bg-white border border-border/50 shadow-2vw">
      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-0 border border-border rounded-[3rem] overflow-hidden bg-background shadow-2xl">

        {/* Score Entry Panel */}
        <div className="p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-border flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
              <Flag className="w-4 h-4 text-primary" /> Score History ({rounds.length}/20)
            </h3>
            <button onClick={addRound} disabled={rounds.length >= 20}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-40">
              <Plus className="w-3.5 h-3.5" /> Add Round
            </button>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[500px] pr-1">
            {/* Column headers */}
            <div className="grid grid-cols-[2.5fr_2fr_2fr_1fr] gap-2 px-2">
              {["Score", "Course Rating", "Slope Rating", ""].map(h => (
                <span key={h} className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{h}</span>
              ))}
            </div>
            {rounds.map((r, idx) => {
              const score = parseFloat(r.score);
              const cr = parseFloat(r.courseRating);
              const sr = parseFloat(r.slopeRating);
              const diff = (!isNaN(score) && !isNaN(cr) && !isNaN(sr) && sr > 0)
                ? calcDifferential(score, cr, sr).toFixed(1) : "—";
              return (
                <div key={r.id} className="grid grid-cols-[2.5fr_2fr_2fr_1fr] gap-2 items-center">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground opacity-50">#{idx + 1}</span>
                    <input type="number" value={r.score} onChange={(e) => updateRound(r.id, "score", e.target.value)}
                      placeholder="85"
                      className="w-full bg-muted/10 border border-border focus:border-primary/50 rounded-xl pl-8 pr-2 py-2.5 text-sm font-bold outline-none transition-all" />
                  </div>
                  <input type="number" step="0.1" value={r.courseRating} onChange={(e) => updateRound(r.id, "courseRating", e.target.value)}
                    className="w-full bg-muted/10 border border-border focus:border-primary/50 rounded-xl px-3 py-2.5 text-sm font-bold outline-none transition-all" />
                  <input type="number" value={r.slopeRating} onChange={(e) => updateRound(r.id, "slopeRating", e.target.value)}
                    className="w-full bg-muted/10 border border-border focus:border-primary/50 rounded-xl px-3 py-2.5 text-sm font-bold outline-none transition-all" />
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold text-primary w-8 text-center">{diff}</span>
                    <button onClick={() => removeRound(r.id)} className="p-1.5 rounded-lg hover:bg-red-100 text-muted-foreground hover:text-red-500 transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Results Panel */}
        <div className="p-6 sm:p-10 bg-muted/10 flex flex-col justify-center gap-6">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">WHS Handicap Index</span>
            <div className="text-8xl font-black italic tracking-tighter text-foreground">
              {stats.handicapIndex !== null ? stats.handicapIndex.toFixed(1) : "—"}
            </div>
            <span className={`text-sm font-bold uppercase tracking-widest ${skill.color}`}>{skill.label}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-3xl bg-white border border-border shadow-sm text-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Rounds Used</span>
              <span className="text-xl font-black">{stats.bestCount} best</span>
              <span className="text-[9px] block text-muted-foreground">of {stats.total} rounds</span>
            </div>
            <div className="p-4 rounded-3xl bg-white border border-border shadow-sm text-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Min Differential</span>
              <span className="text-xl font-black text-emerald-600">
                {stats.differentials.length > 0 ? stats.differentials[0].differential.toFixed(1) : "—"}
              </span>
            </div>
          </div>

          {stats.total < 3 && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-700 text-center">
              Enter at least 3 score rounds to calculate your Handicap Index.
            </div>
          )}

          <button onClick={copyToClipboard} className="w-full py-4 rounded-full bg-primary text-white font-black uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all text-xs">
            {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied Index" : "Copy Handicap Index"}
          </button>
        </div>
      </div>
    </section>
  );
}
