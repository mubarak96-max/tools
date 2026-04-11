import type { Category } from '../_types';

export const CATEGORIES: Category[] = [
    { id: 'business', label: 'Business & Professional', color: '#378ADD', templateTypes: ['Pitch Deck', 'Company Update', 'Report'] },
    { id: 'social', label: 'Social Media', color: '#D4537E', templateTypes: ['Quote Card', 'Tip Card', 'Announcement'] },
    { id: 'educational', label: 'Educational', color: '#1D9E75', templateTypes: ['How-to Guide', 'Tutorial', 'Fun Fact'] },
    { id: 'marketing', label: 'Marketing', color: '#EF9F27', templateTypes: ['Product Launch', 'Promotion', 'Sale'] },
    { id: 'personal', label: 'Personal', color: '#AFA9EC', templateTypes: ['Story', 'Testimonial', 'Lifestyle'] },
    { id: 'lists', label: 'Lists & Tips', color: '#5DCAA5', templateTypes: ['Step-by-Step', 'Numbered List', 'Checklist'] },
    { id: 'before_after', label: 'Before / After', color: '#F0997B', templateTypes: ['Comparison', 'Transformation', 'Split View'] },
    { id: 'statistics', label: 'Statistics', color: '#7F77DD', templateTypes: ['Infographic', 'Data Visual', 'Chart Card'] },
];