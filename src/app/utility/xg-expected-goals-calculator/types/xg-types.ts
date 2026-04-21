export interface ShotPosition {
    x: number; // 0-100 (percentage of pitch width)
    y: number; // 0-100 (percentage of pitch length)
}

export type ShotType = 'right_foot' | 'left_foot' | 'header' | 'volley' | 'penalty';
export type AssistType = 'cross' | 'through_ball' | 'corner' | 'free_kick' | 'rebound' | 'individual' | 'cutback';
export type DefensivePressure = 1 | 2 | 3 | 4 | 5; // 1 = no pressure, 5 = heavy pressure
export type GameSituation = 'open_play' | 'counter_attack' | 'set_piece';

export interface Shot {
    id: string;
    position: ShotPosition;
    shotType: ShotType;
    assistType: AssistType;
    defensivePressure: DefensivePressure;
    gameSituation: GameSituation;
    timestamp?: number;
    actualGoal?: boolean;
    xgValue: number;
}

export interface XGCalculation {
    baseXG: number;           // Base probability from distance/angle
    distanceFromGoal: number; // Distance in meters
    angleToGoal: number;      // Angle in degrees
    shotTypeModifier: number; // Multiplier for shot type
    assistModifier: number;   // Modifier for assist quality
    pressureModifier: number; // Defensive pressure adjustment
    situationModifier: number; // Game situation adjustment
    finalXG: number;         // Combined xG value (0-1)
    factors: XGFactor[];     // Breakdown of contributing factors
}

export interface XGFactor {
    name: string;
    value: number;
    impact: 'positive' | 'negative' | 'neutral';
    description: string;
}

export interface MatchAnalysis {
    shots: Shot[];
    totalXG: number;
    actualGoals: number;
    xgDifference: number;
    averageXGPerShot: number;
    conversionRate: number;
    shotsByZone: Record<string, Shot[]>;
    shotsByType: Record<ShotType, Shot[]>;
}

export interface PitchDimensions {
    width: number;   // Standard: 68m
    length: number;  // Standard: 105m
    goalWidth: number; // Standard: 7.32m
    goalHeight: number; // Standard: 2.44m
    penaltyAreaWidth: number; // Standard: 40.32m
    penaltyAreaLength: number; // Standard: 16.5m
}

export interface XGModelConfig {
    maxDistance: number;      // Maximum meaningful distance for xG
    minXG: number;           // Minimum xG value (avoid 0)
    maxXG: number;           // Maximum xG value (avoid 1)
    distanceDecayRate: number; // Rate of xG decay with distance
    angleImportance: number;   // Weight of angle in calculation
}