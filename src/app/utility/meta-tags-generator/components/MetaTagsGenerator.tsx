"use client";

import { useState } from "react";
import Image from "next/image";
import { CopyButton } from "@/components/tailwind/shared";

const fieldClass =
  "w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary transition-shadow";

export default function MetaTagsGenerator() {
  const [title, setTitle] = useState("My Awesome Website");
  const [description, setDescription] = useState("This is the description that will appear on Google and social media cards when people share your website link.");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1470&auto=format&fit=crop");
  const [url, setUrl] = useState("https://mywebsite.com");
  const [favicon, setFavicon] = useState("🚀");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");

  const generateCode = () => {
    return `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}" />
<meta name="description" content="${description}" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${url}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
${imageUrl ? `<meta property="og:image" content="${imageUrl}" />` : ""}

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="${url}" />
<meta property="twitter:title" content="${title}" />
<meta property="twitter:description" content="${description}" />
${imageUrl ? `<meta property="twitter:image" content="${imageUrl}" />` : ""}`;
  };

  return (
    <div className="space-y-6">
      <section className="tool-frame p-4 sm:p-6">
        <div className="grid gap-8 xl:grid-cols-[22rem_minmax(0,1fr)]">
          
          {/* Inputs */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Page Details</h3>
            
            <label className="block space-y-2">
              <span className="text-sm font-medium text-foreground">Page Title</span>
              <input
                type="text"
                maxLength={60}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={fieldClass}
                placeholder="Page Title"
              />
              <p className="text-right text-[10px] text-muted-foreground">{title.length} / 60 characters</p>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-foreground">Meta Description</span>
              <textarea
                rows={4}
                maxLength={160}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`${fieldClass} resize-none`}
                placeholder="Page description"
              />
              <p className="text-right text-[10px] text-muted-foreground">{description.length} / 160 characters</p>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-foreground">OpenGraph Image URL</span>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className={fieldClass}
                placeholder="https://example.com/image.jpg"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-foreground">Canonical Website URL</span>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className={fieldClass}
                placeholder="https://mywebsite.com"
              />
            </label>
          </div>

          {/* Preview & Code */}
          <div className="space-y-8 min-w-0">
            
            {/* Visual Previews */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-2 gap-4">
                <h3 className="text-lg font-semibold text-foreground">Visual Previews</h3>
                <div className="flex items-center rounded-full border border-border bg-muted/30 p-1">
                  <button
                    onClick={() => setPreviewMode("desktop")}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                      previewMode === "desktop" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Desktop
                  </button>
                  <button
                    onClick={() => setPreviewMode("mobile")}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                      previewMode === "mobile" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Mobile
                  </button>
                </div>
              </div>
              
              <div className={`grid gap-6 mt-4 transition-all duration-300 ${previewMode === "desktop" ? "md:grid-cols-2" : "grid-cols-1 mx-auto max-w-[380px]"}`}>
                
                {/* Google Preview */}
                <div className="rounded-[1rem] border border-border bg-card p-4 shadow-sm h-fit">
                   <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Google Search ({previewMode})</p>
                   <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-sm border border-border">
                          {favicon}
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[14px] text-foreground leading-none mb-1">{title || "Website Name"}</span>
                           <span className="text-[12px] text-muted-foreground leading-none max-w-[200px] truncate">{url || "https://mywebsite.com"}</span>
                        </div>
                      </div>
                      <h4 className={`text-[#1a0dab] tracking-normal pt-2 cursor-pointer hover:underline truncate ${previewMode === "mobile" ? "text-[18px]" : "text-[20px]"}`}>
                        {title}
                      </h4>
                      <p className={`text-[#4d5156] leading-[1.6] line-clamp-2 ${previewMode === "mobile" ? "text-[14px]" : "text-[14px]"}`}>
                        {description}
                      </p>
                   </div>
                </div>

                {/* Twitter / LinkedIn Preview */}
                <div className="rounded-[1rem] border border-border bg-card p-0 shadow-sm overflow-hidden flex flex-col h-fit">
                   <div className="p-3 border-b border-border bg-slate-50 flex items-center gap-2">
                      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 text-[#1DA1F2] fill-current"><g><path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path></g></svg>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Twitter Card ({previewMode})</p>
                   </div>
                   {imageUrl && (
                     <div className={`relative w-full bg-slate-100 border-b border-border ${previewMode === "mobile" ? "aspect-square" : "aspect-[1.91]"}`}>
                       <Image src={imageUrl} alt="OG Card Image" fill className="object-cover" unoptimized/>
                     </div>
                   )}
                   <div className="p-3 bg-card min-h-[80px]">
                      <p className="text-[13px] text-muted-foreground mb-0.5 truncate">{new URL(url || "https://example.com").hostname}</p>
                      <h4 className="text-[15px] font-medium text-foreground leading-tight truncate mt-1">
                        {title}
                      </h4>
                      <p className="text-[14px] text-muted-foreground mt-1 line-clamp-2">
                        {description}
                      </p>
                   </div>
                </div>
              </div>
            </div>

            {/* Code Output */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Generated HTML Code</h3>
              <div className="relative rounded-[1rem] border border-border bg-muted/30 p-4 shadow-inner">
                <pre className="text-sm font-mono text-foreground whitespace-pre-wrap break-words">
                  {generateCode()}
                </pre>
                <div className="absolute top-4 right-4">
                  <CopyButton text={generateCode()} />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Copy this code and paste it directly between the <code>&lt;head&gt;</code> and <code>&lt;/head&gt;</code> tags of your website.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
