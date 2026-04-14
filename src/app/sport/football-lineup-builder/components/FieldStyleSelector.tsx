"use client"

import type { FieldStyle } from "../types"
import { generateFieldPattern } from "../utils/patternUtils"

interface FieldStyleSelectorProps {
    currentStyle: FieldStyle
    onChange: (style: FieldStyle) => void
}

const FIELD_STYLES: Array<{ value: FieldStyle; label: string }> = [
    { value: "none", label: "None" },
    { value: "horizontal", label: "Horizontal" },
    { value: "vertical", label: "Vertical" },
    { value: "checkered", label: "Checkered" },
    { value: "diagonal", label: "Diagonal" },
    { value: "rings", label: "Rings" },
]

export default function FieldStyleSelector({
    currentStyle,
    onChange,
}: FieldStyleSelectorProps) {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium">Field Style</label>
            <div className="grid grid-cols-3 gap-2">
                {FIELD_STYLES.map(({ value, label }) => {
                    const isSelected = currentStyle === value
                    const pattern = generateFieldPattern(value)

                    return (
                        <button
                            key={value}
                            type="button"
                            onClick={() => onChange(value)}
                            className={`
                                relative flex flex-col items-center gap-1 p-2 rounded-md border-2 transition-all
                                ${isSelected
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-gray-300 bg-white hover:border-gray-400"
                                }
                            `}
                        >
                            {/* Visual preview */}
                            <div className="w-full aspect-[2/3] rounded overflow-hidden border border-gray-200">
                                <svg
                                    viewBox="0 0 100 150"
                                    className="w-full h-full"
                                    preserveAspectRatio="none"
                                >
                                    <defs>
                                        {pattern && (
                                            <pattern
                                                id={`preview-pattern-${value}`}
                                                patternUnits="userSpaceOnUse"
                                                width="20"
                                                height="20"
                                            >
                                                {pattern}
                                            </pattern>
                                        )}
                                    </defs>
                                    <rect
                                        width="100"
                                        height="150"
                                        fill={
                                            pattern
                                                ? `url(#preview-pattern-${value})`
                                                : "#1a7a3c"
                                        }
                                    />
                                </svg>
                            </div>

                            {/* Label */}
                            <span
                                className={`text-xs font-medium ${isSelected ? "text-blue-700" : "text-gray-700"
                                    }`}
                            >
                                {label}
                            </span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
