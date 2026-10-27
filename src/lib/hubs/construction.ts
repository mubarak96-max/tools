import type { HubContent } from "./types";

export const constructionHub: HubContent = {
  path: "/construction",
  label: "Construction Tools",
  metaTitle: "Free Construction Calculators: Concrete, Paint, Flooring & Roofing",
  metaDescription:
    "Free material calculators for concrete volume and bags, paint coverage, flooring and roofing, with waste allowances built in so you buy the right amount the first time.",
  h1: "Construction material calculators",
  lead:
    "Work out how much concrete, paint, flooring or roofing material a job needs, including a sensible waste allowance, before you order.",
  intro: [
    "Ordering too little stalls a job while you wait for a second delivery, and sometimes the second batch doesn't match the colour or dye lot of the first. Ordering too much wastes money on stock you can't return. These calculators convert your measurements into purchase quantities (cubic yards or metres, bags, gallons or litres, boxes, squares) and add a waste factor that suits the material.",
    "They're for DIY homeowners and contractors putting together a quick estimate. For structural work, follow your engineer's specification and local building codes.",
  ],
  groups: [
    {
      heading: "Structure and surfaces",
      intro: "Calculate the volume of concrete for slabs, footings and columns, and the roofing needed for a given pitch and area.",
      hrefs: ["/construction/concrete-volume-calculator", "/construction/roofing-material-calculator"],
    },
    {
      heading: "Interior finishes",
      intro: "Estimate paint for walls and ceilings, and flooring for rooms including cuts and pattern waste.",
      hrefs: ["/construction/paint-coverage-calculator", "/construction/flooring-material-calculator"],
    },
    {
      heading: "Project costs",
      intro: "Compare cost per square foot and check whether a renovation adds enough value to justify it.",
      hrefs: ["/real-estate/price-per-square-foot-calculator", "/finance/general-liability-insurance-cost-estimator"],
    },
  ],
  methodology: {
    heading: "Estimating assumptions",
    points: [
      {
        title: "Waste factors",
        body: "Typical allowances are applied: around 5–10% for concrete, 10% for straight-lay flooring and 15% or more for diagonal or herringbone patterns.",
      },
      {
        title: "Imperial and metric",
        body: "Enter feet, inches or metres and get quantities in the units your supplier sells.",
      },
      {
        title: "Coverage rates",
        body: "Paint coverage uses typical manufacturer rates (about 350–400 sq ft per gallon per coat). Check your product's label for the exact figure.",
      },
      {
        title: "Estimates, not specs",
        body: "Results are for ordering and budgeting. They don't replace engineered drawings.",
      },
    ],
  },
  faqs: [
    {
      question: "How much extra concrete should I order?",
      answer:
        "Order about 5–10% more than the calculated volume to allow for uneven subgrade, spillage and form flex. Running short mid-pour can leave a cold joint, so the small extra cost is worth it.",
    },
    {
      question: "How many coats of paint do I need?",
      answer:
        "Usually two coats for an even finish. A single coat can work when you repaint a similar colour over a sound surface. Big colour changes or new drywall usually need a primer plus two coats.",
    },
    {
      question: "What is a roofing square?",
      answer:
        "A roofing square is 100 square feet of roof area. Shingles are usually sold in bundles, and three bundles of standard architectural shingles typically cover one square.",
    },
  ],
};
