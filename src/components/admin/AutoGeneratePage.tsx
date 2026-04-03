'use client';

import { useState, useTransition } from 'react';
import { AlertTriangle, CheckCircle2, LayoutTemplate, Loader2, Sparkles } from 'lucide-react';

import {
  previewGeneratedPageEditorial,
  previewGeneratedPageStructure,
  saveGeneratedPageDraft,
} from '@/app/admin/actions';
import type { CustomPage, Tool } from '@/types/database';

type Step = 'input' | 'structure' | 'preview';

function toTitle(step: Step) {
  if (step === 'input') return '1. Brief';
  if (step === 'structure') return '2. Candidate tools';
  return '3. Editorial preview';
}

export default function AutoGeneratePage({ tools }: { tools: Tool[] }) {
  const publishedTools = tools.filter((tool) => tool.status === 'published');
  const [topic, setTopic] = useState('');
  const [templateType, setTemplateType] = useState<CustomPage['templateType']>('curated-list');
  const [toolSearch, setToolSearch] = useState('');
  const [draft, setDraft] = useState<Partial<CustomPage> | null>(null);
  const [selectedToolSlugs, setSelectedToolSlugs] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [qualityScore, setQualityScore] = useState<number>(0);
  const [averageTopicOverlap, setAverageTopicOverlap] = useState<number>(0);
  const [step, setStep] = useState<Step>('input');
  const [error, setError] = useState('');
  const [pendingAction, setPendingAction] = useState<'structure' | 'editorial' | 'save' | null>(null);
  const [isPending, startTransition] = useTransition();

  const visibleTools = publishedTools.filter((tool) => {
    const query = toolSearch.trim().toLowerCase();
    if (!query) {
      return true;
    }

    return `${tool.name} ${tool.category} ${tool.useCases.join(' ')}`.toLowerCase().includes(query);
  });

  function runAction(
    action: 'structure' | 'editorial' | 'save',
    callback: () => Promise<void>,
  ) {
    setError('');
    setPendingAction(action);

    startTransition(() => {
      void (async () => {
        try {
          await callback();
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Something went wrong.');
        } finally {
          setPendingAction(null);
        }
      })();
    });
  }

  function handleGenerateStructure() {
    if (!topic.trim()) {
      setError('Enter a topic first.');
      return;
    }

    runAction('structure', async () => {
      const preview = await previewGeneratedPageStructure({
        topic,
        templateType,
      });

      setDraft(preview.draft);
      setSelectedToolSlugs(preview.draft.toolSlugs || []);
      setWarnings(preview.warnings);
      setQualityScore(preview.qualityScore);
      setAverageTopicOverlap(preview.averageTopicOverlap);
      setStep('structure');
    });
  }

  function handleGenerateEditorial() {
    if (!draft) {
      return;
    }

    runAction('editorial', async () => {
      const preview = await previewGeneratedPageEditorial({
        topic,
        templateType,
        draft: {
          ...draft,
          toolSlugs: selectedToolSlugs,
        },
        selectedToolSlugs,
      });

      setDraft(preview.draft);
      setWarnings(preview.warnings);
      setQualityScore(preview.qualityScore);
      setAverageTopicOverlap(preview.averageTopicOverlap);
      setStep('preview');
    });
  }

  function handleSaveDraft() {
    if (!draft) {
      return;
    }

    runAction('save', async () => {
      await saveGeneratedPageDraft({
        ...draft,
        toolSlugs: selectedToolSlugs,
      });
    });
  }

  function toggleTool(slug: string) {
    setSelectedToolSlugs((current) => {
      const exists = current.includes(slug);

      if (exists) {
        return current.filter((entry) => entry !== slug);
      }

      if (templateType === 'comparison' && current.length >= 2) {
        return [current[1], slug];
      }

      return [...current, slug];
    });
  }

  const busy = isPending && pendingAction !== null;

  return (
    <section className="overflow-hidden rounded-[2rem] border border-border/70 bg-card/80 px-6 py-8 sm:px-8 md:px-10">
      <div className="grid gap-8 xl:grid-cols-[0.88fr_1.12fr]">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Page Workflow
          </div>
          <div className="space-y-3">
            <h2 className="section-heading text-4xl text-foreground md:text-5xl">
              Generate editorial pages from structured inputs.
            </h2>
            <p className="max-w-xl text-base leading-7 text-muted-foreground">
              Candidate tools are chosen deterministically from the existing directory first. After that, the model only writes the intro, verdict, and FAQ blocks.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {(['input', 'structure', 'preview'] as Step[]).map((item) => {
              const active = item === step;
              const complete =
                (item === 'input' && step !== 'input') ||
                (item === 'structure' && step === 'preview');

              return (
                <div
                  key={item}
                  className={`rounded-[1.4rem] border px-4 py-3 text-sm ${
                    active
                      ? 'border-primary/30 bg-primary/10 text-foreground'
                      : complete
                        ? 'border-border/70 bg-background/80 text-foreground'
                        : 'border-border/70 bg-background/50 text-muted-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {complete ? (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    ) : (
                      <LayoutTemplate className="h-4 w-4 text-primary" />
                    )}
                    {toTitle(item)}
                  </div>
                </div>
              );
            })}
          </div>

          {error ? (
            <div className="rounded-[1.4rem] border border-destructive/20 bg-destructive/8 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          ) : null}

          <div className="rounded-[1.5rem] border border-border/70 bg-background/75 p-5">
            <label className="block text-sm font-medium text-muted-foreground">Topic or search intent</label>
            <input
              type="text"
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder="Best AI note takers, Figma vs Sketch, Alternatives to Airtable"
              className="mt-2 w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground outline-none focus:border-primary/40"
            />

            <label className="mt-4 block text-sm font-medium text-muted-foreground">Page type</label>
            <select
              value={templateType}
              onChange={(event) => setTemplateType(event.target.value as CustomPage['templateType'])}
              className="mt-2 w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground outline-none focus:border-primary/40"
            >
              <option value="curated-list">Curated list</option>
              <option value="comparison">Comparison</option>
              <option value="alternatives">Alternatives</option>
            </select>

            <button
              type="button"
              onClick={handleGenerateStructure}
              disabled={busy || !topic.trim()}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 disabled:opacity-60"
            >
              {pendingAction === 'structure' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {pendingAction === 'structure' ? 'Selecting tools...' : 'Build structure'}
            </button>
          </div>
        </div>

        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.5rem] border border-border/70 bg-background/75 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Quality</p>
              <p className="mt-3 text-3xl font-semibold text-foreground">{qualityScore}</p>
              <p className="mt-1 text-sm text-muted-foreground">Draft score out of 100.</p>
            </div>
            <div className="rounded-[1.5rem] border border-border/70 bg-background/75 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Overlap</p>
              <p className="mt-3 text-3xl font-semibold text-foreground">{averageTopicOverlap.toFixed(1)}</p>
              <p className="mt-1 text-sm text-muted-foreground">Average topic match.</p>
            </div>
            <div className="rounded-[1.5rem] border border-border/70 bg-background/75 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Warnings</p>
              <p className="mt-3 text-3xl font-semibold text-foreground">{warnings.length}</p>
              <p className="mt-1 text-sm text-muted-foreground">Review before publish.</p>
            </div>
          </div>

          {warnings.length > 0 ? (
            <div className="rounded-[1.5rem] border border-border/70 bg-background/75 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <AlertTriangle className="h-4 w-4 text-primary" />
                Review items
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {warnings.map((warning) => (
                  <span
                    key={warning}
                    className="inline-flex rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground"
                  >
                    {warning}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {draft ? (
            <div className="rounded-[1.75rem] border border-border/70 bg-background/75 p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Slug</label>
                  <input
                    type="text"
                    value={draft.slug || ''}
                    onChange={(event) => setDraft((current) => ({ ...(current || {}), slug: event.target.value }))}
                    className="mt-2 w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground outline-none focus:border-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Status</label>
                  <select
                    value={draft.status || 'review'}
                    onChange={(event) => setDraft((current) => ({ ...(current || {}), status: event.target.value as CustomPage['status'] }))}
                    className="mt-2 w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground outline-none focus:border-primary/40"
                  >
                    <option value="draft">Draft</option>
                    <option value="review">Review</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-muted-foreground">Title</label>
                <input
                  type="text"
                  value={draft.title || ''}
                  onChange={(event) => setDraft((current) => ({ ...(current || {}), title: event.target.value }))}
                  className="mt-2 w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground outline-none focus:border-primary/40"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-muted-foreground">Meta description</label>
                <textarea
                  value={draft.metaDescription || ''}
                  onChange={(event) => setDraft((current) => ({ ...(current || {}), metaDescription: event.target.value }))}
                  rows={3}
                  className="mt-2 w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground outline-none focus:border-primary/40"
                />
              </div>

              <div className="mt-6 rounded-[1.4rem] border border-border/70 bg-card p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Selected tools</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Adjust the candidate set before generating editorial.
                    </p>
                  </div>
                  <span className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
                    {selectedToolSlugs.length} selected
                  </span>
                </div>

                <input
                  type="text"
                  value={toolSearch}
                  onChange={(event) => setToolSearch(event.target.value)}
                  placeholder="Filter published tools"
                  className="mt-4 w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-primary/40"
                />

                <div className="mt-4 grid max-h-64 gap-2 overflow-y-auto pr-1">
                  {visibleTools.slice(0, 18).map((tool) => {
                    const checked = selectedToolSlugs.includes(tool.slug);

                    return (
                      <label
                        key={tool.slug}
                        className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${
                          checked
                            ? 'border-primary/30 bg-primary/10'
                            : 'border-border/70 bg-background'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleTool(tool.slug)}
                            className="h-4 w-4"
                          />
                          <div>
                            <div className="font-medium text-foreground">{tool.name}</div>
                            <div className="text-xs text-muted-foreground">{tool.category}</div>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">{tool.pricingRange || tool.pricing}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleGenerateEditorial}
                  disabled={busy || selectedToolSlugs.length === 0}
                  className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-5 py-3 text-sm font-semibold text-primary disabled:opacity-60"
                >
                  {pendingAction === 'editorial' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  {pendingAction === 'editorial' ? 'Generating editorial...' : 'Generate editorial'}
                </button>

                {step === 'preview' ? (
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    disabled={busy}
                    className="inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-3 text-sm font-semibold text-secondary-foreground disabled:opacity-60"
                  >
                    {pendingAction === 'save' ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                    {pendingAction === 'save' ? 'Saving...' : 'Save draft'}
                  </button>
                ) : null}
              </div>

              {step === 'preview' ? (
                <div className="mt-6 grid gap-4">
                  <div className="rounded-[1.4rem] border border-border/70 bg-card p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Intro</p>
                    <div
                      className="mt-3 text-sm leading-7 text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: draft.intro || '<p>Intro pending.</p>' }}
                    />
                  </div>
                  <div className="rounded-[1.4rem] border border-border/70 bg-card p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Editorial verdict</p>
                    <div
                      className="mt-3 text-sm leading-7 text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: draft.editorialVerdict || '<p>Verdict pending.</p>' }}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="rounded-[1.75rem] border border-dashed border-border bg-background/60 px-6 py-12 text-center text-sm text-muted-foreground">
              Build the structure first to review deterministic tool selection.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
