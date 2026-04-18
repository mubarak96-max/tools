import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const client = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const { topic, platform, tone, customInstructions } = await req.json();

        if (!topic) {
            return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
        }

        const prompt = `
Generate a high-authority 10-slide carousel narrative for ${platform || 'LinkedIn'} about "${topic}".
Tone: ${tone || 'Professional and engaging'}.
${customInstructions ? `Additional instructions: ${customInstructions}` : ''}

Structure:
Slide 1: The Hook (Controversial or high-benefit headline)
Slide 2: The Bridge (Why this matters now)
Slides 3-8: The Value (Actionable steps or deep insights)
Slide 9: The Summary (Key takeaway)
Slide 10: The CTA (Specific action for ${platform || 'LinkedIn'})

Return ONLY a JSON array of 10 objects with "title" and "paragraph" fields.
Example format:
[
  {"title": "Hook Title", "paragraph": "Engaging description"},
  {"title": "Why This Matters", "paragraph": "Context and relevance"},
  ...
]
    `;

        const response = await client.chat.completions.create({
            model: 'anthropic/claude-3.5-sonnet',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
        });

        const content = response.choices[0].message.content || '[]';

        // Try to parse JSON from the response
        let slides;
        try {
            // Remove markdown code blocks if present
            const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            slides = JSON.parse(cleanContent);
        } catch (parseError) {
            // If parsing fails, create a fallback structure
            slides = Array.from({ length: 10 }, (_, i) => ({
                title: `Slide ${i + 1}`,
                paragraph: 'Content generation in progress...'
            }));
        }

        return NextResponse.json(slides);
    } catch (error) {
        console.error('Topic generation error:', error);
        return NextResponse.json(
            { error: 'Failed to generate carousel from topic' },
            { status: 500 }
        );
    }
}
