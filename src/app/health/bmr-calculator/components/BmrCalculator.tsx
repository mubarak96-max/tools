"use client";

import React, { useState, useMemo } from "react";
import { calculateBMR, type BMRInputs, type Gender } from "@/lib/tools/bmr";

export function BmrCalculator() {
  const [inputs, setInputs] = useState<BMRInputs>({
    gender: "male",
    weight: 70,
    height: 170,
    age: 30,
  });

  const bmr = useMemo(() => calculateBMR(inputs), [inputs]);

  const activityLevels = [
    { label: "Sedentary (little or no exercise)", multiplier: 1.2, tdee: Math.round(bmr * 1.2) },
    { label: "Lightly active (1-3 days/week)", multiplier: 1.375, tdee: Math.round(bmr * 1.375) },
    { label: "Moderately active (3-5 days/week)", multiplier: 1.55, tdee: Math.round(bmr * 1.55) },
    { label: "Very active (6-7 days/week)", multiplier: 1.725, tdee: Math.round(bmr * 1.725) },
    { label: "Extremely active (athlete/trainer)", multiplier: 1.9, tdee: Math.round(bmr * 1.9) },
  ];

  const updateInput = (key: keyof BMRInputs, value: string | number) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-10 w-full animate-fade-in">
      {/* Calculator Inputs */}
      <div className="glass-card p-6 sm:p-8 rounded-[1.75rem] border border-border/80 shadow-sm space-y-6">
        <div className="flex gap-4 p-1.5 bg-muted/50 rounded-2xl w-fit mx-auto sm:mx-0">
          <button
            onClick={() => updateInput("gender", "male")}
            className={`px-8 py-2.5 rounded-xl text-sm font-semibold transition-all ${inputs.gender === "male" ? "bg-card text-primary shadow-sm ring-1 ring-border" : "text-muted-foreground hover:text-foreground"}`}
          >
            Male
          </button>
          <button
            onClick={() => updateInput("gender", "female")}
            className={`px-8 py-2.5 rounded-xl text-sm font-semibold transition-all ${inputs.gender === "female" ? "bg-card text-primary shadow-sm ring-1 ring-border" : "text-muted-foreground hover:text-foreground"}`}
          >
            Female
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2.5">
            <label className="text-sm font-semibold text-foreground/80 ml-1">Weight (kg)</label>
            <input
              type="number"
              value={inputs.weight}
              onChange={(e) => updateInput("weight", Number(e.target.value))}
              className="w-full bg-card border border-border/60 rounded-[1rem] px-4 py-3.5 text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div className="space-y-2.5">
            <label className="text-sm font-semibold text-foreground/80 ml-1">Height (cm)</label>
            <input
              type="number"
              value={inputs.height}
              onChange={(e) => updateInput("height", Number(e.target.value))}
              className="w-full bg-card border border-border/60 rounded-[1rem] px-4 py-3.5 text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div className="space-y-2.5">
            <label className="text-sm font-semibold text-foreground/80 ml-1">Age (years)</label>
            <input
              type="number"
              value={inputs.age}
              onChange={(e) => updateInput("age", Number(e.target.value))}
              className="w-full bg-card border border-border/60 rounded-[1rem] px-4 py-3.5 text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>
      </div>

      {/* BMR Result */}
      <div className="relative overflow-hidden bg-primary/[0.03] p-10 sm:p-12 rounded-[2rem] border border-primary/10 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/5 blur-[80px] pointer-events-none" />
        <h3 className="text-xs font-bold text-primary mb-3 uppercase tracking-[0.2em]">Your Basal Metabolic Rate</h3>
        <p className="text-5xl sm:text-7xl font-semibold tracking-tight text-foreground">
          {Math.round(bmr).toLocaleString()} <span className="text-2xl sm:text-3xl text-muted-foreground font-normal">kcal/day</span>
        </p>
        <p className="mt-6 text-base text-muted-foreground max-w-lg mx-auto leading-7">
          This is the calories your body burns just to stay alive (heart beating, lungs breathing, etc.) without any activity.
        </p>
      </div>

      {/* TDEE Multipliers */}
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-semibold tracking-tight text-foreground">Your Daily Calorie Needs (TDEE)</h3>
          <p className="text-base text-muted-foreground">Based on your activity level, here&apos;s how many calories you burn daily. Multiply your BMR by your activity factor to get your Total Daily Energy Expenditure (TDEE).</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {activityLevels.map((level, idx) => (
            <div key={idx} className="bg-card p-5 rounded-2xl border border-border/60 shadow-sm hover:border-primary/30 transition-all group">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3 group-hover:text-primary transition-colors">{level.label.split('(')[0]}</p>
              <p className="text-2xl font-bold text-foreground">{level.tdee.toLocaleString()}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">Multiplier</span>
                <span className="text-xs font-bold text-primary/70 bg-primary/5 px-2 py-0.5 rounded-md">×{level.multiplier}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Organ Breakdown (Unique SEO content) */}
      <div className="glass-card p-8 rounded-3xl border border-border/80 shadow-sm transition-all hover:shadow-md">
        <h3 className="text-xl font-semibold text-foreground mb-1 flex items-center gap-2">
          <span className="w-2 h-6 bg-emerald-500 rounded-full" />
          Where do those calories go?
        </h3>
        <p className="text-sm text-muted-foreground mb-6">Approximate BMR energy consumption by organ. Your brain and liver are surprisingly active!</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {[
            { label: "Liver", pct: "27%", color: "bg-red-400" },
            { label: "Brain", pct: "19%", color: "bg-blue-400" },
            { label: "Skeletal Muscle", pct: "18%", color: "bg-orange-400" },
            { label: "Kidneys", pct: "10%", color: "bg-purple-400" },
            { label: "Heart", pct: "7%", color: "bg-rose-400" },
            { label: "Others", pct: "19%", color: "bg-slate-400" },
          ].map((organ, i) => (
            <div key={i} className="flex flex-col items-center p-3 rounded-2xl bg-muted/30 border border-border/40">
              <span className={`w-3 h-3 rounded-full ${organ.color} mb-2`} />
              <span className="text-xs font-bold text-foreground mb-0.5">{organ.pct}</span>
              <span className="text-[10px] text-muted-foreground text-center leading-tight">{organ.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* What is BMR Section */}
      <div className="max-w-none space-y-12 pt-8">
        <section className="prose prose-slate max-w-none">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground mb-6">What is Basal Metabolic Rate (BMR)?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4 text-muted-foreground leading-7 text-lg">
              <p>
                Basal Metabolic Rate (BMR) is the amount of energy your body expends to maintain basic physiological functions at rest—including breathing, circulation, cell production, and nutrient processing. In other words, it&apos;s the minimum number of calories your body burns just to keep you alive, even if you&apos;re lying in bed doing absolutely nothing.
              </p>
              <p>
                Your BMR accounts for 60–75% of your total daily energy expenditure for sedentary individuals. Understanding your BMR is crucial for setting realistic weight loss or weight gain goals, as it forms the foundation of your total daily calorie needs.
              </p>
            </div>
            <div className="bg-muted/30 rounded-3xl p-8 border border-border/50">
              <h4 className="text-lg font-bold text-foreground mb-4">Key BMR Drivers</h4>
              <ul className="space-y-3">
                {[
                  { label: "Muscle Mass", desc: "Muscle tissue is more metabolically active than fat." },
                  { label: "Age", desc: "BMR typically decreases 2-3% per decade after 30." },
                  { label: "Genetics", desc: "Individual metabolism rates can vary slightly by birth." },
                  { label: "Hormones", desc: "Thyroid function plays a massive role in BMR speeds." },
                ].map((item, i) => (
                  <li key={i} className="flex flex-col">
                    <span className="text-sm font-bold text-primary">{item.label}</span>
                    <span className="text-xs text-muted-foreground">{item.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="prose prose-slate max-w-none">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground mb-6">Mifflin-St Jeor vs Harris-Benedict Formula</h2>
          <div className="space-y-4 text-muted-foreground leading-7 text-lg">
            <p>
              This calculator uses the <strong>Mifflin-St Jeor equation</strong>, which is considered the gold standard for estimating BMR in modern populations. Developed in 1990, it replaced the older Harris-Benedict formula (from 1919) as it provides better accuracy for individuals with higher body weights and modern life patterns.
            </p>
            <p>
              While the Harris-Benedict formula tends to overestimate BMR in some cases, the Mifflin-St Jeor formula was created using data from more recent metabolic studies, making it the preferred choice for nutritionists and fitness professionals today.
            </p>
          </div>
        </section>

        <section className="prose prose-slate max-w-none">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground mb-6">How to Use Your BMR to Calculate TDEE</h2>
          <div className="space-y-6 text-muted-foreground leading-7 text-lg">
            <p>
              To find your Total Daily Energy Expenditure (TDEE), multiply your BMR by your activity level factor. This helps you understand <strong>how to calculate calorie needs</strong> for maintenance or weight management.
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 list-none text-base">
              {[
                ["Sedentary (no exercise)", "1.2"],
                ["Lightly active (1–3 days/week)", "1.375"],
                ["Moderately active (3–5 days/week)", "1.55"],
                ["Very active (6–7 days/week)", "1.725"],
                ["Extremely active (athlete/trainer)", "1.9"],
              ].map(([label, mult]) => (
                <li key={mult} className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-muted/30">
                  <span className="font-medium text-foreground">{label}</span>
                  <span className="font-bold text-primary">BMR × {mult}</span>
                </li>
              ))}
            </ul>
            <p>
              Once you have your TDEE, you can set your weight goals. To lose weight, aim for a 500-calorie daily deficit. To gain weight, aim for a 300-500 calorie surplus. For related review, try the <a href="/text/readability-flesch-kincaid-calculator" className="text-primary hover:underline font-semibold">readability calculator</a> for nutrition notes and plans.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground mb-8">BMR vs TDEE: What&apos;s the Difference?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
            <div className="glass-card p-8 rounded-3xl border border-border/80">
              <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-2 h-6 bg-primary rounded-full" />
                BMR
              </h3>
              <ul className="text-muted-foreground space-y-3 leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/40" />
                  <span>Calories burned at complete rest</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/40" />
                  <span>No physical activity involved</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/40" />
                  <span>Includes only essential body functions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/40" />
                  <span>60–75% of total daily expenditure</span>
                </li>
              </ul>
            </div>
            <div className="glass-card p-8 rounded-3xl border border-border/80">
              <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-2 h-6 bg-blue-500 rounded-full" />
                TDEE
              </h3>
              <ul className="text-muted-foreground space-y-3 leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500/40" />
                  <span>Total calories burned in a full day</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500/40" />
                  <span>Includes all activities and exercise</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500/40" />
                  <span>BMR + activity calories</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500/40" />
                  <span>Varies based on lifestyle</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* RELATED TOOLS */}
        <section className="bg-primary/[0.03] border border-primary/10 rounded-[2rem] p-8 sm:p-10">
          <h2 className="text-2xl font-bold text-foreground mb-6">Explore Related Health Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { name: "Readability Calculator", href: "/text/readability-flesch-kincaid-calculator", desc: "Review health notes for reading ease." },
              { name: "Word Frequency Counter", href: "/text/word-frequency", desc: "Check repeated terms in nutrition plans." },
              { name: "xG Calculator", href: "/utility/xg-expected-goals-calculator", desc: "Model football chance quality and match xG." },
            ].map((tool, i) => (
              <a key={i} href={tool.href} className="group bg-card rounded-2xl border border-border/60 p-5 hover:border-primary/40 transition-all shadow-sm">
                <h4 className="font-bold text-foreground group-hover:text-primary mb-2 transition-colors">{tool.name}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{tool.desc}</p>
              </a>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="pt-8">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground mb-10">BMR Calculator FAQ</h2>
          <div className="grid gap-4">
            {[
              {
                q: "What is a normal BMR for a woman?",
                a: "A normal BMR for an adult woman ranges from 1,400–1,600 kcal/day, depending on age, weight, height, and fitness level. Women typically have a lower BMR than men due to generally having more body fat and less muscle mass."
              },
              {
                q: "Does BMR change with age?",
                a: "Yes, BMR typically decreases by about 2–8% per decade after age 30. This is because we naturally lose muscle mass as we age, and muscle tissue burns more calories at rest than fat tissue."
              },
              {
                q: "How do I use BMR to lose weight?",
                a: "To lose weight, consume fewer calories than your TDEE (Total Daily Energy Expenditure), which is your BMR multiplied by your activity level. A 500-calorie daily deficit results in approximately 1 lb of weight loss per week."
              },
              {
                q: "Can I increase my BMR?",
                a: "Yes! Building muscle mass is the most effective way to increase BMR. Muscle tissue burns more calories at rest than fat tissue. Our Body Fat Calculator can help you track muscle trends."
              },
              {
                q: "Which BMR formula is the most accurate?",
                a: "The Mifflin-St Jeor equation is considered the most accurate modern formula. It is the one we use in this calculator and is recommended by the Academy of Nutrition and Dietetics."
              }
            ].map((faq, i) => (
              <div key={i} className="group rounded-2xl border border-border/60 bg-card p-6 border-l-4 border-l-primary hover:border-primary/30 transition-all">
                <h3 className="text-lg font-bold text-foreground mb-3">{faq.q}</h3>
                <p className="text-muted-foreground leading-7">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
