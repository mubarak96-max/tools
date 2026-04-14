import type { Metadata } from "next";
import { PregnancyDueDateCalculator } from "./components/PregnancyDueDateCalculator";
import { HealthToolPage } from "@/app/health/components/HealthToolPage";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/health/pregnancy-due-date-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "How accurate is a due date calculator?",
    answer:
      "A due date calculated from your last menstrual period (LMP) is an estimate, not a guarantee. Only about 5% of babies are born on their exact due date. Most births occur within two weeks either side of the estimated date. Early ultrasound dating (before 14 weeks) is more accurate than LMP-based calculation and is used to confirm or adjust the due date if there is a discrepancy of more than 5–7 days.",
  },
  {
    question: "What is Naegele's Rule?",
    answer:
      "Naegele's Rule is the standard clinical formula for estimating a due date. It works by taking the first day of your last menstrual period, adding one year, subtracting three months, and adding seven days. This is mathematically equivalent to adding 280 days (40 weeks) to your LMP. The rule was developed in the early 19th century and remains the foundation of due date estimation today, though it assumes a 28-day cycle with ovulation on day 14.",
  },
  {
    question: "What if I don't know my last menstrual period date?",
    answer:
      "If you are unsure of your LMP, an early ultrasound can estimate gestational age by measuring the embryo or foetus. Crown-rump length (CRL) measurement in the first trimester is the most accurate method, with a margin of error of about ±5 days before 14 weeks. After 14 weeks, accuracy decreases as foetal size varies more between individuals. Your midwife or doctor will use the ultrasound date to establish your due date if LMP is unknown or uncertain.",
  },
  {
    question: "What does 'full term' mean?",
    answer:
      "A pregnancy is considered full term between 39 weeks 0 days and 40 weeks 6 days. Babies born between 37 and 38 weeks 6 days are called early term, and those born at 41 weeks or beyond are late term. The distinction matters because even babies born at 37–38 weeks have higher rates of breathing difficulties, feeding problems, and NICU admission compared to those born at 39–40 weeks. Most healthcare providers aim to avoid elective delivery before 39 weeks unless medically indicated.",
  },
  {
    question: "What are the signs that labour is starting?",
    answer:
      "Early signs of labour include a 'show' (a mucus plug tinged with blood), irregular tightening sensations (Braxton Hicks contractions becoming more regular), lower back pain, and a feeling of the baby dropping lower in the pelvis. Active labour is indicated by regular contractions that grow longer, stronger, and closer together — typically every 5 minutes, lasting 60 seconds, for at least an hour. Your waters breaking (rupture of membranes) can happen before or during labour. Contact your midwife or maternity unit when contractions are regular and strong, or immediately if your waters break.",
  },
];

export const metadata: Metadata = {
  title: "Pregnancy Due Date Calculator | Estimate Your Baby's Arrival",
  description:
    "Calculate your estimated due date using Naegele's Rule. Enter your last menstrual period date to find your due date, trimester dates, and key pregnancy milestones.",
  keywords: [
    "pregnancy due date calculator",
    "due date calculator",
    "Naegele's rule calculator",
    "baby due date estimator",
    "pregnancy week calculator",
    "LMP due date calculator",
    "estimated delivery date",
    "pregnancy trimester calculator",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Pregnancy Due Date Calculator | Estimate Your Baby's Arrival",
    description:
      "Calculate your estimated due date using Naegele's Rule. Find your due date, trimester milestones, and key pregnancy dates.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pregnancy Due Date Calculator",
    description:
      "Enter your last menstrual period date to calculate your estimated due date and pregnancy milestones.",
  },
};

function buildJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Pregnancy Due Date Calculator",
    url: PAGE_URL,
    applicationCategory: "HealthApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Free pregnancy due date calculator using Naegele's Rule. Estimates your due date, trimester dates, and key milestones from your last menstrual period.",
    featureList: [
      "Due date calculation from LMP",
      "Trimester breakdown",
      "Key pregnancy milestone dates",
      "Gestational age tracking",
    ],
  };
}

export default function PregnancyDueDateCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Health", path: "/health" },
    { name: "Pregnancy Due Date Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}
      <HealthToolPage
        title="Pregnancy Due Date Calculator"
        description="Estimate your baby's due date based on your last menstrual period using Naegele's Rule. See your trimester dates and key pregnancy milestones at a glance."
        category="Health"
        path={PAGE_PATH}
        infoSection={
          <>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">How your due date is calculated</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              This calculator uses <strong>Naegele's Rule</strong>, the standard clinical method for estimating a pregnancy's due date. The formula adds 280 days (40 weeks) to the first day of your last menstrual period (LMP). The reason pregnancy is counted from the LMP rather than the date of conception is practical: most women know when their last period started, but very few know the exact moment of conception. Since ovulation typically occurs around day 14 of a 28-day cycle, the LMP date is approximately two weeks before conception — meaning the first two weeks of a "40-week pregnancy" occur before the embryo even exists.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Naegele's Rule was developed by German obstetrician Franz Karl Naegele in the early 19th century and remains the foundation of due date estimation worldwide. It assumes a 28-day cycle with ovulation on day 14. If your cycle is consistently longer or shorter than 28 days, your actual due date may differ slightly from the calculator's estimate. A cycle of 35 days, for example, suggests ovulation around day 21, which would push the due date approximately one week later than the standard calculation.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Trimester breakdown: what happens when</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Pregnancy is divided into three trimesters, each representing a distinct phase of foetal development and maternal experience.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              The <strong>first trimester</strong> runs from week 1 through week 12. This is the period of most rapid and critical development. By week 6, the embryo has a heartbeat. By week 10, all major organs have begun forming. The first trimester is also when the risk of miscarriage is highest — approximately 80% of miscarriages occur before 12 weeks — and when many women experience nausea, fatigue, and breast tenderness due to rising hCG and progesterone levels. The 12-week scan (nuchal translucency scan) screens for chromosomal conditions and confirms the due date.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              The <strong>second trimester</strong> spans weeks 13 through 26 and is often called the "honeymoon period" of pregnancy. Nausea typically subsides, energy returns, and the pregnancy becomes visible. The foetus grows from about 7 cm at 13 weeks to around 35 cm by 26 weeks. Around week 18–20, most parents have their anatomy scan, which checks foetal development in detail and can reveal the baby's sex. Many women feel foetal movements (quickening) for the first time between weeks 16 and 25.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              The <strong>third trimester</strong> covers weeks 27 through 40 (and beyond). The foetus gains most of its birth weight during this period, and the lungs mature in preparation for breathing air. Braxton Hicks contractions become more noticeable, and the baby typically moves into a head-down position by 36 weeks. Discomforts like back pain, heartburn, and frequent urination are common as the uterus expands. Antenatal appointments become more frequent, and birth preparation — including birth plans, hospital bags, and infant care — takes centre stage.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Ultrasound dating vs LMP dating</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              While LMP-based calculation is the starting point, early ultrasound is considered more accurate for establishing gestational age. In the first trimester, the embryo's <strong>crown-rump length (CRL)</strong> — the measurement from the top of the head to the bottom of the spine — correlates very closely with gestational age, with a margin of error of approximately ±5 days before 14 weeks. This is because early embryonic growth is highly consistent across pregnancies.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              If the ultrasound date differs from the LMP date by more than 5–7 days in the first trimester (or more than 10–14 days in the second trimester), most clinicians will adjust the due date to match the ultrasound measurement. This is particularly important for women with irregular cycles, those who conceived while breastfeeding, or those who became pregnant shortly after stopping hormonal contraception — all situations where LMP-based dating is less reliable.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              After 20 weeks, ultrasound dating becomes less precise because foetal size varies more between individuals. A second-trimester scan can estimate gestational age within about ±2 weeks, and a third-trimester scan within ±3 weeks. This is why establishing an accurate due date early in pregnancy matters — it informs decisions about induction, monitoring, and intervention throughout the pregnancy.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Why only 5% of babies arrive on their due date</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              The due date is best understood as the midpoint of a normal distribution, not a deadline. Research shows that spontaneous labour in uncomplicated pregnancies occurs anywhere from 37 to 42 weeks, with the peak around 40–41 weeks. Only about 5% of babies are born on their exact estimated due date. Approximately 50% of births occur within a week of the due date, and about 80% occur within two weeks.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              First-time mothers tend to go into labour slightly later than those who have given birth before — on average, first babies arrive about 1.3 days after the due date, while subsequent babies arrive slightly earlier. Male foetuses are also statistically born slightly later than female foetuses, though the difference is small. Genetics play a role too: if your mother or sisters had long pregnancies, you may be more likely to as well.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Most healthcare providers will offer induction of labour at 41–42 weeks if spontaneous labour has not begun, as the risk of complications (including stillbirth) increases beyond 42 weeks. The decision about induction timing involves weighing these risks against the risks of the induction procedure itself and is made in consultation with your midwife or obstetrician.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Signs that labour is approaching</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              In the days and weeks before labour begins, many women notice signs that their body is preparing. The baby may "drop" lower into the pelvis (called lightening or engagement), which can relieve pressure on the diaphragm but increase pressure on the bladder. Braxton Hicks contractions — irregular, painless tightenings that have occurred throughout pregnancy — may become more frequent and slightly uncomfortable. Some women experience a burst of energy and a strong urge to clean and organise (the nesting instinct) in the final days before labour.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              The <strong>show</strong> — a discharge of the mucus plug that has sealed the cervix during pregnancy, often tinged pink or brown with blood — can occur days before labour or right at its onset. Waters breaking (rupture of the amniotic membranes) happens before labour begins in about 10% of cases; in most women, membranes rupture during active labour. If your waters break before contractions start, contact your maternity unit immediately as there is a small risk of infection and cord prolapse.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-6 space-y-4">
              {faq.map((item) => (
                <article key={item.question} className="rounded-[1.25rem] border border-border bg-background p-5">
                  <h3 className="text-lg font-semibold text-foreground">{item.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.answer}</p>
                </article>
              ))}
            </div>
          </>
        }
      >
        <PregnancyDueDateCalculator />
      </HealthToolPage>
    </>
  );
}
