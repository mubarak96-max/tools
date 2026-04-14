/**
 * Field pattern generation utilities for SVG patterns
 */

import type { FieldStyle } from "../types"
import type { JSX } from "react"

/**
 * Generates SVG pattern elements for the specified field style
 * @param style - The field style pattern to generate
 * @returns JSX.Element for the pattern or null for "none"
 */
export function generateFieldPattern(style: FieldStyle): JSX.Element | null {
    const lightGreen = "#1e8f47"
    const darkGreen = "#1a7a3c"

    switch (style) {
        case "none":
            return null

        case "horizontal":
            return (
                <>
                    <rect x="0" y="0" width="100" height="10" fill={darkGreen} />
                    <rect x="0" y="10" width="100" height="10" fill={lightGreen} />
                </>
            )

        case "vertical":
            return (
                <>
                    <rect x="0" y="0" width="10" height="100" fill={darkGreen} />
                    <rect x="10" y="0" width="10" height="100" fill={lightGreen} />
                </>
            )

        case "checkered":
            return (
                <>
                    <rect x="0" y="0" width="10" height="10" fill={darkGreen} />
                    <rect x="10" y="0" width="10" height="10" fill={lightGreen} />
                    <rect x="0" y="10" width="10" height="10" fill={lightGreen} />
                    <rect x="10" y="10" width="10" height="10" fill={darkGreen} />
                </>
            )

        case "diagonal":
            return (
                <>
                    <path d="M 0 0 L 20 0 L 0 20 Z" fill={darkGreen} />
                    <path d="M 20 0 L 20 20 L 0 20 Z" fill={lightGreen} />
                </>
            )

        case "rings":
            return (
                <>
                    <circle cx="50" cy="50" r="15" fill="none" stroke={darkGreen} strokeWidth="2" />
                    <circle cx="50" cy="50" r="30" fill="none" stroke={lightGreen} strokeWidth="2" />
                    <circle cx="50" cy="50" r="45" fill="none" stroke={darkGreen} strokeWidth="2" />
                    <rect x="0" y="0" width="100" height="100" fill={lightGreen} opacity="0.3" />
                </>
            )

        default:
            return null
    }
}
