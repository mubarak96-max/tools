'use client';

import React from 'react';
import { cn } from '../../utils/cn';

export interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    clickable?: boolean;
    selected?: boolean;
    variant?: 'default' | 'elevated' | 'outlined';
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
    children,
    className,
    hover = false,
    clickable = false,
    selected = false,
    variant = 'default',
    padding = 'md'
}) => {
    const cardVariants = {
        default: 'premium-card',
        elevated: 'premium-card shadow-lg',
        outlined: 'premium-card border-2'
    };

    const paddingVariants = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8'
    };

    return (
        <div
            className={cn(
                cardVariants[variant],
                paddingVariants[padding],
                hover && 'hover:shadow-md hover:border-neutral-300',
                clickable && 'cursor-pointer',
                selected && 'border-primary-500 ring-2 ring-primary-100',
                className
            )}
        >
            {children}
        </div>
    );
};