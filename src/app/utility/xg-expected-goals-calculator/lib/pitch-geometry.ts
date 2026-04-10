import type { ShotPosition, PitchDimensions } from '../types/xg-types';

// Standard football pitch dimensions (in meters)
export const STANDARD_PITCH: PitchDimensions = {
    width: 68,
    length: 105,
    goalWidth: 7.32,
    goalHeight: 2.44,
    penaltyAreaWidth: 40.32,
    penaltyAreaLength: 16.5,
};

/**
 * Convert percentage-based shot position to actual pitch coordinates
 */
export function positionToCoordinates(
    position: ShotPosition,
    pitch: PitchDimensions = STANDARD_PITCH
): { x: number; y: number } {
    return {
        x: (position.x / 100) * pitch.width,
        y: (position.y / 100) * pitch.length,
    };
}

/**
 * Calculate distance from shot position to center of goal
 */
export function calculateDistanceToGoal(
    position: ShotPosition,
    pitch: PitchDimensions = STANDARD_PITCH
): number {
    const coords = positionToCoordinates(position, pitch);

    // Goal is at y = 0 (bottom of pitch), center at x = width/2
    const goalCenterX = pitch.width / 2;
    const goalCenterY = 0;

    const deltaX = coords.x - goalCenterX;
    const deltaY = coords.y - goalCenterY;

    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}

/**
 * Calculate angle to goal from shot position
 * Returns angle in degrees (0-180, where 0 is directly in front of goal)
 */
export function calculateAngleToGoal(
    position: ShotPosition,
    pitch: PitchDimensions = STANDARD_PITCH
): number {
    const coords = positionToCoordinates(position, pitch);

    // Goal posts positions
    const leftPostX = (pitch.width - pitch.goalWidth) / 2;
    const rightPostX = (pitch.width + pitch.goalWidth) / 2;
    const goalY = 0;

    // Vectors from shot position to each goal post
    const leftPostVector = {
        x: leftPostX - coords.x,
        y: goalY - coords.y,
    };

    const rightPostVector = {
        x: rightPostX - coords.x,
        y: goalY - coords.y,
    };

    // Calculate angle between the two vectors using dot product
    const dotProduct = leftPostVector.x * rightPostVector.x + leftPostVector.y * rightPostVector.y;
    const leftMagnitude = Math.sqrt(leftPostVector.x ** 2 + leftPostVector.y ** 2);
    const rightMagnitude = Math.sqrt(rightPostVector.x ** 2 + rightPostVector.y ** 2);

    const cosAngle = dotProduct / (leftMagnitude * rightMagnitude);
    const angleRadians = Math.acos(Math.max(-1, Math.min(1, cosAngle)));
    const angleDegrees = (angleRadians * 180) / Math.PI;

    return angleDegrees;
}

/**
 * Determine which zone of the pitch the shot is from
 */
export function getPitchZone(position: ShotPosition): string {
    const { x, y } = position;

    // Penalty area
    if (y <= 15.7 && x >= 18.3 && x <= 81.7) { // Approximate penalty area in percentages
        return 'penalty_area';
    }

    // Six-yard box
    if (y <= 5.7 && x >= 36.8 && x <= 63.2) { // Approximate six-yard box
        return 'six_yard_box';
    }

    // Close range (inside penalty area)
    if (y <= 15.7) {
        return 'close_range';
    }

    // Medium range
    if (y <= 30) {
        return 'medium_range';
    }

    // Long range
    return 'long_range';
}

/**
 * Check if shot position is from a wide angle (near touchline)
 */
export function isWideAngle(position: ShotPosition): boolean {
    return position.x < 20 || position.x > 80;
}

/**
 * Check if shot is from central area
 */
export function isCentralPosition(position: ShotPosition): boolean {
    return position.x >= 35 && position.x <= 65;
}