'use client';

import { useEffect, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';

export interface KeyboardShortcut {
    key: string;
    ctrlKey?: boolean;
    metaKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
    action: () => void;
    description: string;
    category: 'file' | 'edit' | 'view' | 'canvas' | 'element';
    preventDefault?: boolean;
}

export const useKeyboardShortcuts = (enabled: boolean = true) => {
    const {
        project,
        undo,
        redo,
        saveProject,
        addSlide,
        duplicateSlide,
        deleteSlide,
        selectedElements,
        selectedSlide,
        deleteElement,
        duplicateElement,
        clearSelection,
        setCanvasZoom,
        canvasZoom,
        toggleGrid,
        toggleRulers,
        toggleGuides,
        createProject,
        closeProject
    } = useAppStore();

    const shortcuts: KeyboardShortcut[] = [
        // File operations
        {
            key: 'n',
            ctrlKey: true,
            action: () => createProject('New Project'),
            description: 'New Project',
            category: 'file'
        },
        {
            key: 's',
            ctrlKey: true,
            action: () => saveProject(),
            description: 'Save Project',
            category: 'file'
        },
        {
            key: 'w',
            ctrlKey: true,
            action: () => closeProject(),
            description: 'Close Project',
            category: 'file'
        },

        // Edit operations
        {
            key: 'z',
            ctrlKey: true,
            action: () => undo(),
            description: 'Undo',
            category: 'edit'
        },
        {
            key: 'z',
            ctrlKey: true,
            shiftKey: true,
            action: () => redo(),
            description: 'Redo',
            category: 'edit'
        },
        {
            key: 'y',
            ctrlKey: true,
            action: () => redo(),
            description: 'Redo',
            category: 'edit'
        },
        {
            key: 'd',
            ctrlKey: true,
            action: () => {
                if (selectedElements.length > 0) {
                    selectedElements.forEach(elementId => duplicateElement(elementId));
                } else if (selectedSlide) {
                    duplicateSlide(selectedSlide);
                }
            },
            description: 'Duplicate',
            category: 'edit'
        },
        {
            key: 'Delete',
            action: () => {
                if (selectedElements.length > 0) {
                    selectedElements.forEach(elementId => deleteElement(elementId));
                } else if (selectedSlide && project && project.slides.length > 1) {
                    deleteSlide(selectedSlide);
                }
            },
            description: 'Delete',
            category: 'edit'
        },
        {
            key: 'Backspace',
            action: () => {
                if (selectedElements.length > 0) {
                    selectedElements.forEach(elementId => deleteElement(elementId));
                }
            },
            description: 'Delete Element',
            category: 'edit'
        },
        {
            key: 'Escape',
            action: () => clearSelection(),
            description: 'Clear Selection',
            category: 'edit'
        },

        // Canvas operations
        {
            key: '0',
            ctrlKey: true,
            action: () => setCanvasZoom(1),
            description: 'Zoom to 100%',
            category: 'canvas'
        },
        {
            key: '=',
            ctrlKey: true,
            action: () => setCanvasZoom(canvasZoom * 1.2),
            description: 'Zoom In',
            category: 'canvas'
        },
        {
            key: '-',
            ctrlKey: true,
            action: () => setCanvasZoom(canvasZoom / 1.2),
            description: 'Zoom Out',
            category: 'canvas'
        },

        // View operations
        {
            key: 'g',
            ctrlKey: true,
            action: () => toggleGrid(),
            description: 'Toggle Grid',
            category: 'view'
        },
        {
            key: 'r',
            ctrlKey: true,
            action: () => toggleRulers(),
            description: 'Toggle Rulers',
            category: 'view'
        },
        {
            key: ';',
            ctrlKey: true,
            action: () => toggleGuides(),
            description: 'Toggle Guides',
            category: 'view'
        },

        // Slide operations
        {
            key: 'Enter',
            ctrlKey: true,
            action: () => addSlide(),
            description: 'Add New Slide',
            category: 'element'
        }
    ];

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (!enabled) return;

        // Don't trigger shortcuts when typing in inputs
        const target = event.target as HTMLElement;
        if (
            target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.contentEditable === 'true' ||
            target.isContentEditable
        ) {
            return;
        }

        const matchingShortcut = shortcuts.find(shortcut => {
            const keyMatches = shortcut.key.toLowerCase() === event.key.toLowerCase();
            const ctrlMatches = !!shortcut.ctrlKey === (event.ctrlKey || event.metaKey);
            const shiftMatches = !!shortcut.shiftKey === event.shiftKey;
            const altMatches = !!shortcut.altKey === event.altKey;

            return keyMatches && ctrlMatches && shiftMatches && altMatches;
        });

        if (matchingShortcut) {
            if (matchingShortcut.preventDefault !== false) {
                event.preventDefault();
            }
            matchingShortcut.action();
        }
    }, [enabled, shortcuts, selectedElements, selectedSlide, project, canvasZoom]);

    useEffect(() => {
        if (enabled) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [enabled, handleKeyDown]);

    // Group shortcuts by category for display
    const getShortcutsByCategory = () => {
        const categories: Record<string, KeyboardShortcut[]> = {};

        shortcuts.forEach(shortcut => {
            if (!categories[shortcut.category]) {
                categories[shortcut.category] = [];
            }
            categories[shortcut.category].push(shortcut);
        });

        return categories;
    };

    // Format shortcut for display
    const formatShortcut = (shortcut: KeyboardShortcut) => {
        const parts: string[] = [];

        if (shortcut.ctrlKey || shortcut.metaKey) {
            parts.push(navigator.platform.includes('Mac') ? '⌘' : 'Ctrl');
        }
        if (shortcut.shiftKey) {
            parts.push('Shift');
        }
        if (shortcut.altKey) {
            parts.push(navigator.platform.includes('Mac') ? '⌥' : 'Alt');
        }

        parts.push(shortcut.key.toUpperCase());

        return parts.join(' + ');
    };

    return {
        shortcuts,
        getShortcutsByCategory,
        formatShortcut,
        enabled
    };
};