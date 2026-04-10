"use client";

import { useMemo, useState } from "react";

import { generateRobotsTxt } from "@/lib/tools/robots-txt";

const fieldClass =
  "w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary";
const textareaClass =
  "min-h-[9rem] w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm leading-6 text-foreground outline-none focus:ring-2 focus:ring-primary";

export default function RobotsTxtGenerator() {
  const [userAgent, setUserAgent] = useState("*");
  const [allowRules, setAllowRules] = useState("/");
  const [disallowRules, setDisallowRules] = useState("/admin/\n/private/");
  const [sitemapUrl, setSitemapUrl] = useState("https://example.com/sitemap.xml");
  const [crawlDelay, setCrawlDelay] = useState("");

  const output = useMemo(
    () =>
      generateRobotsTxt({
        userAgent,
        allowRules: allowRules.split(/\r?\n/),
        disallowRules: disallowRules.split(/\r?\n/),
        sitemapUrl,
        crawlDelay,
      }),
    [allowRules, crawlDelay, disallowRules, sitemapUrl, userAgent],
  );

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section className="tool-frame p-4 sm:p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-muted-foreground">User-agent</span>
            <input value={userAgent} onChange={(e) => setUserAgent(e.target.value)} className={fieldClass} />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Crawl-delay (optional)</span>
            <input value={crawlDelay} onChange={(e) => setCrawlDelay(e.target.value)} className={fieldClass} />
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-muted-foreground">Sitemap URL</span>
            <input value={sitemapUrl} onChange={(e) => setSitemapUrl(e.target.value)} className={fieldClass} />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Allow rules (one per line)</span>
            <textarea value={allowRules} onChange={(e) => setAllowRules(e.target.value)} className={textareaClass} />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Disallow rules (one per line)</span>
            <textarea value={disallowRules} onChange={(e) => setDisallowRules(e.target.value)} className={textareaClass} />
          </label>
        </div>
      </section>

      <section className="tool-frame p-4 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Generated robots.txt</h2>
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(output)}
            className="rounded-[1rem] border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
          >
            Copy
          </button>
        </div>
        <pre className="mt-5 overflow-x-auto rounded-[1.25rem] border border-border bg-background p-4 text-sm leading-6 text-foreground">
          {output}
        </pre>
      </section>
    </div>
  );
}
