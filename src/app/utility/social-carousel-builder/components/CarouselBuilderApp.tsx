'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CarouselProject, Platform, PlatformFormat, SeamlessStripConfig, Slide, Template } from '../types';
import { getAllPlatforms } from '../constants/platforms';
import {
    applySeamlessStripToSlides,
    createSlideFromTemplate,
    fileToDataURL,
    generateId,
    isValidFileSize,
    isValidImageType,
    reorderSlides,
} from '../utils';
import { exportSlideFile, exportSlidesZip } from '../utils/export';
import { adaptTemplateForPlatform } from '../utils/platformUtils';
import {
    clearRecoveryProject,
    deleteProjectFromStorage,
    loadRecoveryProject,
    loadSavedProjects,
    saveRecoveryProject,
    saveProjectToStorage,
} from '../utils/storage';
import { useTemplates } from '../hooks/useTemplates';
import { TemplateSelector } from './TemplateSelector';
import { PlatformSelector } from './PlatformSelector';
import { CarouselEditor } from './CarouselEditor';
import { SlideThumbnail } from './SlideThumbnail';

interface HistorySnapshot {
    slides: Slide[];
    currentSlideIndex: number;
}

export const CarouselBuilderApp: React.FC = () => {
    const {
        templates,
        loading: templatesLoading,
        error: templatesError,
        selectedTemplate,
        selectTemplate,
        clearSelection,
    } = useTemplates();

    const initialPlatform = getAllPlatforms()[0];
    const [selectedPlatform, setSelectedPlatform] = useState<Platform>(initialPlatform);
    const [selectedFormat, setSelectedFormat] = useState<PlatformFormat>(initialPlatform.formats[0]);
    const [slides, setSlides] = useState<Slide[]>([]);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [project, setProject] = useState<CarouselProject | null>(null);
    const [savedProjects, setSavedProjects] = useState<CarouselProject[]>([]);
    const [recoveryProject, setRecoveryProject] = useState<CarouselProject | null>(null);
    const [historyState, setHistoryState] = useState<{ snapshots: HistorySnapshot[]; index: number }>({
        snapshots: [],
        index: -1,
    });
    const [saveStatus, setSaveStatus] = useState('No saved project yet in this browser.');
    const [exportStatus, setExportStatus] = useState('Ready to export the current slide or a ZIP of all slides.');
    const [isExporting, setIsExporting] = useState(false);
    const [exportType, setExportType] = useState<'png' | 'jpg'>('png');
    const [exportQuality, setExportQuality] = useState(0.92);
    const [canRetryExport, setCanRetryExport] = useState(false);
    const [lastExportAction, setLastExportAction] = useState<'current' | 'all' | null>(null);
    const [savedProjectQuery, setSavedProjectQuery] = useState('');
    const [savedProjectSort, setSavedProjectSort] = useState<'recent' | 'name-asc' | 'name-desc'>('recent');
    const [seamlessStrip, setSeamlessStrip] = useState<SeamlessStripConfig | null>(null);
    const [isApplyingSeamlessStrip, setIsApplyingSeamlessStrip] = useState(false);
    const isApplyingHistoryRef = useRef(false);

    const filteredSavedProjects = useMemo(() => {
        const normalizedQuery = savedProjectQuery.trim().toLowerCase();
        const nextProjects = normalizedQuery
            ? savedProjects.filter((savedProject) => {
                const searchableText = [
                    savedProject.name,
                    savedProject.platform.name,
                    savedProject.format.name,
                ].join(' ').toLowerCase();

                return searchableText.includes(normalizedQuery);
            })
            : [...savedProjects];

        switch (savedProjectSort) {
            case 'name-asc':
                return nextProjects.sort((left, right) => left.name.localeCompare(right.name));
            case 'name-desc':
                return nextProjects.sort((left, right) => right.name.localeCompare(left.name));
            case 'recent':
            default:
                return nextProjects.sort((left, right) => right.updatedAt.getTime() - left.updatedAt.getTime());
        }
    }, [savedProjectQuery, savedProjectSort, savedProjects]);

    const buildProject = (template: Template, currentSlides: Slide[], platform: Platform, format: PlatformFormat): CarouselProject => ({
        id: project?.id || generateId(),
        name: `${template.name} Carousel`,
        slides: currentSlides,
        template,
        platform,
        format,
        seamlessStrip,
        createdAt: project?.createdAt || new Date(),
        updatedAt: new Date(),
    });

    const createHistorySnapshot = useCallback((nextSlides: Slide[], nextSlideIndex: number): HistorySnapshot => ({
        slides: structuredClone(nextSlides),
        currentSlideIndex: nextSlideIndex,
    }), []);

    const getSnapshotKey = useCallback((snapshot: HistorySnapshot) => JSON.stringify(snapshot), []);

    const seedHistory = useCallback((nextSlides: Slide[], nextSlideIndex: number) => {
        setHistoryState({
            snapshots: [createHistorySnapshot(nextSlides, nextSlideIndex)],
            index: 0,
        });
    }, [createHistorySnapshot]);

    const hydrateSlidesWithSeamlessStrip = useCallback(
        async (
            nextSlides: Slide[],
            nextFormat: PlatformFormat = selectedFormat,
            nextStrip: SeamlessStripConfig | null = seamlessStrip
        ) => {
            if (!nextStrip) {
                return nextSlides.map((slide) => ({
                    ...slide,
                    backgroundImage: undefined,
                }));
            }

            setIsApplyingSeamlessStrip(true);
            try {
                return await applySeamlessStripToSlides(nextSlides, nextFormat, nextStrip);
            } finally {
                setIsApplyingSeamlessStrip(false);
            }
        },
        [selectedFormat, seamlessStrip]
    );

    useEffect(() => {
        setSavedProjects(loadSavedProjects());
        setRecoveryProject(loadRecoveryProject());
    }, []);

    const handleTemplateSelect = (template: Template) => {
        const adaptedTemplate = adaptTemplateForPlatform(template, selectedFormat.dimensions);
        const initialSlide = createSlideFromTemplate(adaptedTemplate);
        const nextProject = {
            ...buildProject(adaptedTemplate, [initialSlide], selectedPlatform, selectedFormat),
            seamlessStrip: null,
        };
        selectTemplate(adaptedTemplate);
        setSeamlessStrip(null);
        setSlides([initialSlide]);
        setCurrentSlideIndex(0);
        setProject(nextProject);
        setRecoveryProject(nextProject);
        seedHistory([initialSlide], 0);
        setSaveStatus('Project created. Save it manually or wait for autosave.');
    };

    const handlePlatformChange = async (platform: Platform, format: PlatformFormat) => {
        setSelectedPlatform(platform);
        setSelectedFormat(format);

        if (!selectedTemplate) {
            return;
        }

        const adaptedTemplate = adaptTemplateForPlatform(selectedTemplate, format.dimensions);
        const nextSlides = slides.length
            ? slides.map((slide) => ({
                ...slide,
                elements: slide.elements.map((element, index) => {
                    const templateElement = adaptedTemplate.elements[index];
                    if (!templateElement) {
                        return element;
                    }
                    return {
                        ...element,
                        position: templateElement.position,
                        dimensions: templateElement.dimensions,
                        style: {
                            ...element.style,
                            fontSize: templateElement.style.fontSize ?? element.style.fontSize,
                        },
                    };
                }),
            }))
            : [createSlideFromTemplate(adaptedTemplate)];
        const hydratedSlides = await hydrateSlidesWithSeamlessStrip(nextSlides, format);
        const nextProject = project
            ? {
                ...project,
                template: adaptedTemplate,
                platform,
                format,
                slides: hydratedSlides,
                updatedAt: new Date(),
            }
            : buildProject(adaptedTemplate, hydratedSlides, platform, format);

        selectTemplate(adaptedTemplate);
        setSlides(hydratedSlides);
        setCurrentSlideIndex((current) => Math.min(current, hydratedSlides.length - 1));
        setProject(nextProject);
        setRecoveryProject(nextProject);
        seedHistory(hydratedSlides, Math.min(currentSlideIndex, hydratedSlides.length - 1));
        setSaveStatus('Platform updated. Save to keep this version.');
    };

    const handleSlideUpdate = (slideIndex: number, updatedSlide: Slide) => {
        setSlides((currentSlides) => {
            const nextSlides = [...currentSlides];
            nextSlides[slideIndex] = updatedSlide;
            return nextSlides;
        });
    };

    const handleSlideAdd = async () => {
        if (!selectedTemplate || slides.length >= 10) {
            return;
        }
        const nextSlide = createSlideFromTemplate(selectedTemplate);
        const nextSlides = [...slides, nextSlide];
        setSlides(await hydrateSlidesWithSeamlessStrip(nextSlides));
        setCurrentSlideIndex(nextSlides.length - 1);
    };

    const handleSlideDelete = async (slideIndex: number) => {
        if (slides.length <= 1) {
            return;
        }
        const nextSlides = slides.filter((_, index) => index !== slideIndex);
        setSlides(await hydrateSlidesWithSeamlessStrip(nextSlides));
        setCurrentSlideIndex((current) => {
            if (current > slideIndex) {
                return current - 1;
            }
            return Math.min(current, slides.length - 2);
        });
    };

    const handleSlideReorder = async (fromIndex: number, toIndex: number) => {
        if (fromIndex === toIndex) {
            return;
        }
        setSlides(await hydrateSlidesWithSeamlessStrip(reorderSlides(slides, fromIndex, toIndex)));
        setCurrentSlideIndex((current) => {
            if (current === fromIndex) {
                return toIndex;
            }
            if (current > fromIndex && current <= toIndex) {
                return current - 1;
            }
            if (current < fromIndex && current >= toIndex) {
                return current + 1;
            }
            return current;
        });
    };

    const handleTemplateChange = () => {
        clearSelection();
        setSeamlessStrip(null);
        setSlides([]);
        setProject(null);
        setCurrentSlideIndex(0);
        setHistoryState({ snapshots: [], index: -1 });
        setSaveStatus('Choose a template or load a saved project.');
    };

    const handleManualSave = () => {
        if (!project) {
            return;
        }
        try {
            const nextSaved = saveProjectToStorage(project);
            setSavedProjects(nextSaved);
            setSaveStatus(`Saved locally at ${new Date().toLocaleTimeString()}.`);
        } catch (error) {
            setSaveStatus(error instanceof Error ? error.message : 'Unable to save this project locally.');
        }
    };

    const handleLoadProject = (savedProject: CarouselProject) => {
        selectTemplate(savedProject.template);
        setSelectedPlatform(savedProject.platform);
        setSelectedFormat(savedProject.format);
        setSeamlessStrip(savedProject.seamlessStrip ?? null);
        setSlides(savedProject.slides);
        setCurrentSlideIndex(0);
        setProject({
            ...savedProject,
            createdAt: new Date(savedProject.createdAt),
            updatedAt: new Date(savedProject.updatedAt),
        });
        setRecoveryProject(savedProject);
        seedHistory(savedProject.slides, 0);
        setSaveStatus(`Loaded saved project "${savedProject.name}".`);
    };

    const handleDeleteProject = (projectId: string) => {
        const nextSaved = deleteProjectFromStorage(projectId);
        setSavedProjects(nextSaved);
        if (recoveryProject?.id === projectId) {
            clearRecoveryProject();
            setRecoveryProject(null);
        }
        setSaveStatus('Deleted saved project from this browser.');
    };

    const handleDuplicateProject = (savedProject: CarouselProject) => {
        const duplicatedProject: CarouselProject = {
            ...savedProject,
            id: generateId(),
            name: `${savedProject.name} Copy`,
            createdAt: new Date(),
            updatedAt: new Date(),
            slides: structuredClone(savedProject.slides),
        };

        try {
            const nextSaved = saveProjectToStorage(duplicatedProject);
            setSavedProjects(nextSaved);
            setSaveStatus(`Duplicated project "${savedProject.name}".`);
        } catch (error) {
            setSaveStatus(error instanceof Error ? error.message : 'Unable to duplicate this project locally.');
        }
    };

    const handleRenameSavedProject = (savedProject: CarouselProject) => {
        const nextName = window.prompt('Rename saved project', savedProject.name);
        if (!nextName) {
            return;
        }

        const trimmedName = nextName.trim();
        if (!trimmedName) {
            return;
        }

        try {
            const nextSaved = saveProjectToStorage({
                ...savedProject,
                name: trimmedName,
                updatedAt: new Date(),
            });
            setSavedProjects(nextSaved);
            if (project?.id === savedProject.id) {
                setProject({
                    ...savedProject,
                    name: trimmedName,
                    updatedAt: new Date(),
                });
            }
            setSaveStatus(`Renamed project to "${trimmedName}".`);
        } catch (error) {
            setSaveStatus(error instanceof Error ? error.message : 'Unable to rename this project locally.');
        }
    };

    const handleProjectNameChange = (name: string) => {
        const trimmedName = name.trimStart();
        setProject((current) => (
            current
                ? {
                    ...current,
                    name: trimmedName || current.name,
                    updatedAt: new Date(),
                }
                : current
        ));
    };

    const handleSeamlessStripUpload = useCallback(async (file: File | null) => {
        if (!file) {
            return;
        }

        if (!isValidImageType(file)) {
            setSaveStatus('Upload a JPG, PNG, GIF, or WebP image for the seamless strip.');
            return;
        }

        if (!isValidFileSize(file, 12)) {
            setSaveStatus('Seamless strip images must be 12MB or smaller.');
            return;
        }

        try {
            const src = await fileToDataURL(file);
            const nextStrip: SeamlessStripConfig = {
                src,
                alt: file.name,
                zoom: 1,
                offsetX: 0,
                offsetY: 0,
            };
            const nextSlides = await hydrateSlidesWithSeamlessStrip(slides, selectedFormat, nextStrip);
            setSeamlessStrip(nextStrip);
            setSlides(nextSlides);
            setSaveStatus('Applied a seamless background strip across the carousel.');
        } catch (error) {
            setSaveStatus(error instanceof Error ? error.message : 'Unable to apply the seamless strip image.');
        }
    }, [hydrateSlidesWithSeamlessStrip, selectedFormat, slides]);

    const handleSeamlessStripChange = useCallback(async (updates: Partial<SeamlessStripConfig>) => {
        if (!seamlessStrip) {
            return;
        }

        const nextStrip = {
            ...seamlessStrip,
            ...updates,
        };
        const nextSlides = await hydrateSlidesWithSeamlessStrip(slides, selectedFormat, nextStrip);
        setSeamlessStrip(nextStrip);
        setSlides(nextSlides);
    }, [hydrateSlidesWithSeamlessStrip, seamlessStrip, selectedFormat, slides]);

    const handleSeamlessStripClear = useCallback(() => {
        setSeamlessStrip(null);
        setSlides((currentSlides) => currentSlides.map((slide) => ({
            ...slide,
            backgroundImage: undefined,
        })));
        setSaveStatus('Removed the seamless background strip.');
    }, []);

    const handleResumeRecovery = () => {
        if (!recoveryProject) {
            return;
        }
        handleLoadProject(recoveryProject);
        setSaveStatus(`Recovered your last session from ${new Date(recoveryProject.updatedAt).toLocaleString()}.`);
    };

    const handleDismissRecovery = () => {
        clearRecoveryProject();
        setRecoveryProject(null);
        setSaveStatus('Cleared the recovery draft for this browser.');
    };

    const handleUndo = useCallback(() => {
        if (historyState.index <= 0) {
            return;
        }

        const snapshot = historyState.snapshots[historyState.index - 1];
        if (!snapshot) {
            return;
        }

        isApplyingHistoryRef.current = true;
        setHistoryState((current) => ({
            ...current,
            index: current.index - 1,
        }));
        setSlides(snapshot.slides);
        setCurrentSlideIndex(snapshot.currentSlideIndex);
        setSaveStatus('Reverted the last carousel change.');
    }, [historyState]);

    const handleRedo = useCallback(() => {
        if (historyState.index >= historyState.snapshots.length - 1) {
            return;
        }

        const snapshot = historyState.snapshots[historyState.index + 1];
        if (!snapshot) {
            return;
        }

        isApplyingHistoryRef.current = true;
        setHistoryState((current) => ({
            ...current,
            index: current.index + 1,
        }));
        setSlides(snapshot.slides);
        setCurrentSlideIndex(snapshot.currentSlideIndex);
        setSaveStatus('Restored the next carousel change.');
    }, [historyState]);

    const handleExportCurrent = useCallback(async () => {
        if (!slides[currentSlideIndex]) {
            return;
        }
        setIsExporting(true);
        setCanRetryExport(false);
        setLastExportAction('current');
        setExportStatus(`Exporting current slide as ${exportType.toUpperCase()}...`);
        try {
            await exportSlideFile(
                slides[currentSlideIndex],
                selectedPlatform,
                selectedFormat,
                exportType,
                project?.name?.replace(/\s+/g, '-').toLowerCase() || 'carousel',
                currentSlideIndex,
                exportQuality
            );
            setExportStatus(`Exported slide ${currentSlideIndex + 1} as ${exportType.toUpperCase()}.`);
        } catch (error) {
            setCanRetryExport(true);
            setExportStatus(
                error instanceof Error
                    ? `${error.message} You can retry the export or switch format.`
                    : 'Unable to export the current slide. You can retry the export or switch format.'
            );
        } finally {
            setIsExporting(false);
        }
    }, [currentSlideIndex, exportQuality, exportType, project?.name, selectedFormat, selectedPlatform, slides]);

    const handleExportAll = useCallback(async () => {
        if (!slides.length) {
            return;
        }
        setIsExporting(true);
        setCanRetryExport(false);
        setLastExportAction('all');
        setExportStatus(`Exporting all slides as a ${exportType.toUpperCase()} ZIP...`);
        try {
            await exportSlidesZip(
                slides,
                selectedPlatform,
                selectedFormat,
                exportType,
                project?.name?.replace(/\s+/g, '-').toLowerCase() || 'carousel',
                (current, total) => {
                    setExportStatus(`Preparing ${exportType.toUpperCase()} ZIP export: slide ${current} of ${total}.`);
                },
                exportQuality
            );
            setExportStatus(`${exportType.toUpperCase()} ZIP export completed.`);
        } catch (error) {
            setCanRetryExport(true);
            setExportStatus(
                error instanceof Error
                    ? `${error.message} You can retry the export or switch format.`
                    : 'Unable to export the ZIP file. You can retry the export or switch format.'
            );
        } finally {
            setIsExporting(false);
        }
    }, [exportQuality, exportType, project?.name, selectedFormat, selectedPlatform, slides]);

    const handleRetryExport = useCallback(() => {
        if (lastExportAction === 'current') {
            void handleExportCurrent();
            return;
        }

        if (lastExportAction === 'all') {
            void handleExportAll();
        }
    }, [handleExportAll, handleExportCurrent, lastExportAction]);

    useEffect(() => {
        if (!selectedTemplate || !slides.length) {
            return;
        }
        const nextProject = project
            ? {
                ...project,
                slides,
                template: selectedTemplate,
                platform: selectedPlatform,
                format: selectedFormat,
                seamlessStrip,
                updatedAt: new Date(),
            }
            : buildProject(selectedTemplate, slides, selectedPlatform, selectedFormat);
        setProject(nextProject);
    }, [selectedFormat, selectedPlatform, selectedTemplate, seamlessStrip, slides]);

    useEffect(() => {
        if (!selectedTemplate || !slides.length) {
            return;
        }

        if (isApplyingHistoryRef.current) {
            isApplyingHistoryRef.current = false;
            return;
        }

        const timeout = window.setTimeout(() => {
            const nextSnapshot = createHistorySnapshot(slides, currentSlideIndex);

            setHistoryState((current) => {
                const activeSnapshot = current.snapshots[current.index];
                if (activeSnapshot && getSnapshotKey(activeSnapshot) === getSnapshotKey(nextSnapshot)) {
                    return current;
                }

                const nextSnapshots = [...current.snapshots.slice(0, current.index + 1), nextSnapshot];
                const cappedSnapshots = nextSnapshots.slice(-40);

                return {
                    snapshots: cappedSnapshots,
                    index: cappedSnapshots.length - 1,
                };
            });
        }, 400);

        return () => window.clearTimeout(timeout);
    }, [createHistorySnapshot, currentSlideIndex, getSnapshotKey, selectedTemplate, slides]);

    useEffect(() => {
        if (!project) {
            return;
        }

        const timeout = window.setTimeout(() => {
            const recoverySnapshot = {
                ...project,
                slides,
                template: selectedTemplate || project.template,
                platform: selectedPlatform,
                format: selectedFormat,
                seamlessStrip,
                updatedAt: new Date(),
            };

            if (saveRecoveryProject(recoverySnapshot)) {
                setRecoveryProject(recoverySnapshot);
            } else {
                setSaveStatus('Recovery draft could not be updated in local storage.');
            }
        }, 800);

        return () => window.clearTimeout(timeout);
    }, [project, selectedFormat, selectedPlatform, selectedTemplate, seamlessStrip, slides]);

    useEffect(() => {
        if (!project) {
            return;
        }

        const interval = window.setInterval(() => {
            try {
                const nextSaved = saveProjectToStorage({
                    ...project,
                    slides,
                    template: selectedTemplate || project.template,
                    platform: selectedPlatform,
                    format: selectedFormat,
                    seamlessStrip,
                    updatedAt: new Date(),
                });
                setSavedProjects(nextSaved);
                setSaveStatus(`Autosaved locally at ${new Date().toLocaleTimeString()}.`);
            } catch (error) {
                setSaveStatus(error instanceof Error ? error.message : 'Autosave failed in this browser.');
            }
        }, 30000);

        return () => window.clearInterval(interval);
    }, [project, selectedFormat, selectedPlatform, selectedTemplate, seamlessStrip, slides]);

    if (templatesLoading) {
        return (
            <div className="flex min-h-96 items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
                    <p className="text-gray-600">Loading templates...</p>
                </div>
            </div>
        );
    }

    if (templatesError) {
        return (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6">
                <h3 className="font-medium text-red-800">Error Loading Templates</h3>
                <p className="mt-1 text-sm text-red-700">{templatesError}</p>
            </div>
        );
    }

    if (!selectedTemplate) {
        return (
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_23rem]">
                <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                            Start
                        </p>
                        <h2 className="mt-1 text-2xl font-semibold text-slate-900">Choose a template</h2>

                    </div>
                    <TemplateSelector
                        templates={templates}
                        onTemplateSelect={handleTemplateSelect}
                        selectedTemplate={selectedTemplate}
                    />
                </div>

                <aside className="space-y-4">
                    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex items-center justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                    Local projects
                                </p>
                                <h3 className="mt-1 text-xl font-semibold text-slate-900">Saved drafts</h3>
                            </div>
                            <span className="text-sm text-slate-500">
                                {filteredSavedProjects.length} of {savedProjects.length}
                            </span>
                        </div>
                        <div className="mb-4 space-y-3">
                            <label className="block">
                                <span className="sr-only">Search saved projects</span>
                                <input
                                    type="search"
                                    value={savedProjectQuery}
                                    onChange={(event) => setSavedProjectQuery(event.target.value)}
                                    placeholder="Search saved projects"
                                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700"
                                />
                            </label>
                            <label className="block">
                                <span className="sr-only">Sort saved projects</span>
                                <select
                                    value={savedProjectSort}
                                    onChange={(event) => setSavedProjectSort(event.target.value as 'recent' | 'name-asc' | 'name-desc')}
                                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
                                >
                                    <option value="recent">Recently updated</option>
                                    <option value="name-asc">Name A to Z</option>
                                    <option value="name-desc">Name Z to A</option>
                                </select>
                            </label>
                        </div>
                        {savedProjects.length === 0 ? (
                            <p className="text-sm text-slate-600">No saved carousel projects yet.</p>
                        ) : filteredSavedProjects.length === 0 ? (
                            <p className="text-sm text-slate-600">No saved projects match your search.</p>
                        ) : (
                            <div className="space-y-3">
                                {filteredSavedProjects.map((savedProject) => (
                                    <div key={savedProject.id} className="rounded-2xl border border-slate-200 p-4">
                                        <div className="flex gap-3">
                                            {savedProject.slides[0] ? (
                                                <SlideThumbnail
                                                    slide={savedProject.slides[0]}
                                                    format={savedProject.format}
                                                    alt={`${savedProject.name} preview`}
                                                    className="aspect-[4/5] w-20 shrink-0 rounded-xl border border-slate-200 object-cover"
                                                />
                                            ) : null}
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate font-semibold text-slate-900">{savedProject.name}</p>
                                                <p className="mt-1 text-sm text-slate-600">
                                                    {savedProject.platform.name} | {savedProject.format.name} | {savedProject.slides.length} slide{savedProject.slides.length !== 1 ? 's' : ''}
                                                </p>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    Updated {new Date(savedProject.updatedAt).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleLoadProject(savedProject)}
                                                className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                            >
                                                Load
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDuplicateProject(savedProject)}
                                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                            >
                                                Duplicate
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleRenameSavedProject(savedProject)}
                                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                            >
                                                Rename
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteProject(savedProject.id)}
                                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900">Project</h2>
                        <label className="mt-2 block">
                            <span className="mb-1 block text-sm font-medium text-slate-700">Project name</span>
                            <input
                                type="text"
                                value={project?.name || `${selectedTemplate.name} Carousel`}
                                onChange={(event) => handleProjectNameChange(event.target.value)}
                                className="w-full max-w-md rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700"
                            />
                        </label>
                    </div>
                    <button
                        type="button"
                        onClick={handleTemplateChange}
                        className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        Change template
                    </button>
                </div>
                <PlatformSelector
                    selectedPlatform={selectedPlatform}
                    selectedFormat={selectedFormat}
                    onPlatformChange={handlePlatformChange}
                />
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white shadow-sm">
                <CarouselEditor
                    slides={slides}
                    currentSlide={currentSlideIndex}
                    template={selectedTemplate}
                    platform={selectedPlatform}
                    format={selectedFormat}
                    seamlessStrip={seamlessStrip}
                    isApplyingSeamlessStrip={isApplyingSeamlessStrip}
                    onSlideUpdate={handleSlideUpdate}
                    onCurrentSlideChange={setCurrentSlideIndex}
                    onSlideAdd={handleSlideAdd}
                    onSlideDelete={handleSlideDelete}
                    onSlideReorder={handleSlideReorder}
                    onManualSave={handleManualSave}
                    onExportCurrent={handleExportCurrent}
                    onExportAll={handleExportAll}
                    onRetryExport={handleRetryExport}
                    onExportTypeChange={setExportType}
                    onExportQualityChange={setExportQuality}
                    onSeamlessStripUpload={handleSeamlessStripUpload}
                    onSeamlessStripChange={handleSeamlessStripChange}
                    onSeamlessStripClear={handleSeamlessStripClear}
                    onUndo={handleUndo}
                    onRedo={handleRedo}
                    canUndo={historyState.index > 0}
                    canRedo={historyState.index >= 0 && historyState.index < historyState.snapshots.length - 1}
                    canRetryExport={canRetryExport}
                    exportType={exportType}
                    exportQuality={exportQuality}
                    saveStatus={saveStatus}
                    exportStatus={exportStatus}
                    isExporting={isExporting}
                />
            </div>
        </div>
    );
};
