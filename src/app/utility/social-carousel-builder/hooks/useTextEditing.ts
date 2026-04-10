'use client';

import { useCallback, useState } from 'react';
import { ElementStyle, TemplateElement } from '../types';

interface UseTextEditingProps {
    onElementUpdate: (elementId: string, updates: Partial<TemplateElement>) => void;
}

interface ClickPosition {
    x: number;
    y: number;
}

export const useTextEditing = ({ onElementUpdate }: UseTextEditingProps) => {
    const [editingElementId, setEditingElementId] = useState<string | null>(null);
    const [toolbarElementId, setToolbarElementId] = useState<string | null>(null);
    const [toolbarPosition, setToolbarPosition] = useState<ClickPosition | null>(null);

    const startTextEditing = useCallback((elementId: string) => {
        setEditingElementId(elementId);
        setToolbarElementId(null);
    }, []);

    const showToolbarForElement = useCallback((elementId: string, position: ClickPosition) => {
        setToolbarElementId(elementId);
        setToolbarPosition(position);
        setEditingElementId(null);
    }, []);

    const stopTextEditing = useCallback(() => {
        setEditingElementId(null);
    }, []);

    const hideToolbar = useCallback(() => {
        setToolbarElementId(null);
        setToolbarPosition(null);
    }, []);

    const stopAllTextUi = useCallback(() => {
        stopTextEditing();
        hideToolbar();
    }, [hideToolbar, stopTextEditing]);

    const updateTextContent = useCallback((elementId: string, content: string) => {
        onElementUpdate(elementId, { content });
    }, [onElementUpdate]);

    const updateTextStyle = useCallback((elementId: string, styleUpdates: Partial<ElementStyle>) => {
        onElementUpdate(elementId, {
            style: styleUpdates,
        });
    }, [onElementUpdate]);

    return {
        editingElementId,
        toolbarElementId,
        toolbarPosition,
        startTextEditing,
        showToolbarForElement,
        stopTextEditing,
        hideToolbar,
        stopAllTextUi,
        updateTextContent,
        updateTextStyle,
    };
};
