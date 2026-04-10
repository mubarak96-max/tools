'use client';

import type { XGCalculation } from '../types/xg-types';
import { getXGCategory } from '../lib/xg-calculation';

interface XGResultsDisplayProps {
    calculation: XGCalculation | null;
    className?: string;
}

export default function XGResultsDisplay({ calculation, className = '' }: XGResultsDisplayProps) {
    if (!calculation) {
        return (
            <div className={`p-6 border border-border rounded-lg bg-card ${className}`}>
                <div className="text-center text-muted-foreground">
                    <div className="text-4xl mb-2">⚽</div>
                    <p>Place a shot on the pitch and select parameters to see the Expected Goals calculation</p>
                </div>
            </div>
        );
    }

    const xgCategory = getXGCategory(calculation.finalXG);
    const percentage = (calculation.finalXG * 100).toFixed(1);

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Main xG Display */}
            <div className="p-6 border border-border rounded-lg bg-card">
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
                        {percentage}% chance of scoring
                    </div>
                    <div
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                        style={{
                            backgroundColor: `${xgCategory.color}20`,
                            color: xgCategory.color
                        }}
                    >
                        {xgCategory.label} Quality Chance
                    </div>
                </div>
            </div>

            {/* Calculation Breakdown */}
            <div className="p-6 border border-border rounded-lg bg-card">
                <h3 className="text-lg font-semibold mb-4">Calculation Breakdown</h3>

                <div className="space-y-4">
                    {/* Base xG from Position */}
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <div>
                            <div className="font-medium">Base xG (Position)</div>
                            <div className="text-sm text-muted-foreground">
                                {calculation.distanceFromGoal.toFixed(1)}m distance, {calculation.angleToGoal.toFixed(1)}° angle
                            </div>
                        </div>
                        <div className="text-lg font-semibold">
                            {calculation.baseXG.toFixed(3)}
                        </div>
                    </div>

                    {/* Modifiers */}
                    <div className="space-y-2">
                        <div className="text-sm font-medium text-muted-foreground">Modifiers Applied:</div>

                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                                <span className="text-sm">Shot Type</span>
                                <span className={`text-sm font-medium ${calculation.shotTypeModifier > 1 ? 'text-green-600' :
                                        calculation.shotTypeModifier < 1 ? 'text-red-600' : 'text-muted-foreground'
                                    }`}>
                                    ×{calculation.shotTypeModifier.toFixed(2)}
                                </span>
                            </div>

                            <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                                <span className="text-sm">Assist Quality</span>
                                <span className={`text-sm font-medium ${calculation.assistModifier > 1 ? 'text-green-600' :
                                        calculation.assistModifier < 1 ? 'text-red-600' : 'text-muted-foreground'
                                    }`}>
                                    ×{calculation.assistModifier.toFixed(2)}
                                </span>
                            </div>

                            <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                                <span className="text-sm">Pressure</span>
                                <span className={`text-sm font-medium ${calculation.pressureModifier > 1 ? 'text-green-600' :
                                        calculation.pressureModifier < 1 ? 'text-red-600' : 'text-muted-foreground'
                                    }`}>
                                    ×{calculation.pressureModifier.toFixed(2)}
                                </span>
                            </div>

                            <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                                <span className="text-sm">Situation</span>
                                <span className={`text-sm font-medium ${calculation.situationModifier > 1 ? 'text-green-600' :
                                        calculation.situationModifier < 1 ? 'text-red-600' : 'text-muted-foreground'
                                    }`}>
                                    ×{calculation.situationModifier.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Factor Analysis */}
            <div className="p-6 border border-border rounded-lg bg-card">
                <h3 className="text-lg font-semibold mb-4">Factor Analysis</h3>

                <div className="space-y-3">
                    {calculation.factors.map((factor, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">{factor.name}</span>
                                    <span className={`w-2 h-2 rounded-full ${factor.impact === 'positive' ? 'bg-green-500' :
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
                                {factor.impact === 'positive' ? '↗' : factor.impact === 'negative' ? '↘' : '→'}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* xG Context */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Understanding xG</h4>
                <div className="text-sm text-blue-800 space-y-1">
                    <p>• xG values range from 0.01 (1%) to 0.99 (99%)</p>
                    <p>• An xG of 0.1 means this shot scores 1 in 10 times on average</p>
                    <p>• Professional players typically convert 10-15% of their total xG</p>
                    <p>• Penalties have an xG of ~0.85 (85% conversion rate)</p>
                </div>
            </div>
        </div>
    );
}