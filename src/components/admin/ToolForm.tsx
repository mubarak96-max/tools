'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, ChevronLeft, Loader2, Save, Sparkles } from 'lucide-react';

import { createTool, generateFullToolProfile, updateTool } from '@/app/admin/actions';
import { getToolPublishBlockers } from '@/lib/generation/score';
import { getConfidenceTone } from '@/lib/ui';
import { cn } from '@/lib/utils';
import type { AIInsights, FAQItem, Tool, ToolCategory } from '@/types/database';

interface ToolFormProps {
  initialData?: Tool;
  categories: ToolCategory[];
  existingTools?: Array<Pick<Tool, 'slug' | 'name'>>;
  approvedCategories?: string[];
  isEdit?: boolean;
}

function emptyAiInsights(): AIInsights {
  return {
    whyThisToolFits: '',
    pros: [],
    cons: [],
    bestFor: '',
    antiRecommendation: '',
    comparisonSummary: '',
  };
}

function emptyFaqItem(): FAQItem {
  return {
    question: '',
    answer: '',
  };
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function toPricingModel(value: string | undefined): Tool['pricingModel'] {
  switch ((value || '').toLowerCase()) {
    case 'free':
      return 'free';
    case 'paid':
      return 'paid';
    case 'custom':
      return 'custom';
    default:
      return 'freemium';
  }
}

function toDifficultyLevel(value: string | undefined): Tool['difficultyLevel'] {
  switch ((value || '').toLowerCase()) {
    case 'beginner':
      return 'beginner';
    case 'advanced':
      return 'advanced';
    default:
      return 'intermediate';
  }
}

function toLegacyPricingLabel(value: Tool['pricingModel']): Tool['pricing'] {
  switch (value) {
    case 'free':
      return 'Free';
    case 'paid':
      return 'Paid';
    case 'custom':
      return 'Custom';
    default:
      return 'Freemium';
  }
}

function toLegacyDifficultyLabel(value: Tool['difficultyLevel']): Tool['difficulty'] {
  switch (value) {
    case 'beginner':
      return 'Beginner';
    case 'advanced':
      return 'Advanced';
    default:
      return 'Intermediate';
  }
}

function normalizeBillingPeriod(value: string | undefined) {
  switch ((value || '').trim().toLowerCase()) {
    case 'day':
    case 'daily':
      return 'daily';
    case 'week':
    case 'weekly':
      return 'weekly';
    case 'year':
    case 'yearly':
    case 'annual':
    case 'annually':
      return 'yearly';
    case 'month':
    case 'monthly':
    default:
      return 'monthly';
  }
}

function buildInitialData(
  initialData: Tool | undefined,
  categories: ToolCategory[],
): Partial<Tool> {
  if (initialData) {
    return {
      ...initialData,
      pricingModel: initialData.pricingModel ?? toPricingModel(initialData.pricing),
      difficultyLevel: initialData.difficultyLevel ?? toDifficultyLevel(initialData.difficulty),
      billingPeriod: normalizeBillingPeriod(initialData.billingPeriod),
      shortDescription: initialData.shortDescription || initialData.description || '',
      editorialSummary:
        initialData.editorialSummary || initialData.aiInsights?.whyThisToolFits || '',
      alternatives: initialData.alternatives || [],
      competitors: initialData.competitors || [],
      faq: initialData.faq || [],
      aiInsights: initialData.aiInsights ?? emptyAiInsights(),
    };
  }

  return {
    name: '',
    slug: '',
    category: categories[0]?.name || '',
    subcategories: [],
    pricingModel: 'freemium',
    startingPrice: undefined,
    startingPriceCurrency: 'USD',
    billingPeriod: 'monthly',
    hasFreePlan: true,
    hasFreeTrial: false,
    difficultyLevel: 'intermediate',
    setupTime: '',
    pricingRange: '',
    shortDescription: '',
    description: '',
    editorialSummary: '',
    status: 'draft',
    useCases: [],
    audiences: [],
    features: [],
    platforms: [],
    teamFit: [],
    integrations: [],
    alternatives: [],
    competitors: [],
    faq: [],
    website: '',
    aiInsights: emptyAiInsights(),
  };
}

function normalizeDraftForSubmit(draft: Partial<Tool>): Partial<Tool> {
  const pricingModel = draft.pricingModel ?? toPricingModel(draft.pricing);
  const difficultyLevel = draft.difficultyLevel ?? toDifficultyLevel(draft.difficulty);
  const aiInsights = draft.aiInsights ?? emptyAiInsights();
  const shortDescription = (draft.shortDescription || draft.description || '').trim();
  const editorialSummary = (draft.editorialSummary || aiInsights.whyThisToolFits || '').trim();
  const faq = (draft.faq || [])
    .map((item) => ({
      question: item.question.trim(),
      answer: item.answer.trim(),
    }))
    .filter((item) => item.question && item.answer);

  return {
    ...draft,
    pricingModel,
    pricing: toLegacyPricingLabel(pricingModel),
    difficultyLevel,
    difficulty: toLegacyDifficultyLabel(difficultyLevel),
    billingPeriod: normalizeBillingPeriod(draft.billingPeriod),
    shortDescription,
    description: shortDescription,
    editorialSummary,
    bestFor: (draft.bestFor || aiInsights.bestFor || '').trim(),
    notIdealFor: (draft.notIdealFor || aiInsights.antiRecommendation || '').trim(),
    pros: aiInsights.pros.filter(Boolean),
    cons: aiInsights.cons.filter(Boolean),
    alternatives: (draft.alternatives || []).filter(Boolean),
    competitors: (draft.competitors || []).filter(Boolean),
    faq,
    aiInsights: {
      ...aiInsights,
      whyThisToolFits: aiInsights.whyThisToolFits.trim(),
      comparisonSummary: aiInsights.comparisonSummary.trim(),
      bestFor: aiInsights.bestFor.trim(),
      antiRecommendation: aiInsights.antiRecommendation.trim(),
      pros: aiInsights.pros.filter(Boolean),
      cons: aiInsights.cons.filter(Boolean),
    },
  };
}

function getProgressBarTone(value: number) {
  if (value >= 80) {
    return 'bg-success';
  }

  if (value >= 60) {
    return 'bg-primary';
  }

  if (value >= 40) {
    return 'bg-warning';
  }

  return 'bg-destructive';
}

export default function ToolForm({
  initialData,
  categories,
  existingTools = [],
  approvedCategories = [],
  isEdit,
}: ToolFormProps) {
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<Tool>>(buildInitialData(initialData, categories));
  const [generatorName, setGeneratorName] = useState(initialData?.name ?? '');

  const comparisonOptions = useMemo(
    () => existingTools.filter((tool) => tool.slug !== initialData?.slug),
    [existingTools, initialData?.slug],
  );

  const normalizedDraft = useMemo(() => normalizeDraftForSubmit(formData), [formData]);
  const readiness = useMemo(
    () =>
      getToolPublishBlockers(
        { ...normalizedDraft, sourceConfidence: undefined },
        comparisonOptions,
        { approvedCategories },
      ),
    [approvedCategories, comparisonOptions, normalizedDraft],
  );

  const confidencePercent = Math.round(readiness.confidence * 100);
  const comparisonExamples = comparisonOptions.slice(0, 4).map((tool) => tool.slug).join(', ');
  const title = isEdit ? `Edit ${initialData?.name ?? 'tool'}` : 'Add new tool';
  const description = isEdit
    ? 'Update the structured record, editorial context, and publish readiness in one place.'
    : 'Fill in each section to build confidence, complete coverage, and create a review-ready tool entry.';
  const primarySubmitLabel = isEdit ? 'Save changes' : 'Create tool';
  const sectionLinks = [
    { id: 'basic-details', label: 'Basic details' },
    { id: 'pricing-fit', label: 'Pricing & fit' },
    { id: 'coverage', label: 'Coverage' },
    { id: 'editorial', label: 'Editorial' },
  ];
  const mobileSteps = [
    { id: 'basic-details', label: 'Basic', nextLabel: 'Next: Pricing' },
    { id: 'pricing-fit', label: 'Pricing', nextLabel: 'Next: Coverage' },
    { id: 'coverage', label: 'Coverage', nextLabel: 'Next: Editorial' },
    { id: 'editorial', label: 'Editorial', nextLabel: primarySubmitLabel },
  ];
  const checklistItems = [
    {
      label: normalizedDraft.name?.trim() ? 'Tool name added' : 'Tool name missing',
      tone: normalizedDraft.name?.trim() ? 'ok' : 'bad',
    },
    {
      label: normalizedDraft.shortDescription?.trim()
        ? 'Short description added'
        : 'Short description missing',
      tone: normalizedDraft.shortDescription?.trim() ? 'ok' : 'bad',
    },
    {
      label: normalizedDraft.website?.trim() ? 'Website added' : 'Website missing',
      tone: normalizedDraft.website?.trim() ? 'ok' : 'bad',
    },
    {
      label: normalizedDraft.pricingRange?.trim()
        ? 'Pricing snapshot added'
        : 'Pricing snapshot needed',
      tone: normalizedDraft.pricingRange?.trim() ? 'ok' : 'warn',
    },
    {
      label:
        (normalizedDraft.faq?.length ?? 0) >= 2
          ? 'FAQ coverage added'
          : 'FAQ needs 2+ items',
      tone: (normalizedDraft.faq?.length ?? 0) >= 2 ? 'ok' : 'warn',
    },
    {
      label: normalizedDraft.editorialSummary?.trim()
        ? 'Editorial summary added'
        : 'Editorial summary missing',
      tone: normalizedDraft.editorialSummary?.trim() ? 'ok' : 'bad',
    },
  ];

  const jumpToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
    document.getElementById(mobileSteps[step]?.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'name') {
      setGeneratorName(value);
    }
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Tool) => {
    const values = e.target.value.split(',').map((item) => item.trim()).filter(Boolean);
    setFormData((prev) => ({ ...prev, [field]: values }));
  };

  const handleAiInsightsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof AIInsights,
  ) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      aiInsights: {
        ...(prev.aiInsights ?? emptyAiInsights()),
        [field]: value,
      },
    }));
  };

  const updateAiInsightList = (field: 'pros' | 'cons', updater: (values: string[]) => string[]) => {
    setFormData((prev) => {
      const currentInsights = prev.aiInsights ?? emptyAiInsights();
      return {
        ...prev,
        aiInsights: {
          ...currentInsights,
          [field]: updater(currentInsights[field]),
        },
      };
    });
  };

  const updateFaqItem = (index: number, field: keyof FAQItem, value: string) => {
    setFormData((prev) => {
      const faq = [...(prev.faq || [])];
      faq[index] = { ...(faq[index] ?? emptyFaqItem()), [field]: value };
      return { ...prev, faq };
    });
  };

  const addFaqItem = () => {
    setFormData((prev) => ({ ...prev, faq: [...(prev.faq || []), emptyFaqItem()] }));
  };

  const removeFaqItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      faq: (prev.faq || []).filter((_, currentIndex) => currentIndex !== index),
    }));
  };

  const generateToolData = async (requestedName?: string) => {
    const nameToGenerate = (requestedName || generatorName || formData.name || '').trim();

    if (!nameToGenerate) {
      setError('Please enter a tool name first.');
      return;
    }

    setAiLoading(true);
    setError('');
    setFormData((prev) => ({ ...prev, name: nameToGenerate }));
    setGeneratorName(nameToGenerate);

    try {
      const profile = await generateFullToolProfile(nameToGenerate, {
        categories: categories.map((category) => category.name),
      });

      setFormData((prev) => ({
        ...prev,
        name: prev.name || nameToGenerate,
        slug: profile.slug || prev.slug,
        category: profile.category || prev.category,
        pricingModel: toPricingModel(profile.pricing_model),
        difficultyLevel: toDifficultyLevel(profile.difficulty_level),
        pricingRange: profile.price_range || prev.pricingRange,
        shortDescription: profile.description || prev.shortDescription,
        description: profile.description || prev.description,
        editorialSummary: profile.why_this_tool || prev.editorialSummary,
        useCases: profile.use_cases?.length ? profile.use_cases : prev.useCases,
        features: profile.features?.length ? profile.features : prev.features,
        platforms: profile.platforms?.length ? profile.platforms : prev.platforms,
        website: profile.website || prev.website,
        aiInsights: {
          whyThisToolFits: profile.why_this_tool,
          bestFor: profile.best_for,
          antiRecommendation: profile.anti_recommendation,
          comparisonSummary: profile.comparison_summary,
          pros: profile.pros || [],
          cons: profile.cons || [],
        },
      }));
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to auto-generate tool profile.'));
    } finally {
      setAiLoading(false);
    }
  };

  const handleGenerateAI = async () => {
    await generateToolData();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const shouldSaveDraft = submitter?.value === 'draft';
    const payload = shouldSaveDraft ? { ...normalizedDraft, status: 'draft' as const } : normalizedDraft;

    try {
      if (isEdit && initialData?.slug) {
        await updateTool(initialData.slug, payload);
      } else {
        await createTool(payload);
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'An error occurred while saving.'));
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-24 md:pb-10">
      <section className="glass-card rounded-[1.75rem] border border-border/80 p-0 md:p-6">
        <div className="md:hidden">
          <div className="border-b border-border/80 px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <Link href="/admin/tools" className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                <ChevronLeft className="h-4 w-4" />
                Tools
              </Link>
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  value="draft"
                  disabled={loading}
                  className="rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold text-slate-700 disabled:opacity-70"
                >
                  Save draft
                </button>
                <button
                  type="submit"
                  value="default"
                  disabled={loading}
                  className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-70"
                >
                  {primarySubmitLabel}
                </button>
              </div>
            </div>

            <h1 className="mt-3 text-base font-semibold text-foreground">{title}</h1>

            <div className="mt-3 rounded-xl bg-slate-50 px-3 py-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-muted-foreground">Confidence</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border/70">
                  <div
                    className={cn('h-full rounded-full', getProgressBarTone(confidencePercent))}
                    style={{ width: `${confidencePercent}%` }}
                  />
                </div>
                <span
                  className={cn(
                    'min-w-9 text-right text-xs font-semibold',
                    confidencePercent >= 80
                      ? 'text-success'
                      : confidencePercent >= 60
                        ? 'text-primary'
                        : confidencePercent >= 40
                          ? 'text-warning'
                          : 'text-destructive',
                  )}
                >
                  {confidencePercent}%
                </span>
              </div>
            </div>
          </div>

          <div className="flex overflow-x-auto border-b border-border/80 bg-white px-2">
            {mobileSteps.map((step, index) => (
              <button
                key={step.id}
                type="button"
                onClick={() => goToStep(index)}
                className={cn(
                  'flex min-w-[72px] flex-1 flex-col items-center gap-1 border-b-2 px-2 py-3 text-center',
                  currentStep === index ? 'border-primary' : 'border-transparent',
                )}
              >
                <span
                  className={cn(
                    'flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-semibold',
                    currentStep === index
                      ? 'border-primary bg-primary text-white'
                      : currentStep > index
                        ? 'border-success/20 bg-success-soft text-success-soft-foreground'
                        : 'border-border bg-white text-muted-foreground',
                  )}
                >
                  {index + 1}
                </span>
                <span
                  className={cn(
                    'text-[10px] font-medium',
                    currentStep === index
                      ? 'text-foreground'
                      : currentStep > index
                        ? 'text-success-soft-foreground'
                        : 'text-muted-foreground',
                  )}
                >
                  {step.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="hidden flex-col gap-5 md:flex xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Link
                href="/admin/tools"
                className="inline-flex items-center gap-1 rounded-full border border-border/80 bg-white px-3 py-1.5 font-medium text-slate-700 hover:border-primary/20 hover:text-primary"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Tools
              </Link>
              <span>/</span>
              <span className="font-medium text-foreground">{title}</span>
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-[2rem]">
                {title}
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">{description}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
            <span
              className={cn(
                'inline-flex items-center gap-3 rounded-full border px-4 py-2 text-sm font-semibold',
                getConfidenceTone(confidencePercent),
              )}
            >
              <span>Confidence</span>
              <div className="h-2 w-20 overflow-hidden rounded-full bg-white/70">
                <div
                  className={cn('h-full rounded-full', getProgressBarTone(confidencePercent))}
                  style={{ width: `${confidencePercent}%` }}
                />
              </div>
              <span>{confidencePercent}%</span>
            </span>
            <button
              type="submit"
              value="draft"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:border-primary/20 hover:text-primary disabled:opacity-70"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save draft
            </button>
            <button
              type="submit"
              value="default"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary-hover disabled:opacity-70"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {primarySubmitLabel}
            </button>
          </div>
        </div>

        <div className="mt-6 hidden gap-3 md:grid md:grid-cols-2 xl:grid-cols-4">
          {sectionLinks.map((section, index) => (
            <button
              key={section.id}
              type="button"
              onClick={() => jumpToSection(section.id)}
              className="flex items-center gap-3 rounded-2xl border border-border/80 bg-slate-50/80 px-4 py-4 text-left hover:border-primary/20 hover:bg-primary-soft/40"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-white text-sm font-semibold text-muted-foreground">
                {index + 1}
              </span>
              <span className="text-sm font-semibold text-foreground">{section.label}</span>
            </button>
          ))}
        </div>

        <div
          className={cn(
            'mt-6 hidden rounded-[1.5rem] border p-5 md:block',
            readiness.blockers.length > 0
              ? 'border-destructive/15 bg-danger-soft/70'
              : 'border-success/15 bg-success-soft/60',
          )}
        >
          <div className="flex items-center gap-2">
            {readiness.blockers.length === 0 ? (
              <CheckCircle2 className="h-5 w-5 text-success" />
            ) : (
              <AlertCircle className="h-5 w-5 text-warning" />
            )}
            <h2 className="text-lg font-semibold text-foreground">
              {readiness.blockers.length > 0
                ? `${readiness.blockers.length} publish blocker${readiness.blockers.length === 1 ? '' : 's'} to resolve`
                : 'No publish blockers from the current form values'}
            </h2>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {readiness.blockers.map((blocker) => (
              <span key={blocker} className="danger-chip rounded-full px-3 py-1.5 text-xs font-medium">
                {blocker}
              </span>
            ))}
            {readiness.warnings.map((warning) => (
              <span key={warning} className="warning-chip rounded-full px-3 py-1.5 text-xs font-medium">
                {warning}
              </span>
            ))}
            {readiness.blockers.length === 0 && readiness.warnings.length === 0 ? (
              <span className="success-chip rounded-full px-3 py-1.5 text-xs font-medium">
                Ready for review
              </span>
            ) : null}
          </div>
        </div>
      </section>

      {error ? (
        <div className="danger-chip flex items-start gap-3 rounded-2xl p-4">
          <AlertCircle className="mt-0.5 h-5 w-5" />
          <p className="text-sm">{error}</p>
        </div>
      ) : null}

      {!isEdit ? (
        <section className="glass-card rounded-[1.5rem] border border-border/80 p-4 md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-foreground">Start with generated tool data</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Enter the tool name, generate the initial draft, then review and complete the remaining fields manually.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void generateToolData()}
              disabled={aiLoading || !generatorName.trim()}
              className="hidden items-center gap-2 rounded-xl border border-primary/20 bg-primary-soft px-4 py-3 text-sm font-medium text-primary-soft-foreground hover:bg-primary-soft/80 disabled:opacity-50 md:inline-flex"
            >
              {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {aiLoading ? 'Generating...' : 'Generate tool data'}
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-3 md:flex-row">
            <input
              type="text"
              value={generatorName}
              onChange={(event) => {
                const value = event.target.value;
                setGeneratorName(value);
                setFormData((prev) => ({ ...prev, name: value }));
              }}
              placeholder="Enter a tool name, e.g. Notion, Figma, Linear"
              className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
            <button
              type="button"
              onClick={() => void generateToolData()}
              disabled={aiLoading || !generatorName.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-70 md:hidden"
            >
              {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {aiLoading ? 'Generating...' : 'Generate tool data'}
            </button>
          </div>
        </section>
      ) : null}

      <div className="space-y-3 md:hidden">
        <div
          className={cn(
            'rounded-[1.25rem] border p-4',
            readiness.blockers.length > 0
              ? 'border-destructive/15 bg-danger-soft/70'
              : 'border-success/15 bg-success-soft/60',
            currentStep === 0 ? 'block' : 'hidden',
          )}
        >
          <div className="flex items-center gap-2">
            {readiness.blockers.length === 0 ? (
              <CheckCircle2 className="h-4 w-4 text-success" />
            ) : (
              <AlertCircle className="h-4 w-4 text-warning" />
            )}
            <h2 className="text-sm font-semibold text-foreground">
              {readiness.blockers.length > 0
                ? `${readiness.blockers.length} blocker${readiness.blockers.length === 1 ? '' : 's'} preventing publish`
                : 'No blockers from the current draft'}
            </h2>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {readiness.blockers.map((blocker) => (
              <span key={blocker} className="danger-chip rounded-full px-2.5 py-1 text-[11px] font-medium">
                {blocker}
              </span>
            ))}
            {readiness.warnings.map((warning) => (
              <span key={warning} className="warning-chip rounded-full px-2.5 py-1 text-[11px] font-medium">
                {warning}
              </span>
            ))}
          </div>
        </div>

        <div className={cn('glass-card rounded-[1.25rem] border border-border/80 p-4', currentStep === 0 ? 'block' : 'hidden')}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Publish checklist
          </p>
          <div className="mt-3 space-y-2">
            {checklistItems.map((item) => (
              <div key={item.label} className="flex items-start gap-2 border-b border-border/70 pb-2 last:border-b-0 last:pb-0">
                <span
                  className={cn(
                    'mt-1 h-1.5 w-1.5 shrink-0 rounded-full',
                    item.tone === 'ok'
                      ? 'bg-success'
                      : item.tone === 'warn'
                        ? 'bg-warning'
                        : 'bg-destructive',
                  )}
                />
                <span
                  className={cn(
                    'text-xs leading-5',
                    item.tone === 'ok'
                      ? 'text-success-soft-foreground'
                      : item.tone === 'warn'
                        ? 'text-warning-soft-foreground'
                        : 'text-danger-soft-foreground',
                  )}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div id="basic-details" className={cn('glass-card scroll-mt-6 rounded-2xl border border-border/80 p-6 space-y-4', currentStep === 0 ? 'block' : 'hidden md:block')}>
          <h2 className="text-xl font-bold text-foreground">Basic Details</h2>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">Tool Name *</label>
            <input required type="text" name="name" value={formData.name || ''} onChange={handleChange} className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">Slug (URL)</label>
            <input type="text" name="slug" value={formData.slug || ''} onChange={handleChange} placeholder="auto-generated-if-empty" disabled={isEdit} className="w-full rounded-lg border border-border bg-muted px-4 py-2 text-muted-foreground outline-none disabled:opacity-70" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">Category *</label>
            <select required name="category" value={(formData.category as string) || ''} onChange={handleChange} className="w-full appearance-none rounded-lg border border-border bg-background px-4 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary">
              <option value="" disabled>Select a category</option>
              {categories.map((category) => (
                <option key={category.slug} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">Status</label>
            <select name="status" value={(formData.status as string) || 'draft'} onChange={handleChange} className="w-full appearance-none rounded-lg border border-border bg-background px-4 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary">
              <option value="draft">Draft</option>
              <option value="review">Review</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">Pricing Model</label>
              <select name="pricingModel" value={(formData.pricingModel as string) || 'freemium'} onChange={handleChange} className="w-full appearance-none rounded-lg border border-border bg-background px-4 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary">
                <option value="free">Free</option>
                <option value="freemium">Freemium</option>
                <option value="paid">Paid</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">Difficulty</label>
              <select name="difficultyLevel" value={(formData.difficultyLevel as string) || 'intermediate'} onChange={handleChange} className="w-full appearance-none rounded-lg border border-border bg-background px-4 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">Pricing Range *</label>
            <input type="text" name="pricingRange" value={formData.pricingRange || ''} onChange={handleChange} placeholder="$15/user/mo or Free plan, paid from $12/mo" className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary" />
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Publish checks use this field directly. Avoid generic values like &quot;Custom pricing&quot; or &quot;Contact sales&quot; when you can be more specific.
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">Short Description *</label>
            <textarea required name="shortDescription" value={formData.shortDescription || ''} onChange={handleChange} rows={3} placeholder="A concise, search-friendly summary of what the tool does." className="w-full resize-none rounded-lg border border-border bg-background px-4 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary" />
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              This clears the metadata-description blocker and is also used across directory cards and SEO pages.
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">Website / Affiliate Link *</label>
            <input type="url" name="website" value={formData.website || ''} onChange={handleChange} placeholder="https://example.com" className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">Logo URL</label>
            <input type="url" name="logoUrl" value={formData.logoUrl || ''} onChange={handleChange} placeholder="https://cdn.example.com/logo.png" className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>

        <div id="pricing-fit" className={cn('glass-card scroll-mt-6 rounded-2xl border border-border/80 p-6 space-y-4', currentStep === 1 ? 'block' : 'hidden md:block')}>
          <h2 className="text-xl font-bold text-foreground">Commercial &amp; Fit</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">Starting Price</label>
              <input type="number" min="0" step="0.01" name="startingPrice" value={formData.startingPrice ?? ''} onChange={handleChange} placeholder="15" className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">Currency</label>
              <input type="text" name="startingPriceCurrency" value={formData.startingPriceCurrency || ''} onChange={handleChange} placeholder="USD" className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">Billing Period</label>
              <select name="billingPeriod" value={formData.billingPeriod || 'monthly'} onChange={handleChange} className="w-full appearance-none rounded-lg border border-border bg-background px-4 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">Setup Time</label>
              <input type="text" name="setupTime" value={formData.setupTime || ''} onChange={handleChange} placeholder="1 day" className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground">
              <input type="checkbox" checked={Boolean(formData.hasFreePlan)} onChange={(event) => setFormData((prev) => ({ ...prev, hasFreePlan: event.target.checked }))} className="h-4 w-4 rounded border-border" />
              Has free plan
            </label>
            <label className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground">
              <input type="checkbox" checked={Boolean(formData.hasFreeTrial)} onChange={(event) => setFormData((prev) => ({ ...prev, hasFreeTrial: event.target.checked }))} className="h-4 w-4 rounded border-border" />
              Has free trial
            </label>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">Audiences (comma separated)</label>
            <input type="text" value={formData.audiences?.join(', ') || ''} onChange={(event) => handleArrayChange(event, 'audiences')} placeholder="Developers, Marketers, Product Teams" className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">Team Fit (comma separated)</label>
            <input type="text" value={formData.teamFit?.join(', ') || ''} onChange={(event) => handleArrayChange(event, 'teamFit')} placeholder="Startup Team, Product Team, Enterprise" className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">Subcategories (comma separated)</label>
            <input type="text" value={formData.subcategories?.join(', ') || ''} onChange={(event) => handleArrayChange(event, 'subcategories')} placeholder="Whiteboard, Roadmapping" className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>
      </div>

      <div id="coverage" className={cn('glass-card scroll-mt-6 rounded-2xl border border-border/80 p-6 space-y-4', currentStep === 2 ? 'block' : 'hidden md:block')}>
        <h2 className="text-xl font-bold text-foreground">Coverage &amp; Relationships</h2>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">Use Cases (comma separated)</label>
            <input type="text" value={formData.useCases?.join(', ') || ''} onChange={(event) => handleArrayChange(event, 'useCases')} placeholder="Note Taking, Project Management, Automation" className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">Features (comma separated)</label>
            <input type="text" value={formData.features?.join(', ') || ''} onChange={(event) => handleArrayChange(event, 'features')} placeholder="Databases, Real-time sync, Templates" className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">Platforms (comma separated)</label>
            <input type="text" value={formData.platforms?.join(', ') || ''} onChange={(event) => handleArrayChange(event, 'platforms')} placeholder="Web, iOS, Android" className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">Integrations (comma separated)</label>
            <input type="text" value={formData.integrations?.join(', ') || ''} onChange={(event) => handleArrayChange(event, 'integrations')} placeholder="Slack, GitHub, Zapier" className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <div className="rounded-2xl border border-primary/15 bg-primary-soft/45 p-4">
            <p className="text-sm font-semibold text-primary-soft-foreground">Internal comparison links</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Add related tool slugs here when you have them. They improve coverage, but they no longer block publishing.
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">Alternatives (tool slugs, comma separated)</label>
            <input type="text" value={formData.alternatives?.join(', ') || ''} onChange={(event) => handleArrayChange(event, 'alternatives')} placeholder={comparisonExamples || 'airtable, coda'} className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">Competitors (tool slugs, comma separated)</label>
            <input type="text" value={formData.competitors?.join(', ') || ''} onChange={(event) => handleArrayChange(event, 'competitors')} placeholder={comparisonExamples || 'notion, asana'} className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary" />
          </div>
      </div>

      <div id="editorial" className={cn('glass-card scroll-mt-6 rounded-2xl border border-border/80 p-6 relative overflow-hidden flex flex-col gap-6', currentStep === 3 ? 'block md:flex' : 'hidden md:flex')}>
        <div className="relative z-10 flex justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold text-foreground">
              <Sparkles className="h-5 w-5 text-primary" />
              Editorial Context
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Generate the draft or write it manually. This section directly affects confidence and publish readiness.
            </p>
          </div>
          <button type="button" onClick={handleGenerateAI} disabled={aiLoading || !formData.name} className="inline-flex items-center gap-2 rounded-lg border border-primary/20 bg-primary-soft px-4 py-2 font-medium text-primary-soft-foreground transition-all disabled:opacity-50">
            {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {aiLoading ? 'Generating...' : 'Auto-Generate Insights'}
          </button>
        </div>

        <div className="relative z-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-muted-foreground">Editorial Summary *</label>
            <textarea name="editorialSummary" value={formData.editorialSummary || ''} onChange={handleChange} rows={3} placeholder="Summarize when this tool is a strong choice, who it suits, and why." className="w-full resize-none rounded-lg border border-border bg-background px-4 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">Why This Tool Fits</label>
            <textarea value={formData.aiInsights?.whyThisToolFits || ''} onChange={(event) => handleAiInsightsChange(event, 'whyThisToolFits')} rows={2} className="w-full resize-none rounded-lg border border-border bg-background px-4 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">Comparison Summary</label>
            <textarea value={formData.aiInsights?.comparisonSummary || ''} onChange={(event) => handleAiInsightsChange(event, 'comparisonSummary')} rows={2} className="w-full resize-none rounded-lg border border-border bg-background px-4 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">Best For</label>
            <input type="text" value={formData.aiInsights?.bestFor || ''} onChange={(event) => handleAiInsightsChange(event, 'bestFor')} className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">Anti-Recommendation</label>
            <input type="text" value={formData.aiInsights?.antiRecommendation || ''} onChange={(event) => handleAiInsightsChange(event, 'antiRecommendation')} className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div className="md:col-span-2 grid grid-cols-1 gap-4 border-t border-border/70 pt-4 md:grid-cols-2">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">Pros List</label>
                <button type="button" onClick={() => updateAiInsightList('pros', (current) => [...current, ''])} className="text-xs text-primary hover:text-primary/80">
                  + Add Pro
                </button>
              </div>
              <div className="space-y-2">
                {(formData.aiInsights?.pros || []).map((pro, index) => (
                  <div key={`pro-${index}`} className="flex gap-2">
                    <input type="text" value={pro} onChange={(event) => {
                      const nextPros = [...(formData.aiInsights?.pros || [])];
                      nextPros[index] = event.target.value;
                      updateAiInsightList('pros', () => nextPros);
                    }} className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary" />
                    <button type="button" onClick={() => updateAiInsightList('pros', (current) => current.filter((_, currentIndex) => currentIndex !== index))} className="px-2 text-muted-foreground hover:text-destructive">
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">Cons List</label>
                <button type="button" onClick={() => updateAiInsightList('cons', (current) => [...current, ''])} className="text-xs text-primary hover:text-primary/80">
                  + Add Con
                </button>
              </div>
              <div className="space-y-2">
                {(formData.aiInsights?.cons || []).map((con, index) => (
                  <div key={`con-${index}`} className="flex gap-2">
                    <input type="text" value={con} onChange={(event) => {
                      const nextCons = [...(formData.aiInsights?.cons || [])];
                      nextCons[index] = event.target.value;
                      updateAiInsightList('cons', () => nextCons);
                    }} className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary" />
                    <button type="button" onClick={() => updateAiInsightList('cons', (current) => current.filter((_, currentIndex) => currentIndex !== index))} className="px-2 text-muted-foreground hover:text-destructive">
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className={cn('glass-card rounded-2xl border border-border/80 p-6', currentStep === 3 ? 'block' : 'hidden md:block')}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">FAQ</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Add at least two FAQ entries to clear the publish blocker.
            </p>
          </div>
          <button type="button" onClick={addFaqItem} className="rounded-lg border border-primary/20 bg-primary-soft px-4 py-2 text-sm font-medium text-primary-soft-foreground">
            + Add FAQ
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {(formData.faq || []).map((item, index) => (
            <div key={`faq-${index}`} className="rounded-2xl border border-border/80 bg-background/70 p-4">
              <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
                <input type="text" value={item.question} onChange={(event) => updateFaqItem(index, 'question', event.target.value)} placeholder="Question" className="rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary" />
                <input type="text" value={item.answer} onChange={(event) => updateFaqItem(index, 'answer', event.target.value)} placeholder="Answer" className="rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary" />
                <button type="button" onClick={() => removeFaqItem(index)} className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-slate-700 hover:text-destructive">
                  Remove
                </button>
              </div>
            </div>
          ))}

          {(formData.faq || []).length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/80 bg-background/50 p-6 text-sm text-muted-foreground">
              No FAQ items yet.
            </div>
          ) : null}
        </div>
      </div>

      <div className="hidden justify-end gap-4 border-t border-border/70 pt-6 md:flex">
        <button type="button" onClick={() => window.history.back()} className="rounded-xl px-6 py-3 font-medium text-muted-foreground transition-colors hover:bg-card hover:text-foreground">
          Cancel
        </button>
        <button type="submit" value="default" disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 disabled:opacity-70">
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          {primarySubmitLabel}
        </button>
      </div>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-4 xl:self-start">
          <section className="glass-card rounded-[1.5rem] border border-border/80 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Confidence score
            </p>
            <div className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
              {confidencePercent}%
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className={cn('h-full rounded-full', getProgressBarTone(confidencePercent))}
                style={{ width: `${confidencePercent}%` }}
              />
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Complete the sections below to improve confidence and clear publish blockers.
            </p>
          </section>

          <section className="glass-card rounded-[1.5rem] border border-border/80 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Publish checklist
            </p>
            <div className="mt-4 space-y-3">
              {checklistItems.map((item) => (
                <div key={item.label} className="flex items-start gap-3 border-b border-border/70 pb-3 last:border-b-0 last:pb-0">
                  <span
                    className={cn(
                      'mt-1 h-2.5 w-2.5 shrink-0 rounded-full',
                      item.tone === 'ok'
                        ? 'bg-success'
                        : item.tone === 'warn'
                          ? 'bg-warning'
                          : 'bg-destructive',
                    )}
                  />
                  <span
                    className={cn(
                      'text-sm leading-6',
                      item.tone === 'ok'
                        ? 'text-success-soft-foreground'
                        : item.tone === 'warn'
                          ? 'text-warning-soft-foreground'
                          : 'text-danger-soft-foreground',
                    )}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-card rounded-[1.5rem] border border-border/80 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              AI assist
            </p>
            <button
              type="button"
              onClick={handleGenerateAI}
              disabled={aiLoading || !formData.name}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary-soft px-4 py-3 text-sm font-medium text-primary-soft-foreground hover:bg-primary-soft/80 disabled:opacity-50"
            >
              {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {aiLoading ? 'Generating...' : 'Auto-generate insights'}
            </button>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              Generates editorial summary, best-for, pros, cons, and comparison context using the current tool data.
            </p>
          </section>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border/80 bg-white/95 px-4 py-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-md items-center gap-2">
          {currentStep > 0 ? (
            <button
              type="button"
              onClick={() => goToStep(currentStep - 1)}
              className="flex-1 rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold text-slate-700"
            >
              Back
            </button>
          ) : null}

          {currentStep < mobileSteps.length - 1 ? (
            <button
              type="button"
              onClick={() => goToStep(currentStep + 1)}
              className="flex-[1.5] rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
            >
              {mobileSteps[currentStep].nextLabel}
            </button>
          ) : (
            <button
              type="submit"
              value="default"
              disabled={loading}
              className="flex-[1.5] rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-70"
            >
              {loading ? 'Saving...' : primarySubmitLabel}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
