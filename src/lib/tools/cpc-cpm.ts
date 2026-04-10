export interface CpcInput {
  spend: number;
  clicks: number;
}

export interface CpmInput {
  spend: number;
  impressions: number;
}

function normalize(value: number) {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

export function calculateCpc(input: CpcInput) {
  const spend = normalize(input.spend);
  const clicks = normalize(input.clicks);

  return clicks > 0 ? spend / clicks : 0;
}

export function calculateCpm(input: CpmInput) {
  const spend = normalize(input.spend);
  const impressions = normalize(input.impressions);

  return impressions > 0 ? (spend / impressions) * 1000 : 0;
}

export function estimateSpendFromCpc(cpc: number, clicks: number) {
  return normalize(cpc) * normalize(clicks);
}

export function estimateSpendFromCpm(cpm: number, impressions: number) {
  return (normalize(cpm) * normalize(impressions)) / 1000;
}
