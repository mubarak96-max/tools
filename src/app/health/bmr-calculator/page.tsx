import type { Metadata } from "next";
import Link from "next/link";
import { BmrCalculator } from "./components/BmrCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { Activity, Flame, TrendingUp, Dna, Stethoscope, Brain, Heart, Syringe } from "lucide-react";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/health/bmr-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is a good BMR?",
    answer:
      "For women, an average BMR is 1,400–1,600 kcal/day. For men, it is typically 1,600–1,800 kcal/day. Your individual BMR depends on age, weight, height, and muscle mass. Higher values indicate a faster resting metabolism.",
  },
  {
    question: "Does BMR change with age?",
    answer:
      "Yes. BMR typically decreases by about 2–8% per decade after age 30. This is primarily because muscle mass declines with age (sarcopenia), and muscle tissue burns significantly more calories at rest than fat tissue. Regular resistance training can slow this decline.",
  },
  {
    question: "What is the difference between BMR and TDEE?",
    answer:
      "BMR is the calories your body burns at complete rest — just to keep you alive. TDEE (Total Daily Energy Expenditure) is your BMR multiplied by an activity factor, representing total calories burned including all movement and exercise. TDEE is always higher than BMR.",
  },
  {
    question: "Which BMR formula is most accurate?",
    answer:
      "The Mifflin-St Jeor equation (1990) is considered the most accurate for modern populations. It outperforms the older Harris-Benedict formula (1919), particularly for people with higher body weight. The Katch-McArdle formula is more accurate if you know your lean body mass.",
  },
  {
    question: "How do I use BMR to lose weight?",
    answer:
      "Multiply your BMR by your activity factor to get your TDEE. Then eat 300–500 calories below your TDEE to create a deficit. A 500-calorie daily deficit produces approximately 0.5 kg of fat loss per week. Never eat below your BMR for extended periods as this causes muscle loss and metabolic adaptation.",
  },
];

export const metadata: Metadata = {
  title: "BMR Calculator | Basal Metabolic Rate — Mifflin-St Jeor Formula",
  description:
    "Calculate your Basal Metabolic Rate (BMR) using the Mifflin-St Jeor formula. Find out how many calories your body burns at rest and use it to set your calorie targets.",
  keywords: [
    "BMR calculator",
    "basal metabolic rate calculator",
    "Mifflin St Jeor calculator",
    "resting metabolic rate",
    "calories burned at rest",
    "BMR formula calculator",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "BMR Calculator — Basal Metabolic Rate",
    description: "Calculate how many calories your body burns at rest using the Mifflin-St Jeor formula.",
  },
  twitter: {
    card: "summary_large_image",
    title: "BMR Calculator",
    description: "Find your Basal Metabolic Rate and use it to set accurate calorie targets for weight loss or gain.",
  },
};

function buildJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "BMR Calculator",
    url: PAGE_URL,
    applicationCategory: "HealthApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Free BMR calculator using the Mifflin-St Jeor formula for men and women.",
    featureList: ["Mifflin-St Jeor formula", "Male and female calculations", "TDEE activity multipliers"],
  };
}

export default function BmrCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Health", path: "/health" },
    { name: "BMR Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}
      <div className="space-y-8">
        <section className="space-y-4 py-2 sm:py-4">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary">Home</Link></li>
              <li>/</li>
              <li><Link href="/health" className="hover:text-primary">Health</Link></li>
              <li>/</li>
              <li className="text-foreground">BMR Calculator</li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
              Health Tool
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              BMR Calculator
            </h1>
            <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
              Calculate your Basal Metabolic Rate - the number of calories your body burns at complete rest - using the Mifflin-St Jeor formula. Use it as the foundation for setting accurate calorie targets.
            </p>
            <p className="mt-4 rounded-[1rem] border border-amber-300/40 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
              This calculator is for education and planning only. It is not medical advice,
              diagnosis, treatment, or a substitute for guidance from a qualified clinician,
              dietitian, or other health professional.
            </p>
          </div>


        </section>

        <BmrCalculator />

      {/* ── EDUCATIONAL EXPANSION: 1500+ WORDS OF AUTHORITY ── */}
      <section className="mx-auto max-w-4xl space-y-24 px-4 py-16">
        
        {/* Section 1: The Thermodynamics of Survival */}
        <article className="prose prose-slate max-w-none">
          <h2 className="text-3xl font-black text-slate-900 border-l-4 border-primary pl-6 py-2">The Thermodynamics of Survival: Understanding BMR</h2>
          <p className="text-lg text-slate-600 leading-relaxed font-medium mt-6">
            Basal Metabolic Rate (BMR) is often described as the calories you burn "doing nothing," but from a physiological perspective, your body is never truly doing nothing. Even in a state of complete rest, your biological machinery is performing a staggering amount of work to maintain <strong>homeostasis</strong>.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Every second, your cells are actively pumping ions across membranes to maintain electrical gradients. Your liver is synthesizing proteins and detoxifying blood. Your brain is processing neurotransmitters. Your kidneys are filtering waste. BMR is the energy required to support this invisible, non-stop "cellular housekeeping." It typically accounts for <strong>60-75% of your Total Daily Energy Expenditure (TDEE)</strong>, making it the single most important variable in your caloric balance.
          </p>

          <div className="grid sm:grid-cols-2 gap-8 not-prose my-16">
             {[
               { icon: <Activity className="h-7 w-7" />, title: "Cellular Processing", body: "Over 20% of your BMR is dedicated solely to the sodium-potassium pump, maintaining the chemical balance of your cells." },
               { icon: <Flame className="h-7 w-7" />, title: "Thermoregulation", body: "Humans are endotherms; a significant portion of BMR is converted to heat to maintain a core temperature of 37°C." },
               { icon: <Brain className="h-7 w-7" />, title: "Neural Overhead", body: "The brain represents only 2% of body weight but consumes nearly 20% of resting energy to maintain cognitive integrity." },
               { icon: <Heart className="h-7 w-7" />, title: "Mechanical Work", body: "Continuous muscular work from the diaphragm and heart muscle ensures life-sustaining oxygen delivery and circulation." },
             ].map((box) => (
                <div key={box.title} className="p-8 rounded-[2.5rem] bg-white border border-slate-100 hover:border-primary/30 hover:shadow-2xl transition-all group shadow-sm">
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/10 bg-primary/5 text-primary transition-transform group-hover:scale-110">
                    {box.icon}
                  </div>
                  <h4 className="text-xl font-black text-slate-900 mb-3">{box.title}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">{box.body}</p>
                </div>
             ))}
          </div>
        </article>

        {/* Section 2: Detailed Biological Drivers */}
        <section className="prose prose-slate max-w-none">
          <h2 className="text-3xl font-black text-slate-900 mb-8 uppercase tracking-tight">The Bio-Variable Library: What Truly Affects BMR</h2>
          <p className="text-slate-600">
            While weight, height, and age are the primary inputs for predictive formulas, they are proxies for underlying biological drivers. To truly optimize your metabolism, you must understand these five hidden variables:
          </p>
          
          <div className="space-y-12 mt-12">
            {[
              { 
                tag: "PROTEIN TURNOVER", 
                title: "The Muscular Advantage", 
                txt: "Skeletal muscle is roughly 3x more metabolically active than adipose (fat) tissue. However, the 'metabolic boost' from muscle is often overstated. Every 1kg of muscle added increases BMR by approximately 13 kcal/day. The real advantage lies in muscle's ability to increase 'Work Efficiency' during exercise rather than its resting burn rate." 
              },
              { 
                tag: "ENDOCRINE CONTROL", 
                title: "The Hormonal Thermostat", 
                txt: "The thyroid gland acts as the body's primary thermostat. Hormones T3 (triiodothyronine) and T4 (thyroxine) directly stimulate ATP production in cells. Even slight deviations in thyroid health can swing BMR by 10-20%, making 'metabolic slowing' a clinical reality for many." 
              },
              { 
                tag: "SATIETY SIGNALS", 
                title: "The Leptin Connection", 
                txt: "Leptin is a hormone produced by fat cells that signals the brain to maintain BMR. When you diet and lose fat, leptin levels drop, signaling the hypothalamus to conserve energy by lowering BMR. This is a survival mechanism evolved to prevent starvation." 
              },
              { 
                tag: "DIGESTIVE LOAD", 
                title: "Thermogenic Effect of Food (TEF)", 
                txt: "Often confused with BMR, TEF is the energy used to digest and process nutrients. Protein has the highest TEF (20-30% of its calories are burned during digestion), which is why high-protein diets effectively increase net daily energy expenditure." 
              }
            ].map((item) => (
              <div key={item.title} className="border-l-2 border-slate-100 pl-8 relative">
                <div className="absolute -left-[5px] top-0 h-4 w-2 bg-primary rounded-full" />
                <span className="text-[10px] font-black text-primary tracking-widest uppercase">{item.tag}</span>
                <h4 className="text-xl font-bold text-slate-900 mt-1 mb-3">{item.title}</h4>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">{item.txt}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Metabolic Adaptation (The Truth About the 'Plateau') */}
        <section className="bg-slate-900 rounded-[3.5rem] p-10 sm:p-20 text-white overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12">
             <Dna className="w-64 h-64" />
          </div>
          
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-3xl sm:text-4xl font-black mb-8 leading-tight">Adaptive Thermogenesis: Why Weight Loss Stalls</h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-10">
              When you eat in a caloric deficit for an extended period, your body begins to defend its energy stores. This phenomenon, known as <strong>Adaptive Thermogenesis</strong> (or metabolic adaptation), causes BMR to drop faster than predicted by weight loss alone.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-8 text-left">
              <div className="bg-white/5 border border-white/10 p-8 rounded-3xl group-hover:bg-white/10 transition-colors">
                <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" /> The Resistance Factor
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">As you lose weight, your organs (heart, liver, kidneys) actually shrink slightly in mass, and their mitochondrial efficiency increases, requiring fewer calories to perform the same life-sustaining work.</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-8 rounded-3xl group-hover:bg-white/10 transition-colors">
                <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" /> Behavioral Downregulation
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">Subconsciously, your brain reduces NEAT (Non-Exercise Activity Thermogenesis). You fidget less, stand less, and move with less intensity—often saving 200-400 calories a day without noticing.</p>
              </div>
            </div>
            
            <div className="mt-12 p-8 rounded-[2rem] bg-primary/10 border border-primary/20 text-primary-soft italic text-sm">
              "The most effective way to combat metabolic adaptation is through 'Maintenance Phases' or 'Diet Breaks'—periodic returns to maintenance calories to reassure the leptin-signaling system that food is plentiful."
            </div>
          </div>
        </section>

        {/* Section 4: Formula Analysis - The Math of Metabolism */}
        <article className="prose prose-slate max-w-none">
          <h2 className="text-3xl font-black text-slate-900 border-b border-slate-100 pb-6">Beyond Mifflin-St Jeor: Comparing the Formulas</h2>
          <p className="text-slate-600 leading-relaxed">
            While our calculator uses the modern gold standard, different scenarios may require different mathematical models. Understanding which formula applies to you is key to dietary accuracy:
          </p>
          <ul className="text-slate-600 space-y-6 font-medium mt-8">
             <li>
               <strong className="text-slate-900 block text-lg">1. Mifflin-St Jeor (1990)</strong>
               <span className="text-sm font-normal">Best for: General population and overweight individuals. This formula was developed using a more modern demographic than its predecessors and remains the most reliable for those without an exact measure of body fat percentage.</span>
             </li>
             <li>
               <strong className="text-slate-900 block text-lg">2. Katch-McArdle (1983)</strong>
               <span className="text-sm font-normal">Best for: Athletes and lean individuals. This formula ignores weight/height proxies and uses <strong>Lean Body Mass (LBM)</strong> directly. If you have a low body fat percentage, this is significantly more accurate than Mifflin-St Jeor.</span>
             </li>
             <li>
               <strong className="text-slate-900 block text-lg">3. Harris-Benedict (1919)</strong>
               <span className="text-sm font-normal">Best for: Historical context. While still popular, it tends to overestimate BMR in modern populations by roughly 5%, as active metabolic rates were higher in the early 20th century due to labor-intensive lifestyles.</span>
             </li>
          </ul>
        </article>

        {/* Section 5: The Master Strategy for Metabolism */}
        <section className="prose prose-slate max-w-none">
          <h2 className="text-3xl font-black text-slate-900">How to 'Hack' Your BMR: The Evidence-Based Guide</h2>
          <p className="text-slate-600">While BMR is largely determined by physical size, you can influence the 'Metabolic Ceiling' through targeted interventions:</p>

          <div className="space-y-8 mt-12">
            {[
              { step: "01", name: "Prioritize Hypertrophy", txt: "Resistance training doesn't just burn calories during the session; it increases the mass of metabolically expensive tissue. A muscular individual has a 'higher floor' for calories even on sedentary days." },
              { step: "02", name: "Cyclical Dieting", txt: "Avoid chronic low-calorie intake. By cycling between fat loss phases and maintenance phases, you prevent the deep downregulation of thyroid and leptin hormones." },
              { step: "03", name: "Optimize Sleep Hygiene", txt: "Sleep deprivation reduces BMR by disrupting the cortisol-insulin axis. Just one night of poor sleep can significantly reduce resting energy expenditure the following day." },
              { step: "04", name: "The Protein Leverage", txt: "Aim for 1.6g to 2.2g of protein per kg of body weight. The increased Thermic Effect of Food (TEF) effectively raises your total daily expenditure without requiring more movement." },
            ].map((item) => (
              <div key={item.step} className="flex gap-8 items-start group">
                <div className="text-4xl font-black text-primary/10 group-hover:text-primary transition-colors shrink-0">{item.step}</div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">{item.name}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed font-semibold">{item.txt}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6: Advanced FAQ */}
        <section id="faq" className="space-y-16">
          <div className="text-center">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Metabolism & Physiology FAQ</h2>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto text-lg leading-relaxed">Scientific answers for fitness professionals and precision nutritionists.</p>
          </div>
          
          <div className="grid gap-6">
             {[
               { q: "Can caffeine or spicy food increase BMR?", a: "Yes, but only temporarily and marginally. Stimulants like caffeine and capsaicin (found in chili) can increase BMR through thermogenesis by 3-5%, but the effect is too small to serve as a primary weight loss strategy." },
               { q: "Is 'Starvation Mode' real?", a: "The term is a myth, but the phenomenon of 'Metabolic Adaptation' is very real. Your metabolism doesn't stop, but it can slow down by up to 15% as a survival response. You cannot physically stop losing weight if you are in a true deficit, but the 'deficit' point moves as you lose weight." },
               { q: "Does drinking cold water burn more calories?", a: "Technically, yes. Your body must heat the water to 37°C. However, drinking two liters of ice-cold water only burns roughly 50-70 additional calories—less than a single small apple." },
               { q: "Why is my BMR lower than my friend's of the same size?", a: "Individual variation is massive. Differences in organ size, mitochondrial density, hormonal health, and lean body mass distribution can lead to a 200-300 calorie difference between two seemingly identical people." },
             ].map((item) => (
                <div key={item.q} className="p-10 rounded-[3rem] border border-slate-100 bg-white hover:border-primary/40 hover:shadow-2xl transition-all group shadow-sm">
                   <h3 className="text-xl font-black text-slate-900 mb-4 group-hover:text-primary transition-colors italic">{item.q}</h3>
                   <p className="text-base text-slate-600 leading-relaxed font-medium">{item.a}</p>
                </div>
             ))}
          </div>
        </section>

        {/* Closing Disclaimer */}
        <div className="p-8 rounded-[2.5rem] bg-indigo-50 border border-indigo-100 text-slate-700 italic text-sm leading-relaxed text-center">
          "Metabolism is a dynamic ecosystem, not a fixed number. Formulas provide the starting line, but consistent tracking of biofeedback (energy levels, sleep quality, and performance) is the only way to find your true metabolic needs."
        </div>

      </section>

      <section className="mt-16 space-y-8 border-t border-slate-100 pt-16">
        <div className="flex items-center justify-between px-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">More Professional Tools</h2>
            <p className="mt-1 text-sm text-slate-500">Utilities designed for growth and precision.</p>
          </div>
          <Link href="/health" className="secondary-button px-4 py-2 text-xs">View All</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 px-4 pb-20 text-left">
          {[
            { name: "Calorie Calculator", href: "/health/calorie-calculator", icon: "CAL", desc: "Estimate TDEE and daily targets for weight goals." },
            { name: "Marketing ROI Calculator", href: "/marketing/marketing-roi-calculator", icon: "ROI", desc: "Calculate ROAS, ROMI, and CAC across channels." },
            { name: "Halal Mortgage Calculator", href: "/finance/halal-mortgage-calculator", icon: "HLM", desc: "Compare Sharia-compliant home finance structures." },
          ].map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group flex flex-col gap-3 rounded-[2rem] border border-white/40 bg-white/40 p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/20 hover:bg-white/60 hover:shadow-hover"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[11px] font-black text-primary shadow-sm ring-1 ring-black/5">
                {tool.icon}
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-slate-900 transition-colors group-hover:text-primary">
                  {tool.name}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500 font-medium">{tool.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  </>
  );
}
