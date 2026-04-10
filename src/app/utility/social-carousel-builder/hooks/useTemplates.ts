'use client';

import { useState, useEffect, useCallback } from 'react';
import { Template } from '../types';
import { DEFAULT_TEMPLATES } from '../constants/templates';
import { validateTemplate } from '../utils/templateUtils';

interface UseTemplatesReturn {
    templates: Template[];
    loading: boolean;
    error: string | null;
    selectedTemplate: Template | null;
    selectTemplate: (template: Template) => void;
    clearSelection: () => void;
    refreshTemplates: () => void;
    getTemplateById: (id: string) => Template | undefined;
    validateSelectedTemplate: () => { valid: boolean; errors: string[] };
}

export const useTemplates = (): UseTemplatesReturn => {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

    // Load templates
    const loadTemplates = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Simulate async loading (in real app, this might fetch from API)
            await new Promise(resolve => setTimeout(resolve, 100));

            // Validate all templates
            const validatedTemplates: Template[] = [];
            const validationErrors: string[] = [];

            DEFAULT_TEMPLATES.forEach((template, index) => {
                const validation = validateTemplate(template);
                if (validation.valid) {
                    validatedTemplates.push(template);
                } else {
                    validationErrors.push(`Template ${index + 1} (${template.name}): ${validation.errors.join(', ')}`);
                }
            });

            if (validationErrors.length > 0) {
                console.warn('Template validation errors:', validationErrors);
            }

            setTemplates(validatedTemplates);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load templates');
        } finally {
            setLoading(false);
        }
    }, []);

    // Initialize templates on mount
    useEffect(() => {
        loadTemplates();
    }, [loadTemplates]);

    // Select template
    const selectTemplate = useCallback((template: Template) => {
        const validation = validateTemplate(template);
        if (!validation.valid) {
            setError(`Invalid template: ${validation.errors.join(', ')}`);
            return;
        }

        setSelectedTemplate(template);
        setError(null);
    }, []);

    // Clear selection
    const clearSelection = useCallback(() => {
        setSelectedTemplate(null);
        setError(null);
    }, []);

    // Refresh templates
    const refreshTemplates = useCallback(() => {
        loadTemplates();
    }, [loadTemplates]);

    // Get template by ID
    const getTemplateById = useCallback((id: string): Template | undefined => {
        return templates.find(template => template.id === id);
    }, [templates]);

    // Validate selected template
    const validateSelectedTemplate = useCallback(() => {
        if (!selectedTemplate) {
            return { valid: false, errors: ['No template selected'] };
        }
        return validateTemplate(selectedTemplate);
    }, [selectedTemplate]);

    return {
        templates,
        loading,
        error,
        selectedTemplate,
        selectTemplate,
        clearSelection,
        refreshTemplates,
        getTemplateById,
        validateSelectedTemplate
    };
};