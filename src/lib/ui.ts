export function getWorkflowStatusTone(status?: string) {
  switch ((status ?? "").toLowerCase()) {
    case "published":
      return "border-success/20 bg-success-soft text-success-soft-foreground";
    case "review":
      return "border-warning/20 bg-warning-soft text-warning-soft-foreground";
    case "draft":
    default:
      return "border-border/90 bg-muted text-muted-foreground";
  }
}

export function getPricingTone(pricingModel?: string | null, pricing?: string | null) {
  const value = `${pricingModel ?? ""} ${pricing ?? ""}`.toLowerCase();

  if (value.includes("free") || value.includes("freemium")) {
    return "border-success/20 bg-success-soft text-success-soft-foreground";
  }

  if (value.includes("enterprise") || value.includes("contact") || value.includes("custom")) {
    return "border-warning/20 bg-warning-soft text-warning-soft-foreground";
  }

  return "border-border/90 bg-muted text-slate-700";
}

export function getComparisonScoreTone(score: number) {
  if (score >= 10) {
    return "border-success/20 bg-success-soft text-success-soft-foreground";
  }

  if (score >= 6) {
    return "border-primary/20 bg-primary-soft text-primary-soft-foreground";
  }

  return "border-warning/20 bg-warning-soft text-warning-soft-foreground";
}

export function getConfidenceTone(value?: number | null) {
  if (value === null || value === undefined) {
    return "border-border/90 bg-muted text-muted-foreground";
  }

  if (value >= 80) {
    return "border-success/20 bg-success-soft text-success-soft-foreground";
  }

  if (value >= 60) {
    return "border-primary/20 bg-primary-soft text-primary-soft-foreground";
  }

  if (value >= 40) {
    return "border-warning/20 bg-warning-soft text-warning-soft-foreground";
  }

  return "border-destructive/20 bg-danger-soft text-danger-soft-foreground";
}
