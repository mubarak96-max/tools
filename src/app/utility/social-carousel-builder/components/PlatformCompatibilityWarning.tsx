'use client';

import React from 'react';
import { Template, Platform, PlatformFormat } from '../types';
import { validateTemplateCompatibility } from '../utils/platformUtils';

interface PlatformCompatibilityWarningProps {
    template: Template;
    platform: Platform;
    format: PlatformFormat;
}

export const PlatformCompatibilityWarning: React.FC<PlatformCompatibilityWarningProps> = ({
    template,
    platform,
    format
}) => {
    const compatibility = validateTemplateCompatibility(template, platform, format);

    if (compatibility.compatible) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-green-800 font-medium">
                        Template is compatible with {platform.name} {format.name}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
                <svg className="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                    <h4 className="text-yellow-800 font-medium mb-2">
                        Compatibility Issues Detected
                    </h4>
                    <ul className="text-yellow-700 text-sm space-y-1">
                        {compatibility.issues.map((issue, index) => (
                            <li key={index} className="flex items-start">
                                <span className="text-yellow-500 mr-2">•</span>
                                {issue}
                            </li>
                        ))}
                    </ul>
                    <p className="text-yellow-600 text-xs mt-2">
                        These issues may affect how your carousel appears on {platform.name}.
                        Consider adjusting element positions or sizes.
                    </p>
                </div>
            </div>
        </div>
    );
};