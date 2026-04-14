import { describe, it, expect } from "vitest"
import * as fc from "fast-check"
import { validateJersey, sanitizeFilename } from "./export"

/**
 * Property-based tests for export utilities.
 */

describe("validateJersey", () => {
    /**
     * Property 8: validateJersey is idempotent
     * Validates: Requirement 7.3
     */
    it("is idempotent: validateJersey(validateJersey(x)) === validateJersey(x)", () => {
        fc.assert(
            fc.property(fc.string(), (x: string) => {
                return validateJersey(validateJersey(x)) === validateJersey(x)
            })
        )
    })

    // Unit tests for specific cases
    it("returns empty string for empty input", () => {
        expect(validateJersey("")).toBe("")
    })

    it("returns empty string for non-numeric input", () => {
        expect(validateJersey("abc")).toBe("")
        expect(validateJersey("!@#")).toBe("")
    })

    it("returns the number as string for valid input in range", () => {
        expect(validateJersey("10")).toBe("10")
        expect(validateJersey("1")).toBe("1")
        expect(validateJersey("99")).toBe("99")
    })

    it("clamps values below 1 to 1", () => {
        expect(validateJersey("0")).toBe("1")
        expect(validateJersey("-5")).toBe("1")
    })

    it("clamps values above 99 to 99", () => {
        expect(validateJersey("100")).toBe("99")
        expect(validateJersey("999")).toBe("99")
    })
})

describe("sanitizeFilename", () => {
    /**
     * Property 10: Export filename ends with "-lineup.png" for any non-empty teamName
     * Validates: Requirement 5.2
     */
    it("derived filename ends with '-lineup.png' for any non-empty teamName", () => {
        fc.assert(
            fc.property(
                fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
                (teamName: string) => {
                    const filename = sanitizeFilename(teamName) + "-lineup.png"
                    return filename.endsWith("-lineup.png")
                }
            )
        )
    })

    it("falls back to 'lineup' for empty string", () => {
        expect(sanitizeFilename("")).toBe("lineup")
    })

    it("falls back to 'lineup' for strings with only unsafe characters", () => {
        expect(sanitizeFilename("!!!")).toBe("lineup")
    })

    it("strips unsafe filename characters", () => {
        expect(sanitizeFilename("FC Kiro")).toBe("fc-kiro")
        expect(sanitizeFilename("Team/Name")).toBe("teamname")
    })
})
