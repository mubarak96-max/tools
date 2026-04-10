import { Platform, PlatformFormat, Dimensions, Template, TemplateElement } from '../types';
import { PLATFORM_SPECS } from '../constants/platforms';

/**
 * Validate if a platform format is valid
 */
export const validatePlatformFormat = (
    platformId: string,
    formatId: string
): boolean => {
    const platform = PLATFORM_SPECS[platformId];
    if (!platform) return false;

    return platform.formats.some(format => format.id === formatId);
};

/**
 * Get optimal dimensions for a platform format
 */
export const getOptimalDimensions = (
    platform: Platform,
    format: PlatformFormat
): Dimensions => {
    return format.dimensions;
};

/**
 * Convert template elements to fit new platform dimensions
 */
export const adaptTemplateForPlatform = (
    template: Template,
    targetDimensions: Dimensions
): Template => {
    const originalDimensions = template.defaultDimensions;
    const scaleX = targetDimensions.width / originalDimensions.width;
    const scaleY = targetDimensions.height / originalDimensions.height;

    const adaptedElements: TemplateElement[] = template.elements.map(element => ({
        ...element,
        position: {
            ...element.position,
            x: Math.round(element.position.x * scaleX),
            y: Math.round(element.position.y * scaleY)
        },
        dimensions: {
            width: Math.round(element.dimensions.width * scaleX),
            height: Math.round(element.dimensions.height * scaleY)
        },
        style: {
            ...element.style,
            fontSize: element.style.fontSize
                ? Math.round(element.style.fontSize * Math.min(scaleX, scaleY))
                : element.style.fontSize
        }
    }));

    return {
        ...template,
        elements: adaptedElements,
        defaultDimensions: targetDimensions
    };
};

/**
 * Check if dimensions match platform requirements
 */
export const validateDimensionsForPlatform = (
    dimensions: Dimensions,
    platform: Platform,
    format: PlatformFormat
): boolean => {
    return (
        dimensions.width === format.dimensions.width &&
        dimensions.height === format.dimensions.height
    );
};

/**
 * Get platform-specific metadata for export
 */
export const getPlatformMetadata = (
    platform: Platform,
    format: PlatformFormat
) => {
    const metadata: Record<string, any> = {
        platform: platform.name,
        format: format.name,
        dimensions: format.dimensions,
        aspectRatio: format.aspectRatio
    };

    // Add platform-specific metadata
    switch (platform.id) {
        case 'instagram':
            metadata.colorProfile = 'sRGB';
            metadata.quality = 'high';
            metadata.compression = 'minimal';
            if (format.id === 'stories') {
                metadata.safeArea = {
                    top: 250,
                    bottom: 250
                };
            }
            break;

        case 'linkedin':
            metadata.colorProfile = 'sRGB';
            metadata.quality = 'high';
            metadata.fileSize = 'optimized';
            break;

        case 'tiktok':
            metadata.colorProfile = 'sRGB';
            metadata.quality = 'high';
            metadata.safeArea = {
                top: 200,
                bottom: 300
            };
            break;
    }

    return metadata;
};

/**
 * Get recommended file format for platform
 */
export const getRecommendedFileFormat = (platform: Platform): 'png' | 'jpg' => {
    switch (platform.id) {
        case 'instagram':
            return 'jpg'; // Instagram prefers JPEG for photos
        case 'linkedin':
            return 'png'; // LinkedIn works well with PNG for graphics
        case 'tiktok':
            return 'jpg'; // TikTok prefers JPEG
        default:
            return 'png';
    }
};

/**
 * Calculate safe zones for platform formats
 */
export const getSafeZones = (
    platform: Platform,
    format: PlatformFormat
): { top: number; bottom: number; left: number; right: number } => {
    const { width, height } = format.dimensions;

    switch (platform.id) {
        case 'instagram':
            if (format.id === 'stories') {
                return {
                    top: Math.round(height * 0.13), // ~250px for 1920px height
                    bottom: Math.round(height * 0.13),
                    left: Math.round(width * 0.05),
                    right: Math.round(width * 0.05)
                };
            }
            return { top: 0, bottom: 0, left: 0, right: 0 };

        case 'tiktok':
            return {
                top: Math.round(height * 0.1), // ~200px for 1920px height
                bottom: Math.round(height * 0.15), // ~300px for 1920px height
                left: Math.round(width * 0.05),
                right: Math.round(width * 0.05)
            };

        default:
            return { top: 0, bottom: 0, left: 0, right: 0 };
    }
};

/**
 * Get platform-specific best practices
 */
export const getPlatformBestPractices = (platform: Platform) => {
    const practices: string[] = [];

    switch (platform.id) {
        case 'instagram':
            practices.push(
                'Use high-contrast colors for better visibility',
                'Keep text large and readable on mobile',
                'Consider the Instagram feed layout',
                'Use consistent branding across slides'
            );
            break;

        case 'linkedin':
            practices.push(
                'Professional color schemes work best',
                'Include clear value propositions',
                'Use business-appropriate imagery',
                'Keep text concise and impactful'
            );
            break;

        case 'tiktok':
            practices.push(
                'Use bold, eye-catching visuals',
                'Keep important content in safe zones',
                'Consider vertical viewing experience',
                'Use trending colors and styles'
            );
            break;
    }

    return practices;
};

/**
 * Validate template compatibility with platform
 */
export const validateTemplateCompatibility = (
    template: Template,
    platform: Platform,
    format: PlatformFormat
): { compatible: boolean; issues: string[] } => {
    const issues: string[] = [];
    const safeZones = getSafeZones(platform, format);

    // Check if elements are within safe zones
    template.elements.forEach((element, index) => {
        const elementBottom = element.position.y + element.dimensions.height;
        const elementRight = element.position.x + element.dimensions.width;

        if (element.position.y < safeZones.top) {
            issues.push(`Element ${index + 1} may be cut off at the top`);
        }

        if (elementBottom > format.dimensions.height - safeZones.bottom) {
            issues.push(`Element ${index + 1} may be cut off at the bottom`);
        }

        if (element.position.x < safeZones.left) {
            issues.push(`Element ${index + 1} may be cut off on the left`);
        }

        if (elementRight > format.dimensions.width - safeZones.right) {
            issues.push(`Element ${index + 1} may be cut off on the right`);
        }

        // Check font size for readability
        if (element.type === 'text' && element.style.fontSize) {
            const minFontSize = platform.id === 'instagram' ? 24 : 18;
            if (element.style.fontSize < minFontSize) {
                issues.push(`Element ${index + 1} text may be too small for ${platform.name}`);
            }
        }
    });

    return {
        compatible: issues.length === 0,
        issues
    };
};