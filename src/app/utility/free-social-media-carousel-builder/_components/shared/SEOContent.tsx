import React from 'react';
import type { NicheConfig } from '../../_types';

// This is a Server Component (no 'use client') — rendered at build time for SEO
interface Props { niche: NicheConfig; }

export function SEOContent({ niche }: Props) {
    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            {/* Hero */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">{niche.seoContent.h1}</h1>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">{niche.seoContent.intro}</p>
                <a
                    href="#carousel-tool"
                    className="inline-block bg-violet-600 hover:bg-violet-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
                >
                    Create Your Carousel Free →
                </a>
            </div>

            {/* Benefits */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
                {niche.seoContent.benefits.map((benefit, i) => (
                    <div key={benefit} className="text-center p-4">
                        <div className="w-12 h-12 bg-violet-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                            <span className="text-xl font-bold text-violet-600">{i + 1}</span>
                        </div>
                        <p className="font-medium text-gray-800">{benefit}</p>
                    </div>
                ))}
            </div>

            {/* Examples */}
            <div className="mb-16">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                    {niche.seoContent.h1.split(' ').slice(0, 3).join(' ')} Examples
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {niche.seoContent.examples.map((example) => (
                        <div key={example} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="h-24 bg-gradient-to-br from-violet-100 to-blue-100 rounded mb-3 flex items-center justify-center">
                                <span className="text-sm text-gray-500 font-medium">Preview</span>
                            </div>
                            <p className="font-medium text-gray-800 text-sm">{example}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* FAQ */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {niche.seoContent.faqs.map((faq, i) => (
                        <div key={i} className="border border-gray-200 rounded-lg p-5">
                            <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                            <p className="text-gray-600 text-sm">{faq.answer}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA to tool */}
            <div className="text-center bg-gray-50 rounded-xl p-8 mb-8">
                <h2 className="text-xl font-bold mb-3 text-gray-900">Ready to create your carousel?</h2>
                <p className="text-gray-600 mb-5 text-sm">Free, no sign-up needed. Get your first carousel in under 30 seconds.</p>
                <a
                    href="#carousel-tool"
                    className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                    Start Building Free
                </a>
            </div>
        </div>
    );
}