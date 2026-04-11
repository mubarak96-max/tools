'use client';

import React from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { deleteProject } from '../utils/storage';

export const SavedProjects: React.FC = () => {
    const { savedProjects, loadProject, loadSavedProjects } = useEditorStore();

    const handleDeleteProject = (projectId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Delete this project? This action cannot be undone.')) {
            deleteProject(projectId);
            loadSavedProjects();
        }
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (savedProjects.length === 0) {
        return null;
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Your Previous Carousels</h3>
                <p className="text-sm text-gray-600">Continue working on your saved projects</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {savedProjects.map((project) => (
                    <div
                        key={project.id}
                        onClick={() => loadProject(project)}
                        className="cursor-pointer rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all group"
                    >
                        {/* Project Preview */}
                        <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-lg p-4 flex items-center justify-center relative">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-600 mb-1">
                                    {project.slides.length}
                                </div>
                                <div className="text-xs text-gray-500">slides</div>
                            </div>

                            {/* Delete Button */}
                            <button
                                onClick={(e) => handleDeleteProject(project.id, e)}
                                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 flex items-center justify-center"
                            >
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>

                        {/* Project Info */}
                        <div className="p-3">
                            <div className="font-medium text-gray-900 text-sm mb-1 truncate">
                                {project.slides[0]?.headline || 'Untitled Project'}
                            </div>
                            <div className="text-xs text-gray-500">
                                {formatDate(project.updatedAt)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};