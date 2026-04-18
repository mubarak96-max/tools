import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import * as cheerio from 'cheerio';

const client = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const { url, platform, customInstructions } = await req.json();

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        // Fetch and parse URL content
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to fetch URL' }, { status: 400 });
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // Extract main content (remove scripts, styles, nav, footer)
        $('script, style, nav, footer, header, aside, .advertisement, .ads').remove();

        // Try to find main content
        let content = '';
        const mainSelectors = ['article', 'main', '[role="main"]', '.content', '.post-content', '.entry-content'];

        for (const selector of mainSelectors) {
            const element = $(selector).first();
            if (element.length > 0) {
                content = element.text().trim();
                break;
            }
        }

        // Fallback to body if no main content found
        if (!content) {
            content = $('body').text().trim();
        }

        // Clean up whitespace
        content = content.replace(/\s+/g, ' ').trim();

        // Limit content to avoid token limits (approximately 4000 characters)
        const truncatedContent = content.slice(0, 4000);

        if (!truncatedContent) {
            return NextResponse.json({ error: 'No content found at URL' }, { status: 400 });
        }

        const prompt = `
Convert the following website content into a 10-slide carousel for ${platform || 'LinkedIn'}.
${customInstructions ? `Additional instructions: ${customInstructions}` : ''}

Content:
${truncatedContent}

Create an engaging carousel with:
- Slide 1: Attention-grabbing hook
- Slides 2-9: Key insights from the content
- Slide 10: Clear call-to-action

Return ONLY a JSON array of 10 objects with "title" and "paragraph" fields.
    `;

        const aiResponse = await client.chat.completions.create({
            model: 'anthropic/claude-3.5-sonnet',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
        });

        const aiContent = aiResponse.choices[0].message.content || '[]';

        let slides;
        try {
            const cleanContent = aiContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            slides = JSON.parse(cleanContent);
        } catch (parseError) {
            slides = Array.from({ length: 10 }, (_, i) => ({
                title: `Slide ${i + 1}`,
                paragraph: 'Content generation in progress...'
            }));
        }

        return NextResponse.json(slides);
    } catch (error) {
        console.error('URL generation error:', error);
        return NextResponse.json(
            { error: 'Failed to generate carousel from URL' },
            { status: 500 }
        );
    }
}
