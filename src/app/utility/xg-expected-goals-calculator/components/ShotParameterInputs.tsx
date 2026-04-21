'use client';

import { useState } from 'react';
import type {
    ShotType,
    AssistType,
    DefensivePressure,
    GameSituation
} from '../types/xg-types';
import {
    getShotTypeDescription,
    getAssistTypeDescription,
    getDefensivePressureDescription,
    getGameSituationDescription
} from '../lib/shot-factors';

interface ShotParameterInputsProps {
    shotType: ShotType;
    assistType: AssistType;
    defensivePressure: DefensivePressure;
    gameSituation: GameSituation;
    onShotTypeChange: (type: ShotType) => void;
    onAssistTypeChange: (type: AssistType) => void;
    onDefensivePressureChange: (pressure: DefensivePressure) => void;
    onGameSituationChange: (situation: GameSituation) => void;
    className?: string;
}

const SHOT_TYPES: ShotType[] = ['right_foot', 'left_foot', 'header', 'volley', 'penalty'];
const ASSIST_TYPES: AssistType[] = ['individual', 'through_ball', 'cutback', 'cross', 'corner', 'free_kick', 'rebound'];
const DEFENSIVE_PRESSURES: DefensivePressure[] = [1, 2, 3, 4, 5];
const GAME_SITUATIONS: GameSituation[] = ['open_play', 'counter_attack', 'set_piece'];

export default function ShotParameterInputs({
    shotType,
    assistType,
    defensivePressure,
    gameSituation,
    onShotTypeChange,
    onAssistTypeChange,
    onDefensivePressureChange,
    onGameSituationChange,
    className = ''
}: ShotParameterInputsProps) {
    const [errors, setErrors] = useState<string[]>([]);

    const validateInputs = () => {
        const newErrors: string[] = [];

        if (!shotType) newErrors.push('Shot type is required');
        if (!assistType) newErrors.push('Assist type is required');
        if (!defensivePressure) newErrors.push('Defensive pressure is required');
        if (!gameSituation) newErrors.push('Game situation is required');

        setErrors(newErrors);
        return newErrors.length === 0;
    };

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Shot Type Selection */}
            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    Shot Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {SHOT_TYPES.map((type) => (
                        <button
                            key={type}
                            onClick={() => onShotTypeChange(type)}
                            className={`
                p-3 text-sm rounded-lg border transition-all
                ${shotType === type
                                    ? 'border-primary bg-primary text-primary-foreground'
                                    : 'border-border bg-card hover:border-primary/50 hover:bg-primary/5'
                                }
              `}
                        >
                            <div className="font-medium">
                                {getShotTypeDescription(type)}
                            </div>
                            {type === 'penalty' && (
                                <div className="text-xs opacity-75 mt-1">
                                    ~85% conversion
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Assist Type Selection */}
            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    How did the ball arrive?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {ASSIST_TYPES.map((type) => (
                        <button
                            key={type}
                            onClick={() => onAssistTypeChange(type)}
                            className={`
                p-3 text-sm rounded-lg border transition-all text-left
                ${assistType === type
                                    ? 'border-primary bg-primary text-primary-foreground'
                                    : 'border-border bg-card hover:border-primary/50 hover:bg-primary/5'
                                }
              `}
                        >
                            <div className="font-medium">
                                {getAssistTypeDescription(type)}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Defensive Pressure Slider */}
            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    Defensive Pressure
                </label>
                <div className="space-y-3">
                    <div className="flex items-center space-x-4">
                        <input
                            type="range"
                            min="1"
                            max="5"
                            value={defensivePressure}
                            onChange={(e) => onDefensivePressureChange(Number(e.target.value) as DefensivePressure)}
                            className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                            style={{
                                background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${((defensivePressure - 1) / 4) * 100}%, hsl(var(--muted)) ${((defensivePressure - 1) / 4) * 100}%, hsl(var(--muted)) 100%)`
                            }}
                        />
                        <div className="w-8 text-center font-medium text-primary">
                            {defensivePressure}
                        </div>
                    </div>

                    {/* Pressure indicators */}
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>No pressure</span>
                        <span>Light</span>
                        <span>Moderate</span>
                        <span>Heavy</span>
                        <span>Very heavy</span>
                    </div>

                    <div className="text-sm text-muted-foreground">
                        {getDefensivePressureDescription(defensivePressure)}
                    </div>
                </div>
            </div>

            {/* Game Situation Selection */}
            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    Game Situation
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {GAME_SITUATIONS.map((situation) => (
                        <button
                            key={situation}
                            onClick={() => onGameSituationChange(situation)}
                            className={`
                p-3 text-sm rounded-lg border transition-all
                ${gameSituation === situation
                                    ? 'border-primary bg-primary text-primary-foreground'
                                    : 'border-border bg-card hover:border-primary/50 hover:bg-primary/5'
                                }
              `}
                        >
                            <div className="font-medium">
                                {getGameSituationDescription(situation)}
                            </div>
                            {situation === 'counter_attack' && (
                                <div className="text-xs opacity-75 mt-1">
                                    +15% xG boost
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Quick Presets */}
            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    Quick Presets
                </label>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => {
                            onShotTypeChange('right_foot');
                            onAssistTypeChange('through_ball');
                            onDefensivePressureChange(2);
                            onGameSituationChange('counter_attack');
                        }}
                        className="p-3 text-sm rounded-lg border border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all"
                    >
                        <div className="font-medium">Counter-attack Goal</div>
                        <div className="text-xs text-muted-foreground mt-1">
                            Through ball, light pressure
                        </div>
                    </button>

                    <button
                        onClick={() => {
                            onShotTypeChange('header');
                            onAssistTypeChange('cross');
                            onDefensivePressureChange(4);
                            onGameSituationChange('open_play');
                        }}
                        className="p-3 text-sm rounded-lg border border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all"
                    >
                        <div className="font-medium">Header from Cross</div>
                        <div className="text-xs text-muted-foreground mt-1">
                            Cross, heavy pressure
                        </div>
                    </button>
                </div>
            </div>

            {/* Error Display */}
            {errors.length > 0 && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <div className="text-sm font-medium text-destructive mb-1">
                        Please fix the following errors:
                    </div>
                    <ul className="text-sm text-destructive space-y-1">
                        {errors.map((error, index) => (
                            <li key={index}>• {error}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}