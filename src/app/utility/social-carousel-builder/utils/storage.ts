import { CarouselProject } from '../types';

export const SOCIAL_CAROUSEL_STORAGE_KEY = 'findmytool.social-carousel-builder.projects.v1';
export const SOCIAL_CAROUSEL_RECOVERY_KEY = 'findmytool.social-carousel-builder.recovery.v1';

function reviveProject(project: any): CarouselProject {
    return {
        ...project,
        createdAt: new Date(project.createdAt),
        updatedAt: new Date(project.updatedAt),
    };
}

export const loadSavedProjects = (): CarouselProject[] => {
    if (typeof window === 'undefined') {
        return [];
    }

    try {
        const raw = window.localStorage.getItem(SOCIAL_CAROUSEL_STORAGE_KEY);
        if (!raw) {
            return [];
        }

        const parsed = JSON.parse(raw) as CarouselProject[];
        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed.map(reviveProject).sort((left, right) => right.updatedAt.getTime() - left.updatedAt.getTime());
    } catch {
        return [];
    }
};

export const saveProjectToStorage = (project: CarouselProject): CarouselProject[] => {
    if (typeof window === 'undefined') {
        return [];
    }

    try {
        const existing = loadSavedProjects().filter((item) => item.id !== project.id);
        const next = [{ ...project, updatedAt: new Date() }, ...existing]
            .sort((left, right) => right.updatedAt.getTime() - left.updatedAt.getTime())
            .slice(0, 12);

        window.localStorage.setItem(SOCIAL_CAROUSEL_STORAGE_KEY, JSON.stringify(next));
        return next;
    } catch {
        throw new Error('Browser storage is full. Delete an older saved carousel and try again.');
    }
};

export const deleteProjectFromStorage = (projectId: string): CarouselProject[] => {
    if (typeof window === 'undefined') {
        return [];
    }

    const next = loadSavedProjects().filter((item) => item.id !== projectId);
    window.localStorage.setItem(SOCIAL_CAROUSEL_STORAGE_KEY, JSON.stringify(next));
    return next;
};

export const loadRecoveryProject = (): CarouselProject | null => {
    if (typeof window === 'undefined') {
        return null;
    }

    try {
        const raw = window.localStorage.getItem(SOCIAL_CAROUSEL_RECOVERY_KEY);
        if (!raw) {
            return null;
        }

        return reviveProject(JSON.parse(raw));
    } catch {
        return null;
    }
};

export const saveRecoveryProject = (project: CarouselProject): boolean => {
    if (typeof window === 'undefined') {
        return false;
    }

    try {
        window.localStorage.setItem(
            SOCIAL_CAROUSEL_RECOVERY_KEY,
            JSON.stringify({
                ...project,
                updatedAt: new Date(),
            })
        );
        return true;
    } catch {
        return false;
    }
};

export const clearRecoveryProject = () => {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        window.localStorage.removeItem(SOCIAL_CAROUSEL_RECOVERY_KEY);
    } catch {
        // Ignore storage cleanup errors.
    }
};
