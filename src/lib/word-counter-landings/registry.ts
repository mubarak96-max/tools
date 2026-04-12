import type { WordCounterLanding, WordCounterLandingMap } from "./types";

const map: WordCounterLandingMap = {};

function add(landing: WordCounterLanding) {
  map[landing.slug] = landing;
}

function audienceFaq(label: string) {
  return [
    {
      question: `Does this word counter store ${label.toLowerCase()} drafts?`,
      answer:
        "No server upload is required for the counter to run. Text stays in your browser session like other FindBest Tools text utilities, so treat it like any local scratchpad and avoid pasting highly sensitive material.",
    },
    {
      question: `Which number should ${label.toLowerCase()} watch first?`,
      answer:
        "Start with words when a brief gives a word range. Switch to characters when a form, ad platform, or social network enforces a hard character cap. Use reading time when you are shaping content for time-boxed readers or spoken delivery.",
    },
    {
      question: "Can I count pasted notes that include citations and headings?",
      answer:
        "Yes. Headings, quotes, and references all contribute to totals. If your style guide excludes certain blocks, delete them temporarily in the box to see how much body copy remains.",
    },
    {
      question: "How accurate is the reading time estimate?",
      answer:
        "It uses a common average reading speed as a rough guide. Dense academic prose or technical documentation often reads slower; skimmable bullet lists can read faster.",
    },
  ];
}

/** Programmatic audience pages — distinct hooks per row to limit duplicate copy. */
const AUDIENCE_ROWS: { id: string; title: string; hook: string; angle: string }[] = [
  {
    id: "college-students",
    title: "College Students",
    hook: "Syllabus limits, discussion posts, and lab reports all come with different length expectations.",
    angle: "Use the live totals before you export to PDF so you can fix run-on sections while citations are still easy to edit.",
  },
  {
    id: "high-school-students",
    title: "High School Students",
    hook: "Short answers, DBQs, and five-paragraph essays all punish vague padding or accidental undershooting.",
    angle: "Paste each prompt response on its own so you can see whether you are inside the teacher’s stated minimum and maximum.",
  },
  {
    id: "writers",
    title: "Writers",
    hook: "Chapters, flash fiction, and magazine pitches all move faster when you know where length stands.",
    angle: "Track words while you rearrange scenes, then glance at reading time before you send excerpts to critique partners.",
  },
  {
    id: "bloggers",
    title: "Bloggers",
    hook: "Posts rank better when intros are tight and skimmable sections break dense ideas.",
    angle: "Watch words while you tighten anecdotes, then use paragraphs to see whether subheads are doing enough structural work.",
  },
  {
    id: "content-writers",
    title: "Content Writers",
    hook: "Editorial calendars mix long guides with short product blurbs, each with its own contract length.",
    angle: "Keep the word total visible while you merge feedback so you do not silently drift outside the agreed scope.",
  },
  {
    id: "copywriters",
    title: "Copywriters",
    hook: "Headlines, body copy, and disclaimers each compete for space inside strict layout grids.",
    angle: "Lean on characters for hero lines and words for supporting paragraphs while you iterate variants.",
  },
  {
    id: "freelancers",
    title: "Freelancers",
    hook: "Scopes often bill by deliverable length, so surprises show up as soon as drafts diverge from estimates.",
    angle: "Paste client-ready sections separately from research dumps to see billable length without noise.",
  },
  {
    id: "journalists",
    title: "Journalists",
    hook: "Ledes, nut grafs, and captions all carry different length habits inside the same story package.",
    angle: "Compare sentence totals when you suspect repetitive structure, then trim quotes where words spike.",
  },
  {
    id: "researchers",
    title: "Researchers",
    hook: "Abstracts, lay summaries, and grant aims pages each enforce their own compact language.",
    angle: "Use words for narrative sections and characters when a portal enforces hard caps on contributor bios.",
  },
  {
    id: "academics",
    title: "Academics",
    hook: "Conference submissions and journal cover letters rarely forgive accidental overruns.",
    angle: "Paste near-final prose to confirm totals after you convert citations, because reference styles shift length.",
  },
  {
    id: "authors",
    title: "Authors",
    hook: "Synopses, query letters, and sample chapters are easier to tune when length feedback is immediate.",
    angle: "Track words per chapter while you reorder beats, then use reading time to sense pacing for beta readers.",
  },
  {
    id: "social-media",
    title: "Social Media Managers",
    hook: "Calendar weeks mix platform-specific limits, tone shifts, and campaign hashtags.",
    angle: "Count characters for captions first, then review words to keep messaging consistent across channels.",
  },
  {
    id: "instagram",
    title: "Instagram Captions",
    hook: "Captions reward short hooks even when the feed allows longer stories.",
    angle: "Watch characters for the first screen of text, then use words to keep CTA lines crisp.",
  },
  {
    id: "twitter",
    title: "X (Twitter) Posts",
    hook: "Short posts still need room for mentions, links, and punctuation that all consume characters.",
    angle: "Paste the final string with hashtags included so the counter reflects what followers actually see.",
  },
  {
    id: "youtube",
    title: "YouTube Descriptions",
    hook: "Descriptions carry searchable keywords, timestamps, and sponsor language in one block.",
    angle: "Use characters when you are flirting with truncation, and words when you want density checks on keyword stuffing.",
  },
  {
    id: "email-writing",
    title: "Email Writing",
    hook: "Cold outreach, newsletters, and support macros all land better when length matches reader expectations.",
    angle: "Compare sentences when replies feel rambling, and paragraphs when HTML signatures inflate the draft.",
  },
  {
    id: "business-writing",
    title: "Business Writing",
    hook: "Memos, one-pagers, and exec summaries compete for leadership attention with tight schedules.",
    angle: "Use reading time to sense whether a busy reader can finish in a single glance, then trim words second.",
  },
  {
    id: "marketing",
    title: "Marketing Teams",
    hook: "Campaign briefs specify hero copy, fine print, and alternate headlines in parallel.",
    angle: "Paste each asset separately so totals stay honest while you juggle approvals across stakeholders.",
  },
  {
    id: "research-paper",
    title: "Research Papers",
    hook: "Abstracts and discussion sections often carry the tightest word ceilings in the whole manuscript.",
    angle: "Isolate those sections in the box after you finish heavier methods text so limits stay visible.",
  },
  {
    id: "college-essay",
    title: "College Application Essays",
    hook: "Personal statements reward specificity, but portals still enforce hard maximums.",
    angle: "Track words while you swap anecdotes, then re-check after you add transition sentences.",
  },
  {
    id: "blog-posts",
    title: "Blog Posts",
    hook: "Listicles, tutorials, and opinion pieces all land on different ideal lengths for SEO and readability.",
    angle: "Use paragraphs to see whether subheads are frequent enough for scanners before you publish.",
  },
  {
    id: "scholarship-essay",
    title: "Scholarship Essays",
    hook: "Committees read hundreds of packets, so concise storytelling inside the limit stands out.",
    angle: "Paste each revision to see whether gratitude paragraphs are consuming words you need for proof of impact.",
  },
  {
    id: "dissertations",
    title: "Dissertation Chapters",
    hook: "Chapter drafts balloon quietly while you add citations, figures, and footnotes.",
    angle: "Paste body text without figures temporarily to understand narrative length, then restore references for final checks.",
  },
  {
    id: "grant-writing",
    title: "Grant Writing",
    hook: "Specific aims pages and public summaries punish both vagueness and overrun simultaneously.",
    angle: "Watch words while you tighten outcomes language, then use sentences to catch repetitive clause stacks.",
  },
  {
    id: "legal-writing",
    title: "Legal Writing",
    hook: "Motions, client updates, and contract summaries must stay precise without burying the argument.",
    angle: "Sentence count helps spot stacked dependent clauses that readers may struggle to parse quickly.",
  },
  {
    id: "teachers",
    title: "Teachers",
    hook: "Rubric explanations, parent updates, and model answers all need predictable length for busy families.",
    angle: "Use reading time on parent-facing notes to keep empathy high without turning updates into essays.",
  },
  {
    id: "linkedin",
    title: "LinkedIn Posts",
    hook: "Professional stories perform best when the first lines fit the feed truncation window.",
    angle: "Characters guide the hook, while words help you avoid stacking too many ideas into one update.",
  },
  {
    id: "tiktok",
    title: "TikTok Captions",
    hook: "Short video captions still carry hashtags, mentions, and CTA links that consume space fast.",
    angle: "Paste the final caption string with emojis included so Unicode length matches what you publish.",
  },
  {
    id: "facebook",
    title: "Facebook Posts",
    hook: "Community posts mix storytelling with event details and comment prompts.",
    angle: "Paragraph count helps you see whether dense paragraphs should become bullet lists before scheduling.",
  },
  {
    id: "newsletters",
    title: "Newsletter Writers",
    hook: "Inbox readers skim; subject lines, previews, and bodies each obey different length habits.",
    angle: "Paste sections separately to compare word budgets between editorial and sponsor blocks.",
  },
  {
    id: "translators",
    title: "Translators",
    hook: "Target languages expand or shrink text even when meaning stays faithful.",
    angle: "Count words on both source and target drafts to brief designers who need consistent layout space.",
  },
  {
    id: "developers",
    title: "Developers",
    hook: "README files, release notes, and error copy all ship inside UI constraints.",
    angle: "Characters matter for tooltips, while words help you keep tutorials scannable next to code blocks.",
  },
  {
    id: "scientific-writing",
    title: "Scientific Writing",
    hook: "Plain-language summaries and graphical abstracts ask for different tone without losing accuracy.",
    angle: "Use reading time on public summaries to confirm they fit timeboxed outreach formats.",
  },
  {
    id: "admissions-essay",
    title: "Admissions Essays",
    hook: "Voice and proof both need room, yet every portal enforces a ceiling.",
    angle: "Track words while you tighten anecdotes, then re-run totals after you add reflective closing lines.",
  },
  {
    id: "thesis",
    title: "Thesis Writers",
    hook: "Literature reviews absorb pages quickly while arguments still need proportional space.",
    angle: "Paste individual sections to compare balance across chapters before committee review.",
  },
  {
    id: "poetry",
    title: "Poets",
    hook: "Line breaks and stanza spacing interact with contest rules that still cite word caps.",
    angle: "Words help compare drafts, while characters surface unexpected spaces that affect anthology formatting.",
  },
  {
    id: "script-writers",
    title: "Script Writers",
    hook: "Dialogue density and stage directions both influence runtime even when page counts differ.",
    angle: "Reading time offers a rough pacing cue while you adjust speeches and action beats.",
  },
  {
    id: "speech-writers",
    title: "Speech Writers",
    hook: "Minutes on stage rarely match intuitive word counts because delivery speed varies.",
    angle: "Combine words with reading time, then rehearse aloud because pauses and emphasis change perceived length.",
  },
  {
    id: "ecommerce",
    title: "E-commerce Teams",
    hook: "Product bullets, compliance lines, and promo banners share tight space on PDP templates.",
    angle: "Characters keep bullets inside design grids, while words help merchandising stay consistent across variants.",
  },
];

function addAudience(row: (typeof AUDIENCE_ROWS)[number]) {
  const slug = `word-counter-for-${row.id}`;
  add({
    slug,
    toolVariant: "audience",
    metaTitle: `Word Counter for ${row.title} | Online Word Count`,
    h1: `Word Counter for ${row.title}`,
    description: `Free word counter tailored for ${row.title.toLowerCase()}: live words, characters, sentences, paragraphs, and reading time for drafts and published copy.`,
    keywords: [
      `word counter for ${row.id.replace(/-/g, " ")}`,
      "online word counter",
      "word count tool",
      row.title.toLowerCase(),
    ],
    intro: `${row.hook} ${row.angle}`,
    sections: [
      {
        heading: `What ${row.title.toLowerCase()} usually measure first`,
        paragraphs: [
          `${row.title} most often start with the word total when a brief, syllabus, or contract names a range. Characters become the priority when a network, court filing portal, or CMS field enforces a hard cap. Reading time rounds out the picture when the audience is timeboxed or listening instead of reading.`,
        ],
      },
      {
        heading: "How to read the live panel beside your draft",
        paragraphs: [
          "Words update as you type, which makes the counter useful while you rearrange paragraphs or swap examples. Sentences and paragraphs act as lightweight structure signals: sudden spikes in sentences can mean choppy rhythm, while a single giant paragraph often means online readers will bounce.",
          "Characters without spaces appear alongside the full character total so you can match whichever rule your submission system quotes.",
        ],
      },
      {
        heading: "Workflow tips before you submit or publish",
        paragraphs: [
          "Paste near-final text after formatting changes, because fonts and citations can shift length late. If you collaborate in another editor, give the pasted copy a quick scan for stray smart quotes or double spaces that inflate totals unexpectedly.",
        ],
      },
    ],
    faq: audienceFaq(row.title),
    tool: {
      placeholder: `Paste ${row.title.toLowerCase()} draft text to count words, characters, sentences, paragraphs, and reading time.`,
    },
  });
}

function limitLanding(words: number, under = false) {
  const slug = under ? `word-counter-under-${words}-words` : `word-counter-${words}-words`;
  const title = under ? `Word Counter for Under ${words} Words` : `Word Counter for ${words} Words`;
  const description = under
    ? `Stay under ${words} words with a live counter, character totals, and reading-time estimates while you edit.`
    : `Shape ${words}-word assignments with a live target bar, character totals, sentences, paragraphs, and reading time.`;
  add({
    slug,
    toolVariant: "limit",
    metaTitle: `${title} | Target Word Count`,
    h1: title,
    description,
    keywords: [slug.replace(/-/g, " "), "word counter", "word count", `${words} words`],
    intro: under
      ? `Some prompts reward brevity. This page highlights a rolling comparison against ${words} words so you can trim examples without losing the thesis.`
      : `${words}-word targets show up in classrooms, blogs, and client scopes. The counter pairs a clear goal line with the usual stats so you can edit with confidence.`,
    sections: [
      {
        heading: under ? "Why “under” limits need a different mindset" : `What a ${words}-word target usually signals`,
        paragraphs: under
          ? [
              "Under-limits reward tight evidence selection. The progress bar moves in reverse emotionally: smaller is better, so use words to strip redundancy while sentences tell you whether you are over-punctuating.",
            ]
          : [
              `${words} words often marks a short essay, focused briefing, or readable newsletter segment. Editors choose that band because it forces prioritization: one strong argument beats three half-developed ones.`,
            ],
      },
      {
        heading: "How to pair the bar with the other metrics",
        paragraphs: [
          "Words feed the goal bar directly. Characters still matter when footers, citations, or bios attach to the same submission box. Reading time helps when the piece will be narrated or consumed during a commute.",
        ],
      },
      {
        heading: "Editing moves that protect meaning while shifting length",
        paragraphs: [
          "Delete intensifiers before you delete examples. Combine sentences only when the thought truly belongs together, and split long sentences when quotes or lists make them hard to parse.",
        ],
      },
    ],
    faq: [
      {
        question: "Does the bar stop me from typing past the target?",
        answer:
          "No. It only visualizes progress so you can decide what to cut or develop. Nothing is blocked or truncated automatically.",
      },
      {
        question: "How should I count references or footnotes?",
        answer:
          "Paste the same version you will submit. If your rubric excludes references from the limit, remove that block temporarily to see body length on its own.",
      },
      {
        question: "Why do characters still matter on a word-limited task?",
        answer:
          "Some portals validate characters separately, especially titles, bios, or structured metadata fields that travel beside the essay body.",
      },
      {
        question: "Where is the generic counter without a preset target?",
        answer: "Use /text/character-counter for the same metrics without a highlighted goal.",
      },
    ],
    tool: { targetWordCount: words, emphasizeMetric: "words" },
  });
}

// --- Priority editorial landings ---
add({
  slug: "word-counter-for-essay",
  toolVariant: "essay",
  metaTitle: "Word Counter for Essays | Assignment Length Checker",
  h1: "Word Counter for Essays",
  description:
    "Count essay words, paragraphs, sentences, and reading time in one free tool. Built for class prompts, timed drafts, and revision passes before submission.",
  keywords: ["word counter for essay", "essay word count", "assignment word counter", "how many words in my essay"],
  intro:
    "Essays live or die on clarity inside a limit. This page keeps rubric-friendly totals beside your draft so you can strengthen arguments without accidentally blowing past the maximum or stalling short of the minimum.",
  sections: [
    {
      heading: "Why essay writers watch more than one number",
      paragraphs: [
        "Professors rarely care about words alone. They care about evidence, structure, and whether you respected the instructions. Words are the fastest proxy for scope, while paragraphs reveal whether you grouped ideas into readable units.",
        "Characters still matter when you paste the same essay into a portal that validates title length separately or when you adapt a paragraph into a shorter abstract field.",
      ],
    },
    {
      heading: "How to use the counter during revision passes",
      paragraphs: [
        "Paste the body without the bibliography when the rubric excludes references, then add those sections back before the final submission pass. Between revisions, re-check totals after you swap examples, because anecdotes silently consume words.",
        "If sentences climb faster than words, you may be using many short punchy lines—great for voice, exhausting if overdone—so let the sentence count guide micro edits.",
      ],
    },
    {
      heading: "Common classroom scenarios this page fits",
      paragraphs: [
        "Timed in-class prompts where you need a quick gut check, take-home drafts with both minimum and maximum ranges, and scholarship essays where every word competes with another qualified applicant.",
      ],
    },
  ],
  faq: [
    {
      question: "Does this know my teacher’s exact word policy?",
      answer:
        "No automated tool can read your syllabus. Use the live totals as a precise ruler, then apply any rules your instructor gives about what counts toward the limit.",
    },
    {
      question: "Should quoted material count toward my essay limit?",
      answer:
        "Policies differ. If quotes do not count, remove them temporarily in this box to measure your original analysis on its own, then restore them before exporting.",
    },
    {
      question: "How accurate is reading time for graded essays?",
      answer:
        "It is an estimate based on average adult reading speed. Dense theory or technical definitions usually take longer per word than narrative writing.",
    },
    {
      question: "Can I use this on a phone?",
      answer:
        "Yes. The layout stacks for small screens, but long pastes still work best on a full keyboard when you are doing serious restructuring.",
    },
  ],
});

add({
  slug: "word-counter-for-seo",
  toolVariant: "seo",
  metaTitle: "Word Counter for SEO | Meta Title & Description Length",
  h1: "Word Counter for SEO",
  description:
    "Measure SEO copy length with live characters, words, sentences, and reading time. Ideal for meta titles, meta descriptions, and SERP snippets.",
  keywords: ["word counter for seo", "meta description length", "title tag character count", "seo word count"],
  intro:
    "Search snippets reward tight language inside invisible ceilings. This page emphasizes character discipline first while still showing words so you can keep phrasing human—not keyword stuffed.",
  sections: [
    {
      heading: "Which metrics map to SERP elements",
      paragraphs: [
        "Titles and descriptions truncate in results pages, so characters (with and without spaces) are the early warning system. Words still help you evaluate whether a title promise matches the article body you are promoting.",
        "Reading time is less critical for metadata, but it helps when you are previewing how long a linked article feels to a searcher deciding whether to click.",
      ],
    },
    {
      heading: "Practical checks before you publish metadata",
      paragraphs: [
        "Paste the exact string you will ship, including separators and brand tokens. Add sample keywords in natural positions, then re-run counts after you reorder phrases—small edits frequently push you a few characters over the edge.",
      ],
    },
    {
      heading: "When to jump to the neutral character counter hub",
      paragraphs: [
        "If you are juggling many unrelated assets, /text/character-counter offers the same metrics with neutral framing so you can reuse the workflow across teams.",
      ],
    },
  ],
  faq: [
    {
      question: "Does this enforce Google’s exact pixel truncation?",
      answer:
        "No. It counts characters and words mathematically. SERP rendering still depends on device width and Google’s live rules, so treat this as a close approximation, not a guarantee.",
    },
    {
      question: "Should I care about characters without spaces?",
      answer:
        "Some internal CMS validators mimic that stricter count. Having both totals visible helps you avoid last-minute surprises inside proprietary tools.",
    },
    {
      question: "Can I paste multiple meta variants at once?",
      answer:
        "Paste one variant per pass for the clearest signal. If you need side-by-side comparison, duplicate the tab or paste into separate documents temporarily.",
    },
    {
      question: "Does this store my client keywords?",
      answer:
        "The counter runs locally in your browser session like other text tools on this site. Avoid pasting confidential campaign details on shared computers.",
    },
  ],
});

add({
  slug: "word-counter-for-students",
  toolVariant: "students",
  metaTitle: "Word Counter for Students | Homework & Papers",
  h1: "Word Counter for Students",
  description:
    "Student-friendly word counter for homework, essays, and short answers. Live words, characters, sentences, paragraphs, and reading time while you revise.",
  keywords: ["word counter for students", "homework word count", "student essay counter", "assignment length"],
  intro:
    "Deadlines make every word expensive. This page highlights totals students check most—words for instructions, characters for portal fields—while keeping sentences and paragraphs visible for structure fixes.",
  sections: [
    {
      heading: "What students measure on different assignments",
      paragraphs: [
        "Discussion posts often care about words first. Scholarship essays and research summaries add paragraph expectations. Lab reports might bundle figure captions that quietly add length.",
      ],
    },
    {
      heading: "How to avoid last-minute surprises in submission portals",
      paragraphs: [
        "Paste the version you actually upload, including headings if the rubric counts them. If references do not count, strip them temporarily to see how much body copy remains, then restore before exporting.",
      ],
    },
    {
      heading: "Study habits that pair well with a live counter",
      paragraphs: [
        "Draft freely, then paste into the box for a measurement pass rather than watching numbers while ideas are still forming. That separation keeps creativity high and trimming intentional.",
      ],
    },
  ],
  faq: [
    {
      question: "Does this work for non-English essays?",
      answer:
        "The counter splits words on whitespace, so languages that do not separate words with spaces may need different tooling for linguistic accuracy.",
    },
    {
      question: "Can it detect filler words automatically?",
      answer:
        "No. It reports totals so you can edit deliberately. Pair it with your own style checklist for repeated intensifiers or vague transitions.",
    },
    {
      question: "Will my teacher know I used an online counter?",
      answer:
        "This page does not interact with learning-management systems. It is a measurement aid like a ruler, not a plagiarism checker or AI rewriter.",
    },
    {
      question: "Where can I get the same tool without student-specific tips?",
      answer: "Open /text/character-counter for identical metrics with neutral guidance.",
    },
  ],
});

add({
  slug: "word-counter-500-words",
  toolVariant: "limit",
  metaTitle: "Word Counter for 500 Words | Target Progress Bar",
  h1: "Word Counter for 500 Words",
  description:
    "Write toward a 500-word goal with a live progress bar plus characters, sentences, paragraphs, and reading time for essays and articles.",
  keywords: ["500 word essay", "word counter 500 words", "how long is 500 words", "500 word limit"],
  intro:
    "Five hundred words is a classic short-essay band: long enough to prove a point, short enough to force discipline. The goal bar tracks your draft against that target while the rest of the stats keep structure honest.",
  sections: [
    {
      heading: "What 500 words feels like to readers",
      paragraphs: [
        "At a typical adult reading speed, five hundred words lands near a few minutes of focused attention—longer than a caption, shorter than a deep feature. That makes it a frequent choice for op-eds, class prompts, and newsletter sections.",
      ],
    },
    {
      heading: "How to combine the bar with paragraph count",
      paragraphs: [
        "If words align with the target but paragraphs read as one or two giant blocks, readability may still suffer online. Use paragraph count as a nudge to insert breaks where ideas shift.",
      ],
    },
    {
      heading: "When to trust characters instead",
      paragraphs: [
        "If you are repurposing the same 500-word story into a bio box or structured CMS field, switch attention to characters so platform-specific truncation rules stay satisfied.",
      ],
    },
  ],
  faq: [
    {
      question: "Is 500 words exactly one page?",
      answer:
        "Page length depends on font, spacing, and margins. Use your editor’s print preview for physical pages, and use this counter for semantic length independent of layout.",
    },
    {
      question: "Does the progress bar include titles?",
      answer:
        "Everything in the text box counts. Remove titles temporarily if your instructions exclude them from the body limit.",
    },
    {
      question: "Can I use this for double-spaced school papers?",
      answer:
        "Yes for word count. Line spacing changes printed pages but not how many words you typed.",
    },
    {
      question: "What if I need a different target?",
      answer: "Browse other numbered word-counter pages in the /text directory or use /text/character-counter for a neutral baseline.",
    },
  ],
  tool: { targetWordCount: 500, emphasizeMetric: "words" },
});

add({
  slug: "word-counter-1000-words",
  toolVariant: "limit",
  metaTitle: "Word Counter for 1000 Words | Essay Length Tool",
  h1: "Word Counter for 1000 Words",
  description:
    "Track a 1000-word essay or article with a live goal bar, character totals, sentences, paragraphs, and estimated reading time.",
  keywords: ["1000 word essay", "word counter 1000 words", "how long is 1000 words", "1000 word limit"],
  intro:
    "One thousand words is a common take-home essay and blog depth. The bar keeps the target visible while you add examples, and the reading-time line helps you sanity-check how long the piece feels.",
  sections: [
    {
      heading: "Why instructors assign the thousand-word band",
      paragraphs: [
        "It is enough space to introduce a claim, support it with more than one piece of evidence, and still conclude. That also means padding is obvious—readers notice repetition fast.",
      ],
    },
    {
      heading: "Signals that you are over-developed in one section",
      paragraphs: [
        "If paragraph count stays low while words climb, you may be stacking many ideas into single blocks. Breaking paragraphs can reveal where transitions are missing.",
      ],
    },
    {
      heading: "Publishing adaptations after school",
      paragraphs: [
        "Marketing teams often recycle thousand-word explainers into shorter social threads. Capture the long draft here first, then trim deliberately with the same counter open in another tab.",
      ],
    },
  ],
  faq: [
    {
      question: "How many minutes of reading is 1000 words?",
      answer:
        "At roughly two hundred words per minute for familiar English prose, expect about five minutes for focused reading—faster for skimmers, slower for technical documentation.",
    },
    {
      question: "Does the counter include footnotes?",
      answer:
        "Everything pasted counts. If footnotes are excluded by policy, remove them temporarily to measure the main narrative.",
    },
    {
      question: "Can I track two sections separately?",
      answer:
        "Paste each section alone, note the totals, then combine manually. The box is intentionally single-focus to keep feedback immediate.",
    },
    {
      question: "Where can I open the tool without the 1000-word preset?",
      answer: "Visit /text/character-counter for the same metrics without a highlighted goal.",
    },
  ],
  tool: { targetWordCount: 1000, emphasizeMetric: "words" },
});

add({
  slug: "reading-time-calculator",
  toolVariant: "reading",
  metaTitle: "Reading Time Calculator | Words to Minutes",
  h1: "Reading Time Calculator",
  description:
    "Estimate reading time from pasted text using live word counts, paragraph structure, and a minutes display based on average reading speed.",
  keywords: ["reading time calculator", "words to minutes", "estimate reading time", "read time"],
  intro:
    "Readers, editors, and speakers all ask how long a piece takes to consume. This calculator keeps the minutes estimate prominent while still exposing the underlying word and paragraph totals.",
  sections: [
    {
      heading: "How reading time is estimated here",
      paragraphs: [
        "The tool divides word count by a common average reading speed for familiar prose. Technical manuals, legal disclaimers, and poetry usually deviate from that average, so treat the minutes line as a planning hint, not a stopwatch.",
      ],
    },
    {
      heading: "When paragraph count matters alongside minutes",
      paragraphs: [
        "Skimmable online articles with frequent subheads feel faster than wall-of-text pages with the same word count. If minutes look acceptable but paragraphs are few, consider visual breaks before publishing.",
      ],
    },
    {
      heading: "Speaking time versus silent reading",
      paragraphs: [
        "Speakers often land near a hundred and thirty to a hundred and fifty spoken words per minute for clear delivery, which differs from silent reading. Use this page for silent estimates, then rehearse aloud for presentations.",
      ],
    },
  ],
  faq: [
    {
      question: "Can I change the words-per-minute assumption?",
      answer:
        "Not inside this page. Adjust mentally: slower audiences divide words by a smaller number; expert skimmers divide by a larger one.",
    },
    {
      question: "Does it handle languages other than English?",
      answer:
        "It counts tokens separated by whitespace. Languages without whitespace word boundaries may not align with linguistic word counts.",
    },
    {
      question: "Why do characters still show?",
      answer:
        "Many publishing workflows pair reading estimates with character-limited previews, so both numbers stay visible for convenience.",
    },
    {
      question: "Is this the same engine as the character counter?",
      answer: "Yes. The metrics share the same calculation code as /text/character-counter with different emphasis on this page.",
    },
  ],
});

add({
  slug: "how-many-words-is-500-characters",
  toolVariant: "info",
  metaTitle: "How Many Words Is 500 Characters? | Estimate + Counter",
  h1: "How Many Words Is 500 Characters?",
  description:
    "Estimate how many words fit in five hundred characters, then paste real text to see exact counts for your wording, spacing, and punctuation.",
  keywords: ["500 characters to words", "how many words is 500 characters", "character to word estimate"],
  intro:
    "Rough English prose often lands near eighty to one hundred twenty words per five hundred characters, but punctuation, capitalization, and long words swing the range. Use the rule of thumb for planning, then paste actual copy for precision.",
  sections: [
    {
      heading: "Why the range is wide",
      paragraphs: [
        "Character counts include spaces. A paragraph heavy on short words packs more words per character than a paragraph full of long technical terms. Acronyms and URLs can swing totals dramatically.",
      ],
    },
    {
      heading: "How to move from estimate to exact",
      paragraphs: [
        "Paste the real string you care about—caption, meta description, SMS blast—into the box. Words and characters update together so you can compare against platform limits without hand math.",
      ],
    },
    {
      heading: "When to trust words per minute guidance instead",
      paragraphs: [
        "If your question is about speech or narration length rather than character-limited fields, pair word count with the reading-time line and rehearse aloud for final timing.",
      ],
    },
  ],
  faq: [
    {
      question: "Is eighty to one hundred twenty words guaranteed for five hundred characters?",
      answer:
        "No. It is a planning band for typical English sentences. Always verify with your actual text.",
    },
    {
      question: "Do emojis count as one character each?",
      answer:
        "Many emojis consume more than one Unicode code unit even though they look like a single glyph. Paste the real message to see the true length in your environment.",
    },
    {
      question: "Does this include line breaks?",
      answer:
        "Newline characters count as characters. If your platform strips breaks, remove them before measuring.",
    },
    {
      question: "Where can I learn about words per page instead?",
      answer: "See /text/how-many-words-is-a-page for a page-focused explainer with the same counter embedded.",
    },
  ],
});

// --- Programmatic expansions ---
for (const row of AUDIENCE_ROWS) {
  addAudience(row);
}

const LIMITS = [100, 150, 200, 250, 300, 400, 750, 1500, 2000, 3000];
for (const n of LIMITS) {
  limitLanding(n, false);
}
limitLanding(100, true);
limitLanding(300, true);

add({
  slug: "sentence-counter",
  toolVariant: "sentences",
  metaTitle: "Sentence Counter | Count Sentences in Text",
  h1: "Sentence Counter",
  description:
    "Count sentences in pasted text alongside words, characters, paragraphs, and reading time for editing rhythm and clarity.",
  keywords: ["sentence counter", "count sentences", "how many sentences", "sentence count tool"],
  intro:
    "Rhythm problems often hide in sentence count: many short lines feel staccato, while a few giant sentences exhaust readers. This page foregrounds sentences while keeping the full length dashboard available.",
  sections: [
    {
      heading: "When sentence count is the first signal",
      paragraphs: [
        "Instructional designers, editors, and teachers use sentence totals to spot monotony before line edits. Pair the count with words to see whether you are writing many short bursts or a few dense blocks.",
      ],
    },
    {
      heading: "How punctuation affects the total",
      paragraphs: [
        "The counter splits on sentence-ending punctuation followed by breaks or new text. Dialogue, ellipses, and uncommon punctuation may behave differently than perfect textbook prose, so sanity-check unusual formatting.",
      ],
    },
  ],
  faq: [
    {
      question: "Does every question mark start a new sentence?",
      answer: "Yes, along with periods and exclamation points, which matches how most readers perceive sentence boundaries.",
    },
    {
      question: "Do bullet lists confuse the counter?",
      answer:
        "Each line with ending punctuation can register as its own sentence. If that skews totals, paste prose without bullets temporarily.",
    },
  ],
});

add({
  slug: "paragraph-counter",
  toolVariant: "paragraphs",
  metaTitle: "Paragraph Counter | Count Paragraphs Online",
  h1: "Paragraph Counter",
  description:
    "Count paragraphs in pasted text with live words, characters, sentences, and reading time for layout and readability checks.",
  keywords: ["paragraph counter", "count paragraphs", "how many paragraphs", "paragraph count"],
  intro:
    "Readers skim online. Paragraph count is a fast proxy for visual breathing room when headings are not finalized yet.",
  sections: [
    {
      heading: "How blank lines define paragraphs here",
      paragraphs: [
        "Paragraphs are detected when one or more blank lines separate blocks. Single line breaks inside a block still count as one paragraph, which matches many essay and blog editors.",
      ],
    },
    {
      heading: "Pair paragraphs with word count",
      paragraphs: [
        "If words are high but paragraphs are low, you may be delivering a wall of text. If paragraphs are high with modest words, you might be over-fragmenting ideas.",
      ],
    },
  ],
  faq: [
    {
      question: "Do headings count as separate paragraphs?",
      answer:
        "If headings sit on their own line group separated by blank lines, they can register as short paragraphs. Remove headings temporarily if you want body-only structure counts.",
    },
    {
      question: "Does HTML paste affect counts?",
      answer:
        "Paste plain text for the most predictable results. Rich text can insert invisible characters that change spacing behavior.",
    },
  ],
});

add({
  slug: "characters-without-spaces",
  toolVariant: "characters",
  metaTitle: "Character Counter Without Spaces | Strict Length",
  h1: "Character Counter Without Spaces",
  description:
    "Highlight characters excluding spaces while still showing full character totals, words, sentences, paragraphs, and reading time.",
  keywords: ["characters without spaces", "character count no spaces", "strict character count"],
  intro:
    "Some validators ignore spaces when enforcing caps. This page foregrounds the no-space total so you can match those rules without losing the full dashboard.",
  sections: [
    {
      heading: "Why platforms exclude spaces",
      paragraphs: [
        "Space-insensitive counts approximate how much raw symbol density a database field or SMS segment carries. They are less forgiving, which makes them a good second check even when a word limit also exists.",
      ],
    },
  ],
  faq: [
    {
      question: "Which total should I trust for Twitter or SMS?",
      answer:
        "Each network evolves independently. Compare both numbers against the validator you are required to pass, then keep the stricter one as your guardrail.",
    },
  ],
});

add({
  slug: "text-length-checker",
  toolVariant: "characters",
  metaTitle: "Text Length Checker | Characters & Words",
  h1: "Text Length Checker",
  description:
    "Check overall text length with characters, words, sentences, paragraphs, and reading time in one paste-friendly view.",
  keywords: ["text length checker", "check text length", "online length checker"],
  intro:
    "Length is rarely one number. Forms care about characters, assignments care about words, and readers care about time. This checker keeps all three perspectives visible.",
  sections: [
    {
      heading: "Length for forms versus long-form drafts",
      paragraphs: [
        "Short UI strings prioritize characters. Articles and essays prioritize words. Use the appropriate column first, then glance at the others to catch side effects like bloated sentences.",
      ],
    },
  ],
  faq: [
    {
      question: "Is there a maximum paste size?",
      answer:
        "Extremely large pastes can slow down your browser. For huge documents, measure chapter by chapter for responsive feedback.",
    },
  ],
});

add({
  slug: "word-count-checker",
  toolVariant: "default",
  metaTitle: "Word Count Checker | Instant Online Count",
  h1: "Word Count Checker",
  description:
    "Check word count instantly with supporting characters, sentences, paragraphs, and reading time for essays, posts, and reports.",
  keywords: ["word count checker", "check word count", "online word count"],
  intro:
    "Word count is the lingua franca of classrooms and content briefs. This checker keeps words primary while surfacing the satellite stats editors still expect.",
  sections: [
    {
      heading: "When to re-check after edits",
      paragraphs: [
        "Major edits—deleting examples, merging paragraphs, swapping quotes—shift totals non-linearly. Re-paste after each structural pass instead of assuming a linear trim.",
      ],
    },
  ],
  faq: [
    {
      question: "Does hyphenation split words?",
      answer: "Hyphenated tokens count as single words when there is no whitespace between the parts.",
    },
  ],
  tool: { emphasizeMetric: "words" },
});

add({
  slug: "count-words-in-text",
  toolVariant: "task",
  metaTitle: "Count Words in Text | Free Online Tool",
  h1: "Count Words in Text",
  description:
    "Paste any block to count words with characters, sentences, paragraphs, and reading time for quick answers to how-long-is-this questions.",
  keywords: ["count words in text", "how many words", "word count text"],
  intro:
    "This is the direct answer to “how many words is this?” Drop the text in, copy the summary, and move on—or keep editing with live totals.",
  sections: [
    {
      heading: "A simple workflow for irregular text",
      paragraphs: [
        "Emails, chat logs, and PDF exports often include headers you do not want counted. Strip those lines first, then paste the cleaned body for a fair total.",
      ],
    },
  ],
  faq: [
    {
      question: "Does it work for PDFs?",
      answer: "Paste extracted text only. Upload-to-text lives on the dedicated OCR and PDF tools elsewhere on the site.",
    },
  ],
});

add({
  slug: "check-word-count-for-essay",
  toolVariant: "essay",
  metaTitle: "Check Word Count for an Essay | Live Counter",
  h1: "Check Word Count for an Essay",
  description:
    "Check essay word count with paragraph and sentence context plus character totals for portals that validate both.",
  keywords: ["check word count for essay", "essay word count checker", "assignment length"],
  intro:
    "Checking the essay is not only about hitting a maximum. Minimums, quoted material policies, and reference exclusions all change what you should paste into the box.",
  sections: [
    {
      heading: "Paste scope that matches your rubric",
      paragraphs: [
        "If the rubric excludes the title page or references, remove those sections temporarily, measure, then restore them before final export. That keeps the number you watch aligned with what actually gets graded.",
      ],
    },
  ],
  faq: [
    {
      question: "Can I trust this for timed exams?",
      answer:
        "It measures whatever you paste. For timed settings, budget a few seconds to paste and read totals so you are not surprised at submission time.",
    },
  ],
});

add({
  slug: "check-character-limit",
  toolVariant: "seo",
  metaTitle: "Check Character Limit | Online Length",
  h1: "Check Character Limit",
  description:
    "Check character limits with and without spaces alongside word totals for bios, metadata, SMS, and ad fields.",
  keywords: ["check character limit", "character limit counter", "count characters online"],
  intro:
    "Character limits punish invisible extras: trailing spaces, smart quotes, and emojis that consume more bytes than they look like they should.",
  sections: [
    {
      heading: "Paste the final string, not the ideal string",
      paragraphs: [
        "Include hashtags, tracking parameters, and legal disclaimers if they ship with the message. Those pieces frequently push campaigns over the limit at the last minute.",
      ],
    },
  ],
  faq: [
    {
      question: "Why show words on a character-limit page?",
      answer:
        "Writers still think in words while trimming. Keeping both visible reduces back-and-forth when a teammate asks how much copy is left conceptually.",
    },
  ],
});

add({
  slug: "calculate-reading-time",
  toolVariant: "reading",
  metaTitle: "Calculate Reading Time | From Words to Minutes",
  h1: "Calculate Reading Time",
  description:
    "Calculate reading time from pasted text with word and paragraph context using an average silent reading speed.",
  keywords: ["calculate reading time", "reading time from words", "minutes to read"],
  intro:
    "This page frames the same math as the reading-time calculator but speaks to people who arrive with a task phrasing—“calculate”—rather than a product name.",
  sections: [
    {
      heading: "Silent reading versus narration",
      paragraphs: [
        "Silent reading speeds vary by content difficulty. If you are writing VO or teleprompter copy, rehearse aloud because breaths and emphasis change perceived length.",
      ],
    },
  ],
  faq: [
    {
      question: "Is this different from /text/reading-time-calculator?",
      answer: "The metrics are the same; the guidance and FAQs differ to match different search intents.",
    },
  ],
});

add({
  slug: "measure-text-length",
  toolVariant: "characters",
  metaTitle: "Measure Text Length | Words & Characters",
  h1: "Measure Text Length",
  description:
    "Measure text length with characters, words, sentences, paragraphs, and reading time for drafts, snippets, and compliance checks.",
  keywords: ["measure text length", "text length measure", "how long is my text"],
  intro:
    "Length measurements matter for compliance, layout, and reader respect. This page emphasizes the ruler metaphor while exposing every supporting metric.",
  sections: [
    {
      heading: "Measure before you commit to layout",
      paragraphs: [
        "Designers often need both words and characters when choosing column widths. Paste representative copy rather than lorem ipsum when possible so density reflects reality.",
      ],
    },
  ],
  faq: [
    {
      question: "Can I measure multiple files?",
      answer: "Paste one document at a time for immediate totals, then note numbers in your own tracker.",
    },
  ],
});

add({
  slug: "how-many-words-is-a-page",
  toolVariant: "info",
  metaTitle: "How Many Words Is a Page? | Estimate + Counter",
  h1: "How Many Words Is a Page?",
  description:
    "Learn what influences words per page, see common planning ranges, then paste text for an exact word count independent of margins.",
  keywords: ["how many words is a page", "words per page", "page word count"],
  intro:
    "Pages are a print concept: font, size, spacing, and margins change everything. For school papers, two hundred fifty to three hundred words per double-spaced page is a common planning band, but your template may differ.",
  sections: [
    {
      heading: "Why word count beats page count online",
      paragraphs: [
        "Web readers never see your Word page breaks. Editors therefore specify words, while teachers sometimes specify pages. When in doubt, ask which template assumptions apply.",
      ],
    },
    {
      heading: "Get an exact count for your draft",
      paragraphs: [
        "Paste the real document text here. The counter ignores your print layout but tells you how many words you actually wrote, which is what most submission systems validate.",
      ],
    },
  ],
  faq: [
    {
      question: "Is two hundred fifty words per page always right?",
      answer:
        "No. It is a rough US academic default for double-spaced twelve-point Times-like settings. Always confirm with the assigned template.",
    },
  ],
});

add({
  slug: "how-many-words-per-minute-reading",
  toolVariant: "info",
  metaTitle: "How Many Words Per Minute Reading? | Averages",
  h1: "How Many Words Per Minute for Reading?",
  description:
    "Understand typical silent reading speeds, how difficulty changes them, and paste text to see minutes based on a standard average.",
  keywords: ["words per minute reading", "average reading speed", "silent reading wpm"],
  intro:
    "Adult silent reading for familiar prose often clusters around two hundred words per minute for planning purposes, but technical documentation, poetry, and second-language reading run slower.",
  sections: [
    {
      heading: "Why this site uses one default speed",
      paragraphs: [
        "A single default keeps the reading-time line comparable across sessions. Adjust expectations up or down when you know your audience is skimming highly familiar content or parsing dense legalese.",
      ],
    },
  ],
  faq: [
    {
      question: "How does this relate to the reading-time line?",
      answer: "The line uses the same average to convert your pasted words into minutes.",
    },
  ],
});

add({
  slug: "reading-time-for-1000-words",
  toolVariant: "info",
  metaTitle: "Reading Time for 1000 Words | Estimate",
  h1: "Reading Time for 1000 Words",
  description:
    "Estimate minutes to read one thousand words, then paste your real draft because vocabulary and layout change the experience.",
  keywords: ["reading time 1000 words", "how long to read 1000 words", "1000 words reading time"],
  intro:
    "At roughly two hundred words per minute, one thousand words is about five minutes of focused silent reading for straightforward prose.",
  sections: [
    {
      heading: "When five minutes is not five minutes",
      paragraphs: [
        "Medical informed-consent pages, statutory language, and deeply technical tutorials routinely take longer. Conversational blog posts with short sentences can feel faster.",
      ],
    },
  ],
  faq: [
    {
      question: "Should I use this for podcasts?",
      answer:
        "Spoken pacing differs. Use the word count here as a starting point, then time yourself reading the script aloud.",
    },
  ],
});

add({
  slug: "reading-time-for-2000-words",
  toolVariant: "info",
  metaTitle: "Reading Time for 2000 Words | Estimate",
  h1: "Reading Time for 2000 Words",
  description:
    "Estimate minutes to read two thousand words and paste your draft for a live reading-time calculation alongside word totals.",
  keywords: ["reading time 2000 words", "how long to read 2000 words", "2000 words reading time"],
  intro:
    "At roughly two hundred words per minute, two thousand words is about ten minutes of focused silent reading for familiar nonfiction.",
  sections: [
    {
      heading: "Long-form layout still changes perception",
      paragraphs: [
        "Subheads, pull quotes, and images break rhythm. Readers may pause longer on charts, so treat the estimate as a baseline for uninterrupted prose.",
      ],
    },
  ],
  faq: [
    {
      question: "Does this include scrolling time?",
      answer:
        "No. It estimates reading based on words alone, not interaction with embedded widgets or video.",
    },
  ],
});

add({
  slug: "how-many-words-is-1000-characters",
  toolVariant: "info",
  metaTitle: "How Many Words Is 1000 Characters? | Estimate + Counter",
  h1: "How Many Words Is 1000 Characters?",
  description:
    "Estimate how many words fit in one thousand characters, then paste your string for exact counts including spaces and punctuation.",
  keywords: ["1000 characters to words", "how many words is 1000 characters"],
  intro:
    "One thousand characters often lands near one hundred sixty to two hundred twenty words in conversational English, but URLs, code snippets, or repeated short words swing the ratio.",
  sections: [
    {
      heading: "Paste the real payload",
      paragraphs: [
        "Hashtags, mentions, and tracking parameters change density. Paste the final shipping string to remove guesswork.",
      ],
    },
  ],
  faq: [
    {
      question: "Is this comparable to the five hundred character page?",
      answer: "Yes. Both explain character-to-word variance and share the same counter implementation.",
    },
  ],
});

export function getWordCounterLanding(slug: string): WordCounterLanding | undefined {
  return map[slug];
}

export function getAllWordCounterLandingSlugs(): string[] {
  return Object.keys(map);
}

export const WORD_COUNTER_LANDING_MAP: WordCounterLandingMap = map;

/** Curated for hub navigation and internal linking (order = display order). */
export const WORD_COUNTER_NAV_HIGHLIGHT_SLUGS: readonly string[] = [
  "word-counter-for-essay",
  "word-counter-for-seo",
  "word-counter-for-students",
  "word-counter-500-words",
  "word-counter-1000-words",
  "reading-time-calculator",
  "how-many-words-is-500-characters",
  "sentence-counter",
  "paragraph-counter",
  "characters-without-spaces",
  "count-words-in-text",
  "check-character-limit",
  "how-many-words-is-a-page",
];

export type WordCounterNavItem = { href: string; title: string; slug: string };

export function getWordCounterLandingNavHighlights(): WordCounterNavItem[] {
  return WORD_COUNTER_NAV_HIGHLIGHT_SLUGS.flatMap((slug) => {
    const landing = map[slug];
    if (!landing) {
      return [];
    }
    return [{ href: `/text/${slug}`, title: landing.h1, slug }];
  });
}

export function getWordCounterLandingNavItems(): WordCounterNavItem[] {
  return Object.values(map)
    .sort((a, b) => a.slug.localeCompare(b.slug))
    .map((landing) => ({
      href: `/text/${landing.slug}`,
      title: landing.h1,
      slug: landing.slug,
    }));
}

export const WORD_COUNTER_HUB_PATH = "/text/character-counter";

export const WORD_COUNTER_LANDINGS_ANCHOR_ID = "word-counter-landings";
