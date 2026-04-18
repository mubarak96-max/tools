import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get('query');

        if (!query) {
            return NextResponse.json({ error: 'Query is required' }, { status: 400 });
        }

        const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || 'demo';

        const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=20`,
            {
                headers: {
                    Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error('Unsplash API error');
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Unsplash API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch from Unsplash', results: [] },
            { status: 500 }
        );
    }
}
