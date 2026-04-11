'use client';

import React from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    variant?: 'default' | 'filled';
}

export const Input: React.FC<InputProps> = ({
    className,
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    variant = 'default',
    id,
    ...props
}) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-neutral-700 mb-2"
                >
                    {label}
                </label>
            )}

            <div className="relative">
                {leftIcon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-neutral-400">{leftIcon}</span>
                    </div>
                )}

                <input
                    id={inputId}
                    className={cn(
                        'premium-input',
                        leftIcon && 'pl-10',
                        rightIcon && 'pr-10',
                        error && 'border-error-500 focus:border-error-500 focus:ring-error-100',
                        variant === 'filled' && 'bg-neutral-50',
                        className
                    )}
                    {...props}
                />

                {rightIcon && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-neutral-400">{rightIcon}</span>
                    </div>
                )}
            </div>

            {error && (
                <p className="mt-2 text-sm text-error-600" role="alert">
                    {error}
                </p>
            )}

            {helperText && !error && (
                <p className="mt-2 text-sm text-neutral-500">
                    {helperText}
                </p>
            )}
        </div>
    );
};