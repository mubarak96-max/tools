"use client";

import { useState, useMemo, useCallback } from "react";
import {
  calcCumulativeGpa,
  calcRequiredGpa,
  percentageToLetter,
  gpaToPercentage,
  GRADE_SCALE,
  LETTER_GRADES,
  newId,
  type Semester,
  type CourseRow,
  type CourseLevel,
  type LetterGrade,
} from "@/lib/gpa";

// ─── Constants ────────────────────────────────────────────────────

const COURSE_LEVELS: { value: CourseLevel; label: string; badge: string }[] = [
  { value: "regular", label: "Regular",   badge: "bg-stone-100 text-stone-600" },
  { value: "honors",  label: "Honors",    badge: "bg-blue-100 text-blue-700"   },
  { value: "ap_ib",   label: "AP / IB",   badge: "bg-purple-100 text-purple-700" },
];

const CREDIT_OPTIONS = [0.25, 0.5, 1, 2, 3, 4, 5];

const GPA_COLOUR: Record<string, { ring: string; text: string; bg: string }> = {
  emerald: { ring: "ring-emerald-400", text: "text-emerald-600", bg: "bg-emerald-50" },
  green:   { ring: "ring-green-400",   text: "text-green-600",   bg: "bg-green-50"   },
  yellow:  { ring: "ring-yellow-400",  text: "text-yellow-600",  bg: "bg-yellow-50"  },
  orange:  { ring: "ring-orange-400",  text: "text-orange-500",  bg: "bg-orange-50"  },
  red:     { ring: "ring-red-400",     text: "text-red-500",     bg: "bg-red-50"     },
  stone:   { ring: "ring-stone-300",   text: "text-stone-500",   bg: "bg-stone-50"   },
};

function getColourKey(gpa: number) {
  if (gpa >= 3.7) return "emerald";
  if (gpa >= 3.0) return "green";
  if (gpa >= 2.3) return "yellow";
  if (gpa >= 1.7) return "orange";
  if (gpa >= 1.0) return "red";
  return "stone";
}

// ─── Default state ────────────────────────────────────────────────

function defaultCourse(name = ""): CourseRow {
  return { id: newId(), name, grade: "", credits: 1, level: "regular" };
}

function defaultSemester(name = "Semester 1"): Semester {
  return {
    id: newId(),
    name,
    courses: [defaultCourse(), defaultCourse(), defaultCourse(), defaultCourse(), defaultCourse()],
  };
}

// ─── Grade ring visual ────────────────────────────────────────────

function GpaRing({ gpa, label, size = "lg" }: { gpa: number; label: string; size?: "lg" | "sm" }) {
  const key   = getColourKey(gpa);
  const col   = GPA_COLOUR[key];
  const pct   = Math.min(100, (gpa / 4.0) * 100);
  const r     = size === "lg" ? 52 : 36;
  const circ  = 2 * Math.PI * r;
  const dash  = (pct / 100) * circ;
  const dim   = size === "lg" ? 120 : 84;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: dim, height: dim }}>
        <svg width={dim} height={dim} className="-rotate-90">
          <circle cx={dim/2} cy={dim/2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={size === "lg" ? 8 : 6} />
          <circle
            cx={dim/2} cy={dim/2} r={r} fill="none"
            stroke="currentColor"
            strokeWidth={size === "lg" ? 8 : 6}
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            className={`${col.text} transition-all duration-700`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-bold ${col.text} ${size === "lg" ? "text-2xl" : "text-lg"} leading-none`}>
            {gpa.toFixed(2)}
          </span>
          {size === "lg" && <span className="text-[10px] text-stone-400 mt-0.5">/ 4.00</span>}
        </div>
      </div>
      <span className="text-xs font-medium text-stone-500">{label}</span>
    </div>
  );
}

// ─── Course row ───────────────────────────────────────────────────

function CourseRowInput({
  course,
  idx,
  onUpdate,
  onRemove,
}: {
  course: CourseRow;
  idx: number;
  onUpdate: (c: CourseRow) => void;
  onRemove: () => void;
}) {
  const [pctMode, setPctMode] = useState(false);
  const [pctValue, setPctValue] = useState(course.percentage?.toString() ?? "");

  const handlePct = (val: string) => {
    setPctValue(val);
    const n = parseFloat(val);
    if (!isNaN(n) && n >= 0 && n <= 100) {
      const letter = percentageToLetter(n);
      onUpdate({ ...course, grade: letter, percentage: n });
    }
  };

  return (
    <div className="grid grid-cols-[1fr_90px_72px_110px_28px] gap-2 items-center">
      {/* Course name */}
      <input
        type="text"
        placeholder={`Course ${idx + 1}`}
        value={course.name}
        onChange={e => onUpdate({ ...course, name: e.target.value })}
        className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-indigo-400 placeholder:text-stone-300"
      />

      {/* Grade — toggle letter / percentage */}
      <div className="relative">
        {pctMode ? (
          <input
            type="number"
            min={0}
            max={100}
            step={0.1}
            placeholder="%"
            value={pctValue}
            onChange={e => handlePct(e.target.value)}
            onBlur={() => pctValue === "" && setPctMode(false)}
            className="w-full px-2 py-2 text-sm border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-indigo-400 text-center"
          />
        ) : (
          <select
            value={course.grade}
            onChange={e => onUpdate({ ...course, grade: e.target.value as LetterGrade | "" })}
            className="w-full px-2 py-2 text-sm border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-indigo-400 appearance-none text-center cursor-pointer"
          >
            <option value="">Grade</option>
            {LETTER_GRADES.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        )}
        <button
          onClick={() => setPctMode(v => !v)}
          className="absolute -top-2 -right-2 text-[9px] bg-stone-100 text-stone-400 hover:bg-stone-200 rounded px-1 py-0.5 leading-tight"
          title={pctMode ? "Switch to letter grade" : "Enter percentage"}
        >
          {pctMode ? "A" : "%"}
        </button>
      </div>

      {/* Credits */}
      <select
        value={course.credits}
        onChange={e => onUpdate({ ...course, credits: Number(e.target.value) })}
        className="w-full px-2 py-2 text-sm border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-indigo-400 text-center"
      >
        {CREDIT_OPTIONS.map(c => <option key={c} value={c}>{c} cr</option>)}
      </select>

      {/* Level */}
      <select
        value={course.level}
        onChange={e => onUpdate({ ...course, level: e.target.value as CourseLevel })}
        className="w-full px-2 py-2 text-sm border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-indigo-400 text-xs"
      >
        {COURSE_LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
      </select>

      {/* Remove */}
      <button
        onClick={onRemove}
        className="text-stone-300 hover:text-red-400 transition-colors text-lg leading-none"
        aria-label="Remove course"
      >×</button>
    </div>
  );
}

// ─── Main calculator ──────────────────────────────────────────────

export default function GpaCalculator() {
  const [semesters, setSemesters] = useState<Semester[]>([defaultSemester("Semester 1")]);
  const [tab, setTab] = useState<"calculator" | "converter" | "target">("calculator");
  const [activeSem, setActiveSem] = useState<string | "all">("all");

  // Converter state
  const [convPct,  setConvPct]  = useState<string>("92");
  const [convGpa,  setConvGpa]  = useState<string>("3.7");
  const [convLetter, setConvLetter] = useState<LetterGrade>("A-");

  // Target GPA state
  const [targetGpa,       setTargetGpa]       = useState<string>("3.5");
  const [remainingCredits, setRemainingCredits] = useState<string>("30");

  const cumulativeResult = useMemo(() => calcCumulativeGpa(semesters), [semesters]);
  const { cumulative, semesterResults } = cumulativeResult;

  const displayResult = activeSem === "all"
    ? cumulative
    : semesterResults.find(s => s.semesterId === activeSem) ?? cumulative;

  const colKey = getColourKey(displayResult.unweightedGpa);
  const col    = GPA_COLOUR[colKey];

  // ── Semester mutations ──────────────────────────────────────────

  const addSemester = useCallback(() => {
    const n = semesters.length + 1;
    setSemesters(prev => [...prev, defaultSemester(`Semester ${n}`)]);
  }, [semesters]);

  const updateSemesterName = (id: string, name: string) => {
    setSemesters(prev => prev.map(s => s.id === id ? { ...s, name } : s));
  };

  const removeSemester = (id: string) => {
    setSemesters(prev => {
      const next = prev.filter(s => s.id !== id);
      return next.length ? next : [defaultSemester()];
    });
    setActiveSem("all");
  };

  const addCourse = (semId: string) => {
    setSemesters(prev => prev.map(s =>
      s.id === semId ? { ...s, courses: [...s.courses, defaultCourse()] } : s
    ));
  };

  const updateCourse = (semId: string, course: CourseRow) => {
    setSemesters(prev => prev.map(s =>
      s.id === semId
        ? { ...s, courses: s.courses.map(c => c.id === course.id ? course : c) }
        : s
    ));
  };

  const removeCourse = (semId: string, courseId: string) => {
    setSemesters(prev => prev.map(s =>
      s.id === semId
        ? { ...s, courses: s.courses.filter(c => c.id !== courseId) }
        : s
    ));
  };

  // Target GPA
  const requiredGpa = useMemo(() => {
    const tg = parseFloat(targetGpa);
    const rc = parseFloat(remainingCredits);
    if (isNaN(tg) || isNaN(rc) || rc <= 0) return null;
    return calcRequiredGpa(cumulative.unweightedGpa, cumulative.totalCredits, tg, rc);
  }, [cumulative, targetGpa, remainingCredits]);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">

      {/* ── Tabs ─────────────────────────────────────────────── */}
      <div className="flex border-b border-stone-200 bg-stone-50">
        {[
          { id: "calculator", label: "GPA Calculator" },
          { id: "converter",  label: "Grade Converter" },
          { id: "target",     label: "Target GPA" },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as typeof tab)}
            className={`flex-1 py-3.5 text-sm font-medium transition-colors ${tab === t.id ? "bg-white text-indigo-700 border-b-2 border-indigo-500" : "text-stone-500 hover:text-stone-700"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Calculator tab ─────────────────────────────────── */}
      {tab === "calculator" && (
        <div>
          {/* GPA summary bar */}
          <div className={`${col.bg} border-b border-stone-100 px-5 py-5`}>
            <div className="flex flex-wrap items-center gap-6">
              <GpaRing gpa={displayResult.unweightedGpa} label="Unweighted GPA" />
              <GpaRing gpa={Math.min(5, displayResult.weightedGpa)} label="Weighted GPA" />
              <div className="flex-1 grid grid-cols-2 gap-3 min-w-[200px]">
                {[
                  { label: "Courses",         value: displayResult.courseCount.toString()            },
                  { label: "Credit hours",    value: displayResult.totalCredits.toFixed(1)            },
                  { label: "% equivalent",    value: displayResult.percentageEquivalent               },
                  { label: "Grade equiv.",    value: displayResult.unweightedGpa >= 3.95 ? "A / A+" : displayResult.unweightedGpa >= 3.65 ? "A-" : displayResult.unweightedGpa >= 3.15 ? "B+ / B" : displayResult.unweightedGpa >= 2.65 ? "B- / C+" : displayResult.unweightedGpa >= 2.15 ? "C" : "C- or below" },
                ].map(m => (
                  <div key={m.label} className="bg-white/70 rounded-xl px-3 py-2">
                    <p className="text-[10px] text-stone-400">{m.label}</p>
                    <p className="text-sm font-semibold text-stone-800">{m.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Semester selector */}
          <div className="px-5 pt-4 pb-2 flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveSem("all")}
              className={`px-3 py-1.5 text-xs rounded-full border transition-colors font-medium ${activeSem === "all" ? "bg-indigo-600 text-white border-indigo-600" : "border-stone-200 text-stone-500 hover:border-stone-300"}`}
            >
              Cumulative
            </button>
            {semesters.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSem(s.id)}
                className={`px-3 py-1.5 text-xs rounded-full border transition-colors font-medium ${activeSem === s.id ? "bg-indigo-600 text-white border-indigo-600" : "border-stone-200 text-stone-500 hover:border-stone-300"}`}
              >
                {s.name}
              </button>
            ))}
            <button
              onClick={addSemester}
              className="px-3 py-1.5 text-xs rounded-full border border-dashed border-stone-300 text-stone-400 hover:border-indigo-400 hover:text-indigo-500 transition-colors"
            >
              + Add semester
            </button>
          </div>

          {/* Courses */}
          <div className="px-5 pb-5 space-y-6">
            {semesters
              .filter(s => activeSem === "all" || s.id === activeSem)
              .map(semester => (
                <div key={semester.id}>
                  <div className="flex items-center justify-between mb-3">
                    <input
                      type="text"
                      value={semester.name}
                      onChange={e => updateSemesterName(semester.id, e.target.value)}
                      className="font-semibold text-stone-700 text-sm bg-transparent border-b border-dashed border-stone-200 focus:outline-none focus:border-indigo-400 w-48"
                    />
                    <div className="flex items-center gap-3">
                      {semesterResults.find(r => r.semesterId === semester.id) && (
                        <span className="text-xs text-stone-400">
                          Sem GPA: <span className={`font-semibold ${GPA_COLOUR[getColourKey(semesterResults.find(r => r.semesterId === semester.id)!.unweightedGpa)].text}`}>
                            {semesterResults.find(r => r.semesterId === semester.id)!.unweightedGpa.toFixed(2)}
                          </span>
                        </span>
                      )}
                      {semesters.length > 1 && (
                        <button onClick={() => removeSemester(semester.id)}
                          className="text-xs text-stone-400 hover:text-red-500 transition-colors">
                          Remove
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Column headers */}
                  <div className="grid grid-cols-[1fr_90px_72px_110px_28px] gap-2 mb-1.5 px-0.5">
                    {["Course name", "Grade", "Credits", "Level", ""].map((h, i) => (
                      <p key={i} className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">{h}</p>
                    ))}
                  </div>

                  <div className="space-y-2">
                    {semester.courses.map((course, idx) => (
                      <CourseRowInput
                        key={course.id}
                        course={course}
                        idx={idx}
                        onUpdate={c => updateCourse(semester.id, c)}
                        onRemove={() => removeCourse(semester.id, course.id)}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => addCourse(semester.id)}
                    className="mt-3 flex items-center gap-1.5 text-xs text-stone-400 hover:text-indigo-500 transition-colors"
                  >
                    <span className="text-base leading-none">+</span> Add course
                  </button>
                </div>
              ))}
          </div>

          {/* Grade scale legend */}
          <div className="border-t border-stone-100 px-5 py-4 bg-stone-50">
            <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-2">Weighted GPA bonus</p>
            <div className="flex gap-3 flex-wrap">
              {COURSE_LEVELS.map(l => (
                <span key={l.value} className={`text-xs px-2 py-0.5 rounded-full font-medium ${l.badge}`}>
                  {l.label}{l.value === "honors" ? " +0.5" : l.value === "ap_ib" ? " +1.0" : " (no bonus)"}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Converter tab ──────────────────────────────────── */}
      {tab === "converter" && (
        <div className="p-6 space-y-6">

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* % → Letter */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200">
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">Percentage → Letter</p>
              <div className="relative mb-3">
                <input type="number" min={0} max={100} step={0.1}
                  value={convPct}
                  onChange={e => setConvPct(e.target.value)}
                  className="w-full px-3 pr-8 py-2.5 text-lg font-semibold border border-stone-200 rounded-xl bg-white focus:outline-none focus:border-indigo-400"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 font-medium">%</span>
              </div>
              {convPct !== "" && !isNaN(Number(convPct)) && (
                <div className="text-center">
                  <p className="text-4xl font-bold text-indigo-600">
                    {percentageToLetter(Number(convPct))}
                  </p>
                  <p className="text-sm text-stone-500 mt-1">
                    {(() => { const g = GRADE_SCALE.find(g2 => g2.letter === percentageToLetter(Number(convPct))); return g ? `GPA: ${g.unweighted.toFixed(1)}` : ""; })()}
                  </p>
                </div>
              )}
            </div>

            {/* GPA → % */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200">
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">GPA → Percentage</p>
              <input type="number" min={0} max={4.0} step={0.01}
                value={convGpa}
                onChange={e => setConvGpa(e.target.value)}
                className="w-full px-3 py-2.5 text-lg font-semibold border border-stone-200 rounded-xl bg-white focus:outline-none focus:border-indigo-400 mb-3"
                placeholder="0.00–4.00"
              />
              {convGpa !== "" && !isNaN(Number(convGpa)) && (
                <div className="text-center">
                  <p className="text-3xl font-bold text-indigo-600">
                    {gpaToPercentage(Number(convGpa))}
                  </p>
                  <p className="text-xs text-stone-400 mt-1">approximate range</p>
                </div>
              )}
            </div>

            {/* Letter → both */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200">
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">Letter → GPA & %</p>
              <select
                value={convLetter}
                onChange={e => setConvLetter(e.target.value as LetterGrade)}
                className="w-full px-3 py-2.5 text-lg font-semibold border border-stone-200 rounded-xl bg-white focus:outline-none focus:border-indigo-400 mb-3"
              >
                {LETTER_GRADES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              {(() => {
                const g = GRADE_SCALE.find(g2 => g2.letter === convLetter);
                return g ? (
                  <div className="text-center space-y-1">
                    <p className="text-3xl font-bold text-indigo-600">{g.unweighted.toFixed(1)}</p>
                    <p className="text-sm text-stone-500">{g.percentageRange}</p>
                  </div>
                ) : null;
              })()}
            </div>
          </div>

          {/* Full reference table */}
          <div>
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">Complete grade scale reference</p>
            <div className="rounded-xl border border-stone-200 overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-stone-50 border-b border-stone-200">
                  <tr>
                    <th className="py-2.5 px-4 text-left font-semibold text-stone-500">Letter</th>
                    <th className="py-2.5 px-4 text-center font-semibold text-stone-500">Percentage</th>
                    <th className="py-2.5 px-4 text-center font-semibold text-stone-500">4.0 GPA</th>
                    <th className="py-2.5 px-4 text-center font-semibold text-stone-500">Honors (4.5)</th>
                    <th className="py-2.5 px-4 text-center font-semibold text-stone-500">AP / IB (5.0)</th>
                  </tr>
                </thead>
                <tbody>
                  {GRADE_SCALE.map((g, i) => (
                    <tr key={g.letter} className={`border-b border-stone-100 last:border-0 ${i % 2 === 0 ? "" : "bg-stone-50/40"}`}>
                      <td className="py-2 px-4 font-bold text-stone-800">{g.letter}</td>
                      <td className="py-2 px-4 text-center text-stone-600">{g.percentageRange}</td>
                      <td className="py-2 px-4 text-center font-semibold text-indigo-600">{g.unweighted.toFixed(1)}</td>
                      <td className="py-2 px-4 text-center text-blue-600">{g.weighted.honors.toFixed(1)}</td>
                      <td className="py-2 px-4 text-center text-purple-600">{g.weighted.ap_ib.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Target GPA tab ─────────────────────────────────── */}
      {tab === "target" && (
        <div className="p-6 space-y-5">
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">Your current GPA</p>
            <p className="text-3xl font-bold text-indigo-700">{cumulative.unweightedGpa.toFixed(2)}</p>
            <p className="text-xs text-indigo-500 mt-0.5">Based on {cumulative.totalCredits} credit hours entered above</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1.5">Target GPA (out of 4.0)</label>
              <input type="number" min={0} max={4.0} step={0.01}
                value={targetGpa}
                onChange={e => setTargetGpa(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-indigo-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1.5">Remaining credit hours</label>
              <input type="number" min={1} step={1}
                value={remainingCredits}
                onChange={e => setRemainingCredits(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-indigo-400"
              />
            </div>
          </div>

          {requiredGpa !== null && (
            <div className={`rounded-2xl p-5 border text-center ${requiredGpa > 4.0 ? "bg-red-50 border-red-200" : requiredGpa < 0 ? "bg-green-50 border-green-200" : "bg-emerald-50 border-emerald-200"}`}>
              {requiredGpa > 4.0 ? (
                <>
                  <p className="text-red-600 font-bold text-2xl">Not achievable</p>
                  <p className="text-red-500 text-sm mt-1">
                    You would need a {requiredGpa.toFixed(2)} GPA in remaining credits — above the 4.0 maximum. Consider a lower target or more remaining credits.
                  </p>
                </>
              ) : requiredGpa < 0 ? (
                <>
                  <p className="text-green-700 font-bold text-2xl">Already achieved! 🎉</p>
                  <p className="text-green-600 text-sm mt-1">Your current GPA already exceeds your target.</p>
                </>
              ) : (
                <>
                  <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">Required GPA in remaining credits</p>
                  <p className="text-5xl font-bold text-emerald-700">{requiredGpa.toFixed(2)}</p>
                  <p className="text-sm text-emerald-600 mt-2">
                    You need to earn a {requiredGpa.toFixed(2)} GPA across your next {remainingCredits} credit hours to reach your target of {targetGpa}.
                  </p>
                </>
              )}
            </div>
          )}

          {/* GPA benchmarks */}
          <div>
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">Common GPA benchmarks</p>
            <div className="space-y-2">
              {[
                { label: "Latin honors — Cum Laude",      gpa: "3.5", note: "Varies by school" },
                { label: "Latin honors — Magna Cum Laude",gpa: "3.7", note: "Varies by school" },
                { label: "Latin honors — Summa Cum Laude",gpa: "3.9+", note: "Varies by school" },
                { label: "Dean's List (typical)",          gpa: "3.5+", note: "Usually per semester" },
                { label: "Academic probation threshold",   gpa: "< 2.0", note: "Most universities" },
                { label: "NCAA eligibility (D1)",          gpa: "2.3",  note: "Core course GPA" },
                { label: "Average US college GPA",         gpa: "~3.1", note: "Grade inflation considered" },
              ].map(b => (
                <div key={b.label} className="flex items-center justify-between px-4 py-2.5 bg-stone-50 rounded-xl border border-stone-100 text-xs">
                  <span className="text-stone-700">{b.label}</span>
                  <div className="text-right">
                    <span className="font-bold text-indigo-600">{b.gpa}</span>
                    <span className="text-stone-400 ml-2">{b.note}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
