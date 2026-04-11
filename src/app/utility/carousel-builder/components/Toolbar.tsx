'use client';

import React from 'react';
import { useEditorStore } from '../store/useEditorStore';

export const Toolbar: React.FC = () => {
    const { slides, isExporting, setExporting, createNewProject, saveProject } = useEditorStore();

    const handleExportPNG = async () => {
        if (isExporting) return;

        setExporting(true);

        try {
            // Simple export implementation - will be enhanced later
            const canvas = document.createElement('canvas');
            canvas.width = 1080;
            canvas.height = 1350;
            const ctx = canvas.getContext('2d');

            if (ctx) {
                ctx.fillStyle = '#3B82F6';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#FFFFFF';
                ctx.font = 'bold 48px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('Export feature coming soon!', canvas.width / 2, canvas.height / 2);

                // Download the image
                const link = document.createElement('a');
                link.download = 'carousel-slide.png';
                link.href = canvas.toDataURL();
                link.click();
            }
        } catch (error) {
            console.error('Export failed:', error);
        } finally {
            setExporting(false);
        }
    };

    const handleNewProject = () => {
        if (confirm('Start a new project? Your current work will be saved.')) {
            saveProject();
            createNewProject();
        }
    };

    return (
        <div className="flex items-center gap-3">
            {/* Save Button */}
            <button
                onClick={saveProject}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
                Save
            </button>

            {/* New Project Button */}
            <button
                onClick={handleNewProject}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
                New
            </button>

            {/* Export Button */}
            <button
                onClick={handleExportPNG}
                disabled={isExporting || slides.length === 0}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
                {isExporting ? 'Exporting...' : 'Export PNG'}
            </button>

            {/* Slide Count */}
            <div className="text-sm text-gray-500 ml-2">
                {slides.length} slide{slides.length !== 1 ? 's' : ''}
            </div>
        </div>
    );
};