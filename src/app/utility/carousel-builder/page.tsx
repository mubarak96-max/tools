import { Metadata } from 'next';
import { CarouselBuilder } from './components/CarouselBuilder';
import { NicheDirectory } from './components/NicheDirectory';

export const metadata: Metadata = {
    title: 'Free Carousel Builder - Create Viral Social Media Posts in 30 Seconds',
    description: 'Create high-performing social media carousels with AI assistance. Free tool with viral templates for Instagram, LinkedIn, and more.',
    keywords: 'carousel maker, seamless carousel maker, social media tool, instagram carousel, linkedin posts, free carousel builder',
    openGraph: {
        title: 'Free Carousel Builder - Create Viral Social Media Posts',
        description: 'Create high-performing social media carousels with AI assistance. Free tool with viral templates.',
        type: 'website'
    }
};

export default function CarouselBuilderPage() {
    return (
        <div>
            <CarouselBuilder />

            {/* Niche Directory for SEO and user discovery */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <NicheDirectory />
            </div>
        </div>
    );
}