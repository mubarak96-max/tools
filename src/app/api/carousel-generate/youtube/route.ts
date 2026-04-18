import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { YoutubeTranscript } from 'youtube-transcript';

const client = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const { youtubeUrl, platform, customInstructions } = await req.json();

        if (!youtubeUrl) {
            return NextResponse.json({ error: 'YouTube URL is required' }, { status: 400 });
        }

        // Extract video ID from URL
        const videoIdMatch = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
        const videoId = videoIdMatch?.[1];

        if (!videoId) {
            return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
        }

        // Fetch transcript
        let transcript;
        try {
            transcript = await YoutubeTranscript.fetchTranscript(videoId);
        } catch (transcriptError) {
            return NextResponse.json(
                { error: 'Failed to fetch YouTube transcript. The video may not have captions available.' },
                { status: 400 }
            );
        }

        const fullTranscript = transcript.map((t: any) => t.text).join(' ');

        // Truncate if too long
        const truncatedTranscript = fullTranscript.slice(0, 4000);

        const prompt = `
Convert the following YouTube video transcript into a 10-slide carousel for ${platform || 'LinkedIn'}.
${customInstructions ? `Additional instructions: ${customInstructions}` : ''}

Transcript:
${truncatedTranscript}

Create an engaging carousel that:
- Captures the key points from the video
- Uses engaging language
- Includes a strong CTA

Return ONLY a JSON array of 10 objects with "title" and "paragraph" fields.
    `;

        const response = await client.chat.completions.create({
            model: 'anthropic/claude-3.5-sonnet',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
        });

        const content = response.choices[0].message.content || '[]';

        let slides;
        try {
            const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            slides = JSON.parse(cleanContent);
        } catch (parseError) {
            slides = Array.from({ length: 10 }, (_, i) => ({
                title: `Slide ${i + 1}`,
                paragraph: 'Content generation in progress...'
            }));
        }

        return NextResponse.json(slides);
    } catch (error) {
        console.error('YouTube generation error:', error);
        return NextResponse.json(
            { error: 'Failed to generate carousel from YouTube video' },
            { status: 500 }
        );
    }
}
