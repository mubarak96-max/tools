import { create } from 'zustand';
import { EditorState, Slide, Template, Palette, Project, AIUsage } from '../types';
import { TEMPLATES } from '../data/templates';
import { PALETTES, getDefaultPalette } from '../data/palettes';
import { generateCarousel, canUseAI } from '../utils/ai';
import { saveProject, getSavedProjects, getCurrentProject, createEmptyProject, generateProjectId } from '../utils/storage';

const initialAIUsage: AIUsage = {
    count: 0,
    limit: 2,
    resetTime: Date.now() + 3600000, // 1 hour from now
    isBlocked: false
};

export const useEditorStore = create<EditorState>((set, get) => ({
    // Core state
    slides: [
        {
            id: `slide_${Date.now()}`,
            headline: 'Your headline here',
            body: ''
        }
    ],
    activeSlideIndex: 0,
    selectedTemplate: null,
    selectedPalette: getDefaultPalette(),

    // AI state
    aiUsage: initialAIUsage,
    isGenerating: false,

    // Project state
    currentProject: null,
    savedProjects: [],

    // UI state
    isExporting: false,

    // Actions
    setSlides: (slides) => {
        set({ slides });
        get().autoSave();
    },

    setActiveSlide: (index) => set({ activeSlideIndex: index }),

    addSlide: () => {
        const { slides } = get();
        const newSlide: Slide = {
            id: `slide_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            headline: 'New slide headline',
            body: ''
        };
        const newSlides = [...slides, newSlide];
        set({
            slides: newSlides,
            activeSlideIndex: newSlides.length - 1
        });
        get().autoSave();
    },

    duplicateSlide: (index) => {
        const { slides } = get();
        const slideToClone = slides[index];
        if (!slideToClone) return;

        const newSlide: Slide = {
            ...slideToClone,
            id: `slide_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };

        const newSlides = [...slides];
        newSlides.splice(index + 1, 0, newSlide);

        set({
            slides: newSlides,
            activeSlideIndex: index + 1
        });
        get().autoSave();
    },

    deleteSlide: (index) => {
        const { slides } = get();
        if (slides.length <= 1) return; // Don't delete the last slide

        const newSlides = slides.filter((_, i) => i !== index);
        const newActiveIndex = Math.min(index, newSlides.length - 1);

        set({
            slides: newSlides,
            activeSlideIndex: newActiveIndex
        });
        get().autoSave();
    },

    updateSlide: (index, updates) => {
        const { slides } = get();
        const newSlides = [...slides];
        newSlides[index] = { ...newSlides[index], ...updates };
        set({ slides: newSlides });
        get().autoSave();
    },

    // Template actions
    applyTemplate: (template) => {
        const newSlides: Slide[] = template.slides.map((templateSlide, index) => ({
            id: `slide_${Date.now()}_${index}`,
            headline: templateSlide.headline,
            body: templateSlide.body
        }));

        set({
            slides: newSlides,
            selectedTemplate: template,
            activeSlideIndex: 0
        });
        get().autoSave();
    },

    // Palette actions
    setPalette: (palette) => {
        set({ selectedPalette: palette });
        get().autoSave();
    },

    // AI actions
    generateCarousel: async (topic, niche) => {
        const { aiUsage } = get();

        if (!canUseAI(aiUsage)) {
            return;
        }

        set({ isGenerating: true });

        try {
            const result = await generateCarousel({ topic, niche });

            if (result.error) {
                console.error('AI generation error:', result.error);
                return;
            }

            if (result.slides.length > 0) {
                const newSlides: Slide[] = result.slides.map((slide, index) => ({
                    id: `slide_${Date.now()}_${index}`,
                    headline: slide.headline,
                    body: slide.body
                }));

                set({
                    slides: newSlides,
                    activeSlideIndex: 0
                });

                // Update AI usage
                const now = Date.now();
                const newAIUsage: AIUsage = {
                    ...aiUsage,
                    count: aiUsage.count + 1,
                    resetTime: now > aiUsage.resetTime ? now + 3600000 : aiUsage.resetTime,
                    isBlocked: aiUsage.count + 1 >= aiUsage.limit
                };

                set({ aiUsage: newAIUsage });
                get().autoSave();
            }
        } catch (error) {
            console.error('Failed to generate carousel:', error);
        } finally {
            set({ isGenerating: false });
        }
    },

    updateAIUsage: (usage) => {
        const { aiUsage } = get();
        set({ aiUsage: { ...aiUsage, ...usage } });
    },

    // Project actions
    saveProject: () => {
        const { slides, selectedTemplate, selectedPalette, currentProject } = get();

        const project: Project = {
            id: currentProject?.id || generateProjectId(),
            slides,
            templateId: selectedTemplate?.id || '',
            paletteId: selectedPalette.id,
            createdAt: currentProject?.createdAt || Date.now(),
            updatedAt: Date.now()
        };

        saveProject(project);
        set({ currentProject: project });
        get().loadSavedProjects();
    },

    loadProject: (project) => {
        set({
            slides: project.slides,
            selectedTemplate: TEMPLATES.find(t => t.id === project.templateId) || null,
            selectedPalette: PALETTES.find(p => p.id === project.paletteId) || getDefaultPalette(),
            currentProject: project,
            activeSlideIndex: 0
        });
    },

    createNewProject: () => {
        const newProject = createEmptyProject();
        set({
            slides: newProject.slides,
            selectedTemplate: null,
            selectedPalette: getDefaultPalette(),
            currentProject: newProject,
            activeSlideIndex: 0
        });
    },

    // Export actions
    setExporting: (isExporting) => set({ isExporting }),

    // Helper methods
    autoSave: () => {
        // Auto-save current state
        const state = get();
        if (state.slides.length > 0) {
            state.saveProject();
        }
    },

    loadSavedProjects: () => {
        const savedProjects = getSavedProjects();
        set({ savedProjects });
    },

    // Initialize store
    initialize: () => {
        const currentProject = getCurrentProject();
        const savedProjects = getSavedProjects();

        if (currentProject) {
            get().loadProject(currentProject);
        }

        set({ savedProjects });
    }
}));

// Initialize store on creation
useEditorStore.getState().initialize();