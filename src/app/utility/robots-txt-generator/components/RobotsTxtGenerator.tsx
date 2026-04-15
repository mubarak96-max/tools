"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { generateRobotsTxt } from "@/lib/tools/robots-txt";

type RobotsPreset = {
  key: string;
  label: string;
  description: string;
  userAgent: string;
  allowRules: string;
  disallowRules: string;
  sitemapUrl: string;
  crawlDelay: string;
};

const fieldClass =
  "w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary";
const textareaClass =
  "min-h-[9rem] w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm leading-6 text-foreground outline-none focus:ring-2 focus:ring-primary";
const actionClass =
  "rounded-[0.9rem] border border-border bg-card px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary";

const PRESETS: RobotsPreset[] = [
  {
    key: "basic",
    label: "Basic website",
    description: "Allow normal crawling, block admin-style sections, and add your sitemap.",
    userAgent: "*",
    allowRules: "/",
    disallowRules: "/admin/\n/private/\n/tmp/",
    sitemapUrl: "https://example.com/sitemap.xml",
    crawlDelay: "",
  },
  {
    key: "wordpress",
    label: "WordPress",
    description: "Blocks typical admin and internal paths while keeping admin AJAX reachable.",
    userAgent: "*",
    allowRules: "/wp-admin/admin-ajax.php",
    disallowRules: "/wp-admin/\n/wp-includes/\n/?s=\n/search/",
    sitemapUrl: "https://example.com/sitemap_index.xml",
    crawlDelay: "",
  },
  {
    key: "shopify",
    label: "Shopify",
    description: "Useful starting point for common cart, checkout, and account areas.",
    userAgent: "*",
    allowRules: "/",
    disallowRules: "/cart\n/checkout\n/account\n/search",
    sitemapUrl: "https://example.com/sitemap.xml",
    crawlDelay: "",
  },
  {
    key: "ecommerce",
    label: "E-commerce",
    description: "Preserves product crawling while blocking checkout, account, and internal search paths.",
    userAgent: "*",
    allowRules: "/products/\n/collections/",
    disallowRules: "/cart\n/checkout\n/account\n/search\n/filter",
    sitemapUrl: "https://example.com/sitemap.xml",
    crawlDelay: "",
  },
];

const AI_BOT_RULES = ["GPTBot", "CCBot", "Google-Extended", "anthropic-ai", "ClaudeBot"];

function parseRules(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function longestRuleMatch(pathname: string, rules: string[]) {
  let longest = "";

  for (const rule of rules) {
    if (!rule.startsWith("/")) {
      continue;
    }

    if (rule === "/" || pathname.startsWith(rule)) {
      if (rule.length > longest.length) {
        longest = rule;
      }
    }
  }

  return longest;
}

function testRobotsPath(pathname: string, allowRules: string[], disallowRules: string[]) {
  const bestAllow = longestRuleMatch(pathname, allowRules);
  const bestDisallow = longestRuleMatch(pathname, disallowRules);

  if (!bestAllow && !bestDisallow) {
    return {
      allowed: true,
      reason: "No matching allow or disallow rule was found for this path.",
    };
  }

  if (bestAllow.length >= bestDisallow.length) {
    return {
      allowed: true,
      reason: bestAllow
        ? `Allowed because the matching Allow rule (${bestAllow}) is at least as specific as the Disallow rule.`
        : "Allowed because no blocking rule matched this path.",
    };
  }

  return {
    allowed: false,
    reason: `Blocked because the matching Disallow rule (${bestDisallow}) is more specific than any Allow rule.`,
  };
}

function buildRobotsOutput({
  userAgent,
  allowRules,
  disallowRules,
  sitemapUrl,
  crawlDelay,
  blockAiBots,
}: {
  userAgent: string;
  allowRules: string[];
  disallowRules: string[];
  sitemapUrl: string;
  crawlDelay: string;
  blockAiBots: boolean;
}) {
  const mainBlock = generateRobotsTxt({
    userAgent,
    allowRules,
    disallowRules,
    sitemapUrl,
    crawlDelay,
  });

  if (!blockAiBots) {
    return mainBlock;
  }

  const botBlocks = AI_BOT_RULES.map((bot) => `User-agent: ${bot}\nDisallow: /`).join("\n\n");
  return `${mainBlock}\n\n${botBlocks}`;
}

export default function RobotsTxtGenerator() {
  const [presetKey, setPresetKey] = useState("basic");
  const [userAgent, setUserAgent] = useState(PRESETS[0].userAgent);
  const [allowRulesText, setAllowRulesText] = useState(PRESETS[0].allowRules);
  const [disallowRulesText, setDisallowRulesText] = useState(PRESETS[0].disallowRules);
  const [sitemapUrl, setSitemapUrl] = useState(PRESETS[0].sitemapUrl);
  const [crawlDelay, setCrawlDelay] = useState(PRESETS[0].crawlDelay);
  const [testUrl, setTestUrl] = useState("https://example.com/admin/");
  const [blockAiBots, setBlockAiBots] = useState(false);

  const allowRules = useMemo(() => parseRules(allowRulesText), [allowRulesText]);
  const disallowRules = useMemo(() => parseRules(disallowRulesText), [disallowRulesText]);

  const output = useMemo(
    () =>
      buildRobotsOutput({
        userAgent,
        allowRules,
        disallowRules,
        sitemapUrl,
        crawlDelay,
        blockAiBots,
      }),
    [userAgent, allowRules, disallowRules, sitemapUrl, crawlDelay, blockAiBots],
  );

  const warnings = useMemo(() => {
    const nextWarnings: string[] = [];
    const trimmedUserAgent = userAgent.trim() || "*";

    if (trimmedUserAgent === "*" && disallowRules.includes("/") && allowRules.length === 0) {
      nextWarnings.push("You are blocking the entire site for all crawlers. That is usually an SEO mistake.");
    }

    if (trimmedUserAgent === "*" && disallowRules.includes("/") && allowRules.includes("/")) {
      nextWarnings.push("You have both Allow: / and Disallow: /. The file is valid, but the intent is unclear and easy to misread.");
    }

    if (sitemapUrl.trim() && !/^https?:\/\//i.test(sitemapUrl.trim())) {
      nextWarnings.push("Sitemap should usually be an absolute URL like https://example.com/sitemap.xml.");
    }

    if (crawlDelay.trim() && Number.isNaN(Number(crawlDelay))) {
      nextWarnings.push("Crawl-delay should be numeric if you use it.");
    }

    if (disallowRules.some((rule) => rule.includes(".css") || rule.includes(".js"))) {
      nextWarnings.push("Blocking CSS or JavaScript can hurt rendering and technical SEO.");
    }

    return nextWarnings;
  }, [allowRules, crawlDelay, disallowRules, sitemapUrl, userAgent]);

  const explanationRows = useMemo(() => {
    const rows: Array<{ line: string; explanation: string }> = [];
    rows.push({
      line: `User-agent: ${userAgent.trim() || "*"}`,
      explanation:
        (userAgent.trim() || "*") === "*"
          ? "Applies to all crawlers unless a more specific block exists."
          : "Applies only to the named crawler.",
    });

    allowRules.forEach((rule) => {
      rows.push({
        line: `Allow: ${rule}`,
        explanation: `Explicitly allows crawling for paths matching ${rule}.`,
      });
    });

    disallowRules.forEach((rule) => {
      rows.push({
        line: `Disallow: ${rule}`,
        explanation: rule === "/"
          ? "Blocks the entire site for the matching crawler."
          : `Blocks crawling for paths matching ${rule}.`,
      });
    });

    if (crawlDelay.trim()) {
      rows.push({
        line: `Crawl-delay: ${crawlDelay.trim()}`,
        explanation: "Requests a pause between crawler requests. Some search engines ignore this directive.",
      });
    }

    if (sitemapUrl.trim()) {
      rows.push({
        line: `Sitemap: ${sitemapUrl.trim()}`,
        explanation: "Points crawlers to your XML sitemap so they can discover important URLs faster.",
      });
    }

    if (blockAiBots) {
      rows.push({
        line: "User-agent: GPTBot / CCBot / Google-Extended / anthropic-ai / ClaudeBot",
        explanation: "Adds explicit blocks for common AI crawlers and training-related bots.",
      });
    }

    return rows;
  }, [allowRules, blockAiBots, crawlDelay, disallowRules, sitemapUrl, userAgent]);

  const testResult = useMemo(() => {
    if (!testUrl.trim()) {
      return null;
    }

    try {
      const parsed = new URL(testUrl.startsWith("http") ? testUrl : `https://example.com${testUrl}`);
      return {
        pathname: parsed.pathname || "/",
        ...testRobotsPath(parsed.pathname || "/", allowRules, disallowRules),
      };
    } catch {
      return {
        pathname: "",
        allowed: false,
        reason: "Enter a valid URL or path to test, for example /admin/ or https://example.com/admin/.",
      };
    }
  }, [allowRules, disallowRules, testUrl]);

  function applyPreset(key: string) {
    const preset = PRESETS.find((item) => item.key === key) ?? PRESETS[0];
    setPresetKey(preset.key);
    setUserAgent(preset.userAgent);
    setAllowRulesText(preset.allowRules);
    setDisallowRulesText(preset.disallowRules);
    setSitemapUrl(preset.sitemapUrl);
    setCrawlDelay(preset.crawlDelay);
  }

  function downloadFile() {
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "robots.txt";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <section className="tool-frame p-4 sm:p-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_24rem]">
          <div className="space-y-5">
            <div className="rounded-[1.25rem] border border-primary/15 bg-primary-soft p-4">
              <p className="text-sm font-semibold text-primary-soft-foreground">
                Build the rules and understand them at the same time. This page generates the file,
                explains each directive, warns about risky setups, and lets you test a URL before publishing.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-sm font-semibold text-foreground">Presets</span>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.key}
                    type="button"
                    onClick={() => applyPreset(preset.key)}
                    className={`rounded-[1rem] border px-4 py-3 text-left text-sm transition-colors ${
                      presetKey === preset.key
                        ? "border-primary bg-primary-soft text-primary-soft-foreground"
                        : "border-border bg-background text-foreground hover:border-primary/30"
                    }`}
                  >
                    <span className="block font-semibold">{preset.label}</span>
                    <span className="mt-1 block text-xs leading-5 opacity-80">{preset.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">User-agent</span>
                <input
                  value={userAgent}
                  onChange={(event) => setUserAgent(event.target.value)}
                  className={fieldClass}
                  placeholder="*"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Crawl-delay (optional)</span>
                <input
                  value={crawlDelay}
                  onChange={(event) => setCrawlDelay(event.target.value)}
                  className={fieldClass}
                  placeholder="Example: 5"
                />
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-muted-foreground">Sitemap URL</span>
                <input
                  value={sitemapUrl}
                  onChange={(event) => setSitemapUrl(event.target.value)}
                  className={fieldClass}
                  placeholder="https://example.com/sitemap.xml"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Allow rules (one per line)</span>
                <textarea
                  value={allowRulesText}
                  onChange={(event) => setAllowRulesText(event.target.value)}
                  className={textareaClass}
                  placeholder="/wp-admin/admin-ajax.php"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Disallow rules (one per line)</span>
                <textarea
                  value={disallowRulesText}
                  onChange={(event) => setDisallowRulesText(event.target.value)}
                  className={textareaClass}
                  placeholder="/admin/&#10;/checkout"
                />
              </label>
            </div>

            <label className="flex items-start gap-3 rounded-[1rem] border border-border bg-background p-4">
              <input
                type="checkbox"
                checked={blockAiBots}
                onChange={(event) => setBlockAiBots(event.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-border"
              />
              <span>
                <span className="block text-sm font-semibold text-foreground">Add AI crawler blocks</span>
                <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                  Adds `Disallow: /` blocks for common AI bots such as GPTBot and ClaudeBot. Keep this explicit so the file intent stays readable.
                </span>
              </span>
            </label>

            {warnings.length ? (
              <div className="rounded-[1.25rem] border border-amber-300/40 bg-amber-50 p-4">
                <p className="text-sm font-semibold text-amber-950">Validation warnings</p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-amber-950">
                  {warnings.map((warning) => (
                    <li key={warning}>- {warning}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="rounded-[1.25rem] border border-emerald-300/40 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">
                No obvious high-risk issues detected in the current rules.
              </div>
            )}
          </div>

          <aside className="rounded-[1.5rem] border border-border bg-background p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Generated file</p>
                <h2 className="mt-2 text-lg font-semibold text-foreground">robots.txt output</h2>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => navigator.clipboard.writeText(output)} className={actionClass}>
                  Copy
                </button>
                <button type="button" onClick={downloadFile} className={actionClass}>
                  Download
                </button>
              </div>
            </div>

            <pre className="mt-5 overflow-x-auto rounded-[1.25rem] border border-border bg-card p-4 text-sm leading-6 text-foreground">
              {output}
            </pre>

            <div className="mt-5 rounded-[1rem] border border-rose-300/40 bg-rose-50 p-4 text-sm leading-6 text-rose-950">
              Robots.txt controls crawling, not guaranteed indexing. If you need a page removed from search results,
              use a crawlable page with a `noindex` directive instead of relying on robots.txt alone.
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="tool-frame p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Line by line explanation</p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground">What each rule does</h2>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {explanationRows.map((row) => (
              <article key={`${row.line}-${row.explanation}`} className="rounded-[1rem] border border-border bg-background p-4">
                <p className="font-mono text-sm text-foreground">{row.line}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{row.explanation}</p>
              </article>
            ))}
          </div>
        </div>

        <aside className="tool-frame p-4 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">URL tester</p>
          <h2 className="mt-2 text-lg font-semibold text-foreground">Check one path quickly</h2>
          <label className="mt-4 block space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Test URL or path</span>
            <input
              value={testUrl}
              onChange={(event) => setTestUrl(event.target.value)}
              className={fieldClass}
              placeholder="/admin/"
            />
          </label>

          {testResult ? (
            <div
              className={`mt-4 rounded-[1rem] border p-4 ${
                testResult.allowed ? "border-emerald-300/40 bg-emerald-50 text-emerald-950" : "border-amber-300/40 bg-amber-50 text-amber-950"
              }`}
            >
              <p className="text-sm font-semibold">
                {testResult.allowed ? "Allowed for crawling" : "Blocked for crawling"}
              </p>
              {testResult.pathname ? <p className="mt-1 font-mono text-xs">{testResult.pathname}</p> : null}
              <p className="mt-2 text-xs leading-5">{testResult.reason}</p>
            </div>
          ) : null}

          <div className="mt-4 rounded-[1rem] border border-border bg-background p-4 text-sm leading-6 text-muted-foreground">
            This tester uses simple path matching for the current rules. It is useful for spotting obvious mistakes before you publish.
          </div>

          <div className="mt-4 rounded-[1rem] border border-border bg-background p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Next SEO tools</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/utility/xml-sitemap-generator" className={actionClass}>
                XML sitemap
              </Link>
              <Link href="/utility/meta-tag-generator" className={actionClass}>
                Meta tags
              </Link>
              <Link href="/utility/canonical-tag-generator" className={actionClass}>
                Canonical URL
              </Link>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
