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
  "url-encoder",
  "url-decoder",
  "html-encoder",
  "html-decoder",
  "base64-encoder",
  "base64-decoder",
  "rot13-encoder-decoder",
  "rot47-encoder-decoder",
  "text-to-binary",
  "binary-to-text",
  "text-to-hex",
  "hex-to-text",
  "text-to-octal",
  "octal-to-text",
  "text-to-decimal",
  "decimal-to-text",
  "punycode-encoder",
  "punycode-decoder",
  "idn-encoder",
  "idn-decoder",
  "json-to-csv",
  "csv-to-json",
  "json-to-yaml",
  "yaml-to-json",
  "json-to-xml",
  "xml-to-json",
  "xml-to-csv",
  "csv-to-xml",
  "xml-to-yaml",
  "yaml-to-xml",
  "json-to-text",
  "xml-to-text",
  "html-to-markdown",
  "markdown-to-html",
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
