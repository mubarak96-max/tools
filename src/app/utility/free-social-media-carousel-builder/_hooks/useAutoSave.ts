'use client';

import { useEffect } from 'react';
import { useEditorStore } from '../_store/useEditorStore';

export function useAutoSave(intervalMs = 3000) {
    const { slides, saveToStorage } = useEditorStore();

    // Save every N ms when slides change
    useEffect(() => {
        const timer = setTimeout(() => {
            saveToStorage();
        }, intervalMs);
        return () => clearTimeout(timer);
    }, [slides, saveToStorage, intervalMs]);

    // Also save on page unload
    useEffect(() => {
        const handler = () => saveToStorage();
        window.addEventListener('beforeunload', handler);
        return () => window.removeEventListener('beforeunload', handler);
    }, [saveToStorage]);
}