'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PremiumElement, ElementStyle } from '../../types/premium';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

interface RichTextEditorProps {
    element: PremiumElement;
    scale: number;
    onSave: (content: string, style?: Partial<ElementStyle>) => void;
    onClose: () => void;
    className?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
    element,
    scale,
    onSave,
    onClose,
    className
}) => {
    const [content, setContent] = useState(typeof element.content === 'string' ? element.content : '');
    const [style, setStyle] = useState<ElementStyle>(element.style);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [isOverflowing, setIsOverflowing] = useState(false);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.select();
        }
    }, []);

    const handleContentChange = useCallback((newContent: string) => {
        setContent(newContent);

        // Check for overflow
        if (textareaRef.current) {
            const textarea = textareaRef.current;
            setIsOverflowing(textarea.scrollHeight > textarea.clientHeight);
        }
    }, []);

    const handleStyleChange = useCallback((updates: Partial<ElementStyle>) => {
        setStyle(prev => ({ ...prev, ...updates }));
    }, []);

    const handleSave = useCallback(() => {
        onSave(content, style);
    }, [content, style, onSave]);

    const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
        if (event.key === 'Escape') {
            onClose();
        } else if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            handleSave();
        }
    }, [onClose, handleSave]);

    const editorStyle = {
        position: 'absolute' as const,
        left: element.position.x * scale,
        top: element.position.y * scale,
        width: element.dimensions.width * scale,
        height: element.dimensions.height * scale,
        fontSize: (style.fontSize || 16) * scale,
        fontFamily: style.fontFamily || 'Inter, sans-serif',
        fontWeight: style.fontWeight || 'normal',
        color: style.color || '#000000',
        textAlign: style.textAlign || 'left',
        lineHeight: style.lineHeight || 1.2,
        letterSpacing: style.letterSpacing || 0,
        backgroundColor: style.backgroundColor || 'transparent',
        borderRadius: style.borderRadius || 0,
        padding: 12 * scale,
        zIndex: 1000
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-50"
                onClick={onClose}
            />

            {/* Editor */}
            <div className={cn('fixed z-50', className)} style={editorStyle}>
                <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => handleContentChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full h-full resize-none border-2 border-primary-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200"
                    style={{
                        fontSize: 'inherit',
                        fontFamily: 'inherit',
                        fontWeight: 'inherit',
                        color: 'inherit',
                        textAlign: 'inherit',
                        lineHeight: 'inherit',
                        letterSpacing: 'inherit',
                        backgroundColor: 'inherit',
                        padding: 'inherit'
                    }}
                    placeholder="Enter your text..."
                />

                {/* Overflow warning */}
                {isOverflowing && (
                    <div className="absolute -top-8 left-0 bg-warning-500 text-white text-xs px-2 py-1 rounded">
                        Text overflow detected
                    </div>
                )}

                {/* Controls */}
                <div className="absolute -bottom-12 left-0 flex gap-2">
                    <Button size="sm" onClick={handleSave}>
                        Save
                    </Button>
                    <Button size="sm" variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                </div>
            </div>

            {/* Formatting Toolbar */}
            <TextFormattingToolbar
                style={style}
                onStyleChange={handleStyleChange}
                position={{
                    x: element.position.x * scale,
                    y: (element.position.y - 60) * scale
                }}
            />
        </>
    );
};

interface TextFormattingToolbarProps {
    style: ElementStyle;
    onStyleChange: (updates: Partial<ElementStyle>) => void;
    position: { x: number; y: number };
}

const TextFormattingToolbar: React.FC<TextFormattingToolbarProps> = ({
    style,
    onStyleChange,
    position
}) => {
    return (
        <div
            className="fixed z-50 bg-white rounded-lg shadow-lg border p-2 flex items-center gap-2"
            style={{
                left: position.x,
                top: position.y
            }}
        >
            {/* Font Size */}
            <input
                type="number"
                value={style.fontSize || 16}
                onChange={(e) => onStyleChange({ fontSize: parseInt(e.target.value) || 16 })}
                className="w-16 px-2 py-1 text-sm border rounded"
                min="8"
                max="200"
            />

            {/* Bold */}
            <Button
                size="sm"
                variant={style.fontWeight === 'bold' ? 'primary' : 'ghost'}
                onClick={() => onStyleChange({
                    fontWeight: style.fontWeight === 'bold' ? 'normal' : 'bold'
                })}
            >
                <strong>B</strong>
            </Button>

            {/* Italic */}
            <Button
                size="sm"
                variant={style.fontStyle === 'italic' ? 'primary' : 'ghost'}
                onClick={() => onStyleChange({
                    fontStyle: style.fontStyle === 'italic' ? 'normal' : 'italic'
                })}
            >
                <em>I</em>
            </Button>

            {/* Text Align */}
            <div className="flex border rounded overflow-hidden">
                {(['left', 'center', 'right'] as const).map((align) => (
                    <Button
                        key={align}
                        size="sm"
                        variant={style.textAlign === align ? 'primary' : 'ghost'}
                        onClick={() => onStyleChange({ textAlign: align })}
                        className="rounded-none border-0"
                    >
                        {align === 'left' && '←'}
                        {align === 'center' && '↔'}
                        {align === 'right' && '→'}
                    </Button>
                ))}
            </div>

            {/* Text Color */}
            <input
                type="color"
                value={style.color || '#000000'}
                onChange={(e) => onStyleChange({ color: e.target.value })}
                className="w-8 h-8 border rounded cursor-pointer"
                title="Text Color"
            />

            {/* Background Color */}
            <input
                type="color"
                value={style.backgroundColor || '#ffffff'}
                onChange={(e) => onStyleChange({ backgroundColor: e.target.value })}
                className="w-8 h-8 border rounded cursor-pointer"
                title="Background Color"
            />
        </div>
    );
};