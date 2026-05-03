"use client";

import { useEffect, useRef } from "react";

const styles = `
.shopify-utm-blog {
  --bg: #f6f8fb;
  --bg2: #ffffff;
  --bg3: #eef3f8;
  --surface: #ffffff;
  --surface2: #f3f7fb;
  --border: #d6e0eb;
  --accent: #0ca678;
  --accent2: #0b74de;
  --accent3: #d99000;
  --text: #132033;
  --text2: #41556f;
  --text3: #6f8298;
  --shopify-green: #5a8f1f;
  --danger: #d63357;
  --success: #0ca678;
  position: relative;
  isolation: isolate;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-sans), sans-serif;
  line-height: 1.7;
  font-size: 16px;
  overflow: hidden;
}

.shopify-utm-blog::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 0;
  opacity: 0.22;
}

.shopify-utm-blog *, .shopify-utm-blog *::before, .shopify-utm-blog *::after {
  box-sizing: border-box;
}

.shopify-utm-blog .hero {
  position: relative;
  padding: 72px 40px 60px;
  max-width: 860px;
  margin: 0 auto;
  z-index: 1;
}

.shopify-utm-blog .hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(90, 143, 31, 0.08);
  border: 1px solid rgba(90, 143, 31, 0.18);
  color: var(--shopify-green);
  font-size: 12px;
  font-weight: 600;
  padding: 5px 14px;
  border-radius: 100px;
  margin-bottom: 28px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.shopify-utm-blog .hero-badge::before {
  content: "";
  width: 7px;
  height: 7px;
  background: var(--shopify-green);
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(90, 143, 31, 0.45);
  animation: shopify-utm-blog-pulse 2s infinite;
}

@keyframes shopify-utm-blog-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.shopify-utm-blog h1 {
  font-family: var(--font-display), sans-serif;
  font-weight: 800;
  font-size: clamp(32px, 5vw, 52px);
  line-height: 1.1;
  letter-spacing: -1.5px;
  color: var(--text);
  margin: 0 0 20px;
}

.shopify-utm-blog h1 em {
  font-style: normal;
  color: var(--accent);
}

.shopify-utm-blog .hero-sub {
  font-size: 18px;
  color: var(--text2);
  max-width: 640px;
  line-height: 1.6;
  margin-bottom: 36px;
}

.shopify-utm-blog .hero-cta-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}

.shopify-utm-blog .btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--accent);
  color: #ffffff;
  font-family: var(--font-display), sans-serif;
  font-weight: 700;
  font-size: 15px;
  padding: 14px 28px;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s;
  white-space: nowrap;
}

.shopify-utm-blog .btn-primary:hover {
  background: #089268;
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(12, 166, 120, 0.22);
}

.shopify-utm-blog .btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--border);
  color: var(--text2);
  font-size: 14px;
  padding: 14px 24px;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s;
  background: rgba(255, 255, 255, 0.75);
}

.shopify-utm-blog .btn-secondary:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.shopify-utm-blog .hero-meta {
  margin-top: 32px;
  display: flex;
  gap: 28px;
  flex-wrap: wrap;
}

.shopify-utm-blog .hero-meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text3);
}

.shopify-utm-blog .hero-meta-item span {
  color: var(--text2);
}

.shopify-utm-blog .toc-box {
  background: var(--surface);
  border: 1px solid var(--border);
  border-left: 3px solid var(--accent);
  border-radius: 10px;
  padding: 28px 32px;
  margin: 0 auto 60px;
  max-width: 860px;
  box-shadow: 0 18px 50px rgba(19, 32, 51, 0.04);
}

.shopify-utm-blog .toc-box h2 {
  font-family: var(--font-display), sans-serif;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--accent);
  margin: 0 0 16px;
  border: 0;
  padding: 0;
}

.shopify-utm-blog .toc-list {
  list-style: none;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 24px;
  padding: 0;
  margin: 0;
}

.shopify-utm-blog .toc-list li {
  margin: 0;
}

.shopify-utm-blog .toc-list li a {
  color: var(--text2);
  text-decoration: none;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: color 0.2s;
}

.shopify-utm-blog .toc-list li a:hover {
  color: var(--accent);
}

.shopify-utm-blog .toc-list li a::before {
  content: attr(data-num);
  font-family: var(--font-syne), sans-serif;
  font-size: 11px;
  font-weight: 700;
  color: var(--text3);
  min-width: 22px;
}

.shopify-utm-blog .content {
  max-width: 860px;
  margin: 0 auto;
  padding: 0 40px 100px;
  position: relative;
  z-index: 1;
}

.shopify-utm-blog h2 {
  font-family: var(--font-display), sans-serif;
  font-weight: 800;
  font-size: clamp(22px, 3vw, 30px);
  letter-spacing: -0.8px;
  color: var(--text);
  margin: 60px 0 20px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.shopify-utm-blog h3 {
  font-family: var(--font-display), sans-serif;
  font-weight: 700;
  font-size: 18px;
  color: var(--text);
  margin: 36px 0 12px;
}

.shopify-utm-blog h4 {
  font-family: var(--font-display), sans-serif;
  font-weight: 600;
  font-size: 15px;
  color: var(--accent);
  margin: 24px 0 8px;
  letter-spacing: 0.3px;
}

.shopify-utm-blog p {
  color: var(--text2);
  margin: 0 0 16px;
}

.shopify-utm-blog p strong {
  color: var(--text);
  font-weight: 600;
}

.shopify-utm-blog a {
  color: inherit;
}

.shopify-utm-blog ul,
.shopify-utm-blog ol {
  color: var(--text2);
  padding-left: 20px;
  margin: 0 0 16px;
}

.shopify-utm-blog li {
  margin-bottom: 8px;
}

.shopify-utm-blog li strong {
  color: var(--text);
}

.shopify-utm-blog .callout {
  border-radius: 10px;
  padding: 20px 24px;
  margin: 28px 0;
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.shopify-utm-blog .callout-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  margin-top: 2px;
  color: currentColor;
}

.shopify-utm-blog .callout-icon svg,
.shopify-utm-blog .meta-icon svg,
.shopify-utm-blog .heading-icon svg {
  width: 100%;
  height: 100%;
  display: block;
  stroke: currentColor;
}

.shopify-utm-blog .callout-body {
  flex: 1;
}

.shopify-utm-blog .callout-body strong {
  display: block;
  margin-bottom: 6px;
  font-size: 15px;
  color: var(--text);
}

.shopify-utm-blog .callout-body p {
  margin: 0;
  font-size: 14px;
}

.shopify-utm-blog .callout-info {
  background: rgba(11, 116, 222, 0.06);
  border: 1px solid rgba(11, 116, 222, 0.18);
}

.shopify-utm-blog .callout-warn {
  background: rgba(217, 144, 0, 0.07);
  border: 1px solid rgba(217, 144, 0, 0.18);
}

.shopify-utm-blog .callout-warn .callout-body strong {
  color: var(--accent3);
}

.shopify-utm-blog .callout-success {
  background: rgba(12, 166, 120, 0.06);
  border: 1px solid rgba(12, 166, 120, 0.18);
}

.shopify-utm-blog .callout-success .callout-body strong {
  color: var(--accent);
}

.shopify-utm-blog pre {
  background: #f9fbfd;
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 20px 24px;
  overflow-x: auto;
  margin: 20px 0;
  position: relative;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.shopify-utm-blog pre::before {
  content: "URL";
  position: absolute;
  top: 10px;
  right: 14px;
  font-size: 10px;
  letter-spacing: 1.5px;
  color: var(--text3);
  font-family: var(--font-display), sans-serif;
  font-weight: 700;
  text-transform: uppercase;
}

.shopify-utm-blog code {
  font-family: var(--font-mono), monospace;
  font-size: 13px;
  line-height: 1.8;
  color: #2660c7;
  white-space: pre-wrap;
  word-break: break-all;
}

.shopify-utm-blog .code-param {
  color: var(--accent);
}

.shopify-utm-blog .code-value {
  color: #b56b00;
}

.shopify-utm-blog .code-base {
  color: #41556f;
}

.shopify-utm-blog .code-sep {
  color: var(--text3);
}

.shopify-utm-blog p code,
.shopify-utm-blog li code,
.shopify-utm-blog td code {
  background: var(--surface2);
  border: 1px solid var(--border);
  padding: 2px 7px;
  border-radius: 4px;
  font-size: 13px;
  color: var(--accent);
}

.shopify-utm-blog .table-wrap {
  overflow-x: auto;
  margin: 24px 0;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--surface);
}

.shopify-utm-blog table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.shopify-utm-blog thead tr {
  background: var(--surface2);
}

.shopify-utm-blog th {
  font-family: var(--font-display), sans-serif;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: var(--text3);
  padding: 14px 16px;
  text-align: left;
  border-bottom: 1px solid var(--border);
}

.shopify-utm-blog td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  color: var(--text2);
  vertical-align: top;
}

.shopify-utm-blog tr:last-child td {
  border-bottom: none;
}

.shopify-utm-blog tr:hover td {
  background: rgba(12, 166, 120, 0.02);
}

.shopify-utm-blog .tag-pill {
  display: inline-block;
  background: rgba(12, 166, 120, 0.08);
  border: 1px solid rgba(12, 166, 120, 0.2);
  color: var(--accent);
  font-size: 12px;
  padding: 2px 9px;
  border-radius: 100px;
  font-family: var(--font-mono), monospace;
  white-space: nowrap;
}

.shopify-utm-blog .tag-pill.medium {
  background: rgba(11, 116, 222, 0.08);
  border-color: rgba(11, 116, 222, 0.2);
  color: var(--accent2);
}

.shopify-utm-blog .tag-pill.warn {
  background: rgba(217, 144, 0, 0.08);
  border-color: rgba(217, 144, 0, 0.2);
  color: var(--accent3);
}

.shopify-utm-blog .steps {
  list-style: none;
  padding: 0;
  margin: 28px 0;
}

.shopify-utm-blog .steps li {
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
  align-items: flex-start;
}

.shopify-utm-blog .step-num {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--surface2);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display), sans-serif;
  font-weight: 800;
  font-size: 14px;
  color: var(--accent);
}

.shopify-utm-blog .step-body strong {
  display: block;
  color: var(--text);
  font-size: 15px;
  margin-bottom: 4px;
  font-weight: 600;
}

.shopify-utm-blog .step-body p {
  margin: 0;
  font-size: 14px;
}

.shopify-utm-blog .cta-block {
  background: linear-gradient(135deg, rgba(12, 166, 120, 0.08) 0%, rgba(11, 116, 222, 0.06) 100%);
  border: 1px solid rgba(12, 166, 120, 0.18);
  border-radius: 14px;
  padding: 40px 44px;
  margin: 48px 0;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.shopify-utm-blog .cta-block::before {
  content: "";
  position: absolute;
  top: -60px;
  right: -60px;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(12, 166, 120, 0.12) 0%, transparent 70%);
  pointer-events: none;
}

.shopify-utm-blog .cta-block h3 {
  font-family: var(--font-display), sans-serif;
  font-size: 22px;
  margin: 0 0 10px;
  color: var(--text);
}

.shopify-utm-blog .cta-block p {
  color: var(--text2);
  margin-bottom: 24px;
  font-size: 15px;
}

.shopify-utm-blog .checklist {
  list-style: none;
  padding: 0;
}

.shopify-utm-blog .checklist li {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 10px;
  font-size: 14px;
  color: var(--text2);
}

.shopify-utm-blog .checklist li::before {
  content: "✓";
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  background: rgba(12, 166, 120, 0.1);
  border: 1px solid rgba(12, 166, 120, 0.25);
  border-radius: 4px;
  color: var(--accent);
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  margin-top: 2px;
}

.shopify-utm-blog .checklist.danger li::before {
  content: "✗";
  background: rgba(214, 51, 87, 0.08);
  border-color: rgba(214, 51, 87, 0.24);
  color: var(--danger);
}

.shopify-utm-blog .compare-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin: 24px 0;
}

.shopify-utm-blog .compare-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 20px;
}

.shopify-utm-blog .compare-card h4 {
  margin-top: 0;
}

.shopify-utm-blog .compare-card ul {
  padding-left: 0;
  list-style: none;
}

.shopify-utm-blog .compare-card ul li {
  font-size: 14px;
  margin-bottom: 6px;
  padding-left: 16px;
  position: relative;
}

.shopify-utm-blog .compare-card ul li::before {
  content: "→";
  position: absolute;
  left: 0;
  color: var(--text3);
}

.shopify-utm-blog .compare-card.good {
  border-color: rgba(12, 166, 120, 0.24);
}

.shopify-utm-blog .compare-card.good h4 {
  color: var(--accent);
}

.shopify-utm-blog .compare-card.bad {
  border-color: rgba(214, 51, 87, 0.24);
}

.shopify-utm-blog .compare-card.bad h4 {
  color: var(--danger);
}

.shopify-utm-blog .faq-item {
  border: 1px solid var(--border);
  border-radius: 10px;
  margin-bottom: 12px;
  overflow: hidden;
  background: var(--surface);
}

.shopify-utm-blog .faq-q {
  font-family: var(--font-display), sans-serif;
  font-weight: 700;
  font-size: 15px;
  color: var(--text);
  padding: 18px 20px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  background: var(--surface);
  transition: background 0.2s;
  user-select: none;
}

.shopify-utm-blog .faq-q:hover {
  background: var(--surface2);
}

.shopify-utm-blog .faq-q .faq-icon {
  color: var(--accent);
  font-size: 18px;
  flex-shrink: 0;
  transition: transform 0.3s;
}

.shopify-utm-blog .faq-item.open .faq-icon {
  transform: rotate(45deg);
}

.shopify-utm-blog .faq-a {
  padding: 0 20px;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.35s ease, padding 0.2s;
  color: var(--text2);
  font-size: 14px;
  line-height: 1.7;
}

.shopify-utm-blog .faq-item.open .faq-a {
  max-height: 400px;
  padding: 18px 20px;
}

.shopify-utm-blog [id] {
  scroll-margin-top: 140px;
}

.shopify-utm-blog .hero-meta-item {
  gap: 10px;
}

.shopify-utm-blog .meta-icon {
  width: 16px;
  height: 16px;
  color: var(--text3);
  flex-shrink: 0;
}

.shopify-utm-blog .heading-with-icon {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.shopify-utm-blog .heading-icon {
  width: 18px;
  height: 18px;
  color: currentColor;
  flex-shrink: 0;
}

@media (max-width: 640px) {
  .shopify-utm-blog .hero {
    padding: 60px 20px 40px;
  }

  .shopify-utm-blog .content {
    padding: 0 20px 80px;
  }
}

@media (max-width: 600px) {
  .shopify-utm-blog .toc-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 580px) {
  .shopify-utm-blog .compare-grid {
    grid-template-columns: 1fr;
  }
}
`;

const articleHtml = `
<section class="hero">
  <div class="hero-badge">Shopify Guide 2026</div>
  <h1>Shopify UTM Tracking:<br><em>The Complete Setup Guide</em></h1>
  <p class="hero-sub">Stop guessing which campaigns drive sales in your Shopify store. This guide covers everything — UTM parameters explained, GA4 integration, channel-by-channel templates, and how to fix the Shopify vs. GA4 attribution gap.</p>
  <div class="hero-cta-row">
    <a href="https://findbest.tools/utility/utm-builder" class="btn-primary">
      <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
      Build UTM Links Free
    </a>
    <a href="#what-is-utm" class="btn-secondary">Read the guide ↓</a>
  </div>
  <div class="hero-meta">
    <div class="hero-meta-item"><span class="meta-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"></path></svg></span><span>~15 min read</span></div>
    <div class="hero-meta-item"><span class="meta-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect x="3" y="4" width="18" height="18" rx="2"></rect><path d="M3 10h18"></path></svg></span><span>Updated May 2026</span></div>
    <div class="hero-meta-item"><span class="meta-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77 5.82 21l1.18-6.86-5-4.87 6.91-1.01L12 2Z"></path></svg></span><span>Beginner to advanced</span></div>
  </div>
</section>

<div class="toc-box" style="padding: 28px 32px; margin: 0 40px 60px; position:relative; z-index:1;">
  <h2 style="margin:0 0 16px; border:none; padding:0; font-size:13px;">In This Guide</h2>
  <ul class="toc-list">
    <li><a href="#what-is-utm" data-num="01">What is UTM Tracking?</a></li>
    <li><a href="#why-shopify" data-num="02">Why Shopify Needs UTMs</a></li>
    <li><a href="#parameters" data-num="03">The 5 UTM Parameters</a></li>
    <li><a href="#shopify-analytics" data-num="04">How Shopify Reads UTMs</a></li>
    <li><a href="#ga4" data-num="05">Connecting GA4 to Shopify</a></li>
    <li><a href="#templates" data-num="06">Channel Templates</a></li>
    <li><a href="#attribution-gap" data-num="07">Fixing the Attribution Gap</a></li>
    <li><a href="#naming" data-num="08">Naming Conventions</a></li>
    <li><a href="#mistakes" data-num="09">Common Mistakes</a></li>
    <li><a href="#faq" data-num="10">FAQ</a></li>
  </ul>
</div>

<div class="content">
  <h2 id="what-is-utm">What is UTM Tracking?</h2>

  <p>UTM tracking is the practice of adding small text snippets — called UTM parameters — to the end of any URL you share in your marketing campaigns. When a visitor clicks that URL, the parameters are captured by your analytics platform and stored against their session, telling you exactly which campaign, channel, and piece of content brought them to your store.</p>

  <p>A UTM-tagged URL looks like this:</p>

  <pre><code><span class="code-base">https://yourstore.myshopify.com/products/product-name</span><span class="code-sep">?</span><span class="code-param">utm_source</span>=<span class="code-value">instagram</span><span class="code-sep">&</span><span class="code-param">utm_medium</span>=<span class="code-value">paid_social</span><span class="code-sep">&</span><span class="code-param">utm_campaign</span>=<span class="code-value">summer_launch_may2026</span></code></pre>

  <p>The URL before the <code>?</code> is your normal Shopify product URL. Everything after is UTM tracking data — invisible to the shopper, but invaluable to you.</p>

  <div class="callout callout-info">
    <div class="callout-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M12 2a7 7 0 0 0-4 12.75c.63.45 1 1.16 1 1.94V18h6v-1.31c0-.78.37-1.49 1-1.94A7 7 0 0 0 12 2Z"></path></svg></div>
    <div class="callout-body">
      <strong>Build UTM links in seconds</strong>
      <p>Don't build UTM URLs by hand — typos in parameter names break tracking silently. Use the <a href="https://findbest.tools/utility/utm-builder" style="color:var(--accent2);">free UTM builder at findbest.tools</a> to generate error-free tagged URLs for every campaign.</p>
    </div>
  </div>

  <h3>Why UTM Parameters Were Created</h3>
  <p>The name comes from Urchin Tracking Module — Urchin Software being the analytics company that Google acquired in 2005 to build Google Analytics. The five standard parameters have remained essentially unchanged since then, which is why every major analytics platform (GA4, Mixpanel, Amplitude, Heap, Adobe Analytics) recognizes and processes them automatically.</p>

  <h2 id="why-shopify">Why Your Shopify Store Needs UTM Tracking</h2>

  <p>Shopify merchants run marketing across more channels than almost any other type of business — paid ads on Meta and Google, organic social, email via Klaviyo or Shopify Email, influencer partnerships, SMS, affiliate programs, and more. Without UTM tracking, all of this activity produces the same result in your analytics: mystery.</p>

  <p>Here's what happens to your traffic data without UTMs:</p>

  <div class="compare-grid">
    <div class="compare-card bad">
      <h4><span class="heading-with-icon"><span class="heading-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path></svg></span>Without UTM Tracking</span></h4>
      <ul>
        <li>Email clicks appear as "direct" traffic</li>
        <li>Instagram traffic is missing or wrong</li>
        <li>Can't compare paid vs organic social</li>
        <li>Influencer ROI is completely invisible</li>
        <li>Can't tell which ad creative drove sales</li>
        <li>Budget decisions based on guesswork</li>
      </ul>
    </div>
    <div class="compare-card good">
      <h4><span class="heading-with-icon"><span class="heading-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg></span>With UTM Tracking</span></h4>
      <ul>
        <li>Every channel attributed correctly</li>
        <li>Campaign-level revenue visible in Shopify</li>
        <li>Paid vs organic clearly separated</li>
        <li>Individual influencer performance tracked</li>
        <li>A/B test ad creatives by conversion rate</li>
        <li>Scale spend based on actual data</li>
      </ul>
    </div>
  </div>

  <h3>The Hidden Cost of Missing UTMs</h3>
  <p>The most damaging effect of missing UTM tags isn't just incomplete data — it's misattribution. When your email campaign drives 400 sessions and 30 purchases but those sessions are labeled "direct," you might conclude your email strategy isn't working and cut it. In reality, it's your highest-ROI channel.</p>

  <p>For Shopify merchants spending on paid ads, this problem is especially acute. <strong>Every dollar of ad spend that can't be attributed is a dollar that can't be optimized.</strong></p>

  <h2 id="parameters">The 5 UTM Parameters for Shopify</h2>

  <p>There are five standard UTM parameters. Three are required for meaningful tracking; two are optional but highly valuable for Shopify stores.</p>

  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Parameter</th>
          <th>Required?</th>
          <th>What It Tracks</th>
          <th>Shopify Example</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><span class="tag-pill">utm_source</span></td>
          <td>✅ Yes</td>
          <td>Where traffic comes from</td>
          <td><code>facebook</code>, <code>klaviyo</code>, <code>google</code></td>
        </tr>
        <tr>
          <td><span class="tag-pill medium">utm_medium</span></td>
          <td>✅ Yes</td>
          <td>The marketing channel type</td>
          <td><code>email</code>, <code>cpc</code>, <code>paid_social</code></td>
        </tr>
        <tr>
          <td><span class="tag-pill">utm_campaign</span></td>
          <td>✅ Yes</td>
          <td>The specific campaign</td>
          <td><code>summer_sale_jun2026</code></td>
        </tr>
        <tr>
          <td><span class="tag-pill warn">utm_content</span></td>
          <td>Optional</td>
          <td>Which creative or link was clicked</td>
          <td><code>hero_image</code>, <code>influencer_handle</code></td>
        </tr>
        <tr>
          <td><span class="tag-pill warn">utm_term</span></td>
          <td>Optional</td>
          <td>Keyword (paid search only)</td>
          <td><code>buy+running+shoes</code></td>
        </tr>
      </tbody>
    </table>
  </div>

  <h3>utm_source — The Platform</h3>
  <p>This identifies the specific platform or publisher that sent the traffic. For Shopify stores, common sources include <code>facebook</code>, <code>instagram</code>, <code>google</code>, <code>tiktok</code>, <code>klaviyo</code>, <code>newsletter</code>, and the name of any affiliate or influencer partner. Always use the canonical, lowercase platform name.</p>

  <h3>utm_medium — The Channel Type</h3>
  <p>This is the type of marketing channel. For GA4 to correctly categorize traffic into its default channel groups, you must use specific medium values. <strong>GA4 only recognizes a fixed set of mediums by default</strong> — anything outside this list lands in "Unassigned" and disappears from channel reports.</p>

  <div class="callout callout-warn">
    <div class="callout-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M12 9v4"></path><path d="M12 17h.01"></path><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"></path></svg></div>
    <div class="callout-body">
      <strong>Critical: Use only GA4-recognized medium values</strong>
      <p>GA4 recognizes: <code>cpc</code>, <code>email</code>, <code>social</code>, <code>referral</code>, <code>organic</code>, <code>affiliate</code>, <code>display</code>. Using <code>paid</code> instead of <code>cpc</code>, or <code>paid-social</code> instead of <code>paid_social</code>, will push traffic into "Unassigned" in GA4 while it appears correctly in Shopify Analytics — causing the infamous Shopify vs GA4 discrepancy.</p>
    </div>
  </div>

  <h3>utm_campaign — The Initiative</h3>
  <p>All links across all channels for a single campaign should share the same <code>utm_campaign</code> value. This lets you see total campaign performance (sessions, conversions, revenue) across every source in a single report view. Use descriptive, date-stamped names: <code>summer_launch_jun2026</code> beats <code>launch</code> every time.</p>

  <h3>utm_content — Essential for Shopify Influencer & Ad Tracking</h3>
  <p>While optional in other contexts, <code>utm_content</code> is particularly valuable for Shopify merchants who work with influencers or run multiple ad creatives. Assign each influencer a unique <code>utm_content</code> value (<code>utm_content=influencer_johndoe</code>) — this lets you track individual influencer ROI even when all influencer campaigns share the same source and campaign tag.</p>

  <h2 id="shopify-analytics">How Shopify Reads UTM Parameters</h2>

  <p>Shopify has built-in UTM awareness, but it works differently from Google Analytics — and understanding this distinction prevents a lot of confusion.</p>

  <h3>What Shopify Stores on Orders</h3>
  <p>When a customer clicks a UTM-tagged link and completes a purchase <strong>in the same session</strong>, Shopify stores the UTM parameter values directly on the order record. You can see this in the Shopify Admin under <strong>Orders → [Order] → Conversion summary</strong>.</p>

  <p>The UTM data appears in:</p>
  <ul>
    <li><strong>Orders → Conversion summary:</strong> Shows the UTM source/medium/campaign for that order</li>
    <li><strong>Analytics → Reports → Marketing:</strong> Campaign-level sales data</li>
    <li><strong>Analytics → Reports → Acquisition:</strong> Traffic by source</li>
  </ul>

  <h3>Shopify Attribution: Last-Click, Same-Session</h3>
  <p>Shopify uses <strong>last-click, same-session attribution</strong>. This means:</p>
  <ul>
    <li>Only the final UTM tag before purchase gets credit</li>
    <li>If the customer closes the browser and comes back later, Shopify may not attribute the sale to the original campaign</li>
    <li>Cross-session journeys are credited to the last session source</li>
  </ul>

  <p>This is why Shopify and GA4 numbers often disagree — they use different attribution windows and models. We cover how to reconcile this in the <a href="#attribution-gap" style="color:var(--accent);">Attribution Gap section</a>.</p>

  <div class="callout callout-success">
    <div class="callout-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg></div>
    <div class="callout-body">
      <strong>Shopify Plus Checkout Note</strong>
      <p>On Shopify Plus stores using a custom checkout domain, UTM parameters can be stripped during the checkout handoff. If you're on Shopify Plus, verify that UTM data survives checkout by test-purchasing with a tagged link and checking the resulting order's conversion summary.</p>
    </div>
  </div>

  <h2 id="ga4">Connecting GA4 to Your Shopify Store</h2>

  <p>For full UTM campaign analysis — multi-session attribution, engagement metrics, conversion funnels — you need Google Analytics 4 connected to your Shopify store. GA4 gives you everything Shopify Analytics doesn't: engagement rate, average session duration, user journeys, and full UTM dimension breakdowns.</p>

  <ol class="steps">
    <li>
      <div class="step-num">1</div>
      <div class="step-body">
        <strong>Create a GA4 Property</strong>
        <p>Go to analytics.google.com → Admin → Create Property. Select "Web" and enter your Shopify store URL. Note your Measurement ID (format: G-XXXXXXXXXX).</p>
      </div>
    </li>
    <li>
      <div class="step-num">2</div>
      <div class="step-body">
        <strong>Install via Shopify's Google & YouTube App</strong>
        <p>In Shopify Admin → Apps → Google & YouTube. Connect your Google account, select your GA4 property. The app automatically adds the GA4 tracking script to all Shopify pages including checkout (on Shopify Plus).</p>
      </div>
    </li>
    <li>
      <div class="step-num">3</div>
      <div class="step-body">
        <strong>Or install via Google Tag Manager</strong>
        <p>For more control: install GTM on Shopify (add GTM snippets to theme.liquid), then fire your GA4 tag through GTM. This gives you event-level flexibility without touching code for every new tag.</p>
      </div>
    </li>
    <li>
      <div class="step-num">4</div>
      <div class="step-body">
        <strong>Configure GA4 Ecommerce Events</strong>
        <p>Enable Enhanced Ecommerce to capture <code>purchase</code>, <code>add_to_cart</code>, <code>begin_checkout</code>, and <code>view_item</code> events. Mark <code>purchase</code> as a conversion. This connects UTM data to actual revenue.</p>
      </div>
    </li>
    <li>
      <div class="step-num">5</div>
      <div class="step-body">
        <strong>Verify UTM Data is Flowing</strong>
        <p>Click a UTM-tagged link to your store, then check GA4 → Realtime → Traffic Sources. You should see your UTM source and medium appear within seconds of the click.</p>
      </div>
    </li>
  </ol>

  <h3>Finding UTM Data in GA4</h3>
  <p>Once GA4 is connected and you're generating UTM-tagged traffic:</p>
  <ul>
    <li><strong>Reports → Acquisition → Traffic Acquisition:</strong> Change dimension to "Session source/medium" or "Session campaign"</li>
    <li><strong>Reports → Acquisition → Traffic Acquisition → Session campaign:</strong> See revenue and conversions per campaign</li>
    <li><strong>Explore → Free Form:</strong> Add "Session manual ad content" dimension for <code>utm_content</code> data</li>
    <li><strong>Advertising → Attribution → Conversion Paths:</strong> See multi-touch journeys across campaigns</li>
  </ul>

  <div class="cta-block">
    <h3>Build Your Shopify UTM Links in Seconds</h3>
    <p>Use the free UTM builder — enter your Shopify product or landing page URL, fill in the fields, copy the tagged link. No typos, no formatting errors.</p>
    <a href="https://findbest.tools/utility/utm-builder" class="btn-primary" style="display:inline-flex;">
      <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
      Open UTM Builder → findbest.tools
    </a>
  </div>

  <h2 id="templates">UTM Templates by Channel</h2>

  <p>Copy these templates for every channel your Shopify store uses. Replace values in brackets. Build each URL at <a href="https://findbest.tools/utility/utm-builder" style="color:var(--accent);">findbest.tools/utility/utm-builder</a>.</p>

  <h3>Meta Ads (Facebook & Instagram)</h3>
  <div class="table-wrap">
    <table>
      <thead><tr><th>Surface</th><th>utm_source</th><th>utm_medium</th><th>utm_content</th></tr></thead>
      <tbody>
        <tr><td>Facebook Feed Ad</td><td><code>facebook</code></td><td><code>cpc</code></td><td><code>carousel_v1</code></td></tr>
        <tr><td>Instagram Feed Ad</td><td><code>instagram</code></td><td><code>cpc</code></td><td><code>single_image_v2</code></td></tr>
        <tr><td>Instagram Story Ad</td><td><code>instagram</code></td><td><code>cpc</code></td><td><code>story_ad</code></td></tr>
        <tr><td>Facebook Organic Post</td><td><code>facebook</code></td><td><code>social</code></td><td><code>feed_post</code></td></tr>
        <tr><td>Instagram Organic Story</td><td><code>instagram</code></td><td><code>social</code></td><td><code>story</code></td></tr>
        <tr><td>Instagram Bio Link</td><td><code>instagram</code></td><td><code>social</code></td><td><code>bio</code></td></tr>
      </tbody>
    </table>
  </div>

  <pre><code><span class="code-base">https://yourstore.com/products/item</span><span class="code-sep">?</span><span class="code-param">utm_source</span>=<span class="code-value">facebook</span><span class="code-sep">&</span><span class="code-param">utm_medium</span>=<span class="code-value">cpc</span><span class="code-sep">&</span><span class="code-param">utm_campaign</span>=<span class="code-value">summer_sale_jun2026</span><span class="code-sep">&</span><span class="code-param">utm_content</span>=<span class="code-value">carousel_v1</span></code></pre>

  <div class="callout callout-warn">
    <div class="callout-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M12 9v4"></path><path d="M12 17h.01"></path><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"></path></svg></div>
    <div class="callout-body">
      <strong>Meta Ads Manager default UTM is wrong</strong>
      <p>Meta's auto-generated UTM template sets <code>utm_medium=paid</code> — which GA4 does not recognize as Paid Social. This pushes all your Meta ad traffic into "Unassigned." Always override with <code>utm_medium=cpc</code> in the ad's URL Parameters field.</p>
    </div>
  </div>

  <h3>Email Marketing (Klaviyo, Shopify Email, Mailchimp)</h3>
  <div class="table-wrap">
    <table>
      <thead><tr><th>Email Type</th><th>utm_source</th><th>utm_medium</th><th>utm_campaign</th></tr></thead>
      <tbody>
        <tr><td>Newsletter / Broadcast</td><td><code>newsletter</code></td><td><code>email</code></td><td><code>newsletter_may2026</code></td></tr>
        <tr><td>Abandoned Cart Flow</td><td><code>klaviyo</code></td><td><code>email</code></td><td><code>flow_abandoned_cart</code></td></tr>
        <tr><td>Welcome Series</td><td><code>klaviyo</code></td><td><code>email</code></td><td><code>flow_welcome_email1</code></td></tr>
        <tr><td>Post-Purchase Flow</td><td><code>klaviyo</code></td><td><code>email</code></td><td><code>flow_post_purchase</code></td></tr>
        <tr><td>Win-Back Campaign</td><td><code>newsletter</code></td><td><code>email</code></td><td><code>winback_apr2026</code></td></tr>
      </tbody>
    </table>
  </div>

  <pre><code><span class="code-base">https://yourstore.com/collections/sale</span><span class="code-sep">?</span><span class="code-param">utm_source</span>=<span class="code-value">newsletter</span><span class="code-sep">&</span><span class="code-param">utm_medium</span>=<span class="code-value">email</span><span class="code-sep">&</span><span class="code-param">utm_campaign</span>=<span class="code-value">summer_sale_jun2026</span><span class="code-sep">&</span><span class="code-param">utm_content</span>=<span class="code-value">hero_cta</span></code></pre>

  <h3>Google Ads</h3>
  <p>For Google Ads, enable <strong>auto-tagging</strong> in the Google Ads account settings — this adds the <code>gclid</code> parameter automatically. However, also set manual UTMs in your final URL suffix so Shopify Analytics can read campaign data (it doesn't read <code>gclid</code>).</p>
  <pre><code><span class="code-base">https://yourstore.com/products/item</span><span class="code-sep">?</span><span class="code-param">utm_source</span>=<span class="code-value">google</span><span class="code-sep">&</span><span class="code-param">utm_medium</span>=<span class="code-value">cpc</span><span class="code-sep">&</span><span class="code-param">utm_campaign</span>=<span class="code-value">brand_search_jun2026</span><span class="code-sep">&</span><span class="code-param">utm_term</span>=<span class="code-value">{keyword}</span></code></pre>

  <h3>TikTok Ads</h3>
  <pre><code><span class="code-base">https://yourstore.com/products/item</span><span class="code-sep">?</span><span class="code-param">utm_source</span>=<span class="code-value">tiktok</span><span class="code-sep">&</span><span class="code-param">utm_medium</span>=<span class="code-value">cpc</span><span class="code-sep">&</span><span class="code-param">utm_campaign</span>=<span class="code-value">summer_ugc_may2026</span><span class="code-sep">&</span><span class="code-param">utm_content</span>=<span class="code-value">video_v1</span></code></pre>

  <h3>Influencer Marketing</h3>
  <p>Give every influencer a unique <code>utm_content</code> value. This lets you compare revenue per influencer even when they're all promoting the same campaign.</p>
  <pre><code><span class="code-base">https://yourstore.com/products/item</span><span class="code-sep">?</span><span class="code-param">utm_source</span>=<span class="code-value">instagram</span><span class="code-sep">&</span><span class="code-param">utm_medium</span>=<span class="code-value">influencer</span><span class="code-sep">&</span><span class="code-param">utm_campaign</span>=<span class="code-value">influencer_summer2026</span><span class="code-sep">&</span><span class="code-param">utm_content</span>=<span class="code-value">@janedoe</span></code></pre>

  <h3>SMS Campaigns</h3>
  <pre><code><span class="code-base">https://yourstore.com/collections/sale</span><span class="code-sep">?</span><span class="code-param">utm_source</span>=<span class="code-value">sms</span><span class="code-sep">&</span><span class="code-param">utm_medium</span>=<span class="code-value">sms</span><span class="code-sep">&</span><span class="code-param">utm_campaign</span>=<span class="code-value">flash_sale_may2026</span></code></pre>
  <p><em>For SMS, always shorten the UTM URL. Long URLs look suspicious in text messages and reduce click rates.</em></p>

  <h3>Affiliate & Referral Partners</h3>
  <pre><code><span class="code-base">https://yourstore.com</span><span class="code-sep">?</span><span class="code-param">utm_source</span>=<span class="code-value">partner_name</span><span class="code-sep">&</span><span class="code-param">utm_medium</span>=<span class="code-value">affiliate</span><span class="code-sep">&</span><span class="code-param">utm_campaign</span>=<span class="code-value">affiliate_program_2026</span></code></pre>

  <h2 id="attribution-gap">Fixing the Shopify vs. GA4 Attribution Gap</h2>

  <p>The single most frustrating aspect of Shopify UTM tracking is the gap between Shopify Analytics numbers and GA4 numbers. The same campaign shows different sessions, conversions, and revenue in each platform. Here's exactly why — and how to minimize it.</p>

  <h3>Why the Numbers Disagree</h3>
  <div class="table-wrap">
    <table>
      <thead><tr><th>Factor</th><th>Shopify</th><th>GA4</th></tr></thead>
      <tbody>
        <tr><td>Attribution model</td><td>Last-click, same-session</td><td>Data-driven (or last-click)</td></tr>
        <tr><td>Attribution window</td><td>Session only</td><td>Up to 90 days (configurable)</td></tr>
        <tr><td>Bot/spam filtering</td><td>Minimal</td><td>More aggressive</td></tr>
        <tr><td>Checkout tracking</td><td>Native (all orders)</td><td>Requires correct setup</td></tr>
        <tr><td>Returns/refunds</td><td>Adjusts revenue</td><td>Doesn't auto-adjust</td></tr>
      </tbody>
    </table>
  </div>

  <h3>Three Steps to Reduce the Gap</h3>

  <ol class="steps">
    <li>
      <div class="step-num">1</div>
      <div class="step-body">
        <strong>Standardize medium values to GA4 defaults</strong>
        <p>Use only GA4-recognized medium values: <code>cpc</code>, <code>email</code>, <code>social</code>, <code>affiliate</code>, <code>referral</code>, <code>display</code>. This single change closes 80% of the channel-grouping disagreements between Shopify and GA4.</p>
      </div>
    </li>
    <li>
      <div class="step-num">2</div>
      <div class="step-body">
        <strong>Verify GA4 purchase events are firing correctly</strong>
        <p>In GA4 → Realtime, complete a test purchase and confirm the <code>purchase</code> event fires with the correct revenue value. If purchase events are missing or undercounting, your GA4 conversion data will always be lower than Shopify.</p>
      </div>
    </li>
    <li>
      <div class="step-num">3</div>
      <div class="step-body">
        <strong>Use Shopify as your revenue source of truth</strong>
        <p>Treat Shopify Analytics as the definitive revenue number (it processes actual payments) and GA4 as your campaign attribution and behavior analysis tool. Don't try to make them match exactly — use each for what it's best at.</p>
      </div>
    </li>
  </ol>

  <h2 id="naming">UTM Naming Convention for Shopify Stores</h2>

  <p>Consistent naming conventions are what separate clean, trustworthy analytics from a fragmented mess. Here is a complete naming system optimized for Shopify merchants.</p>

  <h4>The Core Rules</h4>
  <ul class="checklist">
    <li>Always lowercase — <code>facebook</code> not <code>Facebook</code></li>
    <li>No spaces — use underscores: <code>summer_sale</code> not <code>summer sale</code></li>
    <li>No special characters — no &amp;, #, %, !, @</li>
    <li>Date-stamp campaigns — <code>sale_may2026</code> not just <code>sale</code></li>
    <li>Keep values consistent — one name per platform, forever</li>
  </ul>

  <h4>Shopify Campaign Naming Formula</h4>
  <pre><code>[channel]_[description]_[month][year]

Examples:
email_abandoned_cart_flow           (evergreen)
email_newsletter_may2026            (broadcast)
paid_summer_sale_jun2026            (paid ads)
social_product_launch_apr2026       (organic social)
influencer_collab_johndoe_may2026   (influencer)</code></pre>

  <h4>Approved Source Values for Shopify</h4>
  <div class="table-wrap">
    <table>
      <thead><tr><th>Platform</th><th>utm_source</th><th>utm_medium</th></tr></thead>
      <tbody>
        <tr><td>Facebook Ads</td><td><code>facebook</code></td><td><code>cpc</code></td></tr>
        <tr><td>Instagram Ads</td><td><code>instagram</code></td><td><code>cpc</code></td></tr>
        <tr><td>Google Shopping</td><td><code>google</code></td><td><code>cpc</code></td></tr>
        <tr><td>TikTok Ads</td><td><code>tiktok</code></td><td><code>cpc</code></td></tr>
        <tr><td>Pinterest Ads</td><td><code>pinterest</code></td><td><code>cpc</code></td></tr>
        <tr><td>Klaviyo Email</td><td><code>klaviyo</code></td><td><code>email</code></td></tr>
        <tr><td>Newsletter</td><td><code>newsletter</code></td><td><code>email</code></td></tr>
        <tr><td>SMS</td><td><code>sms</code></td><td><code>sms</code></td></tr>
        <tr><td>Organic Instagram</td><td><code>instagram</code></td><td><code>social</code></td></tr>
        <tr><td>Influencer</td><td><code>instagram</code> (or platform)</td><td><code>influencer</code></td></tr>
        <tr><td>Affiliate</td><td><code>[partner_name]</code></td><td><code>affiliate</code></td></tr>
      </tbody>
    </table>
  </div>

  <h2 id="mistakes">Common UTM Mistakes Shopify Merchants Make</h2>

  <h3><span class="heading-with-icon"><span class="heading-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path></svg></span>Tagging Internal Links</span></h3>
  <p>Never add UTM parameters to links that go between pages <em>within your own Shopify store</em>. If a visitor lands from an Instagram ad and then clicks an internal banner with UTM parameters, Shopify and GA4 reset their session — and your Instagram ad gets zero credit for the eventual purchase. UTMs are for external links only.</p>

  <h3><span class="heading-with-icon"><span class="heading-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path></svg></span>Using Wrong Medium Values for Paid Ads</span></h3>
  <p>Using <code>utm_medium=paid</code> or <code>utm_medium=paid-social</code> instead of <code>utm_medium=cpc</code> pushes paid traffic into GA4's "Unassigned" channel. Always use <code>cpc</code> for any paid placement, regardless of platform.</p>

  <h3><span class="heading-with-icon"><span class="heading-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path></svg></span>Not Tagging Klaviyo Flows</span></h3>
  <p>Most Shopify merchants tag their broadcast emails but forget to tag automated flows — abandoned cart, welcome series, post-purchase. These flows are often your highest-converting traffic sources. Tag every link in every flow.</p>

  <h3><span class="heading-with-icon"><span class="heading-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path></svg></span>Building URLs Manually</span></h3>
  <p>A typo like <code>utm_souce</code> instead of <code>utm_source</code> breaks tracking invisibly. The URL still works — the shopper lands on your product page — but zero tracking data is captured. Use <a href="https://findbest.tools/utility/utm-builder" style="color:var(--accent);">findbest.tools/utility/utm-builder</a> for every single UTM URL.</p>

  <h3><span class="heading-with-icon"><span class="heading-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path></svg></span>Not Tagging the Instagram Bio Link</span></h3>
  <p>Your Instagram bio link is often one of your highest-traffic URLs. Without a UTM tag, all that traffic arrives as "direct" — completely invisible in your attribution reports. Tag it with an evergreen campaign and update the campaign name when actively promoting something specific.</p>

  <h2 id="faq">Frequently Asked Questions</h2>

  <div class="faq-item">
    <div class="faq-q">Does Shopify support UTM tracking natively?<span class="faq-icon">+</span></div>
    <div class="faq-a">Shopify partially supports UTM tracking. It reads UTM parameters from incoming URLs and stores them on orders when a customer converts in the same session — visible in each order's Conversion Summary. For full campaign analysis, multi-session attribution, and engagement metrics, you need Google Analytics 4 connected to your store.</div>
  </div>

  <div class="faq-item">
    <div class="faq-q">Why does my Shopify Analytics show different numbers than GA4?<span class="faq-icon">+</span></div>
    <div class="faq-a">Shopify uses last-click, same-session attribution while GA4 defaults to data-driven attribution with a different window. They also handle bot traffic, returns, and cross-device journeys differently. Standardizing your UTM medium values to GA4's recognized list closes most channel-grouping disagreements. Use Shopify as your revenue source of truth and GA4 for behavioral and campaign analysis.</div>
  </div>

  <div class="faq-item">
    <div class="faq-q">Will UTM parameters hurt my Shopify store's SEO?<span class="faq-icon">+</span></div>
    <div class="faq-a">No. UTM parameters are ignored by Google's crawlers and do not influence search rankings. Shopify automatically adds canonical tags to product and collection pages, which prevents any duplicate content concerns from UTM-tagged URLs.</div>
  </div>

  <div class="faq-item">
    <div class="faq-q">How do I track Klaviyo flows with UTM parameters?<span class="faq-icon">+</span></div>
    <div class="faq-a">In Klaviyo, go to the flow email → Edit → click on a button or text link → change the URL to your UTM-tagged version. For flows, use evergreen campaign names without dates: utm_campaign=flow_abandoned_cart or utm_campaign=flow_welcome_email2. This lets you compare flow performance across time without fragmenting data.</div>
  </div>

  <div class="faq-item">
    <div class="faq-q">Can I use UTM tracking with Shopify's built-in email tool?<span class="faq-icon">+</span></div>
    <div class="faq-a">Yes. In Shopify Admin → Marketing → Email, you can add UTM parameters to each campaign. Shopify Email does have some auto-tracking, but it's limited — manually adding UTM parameters gives you full control and consistent data across all email platforms you might use.</div>
  </div>

  <div class="faq-item">
    <div class="faq-q">How do I track QR codes on physical products or packaging?<span class="faq-icon">+</span></div>
    <div class="faq-a">Generate a UTM-tagged URL using utm_source=qr_code, utm_medium=print, and utm_campaign=[packaging_type]. Create the QR code from this tagged URL. This lets you track offline-to-online conversions from packaging inserts, business cards, and in-store displays — bridging physical and ecommerce attribution.</div>
  </div>

  <div class="faq-item">
    <div class="faq-q">Should I use UTM parameters on Google Ads with auto-tagging enabled?<span class="faq-icon">+</span></div>
    <div class="faq-a">Yes — use both. Google's auto-tagging adds the gclid parameter for GA4 attribution, but Shopify Analytics doesn't read gclid. Set manual UTM parameters in the Google Ads "Final URL Suffix" field so Shopify can also capture campaign data. Both auto-tagging and manual UTMs coexist without conflict.</div>
  </div>

  <div class="cta-block" style="margin-top: 60px;">
    <h3>Start Tracking Your Shopify Campaigns Right Now</h3>
    <p>Every campaign you run without UTM links is invisible in your analytics. It takes 30 seconds to build a tagged link — and the data it gives you is worth far more than that.</p>
    <a href="https://findbest.tools/utility/utm-builder" class="btn-primary" style="display:inline-flex; margin-bottom:16px;">
      <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
      Build Free UTM Links at findbest.tools
    </a>
    <p style="font-size:13px; color:var(--text3); margin:0;">Free, no signup required. Works for any Shopify store URL.</p>
  </div>
</div>
`;

export default function ShopifyUtmTrackingBlogClient() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const faqItems = Array.from(root.querySelectorAll<HTMLElement>(".faq-item"));
    const faqQuestions = Array.from(root.querySelectorAll<HTMLElement>(".faq-q"));
    const faqHandlers = faqQuestions.map((question) => {
      const handler = () => {
        const item = question.closest(".faq-item");
        const isOpen = item?.classList.contains("open");

        faqItems.forEach((faqItem) => faqItem.classList.remove("open"));
        if (item && !isOpen) {
          item.classList.add("open");
        }
      };

      question.addEventListener("click", handler);
      return { question, handler };
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            target.style.opacity = "1";
            target.style.transform = "translateY(0)";
            observer.unobserve(target);
          }
        });
      },
      { threshold: 0.1 },
    );

    const animatedElements = Array.from(
      root.querySelectorAll<HTMLElement>("h2, .cta-block, .callout, .compare-grid"),
    );

    animatedElements.forEach((element) => {
      element.style.opacity = "0";
      element.style.transform = "translateY(18px)";
      element.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      observer.observe(element);
    });

    return () => {
      faqHandlers.forEach(({ question, handler }) => {
        question.removeEventListener("click", handler);
      });
      observer.disconnect();
    };
  }, []);

  return (
    <article className="shopify-utm-blog" ref={rootRef}>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div dangerouslySetInnerHTML={{ __html: articleHtml }} />
    </article>
  );
}
