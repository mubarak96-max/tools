"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What is an aspect ratio calculator and how does it work?",
    answer: "An aspect ratio calculator is a digital tool that computes the proportional relationship between width and height. You enter either a ratio (like 16:9) and one dimension, or two dimensions to find the ratio. The tool uses mathematical proportions to calculate missing values, ensuring your images, videos, or designs maintain correct proportions without distortion."
  },
  {
    question: "How do I calculate a 16:9 aspect ratio from width?",
    answer: "To calculate height from width in a 16:9 ratio, multiply your width by 9 and divide by 16. For example, if your width is 1920 pixels: (1920 × 9) ÷ 16 = 1080 pixels. Our 16 9 aspect ratio calculator does this instantly - just enter your width and the height is calculated automatically."
  },
  {
    question: "What is the difference between 16:9 and 16x9 aspect ratio?",
    answer: "16:9 and 16x9 refer to the same aspect ratio - the colon (:) and multiplication symbol (×) are used interchangeably in different contexts. 16:9 is the standard mathematical notation, while 16x9 is sometimes used in product specifications. Our 16x9 aspect ratio calculator supports both notations and produces identical results."
  },
  {
    question: "How do I find the aspect ratio of an existing image?",
    answer: "Upload your image to our calculator using the 'Upload Image' tab. The tool automatically reads the image dimensions and calculates the exact aspect ratio. Alternatively, divide the image width by its height and simplify the fraction. For example, 1920÷1080 = 1.777..., which simplifies to 16:9."
  },
  {
    question: "What aspect ratio should I use for YouTube videos?",
    answer: "YouTube uses 16:9 as its standard aspect ratio. Recommended resolutions include 1920×1080 (Full HD), 2560×1440 (QHD), and 3840×2160 (4K UHD). For YouTube Shorts, use 9:16 vertical format at 1080×1920. Our calculator includes dedicated YouTube presets for quick selection."
  },
  {
    question: "Is the 4:3 aspect ratio still used today?",
    answer: "Yes, 4:3 remains relevant for iPad displays, classic TV content, retro gaming, some presentation formats, and specific photography applications. Many vintage films and early digital cameras used 4:3. Our 4 3 aspect ratio calculator helps you work with this classic format when needed."
  },
  {
    question: "Can I calculate aspect ratios for print materials?",
    answer: "Absolutely. Our calculator supports inches, centimeters, and millimeters. Common print ratios include 5:4 for 8×10 prints, 3:2 for 4×6 prints, and 7:5 for 5×7 prints. Simply switch to your preferred unit and enter your dimensions."
  },
  {
    question: "What is the best aspect ratio for Instagram posts?",
    answer: "Instagram supports 1:1 (square), 4:5 (portrait), and 1.91:1 (landscape). For maximum engagement, 4:5 portrait (1080×1350) takes up the most screen space in feeds. Stories and Reels use 9:16 (1080×1920). Our calculator includes all Instagram presets."
  },
  {
    question: "How do aspect ratios affect website performance?",
    answer: "Using correct aspect ratios in HTML img tags with width and height attributes prevents Cumulative Layout Shift (CLS), a Core Web Vital that impacts SEO. When browsers know the aspect ratio upfront, they reserve the correct space before images load, improving user experience and search rankings."
  },
  {
    question: "What is pixel density and why does it matter?",
    answer: "Pixel density (PPI - pixels per inch) determines how sharp an image appears on screen or in print. Standard displays use 72-96 PPI, while Retina displays use 200+ PPI. Print quality typically requires 300 PPI. Our calculator shows total pixel count to help you assess image quality for your intended use."
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-12 md:py-16 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
            <HelpCircle className="w-4 h-4" />
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl font-bold text-slate-900">
            Common Questions About Aspect Ratios
          </h2>
          <p className="mt-4 text-slate-600">
            Everything you need to know about calculating and using aspect ratios effectively.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-4 sm:px-6 sm:py-5 text-left hover:bg-slate-50 transition-colors"
              >
                <span className="font-semibold text-slate-900 pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5">
                  <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
