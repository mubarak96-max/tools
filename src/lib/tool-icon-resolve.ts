export type ToolCategory =
  | "ai"
  | "construction"
  | "converter"
  | "finance"
  | "health"
  | "image"
  | "pdf"
  | "real-estate"
  | "tailwind"
  | "text"
  | "utility";

export type ToolIconInput = {
  slug?: string;
  title?: string;
  category?: ToolCategory | string;
  /** Full Iconify id, e.g. lucide:wallet — wins over slug/title/rules when set */
  iconify?: string;
};

type Rule = {
  test: RegExp;
  icon: string;
};

const CATEGORY_DEFAULTS: Record<string, string> = {
  ai: "lucide:sparkles",
  construction: "lucide:building-2",
  converter: "lucide:arrow-left-right",
  finance: "lucide:wallet",
  health: "lucide:heart-pulse",
  image: "lucide:image",
  pdf: "lucide:file-text",
  "real-estate": "lucide:house",
  tailwind: "lucide:palette",
  text: "lucide:type",
  utility: "lucide:wrench",
};

const EXACT_BY_SLUG: Record<string, string> = {
  // AI
  "ai-humanizer": "lucide:sparkles",

  // Construction
  "concrete-volume-calculator": "lucide:building-2",
  "paint-coverage-calculator": "lucide:paintbrush",
  "flooring-material-calculator": "lucide:ruler",
  "roofing-material-calculator": "lucide:house",
  "brick-block-quantity-calculator": "lucide:brick-wall",
  "wallpaper-calculator": "lucide:scroll-text",
  "gravel-mulch-volume-calculator": "lucide:shovel",
  "room-area-calculator": "lucide:square",
  "fence-material-calculator": "lucide:fence",
  "staircase-rise-and-run-calculator": "lucide:move-vertical",

  // Finance
  "salary-calculator": "lucide:wallet",
  "uae-salary-calculator": "lucide:wallet",
  "uae-gratuity-calculator": "lucide:badge-dollar-sign",
  "uae-visa-cost-calculator": "lucide:receipt",
  "mortgage-calculator": "lucide:house",
  "dti-calculator": "lucide:scale",
  "emi-calculator": "lucide:calculator",
  "car-loan-calculator": "lucide:car",
  "credit-card-payoff-calculator": "lucide:credit-card",
  "discount-calculator": "lucide:percent",
  "vat-calculator": "lucide:receipt",
  "gst-calculator": "lucide:receipt",
  "profit-margin-calculator": "lucide:trending-up",
  "compound-interest-calculator": "lucide:piggy-bank",
  "savings-goal-calculator": "lucide:piggy-bank",
  "percentage-calculator": "lucide:percent",
  "click-through-rate-calculator": "lucide:mouse-pointer-click",
  "cpc-cpm-calculator": "lucide:megaphone",
  "roi-calculator": "lucide:trending-up",
  "foreign-exchange-fee-calculator": "lucide:banknote-arrow-up",
  "loan-payoff-calculator": "lucide:badge-dollar-sign",
  "net-worth-calculator": "lucide:landmark",
  "budget-planner": "lucide:wallet-cards",
  "freelancer-rate-calculator": "lucide:briefcase",
  "payroll-tax-calculator": "lucide:receipt",
  "employee-cost-calculator": "lucide:users",
  "churn-rate-calculator": "lucide:trending-down",
  "customer-lifetime-value-calculator": "lucide:gem",
  "invoice-generator": "lucide:file-text",
  "salary-to-hourly-calculator": "lucide:clock",

  // Health
  "bmr-calculator": "lucide:heart-pulse",
  "calorie-calculator-tdee": "lucide:flame",
  "macro-calculator": "lucide:utensils-crossed",
  "ideal-body-weight-calculator": "lucide:scale",
  "body-fat-percentage-estimator": "lucide:scale",
  "waist-to-hip-ratio-calculator": "lucide:ruler",
  "water-intake-calculator": "lucide:droplets",
  "blood-pressure-category-checker": "lucide:activity",
  "coffee-caffeine-intake-tracker": "lucide:coffee",
  "pregnancy-due-date-calculator": "lucide:baby",
  "ovulation-fertility-window-calculator": "lucide:calendar-heart",
  "sleep-calculator": "lucide:moon-star",
  "intermittent-fasting-schedule-generator": "lucide:timer-reset",
  "one-rep-max-calculator": "lucide:dumbbell",
  "running-pace-calculator": "lucide:footprints",
  "vo2-max-estimator": "lucide:activity",
  "swim-pace-calculator": "lucide:waves",
  "cycling-power-to-weight-ratio": "lucide:bike",
  "marathon-finish-time-predictor": "lucide:timer",
  "calories-burned-calculator": "lucide:flame",
  "race-age-grading-calculator": "lucide:medal",
  "handicap-calculator-golf": "lucide:flag",

  // Image
  "ai-background-remover": "lucide:eraser",
  "random-color-generator": "lucide:palette",
  "convert-image-to-base64": "lucide:image-up",
  "convert-image-to-text": "lucide:scan-text",
  "image-colors-inverter": "lucide:circle-half",
  "flip-image-online": "lucide:flip-horizontal-2",
  "image-cropper-resizer": "lucide:crop",
  "image-compressor": "lucide:minimize-2",
  "image-watermark": "lucide:stamp",
  "image-pixelator": "lucide:grip",
  "image-blur-pixelate": "lucide:focus",
  "paste-image-to-download": "lucide:clipboard-paste",
  "trim-transparent-pixels": "lucide:scan-search",
  "add-borders-to-image": "lucide:square-dashed",
  "split-images-online": "lucide:columns-2",
  "merge-images-online": "lucide:combine",
  "pixel-art-converter": "lucide:blocks",
  "convert-image-to-ascii": "lucide:type",
  "online-collage-maker": "lucide:grid-2x2",
  "laser-eyes-meme-generator": "lucide:zap",
  "image-exif-viewer-metadata-remover": "lucide:scan-search",
  "website-color-palette-extractor": "lucide:palette",
  "website-screenshot-tool": "lucide:camera",
  "image-to-text-ocr": "lucide:scan-text",

  // PDF
  "merge-pdf": "lucide:combine",
  "split-pdf": "lucide:columns-2",
  "remove-pages": "lucide:scissors",
  "extract-pages": "lucide:file-output",
  "rotate-pdf": "lucide:rotate-cw",
  "add-page-numbers": "lucide:list-ordered",
  "add-watermark": "lucide:stamp",
  "convert-jpg-to-pdf": "lucide:file-image",
  "protect-pdf": "lucide:lock",
  "unlock-pdf": "lucide:lock-open",
  "organize-pdf": "lucide:folder-kanban",
  "crop-pdf": "lucide:crop",
  "sign-pdf": "lucide:pen-tool",
  "compress-pdf": "lucide:file-archive",
  "convert-html-to-pdf": "lucide:file-code-2",
  "compare-pdf": "lucide:file-diff",
  "convert-word-to-pdf": "lucide:file-text",
  "convert-powerpoint-to-pdf": "lucide:presentation",
  "convert-excel-to-pdf": "lucide:sheet",
  "convert-pdf-to-pdfa": "lucide:archive",

  // Real Estate
  "rental-yield-calculator": "lucide:building-2",
  "cap-rate-calculator": "lucide:building-2",
  "rent-affordability-calculator": "lucide:house",
  "closing-costs-calculator": "lucide:receipt",
  "price-per-square-foot-calculator": "lucide:ruler",
  "rent-vs-buy-calculator": "lucide:house",
  "down-payment-calculator": "lucide:badge-dollar-sign",
  "mortgage-refinance-calculator": "lucide:refresh-cw",
  "rental-cash-flow-calculator": "lucide:banknote",
  "home-buying-budget-calculator": "lucide:wallet",
  "lease-escalation-calculator": "lucide:trending-up",
  "security-deposit-calculator": "lucide:key-round",
  "property-management-fee-calculator": "lucide:briefcase",
  "stamp-duty-calculator": "lucide:stamp",
  "uk-stamp-duty-calculator": "lucide:stamp",
  "singapore-property-stamp-duty-calculator": "lucide:stamp",
  "singapore-buyers-stamp-duty-calculator": "lucide:stamp",
  "singapore-sellers-stamp-duty-calculator": "lucide:stamp",
  "nyc-transfer-tax-calculator": "lucide:receipt",
  "dubai-property-transfer-fee-calculator": "lucide:receipt",
  "scotland-lbtt-calculator": "lucide:receipt",
  "wales-ltt-calculator": "lucide:receipt",
  "hong-kong-stamp-duty-calculator": "lucide:stamp",
  "dubai-mortgage-registration-calculator": "lucide:file-badge",
  "dubai-service-charge-calculator": "lucide:building-2",

  // Tailwind
  "tailwind-colors": "lucide:palette",
  "tailwind-and-css-gradient-generator": "lucide:blend",
  "tailwind-css-shadow-generator": "lucide:square",
  "tailwind-css-button-generator": "lucide:mouse-pointer-click",
  "convert-css-to-tailwind": "lucide:arrow-left-right",
  "convert-tailwind-to-css": "lucide:arrow-left-right",
  "tailwind-flexbox-generator": "lucide:panel-left",
  "tailwind-css-grid-generator": "lucide:grid-2x2",
  "tailwind-card-generator": "lucide:layout-template",

  // Text
  "voice-dictation": "lucide:mic",
  "word-frequency-counter": "lucide:chart-column",
  "word-frequency": "lucide:chart-column",
  "character-counter": "lucide:text-cursor-input",
  "case-converter": "lucide:case-sensitive",
  "duplicate-word-finder": "lucide:search",
  "em-dash-remover": "lucide:minus",
  "strikethrough-text": "lucide:strikethrough",
  "reverse-text-generator": "lucide:arrow-right-left",
  "morse-code-translator": "lucide:radio",
  "binary-code-translator": "lucide:binary",
  "ascii-art-generator": "lucide:type",
  "word-cloud-generator": "lucide:cloud",
  "remove-duplicate-lines": "lucide:list-filter",
  "trim-text-lines": "lucide:wrap-text",
  "empty-line-remover": "lucide:rows-3",
  "extra-whitespaces-remover": "lucide:space",
  "all-whitespaces-remover": "lucide:space",
  "punctuation-mark-remover": "lucide:pilcrow",
  "character-accent-remover": "lucide:languages",
  "backslash-remover": "lucide:slash",
  "backslash-adder": "lucide:slash",
  "convert-spaces-to-tabs": "lucide:indent-increase",
  "convert-tabs-to-spaces": "lucide:indent-decrease",
  "convert-spaces-to-newlines": "lucide:wrap-text",
  "convert-newlines-to-spaces": "lucide:wrap-text",
  "text-line-reverser": "lucide:arrow-up-down",
  "add-line-numbers": "lucide:list-ordered",
  "add-line-prefixes": "lucide:list-plus",
  "add-line-suffixes": "lucide:list-plus",
  "prefix-and-suffix-text-lines": "lucide:list-plus",
  "text-line-filter": "lucide:list-filter",
  "text-line-joiner": "lucide:merge",
  "truncate-text-lines": "lucide:scissors-line-dashed",
  "alphabetic-text-sorter": "lucide:arrow-up-a-z",
  "numeric-text-sorter": "lucide:arrow-up-0-1",
  "text-by-length-sorter": "lucide:arrow-up-wide-narrow",
  "word-sorter": "lucide:arrow-up-a-z",
  "center-text": "lucide:align-center",
  "left-pad-text": "lucide:align-left",
  "right-pad-text": "lucide:align-right",
  "justify-text": "lucide:align-justify",
  "email-extractor": "lucide:mail",
  "url-extractor": "lucide:link",
  "number-extractor": "lucide:hash",
  "regex-match-extractor": "lucide:braces",
  "regex-match-replacer": "lucide:replace",
  "text-statistics": "lucide:chart-column",
  "phrase-frequency-calculator": "lucide:chart-column",
  "find-longest-text-line": "lucide:stretch-horizontal",
  "find-shortest-text-line": "lucide:shrink-horizontal",
  "text-to-slug-converter": "lucide:link",
  "text-to-list-list-to-text": "lucide:list",
  "readability-flesch-kincaid-calculator": "lucide:book-open-text",
  "character-frequency-map": "lucide:chart-column",
  "lorem-ipsum-generator": "lucide:file-pen-line",
  "text-difference-checker": "lucide:file-diff",
  "fancy-font-generator": "lucide:type",
  "upside-down-text-generator": "lucide:flip-vertical-2",
  "tiny-text-generator": "lucide:type",
  "invisible-character-empty-text": "lucide:eye-off",
  "zalgo-glitch-text-generator": "lucide:zap",
  "unicode-ascii-table-search": "lucide:table-properties",

  // Utility
  "expected-goals-xg-calculator": "lucide:target",
  "xg-expected-goals-calculator": "lucide:target",
  "free-social-media-carousel-builder": "lucide:panels-top-left",
  "bmi-calculator": "lucide:scale",
  "age-calculator": "lucide:calendar-days",
  "tip-calculator": "lucide:receipt",
  "free-cv-resume-builder": "lucide:file-user",
  "robots-txt-generator": "lucide:bot",
  "sitemap-generator": "lucide:network",
  "jwt-decoder": "lucide:key-round",
  "scientific-calculator": "lucide:calculator",
  "quadratic-equation-solver": "lucide:sigma",
  "statistics-calculator": "lucide:chart-column",
  "probability-calculator": "lucide:dices",
  "logarithm-calculator": "lucide:sigma",
  "utm-link-builder": "lucide:link-2",
  "qr-code-generator": "lucide:qr-code",
  "barcode-generator": "lucide:barcode",
  "qr-code-scanner": "lucide:scan-line",
  "barcode-scanner": "lucide:scan-line",
  "pomodoro-timer": "lucide:timer-reset",
  "meta-tags-generator": "lucide:code-2",
  "json-prettifier": "lucide:braces",
  "json-minifier": "lucide:braces",
  "json-validator": "lucide:braces",
  "js-prettifier": "lucide:file-code-2",
  "js-minifier": "lucide:file-code-2",
  "js-validator": "lucide:file-code-2",
  "html-prettifier": "lucide:file-code-2",
  "html-minifier": "lucide:file-code-2",
  "css-prettify": "lucide:file-code-2",
  "css-minifier": "lucide:file-code-2",
  "xml-prettifier": "lucide:braces",
  "xml-minifier": "lucide:braces",
  "random-password-generator": "lucide:shield",
  "random-string-generator": "lucide:shuffle",
  "random-number-generator": "lucide:hash",
  "random-uuid-generator": "lucide:fingerprint",
  "random-date-generator": "lucide:calendar-days",
  "random-time-generator": "lucide:clock",
  "random-element-picker": "lucide:dices",
};

const GLOBAL_RULES: Rule[] = [
  { test: /\b(ai|humanizer|rewrite)\b/, icon: "lucide:sparkles" },
  { test: /\b(calculator|solver|estimator|predictor|checker|planner|tracker)\b/, icon: "lucide:calculator" },
  { test: /\b(generator|builder|maker)\b/, icon: "lucide:wand-sparkles" },
  { test: /\b(converter|convert)\b/, icon: "lucide:arrow-left-right" },

  { test: /\b(vat|gst|invoice|tax|fee|cost|closing|stamp|duty)\b/, icon: "lucide:receipt" },
  { test: /\b(salary|payroll|budget|gratuity|hourly|employee)\b/, icon: "lucide:wallet" },
  { test: /\b(mortgage|home buying|rent|property|lease|housing|deposit)\b/, icon: "lucide:house" },
  { test: /\b(loan|payoff|credit card|down payment|refinance)\b/, icon: "lucide:credit-card" },
  {
    test: /\b(profit|margin|roi|interest|savings|net worth|cash flow|yield|cap rate|lifetime value|churn)\b/,
    icon: "lucide:trending-up",
  },
  { test: /\b(percentage|discount|ctr|cpc|cpm)\b/, icon: "lucide:percent" },
  { test: /\b(exchange|currency|forex)\b/, icon: "lucide:banknote" },

  { test: /\b(bmr|calorie|tdee|macro|fitness|vo2|pace|cycling|marathon|running|swim|one rep max|burned)\b/, icon: "lucide:heart-pulse" },
  { test: /\b(weight|body fat|waist|hip|bmi)\b/, icon: "lucide:scale" },
  { test: /\b(water|hydration)\b/, icon: "lucide:droplets" },
  { test: /\b(sleep)\b/, icon: "lucide:moon-star" },
  { test: /\b(fasting|timer)\b/, icon: "lucide:timer-reset" },
  { test: /\b(pregnancy|ovulation|fertility)\b/, icon: "lucide:baby" },
  { test: /\b(blood pressure|caffeine|coffee)\b/, icon: "lucide:activity" },

  { test: /\b(background remover|eraser|remove background)\b/, icon: "lucide:eraser" },
  { test: /\b(color|palette|gradient)\b/, icon: "lucide:palette" },
  { test: /\b(crop|trim)\b/, icon: "lucide:crop" },
  { test: /\b(flip)\b/, icon: "lucide:flip-horizontal-2" },
  { test: /\b(blur|pixel|ascii|ocr|exif|metadata)\b/, icon: "lucide:scan-search" },
  { test: /\b(watermark|stamp)\b/, icon: "lucide:stamp" },
  { test: /\b(collage|grid|merge|split)\b/, icon: "lucide:grid-2x2" },
  { test: /\b(screenshot|camera)\b/, icon: "lucide:camera" },
  { test: /\b(jpg|jpeg|png|webp|bmp|gif|tiff|heic|avif|psd|eps)\b/, icon: "lucide:image" },

  { test: /\bpdf\b/, icon: "lucide:file-text" },
  { test: /\b(protect|lock)\b/, icon: "lucide:lock" },
  { test: /\b(unlock)\b/, icon: "lucide:lock-open" },
  { test: /\b(compress|archive)\b/, icon: "lucide:file-archive" },
  { test: /\b(sign|signature)\b/, icon: "lucide:pen-tool" },
  { test: /\b(compare|difference)\b/, icon: "lucide:file-diff" },

  { test: /\b(json|xml|yaml|csv)\b/, icon: "lucide:braces" },
  { test: /\b(base64|binary|hex|octal|decimal|rot13|rot47|morse|ascii)\b/, icon: "lucide:binary" },
  { test: /\b(url|domain|punycode|unicode|ascii domain|utm)\b/, icon: "lucide:globe" },
  { test: /\b(html|css|js|javascript|meta tags)\b/, icon: "lucide:file-code-2" },
  { test: /\b(unix|utc|seconds|time)\b/, icon: "lucide:clock" },
  { test: /\b(miles|kilometers|degrees|radians|foot|feet|metre|meter|square foot)\b/, icon: "lucide:ruler" },
  { test: /\b(celsius|fahrenheit)\b/, icon: "lucide:thermometer" },
  { test: /\b(pounds|kilograms)\b/, icon: "lucide:weight" },

  { test: /\b(voice|dictation|microphone)\b/, icon: "lucide:mic" },
  { test: /\b(case|uppercase|lowercase|camel|pascal|snake|kebab)\b/, icon: "lucide:case-sensitive" },
  { test: /\b(counter|frequency|statistics|readability)\b/, icon: "lucide:chart-column" },
  { test: /\b(extractor|email|url|number)\b/, icon: "lucide:search" },
  { test: /\b(regex)\b/, icon: "lucide:braces" },
  { test: /\b(sorter|sort)\b/, icon: "lucide:arrow-up-a-z" },
  {
    test: /\b(prefix|suffix|line|list|pad|justify|truncate|whitespace|punctuation|accent|backslash)\b/,
    icon: "lucide:wrap-text",
  },
  { test: /\b(slug)\b/, icon: "lucide:link" },
  { test: /\b(font|unicode|zalgo|tiny|upside down|invisible)\b/, icon: "lucide:type" },

  { test: /\b(robots)\b/, icon: "lucide:bot" },
  { test: /\b(sitemap)\b/, icon: "lucide:network" },
  { test: /\b(jwt|token)\b/, icon: "lucide:key-round" },
  { test: /\b(qr)\b/, icon: "lucide:qr-code" },
  { test: /\b(barcode)\b/, icon: "lucide:barcode" },
  { test: /\b(scanner|scan)\b/, icon: "lucide:scan-line" },
  { test: /\b(password|secure|security)\b/, icon: "lucide:shield" },
  { test: /\b(uuid)\b/, icon: "lucide:fingerprint" },
  { test: /\b(random)\b/, icon: "lucide:dices" },
];

export function normalize(value?: string) {
  return (value || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/\//g, " ")
    .replace(/[()]/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
}

/** Last path segment of a tool href, e.g. /text/foo → foo */
export function hrefToSlug(href: string) {
  const trimmed = href.replace(/^\/+|\/+$/g, "");
  const segment = trimmed.split("/").pop() ?? "";
  return segment;
}

export function getToolIconName(input: ToolIconInput): string {
  if (input.iconify?.includes(":")) {
    return input.iconify.trim();
  }

  const slug = normalize(input.slug);
  const title = normalize(input.title);
  const haystack = `${slug} ${title}`.trim();

  if (slug && EXACT_BY_SLUG[slug]) return EXACT_BY_SLUG[slug];
  if (title && EXACT_BY_SLUG[title]) return EXACT_BY_SLUG[title];

  for (const rule of GLOBAL_RULES) {
    if (rule.test.test(haystack)) return rule.icon;
  }

  const category = normalize(input.category);
  if (CATEGORY_DEFAULTS[category]) return CATEGORY_DEFAULTS[category];

  return "lucide:wrench";
}
