import Link from "next/link";
import type { Metadata } from "next";
import { CsvConverter } from "./components/CsvConverter";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/converter/convert-csv-converter";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is CSV format?",
    answer: "CSV stands for Comma-Separated Values. It is a simple text format used to store tabular data (numbers and text) in plain text lines. Each line of the file is a data record, and each record consists of one or more fields, separated by commas."
  },
  {
    question: "How do I handle commas inside CSV values?",
    answer: "If a field data actually contains a comma, the entire field is typically wrapped in double-quotes (\"). For example: 'John, \"Smith, Jr.\", 25'. Our tool automatically parses quoted values according to the RFC 4180 standard, ensuring your data is split correctly without breaking."
  },
  {
    question: "Can I convert CSV to XML or TSV?",
    answer: "Yes. Our multi-format converter can take any standard CSV data and translate it into strict JSON, formatted XML, or Tab-Separated Values (TSV). Simply use the dropdown to select your desired output format."
  },
  {
    question: "What happens if my CSV has a missing column?",
    answer: "If a row has fewer fields than the header row, it will simply export empty or null values for the missing entries in JSON and XML. To prevent rendering errors, always try to ensure uniform column lengths in your source data."
  }
];

export const metadata: Metadata = {
  title: "CSV Converter | Convert CSV to JSON, XML & TSV",
  description: "Convert incredibly large CSV tables to JSON, XML, or TSV formats instantly. Auto-parses delimiters, headers, and safely handles quoted values.",
  keywords: ["csv converter", "csv to json", "csv to xml", "csv to tsv", "spreadsheet converter", "data parser"],
  alternates: { canonical: PAGE_URL },
  openGraph: { type: "website", url: PAGE_URL, title: "CSV Converter — JSON, XML & TSV Extractor", description: "Universal data structure conversion tool for tabular data." },
};

export default function CsvConverterPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Converter", path: "/converter" },
    { name: "CSV Converter", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd && <JsonLd data={serializeJsonLd(faqJsonLd)} />}

      <section className="space-y-4 py-2 sm:py-4 text-balance">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li className="opacity-50">/</li>
            <li><Link href="/converter" className="hover:text-primary transition-colors">Converter</Link></li>
            <li className="opacity-50">/</li>
            <li className="text-foreground font-medium">CSV Converter</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] bg-primary/10 text-primary mb-4">
            Developer Tool
          </p>
          <h1 className="text-5xl font-black tracking-tighter text-foreground sm:text-6xl italic">
            Universal CSV Converter
          </h1>
          <p className="mt-6 text-xl leading-relaxed text-muted-foreground">
            Parse complex tabular data effortlessly. Convert raw CSV files into structured JSON, XML, or TSV formats while safely handling delimiters, quoted strings, and data types.
          </p>
        </div>

        <div className="mt-8 max-w-2xl">
          <PrivacyNote />
        </div>
      </section>

      <CsvConverter />

      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 bg-white/40 backdrop-blur-3xl shadow-2vw">
        <div className="prose prose-slate prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-li:text-muted-foreground">
          <h2 className="text-4xl text-foreground italic">CSV Converter: Bridging Spreadsheets and Code</h2>
          <p>
            The Comma-Separated Values (CSV) format is arguably the most widely used data transition layer in the world. It acts as the universal language between databases, spreadsheet software like Excel, and customized web applications. However, migrating that raw data into modern development formats like JSON or XML requires a rigorous parsing engine.
          </p>
          
          <h3 className="text-foreground font-black italic">01. The Complexity of the Comma</h3>
          <p>
            At a glance, a CSV seems incredibly simple: data values separated by commas. However, formatting edge-cases often break amateur regex scripts. Consider this scenario: what happens when your data itself contains a comma?
          </p>
          <ul>
            <li><strong>Raw Text:</strong> <code className="bg-muted px-1 py-0.5 rounded">John Doe, 123 Main St, Apt 4, Seattle, WA</code></li>
            <li>If you strictly split by commas, the single string <em>"123 Main St, Apt 4"</em> will be incorrectly severed into two distinct columns!</li>
          </ul>

          <div className="my-16 p-10 bg-foreground text-background rounded-[3rem] shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
             <h3 className="text-primary font-black italic !mt-0 uppercase tracking-widest text-sm text-balance">The RFC 4180 Standard</h3>
             <p className="opacity-80 leading-relaxed mb-0">
               To prevent chaotic data parsing, the internet engineering task force defined strict rules for CSV reading. Our converter adheres to these protocols, natively recognizing that any string wrapped in double-quotes (<code className="bg-white/20 px-1 py-0.5 rounded text-sm">&quot;&quot;</code>) is a continuous block of text. This mechanism guarantees that commas and hard-returns trapped <em>inside</em> your data will not break the layout of your output format.
             </p>
          </div>

          <h3 className="text-foreground font-black italic">02. JSON: The Heart of the Web</h3>
          <p>
            JavaScript Object Notation (JSON) is currently the absolute standard for web APIs. If you export a database list to CSV and need it injected into a NoSQL database (like MongoDB) or delivered via a REST API, you must convert it to JSON. 
          </p>
          <p>
            When utilizing our converter, enabling the "First row is header" toggle allows the engine to transform your tabular CSV data directly into an array of clearly mapped JSON objects.
          </p>

          <h3 className="text-foreground font-black italic">03. XML: The Legacy Powerhouse</h3>
          <p>
            While JSON rules modern web apps, eXtensible Markup Language (XML) is still the heavy-lifter for enterprise software, government compliance documents, and banking feeds. It is exceptionally strict, making it inherently safer for high-security applications compared to easily malleable JSON. Our converter maps rows into standardized <code className="bg-muted px-1 py-0.5 rounded text-sm">&lt;record&gt;</code> elements.
          </p>

          <h3 className="text-foreground font-black italic">04. TSV: The Copy-Paste King</h3>
          <p>
            Tab-Separated Values (TSV) are almost functionally identical to CSVs. Why use them? Because if you are copy-pasting data directly out of an Excel or Google Sheets window, the computer's clipboard stores that data separated by Tabs, not commas.
          </p>
        </div>
      </section>

      {/* FAQ Grid */}
      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 relative overflow-hidden bg-muted/5">
        <h2 className="text-4xl font-black tracking-tighter text-foreground text-center italic">Data Structure FAQ</h2>
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-2 text-balance">
          {faq.map((item) => (
            <article key={item.question} className="p-8 rounded-[2.5rem] border border-border bg-background hover:shadow-2xl transition-all flex flex-col justify-between group">
              <div>
                <h3 className="text-lg font-black text-foreground mb-4 leading-tight group-hover:text-primary transition-colors">{item.question}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-border flex items-center gap-2 text-[10px] font-black uppercase text-primary tracking-widest">
                 <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Expert Analysis
              </div>
            </article>
          ))}
        </div>
      </section>

      <RelatedToolsSection category="Converter" categoryHref="/converter" currentPath={PAGE_PATH} />
    </div>
  );
}
