"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "How is gratuity calculated in the UAE under the new labour law?",
    answer: "Under Federal Decree-Law No. 33 of 2021, UAE gratuity is calculated based on your last drawn basic salary. For the first 5 years of service, you receive 21 days' basic salary per year. For each additional year beyond 5 years, you receive 30 days' basic salary per year. The total gratuity cannot exceed 2 years of your basic salary. Daily wage = Basic Salary ÷ 30. Unpaid leave days are excluded from service calculations.",
  },
  {
    question: "Is gratuity calculated on basic salary or total salary in the UAE?",
    answer: "Gratuity in the UAE is calculated exclusively on your basic salary, not your total salary package. Basic salary excludes housing allowance, transportation allowance, utility allowance, commissions, overtime, furniture allowance, and any other benefits. Only the fixed basic wage stated in your employment contract is used for gratuity calculations.",
  },
  {
    question: "What is the maximum gratuity limit in the UAE?",
    answer: "The maximum gratuity payable under UAE Labour Law is capped at 2 years of the employee's basic salary (Basic Salary × 24 months), regardless of how many years you have worked. Even if your calculated gratuity exceeds this amount based on years of service, the law mandates that the payment cannot go beyond this 2-year cap.",
  },
  {
    question: "Does resigning affect my gratuity in the UAE?",
    answer: "Under the new UAE Labour Law (Federal Decree-Law No. 33 of 2021 effective February 2022), resigning does NOT reduce your gratuity entitlement. This is a major change from the old law where employees on unlimited contracts who resigned before 5 years received reduced gratuity (1/3 or 2/3). Now, all eligible employees receive full gratuity whether they resign or are terminated.",
  },
  {
    question: "How many days of basic salary is gratuity in the UAE?",
    answer: "For the first 5 years of service: 21 days of basic salary per year. For service beyond 5 years: 30 days of basic salary per year. The daily rate is calculated by dividing your basic monthly salary by 30. For example, with a basic salary of AED 15,000, your daily wage is AED 500, and your annual gratuity for the first 5 years would be 21 × 500 = AED 10,500 per year.",
  },
  {
    question: "When must employers pay gratuity in the UAE?",
    answer: "Employers must pay all outstanding wages, other entitlements, and gratuity within 14 days of the termination of the employment contract, as mandated by Article 51 of Federal Decree-Law No. 33 of 2021. Failure to comply may result in fines from MoHRE ranging from AED 5,000 to AED 1,000,000.",
  },
  {
    question: "Are part-time workers entitled to gratuity in the UAE?",
    answer: "Yes, part-time, temporary, and flexible contract workers are entitled to gratuity under Cabinet Resolution No. 1 of 2022. Their gratuity is calculated on a pro-rata basis by comparing actual hours worked to a full-time schedule (40 hours/week). For example, working 20 hours/week (50% of full-time) means you receive 50% of the full-time gratuity amount.",
  },
  {
    question: "What is the UAE Savings Scheme for end of service benefits?",
    answer: "The UAE Savings Scheme is a voluntary alternative to traditional gratuity introduced in 2023. Employers contribute monthly to approved investment funds: 5.83% of basic salary for employees with under 5 years of service, and 8.33% for those with over 5 years. Employees can also make voluntary contributions up to 25% of their wage. The scheme offers capital guarantee, risk-based, and Sharia-compliant investment options.",
  },
  {
    question: "Can an employer deduct money from my gratuity?",
    answer: "Yes, employers may deduct amounts lawfully owed by the worker from the gratuity payment, but only in accordance with conditions and procedures specified by law. This could include unpaid loans, damages caused by the employee, or other debts that have been legally established or ordered by a competent court.",
  },
  {
    question: "What happens if I work less than 1 year in the UAE?",
    answer: "If you have served less than 1 year of continuous service, you are NOT entitled to any gratuity pay under UAE Labour Law. The minimum qualifying period is 12 months of continuous service with the same employer. However, you are entitled to gratuity for fractions of a year if you have completed at least 1 year of service.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
          <HelpCircle className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
          <p className="text-sm text-slate-500">Common questions about UAE gratuity calculations</p>
        </div>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div key={index} className="rounded-xl ring-1 ring-slate-200 overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-slate-50"
            >
              <span className="font-semibold text-slate-900 pr-4">{faq.question}</span>
              <motion.div animate={{ rotate: openIndex === index ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0">
                <ChevronDown className="h-5 w-5 text-slate-400" />
              </motion.div>
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                  <div className="border-t border-slate-100 px-5 py-4 text-slate-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
