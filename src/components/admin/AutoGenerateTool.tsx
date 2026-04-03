'use client';

import { useState, useTransition } from 'react';
import { AlertTriangle, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

import {
  previewGeneratedToolEditorial,
  previewGeneratedToolFacts,
  saveGeneratedToolDraft,
} from '@/app/admin/actions';
import type { Tool, ToolCategory } from '@/types/database';

type Step = 'input' | 'facts' | 'preview';

function formatPercent(value: number | undefined) {
  return `${Math.round((value || 0) * 100)}%`;
}

function toCommaList(values: string[] | undefined) {
  return (values || []).join(', ');
}

function toTitle(label: Step) {
  if (label === 'input') return '1. Input';
  if (label === 'facts') return '2. Validate facts';
  return '3. Preview and save';
}

export default function AutoGenerateTool({ categories }: { categories: ToolCategory[] }) {
  const [toolName, setToolName] = useState('');
  const [website, setWebsite] = useState('');
  const [draft, setDraft] = useState<Partial<Tool> | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [confidence, setConfidence] = useState<number>(0);
  const [step, setStep] = useState<Step>('input');
  const [error, setError] = useState('');
  const [pendingAction, setPendingAction] = useState<'facts' | 'editorial' | 'save' | null>(null);
  const [isPending, startTransition] = useTransition();

  function updateField<K extends keyof Tool>(field: K, value: Tool[K]) {
    setDraft((current) => ({
      ...(current || {}),
      [field]: value,
    }));
  }

  function updateArrayField(field: keyof Tool, value: string) {
    updateField(
      field as keyof Tool,
      value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean) as Tool[keyof Tool],
    );
  }

  function runAction(action: 'facts' | 'editorial' | 'save', callback: () => Promise<void>) {
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

  function handleGenerateFacts() {
    if (!toolName.trim()) {
      setError('Enter a tool name first.');
      return;
    }

    runAction('facts', async () => {
      const preview = await previewGeneratedToolFacts({
        toolName,
        website,
        categories: categories.map((category) => category.name),
      });

      setDraft(preview.draft);
      setWarnings(preview.warnings);
      setConfidence(preview.confidence);
      setStep('facts');
    });
  }

  function handleGenerateEditorial() {
    if (!draft) {
      return;
    }

    runAction('editorial', async () => {
      const preview = await previewGeneratedToolEditorial(draft);
      setDraft(preview.draft);
      setWarnings(preview.warnings);
      setConfidence(preview.confidence);
      setStep('preview');
    });
  }

  function handleSaveDraft() {
    if (!draft) {
      return;
    }

    runAction('save', async () => {
      await saveGeneratedToolDraft(draft);
    });
  }

  const busy = isPending && pendingAction !== null;

  return (
    <section className="overflow-hidden rounded-[2rem] border border-border/70 bg-card/80 px-6 py-8 sm:px-8 md:px-10">
      <div className="grid gap-8 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Tool Workflow
          </div>
          <div className="space-y-3">
            <h2 className="section-heading text-4xl text-foreground md:text-5xl">
              Build draft-first tool records.
            </h2>
            <p className="max-w-xl text-base leading-7 text-muted-foreground">
              The generator now separates structured facts from editorial copy. Review the facts first, then generate the narrative layer, then save the record as a draft or review item.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {(['input', 'facts', 'preview'] as Step[]).map((item) => {
              const active = item === step;
              const complete =
                (item === 'input' && step !== 'input') ||
                (item === 'facts' && step === 'preview');

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
                      <Sparkles className="h-4 w-4 text-primary" />
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
            <label className="block text-sm font-medium text-muted-foreground">Tool name</label>
            <input
              type="text"
              value={toolName}
              onChange={(event) => setToolName(event.target.value)}
              placeholder="ChatGPT, Airtable, Midjourney"
              className="mt-2 w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground outline-none focus:border-primary/40"
            />

            <label className="mt-4 block text-sm font-medium text-muted-foreground">Official website</label>
            <input
              type="url"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
              placeholder="https://example.com"
              className="mt-2 w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground outline-none focus:border-primary/40"
            />

            <button
              type="button"
              onClick={handleGenerateFacts}
              disabled={busy || !toolName.trim()}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 disabled:opacity-60"
            >
              {pendingAction === 'facts' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {pendingAction === 'facts' ? 'Generating facts...' : 'Generate facts'}
            </button>
          </div>
        </div>

        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-[0.7fr_0.3fr]">
            <div className="rounded-[1.5rem] border border-border/70 bg-background/75 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Confidence</p>
              <div className="mt-3 flex items-end justify-between gap-4">
                <div>
                  <p className="text-3xl font-semibold text-foreground">{formatPercent(confidence)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Low-confidence drafts default to review.
                  </p>
                </div>
                <div className="h-3 w-full max-w-36 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.min(100, Math.round(confidence * 100))}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-border/70 bg-background/75 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Warnings</p>
              <p className="mt-3 text-3xl font-semibold text-foreground">{warnings.length}</p>
              <p className="mt-1 text-sm text-muted-foreground">Validation and quality flags.</p>
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
                    onChange={(event) => updateField('slug', event.target.value)}
                    className="mt-2 w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground outline-none focus:border-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Category</label>
                  <select
                    value={draft.category || ''}
                    onChange={(event) => updateField('category', event.target.value)}
                    className="mt-2 w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground outline-none focus:border-primary/40"
                  >
                    <option value="">Needs review</option>
                    {categories.map((category) => (
                      <option key={category.slug} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Pricing model</label>
                  <select
                    value={draft.pricingModel || 'freemium'}
                    onChange={(event) => updateField('pricingModel', event.target.value as Tool['pricingModel'])}
                    className="mt-2 w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground outline-none focus:border-primary/40"
                  >
                    <option value="free">Free</option>
                    <option value="freemium">Freemium</option>
                    <option value="paid">Paid</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Difficulty</label>
                  <select
                    value={draft.difficultyLevel || 'intermediate'}
                    onChange={(event) => updateField('difficultyLevel', event.target.value as Tool['difficultyLevel'])}
                    className="mt-2 w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground outline-none focus:border-primary/40"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-muted-foreground">Short description</label>
                <textarea
                  value={draft.shortDescription || ''}
                  onChange={(event) => {
                    updateField('shortDescription', event.target.value);
                    updateField('description', event.target.value);
                  }}
                  rows={3}
                  className="mt-2 w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground outline-none focus:border-primary/40"
                />
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Pricing snapshot</label>
                  <input
                    type="text"
                    value={draft.pricingRange || ''}
                    onChange={(event) => updateField('pricingRange', event.target.value)}
                    className="mt-2 w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground outline-none focus:border-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Setup time</label>
                  <input
                    type="text"
                    value={draft.setupTime || ''}
                    onChange={(event) => updateField('setupTime', event.target.value)}
                    className="mt-2 w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground outline-none focus:border-primary/40"
                  />
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Use cases</label>
                  <input
                    type="text"
                    value={toCommaList(draft.useCases)}
                    onChange={(event) => updateArrayField('useCases', event.target.value)}
                    className="mt-2 w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground outline-none focus:border-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Features</label>
                  <input
                    type="text"
                    value={toCommaList(draft.features)}
                    onChange={(event) => updateArrayField('features', event.target.value)}
                    className="mt-2 w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground outline-none focus:border-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Platforms</label>
                  <input
                    type="text"
                    value={toCommaList(draft.platforms)}
                    onChange={(event) => updateArrayField('platforms', event.target.value)}
                    className="mt-2 w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground outline-none focus:border-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Integrations</label>
                  <input
                    type="text"
                    value={toCommaList(draft.integrations)}
                    onChange={(event) => updateArrayField('integrations', event.target.value)}
                    className="mt-2 w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground outline-none focus:border-primary/40"
                  />
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleGenerateEditorial}
                  disabled={busy}
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
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Editorial summary</p>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {draft.editorialSummary || 'Editorial summary pending.'}
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-[1.4rem] border border-border/70 bg-card p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Pros</p>
                      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                        {(draft.pros || []).map((pro) => (
                          <li key={pro}>{pro}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-[1.4rem] border border-border/70 bg-card p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Cons</p>
                      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                        {(draft.cons || []).map((con) => (
                          <li key={con}>{con}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="rounded-[1.75rem] border border-dashed border-border bg-background/60 px-6 py-12 text-center text-sm text-muted-foreground">
              Generate tool facts to start the review flow.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
