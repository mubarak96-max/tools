/**
 * Drag-and-drop utility functions for player positioning
 */

/**
 * Converts screen coordinates to percentage position relative to pitch dimensions
 * @param dropX - X coordinate in pixels relative to pitch
 * @param dropY - Y coordinate in pixels relative to pitch
 * @param pitchWidth - Width of pitch in pixels
 * @param pitchHeight - Height of pitch in pixels
 * @returns Object with x and y as percentages (0-100)
 */
export function calculatePercentagePosition(
    dropX: number,
    dropY: number,
    pitchWidth: number,
    pitchHeight: number
): { x: number; y: number } {
    const percentX = (dropX / pitchWidth) * 100
    const percentY = (dropY / pitchHeight) * 100

    return { x: percentX, y: percentY }
}

/**
 * Clamps position coordinates to valid bounds [5, 95]
 * @param x - X coordinate as percentage
 * @param y - Y coordinate as percentage
 * @returns Object with clamped x and y values
 */
export function clampPosition(x: number, y: number): { x: number; y: number } {
    const clampedX = Math.max(5, Math.min(95, x))
    const clampedY = Math.max(5, Math.min(95, y))

    return { x: clampedX, y: clampedY }
}

/**
 * Validates if drop coordinates are within pitch bounds
 * @param x - X coordinate in pixels
 * @param y - Y coordinate in pixels
 * @param pitchWidth - Width of pitch in pixels
 * @param pitchHeight - Height of pitch in pixels
 * @returns true if within bounds, false otherwise
 */
export function isWithinPitchBounds(
    x: number,
    y: number,
    pitchWidth: number,
    pitchHeight: number
): boolean {
    return x >= 0 && x <= pitchWidth && y >= 0 && y <= pitchHeight
}
