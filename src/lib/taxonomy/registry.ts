import type { CustomPage, RecordStatus, Tool } from "@/types/database";

import { slugify } from "@/lib/slug";
import { compactText } from "@/lib/text";

type ControlledToolTaxonomyField = "category" | "audiences" | "useCases" | "platforms" | "teamFit";
type ControlledPageTaxonomyField = "category" | "audience" | "useCase";

export type TaxonomyIssue = {
  field: ControlledToolTaxonomyField | ControlledPageTaxonomyField;
  value: string;
  message: string;
};

const approvedAudienceValues = [
  "Developers",
  "Designers",
  "Marketers",
  "Sales Teams",
  "Support Teams",
  "Product Teams",
  "Operations Teams",
  "Founders",
  "Small Businesses",
  "Agencies",
  "Enterprise Teams",
  "Freelancers",
] as const;

const approvedUseCaseValues = [
  "Note Taking",
  "Project Management",
  "Knowledge Management",
  "AI Writing",
  "Design Collaboration",
  "Meeting Notes",
  "Automation",
  "CRM",
  "Email Marketing",
  "Customer Support",
  "Analytics",
  "Scheduling",
  "Social Media Management",
  "Video Editing",
  "Website Building",
  "Accounting",
  "Recruiting",
  "Sales Outreach",
  "Document Signing",
  "Screen Recording",
  "Code Generation",
  "Team Chat",
  "Forms and Surveys",
  "Presentation Design",
  "Database Management",
  "Workflow Documentation",
  "Task Tracking",
  "Customer Feedback",
  "SEO Research",
  "Content Planning",
] as const;

const approvedPlatformValues = [
  "Web",
  "iOS",
  "Android",
  "Windows",
  "macOS",
  "Linux",
  "API",
  "Chrome Extension",
  "Desktop App",
  "Slack",
] as const;

const approvedTeamFitValues = [
  "Solo Creator",
  "Freelancer",
  "Startup Team",
  "Small Business",
  "Agency",
  "Product Team",
  "Engineering Team",
  "Marketing Team",
  "Sales Team",
  "Support Team",
  "Operations Team",
  "Enterprise",
] as const;

type AllowedValueOptions = {
  values: readonly string[];
  invalidLabel: string;
};

function normalizeInput(value: string) {
  return compactText(value);
}

function buildAliasMap(values: readonly string[]) {
  const entries = new Map<string, string>();

  for (const value of values) {
    const normalized = normalizeInput(value);
    entries.set(normalized.toLowerCase(), normalized);
    entries.set(slugify(normalized), normalized);
  }

  return entries;
}

function canonicalizeAllowedValue(value: string | undefined, values: readonly string[]) {
  const normalized = normalizeInput(value || "");
  if (!normalized) {
    return null;
  }

  const aliases = buildAliasMap(values);
  return aliases.get(normalized.toLowerCase()) ?? aliases.get(slugify(normalized)) ?? null;
}

function normalizeStringList(values: string[] | undefined) {
  return Array.from(
    new Map(
      (values || [])
        .map((value) => normalizeInput(value))
        .filter(Boolean)
        .map((value) => [value.toLowerCase(), value]),
    ).values(),
  );
}

function inspectControlledList(
  field: ControlledToolTaxonomyField | ControlledPageTaxonomyField,
  values: string[] | undefined,
  options: AllowedValueOptions,
) {
  const normalized = normalizeStringList(values);
  const canonicalized = normalized.map(
    (value) => canonicalizeAllowedValue(value, options.values) ?? value,
  );
  const invalid = normalized.filter((value) => !canonicalizeAllowedValue(value, options.values));

  return {
    values: Array.from(
      new Map(canonicalized.map((value) => [slugify(value), value])).values(),
    ),
    issues: invalid.map<TaxonomyIssue>((value) => ({
      field,
      value,
      message: `${options.invalidLabel}: ${value}`,
    })),
  };
}

function inspectControlledValue(
  field: ControlledToolTaxonomyField | ControlledPageTaxonomyField,
  value: string | undefined,
  options: AllowedValueOptions,
) {
  const normalized = normalizeInput(value || "");
  if (!normalized) {
    return { value: "", issues: [] as TaxonomyIssue[] };
  }

  const canonicalized = canonicalizeAllowedValue(normalized, options.values);
  if (canonicalized) {
    return { value: canonicalized, issues: [] as TaxonomyIssue[] };
  }

  return {
    value: normalized,
    issues: [
      {
        field,
        value: normalized,
        message: `${options.invalidLabel}: ${normalized}`,
      },
    ],
  };
}

function applyReviewDowngrade(status: RecordStatus | undefined, issues: TaxonomyIssue[]) {
  if (status === "published" && issues.length > 0) {
    return "review" as const;
  }

  return status;
}

export function getToolTaxonomyHints(categories: string[] = []) {
  return {
    categories: normalizeStringList(categories),
    audiences: [...approvedAudienceValues],
    useCases: [...approvedUseCaseValues],
    platforms: [...approvedPlatformValues],
    teamFit: [...approvedTeamFitValues],
  };
}

export function inspectToolTaxonomy(
  tool: Partial<Pick<Tool, "category" | "audiences" | "useCases" | "platforms" | "teamFit">>,
  options?: {
    approvedCategories?: string[];
  },
) {
  const categoryValues = normalizeStringList(options?.approvedCategories);
  const category = categoryValues.length
    ? inspectControlledValue("category", tool.category, {
        values: categoryValues,
        invalidLabel: "Unapproved category",
      })
    : { value: normalizeInput(tool.category || ""), issues: [] as TaxonomyIssue[] };
  const audiences = inspectControlledList("audiences", tool.audiences, {
    values: approvedAudienceValues,
    invalidLabel: "Unknown audience",
  });
  const useCases = inspectControlledList("useCases", tool.useCases, {
    values: approvedUseCaseValues,
    invalidLabel: "Unknown use case",
  });
  const platforms = inspectControlledList("platforms", tool.platforms, {
    values: approvedPlatformValues,
    invalidLabel: "Unknown platform",
  });
  const teamFit = inspectControlledList("teamFit", tool.teamFit, {
    values: approvedTeamFitValues,
    invalidLabel: "Unknown team fit",
  });

  return {
    issues: [
      ...category.issues,
      ...audiences.issues,
      ...useCases.issues,
      ...platforms.issues,
      ...teamFit.issues,
    ],
    data: {
      ...tool,
      category: category.value,
      audiences: audiences.values,
      useCases: useCases.values,
      platforms: platforms.values,
      teamFit: teamFit.values,
    },
  };
}

export function enforceToolTaxonomy(
  tool: Partial<Tool>,
  options?: {
    approvedCategories?: string[];
  },
) {
  const inspected = inspectToolTaxonomy(tool, options);

  return {
    issues: inspected.issues,
    data: {
      ...tool,
      ...inspected.data,
      status: applyReviewDowngrade(tool.status, inspected.issues),
    },
  };
}

export function inspectPageTaxonomy(
  page: Partial<Pick<CustomPage, "category" | "audience" | "useCase">>,
  options?: {
    approvedCategories?: string[];
  },
) {
  const categoryValues = normalizeStringList(options?.approvedCategories);
  const category = categoryValues.length
    ? inspectControlledValue("category", page.category, {
        values: categoryValues,
        invalidLabel: "Unapproved page category",
      })
    : { value: normalizeInput(page.category || ""), issues: [] as TaxonomyIssue[] };
  const audience = inspectControlledValue("audience", page.audience, {
    values: approvedAudienceValues,
    invalidLabel: "Unknown audience",
  });
  const useCase = inspectControlledValue("useCase", page.useCase, {
    values: approvedUseCaseValues,
    invalidLabel: "Unknown use case",
  });

  return {
    issues: [...category.issues, ...audience.issues, ...useCase.issues],
    data: {
      ...page,
      category: category.value,
      audience: audience.value,
      useCase: useCase.value,
    },
  };
}

export function enforcePageTaxonomy(
  page: Partial<CustomPage>,
  options?: {
    approvedCategories?: string[];
  },
) {
  const inspected = inspectPageTaxonomy(page, options);

  return {
    issues: inspected.issues,
    data: {
      ...page,
      ...inspected.data,
      status: applyReviewDowngrade(page.status, inspected.issues),
    },
  };
}
