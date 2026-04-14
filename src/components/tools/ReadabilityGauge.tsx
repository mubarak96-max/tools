"use client";

import React from "react";

interface ReadabilityGaugeProps {
  score: number;
  label: string;
  min?: number;
  max?: number;
  className?: string;
}

export default function ReadabilityGauge({
  score,
  label,
  min = 0,
  max = 100,
  className = "",
}: ReadabilityGaugeProps) {
  // Ensure score is within range
  const normalizedScore = Math.min(Math.max(score, min), max);
  const percentage = ((normalizedScore - min) / (max - min)) * 100;
  
  // Calculate color based on score (for Flesch Reading Ease 0-100)
  // 90-100: Green, 0-30: Red
  const getColor = (val: number) => {
    if (val >= 80) return "text-emerald-500";
    if (val >= 60) return "text-green-500";
    if (val >= 50) return "text-yellow-500";
    if (val >= 30) return "text-orange-500";
    return "text-red-500";
  };

  const colorClass = getColor(normalizedScore);

  // SVG parameters
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      <svg className="h-32 w-32 -rotate-90 transform" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          className="text-muted/20"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
        />
        {/* Progress circle */}
        <circle
          className={`${colorClass} transition-all duration-700 ease-in-out`}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center space-y-0.5">
        <span className={`text-2xl font-bold ${colorClass}`}>
          {score.toFixed(1)}
        </span>
        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Score
        </span>
      </div>
      <p className="mt-2 text-sm font-semibold text-foreground">{label}</p>
    </div>
  );
}
