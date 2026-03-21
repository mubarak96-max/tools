import OpenAI from 'openai';
import { Tool, AIInsights } from '../types/database';

// Note: OpenRouter is fully compatible with the OpenAI SDK
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || '',
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:3000', // Required by OpenRouter
    'X-Title': 'findmytool',   // Required by OpenRouter
  }
});

export interface GeneratedToolResponse {
  slug: string;
  category: string;
  pricing_model: string;
  difficulty_level: string;
  price_range: string;
  description: string;
  use_cases: string[];
  features: string[];
  platforms: string[];
  why_this_tool: string;
  comparison_summary: string;
  best_for: string;
  anti_recommendation: string;
  pros: string[];
  cons: string[];
  website: string;
}

export async function generateFullTool(toolName: string, availableCategories: string[]): Promise<GeneratedToolResponse | null> {
  const prompt = `I am creating a page for the AI tool '${toolName}'.
Please provide the following structured information:

Basic Info
- Slug (URL-friendly)
- Tool category (MUST be exactly one of these if applicable: ${availableCategories.join(', ')}. If none fit perfectly, invent one.)
- Pricing model: Free | Freemium | Paid
- Difficulty level: Beginner | Intermediate | Advanced
- Price range: starting price -> highest tier
- Official Website URL (The main domain or affiliate landing page)

Description (280-350 characters, plain language, explains what the tool does and who it helps)
Use Cases (minimum 5, written as action-oriented phrases)
Key Features (minimum 5, written as short, benefit-focused bullet points)
Supported Platforms (select all that apply: Web, iOS, Android, Desktop)

Marketing Snippets
- Why This Tool — 1 punchy sentence, under 150 characters
- Comparison Summary — how it stands out vs. alternatives, under 150 characters
- Best For — describe the ideal user or use case in 1 line
- Not Recommended For — describe who should avoid it and why

Pros (minimum 5)
Cons (minimum 3)

Your response MUST be valid JSON matching exactly this structure:
{
  "slug": "",
  "category": "",
  "pricing_model": "",
  "difficulty_level": "",
  "price_range": "",
  "description": "",
  "use_cases": [],
  "features": [],
  "platforms": [],
  "why_this_tool": "",
  "comparison_summary": "",
  "best_for": "",
  "anti_recommendation": "",
  "pros": [],
  "cons": [],
  "website": ""
}
Return ONLY the JSON. No markdown formatting, no code blocks, just the raw JSON object.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'google/gemini-2.5-flash-lite',
      messages: [
        { role: 'user', content: prompt }
      ]
    });

    const content = response.choices[0]?.message?.content || '';

    // Robustly extract JSON block using regex to ignore any surrounding conversational text
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No JSON object found in response:", content);
      throw new Error("Invalid response format from AI");
    }

    return JSON.parse(jsonMatch[0]) as GeneratedToolResponse;
  } catch (error) {
    console.error(`Error generating massive insights for ${toolName} via OpenRouter:`, error);
    return null;
  }
}

export interface GeneratedPageResponse {
  slug: string;
  title: string;
  metaDescription: string;
  templateType: 'curated-list' | 'comparison' | 'alternatives';
  toolSlugs: string[];
  editorialVerdict: string;
}

export async function generateCustomPage(topic: string, templateType: 'comparison' | 'alternatives' | 'curated-list', availableTools: {slug: string, name: string, category: string}[]): Promise<GeneratedPageResponse | null> {
  const toolsContext = availableTools.map(t => `${t.name} (Slug: ${t.slug}, Category: ${t.category})`).join('\n');
  
  let instructions = "";
  if (templateType === 'comparison') {
    instructions = `This is a HEAD-TO-HEAD COMPARISON page. You MUST choose exactly 2 tools from the database to compare. Focus the SEO title, meta description, and the editorial verdict heavily on directly comparing these two tools, stating pros, cons, and who wins the matchup.`;
  } else if (templateType === 'alternatives') {
    instructions = `This is an ALTERNATIVES page. The first tool slug you select MUST be the "Target Tool" we are comparing against (the tool the user wants to leave). Select at least 1-3 other tools as alternatives. Focus the SEO title, meta description, and the editorial verdict heavily on why users are looking for alternatives to the target tool, and aggressively pitch the other selected tools as better replacements.`;
  } else if (templateType === 'curated-list') {
    instructions = `This is a CURATED LIST page (A "Best Tools for X" usecase listicle). Select the absolute best tools for this specific topic/usecase from the database. Focus the SEO title, meta description, and editorial verdict on explaining why these tools dominate this specific usecase workflow and summarize the top picks.`;
  }

  const prompt = `I am building a programmatic SEO hub. Generate a precise custom SEO page for the search query/topic: "${topic}".
  
Available Tools in Database:
${toolsContext}

CRITICAL RULES:
${instructions}

Select the relevant tool "Slugs" exclusively from the Available Tools list above that should be featured on this page based on the rules. If none strictly fit, pick the closest.
Write a powerful click-generating SEO title, a strong meta description, and a 2-to-3 paragraph editorial verdict/introduction thoroughly analyzing the topic in HTML format (use <p> and <strong>).

Your response MUST be valid JSON matching this exact structure:
{
  "slug": "url-friendly-slug-for-the-topic",
  "title": "",
  "metaDescription": "",
  "templateType": "${templateType}",
  "toolSlugs": ["slug1", "slug2"],
  "editorialVerdict": "<p>...</p>"
}
Return ONLY JSON.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'google/gemini-2.5-flash-lite', 
      messages: [{ role: 'user', content: prompt }]
    });

    const content = response.choices[0]?.message?.content || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found");
    return JSON.parse(jsonMatch[0]) as GeneratedPageResponse;
  } catch (error) {
    console.error("Error generating custom page:", error);
    return null;
  }
}

/**
 * Compatibility helper for scripts that only need the AI Insights block.
 */
export async function generateToolInsights(tool: { name: string }): Promise<AIInsights | null> {
  const profile = await generateFullTool(tool.name, []);
  if (!profile) return null;

  return {
    whyThisToolFits: profile.why_this_tool,
    pros: profile.pros,
    cons: profile.cons,
    bestFor: profile.best_for,
    antiRecommendation: profile.anti_recommendation,
    comparisonSummary: profile.comparison_summary
  };
}

