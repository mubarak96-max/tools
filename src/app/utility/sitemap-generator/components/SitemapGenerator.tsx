"use client";

import { useMemo, useState } from "react";

import { generateSitemapXml } from "@/lib/tools/sitemap-generator";

const fieldClass =
  "w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary";
const textareaClass =
  "min-h-[16rem] w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm leading-6 text-foreground outline-none focus:ring-2 focus:ring-primary";

export default function SitemapGenerator() {
  const [siteUrl, setSiteUrl] = useState("https://example.com");
  const [entries, setEntries] = useState("/\n/about\n/contact\n/blog/post-1");
  const [changefreq, setChangefreq] = useState("weekly");
  const [priority, setPriority] = useState("0.8");
  const [includeLastmod, setIncludeLastmod] = useState(true);

  const output = useMemo(
    () =>
      generateSitemapXml({
        siteUrl,
        entries: entries.split(/\r?\n/),
        changefreq,
        priority,
        includeLastmod,
      }),
    [changefreq, entries, includeLastmod, priority, siteUrl],
  );

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <section className="tool-frame p-4 sm:p-6">
        <div className="space-y-5">
          <label className="space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Site URL</span>
            <input value={siteUrl} onChange={(e) => setSiteUrl(e.target.value)} className={fieldClass} />
          </label>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Change frequency</span>
              <input value={changefreq} onChange={(e) => setChangefreq(e.target.value)} className={fieldClass} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Priority</span>
              <input value={priority} onChange={(e) => setPriority(e.target.value)} className={fieldClass} />
            </label>
          </div>
          <label className="flex items-center gap-3 rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground">
            <input type="checkbox" checked={includeLastmod} onChange={(e) => setIncludeLastmod(e.target.checked)} />
            Include current date as lastmod
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Paths or URLs (one per line)</span>
            <textarea value={entries} onChange={(e) => setEntries(e.target.value)} className={textareaClass} />
          </label>
        </div>
      </section>

      <section className="tool-frame p-4 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Generated sitemap.xml</h2>
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
