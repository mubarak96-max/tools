import type { Metadata } from "next";
import { OvulationCalculator } from "./components/OvulationCalculator";
import { HealthToolPage } from "@/app/health/components/HealthToolPage";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/health/ovulation-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "How accurate is an ovulation calculator?",
    answer:
      "An ovulation calculator is a useful starting point but not a guarantee. It works best for women with regular cycles because it assumes ovulation occurs roughly 14 days before the next period. Stress, illness, travel, and hormonal fluctuations can all shift ovulation by several days. For greater accuracy, combine calendar tracking with physical signs like cervical mucus changes and LH surge tests.",
  },
  {
    question: "Can I get pregnant outside my fertile window?",
    answer:
      "Pregnancy is only possible when sperm meets a viable egg, which means conception requires intercourse within the fertile window — the five days before ovulation plus the day of ovulation itself. Outside this window, the egg is no longer available. However, because ovulation timing can vary, it is possible to conceive from intercourse that seemed to fall outside a predicted window if ovulation occurred earlier or later than expected.",
  },
  {
    question: "What is the LH surge and when does it happen?",
    answer:
      "The LH (luteinising hormone) surge is a sharp rise in LH levels that triggers ovulation approximately 24–36 hours later. It typically occurs around day 12–14 of a 28-day cycle but varies with cycle length. Over-the-counter ovulation predictor kits (OPKs) detect this surge in urine, giving you advance notice of your most fertile days. A positive OPK result means ovulation is imminent — usually within one to two days.",
  },
  {
    question: "Does cycle length affect when I ovulate?",
    answer:
      "Yes. Ovulation does not always happen on day 14 — that figure assumes a textbook 28-day cycle. The key relationship is that ovulation typically occurs 12–16 days before the start of your next period, regardless of total cycle length. If your cycle is 32 days, you likely ovulate around day 16–20. If your cycle is 24 days, ovulation may occur as early as day 8–12. Tracking your cycle length over several months gives a much more personalised estimate.",
  },
  {
    question: "When should I see a doctor about ovulation problems?",
    answer:
      "If you have been trying to conceive for 12 months without success (or 6 months if you are over 35), speak to your doctor. Signs that ovulation may be irregular include cycles shorter than 21 days or longer than 35 days, very light or very heavy periods, or cycles that vary significantly in length from month to month. Conditions like polycystic ovary syndrome (PCOS) and thyroid disorders are common causes of irregular ovulation and are treatable.",
  },
];

export const metadata: Metadata = {
  title: "Ovulation & Fertility Calculator | Find Your Fertile Window",
  description:
    "Calculate your most fertile days and estimated ovulation date based on your cycle length. Free ovulation calculator using standard fertility tracking methods.",
  keywords: [
    "ovulation calculator",
    "fertile window calculator",
    "ovulation tracker",
    "fertility calculator",
    "when do I ovulate",
    "ovulation date calculator",
    "LH surge tracker",
    "menstrual cycle ovulation",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Ovulation & Fertility Calculator | Find Your Fertile Window",
    description:
      "Calculate your most fertile days and estimated ovulation date based on your cycle length.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ovulation & Fertility Calculator",
    description:
      "Find your fertile window and estimated ovulation date. Free calculator based on your cycle length.",
  },
};

function buildJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Ovulation & Fertility Calculator",
    url: PAGE_URL,
    applicationCategory: "HealthApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Free ovulation calculator that estimates your fertile window and ovulation date based on your last period and average cycle length.",
    featureList: [
      "Fertile window calculation",
      "Estimated ovulation date",
      "Cycle length personalisation",
      "Next period prediction",
    ],
  };
}

export default function OvulationCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Health", path: "/health" },
    { name: "Ovulation Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}
      <HealthToolPage
        title="Ovulation & Fertility Calculator"
        description="Estimate your most fertile days and ovulation window to help with family planning. Enter your last period date and average cycle length for a personalised prediction."
        category="Health"
        path={PAGE_PATH}
        infoSection={
          <>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Understanding your fertile window</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              The <strong>fertile window</strong> is the span of days in your menstrual cycle during which pregnancy is biologically possible. It spans approximately six days in total: the five days leading up to ovulation and the day of ovulation itself. This window exists because sperm can survive inside the female reproductive tract for up to five days, while the egg remains viable for only 12–24 hours after it is released. Having intercourse in the days before ovulation means sperm are already present and waiting when the egg arrives.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              The most fertile days within this window are the two days immediately before ovulation and the day of ovulation itself. Studies tracking conception rates show that intercourse on these three days gives the highest probability of pregnancy per cycle — roughly 27–33% for healthy couples under 35. The probability drops off sharply on either side of this peak, falling to around 10% five days before ovulation and near zero two days after.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Understanding your fertile window is valuable whether you are trying to conceive or simply want to understand your body better. Fertility awareness methods have been used for decades as both a conception aid and a natural family planning approach, though their effectiveness depends heavily on consistent and accurate tracking.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">How the ovulation calculator works</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              This calculator uses the standard calendar method to estimate ovulation. The key assumption is that ovulation occurs approximately <strong>14 days before the start of your next period</strong>, regardless of your total cycle length. This relationship — known as the luteal phase — is relatively consistent across women, typically lasting 12–16 days. The follicular phase (from the start of your period to ovulation) is where most cycle-to-cycle variation occurs.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              To estimate your ovulation date, the calculator takes the first day of your last menstrual period (LMP) and adds your average cycle length minus 14 days. For a 28-day cycle, that means ovulation is predicted around day 14. For a 32-day cycle, ovulation is predicted around day 18. For a 24-day cycle, it falls around day 10. The fertile window is then calculated as the five days before this estimated ovulation date through to the day after.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Because this is a statistical estimate based on averages, it works best when your cycles are regular and consistent. If your cycle length varies by more than a few days from month to month, the prediction becomes less reliable. In those cases, combining the calendar method with physical signs of ovulation gives a much more accurate picture.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Physical signs of ovulation to watch for</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Your body produces several observable signals around the time of ovulation. Learning to recognise these signs — a practice called the symptothermal method — can significantly improve the accuracy of your fertility tracking.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              <strong>Cervical mucus changes</strong> are one of the most reliable indicators. In the days leading up to ovulation, oestrogen levels rise and cause the cervix to produce increasing amounts of mucus that becomes progressively clearer, thinner, and more slippery — often described as resembling raw egg whites. This "fertile quality" mucus helps sperm travel through the cervix and survive longer. After ovulation, progesterone causes mucus to become thick, cloudy, and sticky again. Checking cervical mucus daily and noting its consistency gives you a real-time window into your hormonal state.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              <strong>Basal body temperature (BBT)</strong> is your resting temperature taken first thing in the morning before getting out of bed. Before ovulation, BBT typically sits in the range of 36.1–36.4°C (97.0–97.5°F). After ovulation, progesterone causes a sustained rise of 0.2–0.5°C (0.4–1.0°F) that persists until your next period. This rise confirms that ovulation has already occurred — making BBT most useful for identifying patterns over several cycles rather than predicting ovulation in real time. A BBT thermometer (accurate to two decimal places) and a consistent measurement time are essential for reliable readings.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              <strong>The LH surge</strong> is the most precise predictor of imminent ovulation. Luteinising hormone spikes sharply 24–36 hours before the egg is released, and this surge is detectable in urine using over-the-counter ovulation predictor kits (OPKs). A positive OPK result means ovulation is likely within one to two days — the ideal time to try to conceive. Digital OPKs that also track oestrogen can identify the full fertile window rather than just the peak.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Some women also notice <strong>mittelschmerz</strong> — a mild one-sided pelvic pain or twinge that occurs around ovulation, thought to be caused by the follicle rupturing or the egg travelling through the fallopian tube. Breast tenderness, mild bloating, and a heightened sense of smell are other commonly reported signs, though these vary considerably between individuals.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Cycle length variations and what they mean</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              A "normal" menstrual cycle can range from 21 to 35 days, and even within that range, your own cycle may vary by a few days from month to month. This variation is entirely normal and does not indicate a problem. Factors that commonly cause temporary cycle changes include significant stress, changes in exercise intensity, travel across time zones, illness, dramatic weight changes, and starting or stopping hormonal contraception.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Tracking your cycle length over at least three months — ideally six or more — gives you a much more reliable baseline for predicting ovulation. Apps and cycle tracking tools can calculate your average cycle length and flag when a cycle is unusually short or long. If your cycles are consistently shorter than 21 days or longer than 35 days, or if they vary by more than 7–9 days from cycle to cycle, it is worth discussing with a healthcare provider as this can indicate hormonal imbalances or conditions like PCOS.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">When to seek medical advice</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              If you have been trying to conceive for 12 months without success — or 6 months if you are over 35 — it is recommended to consult a fertility specialist. This timeline reflects the statistical reality that most healthy couples conceive within 12 months of regular unprotected intercourse, and earlier investigation is warranted as fertility naturally declines with age.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Signs that ovulation may not be occurring regularly include absent or very infrequent periods, cycles that are consistently very short or very long, or periods that are extremely light or extremely heavy. Conditions such as polycystic ovary syndrome (PCOS), thyroid disorders, hyperprolactinaemia, and premature ovarian insufficiency can all disrupt ovulation and are diagnosable with blood tests and ultrasound. Most are treatable, and many women with these conditions go on to conceive successfully with appropriate medical support.
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
        <OvulationCalculator />
      </HealthToolPage>
    </>
  );
}
