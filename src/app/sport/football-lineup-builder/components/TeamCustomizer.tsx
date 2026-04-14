"use client"

interface TeamCustomizerProps {
    teamName: string
    primaryColor: string
    secondaryColor: string
    onTeamNameChange: (name: string) => void
    onPrimaryColorChange: (color: string) => void
    onSecondaryColorChange: (color: string) => void
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

export default function TeamCustomizer({
    teamName,
    primaryColor,
    secondaryColor,
    onTeamNameChange,
    onPrimaryColorChange,
    onSecondaryColorChange,
}: TeamCustomizerProps) {
    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="team-name" className="block text-sm font-medium mb-2">
                    Team Name
                </label>
                <input
                    id="team-name"
                    type="text"
                    value={teamName}
                    onChange={(e) => onTeamNameChange(e.target.value)}
                    maxLength={30}
                    placeholder="Enter team name"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                    {teamName.length}/30 characters
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Primary Color</label>
                <div className="flex items-center gap-3">
                    <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => onPrimaryColorChange(e.target.value)}
                        className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                    />
                    <div className="flex flex-wrap gap-2">
                        {PRESET_COLORS.map((preset) => (
                            <button
                                key={`primary-${preset.value}`}
                                type="button"
                                onClick={() => onPrimaryColorChange(preset.value)}
                                className="h-8 w-8 rounded border-2 border-gray-300 hover:border-gray-500 transition-colors"
                                style={{ backgroundColor: preset.value }}
                                title={preset.name}
                                aria-label={`Set primary color to ${preset.name}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Secondary Color</label>
                <div className="flex items-center gap-3">
                    <input
                        type="color"
                        value={secondaryColor}
                        onChange={(e) => onSecondaryColorChange(e.target.value)}
                        className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                    />
                    <div className="flex flex-wrap gap-2">
                        {PRESET_COLORS.map((preset) => (
                            <button
                                key={`secondary-${preset.value}`}
                                type="button"
                                onClick={() => onSecondaryColorChange(preset.value)}
                                className="h-8 w-8 rounded border-2 border-gray-300 hover:border-gray-500 transition-colors"
                                style={{ backgroundColor: preset.value }}
                                title={preset.name}
                                aria-label={`Set secondary color to ${preset.name}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
