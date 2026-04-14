import { describe, it, expect } from "vitest"
import * as fc from "fast-check"
import { FORMATIONS, FORMATION_IDS } from "./formations"
import type { FormationId } from "../types"

/**
 * Property tests for formation data integrity.
 * Validates: Requirements 1.2, 1.3, 1.4, 1.5
 */

describe("Formation data integrity", () => {
    /**
     * Property 1: Formation always has exactly 11 slots
     * Validates: Requirement 1.2
     */
    it("every formation has exactly 11 slots", () => {
        fc.assert(
            fc.property(fc.constantFrom(...FORMATION_IDS), (formationId: FormationId) => {
                return FORMATIONS[formationId].slots.length === 11
            })
        )
    })

    /**
     * Property 2: Every formation has exactly one goalkeeper
     * Validates: Requirement 1.3
     */
    it("every formation has exactly one GK slot", () => {
        fc.assert(
            fc.property(fc.constantFrom(...FORMATION_IDS), (formationId: FormationId) => {
                const gkSlots = FORMATIONS[formationId].slots.filter(s => s.label === "GK")
                return gkSlots.length === 1
            })
        )
    })

    /**
     * Property 3: All slot ids are unique within a formation
     * Validates: Requirement 1.4
     */
    it("all slot ids are unique within each formation", () => {
        fc.assert(
            fc.property(fc.constantFrom(...FORMATION_IDS), (formationId: FormationId) => {
                const ids = FORMATIONS[formationId].slots.map(s => s.id)
                return new Set(ids).size === ids.length
            })
        )
    })

    /**
     * Property 4: Slot coordinates are within valid bounds
     * Validates: Requirement 1.5
     */
    it("all slot coordinates are within [5, 95]", () => {
        fc.assert(
            fc.property(fc.constantFrom(...FORMATION_IDS), (formationId: FormationId) => {
                return FORMATIONS[formationId].slots.every(
                    s => s.x >= 5 && s.x <= 95 && s.y >= 5 && s.y <= 95
                )
            })
        )
    })

    // Sanity checks: all 12 formations are present
    it("FORMATION_IDS contains all 12 formations", () => {
        expect(FORMATION_IDS).toHaveLength(12)
        const expected = [
            "4-3-3", "4-4-2", "4-2-3-1", "3-5-2", "5-3-2",
            "4-1-4-1", "3-4-3", "5-4-1", "4-4-1-1", "3-4-2-1",
            "4-5-1", "4-2-2-2",
        ]
        for (const id of expected) {
            expect(FORMATION_IDS).toContain(id)
        }
    })
})
