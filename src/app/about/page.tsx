import React from 'react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <h1 className="text-4xl font-bold mb-8 text-gradient-primary">About findmytool</h1>
      
      <div className="glass-card p-8 rounded-2xl space-y-6 text-muted-foreground leading-relaxed">
        <p className="text-lg text-foreground">
          Welcome to <strong className="text-primary">findmytool</strong>, your intelligent guide to the rapidly evolving world of software and AI tools.
        </p>
        
        <p>
          In an era where thousands of new tools are launched every month, finding the right one can feel impossible. 
          We built findmytool to cut through the noise using a unique blend of data-driven analysis and AI-powered insights.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">Our Mission</h2>
        <p>
          Our mission is to help creators, developers, and businesses build the perfect "tech stack" without hours of manual research. 
          We provide clear comparisons, honest alternatives, and deep-dive reviews for everything from AI writing assistants to complex enterprise databases.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <h3 className="font-bold text-foreground mb-2 text-primary">Discover</h3>
            <p className="text-sm">We scan the market for the most promising tools across dozens of categories.</p>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <h3 className="font-bold text-foreground mb-2 text-primary">Analyze</h3>
            <p className="text-sm">Our AI engine processes thousands of data points to generate unbiased pros, cons, and use cases.</p>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <h3 className="font-bold text-foreground mb-2 text-primary">Compare</h3>
            <p className="text-sm">We create head-to-head matchups to help you see exactly which tool wins for your specific needs.</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">AI Transparency</h2>
        <p>
          While we use AI to help summarize and organize information, our goal is always accuracy. We constantly verify our database 
          to ensure the information you see is up-to-date and helpful.
        </p>
      </div>
    </div>
  );
}
