import { notFound } from "next/navigation";

import ExactConverterToolRunner from "@/components/tools/ExactConverterTool";
import ToolPageScaffold from "@/components/tools/ToolPageScaffold";
import { buildMetadata } from "@/lib/seo/metadata";
import { EXACT_CONVERTER_TOOLS, EXACT_CONVERTER_TOOL_MAP } from "@/lib/tools/exact-catalog";
import { buildConverterToolCopy } from "@/lib/tools/exact-copy";

export function generateStaticParams() {
  return EXACT_CONVERTER_TOOLS.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata(props: PageProps<"/converter/[slug]">) {
  const { slug } = await props.params;
  const tool = EXACT_CONVERTER_TOOL_MAP[slug];
  if (!tool) {
    return {};
  }

  const isUrlTool = slug === "convert-url-encoder-decoder";
  const isHtmlTool = slug === "convert-html-entity-encoder-decoder";
  const isBase64Tool = slug === "convert-base64-encoder-decoder";
  const isRot13Tool = slug === "convert-rot13-encoder-decoder";
  const isRot47Tool = slug === "convert-rot47-encoder-decoder";
  const isBinaryTool = slug === "convert-binary-encoder-decoder";
  const isHexTool = slug === "convert-hex-encoder-decoder";
  const isOctalTool = slug === "convert-octal-encoder-decoder";
  const isDecimalTool = slug === "convert-decimal-encoder-decoder";
  const isPunycodeTool = slug === "convert-punycode-encoder-decoder";
  const isIdnTool = slug === "convert-idn-encoder-decoder";
  const isJsonTool = slug === "convert-json-converter";
  const isCsvTool = slug === "convert-csv-converter";
  const isXmlTool = slug === "convert-xml-converter";
  const isYamlTool = slug === "convert-yaml-converter";
  const isMdHtmlTool = slug === "convert-markdown-html-converter";

  const title = isUrlTool
    ? "Free URL Encoder/Decoder - Online URL Encoding Tool | FindBest.tools"
    : isHtmlTool
      ? "HTML Entity Encoder & Decoder - Escape Special Characters Online"
      : isBase64Tool
        ? "Base64 Encoder & Decoder - Online File & Text Converter | FindBest.tools"
        : isRot13Tool
          ? "ROT13 Encoder & Decoder - Online Substitution Cipher | FindBest.tools"
          : isBinaryTool
            ? "Binary Encoder & Decoder - Text to Binary Online | FindBest.tools"
            : isHexTool
              ? "Hex Encoder & Decoder - Text to Hexadecimal Online | FindBest.tools"
              : isOctalTool
                ? "Octal Encoder & Decoder - Text to Octal Online | FindBest.tools"
                : isDecimalTool
                  ? "Decimal Encoder & Decoder - Text to Decimal online | FindBest.tools"
                  : isPunycodeTool
                    ? "Punycode Encoder & Decoder - Punycode to Unicode Online | FindBest.tools"
                    : isIdnTool
                      ? "IDN Encoder & Decoder - Internationalized Domain Name Converter"
                      : isJsonTool
                        ? "JSON Converter - Convert JSON to CSV, YAML, XML | FindBest.tools"
                        : isCsvTool
                          ? "CSV Converter - Convert CSV to JSON & XML | FindBest.tools"
                          : isXmlTool
                            ? "XML Converter - Convert XML to JSON, CSV & YAML | FindBest.tools"
                            : isYamlTool
                              ? "YAML Converter - Convert YAML to JSON & XML | FindBest.tools"
                              : isMdHtmlTool
                                ? "Markdown & HTML Converter - Clean Online Conversion"
                                : `${tool.name} | Free Online ${tool.name}`;

  const description = isUrlTool
    ? "Free online URL encoder and decoder. Convert text to percent-encoded format instantly in your browser. Safe, private, and developer-friendly."
    : isHtmlTool
      ? "Free online HTML entity encoder and decoder. Convert special characters to &lt;, &gt;, and &amp; instantly. Browser-based, private, and no data upload."
      : isBase64Tool
        ? "Free online Base64 encoder and decoder. Convert text and files to Base64, generate data URLs, and decode binary data. 33% overhead explained. Safe and private."
        : isRot13Tool
          ? "Free online ROT13 encoder and decoder. Rotate alphabetic characters by 13 positions. Perfect for hiding spoilers and light obfuscation. Browser-based and private."
          : isBinaryTool
            ? "Free online Binary encoder and decoder. Convert text to 8-bit binary and decode binary strings back to text instantly. Private and local processing."
            : isHexTool
              ? "Free online Hex encoder and decoder. Convert text to hexadecimal and hex strings back to text. Ideal for debugging and low-level data inspection."
              : isOctalTool
                ? "Free online Octal encoder and decoder. Convert text to octal and decode octal values. Clear, fast, and secure browser-based tool."
                : isDecimalTool
                  ? "Free online Decimal encoder and decoder. Convert text to decimal character codes and back. Simple, precise, and private conversion."
                  : isPunycodeTool
                    ? "Free online Punycode encoder and decoder. Convert Unicode domains to Punycode (xn--) and back. Essential for web developers and domain management."
                    : isIdnTool
                      ? "Free online IDN encoder and decoder. Convert Internationalized Domain Names (IDN) between Unicode and ASCII formats instantly."
                      : isJsonTool
                        ? "Free online JSON converter. Transform JSON to CSV, YAML, XML, or plain text instantly. Features local processing, validation, and zero-data-loss conversion."
                        : isCsvTool
                          ? "Free online CSV converter. Transform CSV spreadsheet data into JSON or XML instantly. Best for developers and data analysts. Safe and private."
                          : isXmlTool
                            ? "Free online XML converter. Transform XML documents into JSON, CSV, or YAML formats. Robust parsing, error detection, and local processing."
                            : isYamlTool
                              ? "Free online YAML converter. Convert YAML configuration files into JSON or XML instantly. Safe, private, and developer-oriented browser tool."
                              : isMdHtmlTool
                                ? "Free online Markdown and HTML converter. Switch between clean Markdown syntax and valid HTML markup instantly. Local processing, no data upload."
                                : tool.description;

  return buildMetadata({
    title,
    description,
    path: `/converter/${slug}`,
  });
}

export default async function ConverterToolPage(props: PageProps<"/converter/[slug]">) {
  const { slug } = await props.params;
  const tool = EXACT_CONVERTER_TOOL_MAP[slug];

  if (!tool) {
    notFound();
  }

  const copy = buildConverterToolCopy(tool);

  return (
    <ToolPageScaffold
      path={`/converter/${slug}`}
      category="Converter"
      categoryHref="/converter"
      title={tool.name}
      description={tool.description}
      learn={
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">{copy.heading}</h2>
          {copy.paragraphs.map((paragraph) => (
            <p key={paragraph} className="mt-3 text-base leading-7 text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </div>
      }
      faqs={copy.faqs}
    >
      <ExactConverterToolRunner tool={tool} />
    </ToolPageScaffold>
  );
}
