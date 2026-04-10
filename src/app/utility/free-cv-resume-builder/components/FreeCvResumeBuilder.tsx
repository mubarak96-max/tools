"use client";

import {
  type ChangeEvent,
  type CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  CV_RESUME_ACCENT_COLORS,
  CV_RESUME_BUILDER_STORAGE_KEY,
  CV_RESUME_TEMPLATE_OPTIONS,
  createEmptyCertification,
  createEmptyCustomSection,
  createEmptyEducation,
  createEmptyExperience,
  createEmptyLanguage,
  createEmptyProject,
  createEmptyResumeDocument,
  createSampleResumeDocument,
  formatResumeRange,
  splitLines,
  splitSkills,
  type ResumeBuilderSettings,
  type ResumeCertification,
  type ResumeCustomSection,
  type ResumeDocument,
  type ResumeEducation,
  type ResumeExperience,
  type ResumeLanguage,
  type ResumeProject,
} from "@/lib/tools/cv-resume-builder";

const panelClass = "rounded-[1.5rem] border border-border bg-background";
const fieldClass =
  "w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary";
const buttonClass =
  "rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary";
const actionButtonClass =
  "rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:opacity-90";

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

function parseImportedResumeDocument(value: string) {
  const parsed = JSON.parse(value) as ResumeDocument;
  if (!parsed || typeof parsed !== "object" || !("personalDetails" in parsed) || !("settings" in parsed)) {
    throw new Error("Invalid resume backup format.");
  }
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
  if (!trimmed) {
    return "";
  }
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function SectionTitle({ title, accentColor }: { title: string; accentColor: string }) {
  return (
    <div className="border-b pb-2 text-[0.72rem] font-bold uppercase tracking-[0.24em]" style={{ color: accentColor, borderColor: `${accentColor}33` }}>
      {title}
    </div>
  );
}

function ResumePreview({ resume }: { resume: ResumeDocument }) {
  const { personalDetails, settings } = resume;
  const accentColor = settings.accentColor;
  const sheetStyle = {
    fontSize: `${settings.fontScale}%`,
  } as CSSProperties;
  const contactItems = [
    personalDetails.email,
    personalDetails.phone,
    personalDetails.location,
    personalDetails.website,
    personalDetails.linkedIn,
  ].filter(Boolean);
  const experiences = resume.workExperience.filter((item) => item.company || item.role || item.bulletsText);
  const education = resume.education.filter((item) => item.institution || item.qualification || item.notesText);
  const languages = resume.languages.filter((item) => item.name || item.level);
  const projects = resume.projects.filter((item) => item.name || item.summary);
  const certifications = resume.certifications.filter((item) => item.name || item.issuer);
  const customSections = resume.customSections.filter((item) => item.title || item.itemsText);

  const sidebar = settings.template === "split";
  const compact = settings.template === "compact";

  return (
    <div className={`mx-auto w-full max-w-[210mm] min-h-[297mm] bg-white text-slate-900 shadow-[0_20px_60px_rgba(15,23,42,0.14)] print:max-w-none print:min-h-0 print:shadow-none ${sidebar ? "grid md:grid-cols-[15rem_minmax(0,1fr)]" : "block"} ${compact ? "p-7" : ""}`} style={sheetStyle}>
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
                  <h1 className={`${compact ? "text-4xl" : "text-4xl"} font-semibold leading-none`}>{personalDetails.fullName || "Your name"}</h1>
                  <p className="mt-2 text-base font-medium uppercase tracking-[0.22em]" style={{ color: accentColor }}>{personalDetails.role || "Professional title"}</p>
                </div>
                <div className={`text-sm text-slate-600 ${compact ? "grid gap-1 text-right sm:text-left md:text-right" : "flex flex-wrap gap-x-5 gap-y-1"}`}>
                  {contactItems.map((item) => <span key={item}>{item}</span>)}
                </div>
              </div>
            </div>
          </header>
        ) : null}

        {settings.showSummary && resume.summary ? (
          <section className={compact ? "space-y-2" : "space-y-3"}>
            {!compact ? <SectionTitle title="Professional Summary" accentColor={accentColor} /> : null}
            <p className="text-sm leading-6 text-slate-700">{resume.summary}</p>
          </section>
        ) : null}

        <section className="space-y-3">
          <SectionTitle title="Work Experience" accentColor={accentColor} />
          <div className="space-y-4">
            {experiences.map((item) => (
              <article key={item.id} className="space-y-2">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-900">{item.role || "Role"}</h3>
                    <p className="text-sm text-slate-600">{[item.company, item.location].filter(Boolean).join(" | ")}</p>
                  </div>
                  <p className="text-xs font-medium text-slate-500">{formatResumeRange(item.startDate, item.endDate, item.isCurrent)}</p>
                </div>
                <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
                  {splitLines(item.bulletsText).map((line) => <li key={line}>{line}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <SectionTitle title="Education" accentColor={accentColor} />
          <div className={`gap-5 ${compact ? "grid md:grid-cols-2" : "space-y-3"}`}>
            {education.map((item) => (
              <article key={item.id} className="space-y-1.5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-900">{item.qualification || "Qualification"}</h3>
                    <p className="text-sm text-slate-600">{[item.institution, item.location].filter(Boolean).join(" | ")}</p>
                  </div>
                  <p className="text-xs font-medium text-slate-500">{formatResumeRange(item.startDate, item.endDate)}</p>
                </div>
                {item.notesText ? <p className="text-sm leading-6 text-slate-700">{item.notesText}</p> : null}
              </article>
            ))}
          </div>
        </section>
        <div className={`gap-5 ${compact ? "grid md:grid-cols-2" : "grid md:grid-cols-2"}`}>
          {settings.showSkills && !sidebar && resume.skills.length ? (
            <section className="space-y-3">
              <SectionTitle title="Skills" accentColor={accentColor} />
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((skill) => (
                  <span key={skill} className="rounded-full px-2.5 py-1 text-xs font-medium" style={{ backgroundColor: `${accentColor}14`, color: accentColor }}>{skill}</span>
                ))}
              </div>
            </section>
          ) : null}
          {settings.showLanguages && !sidebar && languages.length ? (
            <section className="space-y-3">
              <SectionTitle title="Languages" accentColor={accentColor} />
              <div className="space-y-1.5 text-sm text-slate-700">
                {languages.map((item) => <p key={item.id}><span className="font-semibold">{item.name || "Language"}</span>{item.level ? ` | ${item.level}` : ""}</p>)}
              </div>
            </section>
          ) : null}
          {settings.showProjects && projects.length ? (
            <section className="space-y-3">
              <SectionTitle title="Projects" accentColor={accentColor} />
              <div className="space-y-3">
                {projects.map((item) => (
                  <article key={item.id} className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-900">{item.name || "Project"}</h3>
                      {item.link ? <a href={normalizeLink(item.link)} className="text-xs font-medium" style={{ color: accentColor }}>{item.link}</a> : null}
                    </div>
                    <p className="text-sm leading-6 text-slate-700">{item.summary}</p>
                  </article>
                ))}
              </div>
            </section>
          ) : null}
          {settings.showCertifications && !sidebar && certifications.length ? (
            <section className="space-y-3">
              <SectionTitle title="Certifications" accentColor={accentColor} />
              <div className="space-y-1.5 text-sm text-slate-700">
                {certifications.map((item) => <p key={item.id}><span className="font-semibold">{item.name || "Certification"}</span>{item.issuer || item.year ? ` | ${[item.issuer, item.year].filter(Boolean).join(" | ")}` : ""}</p>)}
              </div>
            </section>
          ) : null}
        </div>

        {settings.showCustomSections && customSections.map((item) => (
          <section key={item.id} className="space-y-3">
            <SectionTitle title={item.title || "Custom Section"} accentColor={accentColor} />
            <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
              {splitLines(item.itemsText).map((line) => <li key={line}>{line}</li>)}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <input type={type} value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)} className={fieldClass} />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <textarea rows={rows} value={value} onChange={(event) => onChange(event.target.value)} className={`${fieldClass} resize-y`} />
    </label>
  );
}

function EntryActions({
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {onMoveUp ? <button type="button" onClick={onMoveUp} className={buttonClass}>Up</button> : null}
      {onMoveDown ? <button type="button" onClick={onMoveDown} className={buttonClass}>Down</button> : null}
      <button type="button" onClick={onRemove} className={buttonClass}>Remove</button>
    </div>
  );
}

export default function FreeCvResumeBuilder() {
  const [resume, setResume] = useState<ResumeDocument>(createSampleResumeDocument());
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("Autosave is active in this browser.");
  const importInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(CV_RESUME_BUILDER_STORAGE_KEY);
      if (stored) {
        setResume(parseImportedResumeDocument(stored));
        setNotice("Loaded your saved draft from this browser.");
      }
    } catch {
      setNotice("Local autosave is unavailable in this browser session.");
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }
    try {
      window.localStorage.setItem(CV_RESUME_BUILDER_STORAGE_KEY, JSON.stringify(resume));
    } catch {
      setNotice("Unable to update local autosave right now.");
    }
  }, [ready, resume]);

  const skillsText = useMemo(() => resume.skills.join("\n"), [resume.skills]);

  function updateResume(updater: (current: ResumeDocument) => ResumeDocument) {
    setResume((current) => ({ ...updater(current), updatedAt: new Date().toISOString() }));
  }

  function updatePersonal<K extends keyof ResumeDocument["personalDetails"]>(field: K, value: ResumeDocument["personalDetails"][K]) {
    updateResume((current) => ({ ...current, personalDetails: { ...current.personalDetails, [field]: value } }));
  }

  function updateSettings<K extends keyof ResumeBuilderSettings>(field: K, value: ResumeBuilderSettings[K]) {
    updateResume((current) => ({ ...current, settings: { ...current.settings, [field]: value } }));
  }

  function updateCollectionItem<T extends EntryWithId, K extends keyof T>(key: CollectionKey, id: string, field: K, value: T[K]) {
    updateResume((current) => ({
      ...current,
      [key]: (current[key] as T[]).map((item) => item.id === id ? { ...item, [field]: value } : item),
    }) as ResumeDocument);
  }

  function addCollectionItem(key: CollectionKey) {
    const factoryMap = {
      workExperience: createEmptyExperience,
      education: createEmptyEducation,
      languages: createEmptyLanguage,
      projects: createEmptyProject,
      certifications: createEmptyCertification,
      customSections: createEmptyCustomSection,
    } as const;
    updateResume((current) => ({ ...current, [key]: [...current[key], factoryMap[key]()] }) as ResumeDocument);
  }

  function removeCollectionItem(key: CollectionKey, id: string) {
    updateResume((current) => {
      const items = current[key].filter((item) => item.id !== id);
      const fallback = key === "workExperience" ? [createEmptyExperience()] : key === "education" ? [createEmptyEducation()] : key === "languages" ? [createEmptyLanguage()] : key === "projects" ? [createEmptyProject()] : key === "certifications" ? [createEmptyCertification()] : [];
      return { ...current, [key]: items.length ? items : fallback } as ResumeDocument;
    });
  }

  function moveCollectionItem(key: CollectionKey, id: string, direction: -1 | 1) {
    updateResume((current) => {
      const items = [...current[key]];
      const index = items.findIndex((item) => item.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= items.length) {
        return current;
      }
      const [moved] = items.splice(index, 1);
      items.splice(target, 0, moved);
      return { ...current, [key]: items } as ResumeDocument;
    });
  }

  function handlePhotoUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updatePersonal("photoDataUrl", reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  function handleExportJson() {
    downloadFile("cv-resume-builder-backup.json", JSON.stringify(resume, null, 2), "application/json");
  }

  function handleImportJson(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        if (typeof reader.result !== "string") {
          throw new Error("Invalid file contents.");
        }
        setResume(parseImportedResumeDocument(reader.result));
        setNotice("Imported resume backup successfully.");
      } catch {
        setNotice("That file could not be imported.");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  return (
    <div className="space-y-6">
      <section className={`${panelClass} p-4 sm:p-6 print:hidden`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-foreground">Free browser-based resume builder</p>
            <p className="mt-1 text-sm text-muted-foreground">{
              `${notice} Last update: ${new Date(resume.updatedAt).toLocaleString()}`
            }</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => { setResume(createSampleResumeDocument()); setNotice("Loaded sample resume content."); }} className={buttonClass}>Load sample</button>
            <button type="button" onClick={() => { setResume(createEmptyResumeDocument()); setNotice("Started a blank resume."); }} className={buttonClass}>Start blank</button>
            <button type="button" onClick={handleExportJson} className={buttonClass}>Export JSON</button>
            <button type="button" onClick={() => importInputRef.current?.click()} className={buttonClass}>Import JSON</button>
            <button type="button" onClick={() => window.print()} className={actionButtonClass}>Print / Save PDF</button>
            <input ref={importInputRef} type="file" accept=".json,application/json" onChange={handleImportJson} className="hidden" />
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] print:block">
        <div className="space-y-6 print:hidden">
          <section className={`${panelClass} p-4 sm:p-6`}>
            <h2 className="text-lg font-semibold text-foreground">Template and style</h2>
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <div className="space-y-3">
                {CV_RESUME_TEMPLATE_OPTIONS.map((option) => (
                  <button key={option.value} type="button" onClick={() => updateSettings("template", option.value)} className={`w-full rounded-[1.25rem] border p-4 text-left transition ${resume.settings.template === option.value ? "border-primary bg-primary-soft" : "border-border bg-background hover:border-primary/40"}`}>
                    <p className="font-semibold text-foreground">{option.label}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{option.description}</p>
                  </button>
                ))}
              </div>
              <div className="space-y-5">
                <div className="space-y-3">
                  <span className="text-sm font-medium text-muted-foreground">Accent color</span>
                  <div className="flex flex-wrap gap-3">
                    {CV_RESUME_ACCENT_COLORS.map((color) => (
                      <button key={color} type="button" onClick={() => updateSettings("accentColor", color)} className={`h-10 w-10 rounded-full border-2 ${resume.settings.accentColor === color ? "border-foreground" : "border-border"}`} style={{ backgroundColor: color }} aria-label={`Use accent color ${color}`} />
                    ))}
                  </div>
                </div>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">Font scale ({resume.settings.fontScale}%)</span>
                  <input type="range" min={90} max={110} step={1} value={resume.settings.fontScale} onChange={(event) => updateSettings("fontScale", Number(event.target.value))} className="w-full" />
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {([
                    ["showPhoto", "Show photo"],
                    ["showSummary", "Show summary"],
                    ["showSkills", "Show skills"],
                    ["showLanguages", "Show languages"],
                    ["showProjects", "Show projects"],
                    ["showCertifications", "Show certifications"],
                    ["showCustomSections", "Show custom sections"],
                  ] as Array<[keyof ResumeBuilderSettings, string]>).map(([field, label]) => (
                    <label key={field} className="flex items-center gap-3 rounded-[1rem] border border-border px-4 py-3 text-sm text-foreground">
                      <input type="checkbox" checked={Boolean(resume.settings[field])} onChange={(event) => updateSettings(field, event.target.checked as never)} />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className={`${panelClass} p-4 sm:p-6`}>
            <h2 className="text-lg font-semibold text-foreground">Personal details</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <InputField label="Full name" value={resume.personalDetails.fullName} onChange={(value) => updatePersonal("fullName", value)} />
              <InputField label="Professional title" value={resume.personalDetails.role} onChange={(value) => updatePersonal("role", value)} />
              <InputField label="Email" value={resume.personalDetails.email} onChange={(value) => updatePersonal("email", value)} />
              <InputField label="Phone" value={resume.personalDetails.phone} onChange={(value) => updatePersonal("phone", value)} />
              <InputField label="Location" value={resume.personalDetails.location} onChange={(value) => updatePersonal("location", value)} />
              <InputField label="Website" value={resume.personalDetails.website} onChange={(value) => updatePersonal("website", value)} />
              <InputField label="LinkedIn" value={resume.personalDetails.linkedIn} onChange={(value) => updatePersonal("linkedIn", value)} />
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-muted-foreground">Profile photo</span>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className={fieldClass} />
              </label>
            </div>
          </section>

          <section className={`${panelClass} p-4 sm:p-6`}>
            <h2 className="text-lg font-semibold text-foreground">Professional summary</h2>
            <div className="mt-5"><TextAreaField label="Summary" value={resume.summary} onChange={(value) => updateResume((current) => ({ ...current, summary: value }))} rows={5} /></div>
          </section>

          <section className={`${panelClass} p-4 sm:p-6`}>
            <div className="flex items-center justify-between gap-3"><h2 className="text-lg font-semibold text-foreground">Work experience</h2><button type="button" onClick={() => addCollectionItem("workExperience")} className={buttonClass}>Add job</button></div>
            <div className="mt-5 space-y-4">
              {resume.workExperience.map((item) => (
                <div key={item.id} className="rounded-[1.25rem] border border-border/70 p-4">
                  <div className="mb-4 flex items-center justify-between gap-3"><p className="text-sm font-semibold text-foreground">Experience entry</p><EntryActions onRemove={() => removeCollectionItem("workExperience", item.id)} onMoveUp={() => moveCollectionItem("workExperience", item.id, -1)} onMoveDown={() => moveCollectionItem("workExperience", item.id, 1)} /></div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <InputField label="Job title" value={item.role} onChange={(value) => updateCollectionItem<ResumeExperience, "role">("workExperience", item.id, "role", value)} />
                    <InputField label="Company" value={item.company} onChange={(value) => updateCollectionItem<ResumeExperience, "company">("workExperience", item.id, "company", value)} />
                    <InputField label="Location" value={item.location} onChange={(value) => updateCollectionItem<ResumeExperience, "location">("workExperience", item.id, "location", value)} />
                    <label className="flex items-center gap-3 rounded-[1rem] border border-border px-4 py-3 text-sm text-foreground"><input type="checkbox" checked={item.isCurrent} onChange={(event) => updateCollectionItem<ResumeExperience, "isCurrent">("workExperience", item.id, "isCurrent", event.target.checked)} /><span>Current role</span></label>
                    <InputField label="Start date" value={item.startDate} onChange={(value) => updateCollectionItem<ResumeExperience, "startDate">("workExperience", item.id, "startDate", value)} type="month" />
                    <InputField label="End date" value={item.endDate} onChange={(value) => updateCollectionItem<ResumeExperience, "endDate">("workExperience", item.id, "endDate", value)} type="month" disabled={item.isCurrent} />
                    <div className="md:col-span-2"><TextAreaField label="Achievements and responsibilities (one bullet per line)" value={item.bulletsText} onChange={(value) => updateCollectionItem<ResumeExperience, "bulletsText">("workExperience", item.id, "bulletsText", value)} rows={5} /></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={`${panelClass} p-4 sm:p-6`}>
            <div className="flex items-center justify-between gap-3"><h2 className="text-lg font-semibold text-foreground">Education</h2><button type="button" onClick={() => addCollectionItem("education")} className={buttonClass}>Add education</button></div>
            <div className="mt-5 space-y-4">
              {resume.education.map((item) => (
                <div key={item.id} className="rounded-[1.25rem] border border-border/70 p-4">
                  <div className="mb-4 flex items-center justify-between gap-3"><p className="text-sm font-semibold text-foreground">Education entry</p><EntryActions onRemove={() => removeCollectionItem("education", item.id)} onMoveUp={() => moveCollectionItem("education", item.id, -1)} onMoveDown={() => moveCollectionItem("education", item.id, 1)} /></div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <InputField label="Qualification" value={item.qualification} onChange={(value) => updateCollectionItem<ResumeEducation, "qualification">("education", item.id, "qualification", value)} />
                    <InputField label="Institution" value={item.institution} onChange={(value) => updateCollectionItem<ResumeEducation, "institution">("education", item.id, "institution", value)} />
                    <InputField label="Location" value={item.location} onChange={(value) => updateCollectionItem<ResumeEducation, "location">("education", item.id, "location", value)} />
                    <InputField label="Start date" value={item.startDate} onChange={(value) => updateCollectionItem<ResumeEducation, "startDate">("education", item.id, "startDate", value)} type="month" />
                    <InputField label="End date" value={item.endDate} onChange={(value) => updateCollectionItem<ResumeEducation, "endDate">("education", item.id, "endDate", value)} type="month" />
                    <div className="md:col-span-2"><TextAreaField label="Notes" value={item.notesText} onChange={(value) => updateCollectionItem<ResumeEducation, "notesText">("education", item.id, "notesText", value)} /></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={`${panelClass} p-4 sm:p-6`}>
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
              <TextAreaField label="Skills (one skill per line or comma-separated)" value={skillsText} onChange={(value) => updateResume((current) => ({ ...current, skills: splitSkills(value) }))} rows={10} />
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3"><p className="text-sm font-medium text-muted-foreground">Languages</p><button type="button" onClick={() => addCollectionItem("languages")} className={buttonClass}>Add language</button></div>
                {resume.languages.map((item) => (
                  <div key={item.id} className="rounded-[1.25rem] border border-border/70 p-4">
                    <div className="mb-4 flex items-center justify-end"><button type="button" onClick={() => removeCollectionItem("languages", item.id)} className={buttonClass}>Remove</button></div>
                    <div className="grid gap-4">
                      <InputField label="Language" value={item.name} onChange={(value) => updateCollectionItem<ResumeLanguage, "name">("languages", item.id, "name", value)} />
                      <InputField label="Level" value={item.level} onChange={(value) => updateCollectionItem<ResumeLanguage, "level">("languages", item.id, "level", value)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className={`${panelClass} p-4 sm:p-6`}>
            <div className="grid gap-6 xl:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3"><h2 className="text-lg font-semibold text-foreground">Projects</h2><button type="button" onClick={() => addCollectionItem("projects")} className={buttonClass}>Add project</button></div>
                {resume.projects.map((item) => (
                  <div key={item.id} className="rounded-[1.25rem] border border-border/70 p-4">
                    <div className="mb-4 flex items-center justify-end"><button type="button" onClick={() => removeCollectionItem("projects", item.id)} className={buttonClass}>Remove</button></div>
                    <div className="grid gap-4">
                      <InputField label="Project name" value={item.name} onChange={(value) => updateCollectionItem<ResumeProject, "name">("projects", item.id, "name", value)} />
                      <InputField label="Link" value={item.link} onChange={(value) => updateCollectionItem<ResumeProject, "link">("projects", item.id, "link", value)} />
                      <TextAreaField label="Summary" value={item.summary} onChange={(value) => updateCollectionItem<ResumeProject, "summary">("projects", item.id, "summary", value)} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3"><h2 className="text-lg font-semibold text-foreground">Certifications</h2><button type="button" onClick={() => addCollectionItem("certifications")} className={buttonClass}>Add certification</button></div>
                {resume.certifications.map((item) => (
                  <div key={item.id} className="rounded-[1.25rem] border border-border/70 p-4">
                    <div className="mb-4 flex items-center justify-end"><button type="button" onClick={() => removeCollectionItem("certifications", item.id)} className={buttonClass}>Remove</button></div>
                    <div className="grid gap-4">
                      <InputField label="Certification" value={item.name} onChange={(value) => updateCollectionItem<ResumeCertification, "name">("certifications", item.id, "name", value)} />
                      <InputField label="Issuer" value={item.issuer} onChange={(value) => updateCollectionItem<ResumeCertification, "issuer">("certifications", item.id, "issuer", value)} />
                      <InputField label="Year" value={item.year} onChange={(value) => updateCollectionItem<ResumeCertification, "year">("certifications", item.id, "year", value)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className={`${panelClass} p-4 sm:p-6`}>
            <div className="flex items-center justify-between gap-3"><h2 className="text-lg font-semibold text-foreground">Custom sections</h2><button type="button" onClick={() => addCollectionItem("customSections")} className={buttonClass}>Add section</button></div>
            <div className="mt-5 space-y-4">
              {resume.customSections.length === 0 ? <p className="text-sm text-muted-foreground">Add awards, volunteer work, publications, or any section your resume needs.</p> : null}
              {resume.customSections.map((item) => (
                <div key={item.id} className="rounded-[1.25rem] border border-border/70 p-4">
                  <div className="mb-4 flex items-center justify-end"><button type="button" onClick={() => removeCollectionItem("customSections", item.id)} className={buttonClass}>Remove</button></div>
                  <div className="grid gap-4">
                    <InputField label="Section title" value={item.title} onChange={(value) => updateCollectionItem<ResumeCustomSection, "title">("customSections", item.id, "title", value)} />
                    <TextAreaField label="Items (one bullet per line)" value={item.itemsText} onChange={(value) => updateCollectionItem<ResumeCustomSection, "itemsText">("customSections", item.id, "itemsText", value)} rows={5} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="print:block">
          <div className="print:contents xl:sticky xl:top-24">
            <div className="mb-3 print:hidden">
              <h2 className="text-lg font-semibold text-foreground">Live preview</h2>
              <p className="text-sm text-muted-foreground">This preview is the printable output for browser PDF export.</p>
            </div>
            <ResumePreview resume={resume} />
          </div>
        </div>
      </div>
    </div>
  );
}
