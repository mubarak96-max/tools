"use client"

import { Circle } from "lucide-react"
import type { ExtendedPlayerData, DisplayMode, JerseyStyle } from "../types"

interface PlayerSlotProps {
    positionId: string
    label: string
    x: number
    y: number
    player: ExtendedPlayerData | null
    primaryColor: string
    secondaryColor: string
    displayMode: DisplayMode
    jerseyStyle: JerseyStyle
    jerseyPrimaryColor: string
    jerseySecondaryColor: string
    jerseyTextColor: string
    draggable: boolean
    onClick: (positionId: string) => void
    onDragStart: (positionId: string) => void
    onDragEnd: () => void
}

export default function PlayerSlot({
    positionId,
    label,
    x,
    y,
    player,
    primaryColor,
    secondaryColor,
    displayMode,
    jerseyStyle,
    jerseyPrimaryColor,
    jerseySecondaryColor,
    jerseyTextColor,
    draggable,
    onClick,
    onDragStart,
    onDragEnd,
}: PlayerSlotProps) {
    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.effectAllowed = "move"
        e.dataTransfer.setData("positionId", positionId)
        onDragStart(positionId)
    }

    const handleDragEnd = () => {
        onDragEnd()
    }

    const displayText = player?.jersey || label

    return (
        <div
            draggable={draggable}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onClick={() => onClick(positionId)}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 cursor-pointer hover:scale-110 transition-transform"
            style={{
                left: `${x}%`,
                top: `${y}%`,
            }}
            role="button"
            tabIndex={0}
            aria-label={`${label} position${player ? `: ${player.name || "unnamed"} #${player.jersey || "no number"}` : ": empty"}`}
        >
            {/* Card icons above player */}
            {player && player.cardType !== "none" && (
                <div className="flex gap-0.5 mb-1">
                    {player.cardType === "yellow" && (
                        <div className="w-3 h-4 bg-yellow-400 border border-yellow-600 rounded-sm" />
                    )}
                    {player.cardType === "red" && (
                        <div className="w-3 h-4 bg-red-600 border border-red-800 rounded-sm" />
                    )}
                    {player.cardType === "double-yellow" && (
                        <>
                            <div className="w-3 h-4 bg-yellow-400 border border-yellow-600 rounded-sm" />
                            <div className="w-3 h-4 bg-yellow-400 border border-yellow-600 rounded-sm" />
                        </>
                    )}
                </div>
            )}

            {/* Player slot - circle or jersey based on displayMode */}
            {displayMode === "circle" ? (
                <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg border-2 overflow-hidden"
                    style={{
                        backgroundColor: primaryColor,
                        borderColor: secondaryColor,
                    }}
                >
                    {player?.imageUrl ? (
                        <img
                            src={player.imageUrl}
                            alt={player.name || "Player"}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        displayText
                    )}
                </div>
            ) : (
                <JerseyIcon
                    style={jerseyStyle}
                    primaryColor={jerseyPrimaryColor}
                    secondaryColor={jerseySecondaryColor}
                    textColor={jerseyTextColor}
                    displayText={displayText}
                />
            )}

            {/* Player name below */}
            {player?.name && (
                <span
                    className="text-xs font-medium px-2 py-0.5 rounded whitespace-nowrap max-w-[80px] truncate"
                    style={{
                        backgroundColor: secondaryColor,
                        color: primaryColor,
                    }}
                >
                    {player.name}
                </span>
            )}

            {/* Substitute name below player name */}
            {player?.substituteName && (
                <span
                    className="text-[10px] font-normal px-1.5 py-0.5 rounded whitespace-nowrap max-w-[80px] truncate opacity-80"
                    style={{
                        backgroundColor: secondaryColor,
                        color: primaryColor,
                    }}
                >
                    ↔ {player.substituteName}
                </span>
            )}

            {/* Goal count icons below */}
            {player && player.goalCount > 0 && (
                <div className="flex gap-0.5 mt-1 flex-wrap max-w-[60px] justify-center">
                    {Array.from({ length: player.goalCount }).map((_, i) => (
                        <Circle
                            key={i}
                            className="w-3 h-3 fill-white stroke-black"
                            strokeWidth={1.5}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

// Jersey Icon Component
interface JerseyIconProps {
    style: JerseyStyle
    primaryColor: string
    secondaryColor: string
    textColor: string
    displayText: string
}

function JerseyIcon({
    style,
    primaryColor,
    secondaryColor,
    textColor,
    displayText,
}: JerseyIconProps) {
    return (
        <svg width="48" height="48" viewBox="0 0 100 100" className="drop-shadow-md">
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

            {/* Jersey number/label */}
            <text
                x="50"
                y="62"
                textAnchor="middle"
                fontSize="20"
                fontWeight="bold"
                fill={textColor}
                stroke={textColor === "#ffffff" ? "#000000" : "#ffffff"}
                strokeWidth="0.5"
            >
                {displayText}
            </text>
        </svg>
    )
}
