"use client"

import type { DisplayMode, JerseyStyle } from "../types"

interface JerseyCustomizerProps {
    displayMode: DisplayMode
    jerseyStyle: JerseyStyle
    jerseyPrimaryColor: string
    jerseySecondaryColor: string
    jerseyTextColor: string
    onDisplayModeChange: (mode: DisplayMode) => void
    onJerseyStyleChange: (style: JerseyStyle) => void
    onJerseyPrimaryColorChange: (color: string) => void
    onJerseySecondaryColorChange: (color: string) => void
    onJerseyTextColorChange: (color: string) => void
}

const PRESET_COLORS = [
    { name: "Red", value: "#e63946" },
    { name: "Blue", value: "#1d3557" },
    { name: "Green", value: "#2a9d8f" },
    { name: "Yellow", value: "#f4a261" },
    { name: "Black", value: "#000000" },
    { name: "White", value: "#ffffff" },
    { name: "Orange", value: "#ff6b35" },
    { name: "Purple", value: "#6a4c93" },
]

const JERSEY_STYLES: Array<{ value: JerseyStyle; label: string }> = [
    { value: "plain", label: "Plain" },
    { value: "vertical-stripes", label: "Vertical" },
    { value: "horizontal-stripes", label: "Horizontal" },
]

export default function JerseyCustomizer({
    displayMode,
    jerseyStyle,
    jerseyPrimaryColor,
    jerseySecondaryColor,
    jerseyTextColor,
    onDisplayModeChange,
    onJerseyStyleChange,
    onJerseyPrimaryColorChange,
    onJerseySecondaryColorChange,
    onJerseyTextColorChange,
}: JerseyCustomizerProps) {
    return (
        <div className="space-y-4">
            {/* Display Mode Toggle */}
            <div>
                <label className="block text-sm font-medium mb-2">Display Mode</label>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => onDisplayModeChange("circle")}
                        className={`
                            flex-1 px-4 py-2 rounded-md border-2 text-sm font-medium transition-all
                            ${displayMode === "circle"
                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                            }
                        `}
                    >
                        Circle
                    </button>
                    <button
                        type="button"
                        onClick={() => onDisplayModeChange("jersey")}
                        className={`
                            flex-1 px-4 py-2 rounded-md border-2 text-sm font-medium transition-all
                            ${displayMode === "jersey"
                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                            }
                        `}
                    >
                        Jersey
                    </button>
                </div>
            </div>

            {/* Jersey Style Selector - Only show when jersey mode is active */}
            {displayMode === "jersey" && (
                <>
                    <div>
                        <label className="block text-sm font-medium mb-2">Jersey Style</label>
                        <div className="grid grid-cols-3 gap-2">
                            {JERSEY_STYLES.map(({ value, label }) => {
                                const isSelected = jerseyStyle === value
                                return (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => onJerseyStyleChange(value)}
                                        className={`
                                            px-3 py-2 rounded-md border-2 text-sm font-medium transition-all
                                            ${isSelected
                                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                                : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                                            }
                                        `}
                                    >
                                        {label}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Jersey Primary Color */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Jersey Primary Color</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={jerseyPrimaryColor}
                                onChange={(e) => onJerseyPrimaryColorChange(e.target.value)}
                                className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                            />
                            <div className="flex flex-wrap gap-2">
                                {PRESET_COLORS.map((preset) => (
                                    <button
                                        key={`jersey-primary-${preset.value}`}
                                        type="button"
                                        onClick={() => onJerseyPrimaryColorChange(preset.value)}
                                        className="h-8 w-8 rounded border-2 border-gray-300 hover:border-gray-500 transition-colors"
                                        style={{ backgroundColor: preset.value }}
                                        title={preset.name}
                                        aria-label={`Set jersey primary color to ${preset.name}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Jersey Secondary Color */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Jersey Secondary Color</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={jerseySecondaryColor}
                                onChange={(e) => onJerseySecondaryColorChange(e.target.value)}
                                className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                            />
                            <div className="flex flex-wrap gap-2">
                                {PRESET_COLORS.map((preset) => (
                                    <button
                                        key={`jersey-secondary-${preset.value}`}
                                        type="button"
                                        onClick={() => onJerseySecondaryColorChange(preset.value)}
                                        className="h-8 w-8 rounded border-2 border-gray-300 hover:border-gray-500 transition-colors"
                                        style={{ backgroundColor: preset.value }}
                                        title={preset.name}
                                        aria-label={`Set jersey secondary color to ${preset.name}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Jersey Text Color */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Jersey Text Color</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={jerseyTextColor}
                                onChange={(e) => onJerseyTextColorChange(e.target.value)}
                                className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                            />
                            <div className="flex flex-wrap gap-2">
                                {PRESET_COLORS.map((preset) => (
                                    <button
                                        key={`jersey-text-${preset.value}`}
                                        type="button"
                                        onClick={() => onJerseyTextColorChange(preset.value)}
                                        className="h-8 w-8 rounded border-2 border-gray-300 hover:border-gray-500 transition-colors"
                                        style={{ backgroundColor: preset.value }}
                                        title={preset.name}
                                        aria-label={`Set jersey text color to ${preset.name}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Visual Preview */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Preview</label>
                        <div className="flex justify-center p-4 bg-gray-50 rounded-md border border-gray-200">
                            <JerseyPreview
                                style={jerseyStyle}
                                primaryColor={jerseyPrimaryColor}
                                secondaryColor={jerseySecondaryColor}
                                textColor={jerseyTextColor}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

// Jersey Preview Component
interface JerseyPreviewProps {
    style: JerseyStyle
    primaryColor: string
    secondaryColor: string
    textColor: string
}

function JerseyPreview({
    style,
    primaryColor,
    secondaryColor,
    textColor,
}: JerseyPreviewProps) {
    return (
        <svg width="80" height="80" viewBox="0 0 100 100">
            {/* Jersey body based on style */}
            {style === "plain" && (
                <>
                    {/* Short sleeves */}
                    <path d="M 30 30 Q 20 32 18 42 L 22 45 Q 24 35 30 35 Z" fill={secondaryColor} />
                    <path d="M 70 30 Q 80 32 82 42 L 78 45 Q 76 35 70 35 Z" fill={secondaryColor} />
                    {/* Main body - rounded rectangle */}
                    <path d="M 30 30 L 70 30 L 70 85 Q 70 90 65 90 L 35 90 Q 30 90 30 85 Z" fill={primaryColor} />
                    {/* Round neck collar */}
                    <path d="M 42 30 Q 42 25 50 25 Q 58 25 58 30" fill={secondaryColor} stroke={secondaryColor} strokeWidth="1.5" />
                </>
            )}

            {style === "vertical-stripes" && (
                <>
                    {/* Short sleeves */}
                    <path d="M 30 30 Q 20 32 18 42 L 22 45 Q 24 35 30 35 Z" fill={secondaryColor} />
                    <path d="M 70 30 Q 80 32 82 42 L 78 45 Q 76 35 70 35 Z" fill={secondaryColor} />
                    {/* Main body */}
                    <path d="M 30 30 L 70 30 L 70 85 Q 70 90 65 90 L 35 90 Q 30 90 30 85 Z" fill={primaryColor} />
                    {/* Vertical stripes */}
                    <rect x="37" y="30" width="5" height="60" fill={secondaryColor} />
                    <rect x="48" y="30" width="4" height="60" fill={secondaryColor} />
                    <rect x="58" y="30" width="5" height="60" fill={secondaryColor} />
                    {/* Round neck collar */}
                    <path d="M 42 30 Q 42 25 50 25 Q 58 25 58 30" fill={primaryColor} stroke={primaryColor} strokeWidth="1.5" />
                </>
            )}

            {style === "horizontal-stripes" && (
                <>
                    {/* Short sleeves */}
                    <path d="M 30 30 Q 20 32 18 42 L 22 45 Q 24 35 30 35 Z" fill={secondaryColor} />
                    <path d="M 70 30 Q 80 32 82 42 L 78 45 Q 76 35 70 35 Z" fill={secondaryColor} />
                    {/* Main body */}
                    <path d="M 30 30 L 70 30 L 70 85 Q 70 90 65 90 L 35 90 Q 30 90 30 85 Z" fill={primaryColor} />
                    {/* Horizontal stripes */}
                    <rect x="30" y="42" width="40" height="6" fill={secondaryColor} />
                    <rect x="30" y="56" width="40" height="6" fill={secondaryColor} />
                    <rect x="30" y="70" width="40" height="6" fill={secondaryColor} />
                    {/* Round neck collar */}
                    <path d="M 42 30 Q 42 25 50 25 Q 58 25 58 30" fill={primaryColor} stroke={primaryColor} strokeWidth="1.5" />
                </>
            )}

            {/* Jersey number */}
            <text
                x="50"
                y="60"
                textAnchor="middle"
                fontSize="20"
                fontWeight="bold"
                fill={textColor}
                stroke={textColor === "#ffffff" ? "#000000" : "#ffffff"}
                strokeWidth="0.5"
            >
                10
            </text>
        </svg>
    )
}
