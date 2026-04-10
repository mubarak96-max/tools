'use client';

import type { XGCalculation } from '../types/xg-types';
import { getXGCategory } from '../lib/xg-calculation';

interface ResultsDisplayProps {
    calculation: XGCalculation;
    className?: string;
}

export default function ResultsDisplay({ calculation, className = '' }: ResultsDisplayProps) {
    const xgCategory = getXGCategory(calculation.finalXG);
    const xgPercentage = (calculation.finalXG * 100).toFixed(1);

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Main xG Display */}
            <div className="text-center p-6 bg-card border border-border rounded-lg">
                <div className="text-sm text-muted-foreground mb-2">Expected Goals (xG)</div>
                <div className="text-4xl font-bold text-foreground mb-2">
                    {calculation.finalXG.toFixed(3)}
                </div>
                <div className="flex items-center justify-center gap-2">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: xgCategory.color }}
                    />
                    <span className="text-sm font-medium" style={{ color: xgCategory.color }}>
                        {xgCategory.label} Quality ({xgPercentage}%)
                    </span>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                    This shot has a {xgPercentage}% chance of being scored
                </div>
            </div>

            {/* Shot Information */}
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-card border border-border rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Distance to Goal</div>
                    <div className="text-2xl font-semibold text-foreground">
                        {calculation.distanceFromGoal.toFixed(1)}m
                    </div>
                </div>
                <div className="p-4 bg-card border border-border rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Angle to Goal</div>
                    <div className="text-2xl font-semibold text-foreground">
                        {calculation.angleToGoal.toFixed(1)}°
                    </div>
                </div>
            </div>

            {/* Factor Breakdown */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Factor Breakdown</h3>

                {/* Base xG */}
                <div className="p-4 bg-card border border-border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-foreground">Base xG (Position)</span>
                        <span className="text-sm font-mono text-foreground">
                            {calculation.baseXG.toFixed(3)}
                        </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Calculated from shot distance and angle to goal
                    </div>
                </div>

                {/* Modifiers */}
                <div className="space-y-3">
                    {calculation.factors.map((factor, index) => (
                        <div key={index} className="p-3 bg-card border border-border rounded-lg">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-foreground">{factor.name}</span>
                                        <div className={`
                      w-2 h-2 rounded-full
                      ${factor.impact === 'positive' ? 'bg-green-500' :
                                                factor.impact === 'negative' ? 'bg-red-500' : 'bg-gray-400'}
                    `} />
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-1">
                                        {factor.description}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`
                    text-sm font-mono
                    ${factor.impact === 'positive' ? 'text-green-600' :
                                            factor.impact === 'negative' ? 'text-red-600' : 'text-muted-foreground'}
                  `}>
                                        {factor.name.includes('Distance') || factor.name.includes('Angle')
                                            ? `${factor.value.toFixed(1)}${factor.name.includes('Distance') ? 'm' : '°'}`
                                            : `×${factor.value.toFixed(2)}`
                                        }
                                    </div>
                                    {factor.impact !== 'neutral' && (
                                        <div className={`
                      text-xs
                      ${factor.impact === 'positive' ? 'text-green-600' : 'text-red-600'}
                    `}>
                                            {factor.impact === 'positive' ? '↑ Increases xG' : '↓ Decreases xG'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* xG Interpretation */}
            <div className="p-4 bg-muted/50 border border-border rounded-lg">
                <h4 className="font-medium text-foreground mb-2">What does this xG mean?</h4>
                <div className="text-sm text-muted-foreground space-y-2">
                    {calculation.finalXG < 0.05 && (
                        <p>This is a very difficult chance. Even professional players would struggle to score from this position.</p>
                    )}
                    {calculation.finalXG >= 0.05 && calculation.finalXG < 0.15 && (
                        <p>This is a low-quality chance. Players typically score these about 1 in 10 times.</p>
                    )}
                    {calculation.finalXG >= 0.15 && calculation.finalXG < 0.35 && (
                        <p>This is a decent chance. A good striker would be expected to score this roughly 1 in 4 times.</p>
                    )}
                    {calculation.finalXG >= 0.35 && calculation.finalXG < 0.65 && (
                        <p>This is a high-quality chance. Professional players score these about half the time.</p>
                    )}
                    {calculation.finalXG >= 0.65 && (
                        <p>This is an excellent chance. Players should score these most of the time.</p>
                    )}
                    <p className="mt-2 text-xs">
                        Remember: xG is a probability, not a guarantee. Even high xG shots can be missed, and low xG shots can sometimes go in.
                    </p>
                </div>
            </div>
        </div>
    );
}