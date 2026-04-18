import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get('query');

        if (!query) {
            return NextResponse.json({ error: 'Query is required' }, { status: 400 });
        }

        const GIPHY_API_KEY = process.env.GIPHY_API_KEY || 'demo';

        const response = await fetch(
            `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(query)}&limit=20`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            throw new Error('Giphy API error');
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Giphy API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch from Giphy', data: [] },
            { status: 500 }
        );
    }
}
