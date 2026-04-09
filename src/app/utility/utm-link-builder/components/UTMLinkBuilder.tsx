"use client";

import { useMemo, useState } from "react";

const fieldClass =
  "w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary transition-shadow";

export default function UTMLinkBuilder() {
  const [url, setUrl] = useState("");
  const [source, setSource] = useState("");
  const [medium, setMedium] = useState("");
  const [campaign, setCampaign] = useState("");
  const [term, setTerm] = useState("");
  const [content, setContent] = useState("");

  const [copied, setCopied] = useState(false);

  const generatedUrl = useMemo(() => {
    if (!url) return "";
    
    try {
      const parsedUrl = new URL(url.startsWith("http") ? url : `https://${url}`);
      
      if (source) parsedUrl.searchParams.set("utm_source", source);
      if (medium) parsedUrl.searchParams.set("utm_medium", medium);
      if (campaign) parsedUrl.searchParams.set("utm_campaign", campaign);
      if (term) parsedUrl.searchParams.set("utm_term", term);
      if (content) parsedUrl.searchParams.set("utm_content", content);

      return parsedUrl.toString();
    } catch (e) {
      // Invalid URL fallback, just append manually
      let base = url;
      const params = [];
      if (source) params.push(`utm_source=${encodeURIComponent(source)}`);
      if (medium) params.push(`utm_medium=${encodeURIComponent(medium)}`);
      if (campaign) params.push(`utm_campaign=${encodeURIComponent(campaign)}`);
      if (term) params.push(`utm_term=${encodeURIComponent(term)}`);
      if (content) params.push(`utm_content=${encodeURIComponent(content)}`);

      if (params.length > 0) {
        base += base.includes("?") ? "&" + params.join("&") : "?" + params.join("&");
      }
      return base;
    }
  }, [url, source, medium, campaign, term, content]);

  const handleCopy = () => {
    if (!generatedUrl) return;
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <section className="tool-frame p-4 sm:p-6">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.05fr)_22rem]">
          {/* Inputs */}
          <div className="space-y-5">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-foreground">Website URL <span className="text-red-500">*</span></span>
              <p className="text-xs text-muted-foreground">The full website URL (e.g. https://example.com/page)</p>
              <input
                type="url"
                placeholder="https://mysite.com/"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className={fieldClass}
              />
            </label>

            <div className="h-px w-full bg-border/50 my-6"></div>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-foreground">Campaign Source (utm_source) <span className="text-red-500">*</span></span>
              <p className="text-xs text-muted-foreground">The referrer (e.g. google, newsletter, facebook)</p>
              <input
                type="text"
                placeholder="google"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className={fieldClass}
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-foreground">Campaign Medium (utm_medium)</span>
              <p className="text-xs text-muted-foreground">Marketing medium (e.g. cpc, banner, email)</p>
              <input
                type="text"
                placeholder="cpc"
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
                className={fieldClass}
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-foreground">Campaign Name (utm_campaign)</span>
              <p className="text-xs text-muted-foreground">Product, promo code, or slogan (e.g. spring_sale)</p>
              <input
                type="text"
                placeholder="spring_sale"
                value={campaign}
                onChange={(e) => setCampaign(e.target.value)}
                className={fieldClass}
              />
            </label>

            <div className="grid sm:grid-cols-2 gap-5 pt-2">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-foreground">Campaign Term</span>
                <p className="text-xs text-muted-foreground">(utm_term) Paid keywords</p>
                <input
                  type="text"
                  placeholder="running+shoes"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  className={fieldClass}
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-foreground">Campaign Content</span>
                <p className="text-xs text-muted-foreground">(utm_content) Ad version, A/B test</p>
                <input
                  type="text"
                  placeholder="logolink"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className={fieldClass}
                />
              </label>
            </div>
          </div>

          {/* Result Output */}
          <aside className="rounded-[1.5rem] border border-border bg-card p-5 xl:sticky xl:top-6 flex flex-col h-fit">
            <h3 className="text-base font-semibold text-foreground tracking-tight mb-4">Generated UTM Link</h3>
            
            <div className="flex-1 w-full rounded-[1rem] border border-primary/20 bg-primary-soft p-4 min-h-[120px] mb-4 break-all text-sm font-medium text-primary shadow-inner">
              {generatedUrl || <span className="text-primary/50 font-normal">Enter a URL and source to see your customized tracking link here...</span>}
            </div>

            <button
              onClick={handleCopy}
              disabled={!generatedUrl}
              className={`w-full py-3 px-4 rounded-[1rem] text-sm font-semibold transition-all ${
                !generatedUrl 
                  ? "bg-muted text-muted-foreground cursor-not-allowed" 
                  : copied 
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20" 
                    : "bg-primary text-primary-foreground hover:-translate-y-0.5 hover:shadow-lg shadow-primary/25"
              }`}
            >
              {copied ? "Copied to Clipboard!" : "Copy URL"}
            </button>
            <p className="text-center mt-4 text-xs text-muted-foreground">
              This link is ready to be pasted into your ads, social posts, or emails.
            </p>
          </aside>
        </div>
      </section>
    </div>
  );
}
