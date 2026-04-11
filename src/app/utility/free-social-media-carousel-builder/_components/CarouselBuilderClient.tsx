'use client';

import React, { useEffect } from 'react';
import { useEditorStore } from '../_store/useEditorStore';
import { useIsMobile } from '../_hooks/useIsMobile';
import { DesktopEditor } from './desktop/DesktopEditor';
import { MobileEditor } from './mobile/MobileEditor';
import { AIInput } from './AIInput';

interface Props {
    niche?: string;
    preselectedTemplates?: string[];
    defaultTopic?: string;
}

export function CarouselBuilderClient({ niche, defaultTopic }: Props) {
    const { loadFromStorage } = useEditorStore();
    const isMobile = useIsMobile();

    // Load saved session on mount
    useEffect(() => {
        loadFromStorage();
    }, [loadFromStorage]);

    return (
        <div className="w-full">
            {/* AI Input — shown above the editor on both mobile and desktop */}
            <AIInput niche={niche} defaultTopic={defaultTopic} />
            {/* Responsive editor */}
            {isMobile ? <MobileEditor /> : <DesktopEditor />}
        </div>
    );
}