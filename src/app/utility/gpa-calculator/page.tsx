import type { Metadata } from "next";
import GpaCalculator from "@/components/GpaCalculator";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";

// ─── SEO metadata ──────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "GPA Calculator — Calculate My GPA, Weighted & Unweighted",
  description:
    "Free GPA calculator for high school and college. Calculate my GPA unweighted or weighted (AP/IB/Honors), convert grades to GPA, percentage to GPA, and find your target GPA. Grading calculator with full scale reference.",
  keywords: [
    "gpa calculator",
    "calculate my gpa",
    "weighted gpa calculator",
    "grading calculator",
    "gpa to percentage",
    "homeschool gpa calculator",
    "gpa estimator",
    "percentage to gpa calculator",
    "unweighted gpa calculator",
    "cumulative gpa calculator",
    "high school gpa calculator",
    "college gpa calculator",
    "how to calculate gpa",
    "gpa scale",
    "what is a good gpa",
  ],
  openGraph: {
    title: "GPA Calculator — Weighted, Unweighted, Cumulative",
    description:
      "Calculate your GPA for any number of courses and semesters. Weighted (AP/IB/Honors), unweighted, cumulative, grade conversion, and target GPA calculator. Free.",
    url: "https://findbest.tools/utility/gpa-calculator",
  },
  alternates: {
    canonical: "https://findbest.tools/utility/gpa-calculator",
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "GPA Calculator",
  applicationCategory: "EducationApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Free GPA calculator with weighted and unweighted GPA, cumulative GPA across semesters, grade to GPA conversion, percentage to GPA, and target GPA calculator.",
};

// ─── Content data ──────────────────────────────────────────────────

const GPA_SCALE_FULL = [
  { letter: "A+", pct: "97–100%", gpa: "4.0", honors: "4.5", ap: "5.0", meaning: "Outstanding" },
  { letter: "A",  pct: "93–96%",  gpa: "4.0", honors: "4.5", ap: "5.0", meaning: "Excellent" },
  { letter: "A-", pct: "90–92%",  gpa: "3.7", honors: "4.2", ap: "4.7", meaning: "Excellent" },
  { letter: "B+", pct: "87–89%",  gpa: "3.3", honors: "3.8", ap: "4.3", meaning: "Above average" },
  { letter: "B",  pct: "83–86%",  gpa: "3.0", honors: "3.5", ap: "4.0", meaning: "Above average" },
  { letter: "B-", pct: "80–82%",  gpa: "2.7", honors: "3.2", ap: "3.7", meaning: "Above average" },
  { letter: "C+", pct: "77–79%",  gpa: "2.3", honors: "2.8", ap: "3.3", meaning: "Average" },
  { letter: "C",  pct: "73–76%",  gpa: "2.0", honors: "2.5", ap: "3.0", meaning: "Average" },
  { letter: "C-", pct: "70–72%",  gpa: "1.7", honors: "2.2", ap: "2.7", meaning: "Average" },
  { letter: "D+", pct: "67–69%",  gpa: "1.3", honors: "1.8", ap: "2.3", meaning: "Below average" },
  { letter: "D",  pct: "63–66%",  gpa: "1.0", honors: "1.5", ap: "2.0", meaning: "Below average" },
  { letter: "D-", pct: "60–62%",  gpa: "0.7", honors: "1.2", ap: "1.7", meaning: "Below average" },
  { letter: "F",  pct: "0–59%",   gpa: "0.0", honors: "0.0", ap: "0.0", meaning: "Failing" },
];

const GPA_BENCHMARKS = [
  { range: "3.9 – 4.0", label: "Summa Cum Laude territory", colour: "bg-emerald-100 text-emerald-800", desc: "Top of class. Qualifies for most merit scholarships, honours programs, and highly selective graduate programs." },
  { range: "3.7 – 3.89", label: "Magna Cum Laude territory", colour: "bg-green-100 text-green-800",   desc: "Strong academic record. Competitive for top-tier colleges, law school, medical school, and prestigious employers." },
  { range: "3.5 – 3.69", label: "Dean's List range",         colour: "bg-teal-100 text-teal-800",     desc: "Well above average. Qualifies for Dean's List at most universities each semester. Competitive for graduate programs." },
  { range: "3.0 – 3.49", label: "Good standing",             colour: "bg-blue-100 text-blue-800",     desc: "Solid academic performance. Above the national average. Competitive for many graduate programs and employers." },
  { range: "2.5 – 2.99", label: "Satisfactory",              colour: "bg-yellow-100 text-yellow-800", desc: "Average to slightly above average. Meets graduation requirements at most schools. Some graduate programs may require higher." },
  { range: "2.0 – 2.49", label: "Minimum satisfactory",      colour: "bg-orange-100 text-orange-800", desc: "At or near the minimum required for graduation at most institutions. May affect scholarships and eligibility." },
  { range: "Below 2.0",  label: "Academic concern",          colour: "bg-red-100 text-red-800",       desc: "Below the typical minimum. Most universities will place students on academic probation. Immediate improvement needed." },
];

const HOMESCHOOL_SECTION = {
  credits: [
    { subject: "Core courses (Math, English, Science, History)", credits: "1.0 per year" },
    { subject: "Electives (Art, Music, PE, Foreign Language)", credits: "0.5–1.0 per year" },
    { subject: "Half-year courses", credits: "0.5 credits" },
    { subject: "Dual enrollment college course", credits: "Typically 3–4 credits per course" },
  ],
};

const FAQS = [
  {
    q: "How do I calculate my GPA?",
    a: "To calculate your GPA, multiply each course's grade points by its credit hours to get quality points, then divide the total quality points by the total credit hours. For example: if you got a B (3.0) in a 3-credit course, that's 9 quality points. An A- (3.7) in a 4-credit course gives 14.8 quality points. If those were your only two courses: (9 + 14.8) ÷ (3 + 4) = 23.8 ÷ 7 = 3.4 GPA. Our grading calculator above does all of this automatically — just enter your grades and credits.",
  },
  {
    q: "What is a weighted GPA and how is it calculated?",
    a: "A weighted GPA gives extra grade points for taking more challenging courses. Regular courses use the standard 4.0 scale. Honors courses typically add +0.5 to each grade point, so an A in an Honors class is worth 4.5 instead of 4.0. AP (Advanced Placement), IB (International Baccalaureate), and dual enrollment courses typically add +1.0, making an A worth 5.0. The weighted GPA calculator above handles all three course levels automatically. Weighted GPAs allow colleges to see that a student with a 3.8 who took 6 AP classes may be stronger than a student with a 3.9 in all regular classes.",
  },
  {
    q: "What is a good GPA in high school?",
    a: "A 'good' GPA depends on your goals. For general purposes: a 3.0 (B average) is considered average at most high schools in the US. A 3.5+ is above average and competitive for many four-year colleges. A 3.7+ is considered excellent and puts you in the running for competitive universities. For top-tier schools like Ivy League universities, admitted students often have GPAs of 3.9+ unweighted. For scholarships, many require a minimum of 3.0 or 3.5. The most important thing is context — colleges look at GPA in relation to the rigor of courses taken.",
  },
  {
    q: "How do I convert a percentage to a GPA?",
    a: "To convert a percentage to a GPA on the 4.0 scale, first convert the percentage to a letter grade using the standard US grading scale (90–92% = A-, 83–86% = B, etc.), then use the corresponding GPA value. For quick reference: 97%+ = 4.0 GPA; 90–92% = 3.7; 87–89% = 3.3; 83–86% = 3.0; 80–82% = 2.7; 77–79% = 2.3; 73–76% = 2.0; 70–72% = 1.7; 67–69% = 1.3; 63–66% = 1.0. Our percentage to GPA calculator converts instantly — just enter your percentage in the Grade Converter tab.",
  },
  {
    q: "How do I convert a GPA to a percentage?",
    a: "Converting GPA to percentage is an approximation since the relationship is not perfectly linear. Generally: 4.0 GPA ≈ 97–100%; 3.7 ≈ 90–92%; 3.3 ≈ 87–89%; 3.0 ≈ 83–86%; 2.7 ≈ 80–82%; 2.3 ≈ 77–79%; 2.0 ≈ 73–76%. The Grade Converter tab in our GPA estimator shows the percentage range for any GPA you enter. Note that different schools and countries have different grading systems, so a 3.0 GPA in the US may not correspond exactly to the same percentage threshold in other systems.",
  },
  {
    q: "How do I calculate my GPA for homeschool?",
    a: "For a homeschool GPA calculator, the process is the same as any GPA calculation, but you need to decide on credit hours yourself. A standard full-year high school course typically earns 1 credit. A half-year course earns 0.5 credits. For each course, assign a letter grade based on your grading method (percentage scores, portfolio review, or standardised tests), then use our homeschool GPA calculator to compute the cumulative GPA. Most college admissions offices are familiar with homeschool transcripts and will evaluate your GPA in context. It is recommended to include a transcript key explaining your grading scale.",
  },
  {
    q: "What GPA do I need to get into college?",
    a: "GPA requirements vary widely by institution. Community colleges and open-enrollment schools often have no GPA minimum. State schools typically want 2.5–3.0+. Selective universities (top 50) generally look for 3.5+. Highly selective schools (Ivy League, MIT, Stanford) admit students with average GPAs of 3.9–4.0 unweighted — but they consider many factors beyond GPA. Important note: colleges often recalculate your GPA using only core academic courses (English, math, science, history, foreign language), removing electives and courses they consider less rigorous.",
  },
  {
    q: "How do I raise my GPA?",
    a: "To raise your GPA, use our target GPA calculator to find exactly what grades you need in your remaining courses. Key strategies: focus on high-credit courses (they have more weight), retake failed or poor-grade courses if your school allows grade replacement, take courses where you can excel, and seek tutoring in subjects where you're struggling. For college students, some schools offer academic renewal or grade forgiveness policies that allow retaken courses to replace poor grades in the GPA calculation. The earlier in your academic career you start improving, the more time compounding works in your favour.",
  },
];

// ─── Sub-components ────────────────────────────────────────────────
function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl font-semibold text-stone-900 mb-4 mt-12">{children}</h2>;
}
function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-lg font-semibold text-stone-800 mb-2 mt-7">{children}</h3>;
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="text-stone-600 leading-relaxed mb-4 text-[15px]">{children}</p>;
}

// ─── Page ──────────────────────────────────────────────────────────
export default function GpaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <main className="max-w-4xl mx-auto px-4 py-10">

        {/* Hero */}
        <div className="mb-8 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block" />
            Weighted · Unweighted · Cumulative · Grade Converter · Free
          </div>
          <h1 className="text-4xl font-bold text-stone-900 leading-tight mb-3">
            GPA Calculator
          </h1>
          <p className="text-lg text-stone-500 leading-relaxed">
            Calculate my GPA instantly — weighted or unweighted, single semester or
            cumulative. Includes a grading calculator with letter grade and percentage
            conversion, a homeschool GPA calculator, and a target GPA estimator to
            find exactly what grades you need.
          </p>
        </div>

        {/* Calculator */}
        <GpaCalculator />

        {/* ── CONTENT ── */}

        <H2>How to calculate your GPA</H2>
        <P>
          GPA — Grade Point Average — is a numerical summary of your academic performance,
          calculated on a 4.0 scale in the United States. Every letter grade you earn
          corresponds to a grade point value, and your GPA is the weighted average of
          those values across all your courses, weighted by the number of credit hours
          each course is worth. Courses with more credit hours have more influence on
          your GPA than courses with fewer.
        </P>
        <P>
          The formula is: GPA = (Sum of Grade Points × Credit Hours) ÷ (Total Credit Hours).
          A student who earns an A (4.0) in a 3-credit course and a C (2.0) in a 4-credit
          course would have: [(4.0 × 3) + (2.0 × 4)] ÷ (3 + 4) = (12 + 8) ÷ 7 = 2.86 GPA.
          The C in the heavier-credit course pulls the average down more than the A pulls
          it up — which is exactly why credit hours matter in a proper grading calculator.
        </P>

        <H3>Unweighted GPA vs weighted GPA</H3>
        <P>
          An unweighted GPA treats all courses equally on the standard 4.0 scale regardless
          of difficulty. A student taking all Honors and AP courses and a student taking all
          regular courses would receive the same grade point value for getting an A in each.
          An unweighted GPA simply reflects the grades earned, not the difficulty of the
          courses taken.
        </P>
        <P>
          A weighted GPA adjusts for course difficulty by adding bonus points for Honors,
          AP, and IB courses. Under the most common weighted GPA system: Honors courses
          add 0.5 to the grade point value (so an A becomes 4.5 instead of 4.0); AP
          (Advanced Placement), IB (International Baccalaureate), and dual enrollment
          courses add 1.0 (so an A becomes 5.0). The maximum weighted GPA is therefore
          5.0 rather than 4.0. Most high schools that offer AP or Honors courses use
          weighted GPAs on transcripts, though colleges often recalculate on an unweighted
          basis for comparison purposes. This weighted GPA calculator computes both
          simultaneously so you can see both numbers at a glance.
        </P>

        <H3>Cumulative GPA — tracking multiple semesters</H3>
        <P>
          Your cumulative GPA is the GPA calculated across all courses and semesters to
          date — not just one term. It is the number that appears on your transcript and
          that colleges and employers see. The calculator above lets you add multiple
          semesters and calculates both the per-semester GPA and the cumulative GPA
          across all semesters simultaneously. High school students tracking their GPA
          across four years, and college students monitoring their standing from freshman
          year through senior year, can model everything in one place.
        </P>

        <H2>Complete GPA and grade scale reference (4.0 scale)</H2>
        <P>
          The standard US grading scale converts letter grades to GPA points. The table
          below shows every letter grade, its percentage range, and the corresponding
          4.0 unweighted, 4.5 Honors weighted, and 5.0 AP/IB weighted GPA values. This
          is the scale used by the vast majority of American high schools and universities.
        </P>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-indigo-50 border border-indigo-100">
                <th className="py-2.5 px-3 text-left text-xs font-semibold text-stone-600">Letter</th>
                <th className="py-2.5 px-3 text-left text-xs font-semibold text-stone-600">Percentage</th>
                <th className="py-2.5 px-3 text-center text-xs font-semibold text-indigo-600">4.0 (Regular)</th>
                <th className="py-2.5 px-3 text-center text-xs font-semibold text-blue-600">4.5 (Honors)</th>
                <th className="py-2.5 px-3 text-center text-xs font-semibold text-purple-600">5.0 (AP/IB)</th>
                <th className="py-2.5 px-3 text-left text-xs font-semibold text-stone-600">Quality</th>
              </tr>
            </thead>
            <tbody className="border border-stone-200">
              {GPA_SCALE_FULL.map((row, i) => (
                <tr key={row.letter} className={`border-b border-stone-100 last:border-0 ${i % 2 === 0 ? "" : "bg-stone-50/50"}`}>
                  <td className="py-2 px-3 font-bold text-stone-900">{row.letter}</td>
                  <td className="py-2 px-3 text-stone-600 text-xs">{row.pct}</td>
                  <td className="py-2 px-3 text-center font-semibold text-indigo-600">{row.gpa}</td>
                  <td className="py-2 px-3 text-center text-blue-600">{row.honors}</td>
                  <td className="py-2 px-3 text-center text-purple-600">{row.ap}</td>
                  <td className="py-2 px-3 text-xs text-stone-500">{row.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <H2>What is a good GPA? Benchmarks by level</H2>
        <P>
          GPA benchmarks vary by context — what's excellent for one application may be
          average for another. Here is a practical guide to what different GPA ranges
          mean for high school students, college students, and graduate school applicants:
        </P>

        <div className="space-y-3 mb-6">
          {GPA_BENCHMARKS.map((b) => (
            <div key={b.range} className={`rounded-xl p-4 border ${b.colour.replace("text-", "border-").replace("100", "200")} ${b.colour.split(" ")[0]}`}>
              <div className="flex items-center gap-3 mb-1">
                <span className="font-bold text-base">{b.range}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${b.colour}`}>{b.label}</span>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>

        <H2>Homeschool GPA calculator — how to calculate a homeschool GPA</H2>
        <P>
          Calculating a GPA for homeschool students follows the same formula as any other
          GPA calculation, but homeschooling parents have more control over both the grading
          scale and the credit hour assignments. If you use a structured curriculum, the
          publisher may assign grades. If you use a mastery-based approach, you convert
          assessment results to percentage scores, then to letter grades.
        </P>
        <P>
          The most common credit assignment for homeschool transcripts is based on Carnegie
          units — the US standard for high school credit:
        </P>

        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-stone-50 border border-stone-200">
                <th className="py-2.5 px-4 text-left text-xs font-semibold text-stone-600">Course type</th>
                <th className="py-2.5 px-4 text-right text-xs font-semibold text-stone-600">Credits awarded</th>
              </tr>
            </thead>
            <tbody className="border border-stone-200">
              {HOMESCHOOL_SECTION.credits.map(row => (
                <tr key={row.subject} className="border-b border-stone-100 last:border-0 hover:bg-stone-50">
                  <td className="py-2.5 px-4 text-stone-700 text-xs">{row.subject}</td>
                  <td className="py-2.5 px-4 text-right font-semibold text-indigo-600 text-xs">{row.credits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <P>
          For college admissions, homeschool students should include a transcript that lists
          each course, the credit hours, the grade earned, and ideally a brief description
          of each course. Many admissions officers will also want to see standardised test
          scores (SAT, ACT, AP exams) to validate the homeschool GPA. Use the homeschool
          GPA calculator above — the "Add semester" feature works well for organising courses
          by grade level (9th, 10th, 11th, 12th) rather than semesters.
        </P>

        <H2>GPA to percentage and percentage to GPA conversion</H2>
        <P>
          Converting between GPA and percentage is not perfectly precise because both are
          rounded representations of academic performance, but the conversions are
          well-established. The GPA to percentage table follows a consistent pattern:
          each major grade point value corresponds to a percentage range, with the midpoint
          of that range as the reference. A 3.0 GPA corresponds to approximately 83–86%
          (B range), and a 3.7 corresponds to 90–92% (A- range).
        </P>
        <P>
          The percentage to GPA calculator works in reverse: if you earned a 91% in a
          class, that corresponds to a 3.7 GPA (A-). An 85% is a 3.0 GPA (B). An 78% is
          a 2.3 GPA (C+). The Grade Converter tab in the calculator above handles all of
          these conversions instantly — enter any value in any format and see the
          equivalent in the other two.
        </P>

        <H2>Target GPA: what grades do I need?</H2>
        <P>
          The Target GPA feature in the calculator solves one of the most common questions
          students ask: "What grades do I need in my remaining courses to reach a specific
          GPA?" Enter your current GPA (populated automatically from the calculator tab),
          your target GPA, and the number of credit hours remaining, and the GPA estimator
          calculates the exact GPA you need to earn in those remaining courses.
        </P>
        <P>
          This is particularly useful for students approaching graduation requirements,
          scholarship thresholds, graduate school applications, or academic probation
          situations. Note that if the required GPA comes back above 4.0, your target
          is mathematically unachievable with the remaining credits — you would need to
          either lower your target or find ways to increase remaining credit hours.
        </P>

        <H2>Frequently asked questions</H2>
        <div className="space-y-3">
          {FAQS.map((faq) => (
            <details key={faq.q} className="group border border-stone-200 rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between cursor-pointer px-4 py-3.5 text-sm font-medium text-stone-800 list-none select-none hover:bg-stone-50">
                {faq.q}
                <span className="text-stone-400 ml-3 flex-shrink-0 group-open:rotate-45 transition-transform duration-150">+</span>
              </summary>
              <div className="px-4 pb-4 pt-1 text-sm text-stone-600 leading-relaxed border-t border-stone-100">
                {faq.a}
              </div>
            </details>
          ))}
        </div>

        <div className="mt-10 p-4 bg-stone-50 rounded-xl border border-stone-200">
          <p className="text-xs text-stone-500 leading-relaxed">
            <strong className="text-stone-700">Note:</strong> GPA scales and grading systems
            vary by institution, country, and school district. The 4.0 unweighted and 5.0
            weighted scales described here represent the most common US high school and
            college standard, but your school may use a different scale (e.g. 4.33 for A+,
            or different percentage cutoffs). Always check your institution's official grading
            policy for authoritative values. This tool is for estimation and planning purposes.
          </p>
        </div>

        {/* Related Tools */}
        <div className="mt-16">
          <RelatedToolsSection category="Utility" categoryHref="/utility" currentPath="/utility/gpa-calculator" />
        </div>

      </main>
    </>
  );
}
