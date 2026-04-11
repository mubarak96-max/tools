'use client';

import React from 'react';
import type { Slide } from '../../_types';
import { FONTS } from '../../_data/fonts';
import { EditableText } from './EditableText';
import { IconElement } from './IconElement';
import { useEditorStore } from '../../_store/useEditorStore';

interface Props {
    slide: Slide;
    slideIndex: number;
    totalSlides: number;
    fillContainer?: boolean;
    readOnly?: boolean;
    id?: string;
}

export function SlideCanvas({ slide, slideIndex, totalSlides, fillContainer, readOnly, id }: Props) {
    const font = FONTS.find(f => f.id === slide.fontId) ?? FONTS[0];
    const textColor = slide.darkText ? '#1a1a2e' : '#ffffff';
    const subColor = slide.darkText ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.65)';

    const containerStyle: React.CSSProperties = fillContainer
        ? { width: '100%', height: '100%' }
        : { width: 340, height: 425, flexShrink: 0 };

    return (
        <div
            id={id}
            style={{ ...containerStyle, background: slide.background, borderRadius: 16, overflow: 'hidden', position: 'relative', fontFamily: font.css }}
        >
            {slide.layout === 'centered' && <CenteredLayout slide={slide} textColor={textColor} subColor={subColor} readOnly={readOnly} />}
            {slide.layout === 'left' && <LeftLayout slide={slide} textColor={textColor} subColor={subColor} readOnly={readOnly} />}
            {slide.layout === 'top_accent' && <TopAccentLayout slide={slide} textColor={textColor} subColor={subColor} readOnly={readOnly} />}
            {slide.layout === 'split' && <SplitLayout slide={slide} textColor={textColor} subColor={subColor} readOnly={readOnly} />}
            {slide.layout === 'minimal' && <MinimalLayout slide={slide} textColor={textColor} subColor={subColor} readOnly={readOnly} />}
            {slide.layout === 'bold' && <BoldLayout slide={slide} textColor={textColor} subColor={subColor} readOnly={readOnly} />}

            {slide.icons.map(icon => (
                <IconElement key={icon.id} icon={icon} readOnly={readOnly} />
            ))}

            <div style={{ position: 'absolute', bottom: 12, right: 14, fontSize: 11, color: slide.darkText ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)' }}>
                {slideIndex + 1} / {totalSlides}
            </div>
        </div>
    );
}

// ─── Layout sub-components ────────────────────────────────────────────────────

interface LayoutProps { slide: Slide; textColor: string; subColor: string; readOnly?: boolean; }

function Tag({ slide }: { slide: Slide }) {
    const onWhite = slide.accentColor === '#ffffff' || slide.accentColor.toLowerCase() === '#fff';
    return (
        <div style={{ display: 'inline-block', background: slide.accentColor, color: onWhite ? '#333' : '#fff', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', padding: '3px 12px', borderRadius: 20, marginBottom: 12 }}>
            {slide.tagText || 'SLIDE'}
        </div>
    );
}

function useTextUpdate(readOnly?: boolean) {
    const store = useEditorStore();
    if (readOnly) return { update: (_: string, __: string) => { } };
    return { update: (field: 'headline' | 'subtitle' | 'body', val: string) => store.updateSlideText(field, val) };
}

function CenteredLayout({ slide, textColor, subColor, readOnly }: LayoutProps) {
    const { update } = useTextUpdate(readOnly);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 32, textAlign: 'center' }}>
            <Tag slide={slide} />
            <EditableText value={slide.headline} style={{ fontSize: 22, fontWeight: 700, color: textColor, lineHeight: 1.2, marginBottom: 8 }} readOnly={readOnly} onCommit={v => update('headline', v)} />
            {slide.subtitle && <EditableText value={slide.subtitle} style={{ fontSize: 13, color: subColor, marginBottom: 10 }} readOnly={readOnly} onCommit={v => update('subtitle', v)} />}
            {slide.body && <EditableText value={slide.body} multiline style={{ fontSize: 12, color: subColor, lineHeight: 1.6, whiteSpace: 'pre-line' }} readOnly={readOnly} onCommit={v => update('body', v)} />}
        </div>
    );
}

function LeftLayout({ slide, textColor, subColor, readOnly }: LayoutProps) {
    const { update } = useTextUpdate(readOnly);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '32px 28px' }}>
            <Tag slide={slide} />
            <div style={{ width: 40, height: 3, borderRadius: 2, background: slide.accentColor, marginBottom: 12 }} />
            <EditableText value={slide.headline} style={{ fontSize: 20, fontWeight: 700, color: textColor, lineHeight: 1.2, marginBottom: 8 }} readOnly={readOnly} onCommit={v => update('headline', v)} />
            {slide.subtitle && <EditableText value={slide.subtitle} style={{ fontSize: 13, color: subColor, marginBottom: 10 }} readOnly={readOnly} onCommit={v => update('subtitle', v)} />}
            {slide.body && <EditableText value={slide.body} multiline style={{ fontSize: 12, color: subColor, lineHeight: 1.6, whiteSpace: 'pre-line' }} readOnly={readOnly} onCommit={v => update('body', v)} />}
        </div>
    );
}

function TopAccentLayout({ slide, textColor, subColor, readOnly }: LayoutProps) {
    const { update } = useTextUpdate(readOnly);
    return (
        <div style={{ height: '100%' }}>
            <div style={{ height: 6, background: slide.accentColor }} />
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: 'calc(100% - 6px)', padding: 28 }}>
                <Tag slide={slide} />
                <EditableText value={slide.headline} style={{ fontSize: 20, fontWeight: 700, color: textColor, lineHeight: 1.2, marginBottom: 8 }} readOnly={readOnly} onCommit={v => update('headline', v)} />
                {slide.subtitle && <EditableText value={slide.subtitle} style={{ fontSize: 13, color: subColor, marginBottom: 10 }} readOnly={readOnly} onCommit={v => update('subtitle', v)} />}
                {slide.body && <EditableText value={slide.body} multiline style={{ fontSize: 12, color: subColor, lineHeight: 1.6 }} readOnly={readOnly} onCommit={v => update('body', v)} />}
            </div>
        </div>
    );
}

function SplitLayout({ slide, textColor, subColor, readOnly }: LayoutProps) {
    const { update } = useTextUpdate(readOnly);
    const parts = slide.body.split('\n');
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 28, gap: 12, textAlign: 'center' }}>
            <Tag slide={slide} />
            <EditableText value={slide.headline} style={{ fontSize: 20, fontWeight: 700, color: textColor, lineHeight: 1.2 }} readOnly={readOnly} onCommit={v => update('headline', v)} />
            {slide.subtitle && <EditableText value={slide.subtitle} style={{ fontSize: 13, color: subColor }} readOnly={readOnly} onCommit={v => update('subtitle', v)} />}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, width: '100%', marginTop: 8 }}>
                <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: 14, fontSize: 12, color: subColor, lineHeight: 1.5 }}>{parts[0] ?? ''}</div>
                <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: 14, fontSize: 12, color: subColor, lineHeight: 1.5 }}>{parts[1] ?? ''}</div>
            </div>
        </div>
    );
}

function MinimalLayout({ slide, textColor, subColor, readOnly }: LayoutProps) {
    const { update } = useTextUpdate(readOnly);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%', padding: '28px 32px' }}>
            <div style={{ width: 32, height: 2, borderRadius: 1, background: slide.accentColor, marginBottom: 16 }} />
            <EditableText value={slide.headline} style={{ fontSize: 24, fontWeight: 700, color: textColor, lineHeight: 1.2, marginBottom: 8 }} readOnly={readOnly} onCommit={v => update('headline', v)} />
            {slide.subtitle && <EditableText value={slide.subtitle} style={{ fontSize: 13, color: subColor }} readOnly={readOnly} onCommit={v => update('subtitle', v)} />}
        </div>
    );
}

function BoldLayout({ slide, textColor, subColor, readOnly }: LayoutProps) {
    const { update } = useTextUpdate(readOnly);
    return (
        <div style={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '55%', background: slide.accentColor, opacity: 0.15 }} />
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '32px 28px', position: 'relative' }}>
                <Tag slide={slide} />
                <EditableText value={slide.headline} style={{ fontSize: 26, fontWeight: 800, color: textColor, lineHeight: 1.1, marginBottom: 10 }} readOnly={readOnly} onCommit={v => update('headline', v)} />
                {slide.subtitle && <EditableText value={slide.subtitle} style={{ fontSize: 14, color: subColor, marginBottom: 10 }} readOnly={readOnly} onCommit={v => update('subtitle', v)} />}
                {slide.body && <EditableText value={slide.body} multiline style={{ fontSize: 12, color: subColor, lineHeight: 1.6 }} readOnly={readOnly} onCommit={v => update('body', v)} />}
            </div>
        </div>
    );
}