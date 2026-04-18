import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const client = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const { text, platform, customInstructions } = await req.json();

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        // Limit text to avoid token limits
        const truncatedText = text.slice(0, 4000);

        const prompt = `
Convert the following text into a 10-slide carousel for ${platform || 'LinkedIn'}.
${customInstructions ? `Additional instructions: ${customInstructions}` : ''}

Text:
${truncatedText}

Create an engaging carousel that:
- Breaks down the content into digestible slides
- Maintains the core message
- Adds engaging hooks and CTAs

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
        console.error('Text generation error:', error);
        return NextResponse.json(
            { error: 'Failed to generate carousel from text' },
            { status: 500 }
        );
    }
}
