import {
    validatePlatformFormat,
    adaptTemplateForPlatform,
    validateDimensionsForPlatform,
    getPlatformMetadata,
    getRecommendedFileFormat,
    getSafeZones,
    validateTemplateCompatibility
} from '../utils/platformUtils';
import { PLATFORM_SPECS } from '../constants/platforms';
import { Template, Platform, PlatformFormat } from '../types';

describe('Platform Utils', () => {
    const mockTemplate: Template = {
        id: 'test-template',
        name: 'Test Template',
        category: 'Test',
        thumbnail: '/test.png',
        defaultDimensions: { width: 1080, height: 1080 },
        elements: [
            {
                id: 'text1',
                type: 'text',
                position: { x: 100, y: 100, z: 1 },
                dimensions: { width: 880, height: 100 },
                style: { fontSize: 24, color: '#000000' },
                content: 'Test text',
                constraints: { allowResize: true, allowMove: true }
            }
        ]
    };

    const instagramPlatform = PLATFORM_SPECS.instagram;
    const squareFormat = instagramPlatform.formats.find(f => f.id === 'square')!;
    const storiesFormat = instagramPlatform.formats.find(f => f.id === 'stories')!;

    describe('validatePlatformFormat', () => {
        it('should validate correct platform and format combinations', () => {
            expect(validatePlatformFormat('instagram', 'square')).toBe(true);
            expect(validatePlatformFormat('instagram', 'portrait')).toBe(true);
            expect(validatePlatformFormat('instagram', 'stories')).toBe(true);
            expect(validatePlatformFormat('linkedin', 'standard')).toBe(true);
            expect(validatePlatformFormat('tiktok', 'vertical')).toBe(true);
        });

        it('should reject invalid platform and format combinations', () => {
            expect(validatePlatformFormat('instagram', 'invalid')).toBe(false);
            expect(validatePlatformFormat('invalid', 'square')).toBe(false);
            expect(validatePlatformFormat('linkedin', 'stories')).toBe(false);
        });
    });

    describe('adaptTemplateForPlatform', () => {
        it('should scale template elements to new dimensions', () => {
            const targetDimensions = { width: 1080, height: 1350 }; // 3:4 format
            const adaptedTemplate = adaptTemplateForPlatform(mockTemplate, targetDimensions);

            expect(adaptedTemplate.defaultDimensions).toEqual(targetDimensions);
            expect(adaptedTemplate.elements[0].position.y).toBe(125); // 100 * 1.25 scale
            expect(adaptedTemplate.elements[0].dimensions.height).toBe(125); // 100 * 1.25 scale
        });

        it('should scale font sizes proportionally', () => {
            const targetDimensions = { width: 540, height: 540 }; // Half size
            const adaptedTemplate = adaptTemplateForPlatform(mockTemplate, targetDimensions);

            expect(adaptedTemplate.elements[0].style.fontSize).toBe(12); // 24 * 0.5 scale
        });
    });

    describe('validateDimensionsForPlatform', () => {
        it('should validate correct dimensions for platform format', () => {
            const result = validateDimensionsForPlatform(
                { width: 1080, height: 1080 },
                instagramPlatform,
                squareFormat
            );
            expect(result).toBe(true);
        });

        it('should reject incorrect dimensions for platform format', () => {
            const result = validateDimensionsForPlatform(
                { width: 1080, height: 1350 },
                instagramPlatform,
                squareFormat
            );
            expect(result).toBe(false);
        });
    });

    describe('getPlatformMetadata', () => {
        it('should return correct metadata for Instagram', () => {
            const metadata = getPlatformMetadata(instagramPlatform, squareFormat);

            expect(metadata.platform).toBe('Instagram');
            expect(metadata.colorProfile).toBe('sRGB');
            expect(metadata.quality).toBe('high');
            expect(metadata.compression).toBe('minimal');
        });

        it('should include safe area for Instagram stories', () => {
            const metadata = getPlatformMetadata(instagramPlatform, storiesFormat);

            expect(metadata.safeArea).toBeDefined();
            expect(metadata.safeArea.top).toBe(250);
            expect(metadata.safeArea.bottom).toBe(250);
        });
    });

    describe('getRecommendedFileFormat', () => {
        it('should return correct file formats for each platform', () => {
            expect(getRecommendedFileFormat(PLATFORM_SPECS.instagram)).toBe('jpg');
            expect(getRecommendedFileFormat(PLATFORM_SPECS.linkedin)).toBe('png');
            expect(getRecommendedFileFormat(PLATFORM_SPECS.tiktok)).toBe('jpg');
        });
    });

    describe('getSafeZones', () => {
        it('should return safe zones for Instagram stories', () => {
            const safeZones = getSafeZones(instagramPlatform, storiesFormat);

            expect(safeZones.top).toBeGreaterThan(0);
            expect(safeZones.bottom).toBeGreaterThan(0);
            expect(safeZones.left).toBeGreaterThan(0);
            expect(safeZones.right).toBeGreaterThan(0);
        });

        it('should return no safe zones for Instagram square format', () => {
            const safeZones = getSafeZones(instagramPlatform, squareFormat);

            expect(safeZones.top).toBe(0);
            expect(safeZones.bottom).toBe(0);
            expect(safeZones.left).toBe(0);
            expect(safeZones.right).toBe(0);
        });
    });

    describe('validateTemplateCompatibility', () => {
        it('should validate compatible template', () => {
            const result = validateTemplateCompatibility(
                mockTemplate,
                instagramPlatform,
                squareFormat
            );

            expect(result.compatible).toBe(true);
            expect(result.issues).toHaveLength(0);
        });

        it('should detect elements outside safe zones', () => {
            const templateWithIssues: Template = {
                ...mockTemplate,
                elements: [
                    {
                        ...mockTemplate.elements[0],
                        position: { x: 50, y: 50, z: 1 }, // Too close to top for stories format
                        style: { ...mockTemplate.elements[0].style, fontSize: 12 } // Too small font
                    }
                ]
            };

            const result = validateTemplateCompatibility(
                templateWithIssues,
                instagramPlatform,
                storiesFormat
            );

            expect(result.compatible).toBe(false);
            expect(result.issues.length).toBeGreaterThan(0);
        });
    });
});