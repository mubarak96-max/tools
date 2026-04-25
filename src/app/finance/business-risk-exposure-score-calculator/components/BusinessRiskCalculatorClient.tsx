"use client";

import React, { useState, useMemo } from "react";
import {
  Shield,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Building2,
  DollarSign,
  Lock,
  Scale,
  Globe,
  HardHat,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

type IndustryKey =
  | "saas"
  | "professional"
  | "retail"
  | "healthcare"
  | "construction"
  | "manufacturing"
  | "hospitality"
  | "transportation"
  | "realEstate"
  | "other";

interface RiskAnswers {
  // Operational (0-20)
  supplyChainDiversity: number; // 1-5
  processDocumentation: number; // 1-5
  keyPersonDependency: number; // 1-5 (reversed)
  businessContinuity: number; // 1-5
  // Financial (0-20)
  cashReserves: number; // 1-5
  revenueConcentration: number; // 1-5 (reversed)
  debtLevel: number; // 1-5 (reversed)
  profitStability: number; // 1-5
  // Cyber (0-15)
  mfaEnabled: number; // 1-5
  backupFrequency: number; // 1-5
  securityTraining: number; // 1-5
  // Legal (0-15)
  writtenContracts: number; // 1-5
  complianceStatus: number; // 1-5
  ipProtection: number; // 1-5
  // Market (0-10)
  competitiveIntensity: number; // 1-5 (reversed)
  productDiversification: number; // 1-5
  // Physical (0-10)
  safetyTraining: number; // 1-5
  incidentHistory: number; // 1-5 (reversed)
  // Reputational (0-10)
  reviewRating: number; // 1-5
  crisisResponse: number; // 1-5
  complaintResolution: number; // 1-5
}

const initialAnswers: RiskAnswers = {
  supplyChainDiversity: 3,
  processDocumentation: 3,
  keyPersonDependency: 3,
  businessContinuity: 2,
  cashReserves: 3,
  revenueConcentration: 3,
  debtLevel: 3,
  profitStability: 3,
  mfaEnabled: 2,
  backupFrequency: 2,
  securityTraining: 2,
  writtenContracts: 3,
  complianceStatus: 3,
  ipProtection: 2,
  competitiveIntensity: 3,
  productDiversification: 3,
  safetyTraining: 3,
  incidentHistory: 3,
  reviewRating: 4,
  crisisResponse: 2,
  complaintResolution: 3,
};

const INDUSTRIES: Record<IndustryKey, { label: string; weights: Record<string, number> }> = {
  saas: {
    label: "SaaS / Technology",
    weights: { operational: 0.15, financial: 0.15, cyber: 0.22, legal: 0.15, market: 0.18, physical: 0.05, reputational: 0.10 },
  },
  professional: {
    label: "Professional Services",
    weights: { operational: 0.18, financial: 0.15, cyber: 0.15, legal: 0.18, market: 0.12, physical: 0.07, reputational: 0.15 },
  },
  retail: {
    label: "Retail / E-commerce",
    weights: { operational: 0.15, financial: 0.18, cyber: 0.15, legal: 0.10, market: 0.18, physical: 0.12, reputational: 0.12 },
  },
  healthcare: {
    label: "Healthcare / Medical",
    weights: { operational: 0.12, financial: 0.12, cyber: 0.18, legal: 0.22, market: 0.10, physical: 0.13, reputational: 0.13 },
  },
  construction: {
    label: "Construction / Trades",
    weights: { operational: 0.15, financial: 0.18, cyber: 0.05, legal: 0.15, market: 0.12, physical: 0.25, reputational: 0.10 },
  },
  manufacturing: {
    label: "Manufacturing",
    weights: { operational: 0.20, financial: 0.15, cyber: 0.08, legal: 0.12, market: 0.15, physical: 0.20, reputational: 0.10 },
  },
  hospitality: {
    label: "Hospitality / Restaurants",
    weights: { operational: 0.15, financial: 0.18, cyber: 0.08, legal: 0.12, market: 0.15, physical: 0.20, reputational: 0.12 },
  },
  transportation: {
    label: "Transportation / Logistics",
    weights: { operational: 0.18, financial: 0.15, cyber: 0.08, legal: 0.18, market: 0.12, physical: 0.20, reputational: 0.09 },
  },
  realEstate: {
    label: "Real Estate",
    weights: { operational: 0.12, financial: 0.22, cyber: 0.08, legal: 0.18, market: 0.20, physical: 0.10, reputational: 0.10 },
  },
  other: {
    label: "Other / General",
    weights: { operational: 0.15, financial: 0.15, cyber: 0.13, legal: 0.13, market: 0.14, physical: 0.15, reputational: 0.15 },
  },
};

const CATEGORY_CONFIG = {
  operational: { label: "Operational", icon: Building2, color: "#3b82f6", max: 20 },
  financial: { label: "Financial", icon: DollarSign, color: "#10b981", max: 20 },
  cyber: { label: "Cyber / Security", icon: Lock, color: "#ef4444", max: 15 },
  legal: { label: "Legal / Compliance", icon: Scale, color: "#f59e0b", max: 15 },
  market: { label: "Market / Competitive", icon: Globe, color: "#8b5cf6", max: 10 },
  physical: { label: "Physical / Safety", icon: HardHat, color: "#06b6d4", max: 10 },
  reputational: { label: "Reputational", icon: MessageSquare, color: "#ec4899", max: 10 },
};

function getRiskLevel(score: number) {
  if (score <= 30) return { label: "Low Risk", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", desc: "Strong controls. Continue current practices." };
  if (score <= 50) return { label: "Moderate Risk", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", desc: "Manageable gaps. Monitor and address proactively." };
  if (score <= 70) return { label: "High Risk", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", desc: "Significant vulnerabilities. 90-day mitigation plan needed." };
  return { label: "Critical Risk", color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", desc: "Severe exposure. Immediate intervention required." };
}

function getRecommendations(category: string, score: number): string[] {
  const recs: Record<string, Record<string, string[]>> = {
    operational: {
      high: [
        "Diversify to at least 2 suppliers for every critical input",
        "Document all core processes in writing with SOPs",
        "Cross-train employees on critical functions immediately",
        "Develop a formal business continuity plan",
      ],
      medium: [
        "Add a secondary supplier for your top 3 inputs",
        "Document onboarding and training procedures",
        "Create a succession plan for key roles",
      ],
      low: [
        "Review and update business continuity plan annually",
        "Maintain supplier diversification strategy",
      ],
    },
    financial: {
      high: [
        "Build cash reserves to cover 3+ months of operating expenses",
        "Reduce customer concentration — no client over 20% of revenue",
        "Renegotiate debt terms or seek refinancing",
        "Implement stricter accounts receivable collection policies",
      ],
      medium: [
        "Increase cash reserves by 10% over next quarter",
        "Expand customer base to reduce concentration",
        "Review debt service coverage ratio monthly",
      ],
      low: [
        "Maintain current cash reserve levels",
        "Explore growth financing from position of strength",
      ],
    },
    cyber: {
      high: [
        "Enable multi-factor authentication on all business accounts immediately",
        "Implement automated daily encrypted backups",
        "Conduct mandatory phishing awareness training for all staff",
        "Engage a cybersecurity firm for vulnerability assessment",
      ],
      medium: [
        "Enable MFA on email and financial accounts",
        "Set up weekly automated backups",
        "Create an incident response plan",
      ],
      low: [
        "Conduct annual penetration testing",
        "Keep security training current",
        "Review backup restoration procedures quarterly",
      ],
    },
    legal: {
      high: [
        "Convert all verbal agreements to written contracts",
        "Conduct compliance audit for all required licenses and permits",
        "Register trademarks and protect intellectual property",
        "Review employment law compliance with attorney",
      ],
      medium: [
        "Template written contracts for common engagements",
        "Create compliance checklist and calendar",
        "File trademark applications for key brands",
      ],
      low: [
        "Annual contract template review with legal counsel",
        "Monitor regulatory changes in your industry",
      ],
    },
    market: {
      high: [
        "Differentiate products/services to reduce commoditization",
        "Expand into adjacent markets or customer segments",
        "Develop recurring revenue streams to reduce volatility",
        "Build switching costs into customer relationships",
      ],
      medium: [
        "Conduct competitive analysis quarterly",
        "Test pricing power with small increases",
        "Add complementary products or services",
      ],
      low: [
        "Monitor emerging competitors",
        "Maintain innovation pipeline",
      ],
    },
    physical: {
      high: [
        "Implement formal safety training program with documentation",
        "Conduct workplace hazard assessment",
        "Review and upgrade property insurance coverage",
        "Create emergency evacuation and response plans",
      ],
      medium: [
        "Schedule monthly safety inspections",
        "Maintain OSHA-compliant injury logs",
        "Update property and equipment maintenance schedules",
      ],
      low: [
        "Continue safety training refreshers",
        "Annual property risk assessment",
      ],
    },
    reputational: {
      high: [
        "Implement reputation monitoring tools for brand mentions",
        "Create social media crisis response playbook",
        "Establish formal customer complaint resolution SLA",
        "Engage reputation management consultant",
      ],
      medium: [
        "Set up Google Alerts for brand and executive names",
        "Document complaint escalation procedures",
        "Respond to all reviews within 24 hours",
      ],
      low: [
        "Maintain review response practices",
        "Quarterly brand sentiment analysis",
      ],
    },
  };

  const level = score >= 60 ? "high" : score >= 35 ? "medium" : "low";
  return recs[category]?.[level] || [];
}

export function BusinessRiskCalculatorClient() {
  const [industry, setIndustry] = useState<IndustryKey>("other");
  const [answers, setAnswers] = useState<RiskAnswers>(initialAnswers);
  const [expandedCategory, setExpandedCategory] = useState<string | null>("operational");

  const weights = INDUSTRIES[industry].weights;

  const categoryScores = useMemo(() => {
    const op = ((answers.supplyChainDiversity + answers.processDocumentation + (6 - answers.keyPersonDependency) + answers.businessContinuity) / 20) * 100;
    const fin = ((answers.cashReserves + (6 - answers.revenueConcentration) + (6 - answers.debtLevel) + answers.profitStability) / 20) * 100;
    const cyb = ((answers.mfaEnabled + answers.backupFrequency + answers.securityTraining) / 15) * 100;
    const leg = ((answers.writtenContracts + answers.complianceStatus + answers.ipProtection) / 15) * 100;
    const mkt = ((answers.competitiveIntensity + answers.productDiversification) / 10) * 100;
    const phy = ((answers.safetyTraining + (6 - answers.incidentHistory)) / 10) * 100;
    const rep = ((answers.reviewRating + answers.crisisResponse + answers.complaintResolution) / 15) * 100;

    return {
      operational: Math.min(100, Math.max(0, op)),
      financial: Math.min(100, Math.max(0, fin)),
      cyber: Math.min(100, Math.max(0, cyb)),
      legal: Math.min(100, Math.max(0, leg)),
      market: Math.min(100, Math.max(0, mkt)),
      physical: Math.min(100, Math.max(0, phy)),
      reputational: Math.min(100, Math.max(0, rep)),
    };
  }, [answers]);

  const compositeScore = useMemo(() => {
    return Math.round(
      categoryScores.operational * weights.operational +
      categoryScores.financial * weights.financial +
      categoryScores.cyber * weights.cyber +
      categoryScores.legal * weights.legal +
      categoryScores.market * weights.market +
      categoryScores.physical * weights.physical +
      categoryScores.reputational * weights.reputational
    );
  }, [categoryScores, weights]);

  const riskLevel = getRiskLevel(compositeScore);

  const radarData = [
    { subject: "Operational", A: Math.round(categoryScores.operational), fullMark: 100 },
    { subject: "Financial", A: Math.round(categoryScores.financial), fullMark: 100 },
    { subject: "Cyber", A: Math.round(categoryScores.cyber), fullMark: 100 },
    { subject: "Legal", A: Math.round(categoryScores.legal), fullMark: 100 },
    { subject: "Market", A: Math.round(categoryScores.market), fullMark: 100 },
    { subject: "Physical", A: Math.round(categoryScores.physical), fullMark: 100 },
    { subject: "Reputational", A: Math.round(categoryScores.reputational), fullMark: 100 },
  ];

  const barData = Object.entries(categoryScores).map(([key, score]) => ({
    name: CATEGORY_CONFIG[key as keyof typeof CATEGORY_CONFIG].label,
    score: Math.round(score),
    color: CATEGORY_CONFIG[key as keyof typeof CATEGORY_CONFIG].color,
  }));

  const handleAnswerChange = (field: keyof RiskAnswers, value: number) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  };

  const renderSlider = (label: string, value: number, onChange: (v: number) => void, lowLabel: string, highLabel: string) => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-slate-300">{label}</span>
        <span className="font-medium text-violet-400">{value}/5</span>
      </div>
      <input
        type="range"
        min={1}
        max={5}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-violet-500"
      />
      <div className="flex justify-between text-xs text-slate-500">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );

  const categories = [
    {
      key: "operational",
      title: "Operational Risk",
      icon: Building2,
      questions: [
        { field: "supplyChainDiversity" as const, label: "Supplier Diversity", low: "Single source", high: "3+ suppliers per input" },
        { field: "processDocumentation" as const, label: "Process Documentation", low: "No documentation", high: "Fully documented SOPs" },
        { field: "keyPersonDependency" as const, label: "Key Person Dependency", low: "No dependency (reversed)", high: "Critical single points (reversed)" },
        { field: "businessContinuity" as const, label: "Business Continuity Plan", low: "No plan", high: "Tested plan + backups" },
      ],
    },
    {
      key: "financial",
      title: "Financial Risk",
      icon: DollarSign,
      questions: [
        { field: "cashReserves" as const, label: "Cash Reserve Coverage", low: "<1 month", high: "6+ months" },
        { field: "revenueConcentration" as const, label: "Customer Concentration", low: "Diversified (reversed)", high: "One client >50% (reversed)" },
        { field: "debtLevel" as const, label: "Debt Burden", low: "Debt-free (reversed)", high: "High leverage (reversed)" },
        { field: "profitStability" as const, label: "Profit Stability", low: "Volatile losses", high: "Consistent profits" },
      ],
    },
    {
      key: "cyber",
      title: "Cyber / Security Risk",
      icon: Lock,
      questions: [
        { field: "mfaEnabled" as const, label: "Multi-Factor Authentication", low: "Not used", high: "All critical accounts" },
        { field: "backupFrequency" as const, label: "Data Backup Frequency", low: "Never / rarely", high: "Daily automated" },
        { field: "securityTraining" as const, label: "Security Awareness Training", low: "None", high: "Quarterly for all staff" },
      ],
    },
    {
      key: "legal",
      title: "Legal / Compliance Risk",
      icon: Scale,
      questions: [
        { field: "writtenContracts" as const, label: "Written Contracts", low: "Verbal agreements", high: "All agreements documented" },
        { field: "complianceStatus" as const, label: "Regulatory Compliance", low: "Unknown gaps", high: "Fully compliant + audited" },
        { field: "ipProtection" as const, label: "IP Protection", low: "No protection", high: "Trademarks + patents filed" },
      ],
    },
    {
      key: "market",
      title: "Market / Competitive Risk",
      icon: Globe,
      questions: [
        { field: "competitiveIntensity" as const, label: "Competitive Position", low: "Market leader (reversed)", high: "Commoditized market (reversed)" },
        { field: "productDiversification" as const, label: "Product Diversification", low: "Single product", high: "Diversified portfolio" },
      ],
    },
    {
      key: "physical",
      title: "Physical / Safety Risk",
      icon: HardHat,
      questions: [
        { field: "safetyTraining" as const, label: "Safety Training Program", low: "None", high: "Regular documented training" },
        { field: "incidentHistory" as const, label: "Incident History", low: "No incidents (reversed)", high: "Frequent incidents (reversed)" },
      ],
    },
    {
      key: "reputational",
      title: "Reputational Risk",
      icon: MessageSquare,
      questions: [
        { field: "reviewRating" as const, label: "Online Review Rating", low: "<3 stars", high: "4.5+ stars" },
        { field: "crisisResponse" as const, label: "Crisis Response Plan", low: "No plan", high: "Documented + tested" },
        { field: "complaintResolution" as const, label: "Complaint Resolution", low: "No process", high: "SLA-driven resolution" },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10">
                <Shield className="h-5 w-5 text-violet-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Risk Assessment</h2>
            </div>

            {/* Industry */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <Building2 className="h-4 w-4 text-violet-400" />
                Industry Sector
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value as IndustryKey)}
                className="block w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              >
                {Object.entries(INDUSTRIES).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Accordions */}
            <div className="mt-6 space-y-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isOpen = expandedCategory === cat.key;
                const catScore = Math.round(categoryScores[cat.key as keyof typeof categoryScores]);
                return (
                  <div key={cat.key} className="rounded-xl border border-slate-800 overflow-hidden">
                    <button
                      onClick={() => setExpandedCategory(isOpen ? null : cat.key)}
                      className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-slate-950/50"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4 text-violet-400" />
                        <span className="text-sm font-medium text-white">{cat.title}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs font-bold ${
                            catScore >= 70 ? "text-rose-400" : catScore >= 50 ? "text-amber-400" : catScore >= 30 ? "text-blue-400" : "text-emerald-400"
                          }`}
                        >
                          {catScore}
                        </span>
                        {isOpen ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
                      </div>
                    </button>
                    {isOpen && (
                      <div className="space-y-4 border-t border-slate-800 px-4 py-4">
                        {cat.questions.map((q) => (
                          <div key={q.field}>
                            {renderSlider(
                              q.label,
                              answers[q.field],
                              (v) => handleAnswerChange(q.field, v),
                              q.low,
                              q.high
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-7 space-y-6">
          {/* Score Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 text-center shadow-xl backdrop-blur">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Composite Risk Exposure Score
            </p>
            <div className="mt-4 flex items-center justify-center">
              <div className={`flex h-32 w-32 items-center justify-center rounded-full border-4 ${riskLevel.border} ${riskLevel.bg}`}>
                <span className={`text-5xl font-bold ${riskLevel.color}`}>
                  {compositeScore}
                </span>
              </div>
            </div>
            <p className={`mt-4 text-xl font-bold ${riskLevel.color}`}>
              {riskLevel.label}
            </p>
            <p className="mt-2 text-sm text-slate-400">{riskLevel.desc}</p>
            <div className="mt-4 flex justify-center gap-2">
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">0-30 Low</span>
              <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">31-50 Mod</span>
              <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400">51-70 High</span>
              <span className="rounded-full bg-rose-500/10 px-3 py-1 text-xs font-medium text-rose-400">71-100 Crit</span>
            </div>
          </div>

          {/* Radar Chart */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur">
            <h3 className="mb-4 text-lg font-bold text-white">Risk Profile Radar</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="#1e293b" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 10 }} />
                  <Radar
                    name="Your Business"
                    dataKey="A"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fill="#8b5cf6"
                    fillOpacity={0.2}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid #1e293b",
                      borderRadius: "8px",
                      color: "#f8fafc",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur">
            <h3 className="mb-4 text-lg font-bold text-white">Category Breakdown</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} stroke="#64748b" fontSize={12} />
                  <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={12} width={110} />
                  <Tooltip
                    formatter={(value: number) => `${value}/100`}
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid #1e293b",
                      borderRadius: "8px",
                      color: "#f8fafc",
                    }}
                  />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recommendations */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur">
            <h3 className="mb-4 text-lg font-bold text-white">Prioritized Mitigation Recommendations</h3>
            <div className="space-y-4">
              {Object.entries(categoryScores)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([cat, score]) => {
                  const config = CATEGORY_CONFIG[cat as keyof typeof CATEGORY_CONFIG];
                  const Icon = config.icon;
                  const recs = getRecommendations(cat, score);
                  const level = score >= 60 ? "high" : score >= 35 ? "medium" : "low";
                  const levelColor = level === "high" ? "text-rose-400" : level === "medium" ? "text-amber-400" : "text-emerald-400";
                  const levelIcon = level === "high" ? XCircle : level === "medium" ? AlertCircle : CheckCircle2;

                  return (
                    <div key={cat} className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5" style={{ color: config.color }} />
                        <span className="font-semibold text-white">{config.label}</span>
                        <span className={`ml-auto text-sm font-bold ${levelColor}`}>
                          {Math.round(score)}/100
                        </span>
                        <levelIcon className={`h-4 w-4 ${levelColor}`} />
                      </div>
                      <ul className="mt-3 space-y-2">
                        {recs.map((rec, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Weights Info */}
          <div className="flex items-start gap-3 rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-violet-400" />
            <div className="text-sm text-slate-300">
              <p className="font-medium text-violet-400">Industry-Weighted Scoring</p>
              <p className="mt-1">
                Your composite score uses industry-specific weights. For{" "}
                <strong>{INDUSTRIES[industry].label}</strong>, the highest
                weighted categories are:{" "}
                {Object.entries(weights)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 3)
                  .map(([k, v], i, arr) => (
                    <span key={k}>
                      {CATEGORY_CONFIG[k as keyof typeof CATEGORY_CONFIG].label} ({Math.round(v * 100)}%)
                      {i < arr.length - 1 ? ", " : ""}
                    </span>
                  ))}
                . Switching industries recalibrates the composite score.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
