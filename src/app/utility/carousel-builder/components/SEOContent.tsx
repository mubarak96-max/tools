'use client';

import React from 'react';
import { NicheConfig } from '../types';
import { getRelatedNiches } from '../utils/seo';

interface SEOContentProps {
    niche: NicheConfig;
}

export const SEOContent: React.FC<SEOContentProps> = ({ niche }) => {
    const relatedNiches = getRelatedNiches(niche.slug);

    const scrollToTool = () => {
        document.getElementById('carousel-tool')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Hero Section */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                    {niche.seoContent.h1}
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    {niche.seoContent.intro}
                </p>
                <button
                    onClick={scrollToTool}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
                >
                    Create Your Carousel Now →
                </button>
            </div>

            {/* Benefits Section */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
                {niche.seoContent.benefits.map((benefit, index) => (
                    <div key={benefit} className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <span className="text-2xl font-bold text-blue-600">{index + 1}</span>
                        </div>
                        <h3 className="font-semibold mb-2 text-gray-900">{benefit}</h3>
                    </div>
                ))}
            </div>

            {/* Examples Gallery */}
            <div className="mb-16">
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
                    {niche.title.split(' ')[0]} Carousel Examples
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {niche.seoContent.examples.map((example, index) => (
                        <div key={example} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="bg-gradient-to-br from-blue-100 to-purple-100 h-32 rounded mb-3 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-600">Preview {index + 1}</span>
                            </div>
                            <h4 className="font-medium text-gray-900">{example}</h4>
                        </div>
                    ))}
                </div>
            </div>

            {/* How It Works */}
            <div className="mb-16 bg-gray-50 rounded-lg p-8">
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
                    How It Works
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center">
                        <div className="w-12 h-12 bg-blue-600 text-white rounded-full mx-auto mb-4 flex items-center justify-center font-bold text-lg">
                            1
                        </div>
                        <h3 className="font-semibold mb-2">Enter Your Topic</h3>
                        <p className="text-gray-600">Tell us what your carousel is about in a few words</p>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-blue-600 text-white rounded-full mx-auto mb-4 flex items-center justify-center font-bold text-lg">
                            2
                        </div>
                        <h3 className="font-semibold mb-2">AI Generates Content</h3>
                        <p className="text-gray-600">Our AI creates engaging slides with proven viral formats</p>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-blue-600 text-white rounded-full mx-auto mb-4 flex items-center justify-center font-bold text-lg">
                            3
                        </div>
                        <h3 className="font-semibold mb-2">Edit & Export</h3>
                        <p className="text-gray-600">Customize your carousel and download ready-to-post images</p>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="mb-16">
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
                    Frequently Asked Questions
                </h2>
                <div className="space-y-6">
                    {niche.seoContent.faqs.map((faq, index) => (
                        <div key={index} className="border rounded-lg p-6">
                            <h3 className="font-semibold text-lg mb-2 text-gray-900">{faq.question}</h3>
                            <p className="text-gray-600">{faq.answer}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Related Tools */}
            {relatedNiches.length > 0 && (
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
                        Related Carousel Makers
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {relatedNiches.map((relatedNiche) => (
                            <a
                                key={relatedNiche.slug}
                                href={`/utility/carousel-builder/${relatedNiche.slug}`}
                                className="block border rounded-lg p-6 hover:shadow-md transition-shadow"
                            >
                                <h3 className="font-semibold text-gray-900 mb-2">
                                    {relatedNiche.seoContent.h1}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    {relatedNiche.description}
                                </p>
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* Final CTA */}
            <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4">
                    Ready to Create Your First Carousel?
                </h2>
                <p className="mb-6 opacity-90">
                    Join thousands of creators using our tool to grow their audience
                </p>
                <button
                    onClick={scrollToTool}
                    className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                    Start Creating Free Carousels
                </button>
            </div>
        </div>
    );
};