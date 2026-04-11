import { Project } from '../types';

const STORAGE_KEY = 'carousel-builder-projects';
const CURRENT_PROJECT_KEY = 'carousel-builder-current';

export function saveProject(project: Project): void {
    try {
        // Save current project
        localStorage.setItem(CURRENT_PROJECT_KEY, JSON.stringify(project));

        // Update saved projects list
        const savedProjects = getSavedProjects();
        const existingIndex = savedProjects.findIndex(p => p.id === project.id);

        if (existingIndex >= 0) {
            savedProjects[existingIndex] = project;
        } else {
            savedProjects.unshift(project);
        }

        // Keep only last 5 projects
        const limitedProjects = savedProjects.slice(0, 5);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedProjects));

        console.log('Project saved to localStorage');
    } catch (error) {
        console.error('Failed to save project:', error);
    }
}

export function getSavedProjects(): Project[] {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Failed to load saved projects:', error);
        return [];
    }
}

export function getCurrentProject(): Project | null {
    try {
        const data = localStorage.getItem(CURRENT_PROJECT_KEY);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Failed to load current project:', error);
        return null;
    }
}

export function deleteProject(projectId: string): void {
    try {
        const savedProjects = getSavedProjects();
        const filteredProjects = savedProjects.filter(p => p.id !== projectId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredProjects));

        // Clear current project if it's the one being deleted
        const currentProject = getCurrentProject();
        if (currentProject?.id === projectId) {
            localStorage.removeItem(CURRENT_PROJECT_KEY);
        }

        console.log('Project deleted');
    } catch (error) {
        console.error('Failed to delete project:', error);
    }
}

export function clearAllProjects(): void {
    try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(CURRENT_PROJECT_KEY);
        console.log('All projects cleared');
    } catch (error) {
        console.error('Failed to clear projects:', error);
    }
}

export function generateProjectId(): string {
    return `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function createEmptyProject(): Project {
    return {
        id: generateProjectId(),
        slides: [
            {
                id: `slide_${Date.now()}`,
                headline: 'Your headline here',
                body: ''
            }
        ],
        templateId: '',
        paletteId: 'midnight',
        createdAt: Date.now(),
        updatedAt: Date.now()
    };
}