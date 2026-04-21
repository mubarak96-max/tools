import type {
    Shot,
    XGCalculation,
    XGFactor,
    ShotPosition,
    XGModelConfig,
    ShotType,
    AssistType,
    DefensivePressure,
    GameSituation
} from '../types/xg-types';
import {
    calculateDistanceToGoal,
    calculateAngleToGoal,
    getPitchZone
} from './pitch-geometry';
import {
    calculateFactorImpact,
    getShotTypeDescription,
    getAssistTypeDescription,
    getDefensivePressureDescription,
    getGameSituationDescription
} from './shot-factors';

/**
 * Default xG model configuration based on football analytics research
 */
export const DEFAULT_XG_CONFIG: XGModelConfig = {
    maxDistance: 35,          // Beyond 35m, xG approaches minimum
    minXG: 0.01,             // Minimum xG value (1%)
    maxXG: 0.99,
    distanceDecayRate: 0.1,
    angleImportance: 0.3
};

/**
 * Calculate base xG from position
 * Based on distance and angle to goal
 */
export function calculateBaseXG(
    position: ShotPosition,
    config: XGModelConfig = DEFAULT_XG_CONFIG
): { baseXG: number; distance: number; angle: number } {
    const distance = calculateDistanceToGoal(position);
    const angle = calculateAngleToGoal(position);

    // Distance factor: exponential decay
    const distanceFactor = Math.exp(-config.distanceDecayRate * (distance / 10));

    // Angle factor: wider angles are better
    const normalizedAngle = Math.min(angle / 180, 1);
    const angleFactor = Math.pow(normalizedAngle, 0.5);

    // Combine distance and angle with weighted importance
    const combinedFactor = (
        (1 - config.angleImportance) * distanceFactor +
        config.angleImportance * angleFactor
    );

    // Apply logistic function to get probability between minXG and maxXG
    const logisticInput = 4 * (combinedFactor - 0.5);
    const logisticOutput = 1 / (1 + Math.exp(-logisticInput));

    const baseXG = config.minXG + (config.maxXG - config.minXG) * logisticOutput;

    return {
        baseXG: Math.max(config.minXG, Math.min(config.maxXG, baseXG)),
        distance,
        angle
    };
}

/**
 * Calculate complete xG for a shot including all modifiers
 */
export function calculateShotXG(shot: Omit<Shot, 'id' | 'xgValue'>): XGCalculation {
    const { baseXG, distance, angle } = calculateBaseXG(shot.position);

    const factorImpacts = calculateFactorImpact(
        shot.shotType,
        shot.assistType,
        shot.defensivePressure,
        shot.gameSituation
    );

    const modifiedXG = baseXG * factorImpacts.combinedModifier;

    const finalXG = Math.max(
        DEFAULT_XG_CONFIG.minXG,
        Math.min(DEFAULT_XG_CONFIG.maxXG, modifiedXG)
    );

    const factors: XGFactor[] = [
        {
            name: 'Shot Distance',
            value: distance,
            impact: distance < 12 ? 'positive' : distance > 20 ? 'negative' : 'neutral',
            description: `${distance.toFixed(1)}m from goal`
        },
        {
            name: 'Shot Angle',
            value: angle,
            impact: angle > 15 ? 'positive' : angle < 5 ? 'negative' : 'neutral',
            description: `${angle.toFixed(1)}° angle to goal`
        },
        {
            name: 'Shot Type',
            value: factorImpacts.shotTypeImpact,
            impact: factorImpacts.shotTypeImpact > 1 ? 'positive' :
                factorImpacts.shotTypeImpact < 1 ? 'negative' : 'neutral',
            description: getShotTypeDescription(shot.shotType)
        },
        {
            name: 'Assist Quality',
            value: factorImpacts.assistImpact,
            impact: factorImpacts.assistImpact > 1 ? 'positive' :
                factorImpacts.assistImpact < 1 ? 'negative' : 'neutral',
            description: getAssistTypeDescription(shot.assistType)
        },
        {
            name: 'Defensive Pressure',
            value: factorImpacts.pressureImpact,
            impact: factorImpacts.pressureImpact > 1 ? 'positive' :
                factorImpacts.pressureImpact < 1 ? 'negative' : 'neutral',
            description: getDefensivePressureDescription(shot.defensivePressure)
        },
        {
            name: 'Game Situation',
            value: factorImpacts.situationImpact,
            impact: factorImpacts.situationImpact > 1 ? 'positive' :
                factorImpacts.situationImpact < 1 ? 'negative' : 'neutral',
            description: getGameSituationDescription(shot.gameSituation)
        }
    ];

    return {
        baseXG,
        distanceFromGoal: distance,
        angleToGoal: angle,
        shotTypeModifier: factorImpacts.shotTypeImpact,
        assistModifier: factorImpacts.assistImpact,
        pressureModifier: factorImpacts.pressureImpact,
        situationModifier: factorImpacts.situationImpact,
        finalXG,
        factors
    };
}

/**
 * Get xG category for display purposes
 */
export function getXGCategory(xg: number): {
    category: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
    label: string;
    color: string;
} {
    if (xg < 0.05) {
        return { category: 'very_low', label: 'Very Low', color: '#ef4444' };
    } else if (xg < 0.15) {
        return { category: 'low', label: 'Low', color: '#f97316' };
    } else if (xg < 0.35) {
        return { category: 'medium', label: 'Medium', color: '#eab308' };
    } else if (xg < 0.65) {
        return { category: 'high', label: 'High', color: '#22c55e' };
    } else {
        return { category: 'very_high', label: 'Very High', color: '#16a34a' };
    }
}

/**
 * Validate shot data before calculation
 */
export function validateShotData(shot: Partial<Shot>): string[] {
    const errors: string[] = [];

    if (!shot.position) {
        errors.push('Shot position is required');
    } else {
        if (shot.position.x < 0 || shot.position.x > 100) {
            errors.push('Shot x position must be between 0 and 100');
        }
        if (shot.position.y < 0 || shot.position.y > 100) {
            errors.push('Shot y position must be between 0 and 100');
        }
    }

    if (!shot.shotType) {
        errors.push('Shot type is required');
    }

    if (!shot.assistType) {
        errors.push('Assist type is required');
    }

    if (!shot.defensivePressure) {
        errors.push('Defensive pressure is required');
    }

    if (!shot.gameSituation) {
        errors.push('Game situation is required');
    }

    return errors;
}

/**
 * Create a complete shot object with calculated xG
 */
export function createShotWithXG(
    shotData: Omit<Shot, 'id' | 'xgValue'>
): Shot {
    const calculation = calculateShotXG(shotData);

    return {
        ...shotData,
        id: `shot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        xgValue: calculation.finalXG
    };
}