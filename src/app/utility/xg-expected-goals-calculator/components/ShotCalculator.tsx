'use client';

import { useState, useEffect } from 'react';
import type {
    Shot,
    ShotPosition,
    ShotType,
    AssistType,
    DefensivePressure,
    GameSituation,
    XGCalculation
} from '../types/xg-types';
import { calculateShotXG, createShotWithXG } from '../lib/xg-calculation';
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
    const [teamAShots, setTeamAShots] = useState<Shot[]>([]);
    const [teamBShots, setTeamBShots] = useState<Shot[]>([]);

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

    const handleClearComparison = () => {
        setTeamAShots([]);
        setTeamBShots([]);
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

    const handleAddShot = (team: 'A' | 'B') => {
        if (!shotPosition || !calculation) return;

        const shot = createShotWithXG({
            position: shotPosition,
            shotType,
            assistType,
            defensivePressure,
            gameSituation,
            timestamp: Date.now(),
        });

        if (team === 'A') {
            setTeamAShots((current) => [shot, ...current]);
            return;
        }

        setTeamBShots((current) => [shot, ...current]);
    };

    const teamATotal = teamAShots.reduce((sum, shot) => sum + shot.xgValue, 0);
    const teamBTotal = teamBShots.reduce((sum, shot) => sum + shot.xgValue, 0);
    const teamAAverage = teamAShots.length > 0 ? teamATotal / teamAShots.length : 0;
    const teamBAverage = teamBShots.length > 0 ? teamBTotal / teamBShots.length : 0;
    const combinedXG = teamATotal + teamBTotal;

    const compareMessage =
        teamAShots.length === 0 && teamBShots.length === 0
            ? 'Save shots to Team A or Team B to build a match-level xG view.'
            : teamATotal === teamBTotal
                ? 'Both teams are creating chances of similar total quality so far.'
                : teamATotal > teamBTotal
                    ? `Team A is ahead on xG by ${(teamATotal - teamBTotal).toFixed(2)}.`
                    : `Team B is ahead on xG by ${(teamBTotal - teamATotal).toFixed(2)}.`;

    const combinedMessage =
        combinedXG === 0
            ? 'Typical team xG often lands around 1.0 to 2.5 per match. Start adding shots to compare chance quality.'
            : combinedXG < 1.5
                ? 'Low-event match so far. The total chance quality is modest.'
                : combinedXG < 3.5
                    ? 'Normal match volume. This is a realistic combined xG range for many games.'
                    : 'High-event match. Both teams are generating a lot of chance quality.';

    return (
        <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-3">
                <article className="rounded-[1.25rem] border border-border bg-card p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">What xG means</p>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                        xG is the probability that a shot becomes a goal. An xG of 0.30 means the chance would score about 30% of the time.
                    </p>
                </article>
                <article className="rounded-[1.25rem] border border-border bg-card p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">How to read it</p>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                        Single shots tell you chance quality. Adding shots together gives match xG, which is more useful for comparing teams.
                    </p>
                </article>
                <article className="rounded-[1.25rem] border border-border bg-card p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Typical match range</p>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                        Many teams finish a match around 1.0 to 2.5 xG. Higher totals usually mean sustained attacking threat.
                    </p>
                </article>
            </div>

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
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <button
                            onClick={() => handleAddShot('A')}
                            disabled={!calculation}
                            className="rounded-lg border border-border px-4 py-3 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Add current shot to Team A
                        </button>
                        <button
                            onClick={() => handleAddShot('B')}
                            disabled={!calculation}
                            className="rounded-lg border border-border px-4 py-3 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Add current shot to Team B
                        </button>
                    </div>
                </div>
            </div>

            <section className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-semibold">Match xG Comparison</h2>
                        <p className="text-sm text-muted-foreground">
                            Save shots to compare teams and see total xG, average shot quality, and match-level context.
                        </p>
                    </div>
                    <button
                        onClick={handleClearComparison}
                        className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                    >
                        Clear comparison
                    </button>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <article className="rounded-[1.25rem] border border-border bg-card p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Team A</p>
                        <p className="mt-3 text-3xl font-semibold text-foreground">{teamATotal.toFixed(2)}</p>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {teamAShots.length} shots saved · average xG {teamAAverage.toFixed(2)}
                        </p>
                    </article>
                    <article className="rounded-[1.25rem] border border-border bg-card p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Team B</p>
                        <p className="mt-3 text-3xl font-semibold text-foreground">{teamBTotal.toFixed(2)}</p>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {teamBShots.length} shots saved · average xG {teamBAverage.toFixed(2)}
                        </p>
                    </article>
                    <article className="rounded-[1.25rem] border border-border bg-card p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Combined match xG</p>
                        <p className="mt-3 text-3xl font-semibold text-foreground">{combinedXG.toFixed(2)}</p>
                        <p className="mt-2 text-sm text-muted-foreground">{combinedMessage}</p>
                    </article>
                </div>

                <div className="rounded-[1.25rem] border border-border bg-muted/20 p-4">
                    <p className="text-sm font-semibold text-foreground">What the comparison says</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{compareMessage}</p>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                        xG totals are estimates based on this educational model. Provider values can differ, so compare shots within one model rather than across different data sources.
                    </p>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-[1.25rem] border border-border bg-card p-4">
                        <h3 className="text-base font-semibold text-foreground">Team A saved shots</h3>
                        <div className="mt-3 space-y-2">
                            {teamAShots.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No shots saved for Team A yet.</p>
                            ) : (
                                teamAShots.slice(0, 6).map((shot, index) => (
                                    <div key={shot.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
                                        <span className="text-muted-foreground">Shot {teamAShots.length - index}</span>
                                        <span className="font-semibold text-foreground">{shot.xgValue.toFixed(3)} xG</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="rounded-[1.25rem] border border-border bg-card p-4">
                        <h3 className="text-base font-semibold text-foreground">Team B saved shots</h3>
                        <div className="mt-3 space-y-2">
                            {teamBShots.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No shots saved for Team B yet.</p>
                            ) : (
                                teamBShots.slice(0, 6).map((shot, index) => (
                                    <div key={shot.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
                                        <span className="text-muted-foreground">Shot {teamBShots.length - index}</span>
                                        <span className="font-semibold text-foreground">{shot.xgValue.toFixed(3)} xG</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
