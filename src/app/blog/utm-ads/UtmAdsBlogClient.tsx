"use client";

import { useEffect } from "react";
import { 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle2, 
  Link as LinkIcon, 
  ArrowDown, 
  ArrowRight, 
  Plus, 
  Check, 
  X 
} from "lucide-react";

const styles = `
  .utm-ads-blog {
    --bg: #ffffff;
    --bg2: #f8fafc;
    --surface: #ffffff;
    --surface2: #f1f5f9;
    --border: #e2e8f0;
    --border2: #cbd5e1;
    --accent: #2563eb;
    --accent-glow: rgba(37, 99, 235, 0.08);
    --accent2: #10b981;
    --accent3: #f59e0b;
    --accent4: #8b5cf6;
    --danger: #ef4444;
    --text: #0f172a;
    --text2: #475569;
    --text3: #64748b;
    --google: #ea4335;
    --meta: #1877f2;
    --tiktok: #ff0050;
    --linkedin: #0a66c2;
    --pinterest: #e60023;
    position: relative;
    isolation: isolate;
    background: var(--bg);
    color: var(--text);
    line-height: 1.7;
    font-size: 16px;
    overflow-x: hidden;
    padding-bottom: 80px;
  }

  /* grid texture */
  .utm-ads-blog::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(var(--border) 1px, transparent 1px),
      linear-gradient(90deg, var(--border) 1px, transparent 1px);
    background-size: 60px 60px;
    opacity: 0.2;
    pointer-events: none;
    z-index: 0;
  }

  .utm-ads-blog .hero {
    position: relative; z-index: 1;
    padding: 80px 48px 56px;
    max-width: 900px; margin: 0 auto;
  }

  .utm-ads-blog .hero::before {
    content: '';
    position: absolute;
    top: -100px; left: -200px;
    width: 700px; height: 500px;
    background: radial-gradient(ellipse, rgba(37, 99, 235, 0.05) 0%, transparent 65%);
    pointer-events: none;
  }

  .utm-ads-blog .hero-eyebrow {
    display: inline-flex; align-items: center; gap: 10px;
    font-family: var(--font-display), sans-serif;
    font-size: 12px; font-weight: 600;
    letter-spacing: 1.5px; text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 24px;
  }

  .utm-ads-blog .hero-eyebrow::before, .utm-ads-blog .hero-eyebrow::after {
    content: '';
    height: 1px; width: 24px;
    background: var(--accent);
    opacity: 0.5;
  }

  .utm-ads-blog h1 {
    font-family: var(--font-display), sans-serif;
    font-weight: 700;
    font-size: clamp(30px, 4.5vw, 50px);
    line-height: 1.12;
    letter-spacing: -1.5px;
    margin-bottom: 22px;
    color: var(--text);
  }

  .utm-ads-blog h1 .hl { color: var(--accent); }
  .utm-ads-blog h1 .hl2 { color: var(--accent2); }

  .utm-ads-blog .hero-desc {
    font-size: 17px;
    color: var(--text2);
    max-width: 640px;
    line-height: 1.65;
    margin-bottom: 36px;
  }

  .utm-ads-blog .hero-btns { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 40px; }

  .utm-ads-blog .btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--accent);
    color: white;
    font-family: var(--font-display), sans-serif;
    font-weight: 600; font-size: 15px;
    padding: 13px 26px; border-radius: 8px;
    text-decoration: none; transition: all 0.2s;
  }
  .utm-ads-blog .btn-primary:hover { background: #1d4ed8; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(37, 99, 235, 0.2); }

  .utm-ads-blog .btn-ghost {
    display: inline-flex; align-items: center; gap: 8px;
    border: 1px solid var(--border2);
    background: var(--bg2);
    color: var(--text2); font-size: 14px;
    padding: 13px 22px; border-radius: 8px;
    text-decoration: none; transition: all 0.2s;
  }
  .utm-ads-blog .btn-ghost:hover { border-color: var(--accent); color: var(--accent); }

  .utm-ads-blog .platform-row {
    display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
  }

  .utm-ads-blog .platform-row p {
    font-size: 12px; color: var(--text3);
    font-family: var(--font-display), sans-serif;
    letter-spacing: 0.5px; text-transform: uppercase;
    margin: 0;
  }

  .utm-ads-blog .platform-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 5px 10px;
    font-size: 12px; font-weight: 600;
    color: var(--text2);
    font-family: var(--font-display), sans-serif;
  }

  .utm-ads-blog .dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
  .utm-ads-blog .dot-google { background: var(--google); }
  .utm-ads-blog .dot-meta { background: var(--meta); }
  .utm-ads-blog .dot-tiktok { background: var(--tiktok); }
  .utm-ads-blog .dot-linkedin { background: var(--linkedin); }
  .utm-ads-blog .dot-pinterest { background: var(--pinterest); }
  .utm-ads-blog .dot-blue { background: var(--accent2); }

  .utm-ads-blog .toc {
    position: relative; z-index: 1;
    max-width: 900px; margin: 0 auto 56px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 28px 32px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.03);
  }

  .utm-ads-blog .toc-label {
    font-family: var(--font-display), sans-serif;
    font-weight: 700; font-size: 11px;
    letter-spacing: 2px; text-transform: uppercase;
    color: var(--text3); margin-bottom: 16px;
  }

  .utm-ads-blog .toc-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 6px 28px;
  }
  @media (max-width: 540px) { .utm-ads-blog .toc-grid { grid-template-columns: 1fr; } }

  .utm-ads-blog .toc-grid a {
    display: flex; align-items: center; gap: 10px;
    color: var(--text2); text-decoration: none;
    font-size: 14px; padding: 4px 0;
    transition: color 0.2s;
  }
  .utm-ads-blog .toc-grid a:hover { color: var(--accent); }
  .utm-ads-blog .toc-grid a .toc-num {
    font-family: var(--font-display), sans-serif;
    font-size: 11px; font-weight: 700;
    color: var(--text3); min-width: 20px;
  }

  .utm-ads-blog .content {
    max-width: 900px; margin: 0 auto;
    padding: 0 48px 100px;
    position: relative; z-index: 1;
  }
  @media (max-width: 640px) { .utm-ads-blog .content { padding: 0 20px 80px; } .utm-ads-blog .hero { padding: 56px 20px 40px; } }

  .utm-ads-blog h2 {
    font-family: var(--font-display), sans-serif;
    font-weight: 700;
    font-size: clamp(20px, 2.8vw, 27px);
    letter-spacing: -0.6px;
    color: var(--text);
    margin: 64px 0 18px;
    padding-top: 20px;
    border-top: 1px solid var(--border);
  }

  .utm-ads-blog h3 {
    font-family: var(--font-display), sans-serif;
    font-weight: 600; font-size: 18px;
    color: var(--text);
    margin: 36px 0 12px;
  }

  .utm-ads-blog h4 {
    font-family: var(--font-display), sans-serif;
    font-weight: 600; font-size: 14px;
    text-transform: uppercase; letter-spacing: 1px;
    color: var(--text3);
    margin: 28px 0 10px;
  }

  .utm-ads-blog p { color: var(--text2); margin-bottom: 16px; }
  .utm-ads-blog p strong { color: var(--text); font-weight: 600; }
  .utm-ads-blog a { color: var(--accent); text-decoration: none; }
  .utm-ads-blog a:hover { text-decoration: underline; }

  .utm-ads-blog ul, .utm-ads-blog ol { color: var(--text2); padding-left: 22px; margin-bottom: 16px; }
  .utm-ads-blog li { margin-bottom: 8px; }
  .utm-ads-blog li strong { color: var(--text); }

  .utm-ads-blog .platform-header {
    display: flex; align-items: center; gap: 14px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 18px 22px;
    margin: 36px 0 20px;
  }

  .utm-ads-blog .platform-icon {
    width: 38px; height: 38px;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; flex-shrink: 0;
    font-weight: 800;
    font-family: var(--font-display), sans-serif;
  }

  .utm-ads-blog .icon-google { background: rgba(234,67,53,0.08); color: var(--google); border: 1px solid rgba(234,67,53,0.15); }
  .utm-ads-blog .icon-meta { background: rgba(24,119,242,0.08); color: var(--meta); border: 1px solid rgba(24,119,242,0.15); }
  .utm-ads-blog .icon-tiktok { background: rgba(255,0,80,0.05); color: var(--tiktok); border: 1px solid rgba(255,0,80,0.1); }
  .utm-ads-blog .icon-linkedin { background: rgba(10,102,194,0.08); color: var(--linkedin); border: 1px solid rgba(10,102,194,0.15); }
  .utm-ads-blog .icon-pinterest { background: rgba(230,0,35,0.05); color: var(--pinterest); border: 1px solid rgba(230,0,35,0.1); }
  .utm-ads-blog .icon-other { background: rgba(139,92,246,0.08); color: var(--accent4); border: 1px solid rgba(139,92,246,0.15); }

  .utm-ads-blog .platform-info strong {
    font-family: var(--font-display), sans-serif;
    font-weight: 700; font-size: 16px; color: var(--text);
    display: block; margin-bottom: 2px;
  }

  .utm-ads-blog .platform-info span { font-size: 13px; color: var(--text3); }

  .utm-ads-blog .code-block {
    background: #f8fafc;
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 20px 24px;
    overflow-x: auto;
    margin: 16px 0;
    position: relative;
  }

  .utm-ads-blog .code-block-label {
    position: absolute; top: 10px; right: 14px;
    font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase;
    color: var(--text3);
    font-family: var(--font-display), sans-serif; font-weight: 600;
  }

  .utm-ads-blog code {
    font-family: var(--font-mono), monospace;
    font-size: 13px; line-height: 1.85;
    color: #2563eb;
    white-space: pre-wrap; word-break: break-all;
  }

  .utm-ads-blog .cp { color: #059669; }
  .utm-ads-blog .cv { color: #d97706; }
  .utm-ads-blog .cb { color: #64748b; }
  .utm-ads-blog .cs { color: #94a3b8; }
  .utm-ads-blog .cd { color: #7c3aed; }

  .utm-ads-blog p code, .utm-ads-blog li code, .utm-ads-blog td code {
    background: var(--surface2);
    border: 1px solid var(--border);
    padding: 2px 7px; border-radius: 4px;
    font-size: 13px; color: var(--accent);
  }

  .utm-ads-blog .table-wrap { overflow-x: auto; margin: 20px 0; border-radius: 10px; border: 1px solid var(--border); background: #ffffff; }
  .utm-ads-blog table { width: 100%; border-collapse: collapse; font-size: 14px; }
  .utm-ads-blog thead tr { background: var(--surface2); }
  .utm-ads-blog th {
    font-family: var(--font-display), sans-serif;
    font-weight: 600; font-size: 11px;
    letter-spacing: 1px; text-transform: uppercase;
    color: var(--text3); padding: 13px 16px;
    text-align: left; border-bottom: 1px solid var(--border);
  }
  .utm-ads-blog td { padding: 12px 16px; border-bottom: 1px solid var(--border); color: var(--text2); vertical-align: top; }
  .utm-ads-blog tr:last-child td { border-bottom: none; }
  .utm-ads-blog tr:hover td { background: rgba(0,0,0,0.01); }

  .utm-ads-blog .pill {
    display: inline-block;
    padding: 2px 9px; border-radius: 100px;
    font-size: 12px; font-family: var(--font-mono), monospace;
    white-space: nowrap;
  }
  .utm-ads-blog .pill-blue { background: rgba(37, 99, 235, 0.06); border: 1px solid rgba(37, 99, 235, 0.15); color: #2563eb; }
  .utm-ads-blog .pill-green { background: rgba(16, 185, 129, 0.06); border: 1px solid rgba(16, 185, 129, 0.15); color: #059669; }
  .utm-ads-blog .pill-amber { background: rgba(245, 158, 11, 0.06); border: 1px solid rgba(245, 158, 11, 0.15); color: #d97706; }
  .utm-ads-blog .pill-purple { background: rgba(124, 58, 237, 0.06); border: 1px solid rgba(124, 58, 237, 0.15); color: #7c3aed; }

  .utm-ads-blog .callout {
    border-radius: 10px; padding: 18px 22px;
    margin: 24px 0;
    display: flex; gap: 14px; align-items: flex-start;
  }
  .utm-ads-blog .callout-icon { font-size: 18px; flex-shrink: 0; margin-top: 2px; }
  .utm-ads-blog .callout-body { flex: 1; }
  .utm-ads-blog .callout-body strong { display: block; font-size: 14px; font-weight: 600; margin-bottom: 5px; color: var(--text); }
  .utm-ads-blog .callout-body p, .utm-ads-blog .callout-body { font-size: 14px; color: var(--text2); margin: 0; }

  .utm-ads-blog .callout-blue { background: rgba(37, 99, 235, 0.04); border: 1px solid rgba(37, 99, 235, 0.12); }
  .utm-ads-blog .callout-amber { background: rgba(245, 158, 11, 0.04); border: 1px solid rgba(245, 158, 11, 0.12); }
  .utm-ads-blog .callout-amber .callout-body strong { color: #d97706; }
  .utm-ads-blog .callout-green { background: rgba(16, 185, 129, 0.04); border: 1px solid rgba(16, 185, 129, 0.12); }
  .utm-ads-blog .callout-green .callout-body strong { color: #059669; }
  .utm-ads-blog .callout-red { background: rgba(239, 68, 68, 0.04); border: 1px solid rgba(239, 68, 68, 0.12); }
  .utm-ads-blog .callout-red .callout-body strong { color: #dc2626; }

  .utm-ads-blog .steps { list-style: none; padding: 0; margin: 24px 0; }
  .utm-ads-blog .steps li { display: flex; gap: 18px; margin-bottom: 22px; align-items: flex-start; }
  .utm-ads-blog .step-n {
    flex-shrink: 0; width: 32px; height: 32px;
    border-radius: 7px;
    background: var(--surface2); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-display), sans-serif;
    font-weight: 700; font-size: 13px; color: var(--accent);
    margin-top: 1px;
  }
  .utm-ads-blog .step-body strong { display: block; color: var(--text); font-size: 15px; margin-bottom: 4px; font-weight: 600; }
  .utm-ads-blog .step-body p { margin: 0; font-size: 14px; color: var(--text2); }

  .utm-ads-blog .cta-block {
    background: linear-gradient(135deg, rgba(37, 99, 235, 0.05), rgba(16, 185, 129, 0.04));
    border: 1px solid rgba(37, 99, 235, 0.1);
    border-radius: 14px;
    padding: 40px 44px;
    margin: 48px 0;
    text-align: center;
    position: relative; overflow: hidden;
  }
  .utm-ads-blog .cta-block h3 {
    font-family: var(--font-display), sans-serif;
    font-weight: 700; font-size: 21px;
    color: var(--text); margin-bottom: 10px;
  }
  .utm-ads-blog .cta-block p { color: var(--text2); font-size: 15px; margin-bottom: 24px; }

  .utm-ads-blog .chk { list-style: none; padding: 0; }
  .utm-ads-blog .chk li {
    display: flex; gap: 12px; align-items: flex-start;
    font-size: 14px; color: var(--text2); margin-bottom: 10px;
  }
  .utm-ads-blog .chk li::before {
    content: '✓'; flex-shrink: 0;
    width: 20px; height: 20px;
    background: rgba(16, 185, 129, 0.08);
    border: 1px solid rgba(16, 185, 129, 0.2);
    border-radius: 4px; color: var(--accent2);
    font-size: 11px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    margin-top: 2px;
  }
  .utm-ads-blog .chk.no li::before {
    content: '✗';
    background: rgba(239, 68, 68, 0.08);
    border-color: rgba(239, 68, 68, 0.2);
    color: var(--danger);
  }

  .utm-ads-blog .cmp { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 24px 0; }
  @media (max-width: 580px) { .utm-ads-blog .cmp { grid-template-columns: 1fr; } }
  .utm-ads-blog .cmp-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 10px; padding: 20px; }
  .utm-ads-blog .cmp-card.good { border-color: rgba(16, 185, 129, 0.2); }
  .utm-ads-blog .cmp-card.bad { border-color: rgba(239, 68, 68, 0.2); }
  .utm-ads-blog .cmp-card h4 { margin-top: 0; color: var(--text); }
  .utm-ads-blog .cmp-card.good h4 { color: #059669; }
  .utm-ads-blog .cmp-card.bad h4 { color: #dc2626; }
  .utm-ads-blog .cmp-card ul { list-style: none; padding: 0; }
  .utm-ads-blog .cmp-card ul li { font-size: 13px; color: var(--text2); margin-bottom: 6px; padding-left: 16px; position: relative; }
  .utm-ads-blog .cmp-card ul li::before { content: '→'; position: absolute; left: 0; color: var(--text3); }

  .utm-ads-blog .faq-item { border: 1px solid var(--border); border-radius: 10px; margin-bottom: 10px; overflow: hidden; background: #ffffff; }
  .utm-ads-blog .faq-q {
    font-family: var(--font-display), sans-serif;
    font-weight: 600; font-size: 15px; color: var(--text);
    padding: 18px 20px;
    cursor: pointer;
    display: flex; justify-content: space-between; align-items: center; gap: 16px;
    background: var(--bg2); transition: background 0.2s; user-select: none;
  }
  .utm-ads-blog .faq-q:hover { background: var(--surface2); }
  .utm-ads-blog .faq-icon { color: var(--accent); font-size: 20px; flex-shrink: 0; transition: transform 0.3s; line-height: 1; }
  .utm-ads-blog .faq-item.open .faq-icon { transform: rotate(45deg); }
  .utm-ads-blog .faq-a {
    max-height: 0; overflow: hidden;
    transition: max-height 0.35s ease, padding 0.2s;
    color: var(--text2); font-size: 14px; line-height: 1.7;
    padding: 0 20px;
    background: #ffffff;
  }
  .utm-ads-blog .faq-item.open .faq-a { max-height: 500px; padding: 0 20px 18px; }

  .utm-ads-blog [id] { scroll-margin-top: 100px; }


`;

export default function UtmAdsBlogClient() {
  useEffect(() => {
    // FAQ accordion
    const faqs = document.querySelectorAll(".faq-q");
    faqs.forEach((q) => {
      const handler = () => {
        const item = q.closest(".faq-item");
        const isOpen = item?.classList.contains("open");
        document.querySelectorAll(".faq-item.open").forEach((i) => i.classList.remove("open"));
        if (!isOpen) item?.classList.add("open");
      };
      q.addEventListener("click", handler);
      return () => q.removeEventListener("click", handler);
    });

    // Scroll entrance
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).style.opacity = "1";
            (e.target as HTMLElement).style.transform = "translateY(0)";
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    document.querySelectorAll("h2, .cta-block, .platform-header, .callout").forEach((el) => {
      (el as HTMLElement).style.opacity = "0";
      (el as HTMLElement).style.transform = "translateY(16px)";
      (el as HTMLElement).style.transition = "opacity 0.5s ease, transform 0.5s ease";
      io.observe(el);
    });
  }, []);

  return (
    <div className="utm-ads-blog">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      
      {/* HERO */}
      <section className="hero">
        <div className="hero-eyebrow">Complete Guide · 2026</div>
        <h1>UTM Ads: Track <span className="hl">Every Click</span>,<br/>Across <span className="hl2">Every Platform</span></h1>
        <p className="hero-desc">You&apos;re spending on Google, Meta, TikTok, LinkedIn. But without UTM parameters on every ad, you can&apos;t prove which platform is actually driving conversions — or cut the ones that aren&apos;t. This guide covers everything: what UTMs are, how to set them up on each ad platform, dynamic parameter templates, and how to read the data.</p>
        <div className="hero-btns">
          <a href="https://findbest.tools/utility/utm-builder" className="btn-primary">
            <LinkIcon className="w-4 h-4" />
            Build UTM Links Free
          </a>
          <a href="#what-are-utm-ads" className="btn-ghost">Read the full guide <ArrowDown className="w-4 h-4" /></a>
        </div>
        <div className="platform-row">
          <p>Covers:</p>
          <span className="platform-badge"><span className="dot dot-google"></span>Google Ads</span>
          <span className="platform-badge"><span className="dot dot-meta"></span>Meta Ads</span>
          <span className="platform-badge"><span className="dot dot-tiktok"></span>TikTok Ads</span>
          <span className="platform-badge"><span className="dot dot-linkedin"></span>LinkedIn Ads</span>
          <span className="platform-badge"><span className="dot dot-pinterest"></span>Pinterest Ads</span>
          <span className="platform-badge"><span className="dot dot-blue"></span>+ More</span>
        </div>
      </section>

      {/* TOC */}
      <div className="toc">
        <p className="toc-label">In This Guide</p>
        <div className="toc-grid">
          <a href="#what-are-utm-ads"><span className="toc-num">01</span>What Are UTM Ads?</a>
          <a href="#utm-medium-ads"><span className="toc-num">02</span>The Right UTM Medium for Ads</a>
          <a href="#platform-google"><span className="toc-num">03</span>Google Ads Setup</a>
          <a href="#platform-meta"><span className="toc-num">04</span>Meta / Facebook Ads Setup</a>
          <a href="#platform-tiktok"><span className="toc-num">05</span>TikTok Ads Setup</a>
          <a href="#platform-linkedin"><span className="toc-num">06</span>LinkedIn Ads Setup</a>
          <a href="#platform-pinterest"><span className="toc-num">07</span>Pinterest & Other Platforms</a>
          <a href="#dynamic-parameters"><span className="toc-num">08</span>Dynamic UTM Parameters</a>
          <a href="#templates"><span className="toc-num">09</span>Copy-Paste Templates</a>
          <a href="#naming-conventions"><span className="toc-num">10</span>Naming Conventions</a>
          <a href="#reading-data"><span className="toc-num">11</span>Reading Ad UTM Data in GA4</a>
          <a href="#mistakes"><span className="toc-num">12</span>Common Mistakes</a>
          <a href="#faq"><span className="toc-num">13</span>FAQ</a>
        </div>
      </div>

      {/* CONTENT */}
      <div className="content">
        <h2 id="what-are-utm-ads">What Are UTM Ads — and Why Do They Matter?</h2>
        <p>UTM ads refers to the practice of adding UTM (Urchin Tracking Module) parameters to your paid ad URLs so that every click is attributed to the exact campaign, platform, and creative that generated it.</p>
        <p>Without UTM parameters on your ad links, your analytics platform receives the click but has no context for it. The traffic arrives, but the campaign responsible gets no credit — or worse, it gets misattributed to a completely different source.</p>
        <p>Here is the core problem: ad platforms like Google Ads and Meta Ads tell you how many clicks your ads received. But they define &quot;click&quot; differently, count differently, and don&apos;t integrate seamlessly with your website analytics. Your Google Analytics data and your Google Ads data will almost never match. The only way to have a single, consistent source of truth across all your ad platforms is through UTM parameters.</p>

        <p>A UTM-tagged ad URL looks like this:</p>
        <div className="code-block">
          <span className="code-block-label">Ad URL</span>
          <code><span className="cb">https://yoursite.com/landing-page</span><span className="cs">?</span><span className="cp">utm_source</span>=<span className="cv">google</span><span className="cs">&amp;</span><span className="cp">utm_medium</span>=<span className="cv">cpc</span><span className="cs">&amp;</span><span className="cp">utm_campaign</span>=<span className="cv">brand_search_may2026</span><span className="cs">&amp;</span><span className="cp">utm_content</span>=<span className="cv">headline_a</span><span className="cs">&amp;</span><span className="cp">utm_term</span>=<span className="cv">&#123;keyword&#125;</span></code>
        </div>

        <div className="callout callout-blue">
          <div className="callout-icon"><Lightbulb className="w-5 h-5 text-blue-500" /></div>
          <div className="callout-body">
            <strong>Build ad UTM URLs in seconds</strong>
            Never hand-type UTM parameters — a typo in a parameter name (<code>utm_souce</code> instead of <code>utm_source</code>) silently breaks tracking. Use the <a href="https://findbest.tools/utility/utm-builder">free UTM builder at findbest.tools</a> to generate correctly formatted ad URLs every time.
          </div>
        </div>

        <h3>The 5 UTM Parameters for Ads</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Parameter</th><th>Required?</th><th>For Ads: What It Captures</th><th>Example</th></tr>
            </thead>
            <tbody>
              <tr><td><span className="pill pill-blue">utm_source</span></td><td>✅ Yes</td><td>The ad platform</td><td><code>google</code>, <code>facebook</code>, <code>tiktok</code></td></tr>
              <tr><td><span className="pill pill-green">utm_medium</span></td><td>✅ Yes</td><td>The channel type</td><td><code>cpc</code>, <code>display</code>, <code>paid_social</code></td></tr>
              <tr><td><span className="pill pill-blue">utm_campaign</span></td><td>✅ Yes</td><td>The campaign name</td><td><code>brand_search_may2026</code></td></tr>
              <tr><td><span className="pill pill-amber">utm_content</span></td><td>Recommended</td><td>The ad creative or variant</td><td><code>carousel_v1</code>, <code>headline_a</code></td></tr>
              <tr><td><span className="pill pill-amber">utm_term</span></td><td>Search only</td><td>The keyword that triggered the ad</td><td><code>running+shoes</code>, <code>&#123;keyword&#125;</code></td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="utm-medium-ads">Choosing the Right UTM Medium for Paid Ads</h2>
        <p>The <code>utm_medium</code> value is the most consequential choice you&apos;ll make in your ad UTM setup. Get it wrong, and GA4 silently dumps your paid traffic into the &quot;Unassigned&quot; channel — where it becomes invisible in standard channel reports.</p>
        <p>GA4 uses a fixed set of default channel definitions to classify traffic. It recognizes specific medium values and maps them to channels. Any medium value outside this list falls into &quot;Unassigned.&quot;</p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Ad Type</th><th>Correct utm_medium</th><th>GA4 Channel</th><th>Wrong Values to Avoid</th></tr>
            </thead>
            <tbody>
              <tr><td>Google Search Ads</td><td><span className="pill pill-green">cpc</span></td><td>Paid Search</td><td><code>paid</code>, <code>search</code>, <code>google-ads</code></td></tr>
              <tr><td>Google Shopping Ads</td><td><span className="pill pill-green">cpc</span></td><td>Paid Shopping</td><td><code>shopping</code>, <code>pla</code></td></tr>
              <tr><td>Google Display Ads</td><td><span className="pill pill-green">display</span></td><td>Display</td><td><code>banner</code>, <code>gdn</code></td></tr>
              <tr><td>Google Video / YouTube</td><td><span className="pill pill-green">cpc</span> or <span className="pill pill-green">video</span></td><td>Video</td><td><code>youtube</code>, <code>yt</code></td></tr>
              <tr><td>Meta / Facebook Ads</td><td><span className="pill pill-green">cpc</span></td><td>Paid Social</td><td><code>paid</code>, <code>paid-social</code>, <code>paid_social</code></td></tr>
              <tr><td>Instagram Ads</td><td><span className="pill pill-green">cpc</span></td><td>Paid Social</td><td><code>instagram</code>, <code>ig</code></td></tr>
              <tr><td>TikTok Ads</td><td><span className="pill pill-green">cpc</span></td><td>Paid Social</td><td><code>tiktok-ads</code>, <code>paid</code></td></tr>
              <tr><td>LinkedIn Ads</td><td><span className="pill pill-green">cpc</span></td><td>Paid Social</td><td><code>linkedin-ads</code>, <code>sponsored</code></td></tr>
              <tr><td>Affiliate / Partner Ads</td><td><span className="pill pill-green">affiliate</span></td><td>Affiliates</td><td><code>partner</code>, <code>referral</code></td></tr>
            </tbody>
          </table>
        </div>

        <div className="callout callout-amber">
          <div className="callout-icon"><AlertTriangle className="w-5 h-5 text-amber-500" /></div>
          <div className="callout-body">
            <strong>The most common mistake: Meta Ads Manager&apos;s default medium is wrong</strong>
            Meta&apos;s built-in UTM generator defaults to <code>utm_medium=paid</code> in some configurations. GA4 does not recognize &quot;paid&quot; as a standard medium — your paid social traffic lands in &quot;Unassigned.&quot; Always manually set <code>utm_medium=cpc</code> in Meta&apos;s URL Parameters field.
          </div>
        </div>

        <h2 id="platform-google">UTM Setup for Google Ads</h2>
        <div className="platform-header">
          <div className="platform-icon icon-google">G</div>
          <div className="platform-info">
            <strong>Google Ads</strong>
            <span>Search · Shopping · Display · YouTube · Performance Max</span>
          </div>
        </div>
        <p>Google Ads is the most nuanced platform for UTM tracking because it has its own tracking system (auto-tagging with <code>gclid</code>) that partially overlaps with manual UTMs.</p>

        <h3>Auto-Tagging vs. Manual UTMs in Google Ads</h3>
        <div className="cmp">
          <div className="cmp-card good">
            <h4><CheckCircle2 className="inline-block w-4 h-4 mr-1" /> Auto-Tagging (gclid)</h4>
            <ul>
              <li>Sends full campaign data to GA4 automatically</li>
              <li>Required for GA4 cost data import</li>
              <li>Works with smart bidding signals</li>
              <li>Captures placement, match type, network</li>
            </ul>
          </div>
          <div className="cmp-card">
            <h4>📋 Manual UTMs</h4>
            <ul>
              <li>Works with ALL analytics tools (not just GA4)</li>
              <li>Required for CRM, Shopify, third-party tools</li>
              <li>Human-readable in any report</li>
              <li>Gives you control over naming conventions</li>
            </ul>
          </div>
        </div>

        <p><strong>Recommendation: use both.</strong> Enable auto-tagging in Google Ads (Account Settings → Auto-tagging → On), and also set manual UTMs via the Final URL Suffix.</p>

        <h3>Setting Up UTMs via Final URL Suffix (Recommended)</h3>
        <ol className="steps">
          <li>
            <div className="step-n">1</div>
            <div className="step-body">
              <strong>Go to Account Settings</strong>
              <p>In Google Ads: Settings → Account Settings → Tracking → Final URL Suffix</p>
            </div>
          </li>
          <li>
            <div className="step-n">2</div>
            <div className="step-body">
              <strong>Enter your UTM suffix with ValueTrack parameters</strong>
              <p>Paste the template below. ValueTrack parameters (<code>&#123;campaignid&#125;</code>, <code>&#123;keyword&#125;</code>, etc.) are populated automatically by Google for each click.</p>
            </div>
          </li>
          <li>
            <div className="step-n">3</div>
            <div className="step-body">
              <strong>Click Save and verify</strong>
              <p>Click a test ad and check that UTM parameters appear in the destination URL.</p>
            </div>
          </li>
        </ol>

        <h4>Google Ads Final URL Suffix Template</h4>
        <div className="code-block">
          <span className="code-block-label">Final URL Suffix</span>
          <code><span className="cp">utm_source</span>=<span className="cv">google</span>&amp;<span className="cp">utm_medium</span>=<span className="cv">cpc</span>&amp;<span className="cp">utm_campaign</span>=<span className="cd">&#123;campaignid&#125;</span>&amp;<span className="cp">utm_content</span>=<span className="cd">&#123;adgroupid&#125;</span>&amp;<span className="cp">utm_term</span>=<span className="cd">&#123;keyword&#125;</span></code>
        </div>

        <h2 id="platform-meta">UTM Setup for Meta Ads (Facebook &amp; Instagram)</h2>
        <div className="platform-header">
          <div className="platform-icon icon-meta">M</div>
          <div className="platform-info">
            <strong>Meta Ads Manager</strong>
            <span>Facebook · Instagram · Audience Network · Messenger</span>
          </div>
        </div>
        <p>Meta&apos;s post-iOS-14 tracking changes have made its own attribution data increasingly unreliable. UTM parameters are first-party data embedded directly in the URL — they are unaffected by all of these changes.</p>

        <h3>Where to Add UTMs in Meta Ads Manager</h3>
        <ol className="steps">
          <li>
            <div className="step-n">1</div>
            <div className="step-body">
              <strong>Go to the Ad level in Ads Manager</strong>
              <p>In your campaign, navigate to Ads (not Campaign or Ad Sets).</p>
            </div>
          </li>
          <li>
            <div className="step-n">2</div>
            <div className="step-body">
              <strong>Scroll down to &quot;Website URL&quot; → &quot;URL Parameters&quot;</strong>
              <p>Below the destination URL field, click &quot;Build a URL Parameter&quot; or directly click into the input.</p>
            </div>
          </li>
          <li>
            <div className="step-n">3</div>
            <div className="step-body">
              <strong>Paste your UTM string with dynamic parameters</strong>
              <p>Use the template below. Dynamic parameters like <code>&#123;&#123;campaign.name&#125;&#125;</code> are replaced automatically by Meta.</p>
            </div>
          </li>
        </ol>

        <h4>Recommended Meta Dynamic UTM Template</h4>
        <div className="code-block">
          <span className="code-block-label">Meta URL Parameters</span>
          <code><span className="cp">utm_source</span>=<span className="cd">&#123;&#123;site_source_name&#125;&#125;</span>&amp;<span className="cp">utm_medium</span>=<span className="cv">cpc</span>&amp;<span className="cp">utm_campaign</span>=<span className="cd">&#123;&#123;campaign.name&#125;&#125;</span>&amp;<span className="cp">utm_content</span>=<span className="cd">&#123;&#123;ad.name&#125;&#125;</span>&amp;<span className="cp">utm_term</span>=<span className="cd">&#123;&#123;adset.name&#125;&#125;</span></code>
        </div>

        <div className="callout callout-green">
          <div className="callout-icon"><CheckCircle2 className="w-5 h-5 text-green-500" /></div>
          <div className="callout-body">
            <strong>Pro tip: name your ads descriptively in Ads Manager</strong>
            Since <code>&#123;&#123;ad.name&#125;&#125;</code> pulls directly from your ad&apos;s name, use descriptive names like &quot;carousel_lifestyle_v1&quot;.
          </div>
        </div>

        <h2 id="platform-tiktok">UTM Setup for TikTok Ads</h2>
        <div className="platform-header">
          <div className="platform-icon icon-tiktok">T</div>
          <div className="platform-info">
            <strong>TikTok Ads Manager</strong>
            <span>In-Feed Ads · TopView · Branded Effects · Spark Ads</span>
          </div>
        </div>
        <p>TikTok Ads Manager supports both manual UTMs and dynamic URL parameters. For large accounts with many creatives, dynamic parameters save significant time.</p>

        <h4>TikTok Manual UTM Template</h4>
        <div className="code-block">
          <span className="code-block-label">TikTok Tracking URL</span>
          <code><span className="cp">utm_source</span>=<span className="cv">tiktok</span>&amp;<span className="cp">utm_medium</span>=<span className="cv">cpc</span>&amp;<span className="cp">utm_campaign</span>=<span className="cd">__CAMPAIGN_NAME__</span>&amp;<span className="cp">utm_content</span>=<span className="cd">__CID__</span>&amp;<span className="cp">utm_term</span>=<span className="cd">__AID__</span></code>
        </div>

        <h2 id="platform-linkedin">UTM Setup for LinkedIn Ads</h2>
        <div className="platform-header">
          <div className="platform-icon icon-linkedin">in</div>
          <div className="platform-info">
            <strong>LinkedIn Campaign Manager</strong>
            <span>Sponsored Content · Message Ads · Text Ads</span>
          </div>
        </div>
        <p>LinkedIn Ads are the highest cost-per-click of any major ad platform. This makes UTM tracking even more critical.</p>

        <div className="callout callout-blue">
          <div className="callout-icon"><LinkIcon className="w-5 h-5 text-blue-500" /></div>
          <div className="callout-body">
            <strong>Use the UTM builder for every LinkedIn ad</strong>
            Since LinkedIn requires per-ad URL management, <a href="https://findbest.tools/utility/utm-builder">findbest.tools/utility/utm-builder</a> saves time.
          </div>
        </div>

        <h2 id="platform-pinterest">Pinterest Ads &amp; Other Platforms</h2>
        <div className="platform-header">
          <div className="platform-icon icon-pinterest">P</div>
          <div className="platform-info">
            <strong>Pinterest, Snapchat, X (Twitter), Reddit &amp; More</strong>
          </div>
        </div>

        <h3>Pinterest Ads</h3>
        <div className="code-block">
          <span className="code-block-label">Pinterest Ad URL</span>
          <code><span className="cb">https://yoursite.com/product</span>?<span className="cp">utm_source</span>=<span className="cv">pinterest</span>&amp;<span className="cp">utm_medium</span>=<span className="cv">cpc</span>&amp;<span className="cp">utm_campaign</span>=<span className="cd">&#123;campaignname&#125;</span>&amp;<span className="cp">utm_content</span>=<span className="cd">&#123;adid&#125;</span></code>
        </div>

        <h2 id="dynamic-parameters">Dynamic UTM Parameters: What They Are and When to Use Them</h2>
        <p>Manual UTMs require you to type values by hand. Dynamic parameters automate this — the ad platform replaces placeholders with actual values at the moment of the click.</p>

        <div className="callout callout-amber">
          <div className="callout-icon"><AlertTriangle className="w-5 h-5 text-amber-500" /></div>
          <div className="callout-body">
            <strong>Dynamic parameters inherit your Ads Manager naming — good or bad</strong>
            If your campaign is named &quot;Campaign 3 - FINAL&quot;, that&apos;s exactly what will be inserted. Keep your names clean.
          </div>
        </div>

        <h2 id="templates">Copy-Paste UTM Templates for Every Ad Platform</h2>
        <p>Build all of these at <a href="https://findbest.tools/utility/utm-builder">findbest.tools/utility/utm-builder</a>.</p>

        <div className="cta-block">
          <h3>Generate Your Ad UTM Links in 30 Seconds</h3>
          <p>Enter your destination URL, pick your platform, and get a perfectly formatted UTM URL.</p>
          <a href="https://findbest.tools/utility/utm-builder" className="btn-primary" style={{ display: "inline-flex" }}>
            <LinkIcon className="w-4 h-4" />
            Open Free UTM Builder
          </a>
        </div>

        <h2 id="naming-conventions">UTM Naming Conventions for Ad Campaigns</h2>
        <h3>The Non-Negotiable Rules</h3>
        <ul className="chk">
          <li><strong>Always lowercase.</strong> <code>Facebook</code> and <code>facebook</code> are two different sources in GA4.</li>
          <li><strong>No spaces.</strong> Use underscores (<code>_</code>) or hyphens (<code>-</code>).</li>
          <li><strong>Date-stamp every campaign.</strong> <code>summer_sale_jun2026</code> is interpretable forever.</li>
        </ul>

        <h2 id="reading-data">Reading Your Ad UTM Data in GA4</h2>
        <p>Once your ads are running, here&apos;s where to find the data in GA4.</p>
        <ol className="steps">
          <li><div className="step-n">1</div><div className="step-body"><strong>Reports → Acquisition → Traffic Acquisition</strong><p>Change dimension to Session source/medium.</p></div></li>
          <li><div className="step-n">2</div><div className="step-body"><strong>Filter to paid traffic</strong><p>Filter where medium = cpc.</p></div></li>
        </ol>

        <h2 id="mistakes">Common UTM Ad Tracking Mistakes</h2>
        <h3>1. Using utm_medium=paid instead of utm_medium=cpc</h3>
        <p>GA4&apos;s channel groupings only recognize specific values. <code>paid</code> often lands in &quot;Unassigned.&quot;</p>
        <h3>2. Tagging Google Ads manually incorrectly</h3>
        <p>Always use the Final URL Suffix to avoid conflicts with auto-tagging.</p>

        <h2 id="faq">Frequently Asked Questions</h2>
        <div className="faq-item">
          <div className="faq-q">What UTM parameters should I use for Google Ads?<Plus className="faq-icon" /></div>
          <div className="faq-a">Recommended: <code>utm_source=google</code>, <code>utm_medium=cpc</code>, <code>utm_campaign=&#123;campaign&#125;</code>, <code>utm_term=&#123;keyword&#125;</code>.</div>
        </div>
        <div className="faq-item">
          <div className="faq-q">What is the best utm_medium for paid social ads?<Plus className="faq-icon" /></div>
          <div className="faq-a">Use <code>utm_medium=cpc</code> for all paid social. GA4 maps this correctly to &quot;Paid Social.&quot;</div>
        </div>
        <div className="faq-item">
          <div className="faq-q">Should I use manual UTMs or auto-tagging in Google Ads?<Plus className="faq-icon" /></div>
          <div className="faq-a">Use both. Auto-tagging for GA4 cost data, manual UTMs for other tools like CRMs or Shopify.</div>
        </div>

        <div className="cta-block" style={{ marginTop: "60px" }}>
          <h3>Ready to Track Every Ad Click?</h3>
          <p>Build your platform UTM links in seconds — no signup, no cost.</p>
          <a href="https://findbest.tools/utility/utm-builder" className="btn-primary" style={{ display: "inline-flex", marginBottom: "14px" }}>
            <LinkIcon className="w-4 h-4" />
            Build Ad UTM Links Free → findbest.tools
          </a>
          <p style={{ fontSize: "13px", color: "var(--text3)", margin: 0 }}>Free. No account. Works for Google, Meta, TikTok, LinkedIn.</p>
        </div>
      </div>


    </div>
  );
}
