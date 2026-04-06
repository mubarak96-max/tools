import { getToolTaxonomyHints } from "@/lib/taxonomy/registry";
import type { CustomPage, Tool } from "@/types/database";

const allowedPricingModels = ["free", "freemium", "paid", "custom"] as const;
const allowedDifficultyLevels = ["beginner", "intermediate", "advanced"] as const;

export function buildToolFactsPrompt(input: {
  toolName: string;
  website?: string;
  categories: string[];
}) {
  const taxonomyHints = getToolTaxonomyHints(input.categories);

  return `You are preparing a structured software record for "${input.toolName}".

Known facts:
- Official website provided by the editor: ${input.website || "unknown"}
- Available categories: ${taxonomyHints.categories.join(", ") || "None supplied"}
- Allowed pricing_model values: ${allowedPricingModels.join(", ")}
- Allowed difficulty_level values: ${allowedDifficultyLevels.join(", ")}
- Allowed platforms: ${taxonomyHints.platforms.join(", ")}
- Allowed audiences: ${taxonomyHints.audiences.join(", ")}
- Allowed use_cases: ${taxonomyHints.useCases.join(", ")}
- Allowed team_fit values: ${taxonomyHints.teamFit.join(", ")}

Rules:
- Do not invent a category. If none fits, return an empty string for category.
- Do not invent audiences, use cases, platforms, or team_fit values. Use only approved values or return an empty array.
- Do not invent a website. Use the supplied website if present, otherwise return an empty string.
- Keep descriptions factual and concise.
- Return empty arrays or empty strings when uncertain.
- Return raw JSON only.

Return exactly this JSON shape:
{
  "slug": "",
  "category": "",
  "short_description": "",
  "pricing_model": "freemium",
  "pricing_range": "",
  "starting_price": null,
  "starting_price_currency": "",
  "billing_period": "",
  "difficulty_level": "intermediate",
  "platforms": [],
  "use_cases": [],
  "features": [],
  "integrations": [],
  "audiences": [],
  "team_fit": [],
  "setup_time": "",
  "has_free_plan": false,
  "has_free_trial": false,
  "best_for": "",
  "not_ideal_for": "",
  "website": ""
}

Pricing rules:
- Prefer the most current publicly visible pricing you know for the tool's official product.
- If pricing is unclear, outdated, enterprise-only, or you are not confident, return an empty string for pricing_range and null for starting_price.
- Use starting_price as a numeric amount only, without currency symbols.
- Use starting_price_currency as a 3-letter code such as USD, EUR, or GBP.
- Use billing_period as one of: daily, weekly, monthly, yearly, or an empty string.
- pricing_range should be concise and factual, for example:
  - "Free"
  - "Free plan, paid from $20/month"
  - "From $12/month"
  - "Custom pricing"`;
}

export function buildToolEditorialPrompt(tool: Partial<Tool>) {
  return `Write editorial copy for a software profile using these verified structured inputs:
${JSON.stringify(
    {
      name: tool.name,
      category: tool.category,
      shortDescription: tool.shortDescription,
      pricingModel: tool.pricingModel,
      pricingRange: tool.pricingRange,
      platforms: tool.platforms,
      useCases: tool.useCases,
      features: tool.features,
      integrations: tool.integrations,
      audiences: tool.audiences,
      bestFor: tool.bestFor,
      notIdealFor: tool.notIdealFor,
      website: tool.website,
    },
    null,
    2,
  )}

Rules:
- Do not contradict the structured inputs.
- Do not invent pricing, platform, or integration facts.
- Keep the tone precise and useful, not hype-heavy.
- Return raw JSON only.

Return exactly this shape:
{
  "editorial_summary": "",
  "comparison_summary": "",
  "pros": ["", "", "", "", ""],
  "cons": ["", "", ""],
  "faq": [
    { "question": "", "answer": "" },
    { "question": "", "answer": "" }
  ]
}

Additional requirements:
- Provide at least 5 distinct pros.
- Provide at least 3 distinct cons.
- FAQ should include at least 2 items.`;
}

export function buildPageEditorialPrompt(input: {
  topic: string;
  templateType: CustomPage["templateType"];
  selectedTools: Pick<Tool, "name" | "slug" | "category" | "shortDescription" | "pricingRange" | "bestFor" | "useCases">[];
}) {
  return `Write editorial blocks for a findmytool page.

Topic: ${input.topic}
Template type: ${input.templateType}
Selected tools:
${JSON.stringify(input.selectedTools, null, 2)}

Rules:
- The selected tools are already decided by the system. Do not add or remove tools.
- Do not invent prices or facts beyond the provided tool data.
- Keep each FAQ answer under 280 characters.
- Return HTML strings wrapped in <p> tags for intro and editorial_verdict.
- Return raw JSON only.

Return exactly this shape:
{
  "intro": "<p></p>",
  "editorial_verdict": "<p></p>",
  "faq": [
    { "question": "", "answer": "" },
    { "question": "", "answer": "" }
  ]
}`;
}
