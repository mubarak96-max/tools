import type { Metadata } from "next";
import Link from "next/link";
import ScanTextTool from "@/components/ScanTextTool";
import { 
  FileText, 
  Camera, 
  Navigation, 
  BookOpen, 
  Receipt, 
  PenTool 
} from "lucide-react";

export const metadata: Metadata = {
  title: "Scan Text from Image — Free Photo to Text Converter Online",
  description:
    "Free scan text from image tool. Upload any photo and extract text instantly with our JPG to text converter. Get text from image, screenshot, or scanned document — no upload, 100% private.",
  keywords: [
    "scan text from image",
    "photo to text converter",
    "jpg to text",
    "get text from image",
    "image to text converter",
    "extract text from image",
    "ocr online free",
    "picture to text",
    "screenshot to text",
    "convert image to text",
    "free ocr",
    "text recognition online",
  ],
  openGraph: {
    title: "Scan Text from Image — Free Photo to Text Converter",
    description:
      "Extract text from any image instantly. Photo to text, JPG to text, screenshot to text — 100% free, no sign-up, works in your browser.",
    url: "https://yourdomain.com/scan-text-from-image",
  },
  alternates: {
    canonical: "https://yourdomain.com/scan-text-from-image",
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Scan Text from Image",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Free online tool to scan and extract text from images. Works as a photo to text converter, JPG to text extractor, and image to text converter — all locally in your browser.",
};

const FAQS = [
  {
    q: "How does the scan text from image tool work?",
    a: "This tool uses Tesseract.js, a JavaScript port of the industry-standard Tesseract OCR (Optical Character Recognition) engine originally developed at HP Labs and now maintained by Google. When you upload an image, the OCR engine analyses pixel patterns and identifies characters by comparing them against trained language models. Everything runs directly in your browser — no image data is ever sent to a server. The result is extracted text you can copy, edit, or download.",
  },
  {
    q: "What image formats does the photo to text converter support?",
    a: "The image to text converter supports all common image formats including JPG/JPEG, PNG, WebP, BMP, GIF, and TIFF. For best results, use high-resolution images with clear, high-contrast text. Blurry, low-resolution, or heavily compressed images (like small thumbnails) will produce less accurate results. If you have a scanned PDF, convert it to an image first using any PDF viewer's screenshot feature or a PDF-to-image converter.",
  },
  {
    q: "How accurate is the JPG to text extraction?",
    a: "Accuracy depends heavily on the quality of the source image. For clean, printed text on a contrasting background (like a typed document, book page, or printed sign), accuracy is typically very high — often 95–99%. Accuracy decreases for handwritten text, stylised fonts, text on complex backgrounds, very small text, or images with glare and shadows. To improve accuracy: use the highest resolution image available, ensure good lighting, avoid heavy rotation, and crop to the text area if possible.",
  },
  {
    q: "Is it safe to use? Does my image get uploaded anywhere?",
    a: "Yes, it is completely safe. This tool runs 100% locally in your browser using WebAssembly — the OCR engine executes entirely on your device. Your images are never uploaded to any server, never stored anywhere outside your browser session, and never seen by anyone else. This makes it safe to use with sensitive documents, confidential files, personal photos, and private correspondence. When you close the browser tab, everything is gone.",
  },
  {
    q: "Can I get text from image files with multiple columns or complex layouts?",
    a: "Yes. The OCR engine handles multi-column layouts, though with complex formatting, the order of extracted text may follow a left-to-right, top-to-bottom reading pattern rather than perfectly preserving the visual column structure. For structured documents, use the 'Markdown' output format which attempts to preserve headings and list structures. For tables and forms, the 'Lines' format often gives the cleanest output for copying into a spreadsheet.",
  },
  {
    q: "What languages does the image to text converter support?",
    a: "The default language model is English (trained on the English alphabet and common words). Tesseract.js supports over 100 languages, but loading multiple language packs increases the download size. The current tool is optimised for English text. For other languages, the tool may still work for languages that share the Latin alphabet (French, Spanish, German, etc.), though accuracy may be lower than with a dedicated language model.",
  },
  {
    q: "How can I get better text extraction results?",
    a: "Several techniques improve OCR accuracy significantly. Use a high-resolution image — at least 300 DPI (dots per inch) for scanned documents. Ensure good contrast between text and background (black text on white is ideal). Straighten the image before uploading — even a few degrees of rotation can reduce accuracy. Crop tightly to the text area to reduce noise. Avoid images with heavy JPEG compression artefacts. If working from a physical document, ensure even lighting without glare or shadows.",
  },
  {
    q: "What is the difference between the output format options?",
    a: "Plain text extracts all recognised characters exactly as they appear, with original line breaks preserved. This is best for simple documents, single paragraphs, or when you want to process the text further. Markdown format attempts to detect structural elements — lines that appear to be headings are formatted with ## prefixes, and list-like lines get bullet point formatting. This is useful for structured documents like articles or reports. Lines format removes blank lines and ensures each non-empty line is preserved separately — useful for addresses, lists, and tabular data.",
  },
];

const USE_CASES = [
  {
    icon: <FileText size={24} color="#3D6B4F" />,
    title: "Extract text from scanned documents",
    desc: "Convert scanned PDFs or paper documents into editable digital text. Perfect for archiving physical documents, extracting information from old records, or digitising printed forms.",
  },
  {
    icon: <Camera size={24} color="#3D6B4F" />,
    title: "Get text from screenshots",
    desc: "Extract text from screenshots of websites, apps, error messages, or any on-screen content. Useful when you can't select and copy text directly from the source.",
  },
  {
    icon: <Navigation size={24} color="#3D6B4F" />,
    title: "Read text from photos of signs",
    desc: "Capture and extract text from photos of road signs, menus, business cards, whiteboards, or presentation slides taken with your camera.",
  },
  {
    icon: <BookOpen size={24} color="#3D6B4F" />,
    title: "Convert book pages to text",
    desc: "Photograph pages from books, magazines, or printed articles and convert them to searchable, copyable digital text using this photo to text converter.",
  },
  {
    icon: <Receipt size={24} color="#3D6B4F" />,
    title: "Extract data from receipts and invoices",
    desc: "Pull text from photos of receipts, invoices, or bills for expense tracking, accounting, or record-keeping purposes.",
  },
  {
    icon: <PenTool size={24} color="#3D6B4F" />,
    title: "Digitise handwritten notes",
    desc: "Convert photos of handwritten notes, letters, or notebooks into digital text — useful for organising notes taken during meetings, classes, or personal journaling.",
  },
];

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 400, color: "#111", marginBottom: 16, marginTop: 64, letterSpacing: "-0.01em" }}>
      {children}
    </h2>
  );
}
function H3({ children }: { children: React.ReactNode }) {
  return <h3 style={{ fontSize: 17, fontWeight: 600, color: "#111", marginBottom: 8, marginTop: 32 }}>{children}</h3>;
}
function P({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 15, color: "#555", lineHeight: 1.75, marginBottom: 16 }}>{children}</p>;
}

export default function ScanTextPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');
        body { font-family: 'DM Sans', sans-serif; background: #FAFAF8; }
      `}</style>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Tool lives at top of page */}
      <ScanTextTool />

      {/* SEO content */}
      <main style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px 80px", fontFamily: "'DM Sans', sans-serif" }}>

        <H2>What is scan text from image?</H2>
        <P>
          Scan text from image — also called OCR (Optical Character Recognition) — is
          the technology that reads the visual shapes of letters and numbers in an image
          and converts them into machine-readable, editable text. Our free image to text
          converter runs this process entirely inside your browser, without sending your
          images to any external server.
        </P>
        <P>
          Whether you need a quick photo to text converter for a single screenshot or a
          reliable JPG to text tool for regular document digitisation, this tool handles
          it all. Upload any image — a photograph, screenshot, scan, or camera shot —
          and extract the text in seconds.
        </P>

        <H2>How to use this photo to text converter</H2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16, margin: "0 0 24px" }}>
          {[
            { step: "1", title: "Upload your image", desc: "Drag and drop any image file, or click to browse. JPG, PNG, WebP, BMP, GIF, and TIFF are all supported." },
            { step: "2", title: "Choose output format", desc: "Select plain text, Markdown for structured documents, or clean line format for lists and tables." },
            { step: "3", title: "Click 'Get text from image'", desc: "The OCR engine analyses your image locally and extracts all readable text." },
            { step: "4", title: "Copy or download", desc: "Edit the result if needed, then copy to clipboard or download as a .txt file." },
          ].map(s => (
            <div key={s.step} style={{ background: "#fff", border: "1.5px solid #E8E8E4", borderRadius: 14, padding: 20 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "#111", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, marginBottom: 12 }}>{s.step}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#111", marginBottom: 6 }}>{s.title}</div>
              <div style={{ fontSize: 13, color: "#888", lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          ))}
        </div>

        <H2>Common uses for image to text conversion</H2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 14, margin: "0 0 24px" }}>
          {USE_CASES.map(uc => (
            <div key={uc.title} style={{ background: "#fff", border: "1.5px solid #E8E8E4", borderRadius: 14, padding: 18 }}>
              <div style={{ marginBottom: 10 }}>{uc.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#111", marginBottom: 6 }}>{uc.title}</div>
              <div style={{ fontSize: 12, color: "#888", lineHeight: 1.6 }}>{uc.desc}</div>
            </div>
          ))}
        </div>

        <H2>Getting the best results from JPG to text extraction</H2>
        <P>
          The quality of text extraction from any image to text converter depends directly
          on the quality of the source image. OCR engines read text by analysing visual
          contrast, letter shapes, and spacing. Here are the most important factors for
          accurate extraction:
        </P>

        <H3>Image resolution</H3>
        <P>
          Higher resolution means more pixel data per character, giving the OCR engine
          more information to work with. For scanned documents, 300 DPI (dots per inch)
          is the standard recommended minimum — 600 DPI is better for small text. For
          photos taken with a phone camera, make sure to photograph from close enough
          that text fills a significant portion of the frame.
        </P>

        <H3>Contrast and lighting</H3>
        <P>
          Black text on a white background is the easiest scenario for any photo to text
          converter. Coloured text, text on textured backgrounds, or low-contrast
          combinations (grey text on white, yellow on cream) significantly reduce accuracy.
          When photographing documents, use even lighting — flash reflections, shadows,
          and hot spots all introduce noise that confuses the OCR engine.
        </P>

        <H3>Image straightness</H3>
        <P>
          Even a 5–10 degree rotation can noticeably reduce OCR accuracy. Most OCR
          engines have some tolerance for skew, but straightening the image first
          always produces better results. If your image is rotated, use your device's
          photo editor to straighten it before uploading to get text from image more
          accurately.
        </P>

        <H3>Font and text type</H3>
        <P>
          Clear, standard printed fonts produce the most reliable results. Decorative,
          script, or heavily stylised fonts are harder to recognise. Handwritten text
          is the most challenging scenario for any image to text converter — accuracy
          varies greatly depending on how neat and consistent the handwriting is.
          Printed block capitals are the easiest handwriting style for OCR engines to read.
        </P>

        <H2>Privacy — why local OCR matters</H2>
        <P>
          Many online OCR tools upload your images to a server for processing. This
          means your documents, photos, and any sensitive information they contain
          are transmitted over the internet and may be stored, processed, or accessed
          by the service provider. For documents containing personal data, financial
          information, medical records, confidential business documents, or private
          communications, this represents a real privacy risk.
        </P>
        <P>
          This tool is different. The OCR engine — powered by Tesseract.js and compiled
          to WebAssembly — runs entirely inside your browser. Your images are processed
          on your own device, never transmitted anywhere. There is no server receiving
          your uploads, no storage, and no logging. It is genuinely private by design,
          not just by policy.
        </P>

        <H2>Frequently asked questions</H2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {FAQS.map((faq) => (
            <details
              key={faq.q}
              style={{ border: "1.5px solid #E8E8E4", borderRadius: 12, overflow: "hidden" }}
            >
              <summary style={{
                padding: "14px 18px", fontSize: 14, fontWeight: 500, color: "#111",
                listStyle: "none", cursor: "pointer", userSelect: "none",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}
                className="group"
              >
                {faq.q}
                <span style={{ color: "#AAA", marginLeft: 12, flexShrink: 0, fontSize: 18 }}>+</span>
              </summary>
              <div style={{ padding: "4px 18px 16px", fontSize: 14, color: "#555", lineHeight: 1.75, borderTop: "1px solid #F0F0EB" }}>
                {faq.a}
              </div>
            </details>
          ))}
        </div>

        <div style={{ marginTop: 64, padding: 20, background: "#F5F5F2", borderRadius: 14, fontSize: 12, color: "#888", lineHeight: 1.7 }}>
          <strong style={{ color: "#555" }}>About this tool:</strong> Built with Tesseract.js, an open-source OCR engine.
          All processing is local — no image data leaves your device. Accuracy may vary
          based on image quality, font type, and language. This tool is intended for
          personal and commercial use under the standard terms of the Tesseract OCR
          library (Apache 2.0 licence).
        </div>

        {/* Related Tools */}
        <div style={{ marginTop: 80, borderTop: "1.5px solid #E8E8E4", paddingTop: 48 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: "#111", margin: 0, flex: 1 }}>
              Related Text Utilities
            </h2>
            <Link href="/text" style={{ fontSize: 13, color: "#3D6B4F", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
              View all tools
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
            {[
              { name: "Word Frequency Counter", href: "/text/word-frequency", desc: "Analyze repeated words and most-used terms in any text block." },
              { name: "Case Converter", href: "/text/case-converter", desc: "Convert text between uppercase, lowercase, title case, and more." },
              { name: "Duplicate Word Finder", href: "/text/duplicate-word-finder", desc: "Find repeated words and overused terms in your drafts." },
            ].map(tool => (
              <Link key={tool.href} href={tool.href} style={{ textDecoration: "none", display: "block" }}>
                <div style={{
                  padding: 20, background: "#fff", border: "1.5px solid #E8E8E4", borderRadius: 16,
                  height: "100%", transition: "all .2s", cursor: "pointer",
                }}
                  className="hover:border-[#3D6B4F] hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
                >
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#111", marginBottom: 8 }}>{tool.name}</div>
                  <div style={{ fontSize: 12, color: "#888", lineHeight: 1.6 }}>{tool.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
