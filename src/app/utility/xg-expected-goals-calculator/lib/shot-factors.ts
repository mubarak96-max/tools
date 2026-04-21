import type { ShotType, AssistType, DefensivePressure, GameSituation } from '../types/xg-types';

/**
 * Shot type modifiers based on historical conversion rates
 * These values are derived from football analytics research
 */
export const SHOT_TYPE_MODIFIERS: Record<ShotType, number> = {
    right_foot: 1.0,      // Baseline
    left_foot: 0.95,      // Slightly lower for right-footed players
    header: 0.85,         // Headers generally less accurate
    volley: 0.75,         // Volleys are difficult to control
    penalty: 8.5,         // Penalties have ~85% conversion rate
};

/**
 * Assist type modifiers - how the ball arrived affects shot quality
 */
export const ASSIST_TYPE_MODIFIERS: Record<AssistType, number> = {
    individual: 1.0,      // Baseline - player created the chance
    through_ball: 1.15,   // Good quality chances
    cutback: 1.1,         // Often creates good angles
    cross: 0.9,           // Crosses can be difficult to finish
    corner: 0.7,          // Corners are generally low xG
    free_kick: 0.8,       // Free kick situations
    rebound: 1.2,         // Rebounds often create good chances
};

/**
 * Defensive pressure modifiers
 * Higher pressure reduces shot quality
 */
export const DEFENSIVE_PRESSURE_MODIFIERS: Record<DefensivePressure, number> = {
    1: 1.2,   // No pressure - clear shot
    2: 1.1,   // Light pressure
    3: 1.0,   // Moderate pressure (baseline)
    4: 0.85,  // Heavy pressure
    5: 0.7,   // Very heavy pressure - rushed shot
};

/**
 * Game situation modifiers
 */
export const GAME_SITUATION_MODIFIERS: Record<GameSituation, number> = {
    open_play: 1.0,       // Baseline
    counter_attack: 1.15, // Counter-attacks often create better chances
    set_piece: 0.9,       // Set pieces generally lower conversion
};

/**
 * Get shot type description for UI
 */
export function getShotTypeDescription(shotType: ShotType): string {
    const descriptions: Record<ShotType, string> = {
        right_foot: 'Right-footed shot',
        left_foot: 'Left-footed shot',
        header: 'Header',
        volley: 'Volley',
        penalty: 'Penalty kick',
    };
    return descriptions[shotType];
}

/**
 * Get assist type description for UI
 */
export function getAssistTypeDescription(assistType: AssistType): string {
    const descriptions: Record<AssistType, string> = {
        individual: 'Individual effort',
        through_ball: 'Through ball',
        cutback: 'Cutback/pullback',
        cross: 'Cross',
        corner: 'Corner kick',
        free_kick: 'Free kick',
        rebound: 'Rebound',
    };
    return descriptions[assistType];
}

/**
 * Get defensive pressure description for UI
 */
export function getDefensivePressureDescription(pressure: DefensivePressure): string {
    const descriptions: Record<DefensivePressure, string> = {
        1: 'No pressure - clear shot',
        2: 'Light pressure',
        3: 'Moderate pressure',
        4: 'Heavy pressure',
        5: 'Very heavy pressure',
    };
    return descriptions[pressure];
}

/**
 * Get game situation description for UI
 */
export function getGameSituationDescription(situation: GameSituation): string {
    const descriptions: Record<GameSituation, string> = {
        open_play: 'Open play',
        counter_attack: 'Counter-attack',
        set_piece: 'Set piece',
    };
    return descriptions[situation];
}

/**
 * Calculate the impact of shot factors on xG
 */
export function calculateFactorImpact(
    shotType: ShotType,
    assistType: AssistType,
    defensivePressure: DefensivePressure,
    gameSituation: GameSituation
): {
    shotTypeImpact: number;
    assistImpact: number;
    pressureImpact: number;
    situationImpact: number;
    combinedModifier: number;
} {
    const shotTypeImpact = SHOT_TYPE_MODIFIERS[shotType];
    const assistImpact = ASSIST_TYPE_MODIFIERS[assistType];
    const pressureImpact = DEFENSIVE_PRESSURE_MODIFIERS[defensivePressure];
    const situationImpact = GAME_SITUATION_MODIFIERS[gameSituation];

    const combinedModifier = shotTypeImpact * assistImpact * pressureImpact * situationImpact;

    return {
        shotTypeImpact,
        assistImpact,
        pressureImpact,
        situationImpact,
        combinedModifier,
    };
}