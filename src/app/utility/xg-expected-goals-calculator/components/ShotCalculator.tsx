'use client';

import { useState, useEffect } from 'react';
import type {
    ShotPosition,
    ShotType,
    AssistType,
    DefensivePressure,
    GameSituation,
    XGCalculation
} from '../types/xg-types';
import { calculateShotXG } from '../lib/xg-calculation';
import PitchVisualization from './PitchVisualization';
import ShotParameterInputs from './ShotParameterInputs';
import XGResultsDisplay from './XGResultsDisplay';

export default function ShotCalculator() {
    const [shotPosition, setShotPosition] = useState<ShotPosition | undefined>();
    const [shotType, setShotType] = useState<ShotType>('right_foot');
    const [assistType, setAssistType] = useState<AssistType>('individual');
    const [defensivePressure, setDefensivePressure] = useState<DefensivePressure>(3);
    const [gameSituation, setGameSituation] = useState<GameSituation>('open_play');
    const [calculation, setCalculation] = useState<XGCalculation | null>(null);
    const [showHeatmap, setShowHeatmap] = useState(false);

    // Calculate xG whenever parameters change
    useEffect(() => {
        if (!shotPosition) {
            setCalculation(null);
            return;
        }

        const shotData = {
            position: shotPosition,
            shotType,
            assistType,
            defensivePressure,
            gameSituation,
            timestamp: Date.now()
        };

        const newCalculation = calculateShotXG(shotData);
        setCalculation(newCalculation);
    }, [shotPosition, shotType, assistType, defensivePressure, gameSituation]);

    const handleReset = () => {
        setShotPosition(undefined);
        setCalculation(null);
        setShotType('right_foot');
        setAssistType('individual');
        setDefensivePressure(3);
        setGameSituation('open_play');
    };

    const handleRandomShot = () => {
        // Generate a random shot position (more likely in dangerous areas)
        const x = Math.random() * 60 + 20; // 20-80% width (avoid extreme sides)
        const y = Math.random() * 30; // 0-30% length (attacking third)

        setShotPosition({ x, y });

        // Randomize other parameters
        const shotTypes: ShotType[] = ['right_foot', 'left_foot', 'header', 'volley'];
        const assistTypes: AssistType[] = ['individual', 'through_ball', 'cross', 'cutback', 'rebound'];
        const pressures: DefensivePressure[] = [1, 2, 3, 4, 5];
        const situations: GameSituation[] = ['open_play', 'counter_attack', 'set_piece'];

        setShotType(shotTypes[Math.floor(Math.random() * shotTypes.length)]);
        setAssistType(assistTypes[Math.floor(Math.random() * assistTypes.length)]);
        setDefensivePressure(pressures[Math.floor(Math.random() * pressures.length)]);
        setGameSituation(situations[Math.floor(Math.random() * situations.length)]);
    };

    return (
        <div className="space-y-8">
            {/* Controls */}
            <div className="flex flex-wrap gap-2 justify-center">
                <button
                    onClick={handleReset}
                    className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
                >
                    Reset
                </button>
                <button
                    onClick={handleRandomShot}
                    className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
                >
                    Random Shot
                </button>
                <button
                    onClick={() => setShowHeatmap(!showHeatmap)}
                    className={`px-4 py-2 text-sm border rounded-lg transition-colors ${showHeatmap
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border hover:bg-muted'
                        }`}
                >
                    {showHeatmap ? 'Hide' : 'Show'} xG Heatmap
                </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Left Column: Pitch and Parameters */}
                <div className="space-y-6">
                    {/* Pitch Visualization */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Shot Position</h2>
                        <PitchVisualization
                            shotPosition={shotPosition}
                            onShotPositionChange={setShotPosition}
                            showXGHeatmap={showHeatmap}
                            className="max-w-md mx-auto"
                        />
                    </div>

                    {/* Shot Parameters */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Shot Parameters</h2>
                        <ShotParameterInputs
                            shotType={shotType}
                            assistType={assistType}
                            defensivePressure={defensivePressure}
                            gameSituation={gameSituation}
                            onShotTypeChange={setShotType}
                            onAssistTypeChange={setAssistType}
                            onDefensivePressureChange={setDefensivePressure}
                            onGameSituationChange={setGameSituation}
                        />
                    </div>
                </div>

                {/* Right Column: Results */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">xG Calculation</h2>
                    <XGResultsDisplay calculation={calculation} />
                </div>
            </div>
        </div>
    );
}