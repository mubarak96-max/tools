import { Palette } from '../types';

export const PALETTES: Palette[] = [
    {
        id: 'midnight',
        name: 'Midnight',
        background: 'linear-gradient(135deg, #0d1b2a 0%, #1b3a5c 100%)',
        accent: '#48bfe3',
        textPrimary: '#ffffff',
        textSecondary: 'rgba(255,255,255,0.7)'
    },
    {
        id: 'sunset',
        name: 'Sunset',
        background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
        accent: '#ffffff',
        textPrimary: '#ffffff',
        textSecondary: 'rgba(255,255,255,0.8)'
    },
    {
        id: 'forest',
        name: 'Forest',
        background: 'linear-gradient(135deg, #2d6a4f 0%, #1b4332 100%)',
        accent: '#74c69d',
        textPrimary: '#ffffff',
        textSecondary: 'rgba(255,255,255,0.7)'
    },
    {
        id: 'royal',
        name: 'Royal',
        background: 'linear-gradient(135deg, #7400b8 0%, #6930c3 100%)',
        accent: '#4cc9f0',
        textPrimary: '#ffffff',
        textSecondary: 'rgba(255,255,255,0.7)'
    },
    {
        id: 'minimal',
        name: 'Minimal',
        background: '#ffffff',
        accent: '#3B82F6',
        textPrimary: '#1F2937',
        textSecondary: '#6B7280'
    },
    {
        id: 'dark',
        name: 'Dark',
        background: '#1a1a2e',
        accent: '#e94560',
        textPrimary: '#ffffff',
        textSecondary: 'rgba(255,255,255,0.6)'
    }
];

export const getDefaultPalette = (): Palette => PALETTES[0];

export const getPaletteById = (id: string): Palette => {
    return PALETTES.find(palette => palette.id === id) || getDefaultPalette();
};