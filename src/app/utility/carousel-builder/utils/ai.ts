import { CarouselSlide, GenerateCarouselRequest, GenerateCarouselResponse } from '../types';

export async function generateCarousel(
    request: GenerateCarouselRequest
): Promise<GenerateCarouselResponse> {
    try {
        const response = await fetch('/api/carousel-generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });

        const data = await response.json();

        if (!response.ok) {
            return { slides: [], error: data.error || 'Generation failed' };
        }

        return { slides: data.slides || [] };
    } catch (error) {
        return { slides: [], error: 'Network error. Please try again.' };
    }
}

export function isRateLimited(error: string): boolean {
    return error.includes('limit reached');
}

export function getRateLimitMessage(error: string): string {
    const match = error.match(/Try again in (\d+) minutes/);
    if (match) {
        return `You've reached the generation limit. Try again in ${match[1]} minutes.`;
    }
    return 'Generation limit reached. Please try again later.';
}

export function canUseAI(aiUsage: { count: number; limit: number; resetTime: number }): boolean {
    const now = Date.now();
    if (now > aiUsage.resetTime) {
        return true; // Reset period has passed
    }
    return aiUsage.count < aiUsage.limit;
}

export function getAIUsageStatus(aiUsage: { count: number; limit: number; resetTime: number }): {
    canUse: boolean;
    remaining: number;
    resetIn: number;
} {
    const now = Date.now();
    const canUse = canUseAI(aiUsage);
    const remaining = Math.max(0, aiUsage.limit - aiUsage.count);
    const resetIn = Math.max(0, aiUsage.resetTime - now);

    return { canUse, remaining, resetIn };
}