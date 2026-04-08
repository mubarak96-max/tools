import React from 'react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <h1 className="text-4xl font-bold mb-8 text-gradient-primary">About FindBest Tools</h1>

      <div className="glass-card p-8 rounded-2xl space-y-6 text-muted-foreground leading-relaxed">
        <p className="text-lg text-foreground">
          Welcome to <strong className="text-primary">FindBest Tools</strong>, an all-in-one hub for
          high-performance web utility tools. We specialize in providing fast, browser-based solutions
          for everyday digital tasks.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">Our Goal</h2>
        <p>
          We believe that powerful tools should be accessible to everyone without the need for complex
          installations or expensive subscriptions. FindBest.Tools is designed to provide a streamlined,
          ad-supported experience where users can get their tasks done in seconds.
        </p>

        <p>
          Every tool on this platform is built with a focus on speed, accuracy, and user privacy. We
          are constantly expanding our library to meet the evolving needs of our global user base.
        </p>
      </div>
    </div>
  );
}
