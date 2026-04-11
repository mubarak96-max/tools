import { NextRequest, NextResponse } from "next/server";
import { logServerError } from "@/lib/monitoring/logger";

type RateLimitEntry = {
    count: number;
    resetAt: number;
};

const ipCounts = new Map<string, RateLimitEntry>();
const LIMIT = 2; // Max 2 generations per hour per IP
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

function getClientIp(req: NextRequest) {
    return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous";
}

function checkRateLimit(ip: string) {
    const now = Date.now();
    const entry = ipCounts.get(ip);

    if (!entry || now > entry.resetAt) {
        ipCounts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
        return { limited: false, retryAfter: 0 };
    }

    if (entry.count >= LIMIT) {
        return {
            limited: true,
            retryAfter: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
        };
    }

    entry.count += 1;
    return { limited: false, retryAfter: 0 };
}

export async function POST(req: NextRequest) {
    const ip = getClientIp(req);
    const { limited, retryAfter } = checkRateLimit(ip);

    if (limited) {
        return NextResponse.json(
            { error: `Generation limit reached. Try again in ${Math.ceil(retryAfter / 60)} minutes.` },
            { status: 429, headers: { "Retry-After": String(retryAfter) } },
        );
    }

    try {
        const body = await req.json();
        const { topic, niche } = body;

        if (!topic || typeof topic !== "string") {
            return NextResponse.json({ error: "Missing or invalid topic." }, { status: 400 });
        }

        const trimmed = topic.trim();
        if (trimmed.length === 0 || trimmed.length > 200) {
            return NextResponse.json({ error: "Topic must be 1-200 characters." }, { status: 400 });
        }

        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "Service temporarily unavailable." }, { status: 503 });
        }

        const prompt = buildCarouselPrompt(trimmed, niche);

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": process.env.NEXT_PUBLIC_BASE_URL || "https://findbest.tools",
                "X-Title": "findbesttool Carousel Builder",
            },
            body: JSON.stringify({
                model: "google/gemini-2.5-flash-lite", // Cost-effective model
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7,
                max_tokens: 400, // Keep tokens low for cost control
            }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            logServerError("carousel_generate_failed", errorBody, {
                status: response.status,
            });
            return NextResponse.json(
                { error: "Generation failed. Please try again." },
                { status: 502 },
            );
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content?.trim();

        if (!content) {
            return NextResponse.json(
                { error: "No content generated. Please try again." },
                { status: 502 },
            );
        }

        // Parse JSON response
        const slides = parseCarouselResponse(content);
        if (!slides || slides.length === 0) {
            return NextResponse.json(
                { error: "Invalid response format. Please try again." },
                { status: 502 },
            );
        }

        return NextResponse.json({ slides });
    } catch (error) {
        logServerError("carousel_generate_route_failed", error, { ip });
        return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
    }
}

function buildCarouselPrompt(topic: string, niche?: string): string {
    const nicheContext = niche ? `This is for ${niche.replace('-', ' ')} content.` : '';

    return `Generate a high-performing social media carousel about "${topic}". ${nicheContext}

Rules:
- Return ONLY valid JSON array
- Max 6 slides
- Each headline max 12 words
- Strong hook on slide 1
- Clear CTA on last slide
- No emojis or special characters
- Focus on value and engagement

Format:
[
  {"headline": "Hook that grabs attention", "body": ""},
  {"headline": "Value point 1", "body": ""},
  {"headline": "Value point 2", "body": ""},
  {"headline": "Value point 3", "body": ""},
  {"headline": "Social proof or story", "body": ""},
  {"headline": "Clear call to action", "body": ""}
]`;
}

function parseCarouselResponse(content: string): Array<{ headline: string, body: string }> | null {
    try {
        // Extract JSON from response
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (!jsonMatch) return null;

        const slides = JSON.parse(jsonMatch[0]);

        // Validate structure
        if (!Array.isArray(slides) || slides.length === 0) return null;

        return slides.filter(slide =>
            slide.headline &&
            typeof slide.headline === 'string' &&
            slide.headline.length > 0
        );
    } catch (error) {
        return null;
    }
}