'use client';

import React from 'react';
import { Template } from '../types';

interface TemplatePreviewProps {
    template: Template;
    isHovered?: boolean;
    isSelected?: boolean;
    scale?: number;
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({
    template,
    isHovered = false,
    isSelected = false,
    scale = 0.2
}) => {
    const { defaultDimensions, elements } = template;

    // Calculate preview dimensions
    const previewWidth = defaultDimensions.width * scale;
    const previewHeight = defaultDimensions.height * scale;

    const renderElement = (element: typeof elements[0], index: number) => {
        const scaledPosition = {
            x: element.position.x * scale,
            y: element.position.y * scale
        };

        const scaledDimensions = {
            width: element.dimensions.width * scale,
            height: element.dimensions.height * scale
        };

        const baseStyle: React.CSSProperties = {
            position: 'absolute',
            left: scaledPosition.x,
            top: scaledPosition.y,
            width: scaledDimensions.width,
            height: scaledDimensions.height,
            zIndex: element.position.z,
            borderRadius: element.style.borderRadius ? (element.style.borderRadius * scale) : 0,
            opacity: element.style.opacity || 1,
        };

        switch (element.type) {
            case 'text':
                return (
                    <div
                        key={element.id}
                        style={{
                            ...baseStyle,
                            backgroundColor: element.style.backgroundColor || 'transparent',
                            color: element.style.color || '#000000',
                            fontSize: Math.max(6, (element.style.fontSize || 16) * scale),
                            fontFamily: element.style.fontFamily || 'Inter',
                            fontWeight: element.style.fontWeight || 'normal',
                            textAlign: element.style.textAlign || 'left',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: element.style.textAlign === 'center' ? 'center' :
                                element.style.textAlign === 'right' ? 'flex-end' : 'flex-start',
                            padding: '2px',
                            overflow: 'hidden',
                            lineHeight: 1.2
                        }}
                    >
                        <span className="truncate">
                            {typeof element.content === 'string' ? element.content : 'Text'}
                        </span>
                    </div>
                );

            case 'image':
                return (
                    <div
                        key={element.id}
                        style={{
                            ...baseStyle,
                            backgroundColor: '#e5e7eb',
                            backgroundImage: typeof element.content === 'object' && element.content.src
                                ? `url(${element.content.src})`
                                : undefined,
                            backgroundSize: typeof element.content === 'object'
                                ? element.content.fit || 'cover'
                                : 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {(!element.content || typeof element.content === 'string') && (
                            <svg
                                className="text-gray-400"
                                style={{ width: Math.min(scaledDimensions.width * 0.5, 20), height: Math.min(scaledDimensions.height * 0.5, 20) }}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                        )}
                    </div>
                );

            case 'shape':
                return (
                    <div
                        key={element.id}
                        style={{
                            ...baseStyle,
                            backgroundColor: element.style.backgroundColor || '#f3f4f6',
                        }}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <div className="w-full h-full flex items-center justify-center p-4">
            <div
                className={`
          relative bg-white shadow-sm border transition-all duration-200
          ${isHovered ? 'shadow-md scale-105' : ''}
          ${isSelected ? 'ring-2 ring-blue-300' : ''}
        `}
                style={{
                    width: previewWidth,
                    height: previewHeight,
                    minWidth: 120,
                    minHeight: 120,
                    maxWidth: 200,
                    maxHeight: 200
                }}
            >
                {/* Background */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundColor: '#ffffff'
                    }}
                />

                {/* Template Elements */}
                {elements.map((element, index) => renderElement(element, index))}

                {/* Overlay for better visibility */}
                <div className="absolute inset-0 pointer-events-none border border-gray-200 rounded" />
            </div>
        </div>
    );
};