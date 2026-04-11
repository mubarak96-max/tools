'use client';

import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import {
    AppState,
    PremiumProject,
    PremiumSlide,
    PremiumElement,
    UIState,
    HistoryState,
    HistoryEntry,
    AssetLibrary,
    PremiumTemplate,
    SocialPlatform,
    BrandKit,
    Position2D,
    AppError
} from '../types/premium';

interface AppStore extends AppState {
    // Project Actions
    createProject: (name: string, template?: PremiumTemplate) => void;
    loadProject: (project: PremiumProject) => void;
    saveProject: () => Promise<void>;
    updateProject: (updates: Partial<PremiumProject>) => void;
    closeProject: () => void;

    // Slide Actions
    addSlide: (slide?: Partial<PremiumSlide>) => void;
    duplicateSlide: (slideId: string) => void;
    deleteSlide: (slideId: string) => void;
    reorderSlides: (fromIndex: number, toIndex: number) => void;
    updateSlide: (slideId: string, updates: Partial<PremiumSlide>) => void;
    selectSlide: (slideId: string) => void;

    // Element Actions
    addElement: (element: Omit<PremiumElement, 'id'>) => void;
    updateElement: (elementId: string, updates: Partial<PremiumElement>) => void;
    deleteElement: (elementId: string) => void;
    duplicateElement: (elementId: string) => void;
    selectElements: (elementIds: string[]) => void;
    clearSelection: () => void;
    moveElements: (elementIds: string[], delta: Position2D) => void;
    resizeElement: (elementId: string, dimensions: { width: number; height: number }) => void;
    rotateElement: (elementId: string, rotation: number) => void;
    reorderElements: (elementIds: string[], direction: 'forward' | 'backward' | 'front' | 'back') => void;

    // History Actions
    undo: () => void;
    redo: () => void;
    addHistoryEntry: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void;
    clearHistory: () => void;

    // UI Actions
    setActivePanel: (panel: UIState['activePanel']) => void;
    setCanvasZoom: (zoom: number) => void;
    setCanvasPosition: (position: Position2D) => void;
    toggleGrid: () => void;
    toggleRulers: () => void;
    toggleGuides: () => void;
    openModal: (modalId: string) => void;
    closeModal: (modalId?: string) => void;
    toggleSidebar: () => void;
    setPanelSize: (panelId: string, size: number) => void;

    // Asset Actions
    addAsset: (asset: any) => void;
    removeAsset: (assetId: string) => void;
    favoriteAsset: (assetId: string) => void;
    unfavoriteAsset: (assetId: string) => void;

    // Template Actions
    loadTemplates: (templates: PremiumTemplate[]) => void;
    addTemplate: (template: PremiumTemplate) => void;

    // Platform Actions
    loadPlatforms: (platforms: SocialPlatform[]) => void;

    // Brand Kit Actions
    loadBrandKits: (brandKits: BrandKit[]) => void;
    addBrandKit: (brandKit: BrandKit) => void;
    updateBrandKit: (brandKitId: string, updates: Partial<BrandKit>) => void;

    // Error Handling
    addError: (error: Omit<AppError, 'id' | 'timestamp'>) => void;
    removeError: (errorId: string) => void;
    clearErrors: () => void;

    // Utility Actions
    reset: () => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const initialUIState: UIState = {
    activePanel: 'templates',
    selectedElements: [],
    selectedSlide: '',
    canvasZoom: 1,
    canvasPosition: { x: 0, y: 0 },
    showGrid: true,
    showRulers: false,
    showGuides: true,
    modalStack: [],
    sidebarCollapsed: false,
    panelSizes: {
        sidebar: 300,
        properties: 320,
        timeline: 120
    }
};

const initialHistoryState: HistoryState = {
    entries: [],
    currentIndex: -1,
    maxEntries: 50
};

const initialAssetLibrary: AssetLibrary = {
    userAssets: [],
    stockAssets: [],
    brandAssets: [],
    recentAssets: [],
    favorites: []
};

export const useAppStore = create<AppStore>()(
    devtools(
        persist(
            subscribeWithSelector(
                immer((set, get) => ({
                    // Initial State
                    project: null,
                    ui: initialUIState,
                    assets: initialAssetLibrary,
                    history: initialHistoryState,
                    templates: [],
                    platforms: [],
                    brandKits: [],
                    errors: [],

                    // Project Actions
                    createProject: (name: string, template?: PremiumTemplate) => {
                        set((state) => {
                            const projectId = generateId();
                            const slideId = generateId();

                            const newSlide: PremiumSlide = {
                                id: slideId,
                                name: 'Slide 1',
                                elements: template?.slides[0]?.elements || [],
                                background: template?.slides[0]?.background || {
                                    type: 'color',
                                    value: '#ffffff'
                                },
                                dimensions: template?.slides[0]?.dimensions || { width: 1080, height: 1080 },
                                metadata: {
                                    name: 'Slide 1',
                                    createdAt: new Date(),
                                    modifiedAt: new Date(),
                                    version: 1
                                }
                            };

                            state.project = {
                                id: projectId,
                                name,
                                slides: [newSlide],
                                settings: {
                                    defaultDimensions: { width: 1080, height: 1080 },
                                    platform: state.platforms[0] || {
                                        id: 'instagram',
                                        name: 'Instagram',
                                        icon: 'instagram',
                                        color: '#E4405F',
                                        formats: [{
                                            id: 'square',
                                            name: 'Square Post',
                                            dimensions: { width: 1080, height: 1080 },
                                            aspectRatio: '1:1'
                                        }]
                                    },
                                    colorProfile: 'sRGB',
                                    exportSettings: {
                                        format: 'png',
                                        quality: 0.9,
                                        scale: 1,
                                        includeMetadata: false
                                    },
                                    gridSettings: {
                                        enabled: true,
                                        size: 20,
                                        subdivisions: 4,
                                        color: '#e5e7eb',
                                        opacity: 0.5
                                    },
                                    snapSettings: {
                                        enabled: true,
                                        snapToGrid: true,
                                        snapToElements: true,
                                        snapToGuides: true,
                                        threshold: 5
                                    },
                                    autoSave: true,
                                    autoSaveInterval: 30
                                },
                                metadata: {
                                    createdAt: new Date(),
                                    updatedAt: new Date(),
                                    version: '1.0.0',
                                    totalSlides: 1,
                                    totalElements: newSlide.elements.length,
                                    fileSize: 0,
                                    exportCount: 0
                                }
                            };

                            state.ui.selectedSlide = slideId;
                            state.ui.selectedElements = [];
                            state.ui.activePanel = 'properties';
                            state.history = initialHistoryState;
                        });
                    },

                    loadProject: (project: PremiumProject) => {
                        set((state) => {
                            state.project = project;
                            state.ui.selectedSlide = project.slides[0]?.id || '';
                            state.ui.selectedElements = [];
                            state.history = initialHistoryState;
                        });
                    },

                    saveProject: async () => {
                        const { project } = get();
                        if (!project) return;

                        // Update metadata
                        set((state) => {
                            if (state.project) {
                                state.project.metadata.updatedAt = new Date();
                                state.project.metadata.totalSlides = state.project.slides.length;
                                state.project.metadata.totalElements = state.project.slides.reduce(
                                    (total, slide) => total + slide.elements.length,
                                    0
                                );
                            }
                        });

                        // Here you would implement actual saving logic (API call, localStorage, etc.)
                        console.log('Saving project:', project);
                    },

                    updateProject: (updates: Partial<PremiumProject>) => {
                        set((state) => {
                            if (state.project) {
                                Object.assign(state.project, updates);
                                state.project.metadata.updatedAt = new Date();
                            }
                        });
                    },

                    closeProject: () => {
                        set((state) => {
                            state.project = null;
                            state.ui = initialUIState;
                            state.history = initialHistoryState;
                        });
                    },

                    // Slide Actions
                    addSlide: (slide?: Partial<PremiumSlide>) => {
                        set((state) => {
                            if (!state.project) return;

                            const slideId = generateId();
                            const slideNumber = state.project.slides.length + 1;

                            const newSlide: PremiumSlide = {
                                id: slideId,
                                name: `Slide ${slideNumber}`,
                                elements: [],
                                background: { type: 'color', value: '#ffffff' },
                                dimensions: state.project.settings.defaultDimensions,
                                metadata: {
                                    name: `Slide ${slideNumber}`,
                                    createdAt: new Date(),
                                    modifiedAt: new Date(),
                                    version: 1
                                },
                                ...slide
                            };

                            state.project.slides.push(newSlide);
                            state.ui.selectedSlide = slideId;
                            state.ui.selectedElements = [];

                            // Add history entry
                            get().addHistoryEntry({
                                action: 'add_slide',
                                description: `Added ${newSlide.name}`,
                                beforeState: null,
                                afterState: newSlide,
                                slideId
                            });
                        });
                    },

                    duplicateSlide: (slideId: string) => {
                        set((state) => {
                            if (!state.project) return;

                            const slideIndex = state.project.slides.findIndex(s => s.id === slideId);
                            if (slideIndex === -1) return;

                            const originalSlide = state.project.slides[slideIndex];
                            const newSlideId = generateId();
                            const duplicatedSlide: PremiumSlide = {
                                ...originalSlide,
                                id: newSlideId,
                                name: `${originalSlide.name} Copy`,
                                elements: originalSlide.elements.map(element => ({
                                    ...element,
                                    id: generateId()
                                })),
                                metadata: {
                                    ...originalSlide.metadata,
                                    name: `${originalSlide.name} Copy`,
                                    createdAt: new Date(),
                                    modifiedAt: new Date()
                                }
                            };

                            state.project.slides.splice(slideIndex + 1, 0, duplicatedSlide);
                            state.ui.selectedSlide = newSlideId;
                            state.ui.selectedElements = [];
                        });
                    },

                    deleteSlide: (slideId: string) => {
                        set((state) => {
                            if (!state.project || state.project.slides.length <= 1) return;

                            const slideIndex = state.project.slides.findIndex(s => s.id === slideId);
                            if (slideIndex === -1) return;

                            const deletedSlide = state.project.slides[slideIndex];
                            state.project.slides.splice(slideIndex, 1);

                            // Update selected slide
                            if (state.ui.selectedSlide === slideId) {
                                const newIndex = Math.min(slideIndex, state.project.slides.length - 1);
                                state.ui.selectedSlide = state.project.slides[newIndex]?.id || '';
                            }

                            state.ui.selectedElements = [];

                            // Add history entry
                            get().addHistoryEntry({
                                action: 'delete_slide',
                                description: `Deleted ${deletedSlide.name}`,
                                beforeState: deletedSlide,
                                afterState: null,
                                slideId
                            });
                        });
                    },

                    reorderSlides: (fromIndex: number, toIndex: number) => {
                        set((state) => {
                            if (!state.project) return;

                            const slides = state.project.slides;
                            const [movedSlide] = slides.splice(fromIndex, 1);
                            slides.splice(toIndex, 0, movedSlide);
                        });
                    },

                    updateSlide: (slideId: string, updates: Partial<PremiumSlide>) => {
                        set((state) => {
                            if (!state.project) return;

                            const slideIndex = state.project.slides.findIndex(s => s.id === slideId);
                            if (slideIndex === -1) return;

                            const slide = state.project.slides[slideIndex];
                            Object.assign(slide, updates);
                            slide.metadata.modifiedAt = new Date();
                        });
                    },

                    selectSlide: (slideId: string) => {
                        set((state) => {
                            state.ui.selectedSlide = slideId;
                            state.ui.selectedElements = [];
                        });
                    },

                    // Element Actions
                    addElement: (element: Omit<PremiumElement, 'id'>) => {
                        set((state) => {
                            if (!state.project || !state.ui.selectedSlide) return;

                            const slide = state.project.slides.find(s => s.id === state.ui.selectedSlide);
                            if (!slide) return;

                            const newElement: PremiumElement = {
                                ...element,
                                id: generateId()
                            };

                            slide.elements.push(newElement);
                            slide.metadata.modifiedAt = new Date();
                            state.ui.selectedElements = [newElement.id];

                            // Add history entry
                            get().addHistoryEntry({
                                action: 'add_element',
                                description: `Added ${element.type} element`,
                                beforeState: null,
                                afterState: newElement,
                                slideId: state.ui.selectedSlide,
                                elementIds: [newElement.id]
                            });
                        });
                    },

                    updateElement: (elementId: string, updates: Partial<PremiumElement>) => {
                        set((state) => {
                            if (!state.project || !state.ui.selectedSlide) return;

                            const slide = state.project.slides.find(s => s.id === state.ui.selectedSlide);
                            if (!slide) return;

                            const elementIndex = slide.elements.findIndex(e => e.id === elementId);
                            if (elementIndex === -1) return;

                            const element = slide.elements[elementIndex];
                            const beforeState = { ...element };

                            Object.assign(element, updates);
                            slide.metadata.modifiedAt = new Date();

                            // Add history entry for significant changes
                            if (updates.position || updates.dimensions || updates.style) {
                                get().addHistoryEntry({
                                    action: 'update_element',
                                    description: `Updated ${element.type} element`,
                                    beforeState,
                                    afterState: element,
                                    slideId: state.ui.selectedSlide,
                                    elementIds: [elementId]
                                });
                            }
                        });
                    },

                    deleteElement: (elementId: string) => {
                        set((state) => {
                            if (!state.project || !state.ui.selectedSlide) return;

                            const slide = state.project.slides.find(s => s.id === state.ui.selectedSlide);
                            if (!slide) return;

                            const elementIndex = slide.elements.findIndex(e => e.id === elementId);
                            if (elementIndex === -1) return;

                            const deletedElement = slide.elements[elementIndex];
                            slide.elements.splice(elementIndex, 1);
                            slide.metadata.modifiedAt = new Date();

                            // Remove from selection
                            state.ui.selectedElements = state.ui.selectedElements.filter(id => id !== elementId);

                            // Add history entry
                            get().addHistoryEntry({
                                action: 'delete_element',
                                description: `Deleted ${deletedElement.type} element`,
                                beforeState: deletedElement,
                                afterState: null,
                                slideId: state.ui.selectedSlide,
                                elementIds: [elementId]
                            });
                        });
                    },

                    duplicateElement: (elementId: string) => {
                        set((state) => {
                            if (!state.project || !state.ui.selectedSlide) return;

                            const slide = state.project.slides.find(s => s.id === state.ui.selectedSlide);
                            if (!slide) return;

                            const element = slide.elements.find(e => e.id === elementId);
                            if (!element) return;

                            const newElement: PremiumElement = {
                                ...element,
                                id: generateId(),
                                position: {
                                    ...element.position,
                                    x: element.position.x + 20,
                                    y: element.position.y + 20
                                }
                            };

                            slide.elements.push(newElement);
                            slide.metadata.modifiedAt = new Date();
                            state.ui.selectedElements = [newElement.id];
                        });
                    },

                    selectElements: (elementIds: string[]) => {
                        set((state) => {
                            state.ui.selectedElements = elementIds;
                        });
                    },

                    clearSelection: () => {
                        set((state) => {
                            state.ui.selectedElements = [];
                        });
                    },

                    moveElements: (elementIds: string[], delta: Position2D) => {
                        set((state) => {
                            if (!state.project || !state.ui.selectedSlide) return;

                            const slide = state.project.slides.find(s => s.id === state.ui.selectedSlide);
                            if (!slide) return;

                            elementIds.forEach(elementId => {
                                const element = slide.elements.find(e => e.id === elementId);
                                if (element && !element.locked) {
                                    element.position.x += delta.x;
                                    element.position.y += delta.y;
                                }
                            });

                            slide.metadata.modifiedAt = new Date();
                        });
                    },

                    resizeElement: (elementId: string, dimensions: { width: number; height: number }) => {
                        set((state) => {
                            if (!state.project || !state.ui.selectedSlide) return;

                            const slide = state.project.slides.find(s => s.id === state.ui.selectedSlide);
                            if (!slide) return;

                            const element = slide.elements.find(e => e.id === elementId);
                            if (element && !element.locked) {
                                element.dimensions = dimensions;
                                slide.metadata.modifiedAt = new Date();
                            }
                        });
                    },

                    rotateElement: (elementId: string, rotation: number) => {
                        set((state) => {
                            if (!state.project || !state.ui.selectedSlide) return;

                            const slide = state.project.slides.find(s => s.id === state.ui.selectedSlide);
                            if (!slide) return;

                            const element = slide.elements.find(e => e.id === elementId);
                            if (element && !element.locked) {
                                if (!element.style.transform) {
                                    element.style.transform = {};
                                }
                                element.style.transform.rotation = rotation;
                                slide.metadata.modifiedAt = new Date();
                            }
                        });
                    },

                    reorderElements: (elementIds: string[], direction: 'forward' | 'backward' | 'front' | 'back') => {
                        set((state) => {
                            if (!state.project || !state.ui.selectedSlide) return;

                            const slide = state.project.slides.find(s => s.id === state.ui.selectedSlide);
                            if (!slide) return;

                            elementIds.forEach(elementId => {
                                const element = slide.elements.find(e => e.id === elementId);
                                if (!element) return;

                                switch (direction) {
                                    case 'forward':
                                        element.position.z = Math.min(element.position.z + 1, slide.elements.length - 1);
                                        break;
                                    case 'backward':
                                        element.position.z = Math.max(element.position.z - 1, 0);
                                        break;
                                    case 'front':
                                        element.position.z = slide.elements.length - 1;
                                        break;
                                    case 'back':
                                        element.position.z = 0;
                                        break;
                                }
                            });

                            // Normalize z-indices
                            slide.elements.sort((a, b) => a.position.z - b.position.z);
                            slide.elements.forEach((element, index) => {
                                element.position.z = index;
                            });

                            slide.metadata.modifiedAt = new Date();
                        });
                    },

                    // History Actions
                    undo: () => {
                        set((state) => {
                            if (state.history.currentIndex < 0) return;

                            const entry = state.history.entries[state.history.currentIndex];
                            if (!entry) return;

                            // Apply the before state
                            // This is a simplified implementation - in practice, you'd need more sophisticated state restoration
                            state.history.currentIndex--;
                        });
                    },

                    redo: () => {
                        set((state) => {
                            if (state.history.currentIndex >= state.history.entries.length - 1) return;

                            state.history.currentIndex++;
                            const entry = state.history.entries[state.history.currentIndex];
                            if (!entry) return;

                            // Apply the after state
                            // This is a simplified implementation - in practice, you'd need more sophisticated state restoration
                        });
                    },

                    addHistoryEntry: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => {
                        set((state) => {
                            const newEntry: HistoryEntry = {
                                ...entry,
                                id: generateId(),
                                timestamp: new Date()
                            };

                            // Remove any entries after current index (when undoing and then making new changes)
                            state.history.entries = state.history.entries.slice(0, state.history.currentIndex + 1);

                            // Add new entry
                            state.history.entries.push(newEntry);
                            state.history.currentIndex = state.history.entries.length - 1;

                            // Limit history size
                            if (state.history.entries.length > state.history.maxEntries) {
                                state.history.entries.shift();
                                state.history.currentIndex--;
                            }
                        });
                    },

                    clearHistory: () => {
                        set((state) => {
                            state.history = initialHistoryState;
                        });
                    },

                    // UI Actions
                    setActivePanel: (panel: UIState['activePanel']) => {
                        set((state) => {
                            state.ui.activePanel = panel;
                        });
                    },

                    setCanvasZoom: (zoom: number) => {
                        set((state) => {
                            state.ui.canvasZoom = Math.max(0.1, Math.min(5, zoom));
                        });
                    },

                    setCanvasPosition: (position: Position2D) => {
                        set((state) => {
                            state.ui.canvasPosition = position;
                        });
                    },

                    toggleGrid: () => {
                        set((state) => {
                            state.ui.showGrid = !state.ui.showGrid;
                        });
                    },

                    toggleRulers: () => {
                        set((state) => {
                            state.ui.showRulers = !state.ui.showRulers;
                        });
                    },

                    toggleGuides: () => {
                        set((state) => {
                            state.ui.showGuides = !state.ui.showGuides;
                        });
                    },

                    openModal: (modalId: string) => {
                        set((state) => {
                            if (!state.ui.modalStack.includes(modalId)) {
                                state.ui.modalStack.push(modalId);
                            }
                        });
                    },

                    closeModal: (modalId?: string) => {
                        set((state) => {
                            if (modalId) {
                                state.ui.modalStack = state.ui.modalStack.filter(id => id !== modalId);
                            } else {
                                state.ui.modalStack.pop();
                            }
                        });
                    },

                    toggleSidebar: () => {
                        set((state) => {
                            state.ui.sidebarCollapsed = !state.ui.sidebarCollapsed;
                        });
                    },

                    setPanelSize: (panelId: string, size: number) => {
                        set((state) => {
                            state.ui.panelSizes[panelId] = size;
                        });
                    },

                    // Asset Actions
                    addAsset: (asset: any) => {
                        set((state) => {
                            state.assets.userAssets.push(asset);

                            // Add to recent assets
                            state.assets.recentAssets.unshift(asset);
                            if (state.assets.recentAssets.length > 20) {
                                state.assets.recentAssets.pop();
                            }
                        });
                    },

                    removeAsset: (assetId: string) => {
                        set((state) => {
                            state.assets.userAssets = state.assets.userAssets.filter(a => a.id !== assetId);
                            state.assets.recentAssets = state.assets.recentAssets.filter(a => a.id !== assetId);
                            state.assets.favorites = state.assets.favorites.filter(a => a.id !== assetId);
                        });
                    },

                    favoriteAsset: (assetId: string) => {
                        set((state) => {
                            const asset = [...state.assets.userAssets, ...state.assets.stockAssets]
                                .find(a => a.id === assetId);

                            if (asset && !state.assets.favorites.find(a => a.id === assetId)) {
                                state.assets.favorites.push(asset);
                            }
                        });
                    },

                    unfavoriteAsset: (assetId: string) => {
                        set((state) => {
                            state.assets.favorites = state.assets.favorites.filter(a => a.id !== assetId);
                        });
                    },

                    // Template Actions
                    loadTemplates: (templates: PremiumTemplate[]) => {
                        set((state) => {
                            state.templates = templates;
                        });
                    },

                    addTemplate: (template: PremiumTemplate) => {
                        set((state) => {
                            state.templates.push(template);
                        });
                    },

                    // Platform Actions
                    loadPlatforms: (platforms: SocialPlatform[]) => {
                        set((state) => {
                            state.platforms = platforms;
                        });
                    },

                    // Brand Kit Actions
                    loadBrandKits: (brandKits: BrandKit[]) => {
                        set((state) => {
                            state.brandKits = brandKits;
                        });
                    },

                    addBrandKit: (brandKit: BrandKit) => {
                        set((state) => {
                            state.brandKits.push(brandKit);
                        });
                    },

                    updateBrandKit: (brandKitId: string, updates: Partial<BrandKit>) => {
                        set((state) => {
                            const brandKit = state.brandKits.find(bk => bk.id === brandKitId);
                            if (brandKit) {
                                Object.assign(brandKit, updates);
                                brandKit.updatedAt = new Date();
                            }
                        });
                    },

                    // Error Handling
                    addError: (error: Omit<AppError, 'id' | 'timestamp'>) => {
                        set((state) => {
                            const newError: AppError = {
                                ...error,
                                id: generateId(),
                                timestamp: new Date()
                            };
                            state.errors.push(newError);
                        });
                    },

                    removeError: (errorId: string) => {
                        set((state) => {
                            state.errors = state.errors.filter(e => e.id !== errorId);
                        });
                    },

                    clearErrors: () => {
                        set((state) => {
                            state.errors = [];
                        });
                    },

                    // Utility Actions
                    reset: () => {
                        set(() => ({
                            project: null,
                            ui: initialUIState,
                            assets: initialAssetLibrary,
                            history: initialHistoryState,
                            templates: [],
                            platforms: [],
                            brandKits: [],
                            errors: []
                        }));
                    }
                }))
            ),
            {
                name: 'premium-carousel-builder',
                partialize: (state) => ({
                    // Only persist certain parts of the state
                    ui: {
                        ...state.ui,
                        modalStack: [], // Don't persist open modals
                        selectedElements: [] // Don't persist selection
                    },
                    assets: state.assets,
                    brandKits: state.brandKits
                })
            }
        ),
        {
            name: 'premium-carousel-builder-store'
        }
    )
);