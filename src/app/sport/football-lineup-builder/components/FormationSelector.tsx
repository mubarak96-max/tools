"use client"

import type { FormationId } from "../types"
import { FORMATION_IDS } from "../data/formations"

interface FormationSelectorProps {
    currentFormation: FormationId
    onChange: (id: FormationId) => void
}

export default function FormationSelector({
    currentFormation,
    onChange,
}: FormationSelectorProps) {
    return (
        <div className="space-y-2">
            <label htmlFor="formation-select" className="block text-sm font-medium">
                Formation
            </label>
            <select
                id="formation-select"
                value={currentFormation}
                onChange={(e) => onChange(e.target.value as FormationId)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
                {FORMATION_IDS.map((id) => (
                    <option key={id} value={id}>
                        {id}
                    </option>
                ))}
            </select>
            <p className="text-xs text-amber-600">
                ⚠️ Changing formation will clear all player data
            </p>
        </div>
    )
}
