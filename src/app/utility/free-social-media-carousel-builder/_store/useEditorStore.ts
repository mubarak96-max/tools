
'use client';

import { create } from 'zustand';
import type { EditorState, Slide, FontId, LayoutId, ActiveSheet, CategoryId, IconOverlay, AIUsage } from '../_types';
import { TEMPLATES } from '../_data/templates';

const STORAGE_KEY = 'carousel-builder-v1';
const AI_LIMIT = 2;
const AI_WINDOW_MS = 60 * 60 * 1000; // 1 hour

// ─── Helper ───────────────────────────────────────────────────────────────────

function slideFromTemplate(templateId: string): Slide {
    const tmpl = TEMPLATES.find(t => t.id === templateId)!;
    return {
        id: crypto.randomUUID(),
        templateId,
        headline: tmpl.defaultHeadline,
        subtitle: tmpl.defaultSubtitle,
        body: tmpl.defaultBody,
        tagText: tmpl.tagText,
        background: tmpl.background,
        accentColor: tmpl.accentColor,
        fontId: tmpl.fontFamily,
        layout: tmpl.layout,
        darkText: tmpl.darkText,
        icons: [],
    };
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useEditorStore = create<EditorState>((set, get) => ({
    slides: [slideFromTemplate('biz_pitch')],
    activeSlideIndex: 0,
    activeSheet: null,
    activeCategoryId: 'all',
    aiUsage: { count: 0, resetTime: 0 },
    isGenerating: false,
    generationError: null,

    // ── Navigation ──────────────────────────────────────────────────────────────

    setActiveSlide: (index) => set({ activeSlideIndex: index }),

    // Toggle: clicking the same tab twice closes the sheet
    setActiveSheet: (sheet) =>
        set((state) => ({ activeSheet: state.activeSheet === sheet ? null : sheet })),

    setActiveCategory: (id) => set({ activeCategoryId: id }),

    // ── Slide CRUD ───────────────────────────────────────────────────────────────

    addSlide: (templateId) =>
        set((state) => {
            const newSlide = slideFromTemplate(templateId);
            const newSlides = [...state.slides, newSlide];
            return { slides: newSlides, activeSlideIndex: newSlides.length - 1 };
        }),

    duplicateSlide: (index) =>
        set((state) => {
            const original = state.slides[index];
            const copy: Slide = {
                ...original,
                id: crypto.randomUUID(),
                icons: original.icons.map(ic => ({ ...ic, id: crypto.randomUUID() })),
            };
            const newSlides = [...state.slides];
            newSlides.splice(index + 1, 0, copy);
            return { slides: newSlides, activeSlideIndex: index + 1 };
        }),

    deleteSlide: (index) =>
        set((state) => {
            if (state.slides.length === 1) return state; // never delete last slide
            const newSlides = state.slides.filter((_, i) => i !== index);
            const newIndex = Math.min(state.activeSlideIndex, newSlides.length - 1);
            return { slides: newSlides, activeSlideIndex: newIndex };
        }),

    reorderSlides: (fromIndex, toIndex) =>
        set((state) => {
            const newSlides = [...state.slides];
            const [moved] = newSlides.splice(fromIndex, 1);
            newSlides.splice(toIndex, 0, moved);
            return { slides: newSlides, activeSlideIndex: toIndex };
        }),

    // ── Template & Content Edits ──────────────────────────────────────────────

    applyTemplate: (templateId) =>
        set((state) => {
            const tmpl = TEMPLATES.find(t => t.id === templateId)!;
            const current = state.slides[state.activeSlideIndex];
            const prevTmpl = TEMPLATES.find(t => t.id === current.templateId);
            // Only replace text if it still matches the previous template's default (user hasn't edited it)
            const updated: Slide = {
                ...current,
                templateId,
                background: tmpl.background,
                accentColor: tmpl.accentColor,
                fontId: tmpl.fontFamily,
                layout: tmpl.layout,
                darkText: tmpl.darkText,
                headline: current.headline === prevTmpl?.defaultHeadline ? tmpl.defaultHeadline : current.headline,
                subtitle: current.subtitle === prevTmpl?.defaultSubtitle ? tmpl.defaultSubtitle : current.subtitle,
                body: current.body === prevTmpl?.defaultBody ? tmpl.defaultBody : current.body,
                tagText: current.tagText === prevTmpl?.tagText ? tmpl.tagText : current.tagText,
            };
            const newSlides = [...state.slides];
            newSlides[state.activeSlideIndex] = updated;
            return { slides: newSlides };
        }),

    updateSlideText: (field, value) =>
        set((state) => {
            const newSlides = [...state.slides];
            newSlides[state.activeSlideIndex] = { ...newSlides[state.activeSlideIndex], [field]: value };
            return { slides: newSlides };
        }),

    updateSlideBackground: (background) =>
        set((state) => {
            const newSlides = [...state.slides];
            newSlides[state.activeSlideIndex] = { ...newSlides[state.activeSlideIndex], background };
            return { slides: newSlides };
        }),

    updateSlideAccent: (accentColor) =>
        set((state) => {
            const newSlides = [...state.slides];
            newSlides[state.activeSlideIndex] = { ...newSlides[state.activeSlideIndex], accentColor };
            return { slides: newSlides };
        }),

    updateSlideFont: (fontId: FontId) =>
        set((state) => {
            const newSlides = [...state.slides];
            newSlides[state.activeSlideIndex] = { ...newSlides[state.activeSlideIndex], fontId };
            return { slides: newSlides };
        }),

    updateSlideLayout: (layout: LayoutId) =>
        set((state) => {
            const newSlides = [...state.slides];
            newSlides[state.activeSlideIndex] = { ...newSlides[state.activeSlideIndex], layout };
            return { slides: newSlides };
        }),

    // ── Icons ─────────────────────────────────────────────────────────────────

    addIconToSlide: (icon) =>
        set((state) => {
            const newIcon: IconOverlay = { ...icon, id: crypto.randomUUID() };
            const newSlides = [...state.slides];
            newSlides[state.activeSlideIndex] = {
                ...newSlides[state.activeSlideIndex],
                icons: [...newSlides[state.activeSlideIndex].icons, newIcon],
            };
            return { slides: newSlides };
        }),

    updateIconPosition: (iconId, x, y) =>
        set((state) => {
            const newSlides = [...state.slides];
            const slide = newSlides[state.activeSlideIndex];
            newSlides[state.activeSlideIndex] = {
                ...slide,
                icons: slide.icons.map(ic => ic.id === iconId ? { ...ic, x, y } : ic),
            };
            return { slides: newSlides };
        }),

    removeIconFromSlide: (iconId) =>
        set((state) => {
            const newSlides = [...state.slides];
            const slide = newSlides[state.activeSlideIndex];
            newSlides[state.activeSlideIndex] = {
                ...slide,
                icons: slide.icons.filter(ic => ic.id !== iconId),
            };
            return { slides: newSlides };
        }),

    // ── AI Generation ─────────────────────────────────────────────────────────

    canUseAI: () => {
        const { aiUsage } = get();
        const now = Date.now();
        if (now > aiUsage.resetTime) return true; // window expired, reset
        return aiUsage.count < AI_LIMIT;
    },

    generateFromAI: async (topic, niche) => {
        const state = get();
        if (!state.canUseAI()) {
            set({ generationError: 'Generation limit reached. Try again in 1 hour.' });
            return;
        }

        set({ isGenerating: true, generationError: null });

        try {
            const res = await fetch(
                '/utility/free-social-media-carousel-builder/api/carousel-generate',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ topic, niche }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                set({ generationError: data.error || 'Generation failed. Please try again.' });
                return;
            }

            // Apply generated slides — use current template style for all
            const currentTemplateId = get().slides[get().activeSlideIndex]?.templateId ?? 'biz_pitch';
            const tmpl = TEMPLATES.find(t => t.id === currentTemplateId)!;

            const generatedSlides: Slide[] = (data.slides as Array<{ headline: string; body: string }>).map((s) => ({
                id: crypto.randomUUID(),
                templateId: currentTemplateId,
                headline: s.headline,
                subtitle: '',
                body: s.body || '',
                tagText: tmpl.tagText,
                background: tmpl.background,
                accentColor: tmpl.accentColor,
                fontId: tmpl.fontFamily,
                layout: tmpl.layout,
                darkText: tmpl.darkText,
                icons: [],
            }));

            // Update AI usage
            const now = Date.now();
            const currentUsage = get().aiUsage;
            const newUsage: AIUsage = now > currentUsage.resetTime
                ? { count: 1, resetTime: now + AI_WINDOW_MS }
                : { count: currentUsage.count + 1, resetTime: currentUsage.resetTime };

            set({ slides: generatedSlides, activeSlideIndex: 0, aiUsage: newUsage });
        } catch {
            set({ generationError: 'Network error. Please try again.' });
        } finally {
            set({ isGenerating: false });
        }
    },

    // ── Persistence ───────────────────────────────────────────────────────────

    saveToStorage: () => {
        try {
            const { slides, activeSlideIndex } = get();
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ slides, activeSlideIndex, savedAt: Date.now() }));
        } catch {
            // localStorage may be unavailable (private mode, quota exceeded)
        }
    },

    loadFromStorage: () => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed.slides) && parsed.slides.length > 0) {
                set({ slides: parsed.slides, activeSlideIndex: parsed.activeSlideIndex ?? 0 });
            }
        } catch {
            // Corrupt data — ignore
        }
    },

    setSlides: (slides) => set({ slides }),
}));