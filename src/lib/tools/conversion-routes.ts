import { IMAGE_FORMAT_CONVERSIONS } from "./image-format-conversion";

export function withConvertSlug(slug: string) {
  return slug.startsWith("convert-") ? slug : `convert-${slug}`;
}

export function buildConvertName(from: string, to: string) {
  return `Convert ${from} to ${to}`;
}

export function buildConvertDescription(from: string, to: string, existingDescription: string) {
  const normalizedDescription = existingDescription.trim();
  const startsWithConversionVerb = /^(convert|turn|export|decode|encode)\b/i.test(normalizedDescription);

  if (startsWithConversionVerb) {
    return `${buildConvertName(from, to)} online in the browser.`;
  }

  return `${buildConvertName(from, to)} online in the browser. ${normalizedDescription}`;
}

const IMAGE_STATIC_CONVERSION_SLUGS = [
  "image-to-base64",
  "image-to-ascii-converter",
] as const;

const PDF_CONVERSION_SLUGS = [
  "jpg-to-pdf",
  "html-to-pdf",
  "word-to-pdf",
  "powerpoint-to-pdf",
  "excel-to-pdf",
  "pdf-to-pdfa",
] as const;

const TAILWIND_CONVERSION_SLUGS = [
  "css-to-tailwind",
  "tailwind-to-css",
] as const;

const TEXT_CONVERSION_SLUGS = [
  "spaces-to-tabs",
  "tabs-to-spaces",
  "spaces-to-newlines",
  "newlines-to-spaces",
] as const;

const EXACT_CONVERTER_SLUGS = [
  "url-encoder-decoder",
  "html-entity-encoder-decoder",
  "base64-encoder-decoder",
  "rot13-encoder-decoder",
  "rot47-encoder-decoder",
  "binary-encoder-decoder",
  "hex-encoder-decoder",
  "octal-encoder-decoder",
  "decimal-encoder-decoder",
  "punycode-encoder-decoder",
  "idn-encoder-decoder",
  "json-converter",
  "csv-converter",
  "xml-converter",
  "yaml-converter",
  "markdown-html-converter",
  "unix-time-to-utc-time",
  "utc-time-to-unix-time",
  "seconds-to-hms",
  "hms-to-seconds",
  "seconds-to-human-readable-time",
  "miles-to-kilometers",
  "kilometers-to-miles",
  "celsius-to-fahrenheit",
  "fahrenheit-to-celsius",
  "degrees-to-radians",
  "radians-to-degrees",
  "pounds-to-kilograms",
  "kilograms-to-pounds",
  "hex-to-rgb",
  "rgb-to-hex",
  "cmyk-to-rgb",
  "rgb-to-cmyk",
] as const;

function buildPathRedirects(basePath: string, slugs: readonly string[]) {
  return slugs.map((slug) => ({
    source: `${basePath}/${slug}`,
    destination: `${basePath}/${withConvertSlug(slug)}`,
    permanent: true,
  }));
}

export const CONVERSION_ROUTE_REDIRECTS = [
  {
    source: "/converter/convert-url-encoder",
    destination: "/converter/convert-url-encoder-decoder",
    permanent: true,
  },
  {
    source: "/converter/convert-url-decoder",
    destination: "/converter/convert-url-encoder-decoder",
    permanent: true,
  },
  {
    source: "/converter/convert-html-encoder",
    destination: "/converter/convert-html-entity-encoder-decoder",
    permanent: true,
  },
  {
    source: "/converter/convert-html-decoder",
    destination: "/converter/convert-html-entity-encoder-decoder",
    permanent: true,
  },
  {
    source: "/converter/convert-base64-encoder",
    destination: "/converter/convert-base64-encoder-decoder",
    permanent: true,
  },
  {
    source: "/converter/convert-base64-decoder",
    destination: "/converter/convert-base64-encoder-decoder",
    permanent: true,
  },
  {
    source: "/converter/convert-text-to-binary",
    destination: "/converter/convert-binary-encoder-decoder",
    permanent: true,
  },
  {
    source: "/converter/convert-binary-to-text",
    destination: "/converter/convert-binary-encoder-decoder",
    permanent: true,
  },
  {
    source: "/converter/convert-text-to-hex",
    destination: "/converter/convert-hex-encoder-decoder",
    permanent: true,
  },
  {
    source: "/converter/convert-hex-to-text",
    destination: "/converter/convert-hex-encoder-decoder",
    permanent: true,
  },
  {
    source: "/converter/convert-text-to-octal",
    destination: "/converter/convert-octal-encoder-decoder",
    permanent: true,
  },
  {
    source: "/converter/convert-octal-to-text",
    destination: "/converter/convert-octal-encoder-decoder",
    permanent: true,
  },
  {
    source: "/converter/convert-text-to-decimal",
    destination: "/converter/convert-decimal-encoder-decoder",
    permanent: true,
  },
  {
    source: "/converter/convert-decimal-to-text",
    destination: "/converter/convert-decimal-encoder-decoder",
    permanent: true,
  },
  {
    source: "/converter/convert-punycode-encoder",
    destination: "/converter/convert-punycode-encoder-decoder",
    permanent: true,
  },
  {
    source: "/converter/convert-punycode-decoder",
    destination: "/converter/convert-punycode-encoder-decoder",
    permanent: true,
  },
  {
    source: "/converter/convert-idn-encoder",
    destination: "/converter/convert-idn-encoder-decoder",
    permanent: true,
  },
  {
    source: "/converter/convert-idn-decoder",
    destination: "/converter/convert-idn-encoder-decoder",
    permanent: true,
  },
  { source: "/converter/convert-json-to-csv", destination: "/converter/convert-json-converter", permanent: true },
  { source: "/converter/convert-csv-to-json", destination: "/converter/convert-csv-converter", permanent: true },
  { source: "/converter/convert-json-to-yaml", destination: "/converter/convert-json-converter", permanent: true },
  { source: "/converter/convert-yaml-to-json", destination: "/converter/convert-yaml-converter", permanent: true },
  { source: "/converter/convert-json-to-xml", destination: "/converter/convert-json-converter", permanent: true },
  { source: "/converter/convert-xml-to-json", destination: "/converter/convert-xml-converter", permanent: true },
  { source: "/converter/convert-xml-to-csv", destination: "/converter/convert-xml-converter", permanent: true },
  { source: "/converter/convert-csv-to-xml", destination: "/converter/convert-csv-converter", permanent: true },
  { source: "/converter/convert-xml-to-yaml", destination: "/converter/convert-xml-converter", permanent: true },
  { source: "/converter/convert-yaml-to-xml", destination: "/converter/convert-yaml-converter", permanent: true },
  { source: "/converter/convert-json-to-text", destination: "/converter/convert-json-converter", permanent: true },
  { source: "/converter/convert-xml-to-text", destination: "/converter/convert-xml-converter", permanent: true },
  { source: "/converter/convert-html-to-markdown", destination: "/converter/convert-markdown-html-converter", permanent: true },
  { source: "/converter/convert-markdown-to-html", destination: "/converter/convert-markdown-html-converter", permanent: true },
  ...buildPathRedirects("/image", Object.keys(IMAGE_FORMAT_CONVERSIONS)),
  ...buildPathRedirects("/image", IMAGE_STATIC_CONVERSION_SLUGS),
  ...buildPathRedirects("/pdf", PDF_CONVERSION_SLUGS),
  ...buildPathRedirects("/tailwind", TAILWIND_CONVERSION_SLUGS),
  ...buildPathRedirects("/text", TEXT_CONVERSION_SLUGS),
  ...buildPathRedirects("/converter", EXACT_CONVERTER_SLUGS),
  {
    source: "/text/image-to-text",
    destination: `/text/${withConvertSlug("image-to-text")}`,
    permanent: true,
  },
] as const;
