export interface CtrInput {
  impressions: number;
  clicks: number;
}

export interface CtrResult {
  ctrPercent: number;
  clicksPerThousandImpressions: number;
}

function normalize(value: number) {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

export function calculateCtr(input: CtrInput): CtrResult {
  const impressions = normalize(input.impressions);
  const clicks = normalize(input.clicks);

  if (impressions <= 0) {
    return {
      ctrPercent: 0,
      clicksPerThousandImpressions: 0,
    };
  }

  return {
    ctrPercent: (clicks / impressions) * 100,
    clicksPerThousandImpressions: (clicks / impressions) * 1000,
  };
}

export function calculateClicksForTargetCtr(impressions: number, targetCtrPercent: number) {
  const safeImpressions = normalize(impressions);
  const safeTargetCtrPercent = normalize(targetCtrPercent);

  return safeImpressions * (safeTargetCtrPercent / 100);
}
