'use client';

import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';

export interface UseAutoSaveOptions {
    enabled?: boolean;
    interval?: number; // seconds
    onSave?: () => Promise<void>;
    onError?: (error: Error) => void;
}

export const useAutoSave = (options: UseAutoSaveOptions = {}) => {
    const {
        enabled = true,
        interval = 30,
        onSave,
        onError
    } = options;

    const project = useAppStore(state => state.project);
    const saveProject = useAppStore(state => state.saveProject);
    const addError = useAppStore(state => state.addError);

    const intervalRef = useRef<NodeJS.Timeout>();
    const lastSaveRef = useRef<Date>();
    const projectRef = useRef(project);

    // Update project ref when project changes
    useEffect(() => {
        projectRef.current = project;
    }, [project]);

    // Auto-save logic
    useEffect(() => {
        if (!enabled || !project) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            return;
        }

        const performAutoSave = async () => {
            try {
                const currentProject = projectRef.current;
                if (!currentProject) return;

                // Check if project has been modified since last save
                const lastModified = new Date(Math.max(
                    ...currentProject.slides.map(slide => slide.metadata.modifiedAt.getTime())
                ));

                if (lastSaveRef.current && lastModified <= lastSaveRef.current) {
                    return; // No changes since last save
                }

                // Perform save
                if (onSave) {
                    await onSave();
                } else {
                    await saveProject();
                }

                lastSaveRef.current = new Date();
                console.log('Auto-saved project at', lastSaveRef.current.toLocaleTimeString());

            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Auto-save failed';

                addError({
                    type: 'export',
                    message: 'Auto-save failed',
                    details: errorMessage,
                    recoverable: true
                });

                if (onError && error instanceof Error) {
                    onError(error);
                }
            }
        };

        // Set up auto-save interval
        intervalRef.current = setInterval(performAutoSave, interval * 1000);

        // Cleanup
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [enabled, interval, project, saveProject, onSave, onError, addError]);

    // Save on page unload
    useEffect(() => {
        const handleBeforeUnload = async (event: BeforeUnloadEvent) => {
            if (!project) return;

            // Check if there are unsaved changes
            const lastModified = new Date(Math.max(
                ...project.slides.map(slide => slide.metadata.modifiedAt.getTime())
            ));

            if (lastSaveRef.current && lastModified > lastSaveRef.current) {
                event.preventDefault();
                event.returnValue = 'You have unsaved changes. Are you sure you want to leave?';

                // Attempt to save
                try {
                    if (onSave) {
                        await onSave();
                    } else {
                        await saveProject();
                    }
                } catch (error) {
                    console.error('Failed to save on page unload:', error);
                }
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [project, saveProject, onSave]);

    // Manual save function
    const manualSave = async () => {
        try {
            if (onSave) {
                await onSave();
            } else {
                await saveProject();
            }
            lastSaveRef.current = new Date();
            return true;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Save failed';

            addError({
                type: 'export',
                message: 'Manual save failed',
                details: errorMessage,
                recoverable: true
            });

            if (onError && error instanceof Error) {
                onError(error);
            }
            return false;
        }
    };

    // Get save status
    const getSaveStatus = () => {
        if (!project) return 'no-project';

        const lastModified = new Date(Math.max(
            ...project.slides.map(slide => slide.metadata.modifiedAt.getTime())
        ));

        if (!lastSaveRef.current) return 'never-saved';
        if (lastModified > lastSaveRef.current) return 'unsaved-changes';
        return 'saved';
    };

    return {
        manualSave,
        getSaveStatus,
        lastSave: lastSaveRef.current,
        isAutoSaveEnabled: enabled && !!project
    };
};