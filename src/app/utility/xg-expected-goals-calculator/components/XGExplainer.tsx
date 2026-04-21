'use client';

import { useState } from 'react';
import PitchVisualization from './PitchVisualization';
import type { ShotPosition } from '../types/xg-types';
import { calculateShotXG } from '../lib/xg-calculation';

const EXAMPLE_SHOTS = [
    {
        id: 'penalty',
        name: 'Penalty Kick',
        position: { x: 50, y: 10.5 },
        shotType: 'right_foot' as const,
        assistType: 'individual' as const,
        defensivePressure: 1 as const,
        gameSituation: 'set_piece' as const,
        description: 'Standard penalty kick from 12 yards'
    },
    {
        id: 'tap_in',
        name: 'Tap-in',
        position: { x: 52, y: 4 },
        shotType: 'right_foot' as const,
        assistType: 'cutback' as const,
        defensivePressure: 2 as const,
        gameSituation: 'open_play' as const,
        description: 'Close-range tap-in from cutback'
    },
    {
        id: 'header',
        name: 'Header from Cross',
        position: { x: 48, y: 8 },
        shotType: 'header' as const,
        assistType: 'cross' as const,
        defensivePressure: 4 as const,
        gameSituation: 'open_play' as const,
        description: 'Header from cross under pressure'
    },
    {
        id: 'long_range',
        name: 'Long-range Shot',
        position: { x: 50, y: 35 },
        shotType: 'right_foot' as const,
        assistType: 'individual' as const,
        defensivePressure: 3 as const,
        gameSituation: 'open_play' as const,
        description: 'Shot from outside the penalty area'
    }
];

export default function XGExplainer() {
    const [selectedExample, setSelectedExample] = useState(EXAMPLE_SHOTS[0]);
    const [activeTab, setActiveTab] = useState<'examples' | 'methodology' | 'limitations'>('examples');

    const calculation = calculateShotXG({
        position: selectedExample.position,
        shotType: selectedExample.shotType,
        assistType: selectedExample.assistType,
        defensivePressure: selectedExample.defensivePressure,
        gameSituation: selectedExample.gameSituation,
        timestamp: Date.now()
    });

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Understanding Expected Goals (xG)</h2>
                <p className="text-muted-foreground max-w-3xl mx-auto">
                    Learn how xG works through interactive examples and understand the methodology behind
                    football's most important advanced statistic.
                </p>
            </div>

            {/* Tab Navigation */}
            <div className="flex justify-center">
                <div className="flex border border-border rounded-lg p-1 bg-muted/50">
                    {[
                        { id: 'examples', label: 'Interactive Examples' },
                        { id: 'methodology', label: 'Methodology' },
                        { id: 'limitations', label: 'Limitations' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab.id
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'examples' && (
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Example Selection */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold">Example Scenarios</h3>

                        <div className="space-y-3">
                            {EXAMPLE_SHOTS.map((shot) => {
                                const shotCalc = calculateShotXG({
                                    position: shot.position,
                                    shotType: shot.shotType,
                                    assistType: shot.assistType,
                                    defensivePressure: shot.defensivePressure,
                                    gameSituation: shot.gameSituation,
                                    timestamp: Date.now()
                                });

                                return (
                                    <button
                                        key={shot.id}
                                        onClick={() => setSelectedExample(shot)}
                                        className={`w-full p-4 text-left border rounded-lg transition-all ${selectedExample.id === shot.id
                                                ? 'border-primary bg-primary/5'
                                                : 'border-border hover:border-primary/50'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-medium">{shot.name}</h4>
                                            <span className="text-lg font-bold text-primary">
                                                {shotCalc.finalXG.toFixed(3)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{shot.description}</p>
                                        <div className="text-xs text-muted-foreground mt-2">
                                            {(shotCalc.finalXG * 100).toFixed(1)}% chance of scoring
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Selected Example Details */}
                        <div className="p-4 bg-muted/50 rounded-lg">
                            <h4 className="font-medium mb-3">Current Example: {selectedExample.name}</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Distance to goal:</span>
                                    <span>{calculation.distanceFromGoal.toFixed(1)}m</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Angle to goal:</span>
                                    <span>{calculation.angleToGoal.toFixed(1)}°</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Base xG:</span>
                                    <span>{calculation.baseXG.toFixed(3)}</span>
                                </div>
                                <div className="flex justify-between font-medium">
                                    <span>Final xG:</span>
                                    <span className="text-primary">{calculation.finalXG.toFixed(3)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pitch Visualization */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Pitch Position</h3>
                        <PitchVisualization
                            shotPosition={selectedExample.position}
                            onShotPositionChange={() => { }} // Read-only for examples
                            showXGHeatmap={false}
                            className="max-w-md mx-auto"
                        />
                        <div className="text-center text-sm text-muted-foreground">
                            Showing position for: {selectedExample.name}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'methodology' && (
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Core Calculation</h3>
                            <div className="space-y-4">
                                <div className="p-4 border border-border rounded-lg">
                                    <h4 className="font-medium mb-2">1. Base xG from Position</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Uses distance and angle to goal with logistic regression model based on
                                        historical shot conversion data.
                                    </p>
                                </div>

                                <div className="p-4 border border-border rounded-lg">
                                    <h4 className="font-medium mb-2">2. Shot Type Modifiers</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• Right foot: 1.0× (baseline)</li>
                                        <li>• Left foot: 0.95×</li>
                                        <li>• Header: 0.85×</li>
                                        <li>• Volley: 0.75×</li>
                                        <li>• Penalty: 8.5×</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4">Situational Factors</h3>
                            <div className="space-y-4">
                                <div className="p-4 border border-border rounded-lg">
                                    <h4 className="font-medium mb-2">Assist Quality</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• Through ball: +15%</li>
                                        <li>• Cutback: +10%</li>
                                        <li>• Individual: Baseline</li>
                                        <li>• Cross: -10%</li>
                                        <li>• Corner: -30%</li>
                                    </ul>
                                </div>

                                <div className="p-4 border border-border rounded-lg">
                                    <h4 className="font-medium mb-2">Defensive Pressure</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• No pressure: +20%</li>
                                        <li>• Light pressure: +10%</li>
                                        <li>• Moderate: Baseline</li>
                                        <li>• Heavy: -15%</li>
                                        <li>• Very heavy: -30%</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                        <h3 className="font-semibold text-blue-900 mb-3">Mathematical Formula</h3>
                        <div className="text-sm text-blue-800 space-y-2">
                            <p><strong>Final xG = Base xG × Shot Type × Assist Quality × Pressure × Situation</strong></p>
                            <p>Where Base xG uses exponential distance decay and angle normalization:</p>
                            <p className="font-mono text-xs bg-blue-100 p-2 rounded">
                                distance_factor = exp(-0.15 × distance/10)<br />
                                angle_factor = (angle/180)^0.5<br />
                                base_xG = logistic(0.7 × distance_factor + 0.3 × angle_factor)
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'limitations' && (
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">What xG Doesn't Include</h3>
                            <ul className="space-y-3">
                                {[
                                    'Goalkeeper positioning and quality',
                                    'Weather conditions (wind, rain)',
                                    'Player skill and finishing ability',
                                    'Fatigue and match context',
                                    'Specific defensive formations',
                                    'Ball trajectory and spin'
                                ].map((item, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <span className="text-red-500 mt-1">×</span>
                                        <span className="text-sm">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Proper xG Interpretation</h3>
                            <ul className="space-y-3">
                                {[
                                    'Use large sample sizes (10+ games)',
                                    'Compare xG to actual goals over time',
                                    'Consider it alongside other metrics',
                                    'Understand it shows shot quality, not outcome',
                                    'Account for player and team context',
                                    'Remember it\'s probability, not certainty'
                                ].map((item, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <span className="text-green-500 mt-1">✓</span>
                                        <span className="text-sm">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h4 className="font-semibold text-yellow-900 mb-3">Important Notes</h4>
                        <div className="text-sm text-yellow-800 space-y-2">
                            <p>
                                <strong>Sample Size Matters:</strong> xG is most meaningful over larger sample sizes.
                                A single match or small number of shots can show significant variance from expected values.
                            </p>
                            <p>
                                <strong>Context is Key:</strong> While xG provides valuable insights into shot quality,
                                it should be used alongside other metrics and contextual analysis for complete understanding.
                            </p>
                            <p>
                                <strong>Model Limitations:</strong> This calculator uses simplified models for educational purposes.
                                Professional xG models may include additional factors and more sophisticated algorithms.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}