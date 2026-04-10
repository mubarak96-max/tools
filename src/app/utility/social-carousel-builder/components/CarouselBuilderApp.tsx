'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CarouselProject, Platform, PlatformFormat, Slide, Template } from '../types';
import { getAllPlatforms } from '../constants/platforms';
import { createSlideFromTemplate, generateId, reorderSlides } from '../utils';
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
    const isApplyingHistoryRef = useRef(false);

    const buildProject = (template: Template, currentSlides: Slide[], platform: Platform, format: PlatformFormat): CarouselProject => ({
        id: project?.id || generateId(),
        name: `${template.name} Carousel`,
        slides: currentSlides,
        template,
        platform,
        format,
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

    useEffect(() => {
        setSavedProjects(loadSavedProjects());
        setRecoveryProject(loadRecoveryProject());
    }, []);

    const handleTemplateSelect = (template: Template) => {
        const adaptedTemplate = adaptTemplateForPlatform(template, selectedFormat.dimensions);
        const initialSlide = createSlideFromTemplate(adaptedTemplate);
        const nextProject = buildProject(adaptedTemplate, [initialSlide], selectedPlatform, selectedFormat);
        selectTemplate(adaptedTemplate);
        setSlides([initialSlide]);
        setCurrentSlideIndex(0);
        setProject(nextProject);
        setRecoveryProject(nextProject);
        seedHistory([initialSlide], 0);
        setSaveStatus('Project created. Save it manually or wait for autosave.');
    };

    const handlePlatformChange = (platform: Platform, format: PlatformFormat) => {
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
        const nextProject = project
            ? {
                ...project,
                template: adaptedTemplate,
                platform,
                format,
                slides: nextSlides,
                updatedAt: new Date(),
            }
            : buildProject(adaptedTemplate, nextSlides, platform, format);

        selectTemplate(adaptedTemplate);
        setSlides(nextSlides);
        setCurrentSlideIndex((current) => Math.min(current, nextSlides.length - 1));
        setProject(nextProject);
        setRecoveryProject(nextProject);
        seedHistory(nextSlides, Math.min(currentSlideIndex, nextSlides.length - 1));
        setSaveStatus('Platform updated. Save to keep this version.');
    };

    const handleSlideUpdate = (slideIndex: number, updatedSlide: Slide) => {
        setSlides((currentSlides) => {
            const nextSlides = [...currentSlides];
            nextSlides[slideIndex] = updatedSlide;
            return nextSlides;
        });
    };

    const handleSlideAdd = () => {
        if (!selectedTemplate || slides.length >= 10) {
            return;
        }
        const nextSlide = createSlideFromTemplate(selectedTemplate);
        setSlides((currentSlides) => {
            const nextSlides = [...currentSlides, nextSlide];
            return nextSlides;
        });
        setCurrentSlideIndex(slides.length);
    };

    const handleSlideDelete = (slideIndex: number) => {
        if (slides.length <= 1) {
            return;
        }
        setSlides((currentSlides) => currentSlides.filter((_, index) => index !== slideIndex));
        setCurrentSlideIndex((current) => {
            if (current > slideIndex) {
                return current - 1;
            }
            return Math.min(current, slides.length - 2);
        });
    };

    const handleSlideReorder = (fromIndex: number, toIndex: number) => {
        if (fromIndex === toIndex) {
            return;
        }
        setSlides((currentSlides) => reorderSlides(currentSlides, fromIndex, toIndex));
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

    const handleExportCurrent = async () => {
        if (!slides[currentSlideIndex]) {
            return;
        }
        setIsExporting(true);
        setExportStatus('Exporting current slide...');
        try {
            await exportSlideFile(
                slides[currentSlideIndex],
                selectedPlatform,
                selectedFormat,
                'png',
                project?.name?.replace(/\s+/g, '-').toLowerCase() || 'carousel',
                currentSlideIndex
            );
            setExportStatus(`Exported slide ${currentSlideIndex + 1}.`);
        } catch (error) {
            setExportStatus(error instanceof Error ? error.message : 'Unable to export the current slide.');
        } finally {
            setIsExporting(false);
        }
    };

    const handleExportAll = async () => {
        if (!slides.length) {
            return;
        }
        setIsExporting(true);
        setExportStatus('Exporting all slides as ZIP...');
        try {
            await exportSlidesZip(
                slides,
                selectedPlatform,
                selectedFormat,
                'png',
                project?.name?.replace(/\s+/g, '-').toLowerCase() || 'carousel'
            );
            setExportStatus('ZIP export completed.');
        } catch (error) {
            setExportStatus(error instanceof Error ? error.message : 'Unable to export the ZIP file.');
        } finally {
            setIsExporting(false);
        }
    };

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
                updatedAt: new Date(),
            }
            : buildProject(selectedTemplate, slides, selectedPlatform, selectedFormat);
        setProject(nextProject);
    }, [selectedFormat, selectedPlatform, selectedTemplate, slides]);

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
                updatedAt: new Date(),
            };

            if (saveRecoveryProject(recoverySnapshot)) {
                setRecoveryProject(recoverySnapshot);
            } else {
                setSaveStatus('Recovery draft could not be updated in local storage.');
            }
        }, 800);

        return () => window.clearTimeout(timeout);
    }, [project, selectedFormat, selectedPlatform, selectedTemplate, slides]);

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
                    updatedAt: new Date(),
                });
                setSavedProjects(nextSaved);
                setSaveStatus(`Autosaved locally at ${new Date().toLocaleTimeString()}.`);
            } catch (error) {
                setSaveStatus(error instanceof Error ? error.message : 'Autosave failed in this browser.');
            }
        }, 30000);

        return () => window.clearInterval(interval);
    }, [project, selectedFormat, selectedPlatform, selectedTemplate, slides]);

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
            <div className="space-y-8">
                {recoveryProject ? (
                    <div className="rounded-3xl border border-cyan-200 bg-[linear-gradient(135deg,_#ecfeff,_#f8fafc)] p-6 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                                    Session recovery
                                </p>
                                <h2 className="mt-1 text-2xl font-semibold text-slate-900">
                                    Resume your latest carousel draft
                                </h2>
                                <p className="mt-2 max-w-2xl text-sm text-slate-600">
                                    {recoveryProject.name} was last updated on {new Date(recoveryProject.updatedAt).toLocaleString()}.
                                    Open it to continue editing or clear the recovery snapshot from this browser.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={handleResumeRecovery}
                                    className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
                                >
                                    Resume draft
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDismissRecovery}
                                    className="rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-white"
                                >
                                    Clear recovery
                                </button>
                            </div>
                        </div>
                    </div>
                ) : null}
                <div className="rounded-lg bg-white p-6 shadow-sm">
                    <h2 className="mb-6 text-2xl font-semibold text-gray-900">Choose a Template</h2>
                    <TemplateSelector
                        templates={templates}
                        onTemplateSelect={handleTemplateSelect}
                        selectedTemplate={selectedTemplate}
                    />
                </div>
                <div className="rounded-lg bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between gap-4">
                        <h3 className="text-xl font-semibold text-gray-900">Saved projects</h3>

                    </div>
                    {savedProjects.length === 0 ? (
                        <p className="text-sm text-gray-600">No saved carousel projects yet.</p>
                    ) : (
                        <div className="grid gap-3 md:grid-cols-2">
                            {savedProjects.map((savedProject) => (
                                <div key={savedProject.id} className="rounded-lg border border-gray-200 p-4">
                                    <p className="font-semibold text-gray-900">{savedProject.name}</p>
                                    <p className="mt-1 text-sm text-gray-600">
                                        {savedProject.platform.name} | {savedProject.format.name} | {savedProject.slides.length} slide{savedProject.slides.length !== 1 ? 's' : ''}
                                    </p>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Updated {new Date(savedProject.updatedAt).toLocaleString()}
                                    </p>
                                    <div className="mt-4 flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleLoadProject(savedProject)}
                                            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                        >
                                            Load
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
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Platform and format</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Current project: {project?.name || `${selectedTemplate.name} Carousel`}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleTemplateChange}
                        className="font-medium text-blue-600 hover:text-blue-800"
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

            <div className="rounded-lg bg-white shadow-sm">
                <CarouselEditor
                    slides={slides}
                    currentSlide={currentSlideIndex}
                    template={selectedTemplate}
                    platform={selectedPlatform}
                    format={selectedFormat}
                    onSlideUpdate={handleSlideUpdate}
                    onCurrentSlideChange={setCurrentSlideIndex}
                    onSlideAdd={handleSlideAdd}
                    onSlideDelete={handleSlideDelete}
                    onSlideReorder={handleSlideReorder}
                    onManualSave={handleManualSave}
                    onExportCurrent={handleExportCurrent}
                    onExportAll={handleExportAll}
                    onUndo={handleUndo}
                    onRedo={handleRedo}
                    canUndo={historyState.index > 0}
                    canRedo={historyState.index >= 0 && historyState.index < historyState.snapshots.length - 1}
                    saveStatus={saveStatus}
                    exportStatus={exportStatus}
                    isExporting={isExporting}
                />
            </div>
        </div>
    );
};
