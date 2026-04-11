import { NextRequest, NextResponse } from 'next/server';

// In-memory rate limiting (resets on cold start — acceptable for this use case)
// For production, replace with Redis or Upstash
const ipCounts = new Map<string, { count: number; resetAt: number }>();
const LIMIT = 2;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

function getClientIp(req: NextRequest): string {
    return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'anonymous';
}

function checkRateLimit(ip: string): { limited: boolean; retryAfter: number } {
    const now = Date.now();
    const entry = ipCounts.get(ip);

    if (!entry || now > entry.resetAt) {
        ipCounts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
        return { limited: false, retryAfter: 0 };
    }

    if (entry.count >= LIMIT) {
        return { limited: true, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
    }

    entry.count += 1;
    return { limited: false, retryAfter: 0 };
}

function buildPrompt(topic: string, niche?: string): string {
    const nicheCtx = niche ? `This carousel is for ${niche.replace(/-/g, ' ')} content.` : '';
    return `Generate a high-performing social media carousel about "${topic}". ${nicheCtx}

Rules:
- Return ONLY a valid JSON array, no other text
- Exactly 6 slides
- Each headline: max 12 words, punchy and specific
- Slide 1: strong hook that creates curiosity or promises value
- Slides 2–5: deliver concrete value points
- Slide 6: clear call-to-action (follow, share, comment, DM)
- No emojis, no asterisks, no markdown
- body field: 1 short supporting sentence, or empty string ""

Required format (copy exactly):
[
  {"headline": "Hook headline here", "body": ""},
  {"headline": "Value point 1", "body": "One sentence supporting detail."},
  {"headline": "Value point 2", "body": "One sentence supporting detail."},
  {"headline": "Value point 3", "body": "One sentence supporting detail."},
  {"headline": "Value point 4", "body": "One sentence supporting detail."},
  {"headline": "Call to action slide", "body": ""}
]`;
}

function parseSlides(content: string): Array<{ headline: string; body: string }> | null {
    try {
        const match = content.match(/\[[\s\S]*\]/);
        if (!match) return null;
        const parsed = JSON.parse(match[0]);
        if (!Array.isArray(parsed)) return null;
        return parsed.filter(
            (s): s is { headline: string; body: string } =>
                typeof s.headline === 'string' && s.headline.length > 0
        );
    } catch {
        return null;
    }
}

export async function POST(req: NextRequest) {
    const ip = getClientIp(req);
    const { limited, retryAfter } = checkRateLimit(ip);

    if (limited) {
        return NextResponse.json(
            { error: `Generation limit reached. Try again in ${Math.ceil(retryAfter / 60)} minutes.` },
            { status: 429, headers: { 'Retry-After': String(retryAfter) } }
        );
    }

    let topic: string;
    let niche: string | undefined;

    try {
        const body = await req.json();
        topic = body.topic;
        niche = body.niche;
    } catch {
        return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0 || topic.length > 200) {
        return NextResponse.json({ error: 'Topic must be 1–200 characters.' }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: 'Service temporarily unavailable.' }, { status: 503 });
    }

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': process.env.NEXT_PUBLIC_BASE_URL ?? 'https://tools-tau-rouge.vercel.app',
                'X-Title': 'Carousel Builder',
            },
            body: JSON.stringify({
                model: 'google/gemini-2.5-flash-lite',
                messages: [{ role: 'user', content: buildPrompt(topic.trim(), niche) }],
                temperature: 0.7,
                max_tokens: 400,
            }),
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Generation failed. Please try again.' }, { status: 502 });
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content?.trim();

        if (!content) {
            return NextResponse.json({ error: 'Empty response from AI. Please try again.' }, { status: 502 });
        }

        const slides = parseSlides(content);
        if (!slides || slides.length === 0) {
            return NextResponse.json({ error: 'Could not parse response. Please try again.' }, { status: 502 });
        }

        return NextResponse.json({ slides });
    } catch {
        return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
    }
}