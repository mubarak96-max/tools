"use client"

import { useRef, useState, useEffect } from "react"
import { RotateCcw } from "lucide-react"
import { useLineupStore } from "../store/lineupStore"
import { FORMATIONS } from "../data/formations"
import PitchCanvas from "./PitchCanvas"
import PlayerModal from "./PlayerModal"
import FormationSelector from "./FormationSelector"
import TeamCustomizer from "./TeamCustomizer"
import ExportButton from "./ExportButton"
import FieldStyleSelector from "./FieldStyleSelector"

type MobileTab = "formation" | "players" | "field" | "background" | "header"

export default function FootballLineupBuilder() {
    const pitchRef = useRef<HTMLDivElement | null>(null)
    const [activeTab, setActiveTab] = useState<MobileTab>("formation")
    const [isMobile, setIsMobile] = useState(false)

    // Store selectors
    const formation = useLineupStore((s) => s.formation)
    const players = useLineupStore((s) => s.players)
    const teamName = useLineupStore((s) => s.teamName)
    const primaryColor = useLineupStore((s) => s.primaryColor)
    const secondaryColor = useLineupStore((s) => s.secondaryColor)
    const activePositionId = useLineupStore((s) => s.activePositionId)
    const fieldStyle = useLineupStore((s) => s.fieldStyle)
    const headerConfig = useLineupStore((s) => s.headerConfig)

    // Store actions
    const setFormation = useLineupStore((s) => s.setFormation)
    const updatePlayer = useLineupStore((s) => s.updatePlayer)
    const clearPlayer = useLineupStore((s) => s.clearPlayer)
    const setTeamName = useLineupStore((s) => s.setTeamName)
    const setPrimaryColor = useLineupStore((s) => s.setPrimaryColor)
    const setSecondaryColor = useLineupStore((s) => s.setSecondaryColor)
    const closeModal = useLineupStore((s) => s.closeModal)
    const setFieldStyle = useLineupStore((s) => s.setFieldStyle)
    const setHeaderConfig = useLineupStore((s) => s.setHeaderConfig)
    const resetCustomPositions = useLineupStore((s) => s.resetCustomPositions)

    // Detect mobile viewport
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }
        checkMobile()
        window.addEventListener("resize", checkMobile)
        return () => window.removeEventListener("resize", checkMobile)
    }, [])

    // Get active position details for modal
    const activePosition = activePositionId
        ? FORMATIONS[formation].slots.find((slot) => slot.id === activePositionId)
        : null

    // Mobile tab navigation
    const tabs: Array<{ id: MobileTab; label: string }> = [
        { id: "formation", label: "Formation" },
        { id: "players", label: "Players" },
        { id: "field", label: "Field" },
        { id: "background", label: "Background" },
        { id: "header", label: "Header" },
    ]

    return (
        <div className="w-full max-w-7xl mx-auto p-4">
            {/* Mobile Layout */}
            {isMobile ? (
                <div className="flex flex-col">
                    {/* Pitch */}
                    <div className="mb-4">
                        <PitchCanvas forwardedRef={pitchRef} />
                    </div>

                    {/* Tab Navigation - Below Lineup */}
                    <div className="bg-white border-t border-gray-200 shadow-sm mb-4">
                        <div className="flex justify-around">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 py-3 text-xs font-medium transition-colors ${activeTab === tab.id
                                        ? "text-blue-600 border-t-2 border-blue-600"
                                        : "text-gray-600 hover:text-gray-900"
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                        {activeTab === "formation" && (
                            <div>
                                <h2 className="text-lg font-bold mb-3">Formation</h2>
                                <FormationSelector
                                    currentFormation={formation}
                                    onChange={setFormation}
                                />
                            </div>
                        )}

                        {activeTab === "players" && (
                            <div className="space-y-4">
                                <h2 className="text-lg font-bold mb-3">Players</h2>
                                <button
                                    type="button"
                                    onClick={resetCustomPositions}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    Reset Positions
                                </button>
                            </div>
                        )}

                        {activeTab === "field" && (
                            <div>
                                <h2 className="text-lg font-bold mb-3">Field Style</h2>
                                <FieldStyleSelector
                                    currentStyle={fieldStyle}
                                    onChange={setFieldStyle}
                                />
                            </div>
                        )}

                        {activeTab === "background" && (
                            <div>
                                <h2 className="text-lg font-bold mb-3">Team Customization</h2>
                                <TeamCustomizer
                                    teamName={teamName}
                                    primaryColor={primaryColor}
                                    secondaryColor={secondaryColor}
                                    onTeamNameChange={setTeamName}
                                    onPrimaryColorChange={setPrimaryColor}
                                    onSecondaryColorChange={setSecondaryColor}
                                />
                            </div>
                        )}

                        {activeTab === "header" && (
                            <div className="space-y-4">
                                <h2 className="text-lg font-bold mb-3">Header</h2>

                                {/* Header visibility toggle */}
                                <div>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={headerConfig.visible}
                                            onChange={(e) =>
                                                setHeaderConfig({ visible: e.target.checked })
                                            }
                                            className="w-4 h-4 rounded border-gray-300"
                                        />
                                        <span className="text-sm font-medium">Show Header</span>
                                    </label>
                                </div>

                                {/* Header fields */}
                                {headerConfig.visible && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                Team Name
                                            </label>
                                            <input
                                                type="text"
                                                value={headerConfig.teamName}
                                                onChange={(e) =>
                                                    setHeaderConfig({
                                                        teamName: e.target.value.slice(0, 30),
                                                    })
                                                }
                                                maxLength={30}
                                                placeholder="Enter team name"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                Subtitle
                                            </label>
                                            <input
                                                type="text"
                                                value={headerConfig.subtitle}
                                                onChange={(e) =>
                                                    setHeaderConfig({
                                                        subtitle: e.target.value.slice(0, 50),
                                                    })
                                                }
                                                maxLength={50}
                                                placeholder="Enter subtitle"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                Logo
                                            </label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0]
                                                    if (!file) return

                                                    // Validate file
                                                    if (!file.type.startsWith("image/")) {
                                                        alert("Please upload an image file")
                                                        return
                                                    }
                                                    if (file.size > 2 * 1024 * 1024) {
                                                        alert("Image must be under 2MB")
                                                        return
                                                    }

                                                    // Read as data URL
                                                    const reader = new FileReader()
                                                    reader.onload = () => {
                                                        setHeaderConfig({
                                                            logoUrl: reader.result as string,
                                                        })
                                                    }
                                                    reader.readAsDataURL(file)
                                                }}
                                                className="w-full text-sm"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Export Button */}
                    <div className="mb-4">
                        <ExportButton pitchRef={pitchRef} teamName={teamName} />
                    </div>
                </div>
            ) : (
                /* Desktop Layout */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left column: Pitch */}
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold mb-4">Pitch</h2>
                        <PitchCanvas forwardedRef={pitchRef} />
                    </div>

                    {/* Right column: Controls */}
                    <div className="flex flex-col space-y-6">
                        <div>
                            <h2 className="text-xl font-bold mb-4">Formation</h2>
                            <FormationSelector
                                currentFormation={formation}
                                onChange={setFormation}
                            />
                        </div>

                        <div>
                            <h2 className="text-xl font-bold mb-4">Players</h2>
                            <div className="space-y-4">
                                <button
                                    type="button"
                                    onClick={resetCustomPositions}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    Reset Positions
                                </button>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold mb-4">Field Style</h2>
                            <FieldStyleSelector
                                currentStyle={fieldStyle}
                                onChange={setFieldStyle}
                            />
                        </div>

                        <div>
                            <h2 className="text-xl font-bold mb-4">Team Customization</h2>
                            <TeamCustomizer
                                teamName={teamName}
                                primaryColor={primaryColor}
                                secondaryColor={secondaryColor}
                                onTeamNameChange={setTeamName}
                                onPrimaryColorChange={setPrimaryColor}
                                onSecondaryColorChange={setSecondaryColor}
                            />
                        </div>

                        <div>
                            <h2 className="text-xl font-bold mb-4">Header</h2>
                            <div className="space-y-4">
                                {/* Header visibility toggle */}
                                <div>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={headerConfig.visible}
                                            onChange={(e) =>
                                                setHeaderConfig({ visible: e.target.checked })
                                            }
                                            className="w-4 h-4 rounded border-gray-300"
                                        />
                                        <span className="text-sm font-medium">Show Header</span>
                                    </label>
                                </div>

                                {/* Header fields */}
                                {headerConfig.visible && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                Team Name
                                            </label>
                                            <input
                                                type="text"
                                                value={headerConfig.teamName}
                                                onChange={(e) =>
                                                    setHeaderConfig({
                                                        teamName: e.target.value.slice(0, 30),
                                                    })
                                                }
                                                maxLength={30}
                                                placeholder="Enter team name"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                Subtitle
                                            </label>
                                            <input
                                                type="text"
                                                value={headerConfig.subtitle}
                                                onChange={(e) =>
                                                    setHeaderConfig({
                                                        subtitle: e.target.value.slice(0, 50),
                                                    })
                                                }
                                                maxLength={50}
                                                placeholder="Enter subtitle"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                Logo
                                            </label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0]
                                                    if (!file) return

                                                    // Validate file
                                                    if (!file.type.startsWith("image/")) {
                                                        alert("Please upload an image file")
                                                        return
                                                    }
                                                    if (file.size > 2 * 1024 * 1024) {
                                                        alert("Image must be under 2MB")
                                                        return
                                                    }

                                                    // Read as data URL
                                                    const reader = new FileReader()
                                                    reader.onload = () => {
                                                        setHeaderConfig({
                                                            logoUrl: reader.result as string,
                                                        })
                                                    }
                                                    reader.readAsDataURL(file)
                                                }}
                                                className="w-full text-sm"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold mb-4">Export</h2>
                            <ExportButton pitchRef={pitchRef} teamName={teamName} />
                        </div>
                    </div>
                </div>
            )}

            {/* Player Modal */}
            {activePositionId && activePosition && (
                <PlayerModal
                    positionId={activePositionId}
                    positionLabel={activePosition.fullLabel}
                    player={players[activePositionId] ?? null}
                    onSave={(data) => updatePlayer(activePositionId, data)}
                    onClear={clearPlayer}
                    onClose={closeModal}
                />
            )}
        </div>
    )
}
