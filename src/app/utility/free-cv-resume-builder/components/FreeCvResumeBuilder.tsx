"use client";

import {
  type ChangeEvent,
  type CSSProperties,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  CV_RESUME_ACCENT_COLORS,
  CV_RESUME_BUILDER_STORAGE_KEY,
  CV_RESUME_FONT_OPTIONS,
  CV_RESUME_TEMPLATE_OPTIONS,
  computeSummaryHint,
  createEmptyCertification,
  createEmptyCustomSection,
  createEmptyEducation,
  createEmptyExperience,
  createEmptyLanguage,
  createEmptyProject,
  createEmptyResumeDocument,
  createSampleResumeDocument,
  DEFAULT_SECTION_ORDER,
  formatResumeRange,
  splitLines,
  type FontFamily,
  type ResumeBuilderSettings,
  type ResumeCertification,
  type ResumeCustomSection,
  type ResumeDocument,
  type ResumeEducation,
  type ResumeExperience,
  type ResumeLanguage,
  type ResumeProject,
  type SectionKey,
} from "@/lib/tools/cv-resume-builder";

// ---------------------------------------------------------------------------
// Style constants
// ---------------------------------------------------------------------------
const panelClass = "rounded-[1.5rem] border border-border bg-background";
const fieldClass =
  "w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary";
const buttonClass =
  "rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary";
const actionButtonClass =
  "rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:opacity-90";

const MAX_UNDO_STEPS = 50;
const ATS_TIPS_STORAGE_KEY = "cv-resume-builder.ats-tips-open";

const SECTION_LABELS: Record<SectionKey, string> = {
  summary: "Summary",
  workExperience: "Work Experience",
  education: "Education",
  skills: "Skills",
  languages: "Languages",
  projects: "Projects",
  certifications: "Certifications",
  customSections: "Custom Sections",
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type EntryWithId =
  | ResumeExperience
  | ResumeEducation
  | ResumeLanguage
  | ResumeProject
  | ResumeCertification
  | ResumeCustomSection;

type CollectionKey =
  | "workExperience"
  | "education"
  | "languages"
  | "projects"
  | "certifications"
  | "customSections";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function parseImportedResumeDocument(value: string): ResumeDocument {
  const parsed = JSON.parse(value) as ResumeDocument;
  if (!parsed || typeof parsed !== "object" || !("personalDetails" in parsed) || !("settings" in parsed)) {
    throw new Error("Invalid resume backup format.");
  }
  if (!parsed.settings?.sectionOrder) {
    parsed.settings = { ...parsed.settings, sectionOrder: [...DEFAULT_SECTION_ORDER] };
  }
  if (!parsed.settings?.fontFamily) {
    parsed.settings = { ...parsed.settings, fontFamily: "inter" as FontFamily };
  }
  if (!parsed.personalDetails?.github) parsed.personalDetails = { ...parsed.personalDetails, github: "" };
  if (!parsed.personalDetails?.twitter) parsed.personalDetails = { ...parsed.personalDetails, twitter: "" };
  return parsed;
}

function downloadFile(name: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(url);
}

function normalizeLink(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

// ---------------------------------------------------------------------------
// ConfirmDialog
// ---------------------------------------------------------------------------
interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmDialog({ open, title, description, confirmLabel = "Continue", cancelLabel = "Cancel", onConfirm, onCancel }: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onCancel}>
      <div className={`${panelClass} w-full max-w-sm p-6 shadow-xl`} onClick={(e) => e.stopPropagation()}>
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        <div className="mt-5 flex justify-end gap-3">
          <button type="button" onClick={onCancel} className={buttonClass}>{cancelLabel}</button>
          <button type="button" onClick={onConfirm} className={actionButtonClass}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CollapsibleSection
// ---------------------------------------------------------------------------
function CollapsibleSection({ title, defaultOpen = true, children, badge }: { title: string; defaultOpen?: boolean; children: React.ReactNode; badge?: string | number }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span className="text-lg font-semibold text-foreground">{title}</span>
        <span className="flex items-center gap-2">
          {!open && badge !== undefined ? (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">{badge}</span>
          ) : null}
          <span className="text-muted-foreground">{open ? "▲" : "▼"}</span>
        </span>
      </button>
      {open ? <div className="mt-5">{children}</div> : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ColorPickerSwatch
// ---------------------------------------------------------------------------
function ColorPickerSwatch({ value, presets, onChange }: { value: string; presets: string[]; onChange: (color: string) => void }) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  function handleNative(e: ChangeEvent<HTMLInputElement>) {
    const color = e.target.value;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onChange(color), 100);
  }
  return (
    <div className="flex flex-wrap items-center gap-3">
      {presets.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          className={`h-10 w-10 rounded-full border-2 transition ${value === color ? "border-foreground scale-110" : "border-border"}`}
          style={{ backgroundColor: color }}
          aria-label={`Use accent color ${color}`}
        />
      ))}
      <label className="relative h-10 w-10 cursor-pointer overflow-hidden rounded-full border-2 border-dashed border-border" title="Custom color">
        <span className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">+</span>
        <input type="color" defaultValue={value} onChange={handleNative} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
      </label>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SkillsChipInput
// ---------------------------------------------------------------------------
function SkillsChipInput({ skills, onChange, placeholder = "Add skill…" }: { skills: string[]; onChange: (skills: string[]) => void; placeholder?: string }) {
  const [input, setInput] = useState("");

  function addSkill(raw: string) {
    const trimmed = raw.trim().replace(/,/g, "");
    if (!trimmed) return;
    if (skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) return;
    onChange([...skills, trimmed]);
  }

  function removeSkill(skill: string) {
    onChange(skills.filter((s) => s !== skill));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(input);
      setInput("");
    } else if (e.key === "Backspace" && input === "" && skills.length > 0) {
      removeSkill(skills[skills.length - 1]);
    }
  }

  return (
    <div className="min-h-[3rem] w-full rounded-[1rem] border border-border bg-background px-3 py-2 focus-within:ring-2 focus-within:ring-primary">
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span key={skill} className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {skill}
            <button type="button" onClick={() => removeSkill(skill)} className="ml-1 text-primary/60 hover:text-primary" aria-label={`Remove ${skill}`}>×</button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={skills.length === 0 ? placeholder : ""}
          className="min-w-[8rem] flex-1 bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// DraggableList
// ---------------------------------------------------------------------------
interface DraggableListProps<T extends { id: string }> {
  items: T[];
  onReorder: (fromIndex: number, toIndex: number) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
}

function DraggableList<T extends { id: string }>({ items, onReorder, renderItem }: DraggableListProps<T>) {
  const draggedIndex = useRef<number | null>(null);
  const [dropTarget, setDropTarget] = useState<number | null>(null);

  function handleDragStart(index: number) {
    draggedIndex.current = index;
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    setDropTarget(index);
  }

  function handleDrop(e: React.DragEvent, index: number) {
    e.preventDefault();
    const from = draggedIndex.current;
    if (from !== null && from !== index) {
      onReorder(from, index);
    }
    draggedIndex.current = null;
    setDropTarget(null);
  }

  function handleDragEnd() {
    draggedIndex.current = null;
    setDropTarget(null);
  }

  return (
    <div className="space-y-1">
      {items.map((item, index) => (
        <div key={item.id}>
          {dropTarget === index && draggedIndex.current !== null && draggedIndex.current !== index ? (
            <div className="h-0.5 rounded bg-primary" />
          ) : null}
          <div
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className="cursor-grab active:cursor-grabbing"
          >
            {renderItem(item, index)}
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// AtsTipsPanel
// ---------------------------------------------------------------------------
const ATS_TIPS = [
  "Use action verbs to start each bullet point (e.g. Led, Built, Reduced).",
  "Quantify achievements with numbers and percentages where possible.",
  "Avoid tables, columns, and text boxes — ATS parsers often skip them.",
  "Match keywords from the job description in your skills and bullets.",
  "Keep formatting simple — no headers/footers, no images in text flow.",
  "Use standard section headings: Experience, Education, Skills.",
];

function AtsTipsPanel() {
  const [open, setOpen] = useState(() => {
    try {
      const stored = window.localStorage.getItem(ATS_TIPS_STORAGE_KEY);
      return stored === null ? true : stored === "true";
    } catch {
      return true;
    }
  });

  function toggle() {
    setOpen((v) => {
      const next = !v;
      try { window.localStorage.setItem(ATS_TIPS_STORAGE_KEY, String(next)); } catch { /* ignore */ }
      return next;
    });
  }

  return (
    <section className={`${panelClass} p-4 sm:p-6 print:hidden`}>
      <button type="button" onClick={toggle} className="flex w-full items-center justify-between gap-3 text-left">
        <span className="text-base font-semibold text-foreground">ATS Tips</span>
        <span className="text-muted-foreground">{open ? "▲" : "▼"}</span>
      </button>
      {open ? (
        <ul className="mt-4 space-y-2">
          {ATS_TIPS.map((tip) => (
            <li key={tip} className="flex gap-2 text-sm text-muted-foreground">
              <span className="mt-0.5 shrink-0 text-primary">✓</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

// ---------------------------------------------------------------------------
// SectionTitle (preview)
// ---------------------------------------------------------------------------
function SectionTitle({ title, accentColor }: { title: string; accentColor: string }) {
  return (
    <div className="border-b pb-2 text-[0.72rem] font-bold uppercase tracking-[0.24em]" style={{ color: accentColor, borderColor: `${accentColor}33` }}>
      {title}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ResumePreview
// ---------------------------------------------------------------------------
function ResumePreview({ resume }: { resume: ResumeDocument }) {
  const { personalDetails, settings } = resume;
  const accentColor = settings.accentColor;
  const fontOption = CV_RESUME_FONT_OPTIONS.find((f) => f.value === settings.fontFamily) ?? CV_RESUME_FONT_OPTIONS[0];
  const sheetStyle: CSSProperties = {
    fontSize: `${settings.fontScale}%`,
    fontFamily: fontOption.fontFamily,
  };

  const contactItems = [
    personalDetails.email,
    personalDetails.phone,
    personalDetails.location,
    personalDetails.website,
    personalDetails.linkedIn,
    personalDetails.github,
    personalDetails.twitter,
  ].filter(Boolean);

  const experiences = resume.workExperience.filter((item) => item.company || item.role || item.bulletsText);
  const education = resume.education.filter((item) => item.institution || item.qualification || item.notesText);
  const languages = resume.languages.filter((item) => item.name || item.level);
  const projects = resume.projects.filter((item) => item.name || item.summary);
  const certifications = resume.certifications.filter((item) => item.name || item.issuer);
  const customSections = resume.customSections.filter((item) => item.title || item.itemsText);

  const sidebar = settings.template === "split";
  const compact = settings.template === "compact";
  const sectionOrder = settings.sectionOrder ?? DEFAULT_SECTION_ORDER;

  // Sections rendered in the main column (non-sidebar)
  function renderSection(key: SectionKey) {
    switch (key) {
      case "summary":
        if (!settings.showSummary || !resume.summary) return null;
        return (
          <section key="summary" className={compact ? "space-y-2" : "space-y-3"}>
            {!compact ? <SectionTitle title="Professional Summary" accentColor={accentColor} /> : null}
            <p className="text-sm leading-6 text-slate-700">{resume.summary}</p>
          </section>
        );
      case "workExperience":
        if (!experiences.length) return null;
        return (
          <section key="workExperience" className="space-y-3">
            <SectionTitle title="Work Experience" accentColor={accentColor} />
            <div className="space-y-4">
              {experiences.map((item) => (
                <article key={item.id} className="break-inside-avoid space-y-2">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-900">{item.role || "Role"}</h3>
                      <p className="text-sm text-slate-600">{[item.company, item.location].filter(Boolean).join(" | ")}</p>
                    </div>
                    <p className="text-xs font-medium text-slate-500">{formatResumeRange(item.startDate, item.endDate, item.isCurrent)}</p>
                  </div>
                  <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
                    {splitLines(item.bulletsText).map((line) => <li key={line} className="break-inside-avoid">{line}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </section>
        );
      case "education":
        if (!education.length) return null;
        return (
          <section key="education" className="space-y-3">
            <SectionTitle title="Education" accentColor={accentColor} />
            <div className={`gap-5 ${compact ? "grid md:grid-cols-2" : "space-y-3"}`}>
              {education.map((item) => (
                <article key={item.id} className="break-inside-avoid space-y-1.5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-900">{item.qualification || "Qualification"}</h3>
                      <p className="text-sm text-slate-600">{[item.institution, item.location].filter(Boolean).join(" | ")}</p>
                    </div>
                    <p className="text-xs font-medium text-slate-500">{formatResumeRange(item.startDate, item.endDate, item.isCurrent)}</p>
                  </div>
                  {item.notesText ? <p className="text-sm leading-6 text-slate-700">{item.notesText}</p> : null}
                </article>
              ))}
            </div>
          </section>
        );
      case "skills":
        if (!settings.showSkills || sidebar || !resume.skills.length) return null;
        return (
          <section key="skills" className="space-y-3">
            <SectionTitle title="Skills" accentColor={accentColor} />
            <div className="flex flex-wrap gap-2">
              {resume.skills.map((skill) => (
                <span key={skill} className="rounded-full px-2.5 py-1 text-xs font-medium" style={{ backgroundColor: `${accentColor}14`, color: accentColor }}>{skill}</span>
              ))}
            </div>
          </section>
        );
      case "languages":
        if (!settings.showLanguages || sidebar || !languages.length) return null;
        return (
          <section key="languages" className="space-y-3">
            <SectionTitle title="Languages" accentColor={accentColor} />
            <div className="space-y-1.5 text-sm text-slate-700">
              {languages.map((item) => <p key={item.id}><span className="font-semibold">{item.name || "Language"}</span>{item.level ? ` | ${item.level}` : ""}</p>)}
            </div>
          </section>
        );
      case "projects":
        if (!settings.showProjects || !projects.length) return null;
        return (
          <section key="projects" className="space-y-3">
            <SectionTitle title="Projects" accentColor={accentColor} />
            <div className="space-y-3">
              {projects.map((item) => (
                <article key={item.id} className="break-inside-avoid space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-900">{item.name || "Project"}</h3>
                    {item.link ? <a href={normalizeLink(item.link)} className="text-xs font-medium" style={{ color: accentColor }}>{item.link}</a> : null}
                    {(item.startDate || item.endDate) ? (
                      <span className="text-xs font-medium text-slate-500">{formatResumeRange(item.startDate, item.endDate)}</span>
                    ) : null}
                  </div>
                  {item.summary ? <p className="text-sm leading-6 text-slate-700">{item.summary}</p> : null}
                </article>
              ))}
            </div>
          </section>
        );
      case "certifications":
        if (!settings.showCertifications || sidebar || !certifications.length) return null;
        return (
          <section key="certifications" className="space-y-3">
            <SectionTitle title="Certifications" accentColor={accentColor} />
            <div className="space-y-1.5 text-sm text-slate-700">
              {certifications.map((item) => <p key={item.id}><span className="font-semibold">{item.name || "Certification"}</span>{item.issuer || item.year ? ` | ${[item.issuer, item.year].filter(Boolean).join(" | ")}` : ""}</p>)}
            </div>
          </section>
        );
      case "customSections":
        if (!settings.showCustomSections || !customSections.length) return null;
        return (
          <div key="customSections" className="space-y-6">
            {customSections.map((item) => (
              <section key={item.id} className="space-y-3">
                <SectionTitle title={item.title || "Custom Section"} accentColor={accentColor} />
                <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
                  {splitLines(item.itemsText).map((line) => <li key={line} className="break-inside-avoid">{line}</li>)}
                </ul>
              </section>
            ))}
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div
      className={`mx-auto w-full max-w-[210mm] min-h-[297mm] bg-white text-slate-900 shadow-[0_20px_60px_rgba(15,23,42,0.14)] print:max-w-none print:min-h-0 print:shadow-none ${sidebar ? "grid md:grid-cols-[15rem_minmax(0,1fr)]" : "block"} ${compact ? "p-7" : ""}`}
      style={sheetStyle}
    >
      {sidebar ? (
        <aside className="space-y-6 border-r bg-slate-50 p-6" style={{ borderColor: `${accentColor}22` }}>
          {settings.showPhoto && personalDetails.photoDataUrl ? (
            <img src={personalDetails.photoDataUrl} alt={personalDetails.fullName || "Profile photo"} className="h-32 w-32 rounded-2xl object-cover" />
          ) : null}
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold leading-tight">{personalDetails.fullName || "Your name"}</h1>
            <p className="text-base font-medium" style={{ color: accentColor }}>{personalDetails.role || "Professional title"}</p>
          </div>
          <section className="space-y-3">
            <SectionTitle title="Contact" accentColor={accentColor} />
            <div className="space-y-1.5 text-sm text-slate-600">{contactItems.map((item) => <p key={item}>{item}</p>)}</div>
          </section>
          {settings.showSkills && resume.skills.length ? (
            <section className="space-y-3">
              <SectionTitle title="Skills" accentColor={accentColor} />
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((skill) => (
                  <span key={skill} className="rounded-full px-2.5 py-1 text-xs font-medium" style={{ backgroundColor: `${accentColor}14`, color: accentColor }}>{skill}</span>
                ))}
              </div>
            </section>
          ) : null}
          {settings.showLanguages && languages.length ? (
            <section className="space-y-3">
              <SectionTitle title="Languages" accentColor={accentColor} />
              <div className="space-y-2 text-sm text-slate-700">
                {languages.map((item) => <p key={item.id}><span className="font-semibold">{item.name || "Language"}</span>{item.level ? ` | ${item.level}` : ""}</p>)}
              </div>
            </section>
          ) : null}
          {settings.showCertifications && certifications.length ? (
            <section className="space-y-3">
              <SectionTitle title="Certifications" accentColor={accentColor} />
              <div className="space-y-2 text-sm text-slate-700">
                {certifications.map((item) => <p key={item.id}><span className="font-semibold">{item.name || "Certification"}</span>{item.issuer || item.year ? ` | ${[item.issuer, item.year].filter(Boolean).join(" | ")}` : ""}</p>)}
              </div>
            </section>
          ) : null}
        </aside>
      ) : null}

      <div className={sidebar ? "space-y-6 p-7" : compact ? "space-y-5" : "space-y-6 p-8"}>
        {!sidebar ? (
          <header className="border-b pb-6" style={{ borderColor: `${accentColor}22` }}>
            <div className="flex flex-wrap items-start gap-6">
              {settings.showPhoto && personalDetails.photoDataUrl ? (
                <img src={personalDetails.photoDataUrl} alt={personalDetails.fullName || "Profile photo"} className="h-24 w-24 rounded-2xl object-cover" />
              ) : null}
              <div className="min-w-0 flex-1 space-y-3">
                <div>
                  <h1 className="text-4xl font-semibold leading-none">{personalDetails.fullName || "Your name"}</h1>
                  <p className="mt-2 text-base font-medium uppercase tracking-[0.22em]" style={{ color: accentColor }}>{personalDetails.role || "Professional title"}</p>
                </div>
                <div className={`text-sm text-slate-600 ${compact ? "grid gap-1" : "flex flex-wrap gap-x-5 gap-y-1"}`}>
                  {contactItems.map((item) => <span key={item}>{item}</span>)}
                </div>
              </div>
            </div>
          </header>
        ) : null}

        {sectionOrder.map((key) => renderSection(key))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// InputField / TextAreaField / EntryActions
// ---------------------------------------------------------------------------
function InputField({ label, value, onChange, type = "text", disabled = false, placeholder = "" }: { label: string; value: string; onChange: (value: string) => void; type?: string; disabled?: boolean; placeholder?: string }) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <input type={type} value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={fieldClass} />
    </label>
  );
}

function TextAreaField({ label, value, onChange, rows = 4 }: { label: string; value: string; onChange: (value: string) => void; rows?: number }) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} className={`${fieldClass} resize-y`} />
    </label>
  );
}

function EntryActions({ onRemove, onMoveUp, onMoveDown }: { onRemove: () => void; onMoveUp?: () => void; onMoveDown?: () => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {onMoveUp ? <button type="button" onClick={onMoveUp} className={buttonClass}>Up</button> : null}
      {onMoveDown ? <button type="button" onClick={onMoveDown} className={buttonClass}>Down</button> : null}
      <button type="button" onClick={onRemove} className={buttonClass}>Remove</button>
    </div>
  );
}
// ---------------------------------------------------------------------------
// Main Editor Component
// ---------------------------------------------------------------------------
export default function FreeCvResumeBuilder() {
  const [resume, setResume] = useState<ResumeDocument>(() => createEmptyResumeDocument());
  const [history, setHistory] = useState<ResumeDocument[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "preview" | "settings">("edit");
  const [editSection, setEditSection] = useState<"personal" | "summary" | "experience" | "education" | "skills" | "more">("personal");
  const [importError, setImportError] = useState<string | null>(null);

  // Persistence & History
  const saveToHistory = useCallback((doc: ResumeDocument) => {
    setHistory((prev) => {
      const next = prev.slice(0, historyIndex + 1);
      next.push(doc);
      if (next.length > MAX_UNDO_STEPS) next.shift();
      return next;
    });
    setHistoryIndex((prev) => Math.min(prev + 1, MAX_UNDO_STEPS - 1));
  }, [historyIndex]);

  const updateResume = useCallback((updater: (prev: ResumeDocument) => ResumeDocument) => {
    setResume((prev) => {
      const next = updater({ ...prev, updatedAt: new Date().toISOString() });
      saveToHistory(next);
      try { window.localStorage.setItem(CV_RESUME_BUILDER_STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, [saveToHistory]);

  const undo = () => {
    if (historyIndex > 0) {
      const nextIndex = historyIndex - 1;
      const prev = history[nextIndex];
      setResume(prev);
      setHistoryIndex(nextIndex);
    }
  };

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(CV_RESUME_BUILDER_STORAGE_KEY);
      if (stored) {
        const parsed = parseImportedResumeDocument(stored);
        setResume(parsed);
        setHistory([parsed]);
        setHistoryIndex(0);
      } else {
        const sample = createSampleResumeDocument();
        setResume(sample);
        setHistory([sample]);
        setHistoryIndex(0);
      }
    } catch {
      const empty = createEmptyResumeDocument();
      setResume(empty);
      setHistory([empty]);
      setHistoryIndex(0);
    }
    setIsLoaded(true);
  }, []);

  if (!isLoaded) return <div className="min-h-screen py-20 text-center text-muted-foreground">Loading CV builder…</div>;

  const handlePrint = () => window.print();

  const handleExport = () => {
    const data = JSON.stringify(resume, null, 2);
    downloadFile(`resume-backup-${new Date().toISOString().split("T")[0]}.json`, data, "application/json");
  };

  const handleImport = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = parseImportedResumeDocument(evt.target?.result as string);
        updateResume(() => parsed);
        setImportError(null);
      } catch (err: any) {
        setImportError(err.message || "Failed to import resume backup.");
      }
    };
    reader.readAsText(file);
  };

  const resetResume = () => {
    if (confirm("Are you sure? This will delete all current data and load a clean sample.")) {
      updateResume(() => createSampleResumeDocument());
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,1.2fr)] print:block">
        
        {/* Left Column: Editor Controls */}
        <aside className="space-y-6 print:hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-5">
            <div className="flex gap-1 rounded-full border border-border bg-card p-1">
              {(["edit", "preview", "settings"] as const).map((id) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`rounded-full px-5 py-2 text-sm font-semibold capitalize transition ${activeTab === id ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {id}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={handlePrint} className={actionButtonClass}>Print to PDF</button>
              <button onClick={handleExport} className={buttonClass} title="Export JSON backup">Backup</button>
            </div>
          </div>

          {importError && <p className="text-xs font-medium text-destructive">{importError}</p>}

          {activeTab === "edit" && (
            <div className="animate-fade-in space-y-6">
              <nav className="flex flex-wrap gap-2">
                {[
                  { id: "personal", label: "Contact" },
                  { id: "summary", label: "Summary" },
                  { id: "experience", label: "Experience" },
                  { id: "education", label: "Education" },
                  { id: "skills", label: "Skills" },
                  { id: "more", label: "More" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setEditSection(tab.id as any)}
                    className={`rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition ${editSection === tab.id ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>

              <div className="space-y-8 rounded-[2rem] border border-border/80 bg-card p-6 sm:p-8">
                {editSection === "personal" && (
                  <div className="animate-fade-in space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <InputField label="Full Name" value={resume.personalDetails.fullName} onChange={(v) => updateResume(r => ({ ...r, personalDetails: { ...r.personalDetails, fullName: v } }))} />
                      <InputField label="Professional Title" value={resume.personalDetails.role} onChange={(v) => updateResume(r => ({ ...r, personalDetails: { ...r.personalDetails, role: v } }))} />
                      <InputField label="Email Address" value={resume.personalDetails.email} onChange={(v) => updateResume(r => ({ ...r, personalDetails: { ...r.personalDetails, email: v } }))} />
                      <InputField label="Phone Number" value={resume.personalDetails.phone} onChange={(v) => updateResume(r => ({ ...r, personalDetails: { ...r.personalDetails, phone: v } }))} />
                      <InputField label="Location" value={resume.personalDetails.location} onChange={(v) => updateResume(r => ({ ...r, personalDetails: { ...r.personalDetails, location: v } }))} />
                      <InputField label="Website" value={resume.personalDetails.website} onChange={(v) => updateResume(r => ({ ...r, personalDetails: { ...r.personalDetails, website: v } }))} />
                      <InputField label="LinkedIn URL" value={resume.personalDetails.linkedIn} onChange={(v) => updateResume(r => ({ ...r, personalDetails: { ...r.personalDetails, linkedIn: v } }))} />
                      <InputField label="GitHub URL" value={resume.personalDetails.github} onChange={(v) => updateResume(r => ({ ...r, personalDetails: { ...r.personalDetails, github: v } }))} />
                    </div>
                  </div>
                )}

                {editSection === "summary" && (
                  <div className="animate-fade-in space-y-4">
                    <TextAreaField label="Professional Summary" value={resume.summary} onChange={(v) => updateResume(r => ({ ...r, summary: v }))} rows={6} />
                    <p className="text-[11px] font-medium text-muted-foreground">{computeSummaryHint(resume.summary)}</p>
                  </div>
                )}

                {editSection === "experience" && (
                  <div className="animate-fade-in space-y-8">
                    {resume.workExperience.map((item, idx) => (
                      <div key={item.id} className="space-y-4 rounded-[1.5rem] border border-border/60 bg-background/50 p-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <InputField label="Company" value={item.company} onChange={(v) => updateResume(r => { const next = [...r.workExperience]; next[idx].company = v; return { ...r, workExperience: next }; })} />
                          <InputField label="Role" value={item.role} onChange={(v) => updateResume(r => { const next = [...r.workExperience]; next[idx].role = v; return { ...r, workExperience: next }; })} />
                          <InputField label="Start Date (Optional)" value={item.startDate} onChange={(v) => updateResume(r => { const next = [...r.workExperience]; next[idx].startDate = v; return { ...r, workExperience: next }; })} placeholder="e.g. 2022-01" />
                          <InputField label="End Date (Optional)" value={item.endDate} onChange={(v) => updateResume(r => { const next = [...r.workExperience]; next[idx].endDate = v; return { ...r, workExperience: next }; })} disabled={item.isCurrent} />
                          <label className="flex items-center gap-2">
                            <input type="checkbox" checked={item.isCurrent} onChange={(e) => updateResume(r => { const next = [...r.workExperience]; next[idx].isCurrent = e.target.checked; return { ...r, workExperience: next }; })} />
                            <span className="text-sm">Still working here</span>
                          </label>
                        </div>
                        <TextAreaField label="Bullet Points (one per line)" value={item.bulletsText} onChange={(v) => updateResume(r => { const next = [...r.workExperience]; next[idx].bulletsText = v; return { ...r, workExperience: next }; })} />
                        <EntryActions 
                          onRemove={() => updateResume(r => ({ ...r, workExperience: r.workExperience.filter(e => e.id !== item.id) }))} 
                          onMoveUp={idx > 0 ? () => updateResume(r => { const n = [...r.workExperience]; [n[idx], n[idx-1]] = [n[idx-1], n[idx]]; return { ...r, workExperience: n }; }) : undefined}
                        />
                      </div>
                    ))}
                    <button onClick={() => updateResume(r => ({ ...r, workExperience: [...r.workExperience, createEmptyExperience()] }))} className={buttonClass}>+ Add Experience</button>
                  </div>
                )}

                {editSection === "education" && (
                  <div className="animate-fade-in space-y-8">
                    {resume.education.map((item, idx) => (
                      <div key={item.id} className="space-y-4 rounded-[1.5rem] border border-border/60 bg-background/50 p-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <InputField label="Institution" value={item.institution} onChange={(v) => updateResume(r => { const next = [...r.education]; next[idx].institution = v; return { ...r, education: next }; })} />
                          <InputField label="Degree / Qualification" value={item.qualification} onChange={(v) => updateResume(r => { const next = [...r.education]; next[idx].qualification = v; return { ...r, education: next }; })} />
                          <InputField label="Start Date" value={item.startDate} onChange={(v) => updateResume(r => { const next = [...r.education]; next[idx].startDate = v; return { ...r, education: next }; })} />
                          <InputField label="End Date" value={item.endDate} onChange={(v) => updateResume(r => { const next = [...r.education]; next[idx].endDate = v; return { ...r, education: next }; })} />
                        </div>
                        <EntryActions onRemove={() => updateResume(r => ({ ...r, education: r.education.filter(e => e.id !== item.id) }))} />
                      </div>
                    ))}
                    <button onClick={() => updateResume(r => ({ ...r, education: [...r.education, createEmptyEducation()] }))} className={buttonClass}>+ Add Education</button>
                  </div>
                )}

                {editSection === "skills" && (
                  <div className="animate-fade-in space-y-4">
                    <p className="text-sm text-muted-foreground">Type a skill and press Enter or comma to add.</p>
                    <SkillsChipInput skills={resume.skills} onChange={(v) => updateResume(r => ({ ...r, skills: v }))} />
                  </div>
                )}

                {editSection === "more" && (
                  <div className="animate-fade-in space-y-8">
                    <CollapsibleSection title="Languages" badge={resume.languages.length}>
                      <div className="space-y-4">
                         {resume.languages.map((item, idx) => (
                           <div key={item.id} className="flex flex-wrap gap-4">
                             <InputField label="Language" value={item.name} onChange={(v) => updateResume(r => { const next=[...r.languages]; next[idx].name=v; return {...r, languages: next}; })} />
                             <InputField label="Level (e.g. Native)" value={item.level} onChange={(v) => updateResume(r => { const next=[...r.languages]; next[idx].level=v; return {...r, languages: next}; })} />
                             <button onClick={() => updateResume(r => ({ ...r, languages: r.languages.filter(l => l.id !== item.id) }))} className="text-destructive text-sm font-bold">×</button>
                           </div>
                         ))}
                         <button onClick={() => updateResume(r => ({ ...r, languages: [...r.languages, createEmptyLanguage()] }))} className={buttonClass}>+ Add Language</button>
                      </div>
                    </CollapsibleSection>
                    
                    <CollapsibleSection title="Certifications" badge={resume.certifications.length}>
                      <div className="space-y-4">
                         {resume.certifications.map((item, idx) => (
                           <div key={item.id} className="flex flex-wrap items-end gap-3">
                             <div className="flex-1 min-w-[150px]"><InputField label="Name" value={item.name} onChange={(v) => updateResume(r => { const next=[...r.certifications]; next[idx].name=v; return {...r, certifications: next}; })} /></div>
                             <div className="flex-1 min-w-[150px]"><InputField label="Issuer" value={item.issuer} onChange={(v) => updateResume(r => { const next=[...r.certifications]; next[idx].issuer=v; return {...r, certifications: next}; })} /></div>
                             <button onClick={() => updateResume(r => ({ ...r, certifications: r.certifications.filter(l => l.id !== item.id) }))} className="text-destructive text-sm font-bold mb-3 px-2">×</button>
                           </div>
                         ))}
                         <button onClick={() => updateResume(r => ({ ...r, certifications: [...r.certifications, createEmptyCertification()] }))} className={buttonClass}>+ Add Certification</button>
                      </div>
                    </CollapsibleSection>

                    <CollapsibleSection title="Custom Sections" badge={resume.customSections.length}>
                      <div className="space-y-8">
                         {resume.customSections.map((item, idx) => (
                           <div key={item.id} className="space-y-4 border-l-2 border-primary/20 pl-6">
                             <InputField label="Section Title" value={item.title} onChange={(v) => updateResume(r => { const next=[...r.customSections]; next[idx].title=v; return {...r, customSections: next}; })} />
                             <TextAreaField label="List items (one per line)" value={item.itemsText} onChange={(v) => updateResume(r => { const next=[...r.customSections]; next[idx].itemsText=v; return {...r, customSections: next}; })} />
                             <button onClick={() => updateResume(r => ({ ...r, customSections: r.customSections.filter(l => l.id !== item.id) }))} className="text-destructive text-sm font-bold">Remove Section</button>
                           </div>
                         ))}
                         <button onClick={() => updateResume(r => ({ ...r, customSections: [...r.customSections, createEmptyCustomSection()] }))} className={buttonClass}>+ Add Custom Section</button>
                      </div>
                    </CollapsibleSection>
                  </div>
                )}
              </div>
              <AtsTipsPanel />
              <div className="flex justify-between">
                <button onClick={resetResume} className="text-xs font-semibold text-muted-foreground underline">Reset to Sample</button>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Import Backup:</span>
                  <input type="file" accept=".json" onChange={handleImport} className="text-xs text-muted-foreground" />
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="animate-fade-in space-y-8 rounded-[2rem] border border-border/80 bg-card p-6 sm:p-8">
              <section className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Select Template</h3>
                <div className="grid gap-3 sm:grid-cols-3">
                  {CV_RESUME_TEMPLATE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateResume(r => ({ ...r, settings: { ...r.settings, template: opt.value } }))}
                      className={`flex flex-col gap-1 rounded-[1rem] border p-4 text-left transition ${resume.settings.template === opt.value ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border bg-background hover:border-primary/40"}`}
                    >
                      <span className="text-sm font-bold text-foreground">{opt.label}</span>
                      <span className="text-[11px] text-muted-foreground leading-tight">{opt.description}</span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Accent Color</h3>
                <ColorPickerSwatch value={resume.settings.accentColor} presets={CV_RESUME_ACCENT_COLORS} onChange={(v) => updateResume(r => ({ ...r, settings: { ...r.settings, accentColor: v } }))} />
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Typography</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-xs font-medium text-muted-foreground">Font Family</span>
                    <select 
                      value={resume.settings.fontFamily} 
                      onChange={(e) => updateResume(r => ({ ...r, settings: { ...r.settings, fontFamily: e.target.value as any } }))}
                      className={fieldClass}
                    >
                      {CV_RESUME_FONT_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                    </select>
                  </label>
                  <label className="space-y-2">
                    <span className="text-xs font-medium text-muted-foreground">Scale ({resume.settings.fontScale}%)</span>
                    <input type="range" min="70" max="130" step="5" value={resume.settings.fontScale} onChange={(e) => updateResume(r => ({ ...r, settings: { ...r.settings, fontScale: Number(e.target.value) } }))} className="w-full" />
                  </label>
                </div>
              </section>

              <section className="space-y-4 border-t border-border/60 pt-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Visibility Controls</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: "showPhoto", label: "Show Photo" },
                    { key: "showSummary", label: "Summary" },
                    { key: "showSkills", label: "Skills" },
                    { key: "showLanguages", label: "Languages" },
                    { key: "showProjects", label: "Projects" },
                    { key: "showCertifications", label: "Certifications" },
                    { key: "showCustomSections", label: "Custom Sections" },
                  ].map((ctrl) => (
                    <label key={ctrl.key} className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={(resume.settings as any)[ctrl.key]} 
                        onChange={(e) => updateResume(r => ({ ...r, settings: { ...r.settings, [ctrl.key]: e.target.checked } }))} 
                      />
                      <span className="text-sm font-medium text-slate-700">{ctrl.label}</span>
                    </label>
                  ))}
                </div>
              </section>
            </div>
          )}
        </aside>

        {/* Right Column: Dynamic Preview */}
        <main className={`${activeTab === "edit" ? "hidden lg:block" : "block"} animate-fade-in`}>
          <div className="sticky top-24">
            <ResumePreview resume={resume} />
            <div className="mt-4 flex items-center justify-between text-xs font-medium text-muted-foreground print:hidden">
              <p>Last updated: {new Date(resume.updatedAt).toLocaleTimeString()}</p>
              <div className="flex gap-4">
                <button onClick={undo} disabled={historyIndex <= 0} className="hover:text-primary disabled:opacity-30">Undo</button>
                <span>Step {historyIndex + 1} of {history.length}</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
