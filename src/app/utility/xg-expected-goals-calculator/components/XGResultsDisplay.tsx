'use client';

import type { XGCalculation } from '../types/xg-types';
import { getXGCategory } from '../lib/xg-calculation';

interface XGResultsDisplayProps {
    calculation: XGCalculation | null;
    className?: string;
}

function getInterpretation(xg: number) {
    if (xg < 0.05) {
        return {
            title: 'Very low-probability shot',
            description: 'This is a speculative effort. Goals from here are memorable because they do not happen often.',
        };
    }

    if (xg < 0.2) {
        return {
            title: 'Low-quality chance',
            description: 'This is a half-chance rather than a clear opening. Teams need volume to score regularly from shots like this.',
        };
    }

    if (xg < 0.4) {
        return {
            title: 'Good chance',
            description: 'This is a meaningful scoring opportunity. Missing it will usually hurt the attack in xG terms.',
        };
    }

    if (xg < 0.6) {
        return {
            title: 'High-quality chance',
            description: 'This is the sort of opportunity analysts expect strong attackers to convert regularly.',
        };
    }

    return {
        title: 'Big chance',
        description: 'This is an excellent opening. When players miss these, it usually becomes a major talking point in post-match analysis.',
    };
}

export default function XGResultsDisplay({ calculation, className = '' }: XGResultsDisplayProps) {
    if (!calculation) {
        return (
            <div className={`rounded-lg border border-border bg-card p-6 ${className}`}>
                <div className="text-center text-muted-foreground">
                    <div className="text-4xl mb-2">0.00</div>
                    <p className="text-sm leading-6">
                        Click the pitch to place a shot. xG is the probability that the shot becomes a goal.
                    </p>
                    <p className="mt-2 text-xs leading-5">
                        Example: 0.30 xG means the chance would score about 30% of the time.
                    </p>
                </div>
            </div>
        );
    }

    const xgCategory = getXGCategory(calculation.finalXG);
    const percentage = calculation.finalXG * 100;
    const interpretation = getInterpretation(calculation.finalXG);

    return (
        <div className={`space-y-6 ${className}`}>
            <div className="rounded-lg border border-border bg-card p-6">
                <div className="text-center">
                    <div className="text-sm font-medium text-muted-foreground mb-2">
                        Expected Goals (xG)
                    </div>
                    <div
                        className="text-6xl font-bold mb-2"
                        style={{ color: xgCategory.color }}
                    >
                        {calculation.finalXG.toFixed(3)}
                    </div>
                    <div className="text-lg text-muted-foreground mb-4">
                        {percentage.toFixed(1)}% chance of scoring
                    </div>
                    <div
                        className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
                        style={{
                            backgroundColor: `${xgCategory.color}20`,
                            color: xgCategory.color,
                        }}
                    >
                        {interpretation.title}
                    </div>
                </div>

                <div className="mt-6">
                    <div className="relative h-3 rounded-full bg-[linear-gradient(90deg,#ef4444_0%,#f97316_20%,#eab308_40%,#22c55e_70%,#16a34a_100%)]">
                        <div
                            className="absolute top-1/2 h-5 w-5 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-background bg-foreground shadow"
                            style={{ left: `${Math.min(100, Math.max(1, percentage))}%` }}
                        />
                    </div>
                    <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
                        <span>0.05</span>
                        <span>0.20</span>
                        <span>0.40</span>
                        <span>0.60+</span>
                    </div>
                </div>

                <div className="mt-5 rounded-lg border border-border bg-muted/20 p-4">

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {interpretation.description}
                    </p>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                        xG is probability, not certainty. Even a 0.70 chance can be missed, and a 0.03 shot can still go in.
                    </p>
                </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="text-lg font-semibold mb-4">Calculation Breakdown</h3>

                <div className="space-y-4">
                    <div className="flex justify-between items-center rounded-lg bg-muted/50 p-3">
                        <div>
                            <div className="font-medium">Base xG from position</div>
                            <div className="text-sm text-muted-foreground">
                                {calculation.distanceFromGoal.toFixed(1)}m from goal, {calculation.angleToGoal.toFixed(1)} degrees angle
                            </div>
                        </div>
                        <div className="text-lg font-semibold">
                            {calculation.baseXG.toFixed(3)}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="text-sm font-medium text-muted-foreground">Modifiers applied</div>

                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex justify-between items-center rounded bg-muted/30 p-2">
                                <span className="text-sm">Shot type</span>
                                <span className={`text-sm font-medium ${calculation.shotTypeModifier > 1 ? 'text-green-600' :
                                    calculation.shotTypeModifier < 1 ? 'text-red-600' : 'text-muted-foreground'
                                    }`}>
                                    x{calculation.shotTypeModifier.toFixed(2)}
                                </span>
                            </div>

                            <div className="flex justify-between items-center rounded bg-muted/30 p-2">
                                <span className="text-sm">Assist quality</span>
                                <span className={`text-sm font-medium ${calculation.assistModifier > 1 ? 'text-green-600' :
                                    calculation.assistModifier < 1 ? 'text-red-600' : 'text-muted-foreground'
                                    }`}>
                                    x{calculation.assistModifier.toFixed(2)}
                                </span>
                            </div>

                            <div className="flex justify-between items-center rounded bg-muted/30 p-2">
                                <span className="text-sm">Pressure</span>
                                <span className={`text-sm font-medium ${calculation.pressureModifier > 1 ? 'text-green-600' :
                                    calculation.pressureModifier < 1 ? 'text-red-600' : 'text-muted-foreground'
                                    }`}>
                                    x{calculation.pressureModifier.toFixed(2)}
                                </span>
                            </div>

                            <div className="flex justify-between items-center rounded bg-muted/30 p-2">
                                <span className="text-sm">Situation</span>
                                <span className={`text-sm font-medium ${calculation.situationModifier > 1 ? 'text-green-600' :
                                    calculation.situationModifier < 1 ? 'text-red-600' : 'text-muted-foreground'
                                    }`}>
                                    x{calculation.situationModifier.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="text-lg font-semibold mb-4">Why this number moved</h3>

                <div className="space-y-3">
                    {calculation.factors.map((factor, index) => (
                        <div key={index} className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">{factor.name}</span>
                                    <span className={`h-2 w-2 rounded-full ${factor.impact === 'positive' ? 'bg-green-500' :
                                        factor.impact === 'negative' ? 'bg-red-500' : 'bg-gray-400'
                                        }`} />
                                </div>
                                <div className="text-sm text-muted-foreground mt-1">
                                    {factor.description}
                                </div>
                            </div>
                            <div className={`text-sm font-medium ${factor.impact === 'positive' ? 'text-green-600' :
                                factor.impact === 'negative' ? 'text-red-600' : 'text-muted-foreground'
                                }`}>
                                {factor.impact === 'positive' ? 'Up' : factor.impact === 'negative' ? 'Down' : 'Flat'}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="rounded-lg border border-sky-200 bg-sky-50 p-4">
                <h4 className="font-medium text-sky-900 mb-2">Quick xG guide</h4>
                <div className="text-sm text-sky-800 space-y-1">
                    <p>- 0.10 xG means the shot scores about 1 in 10 times.</p>
                    <p>- 0.30 xG is a strong chance, not a guaranteed goal.</p>
                    <p>- Match xG works better than one-shot xG when comparing teams.</p>
                    <p>- Different data providers can give slightly different xG for the same chance.</p>
                </div>
            </div>
        </div>
    );
}
