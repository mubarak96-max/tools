'use client';

import React from 'react';
import { cn } from '../../utils/cn';

export interface PanelProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    subtitle?: string;
    headerActions?: React.ReactNode;
    collapsible?: boolean;
    collapsed?: boolean;
    onToggleCollapse?: () => void;
    variant?: 'default' | 'elevated' | 'bordered';
}

export const Panel: React.FC<PanelProps> = ({
    children,
    className,
    title,
    subtitle,
    headerActions,
    collapsible = false,
    collapsed = false,
    onToggleCollapse,
    variant = 'default'
}) => {
    const panelVariants = {
        default: 'premium-panel',
        elevated: 'premium-panel shadow-lg',
        bordered: 'premium-panel border-2'
    };

    return (
        <div className={cn(panelVariants[variant], className)}>
            {(title || subtitle || headerActions || collapsible) && (
                <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                        {title && (
                            <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                                {title}
                            </h3>
                        )}
                        {subtitle && (
                            <p className="text-sm text-neutral-600">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                        {headerActions}

                        {collapsible && (
                            <button
                                onClick={onToggleCollapse}
                                className="p-1 rounded-md hover:bg-neutral-100 transition-colors"
                                aria-label={collapsed ? 'Expand panel' : 'Collapse panel'}
                            >
                                <svg
                                    className={cn(
                                        'w-5 h-5 text-neutral-500 transition-transform',
                                        collapsed && 'rotate-180'
                                    )}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            )}

            <div
                className={cn(
                    'transition-all duration-300 ease-in-out',
                    collapsed && 'hidden'
                )}
            >
                {children}
            </div>
        </div>
    );
};