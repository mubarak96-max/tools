import OpenAI from "openai";

import { logServerError } from "@/lib/monitoring/logger";
import type { AIInsights } from "@/types/database";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || "",
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
  "X-Title": "findbesttool",
  },
});

export async function requestStructuredObject<T>(prompt: string): Promise<T | null> {
  try {
    const response = await openai.chat.completions.create({
      model: "google/gemini-2.5-flash-lite",
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.choices[0]?.message?.content || "";
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("No JSON object found in model response.");
    }

    return JSON.parse(jsonMatch[0]) as T;
  } catch (error) {
    logServerError("openrouter_structured_request_failed", error, {
      model: "google/gemini-2.5-flash-lite",
    });
    return null;
  }
}

type LegacyToolInsightsResponse = {
  why_this_tool: string;
  comparison_summary: string;
  best_for: string;
  anti_recommendation: string;
  pros: string[];
  cons: string[];
};

export async function generateToolInsights(tool: { name: string }): Promise<AIInsights | null> {
  const prompt = `Write concise editorial insights for the software tool "${tool.name}".

Return ONLY valid JSON in exactly this shape:
{
  "why_this_tool": "",
  "comparison_summary": "",
  "best_for": "",
  "anti_recommendation": "",
  "pros": ["", ""],
  "cons": ["", ""]
}

Rules:
- Do not invent pricing, platform, or integration facts.
- Keep each string under 160 characters.
- Provide 3 to 5 pros and 2 to 4 cons.
- Return raw JSON only.`;

  const profile = await requestStructuredObject<LegacyToolInsightsResponse>(prompt);
  if (!profile) {
    return null;
  }

  return {
    whyThisToolFits: profile.why_this_tool,
    pros: profile.pros || [],
    cons: profile.cons || [],
    bestFor: profile.best_for,
    antiRecommendation: profile.anti_recommendation,
    comparisonSummary: profile.comparison_summary,
  };
}
