import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get('query');

        if (!query) {
            return NextResponse.json({ error: 'Query is required' }, { status: 400 });
        }

        const PEXELS_API_KEY = process.env.PEXELS_API_KEY || 'demo';

        const response = await fetch(
            `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=20`,
            {
                headers: {
                    Authorization: PEXELS_API_KEY,
                },
            }
        );

        if (!response.ok) {
            throw new Error('Pexels API error');
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Pexels API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch from Pexels', photos: [] },
            { status: 500 }
        );
    }
}
